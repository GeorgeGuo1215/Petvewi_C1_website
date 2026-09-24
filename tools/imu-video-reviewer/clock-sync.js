(function(root) {
  'use strict';
  function parseTimestamp(text) {
    // Full date is required; never infer a day from a time-only watermark.
    // Outlined camera colons are often recognized as 0/8. Correct only their
    // fixed positions in an eight-character HH:MM:SS field after a full date.
    const normalized = String(text).replace(/[：]/g, ':').replace(/(20\d{2}\s*[-/.]\s*\d{1,2}\s*[-/.]\s*\d{1,2}\s+)(\d{2})[:oO08](\d{2})[:oO08](\d{2})\b/g, '$1$2:$3:$4');
    const match = normalized.match(/(20\d{2})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{1,2})\s+(\d{1,2})\s*:\s*(\d{2})\s*:\s*(\d{2})/);
    if (!match) return null;
    const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) return null;
    const utc = Date.UTC(year, month - 1, day, hour, minute, second);
    const d = new Date(utc);
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
    return { ms: utc - 8 * 3600e3, text: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')} ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}` };
  }
  function fitClock(samples) {
    if (samples.length < 3) throw new Error('至少需要 3 帧有效时间才能自动对齐，请调整画面或手动设置锚点。');
    const sorted = [...samples].sort((a,b) => a.videoSeconds - b.videoSeconds);
    for (let i=0; i<sorted.length; i++) {
      if (!Number.isFinite(sorted[i].videoSeconds) || !Number.isFinite(sorted[i].ms)) throw new Error('时间识别结果无效');
      if (i && sorted[i].videoSeconds <= sorted[i-1].videoSeconds) throw new Error('采样时刻必须不同');
      if (i && sorted[i].ms <= sorted[i-1].ms) throw new Error('水印时间未递增，可能为定格画面或时间戳跳变，请手动核对。');
    }
    const offsets = sorted.map(s => s.ms - s.videoSeconds * 1000).sort((a,b)=>a-b);
    const spread = offsets.at(-1) - offsets[0];
    if (spread > 1500) throw new Error('多帧时间不一致，可能存在录像断点、时钟漂移或识别错误；未自动应用，请手动核对。');
    // The watermark only resolves seconds; take the middle of its one-second interval.
    const offsetMs = offsets[Math.floor(offsets.length/2)] + 500;
    return { offsetMs, spreadMs: spread, uncertaintyMs: 1000, samples: sorted };
  }
  function lowerBound(rows, time) { let lo=0, hi=rows.length; while(lo<hi) { const m=(lo+hi)>>>1; if(rows[m].t < time) lo=m+1; else hi=m; } return lo; }
  function hasSamples(rows, start, end) { const i=lowerBound(rows,start); return i<rows.length && rows[i].t<=end; }
  root.ClockSync = { parseTimestamp, fitClock, lowerBound, hasSamples };
})(globalThis);
