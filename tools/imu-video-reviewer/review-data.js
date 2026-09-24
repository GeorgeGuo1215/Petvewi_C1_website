(function (root) {
  'use strict';
  function parseCsv(text) {
    text = String(text).replace(/^\uFEFF/, '');
    const rows = []; let row = [], field = '', quoted = false, closed = false;
    const pushField = () => { row.push(field); field = ''; closed = false; };
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') { quoted = false; closed = true; }
        else field += c;
      } else if (c === ',') pushField();
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        pushField(); rows.push(row); row = [];
      } else if (c === '"' && !field && !closed) quoted = true;
      else {
        if (closed || c === '"') throw new Error('CSV 引号格式不正确');
        field += c;
      }
    }
    if (quoted) throw new Error('CSV 引号未闭合');
    if (field || row.length || closed) { pushField(); rows.push(row); }
    return rows;
  }
  function numeric(value) {
    return value == null || String(value).trim() === '' ? NaN : Number(value);
  }
  function validateRange(start, end) {
    if (!Number.isFinite(numeric(start)) || !Number.isFinite(numeric(end)) || Number(start) < 0 || Number(end) <= Number(start)) {
      throw new Error('开始、结束时间必须为有效秒数，且 0 ≤ 开始 < 结束');
    }
  }
  function readLabels(text) {
    const rows = parseCsv(text), headers = rows.shift()?.map(h => h.trim()) || [];
    if (headers.some(h => !h) || new Set(headers).size !== headers.length) throw new Error('CSV 列名为空或重复');
    if (!['start_seconds', 'end_seconds'].every(h => headers.includes(h))) throw new Error('需要 start_seconds 与 end_seconds 字段');
    const labels = rows.filter(r => r.some(v => v.trim())).map((r, i) => {
      if (r.length !== headers.length) throw new Error(`第 ${i + 2} 行列数与表头不一致`);
      const row = Object.fromEntries(headers.map((h, j) => [h, r[j]]));
      try { validateRange(row.start_seconds, row.end_seconds); } catch (e) { throw new Error(`第 ${i + 2} 行：${e.message}`); }
      return row;
    });
    if (!labels.length) throw new Error('CSV 没有标签数据');
    const ids = new Set();
    for (const row of labels) {
      row.segment_id = row.segment_id?.trim() || '';
      if (row.segment_id && ids.has(row.segment_id)) throw new Error(`片段 ID 重复：${row.segment_id}`);
      if (row.segment_id) ids.add(row.segment_id);
    }
    let next = 1;
    for (const row of labels) if (!row.segment_id) {
      let id; do { id = `segment_${String(next++).padStart(4, '0')}`; } while (ids.has(id));
      row.segment_id = id; ids.add(id);
    }
    // Keep the original row order and extra columns for lossless CSV review.
    return { headers, labels };
  }
  function csvCell(value) {
    const s = String(value ?? '');
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }
  function serializeLabels(headers, labels) {
    return '\uFEFF' + [headers, ...labels.map(row => headers.map(h => row[h] ?? ''))].map(row => row.map(csvCell).join(',')).join('\r\n');
  }
  function parseImuTime(value) {
    if (!value) return NaN;
    let s = String(value).trim().replace(/^(\d{4}-\d{2}-\d{2}) /, '$1T');
    // The input contract is Beijing time. Never depend on the viewer's timezone.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(s)) s += '+08:00';
    return Date.parse(s);
  }
  function formatCsvTime(seconds) {
    const ticks = Math.round(Math.max(0, seconds) * 1000);
    const h = Math.floor(ticks / 3600000), m = Math.floor(ticks / 60000) % 60;
    const s = (ticks % 60000 / 1000).toFixed(3).padStart(6, '0');
    return `${h ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${s}`;
  }
  root.ReviewData = { parseCsv, numeric, validateRange, readLabels, serializeLabels, parseImuTime, formatCsvTime };
})(globalThis);
