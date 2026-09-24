import { spawn } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import './clock-sync.js';
const root = fileURLToPath(new URL('.', import.meta.url));
const source = join(root, 'scripts', 'clock-ocr.swift');
const binary = join(root, '.local-tools', 'clock-ocr');
let compiling;
let active = false;
function run(cmd, args, input, timeout = 45000) {
  return new Promise((resolve, reject) => {
    const child=spawn(cmd,args,{windowsHide:true}); let out='',error='';
    const timer=setTimeout(()=>{ child.kill('SIGKILL'); reject(new Error('时间识别超时，请重试')); },timeout);
    child.stdout.on('data',c=>out+=c); child.stderr.on('data',c=>error+=c);
    child.stdin.on('error',()=>{});
    child.on('error',err=>{clearTimeout(timer);reject(err);});
    child.on('close',code=>{clearTimeout(timer);code===0?resolve(out):reject(new Error(error.slice(-1000)||'OCR 引擎未成功运行'));});
    child.stdin.end(input);
  });
}
async function prepare() {
  if(process.platform!=='darwin') throw new Error('当前自动识别使用 macOS 本地文字识别；其他系统请使用手动时间锚点。');
  await mkdir(join(root,'.local-tools'),{recursive:true});
  try { if((await stat(binary)).mtimeMs >= (await stat(source)).mtimeMs) return; } catch {}
  await run('/usr/bin/xcrun',['swiftc','-O','-module-cache-path',join(root,'.local-tools','swift-cache'),source,'-o',binary],undefined,120000);
}
export async function recognizeClock(png) {
  if(active) throw new Error('正在识别其他帧，请稍后再试');
  active=true;
  try {
    if(!compiling) compiling=prepare().catch(err=>{compiling=null;throw err;});
    await compiling;
    const result=JSON.parse(await run(binary,[],png));
    const lines=result.lines.filter(l=>l.confidence>=0.35);
    const candidates=[...lines,{text:lines.map(l=>l.text).join(' '),confidence:Math.min(...lines.map(l=>l.confidence))}].map(l=>({...globalThis.ClockSync.parseTimestamp(l.text),confidence:l.confidence})).filter(c=>Number.isFinite(c.ms));
    const values = [...new Set(candidates.map(c=>c.ms))];
    if(values.length!==1) throw new Error(values.length ? '画面中识别到多个不同时间，请手动设置锚点。' : '未识别到完整日期时间，请确认左上角水印清晰且包含年月日。');
    return {...candidates[0], timezone:'Asia/Shanghai'};
  } finally { active=false; }
}
