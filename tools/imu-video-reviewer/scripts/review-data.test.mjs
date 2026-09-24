import test from 'node:test';
import assert from 'node:assert/strict';
import '../review-data.js';
import '../clock-sync.js';
const { parseCsv, numeric, readLabels, serializeLabels, parseImuTime, formatCsvTime, validateRange } = globalThis.ReviewData;

test('CSV round trip preserves Chinese, commas, quotes, multiline notes and extra columns', () => {
  const headers = ['segment_id','start_seconds','end_seconds','label_zh','notes','custom'];
  const labels = [{segment_id:'a',start_seconds:'0',end_seconds:'1.125',label_zh:'行走',notes:'a,"b"\n下一行',custom:'=original'}];
  assert.deepEqual(readLabels(serializeLabels(headers,labels)), {headers,labels});
});
test('CSV handles BOM, CRLF, escaped empty fields; rejects malformed quotes', () => {
  assert.deepEqual(parseCsv('\uFEFFa,b\r\n"","x"\r\n'), [['a','b'],['','x']]);
  for (const text of ['a,"b','a,b"c','a,"b"x']) assert.throws(()=>parseCsv(text));
});
test('interval-only labels are valid without IMU or per-frame rows', () => {
  const {labels}=readLabels('start_seconds,end_seconds,label_zh\n0,10,睡觉\n20,40,行走');
  assert.equal(labels.length,2); assert.equal(labels[1].start_seconds,'20');
});
test('invalid, empty, negative, reversed and nonfinite ranges rejected', () => {
  for (const range of [['',1],[-1,1],[1,1],[2,1],['NaN',2],[0,'Infinity']]) assert.throws(()=>validateRange(...range));
  validateRange('0','0.001');
});
test('duplicate IDs, headers and mismatched rows rejected', () => {
  assert.throws(()=>readLabels('segment_id,start_seconds,end_seconds\na,0,1\na,1,2'));
  assert.throws(()=>readLabels('start_seconds,end_seconds,end_seconds\n0,1,2'));
  assert.throws(()=>readLabels('start_seconds,end_seconds\n0,1,2'));
  assert.throws(()=>readLabels('start_seconds,end_seconds\n'));
});
test('generated IDs avoid existing IDs and original order is retained', () => {
  const {labels}=readLabels('segment_id,start_seconds,end_seconds\n,10,20\nsegment_0001,0,10');
  assert.equal(labels[0].segment_id,'segment_0002'); assert.equal(labels[1].segment_id,'segment_0001');
});
test('missing sensor readings stay missing, not zero', () => {
  assert.ok(Number.isNaN(numeric(''))); assert.ok(Number.isNaN(numeric(undefined))); assert.equal(numeric('0'),0);
});
test('naive IMU timestamps are Beijing time regardless of system timezone', () => {
  assert.equal(parseImuTime('2026-09-03 15:35:15.098'),Date.parse('2026-09-03T07:35:15.098Z'));
  assert.equal(parseImuTime('2026-09-03T15:35:15.098+08:00'),parseImuTime('2026-09-03 15:35:15.098'));
});
test('formatted timestamps preserve milliseconds and carry minute/hour rounding', () => {
  assert.equal(formatCsvTime(59.9996),'01:00.000');
  assert.equal(formatCsvTime(3599.9996),'01:00:00.000');
  assert.equal(formatCsvTime(10.125),'00:10.125');
});
test('alignment crosses midnight and rejects drift or frozen clock', () => {
  const {fitClock,parseTimestamp,hasSamples}=globalThis.ClockSync;
  const start=parseTimestamp('2026-09-03 23:59:50').ms;
  const samples=[0,20,50].map(videoSeconds=>({videoSeconds,ms:start+videoSeconds*1000}));
  assert.equal(fitClock(samples).offsetMs,start+500);
  assert.throws(()=>fitClock(samples.map(s=>({...s,ms:start}))));
  assert.throws(()=>fitClock([samples[0],samples[1],{videoSeconds:50,ms:start+55000}])) ;
  assert.equal(hasSamples([{t:0},{t:20}],5,15),false);
});
