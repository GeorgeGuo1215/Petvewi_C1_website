// Integration smoke check against an already running local server.
// Usage: node scripts/check-repair.mjs /absolute/path/video.mp4
import assert from 'node:assert/strict';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
const base = process.env.TEST_URL || 'http://127.0.0.1:8080';
const input = process.argv[2];
if (!input) throw new Error('Pass a test video path');
const cap = await (await fetch(`${base}/api/repair-capabilities`)).json();
assert.equal(cap.available, true);
assert.equal((await fetch(`${base}/api/repairs`, { method: 'POST', body: 'blocked' })).status, 403);
assert.equal((await fetch(`${base}/api/repair-capabilities`, { headers: { Origin: 'https://example.com' } })).status, 403);
assert.equal((await fetch(`${base}/.git/config`)).status, 404);
const response = await fetch(`${base}/api/repairs`, { method: 'POST', headers: { 'X-Repair-Token': cap.token, 'Content-Length': String((await stat(input)).size) }, body: createReadStream(input), duplex: 'half' });
assert.equal(response.status, 202);
let job = await response.json();
console.log('job', job.id);
for (let n = 0; n < 600; n++) {
  job = await (await fetch(`${base}/api/repairs/${job.id}`)).json();
  if (['succeeded', 'failed', 'cancelled'].includes(job.status)) break;
  if (n % 10 === 0) console.log(job.status, job.mode, job.seconds);
  await new Promise(resolve => setTimeout(resolve, 1000));
}
assert.equal(job.status, 'succeeded', JSON.stringify(job));
const video = await fetch(`${base}${job.url}`, { headers: { Range: 'bytes=0-31' } });
assert.equal(video.status, 206);
const bytes = Buffer.from(await video.arrayBuffer());
assert.equal(bytes.length, 32); assert.equal(bytes.toString('ascii', 4, 8), 'ftyp');
const invalid = await fetch(`${base}${job.url}`, { headers: { Range: 'bytes=9999999999999-' } });
assert.equal(invalid.status, 416);
console.log(JSON.stringify({ ...job, checks: 'upload, repair, MP4 signature, range seek, invalid range, same-origin guard, private file guard passed' }));
