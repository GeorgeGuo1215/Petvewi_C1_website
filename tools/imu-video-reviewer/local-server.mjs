import { createServer } from 'node:http';
import { readFile, stat, mkdir, readdir, rename } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { recognizeClock } from './clock-ocr.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 8080);
const dataRoot = join(root, '.local-data', 'repairs');
const token = randomUUID();
const jobs = new Map();
const limit = 8 * 1024 ** 3;
const publicFiles = new Map([['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/styles.css', ['styles.css', 'text/css']]]);
publicFiles.set('/clock-sync.js', ['clock-sync.js', 'text/javascript']);
publicFiles.set('/review-data.js', ['review-data.js', 'text/javascript']);

async function findFfmpeg() {
  const bundled = join(root, '.local-tools', 'imageio_ffmpeg', 'binaries');
  const candidates = [process.env.FFMPEG_PATH, 'ffmpeg', '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'];
  try { candidates.push(...(await readdir(bundled)).filter(n => /^ffmpeg-/.test(n)).map(n => join(bundled, n))); } catch {}
  for (const executable of candidates.filter(Boolean)) {
    const ok = await new Promise(resolve => {
      const child = spawn(executable, ['-version'], { stdio: 'ignore', windowsHide: true });
      const timer = setTimeout(() => child.kill(), 3000);
      child.once('error', () => { clearTimeout(timer); resolve(false); });
      child.once('close', code => { clearTimeout(timer); resolve(code === 0); });
    });
    if (ok) return executable;
  }
  return null;
}
const ffmpeg = await findFfmpeg();
const active = () => [...jobs.values()].some(j => ['uploading', 'running', 'cancelling'].includes(j.status));
const json = (res, code, value) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
const snapshot = j => ({ id: j.id, status: j.status, mode: j.mode, seconds: j.seconds, error: j.error, url: j.status === 'succeeded' ? `/api/repairs/${j.id}/video` : null });

async function convert(job, mode) {
  job.mode = mode; job.status = 'running'; job.seconds = 0; job.error = null;
  const partial = join(job.dir, `${mode}.partial.mp4`);
  const args = ['-hide_banner', '-nostdin', '-n', '-loglevel', 'warning', '-progress', 'pipe:1', '-nostats', '-fflags', '+genpts', '-protocol_whitelist', 'file,pipe', '-i', join(job.dir, 'input.video'), '-map', '0:v:0'];
  args.push(...(mode === 'copy' ? ['-c:v', 'copy'] : ['-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-threads', '2', '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2', '-pix_fmt', 'yuv420p', '-tag:v', 'avc1']));
  args.push('-an', '-sn', '-dn', '-avoid_negative_ts', 'make_zero', '-movflags', '+faststart', '-f', 'mp4', partial);
  const log = createWriteStream(join(job.dir, `${mode}.log`), { flags: 'wx' }); log.on('error', () => {});
  let pending = '';
  const code = await new Promise(resolve => {
    const child = spawn(ffmpeg, args, { windowsHide: true }); job.child = child;
    child.stdout.on('data', chunk => {
      pending += chunk.toString(); const lines = pending.split('\n'); pending = lines.pop();
      for (const line of lines) if (line.startsWith('out_time_us=')) { const n = Number(line.slice(12)); if (Number.isFinite(n)) job.seconds = Math.max(0, n / 1e6); }
    });
    child.stderr.pipe(log);
    child.once('error', err => { job.error = err.message; resolve(-1); });
    child.once('close', resolve);
  });
  job.child = null; log.end();
  if (job.status === 'cancelling') { job.status = 'cancelled'; return; }
  if (code !== 0) {
    if (mode === 'copy') return convert(job, 'h264');
    job.status = 'failed'; job.error = '视频转码失败，文件可能损坏或缺少有效视频流。详情见 .local-data/repairs 中的日志。'; return;
  }
  await rename(partial, join(job.dir, `${mode}.mp4`)); job.status = 'succeeded';
}
function startConversion(job, mode) { convert(job, mode).catch(err => { job.status = 'failed'; job.error = err.message; }); }

