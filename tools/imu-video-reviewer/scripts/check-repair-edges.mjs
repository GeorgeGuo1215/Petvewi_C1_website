import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
const ffmpeg = process.argv[2];
if (!ffmpeg) throw new Error('Pass FFmpeg executable path');
const base = process.env.TEST_URL || 'http://127.0.0.1:8080';
await mkdir('.local-data/test-fixtures', { recursive: true });
const input = `.local-data/test-fixtures/edge-${Date.now()}.mpg`;
const generated = spawnSync(ffmpeg, ['-v','error','-f','lavfi','-i','testsrc2=size=640x360:rate=25','-t','20','-c:v','mpeg2video','-f','mpeg','-n',input], { encoding: 'utf8' });
assert.equal(generated.status, 0, generated.stderr);
const cap = await (await fetch(`${base}/api/repair-capabilities`)).json();
const headers = { 'X-Repair-Token': cap.token };
async function upload(body, size) {
  const response = await fetch(`${base}/api/repairs`, {method:'POST', headers: size ? {...headers,'Content-Length':String(size)} : headers, body, duplex:'half'});
  assert.equal(response.status, 202); return response.json();
}
async function wait(job) {
  for(let n=0;n<120;n++) {
    job=await (await fetch(`${base}/api/repairs/${job.id}`)).json();
    if(['succeeded','cancelled','failed'].includes(job.status)) return job;
    await new Promise(r=>setTimeout(r,250));
  }
  throw new Error('Timeout');
}
let job=await wait(await upload(createReadStream(input),(await stat(input)).size));
assert.equal(job.status,'succeeded'); assert.equal(job.mode,'copy');
let response=await fetch(`${base}/api/repairs/${job.id}/h264`,{method:'POST',headers});
assert.equal(response.status,202); job=await wait(await response.json());
assert.equal(job.status,'succeeded'); assert.equal(job.mode,'h264');
// Read the generated output locally and decode representative frames.
const decoded=spawnSync(ffmpeg,['-v','error','-i',`.local-data/repairs/${job.id}/h264.mp4`,'-frames:v','10','-f','null','-'],{encoding:'utf8'});
assert.equal(decoded.status,0,decoded.stderr);
console.log('H.264 conversion and frame decoding passed');
job=await wait(await upload(createReadStream(input),(await stat(input)).size));
response=await fetch(`${base}/api/repairs/${job.id}/h264`,{method:'POST',headers}); assert.equal(response.status,202);
await fetch(`${base}/api/repairs/${job.id}/cancel`,{method:'POST',headers});
assert.equal((await wait(job)).status,'cancelled');
console.log('Cancellation passed');
job=await wait(await upload('not a video'));
assert.equal(job.status,'failed'); assert.equal(job.mode,'h264');
console.log('Invalid video fallback and failure passed');
