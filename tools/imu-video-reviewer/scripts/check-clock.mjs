import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { recognizeClock } from '../clock-ocr.mjs';
import '../clock-sync.js';
const {parseTimestamp,fitClock,hasSamples}=globalThis.ClockSync;
assert.equal(parseTimestamp('2026-09-03 23:29:40').ms, Date.parse('2026-09-03T23:29:40+08:00'));
assert.equal(parseTimestamp('2026-09-03 23029:40').ms, Date.parse('2026-09-03T23:29:40+08:00'));
assert.equal(parseTimestamp('2026-02-30 23:29:40'),null);
assert.equal(parseTimestamp('23:29:40'),null);
const epoch=Date.parse('2026-09-03T23:59:50+08:00');
const samples=[0,20,50].map(videoSeconds=>({videoSeconds,ms:epoch+videoSeconds*1000}));
assert.equal(fitClock(samples).offsetMs,epoch+500);
assert.throws(()=>fitClock([samples[0],samples[1],{videoSeconds:50,ms:epoch+55000}]));
assert.equal(hasSamples([{t:0},{t:20}],5,15),false);
assert.equal(hasSamples([{t:0},{t:20}],15,25),true);
console.log('Date, timezone, midnight, inconsistent clocks, IMU gaps: passed');
if(process.argv[2]) {
  const file=process.argv[2], ffmpeg=process.argv[3];
  await mkdir('.local-data/clock-check',{recursive:true}); const results=[];
  for(const seconds of [2,9170.772322,18339.544644]) {
    const path=`.local-data/clock-check/frame-${seconds}-${Date.now()}.png`;
    const result=spawnSync(ffmpeg,['-v','error','-ss',String(seconds),'-i',file,'-vf','crop=416:65:0:0,scale=1664:260:flags=neighbor','-frames:v','1','-n',path],{encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    const recognized=await recognizeClock(await readFile(path)); results.push({...recognized,videoSeconds:seconds});console.log(results.at(-1));
  }
  console.log(fitClock(results));
}