async function serveVideo(req, res, path) {
  const { size } = await stat(path);
  const headers = { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
  let start = 0, end = size - 1, status = 200;
  if (req.headers.range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (!match || (!match[1] && !match[2])) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); res.end(); return; }
    if (match[1]) { start = Number(match[1]); if (match[2]) end = Math.min(end, Number(match[2])); }
    else start = Math.max(0, size - Number(match[2]));
    if (start > end || start >= size || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); res.end(); return; }
    status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length'] = end - start + 1; res.writeHead(status, headers);
  if (req.method === 'HEAD') { res.end(); return; }
  const stream = createReadStream(path, { start, end });
  res.on('close', () => stream.destroy()); stream.on('error', () => res.destroy()); stream.pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const authority = req.headers.host;
    if (![ `127.0.0.1:${port}`, `localhost:${port}` ].includes(authority)) return json(res, 403, { error: '仅支持本机访问' });
    if (req.headers.origin && req.headers.origin !== `http://${authority}`) return json(res, 403, { error: '不允许跨站访问' });
    if (req.headers['sec-fetch-site'] === 'cross-site') return json(res, 403, { error: '不允许跨站访问' });
    const url = new URL(req.url, `http://${authority}`);
    if (req.method === 'GET' && url.pathname === '/api/repair-capabilities') return json(res, 200, { service: 'imu-video-reviewer', available: Boolean(ffmpeg), ocr: process.platform === 'darwin', token, maxBytes: limit });
    if (req.method === 'POST' && req.headers['x-repair-token'] !== token) return json(res, 403, { error: '请刷新页面后重试' });
    if (req.method === 'POST' && url.pathname === '/api/clock-ocr') {
      const chunks=[]; let total=0;
      for await (const chunk of req) { total+=chunk.length; if(total>4*1024*1024) return json(res,413,{error:'截图超过 4 MB'}); chunks.push(chunk); }
      const data=Buffer.concat(chunks);
      if(data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') return json(res,400,{error:'请提供 PNG 视频截图'});
      try { return json(res,200,await recognizeClock(data)); } catch(err) { return json(res,422,{error:err.message}); }
    }
    if (req.method === 'POST' && url.pathname === '/api/repairs') {
      if (!ffmpeg) return json(res, 503, { error: '未找到 FFmpeg。请安装 FFmpeg 或配置 FFMPEG_PATH 后重启本地服务。' });
      if (active()) return json(res, 409, { error: '已有视频正在处理，请等待或取消该任务。' });
      if (Number(req.headers['content-length']) > limit) return json(res, 413, { error: '视频不能超过 8 GB' });
      const id = randomUUID(), dir = join(dataRoot, id);
      const job = { id, dir, status: 'uploading', mode: 'copy', seconds: 0 }; jobs.set(id, job);
      try {
        await mkdir(dir, { recursive: true }); let bytes = 0;
        const guard = new Transform({ transform(chunk, enc, done) { bytes += chunk.length; done(bytes > limit ? new Error('视频不能超过 8 GB') : null, chunk); } });
        await pipeline(req, guard, createWriteStream(join(dir, 'input.video'), { flags: 'wx' }));
        if (!bytes) throw new Error('视频文件为空');
        startConversion(job, 'copy'); json(res, 202, snapshot(job));
      } catch (err) { job.status = 'failed'; job.error = err.message; if (!res.destroyed) json(res, 400, snapshot(job)); }
      return;
    }
    const route = /^\/api\/repairs\/([a-f0-9-]+)(?:\/(video|h264|cancel))?$/.exec(url.pathname);
    if (route) {
      let job = jobs.get(route[1]);
      if (!job && /^[a-f0-9]{8}-[a-f0-9-]{27}$/.test(route[1])) {
        const dir=join(dataRoot,route[1]);
        for(const mode of ['h264','copy']) { try { if((await stat(join(dir,`${mode}.mp4`))).size>0) { job={id:route[1],dir,mode,status:'succeeded',seconds:0};jobs.set(job.id,job);break; } } catch {} }
      }
      if (!job) return json(res, 404, { error: '任务不存在，请重新导入视频' });
      const action = route[2];
      if (req.method === 'GET' && !action) return json(res, 200, snapshot(job));
      if (['GET', 'HEAD'].includes(req.method) && action === 'video' && job.status === 'succeeded') return await serveVideo(req, res, join(job.dir, `${job.mode}.mp4`));
      if (req.method === 'POST' && action === 'cancel') {
        if (job.status === 'running' && job.child) {
          job.status = 'cancelling'; const child = job.child; child.kill('SIGTERM');
          const timer = setTimeout(() => { if (job.child === child) child.kill('SIGKILL'); }, 3000); timer.unref();
        }
        return json(res, 200, snapshot(job));
      }
      if (req.method === 'POST' && action === 'h264' && job.status === 'succeeded' && job.mode === 'copy') {
        if (active()) return json(res, 409, { error: '已有视频正在处理' });
        startConversion(job, 'h264'); return json(res, 202, snapshot(job));
      }
      return json(res, 409, { error: '当前任务不支持此操作' });
    }
    if (['GET', 'HEAD'].includes(req.method) && publicFiles.has(url.pathname)) {
      const [name, type] = publicFiles.get(url.pathname); const body = await readFile(join(root, name));
      res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Content-Length': body.length, 'Cache-Control': 'no-store' });
      return res.end(req.method === 'HEAD' ? undefined : body);
    }
    json(res, 404, { error: 'Not Found' });
  } catch (err) { if (!res.headersSent) json(res, 500, { error: err.message }); else res.destroy(); }
});
server.listen(port, '127.0.0.1', () => {
  console.log(`同帧审阅工具已启动：http://127.0.0.1:${port}`);
  console.log(`自动视频修复：${ffmpeg ? '可用' : '未找到 FFmpeg，请安装或设置 FFMPEG_PATH'}`);
});
function shutdown() { for (const job of jobs.values()) if (job.child) { job.status = 'cancelling'; job.child.kill('SIGTERM'); } server.close(); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
