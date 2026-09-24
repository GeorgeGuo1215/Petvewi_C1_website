(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const refs = Object.fromEntries([
    "video","videoInput","imuInput","labelInput","videoName","imuName","labelName","videoState","imuState","labelState",
    "videoDrop","imuDrop","labelDrop","videoPickBtn","videoError","frameBadge","videoLabel","playBtn","prevFrameBtn","nextFrameBtn",
    "currentTime","durationTime","speedSelect","syncVideoTime","syncImuTime","syncBtn","accelChart","gyroChart","noImuNotice",
    "ruler","segmentsTrack","scrubber","segmentCount","reviewCount","changeCount","segmentFilter","segmentList","editorTitle","editorFields",
    "startInput","endInput","labelZhInput","labelEnInput","classIdInput","statusInput","confidenceInput","candidateInput","notesInput",
    "markStartBtn","markEndBtn","labelForm","coverageStatus","revertBtn","saveBtn","prevSegmentBtn","nextSegmentBtn","exportBtn","resetBtn",
    "syncDialog","syncForm","anchorVideoInput","anchorImuInput","quickAnchor","confirmSyncBtn","sessionText","sessionDot","toast",
    "repairBtn","repairInfo","repairMessage","cancelRepairBtn","repairDownload","videoErrorText",
    "autoSyncBtn","cancelSyncBtn","syncStatus","syncEvidence","syncEvidenceText","runtimeNotice"
  ].map(id => [id, $(id)]));

  const COLORS = ["#c7ff4a", "#5fd7ff", "#ff8a42", "#ff668d", "#aa8cff", "#52e0b5", "#ffd45f", "#75a9ff"];
  const state = {
    videoUrl: null, videoName: "", duration: 0, currentTime: 0, chartWindow: 10,
    imu: [], imuFiles: [], imuStart: null, imuEnd: null,
    labels: [], originalLabels: [], headers: [], labelFileName: "",
    selectedId: null, changed: new Set(), anchorVideo: 0, anchorImuMs: null,
    raf: 0, demo: true
  };

  const demoLabels = [
    {segment_id:"demo_0001",video:"demo.mp4",annotation_video:"",start_seconds:"0",end_seconds:"18",start_time:"00:00.0",end_time:"00:18.0",duration_seconds:"18",class_id:"3",label_zh:"睡觉",label_en:"sleeping",status:"confirmed",confidence:"medium",sample_step_seconds:"1",boundary_precision_seconds:"1",training_candidate:"1",notes:"示例片段：闭眼侧卧，头部有支撑。"},
    {segment_id:"demo_0002",video:"demo.mp4",annotation_video:"",start_seconds:"18",end_seconds:"28",start_time:"00:18.0",end_time:"00:28.0",duration_seconds:"10",class_id:"7",label_zh:"其他",label_en:"other",status:"review",confidence:"low",sample_step_seconds:"1",boundary_precision_seconds:"1",training_candidate:"0",notes:"示例片段：抬头并调整卧姿，等待检查。"},
    {segment_id:"demo_0003",video:"demo.mp4",annotation_video:"",start_seconds:"28",end_seconds:"46",start_time:"00:28.0",end_time:"00:46.0",duration_seconds:"18",class_id:"4",label_zh:"行走",label_en:"walking",status:"confirmed",confidence:"high",sample_step_seconds:"1",boundary_precision_seconds:"1",training_candidate:"1",notes:"示例片段：连续缓慢行走。"},
    {segment_id:"demo_0004",video:"demo.mp4",annotation_video:"",start_seconds:"46",end_seconds:"60",start_time:"00:46.0",end_time:"01:00.0",duration_seconds:"14",class_id:"8",label_zh:"无法判断",label_en:"uncertain",status:"review",confidence:"low",sample_step_seconds:"1",boundary_precision_seconds:"1",training_candidate:"0",notes:"示例片段：画面遮挡，此时可没有 IMU。"}
  ];
  const defaultHeaders = Object.keys(demoLabels[0]);
  const repair = { file: null, busy: false, attempted: false, job: null, token: null, timer: null, stage: null, fallback: false };
  const alignment = { busy:false, attempted:false, mode:null, controller:null, samples:[] };
  const { fitClock, lowerBound, hasSamples } = globalThis.ClockSync;
  const { parseCsv, numeric, validateRange, readLabels, serializeLabels, parseImuTime, formatCsvTime } = globalThis.ReviewData;
  const runtime = { repair: false, ocr: false };
  let draftDirty = false, unexported = false, labelLoad = 0, imuLoad = 0;

  async function detectRuntime() {
    refs.repairBtn.disabled = true; refs.autoSyncBtn.disabled = true;
    if (['127.0.0.1', 'localhost'].includes(location.hostname)) {
      try {
        const response = await fetch('./api/repair-capabilities', { signal: AbortSignal.timeout(3000) });
        const data = await response.json();
        if (response.ok && data.service === 'imu-video-reviewer') {
          runtime.repair = data.available; runtime.ocr = data.ocr; repair.token = data.token;
          refs.runtimeNotice.textContent = `本机服务已连接 · 视频修复${runtime.repair ? '可用' : '需要安装 FFmpeg'} · 时间识别${runtime.ocr ? '可用（macOS）' : '仅支持 macOS'}。文件不上传云端；导出 CSV 不覆盖原文件。`;
        }
      } catch { /* Static hosting is a supported mode. */ }
    }
    refs.repairBtn.disabled = !runtime.repair || !repair.file;
    refs.autoSyncBtn.disabled = !runtime.ocr;
    renderSyncStatus(); maybeAutoSync();
  }
  function canDiscard() {
    return !(draftDirty || unexported) || confirm('还有未导出的标签修改。继续会丢弃这些修改，是否继续？');
  }
  function markDraft() { draftDirty = true; refs.video.pause(); }

  function init() {
    state.labels = structuredClone(demoLabels);
    state.originalLabels = structuredClone(demoLabels);
    state.headers = [...defaultHeaders];
    state.duration = 60;
    bindEvents();
    renderAll();
    drawCharts();
    setupWebMCP();
    detectRuntime();
  }

  function bindEvents() {
    refs.videoInput.addEventListener("change", e => loadVideo(e.target.files[0]));
    refs.imuInput.addEventListener("change", e => loadImuFiles([...e.target.files]));
    refs.labelInput.addEventListener("change", e => loadLabelFile(e.target.files[0]));
    refs.videoPickBtn.addEventListener("click", () => refs.videoInput.click());
    [[refs.videoDrop, "video"], [refs.imuDrop, "imu"], [refs.labelDrop, "label"]].forEach(([el, kind]) => {
      ["dragenter","dragover"].forEach(ev => el.addEventListener(ev, e => { e.preventDefault(); el.classList.add("dragover"); }));
      ["dragleave","drop"].forEach(ev => el.addEventListener(ev, e => { e.preventDefault(); el.classList.remove("dragover"); }));
      el.addEventListener("drop", e => {
        const files = [...e.dataTransfer.files];
        if (kind === "video") loadVideo(files[0]);
        if (kind === "imu") loadImuFiles(files.filter(f => f.name.toLowerCase().endsWith(".csv")));
        if (kind === "label") loadLabelFile(files[0]);
      });
    });
    refs.video.addEventListener("loadedmetadata", () => {
      refs.video.playbackRate = Number(refs.speedSelect.value);
      state.duration = Math.max(Number.isFinite(refs.video.duration) ? refs.video.duration : 0, labelsDuration());
      refs.durationTime.textContent = formatClock(state.duration, true);
      refs.scrubber.max = state.duration || 1;
      refs.videoError.hidden = true;
      renderTimeline();
    });
    refs.video.addEventListener("error", handleVideoError);
    refs.repairBtn.addEventListener("click", () => startRepair());
    refs.cancelRepairBtn.addEventListener("click", cancelRepair);
    refs.video.addEventListener("loadeddata", () => {
      if (repair.job && repair.stage === 'checking') {
        repair.stage = 'ready';
        setRepairMessage('修复版已载入（不含音频）。请复核视频起点、动作边界与 IMU 时间锚点；原标签未自动平移。');
        refs.repairDownload.hidden = false;
      }
      maybeAutoSync();
    });
    ['seeked','timeupdate','ratechange'].forEach(event => refs.video.addEventListener(event, () => updateTime(refs.video.currentTime)));
    refs.video.addEventListener("play", () => { refs.playBtn.textContent = "Ⅱ"; tick(); });
    refs.video.addEventListener("pause", () => { refs.playBtn.textContent = "▶"; cancelAnimationFrame(state.raf); updateTime(refs.video.currentTime); });
    refs.video.addEventListener("ended", () => refs.playBtn.textContent = "▶");
    refs.playBtn.addEventListener("click", togglePlay);
    refs.prevFrameBtn.addEventListener("click", () => seekTo(currentVideoTime() - 1/25));
    refs.nextFrameBtn.addEventListener("click", () => seekTo(currentVideoTime() + 1/25));
    refs.speedSelect.addEventListener("change", () => refs.video.playbackRate = Number(refs.speedSelect.value));
    refs.scrubber.addEventListener("input", () => seekTo(Number(refs.scrubber.value)));
    document.querySelectorAll("[data-window]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-window]").forEach(x => x.classList.remove("active")); btn.classList.add("active");
      state.chartWindow = Number(btn.dataset.window); drawCharts();
    }));
    refs.syncBtn.addEventListener("click", openSyncDialog);
    refs.autoSyncBtn.addEventListener('click', autoSync);
    refs.cancelSyncBtn.addEventListener('click', () => alignment.controller?.abort());
    refs.confirmSyncBtn.addEventListener("click", e => { e.preventDefault(); applySync(); });
    refs.segmentFilter.addEventListener("change", renderSegmentList);
    refs.labelForm.addEventListener("submit", e => { e.preventDefault(); saveCurrentSegment(); });
    refs.labelForm.addEventListener('input', markDraft);
    refs.markStartBtn.addEventListener("click", () => { refs.startInput.value = currentVideoTime().toFixed(3); markDraft(); });
    refs.markEndBtn.addEventListener("click", () => { refs.endInput.value = currentVideoTime().toFixed(3); markDraft(); });
    refs.revertBtn.addEventListener("click", revertCurrentSegment);
    refs.prevSegmentBtn.addEventListener("click", () => selectAdjacent(-1));
    refs.nextSegmentBtn.addEventListener("click", () => selectAdjacent(1));
    refs.exportBtn.addEventListener("click", exportCsv);
    refs.resetBtn.addEventListener("click", resetApp);
    window.addEventListener("resize", drawCharts);
    document.addEventListener("keydown", handleKeys);
    window.addEventListener('beforeunload', e => { if (draftDirty || unexported) { e.preventDefault(); e.returnValue = ''; } });
  }

  async function loadVideo(file) {
    if (!file) return;
    if (alignment.busy) { toast('请先等待或取消时间识别'); return; }
    if (repair.busy) { toast('请先等待或取消当前修复'); return; }
    clearAlignment();
    clearTimeout(repair.timer);
    Object.assign(repair, { file, attempted: false, job: null, stage: null, fallback: false });
    refs.repairInfo.hidden = true; refs.repairDownload.hidden = true; refs.repairBtn.disabled = !runtime.repair;
    if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
    state.videoUrl = URL.createObjectURL(file); state.videoName = file.name; state.demo = false;
    refs.video.src = state.videoUrl; refs.videoPickBtn.hidden = true; refs.videoError.hidden = true;
    refs.videoName.textContent = file.name; setReady(refs.videoDrop, refs.videoState, "已载入"); updateSession();
  }

  function setRepairMessage(message) { refs.repairInfo.hidden = false; refs.repairMessage.textContent = message; }
  function setRepairBusy(busy) { repair.busy = busy; refs.repairBtn.disabled = busy || !repair.file || !runtime.repair; refs.cancelRepairBtn.hidden = !busy || !repair.job; }
  async function repairRequest(path, options = {}) {
    const response = await fetch(`.${path}`, { ...options, headers: { ...options.headers, 'X-Repair-Token': repair.token || '' } });
    let data;
    try { data = await response.json(); } catch { throw new Error('自动修复需要使用 npm start 启动本地项目；静态预览不支持。'); }
    if (!response.ok) throw new Error(data.error || '本地修复请求失败');
    return data;
  }
  function repairFailed(error) {
    setRepairBusy(false); repair.stage = 'failed';
    refs.videoError.hidden = false; refs.videoPickBtn.hidden = true;
    if (!runtime.repair) { refs.videoErrorText.textContent = '此视频无法直接播放。请在本机使用 npm start 并安装 FFmpeg 修复，或选择浏览器支持的视频。'; return; }
    refs.videoErrorText.textContent = error.message;
    setRepairMessage(error.message);
  }
  function handleVideoError() {
    if (!repair.file) return;
    refs.videoError.hidden = false; refs.videoPickBtn.hidden = true;
    if (repair.busy) return;
    if (repair.job?.mode === 'copy' && !repair.fallback) { startRepair(true); return; }
    if (!repair.attempted) { startRepair(); return; }
    refs.videoErrorText.textContent = '修复版仍无法解码，请检查文件是否损坏；可以重新选择视频。';
  }
  async function startRepair(fallback = false) {
    if (!runtime.repair) { toast('视频修复需要本机 Node 服务和 FFmpeg'); return; }
    if (!repair.file || repair.busy) return;
    if (alignment.busy) { toast('请先等待或取消时间识别'); return; }
    clearAlignment();
    repair.attempted = true; repair.stage = 'processing'; setRepairBusy(true);
    refs.repairDownload.hidden = true;
    refs.video.pause();
    try {
      const capabilities = await repairRequest('/api/repair-capabilities');
      repair.token = capabilities.token;
      if (!capabilities.available) throw new Error('未找到 FFmpeg。请安装 FFmpeg 或设置 FFMPEG_PATH，并重启本地服务。');
      if (repair.file.size > capabilities.maxBytes) throw new Error('自动修复支持最大 8 GB 视频');
      if (fallback) {
        repair.fallback = true;
        setRepairMessage('重新封装后仍无法播放，正在转成 H.264…');
        repair.job = await repairRequest(`/api/repairs/${repair.job.id}/h264`, { method: 'POST' });
      } else {
        repair.job = null; repair.fallback = false;
        setRepairMessage('正在将视频交给本机修复服务…原文件保持不变。');
        repair.job = await repairRequest('/api/repairs', { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: repair.file });
      }
      refs.cancelRepairBtn.hidden = false;
      await pollRepair();
    } catch (error) { repairFailed(error); }
  }
  async function pollRepair() {
    try {
      const job = await repairRequest(`/api/repairs/${repair.job.id}`); repair.job = job;
      if (job.status === 'failed') throw new Error(job.error || '修复失败');
      if (job.status === 'cancelled') { setRepairBusy(false); repair.stage = 'cancelled'; setRepairMessage('修复已取消，可重新选择视频或再次修复。'); return; }
      if (job.status !== 'succeeded') {
        const text = `${job.status === 'cancelling' ? '正在取消' : job.mode === 'copy' ? '正在无损重新封装' : '正在转成 H.264'} · 已处理 ${formatClock(job.seconds || 0)}（视频时长）`;
        setRepairMessage(text); refs.videoErrorText.textContent = text;
        repair.timer = setTimeout(pollRepair, 1000); return;
      }
      setRepairBusy(false); repair.stage = 'checking';
      setRepairMessage('转换完成，正在检查播放兼容性…');
      refs.videoError.hidden = true;
      refs.video.preload = 'auto'; refs.video.src = job.url; refs.video.load();
      refs.videoState.textContent = '修复版';
      refs.repairDownload.href = job.url;
      refs.repairDownload.download = repair.file.name.replace(/\.[^.]+$/, '') + '_repaired.mp4';
      refs.repairDownload.hidden = false;
      // No automatic timestamp shift: converted and annotation clocks require review.
    } catch (error) { repairFailed(error); }
  }
  async function cancelRepair() {
    if (!repair.job || !repair.busy) return;
    refs.cancelRepairBtn.disabled = true;
    try { await repairRequest(`/api/repairs/${repair.job.id}/cancel`, { method: 'POST' }); }
    catch (error) { toast(error.message); }
    finally { refs.cancelRepairBtn.disabled = false; }
  }

  async function loadImuFiles(files) {
    if (!files?.length) return;
    const loadId = ++imuLoad;
    try {
      refs.imuState.textContent = "解析中";
      const batches = await Promise.all(files.map(async file => {
        const text = await decodeCsvFile(file);
        const rows = parseCsv(text);
        return normalizeImu(rows);
      }));
      if (loadId !== imuLoad) return;
      const imu = batches.flat().filter(row => Number.isFinite(row.t)).sort((a,b) => a.t-b.t);
      if (!imu.length) throw new Error("未找到可识别的时间戳与 IMU 三轴字段");
      state.imu = imu;
      state.imuFiles = files.map(f => f.name); state.imuStart = state.imu[0].t; state.imuEnd = state.imu.at(-1).t; state.demo = false;
      refs.imuName.textContent = files.length === 1 ? files[0].name : `${files.length} 个文件 · 已按时间合并`;
      setReady(refs.imuDrop, refs.imuState, `${state.imu.length.toLocaleString()} 行`);
      updateSession(); updateTime(currentVideoTime()); renderSyncStatus(); maybeAutoSync(); toast(`已载入 ${state.imu.length.toLocaleString()} 条 IMU 数据`);
    } catch (err) { if (loadId !== imuLoad) return; refs.imuState.textContent = state.imu.length ? '保留原数据' : '失败'; toast(`IMU 解析失败：${err.message}`); }
  }

  async function loadLabelFile(file) {
    if (!file) return;
    if (!canDiscard()) return;
    const loadId = ++labelLoad;
    try {
      refs.labelState.textContent = "解析中";
      const parsed = readLabels(await decodeCsvFile(file));
      if (loadId !== labelLoad) return;
      state.headers = parsed.headers; state.labels = parsed.labels;
      draftDirty = false; unexported = false;
      state.originalLabels = structuredClone(state.labels); state.changed.clear(); state.labelFileName = file.name; state.demo = false;
      state.duration = Math.max(refs.video.duration || 0, labelsDuration()); state.selectedId = state.labels[0]?.segment_id || null;
      refs.labelName.textContent = file.name; setReady(refs.labelDrop, refs.labelState, `${state.labels.length} 段`); refs.exportBtn.disabled = false;
      refs.scrubber.max = state.duration || 1; renderAll(); updateSession(); toast(`已载入 ${state.labels.length} 个标签片段`);
    } catch (err) { if (loadId !== labelLoad) return; refs.labelState.textContent = state.labelFileName ? '保留原数据' : '失败'; toast(`标签解析失败：${err.message}`); }
  }

  async function decodeCsvFile(file) {
    const buffer = await file.arrayBuffer();
    const utf8 = new TextDecoder("utf-8", {fatal:false}).decode(buffer);
    const badUtf8 = (utf8.match(/�/g) || []).length;
    if (!badUtf8) return utf8.replace(/^\uFEFF/, "");
    try { return new TextDecoder("gb18030").decode(buffer).replace(/^\uFEFF/, ""); } catch { return utf8; }
  }

  function normalizeImu(rows) {
    if (rows.length < 2) return [];
    const h = rows[0].map(x => cleanBom(x).trim()); const idx = name => h.indexOf(name);
    const ti = ["timestamp_beijing_utc_plus_8","timestamp","datetime","time"].map(idx).find(i=>i>=0);
    if (ti === undefined) return [];
    const ai = [idx("accel_x_mps2"),idx("accel_y_mps2"),idx("accel_z_mps2")];
    const gi = [idx("gyro_x_rad_s"),idx("gyro_y_rad_s"),idx("gyro_z_rad_s")];
    if (![...ai, ...gi].some(i => i >= 0)) return [];
    return rows.slice(1).map(r => ({ t: parseImuTime(r[ti]), a: ai.map(i=>numeric(r[i])), g: gi.map(i=>numeric(r[i])) }))
      .filter(r => Number.isFinite(r.t) && [...r.a, ...r.g].some(Number.isFinite));
  }

  function renderAll() {
    refs.durationTime.textContent = formatClock(state.duration, true); refs.scrubber.max = state.duration || 1;
    renderTimeline(); renderSegmentList(); selectSegment(state.selectedId || state.labels[0]?.segment_id, false); updateStats(); updateTime(currentVideoTime());
  }

  function renderTimeline() {
    const duration = state.duration || labelsDuration() || 1; refs.ruler.innerHTML=""; refs.segmentsTrack.innerHTML="";
    const ticks = window.innerWidth < 600 ? 4 : 8;
    for (let i=0;i<=ticks;i++) { const s=document.createElement("span"); s.style.left=`${i/ticks*100}%`; s.textContent=formatClock(duration*i/ticks,false); refs.ruler.appendChild(s); }
    state.labels.forEach((seg,i) => {
      const start=num(seg.start_seconds), end=num(seg.end_seconds); const btn=document.createElement("button");
      btn.type="button"; btn.className=`segment-block ${seg.status==="review"?"review":""} ${seg.segment_id===state.selectedId?"selected":""}`;
      btn.style.left=`${Math.max(0,start/duration*100)}%`; btn.style.width=`${Math.max(.15,(end-start)/duration*100)}%`; btn.style.setProperty("--segment-color", colorFor(seg,i));
      btn.title=`${formatClock(start)}–${formatClock(end)} ${seg.label_zh||seg.label_en||"未命名"}`; btn.textContent=seg.label_zh||seg.label_en||"";
      btn.addEventListener("click", () => { selectSegment(seg.segment_id); seekTo(start); }); refs.segmentsTrack.appendChild(btn);
    });
  }

  function renderSegmentList() {
    const filter=refs.segmentFilter.value; refs.segmentList.innerHTML="";
    const list=state.labels.filter(s => filter==="all" || (filter==="review"&&s.status==="review") || (filter==="changed"&&state.changed.has(s.segment_id)));
    if (!list.length) { refs.segmentList.innerHTML='<div class="list-empty">当前筛选下没有片段</div>'; return; }
    list.forEach(seg => {
      const index=state.labels.indexOf(seg), btn=document.createElement("button"); btn.type="button"; btn.className=`segment-item ${seg.segment_id===state.selectedId?"selected":""}`;
      btn.innerHTML=`<span class="segment-color" style="--segment-color:${colorFor(seg,index)}"></span><span class="segment-copy"><b>${escapeHtml(seg.label_zh||seg.label_en||"未命名标签")}</b><small>${escapeHtml(seg.segment_id)} · ${escapeHtml(seg.status||"—")}</small></span><span class="segment-time">${formatClock(num(seg.start_seconds))}<br>${formatClock(num(seg.end_seconds))}${state.changed.has(seg.segment_id)?"<em>已修改</em>":""}</span>`;
      btn.addEventListener("click", () => { selectSegment(seg.segment_id); seekTo(num(seg.start_seconds)); }); refs.segmentList.appendChild(btn);
    });
  }

  function selectSegment(id, rerender=true) {
    if (draftDirty) { toast('请先保存或撤销当前标签编辑'); return; }
    const seg=state.labels.find(s=>s.segment_id===id); state.selectedId=seg?.segment_id||null;
    refs.editorFields.disabled=!seg; refs.editorTitle.textContent=seg ? `${seg.segment_id} · ${seg.label_zh||seg.label_en||"未命名"}` : "选择一个片段";
    if (seg) {
      for (const [select,value] of [[refs.statusInput,seg.status||'review'],[refs.confidenceInput,seg.confidence||'medium']]) {
        if (![...select.options].some(o=>o.value===value)) { const option=document.createElement('option'); option.value=value; option.textContent=`${value}（原始值）`; select.appendChild(option); }
      }
      refs.startInput.value=num(seg.start_seconds); refs.endInput.value=num(seg.end_seconds); refs.labelZhInput.value=seg.label_zh||""; refs.labelEnInput.value=seg.label_en||""; refs.classIdInput.value=seg.class_id||""; refs.statusInput.value=seg.status||"review"; refs.confidenceInput.value=seg.confidence||"medium"; refs.candidateInput.checked=String(seg.training_candidate)==="1"; refs.notesInput.value=seg.notes||"";
      updateCoverage(seg);
    }
    if (rerender) { renderSegmentList(); renderTimeline(); }
  }

  function saveCurrentSegment() {
    const seg=state.labels.find(s=>s.segment_id===state.selectedId); if (!seg) return false;
    const start=Number(refs.startInput.value), end=Number(refs.endInput.value);
    try { validateRange(refs.startInput.value, refs.endInput.value); } catch (error) { toast(error.message); return false; }
    const overlaps = state.labels.filter(s => s !== seg && start < Number(s.end_seconds) && end > Number(s.start_seconds));
    if (overlaps.length && !confirm(`此时间段与 ${overlaps.length} 个标签重叠。重叠区间播放时显示 CSV 中第一条标签。仍要保存？`)) return false;
    Object.assign(seg, {start_seconds:trimNum(start),end_seconds:trimNum(end),start_time:formatCsvTime(start),end_time:formatCsvTime(end),duration_seconds:trimNum(end-start),label_zh:refs.labelZhInput.value.trim(),label_en:refs.labelEnInput.value.trim(),class_id:refs.classIdInput.value.trim(),status:refs.statusInput.value,confidence:refs.confidenceInput.value,training_candidate:refs.candidateInput.checked?"1":"0",notes:refs.notesInput.value});
    draftDirty = false; unexported = true;
    state.changed.add(seg.segment_id); state.duration=Math.max(state.duration,end); refs.exportBtn.disabled=false; renderAll(); toast("本段修改已保存，请导出 CSV 留存"); return true;
  }

  function revertCurrentSegment() {
    draftDirty = false; unexported = true;
    const original=state.originalLabels.find(s=>s.segment_id===state.selectedId); if (!original) return;
    const i=state.labels.findIndex(s=>s.segment_id===state.selectedId); state.labels[i]=structuredClone(original); state.changed.delete(original.segment_id); renderAll(); toast("已撤销本段修改");
  }

  function updateStats() {
    refs.segmentCount.textContent=state.labels.length; refs.reviewCount.textContent=state.labels.filter(s=>s.status==="review").length; refs.changeCount.textContent=state.changed.size;
  }

  function currentVideoTime() { return refs.video.src ? refs.video.currentTime||0 : state.currentTime||0; }
  function seekTo(seconds) {
    const limit=refs.video.src && Number.isFinite(refs.video.duration) ? refs.video.duration : state.duration||labelsDuration()||60; const t=Math.max(0,Math.min(limit,Number(seconds)||0));
    if (refs.video.src && Number.isFinite(refs.video.duration)) refs.video.currentTime=Math.min(t,refs.video.duration); state.currentTime=t; updateTime(t);
  }
  function togglePlay() { if (draftDirty) { toast('请先保存或撤销当前标签编辑'); return; } if (!refs.video.src) { toast("请先载入可播放的视频"); return; } refs.video.paused ? refs.video.play().catch(()=>toast("视频暂时无法播放")) : refs.video.pause(); }
  function tick() { updateTime(refs.video.currentTime); if (!refs.video.paused) state.raf=requestAnimationFrame(tick); }

  function updateTime(t) {
    state.currentTime=t||0; refs.currentTime.textContent=refs.frameBadge.textContent=formatClock(state.currentTime,true); refs.syncVideoTime.textContent=formatClock(state.currentTime,true); refs.scrubber.value=Math.min(Number(refs.scrubber.max)||0,state.currentTime);
    const imuMs=currentImuMs(); refs.syncImuTime.textContent=imuMs===null?"尚未对齐":formatDateTime(imuMs);
    const seg=currentSegmentAt(state.currentTime); refs.videoLabel.hidden=!seg; if (seg) { refs.videoLabel.querySelector("b").textContent=seg.label_zh||seg.label_en||"未命名"; refs.videoLabel.querySelector("span").style.background=colorFor(seg,state.labels.indexOf(seg)); }
    if (!draftDirty && seg && seg.segment_id!==state.selectedId) selectSegment(seg.segment_id);
    drawCharts(); const edited=state.labels.find(s=>s.segment_id===state.selectedId); if (edited) updateCoverage(edited);
  }

  function openSyncDialog() {
    if (alignment.busy) { toast('请先等待或取消自动识别'); return; }
    refs.anchorVideoInput.value=currentVideoTime().toFixed(3);
    const suggested=state.anchorImuMs!==null?currentImuMs():state.imuStart;
    refs.anchorImuInput.value=suggested!==null?toDateTimeLocal(suggested):"";
    refs.quickAnchor.innerHTML=state.imuStart!==null?`IMU 首条数据：<b>${formatDateTime(state.imuStart)}</b><button type="button" id="useImuStart">使用首条</button>`:"尚未载入 IMU；可先设置锚点，稍后再导入数据。";
    $("useImuStart")?.addEventListener("click",()=>refs.anchorImuInput.value=toDateTimeLocal(state.imuStart)); refs.syncDialog.showModal();
  }
  function applySync() {
    const v=Number(refs.anchorVideoInput.value), ms=refs.anchorImuInput.value?Date.parse(`${refs.anchorImuInput.value}+08:00`):NaN;
    if (!refs.anchorVideoInput.value.trim()||v<0||!Number.isFinite(v)||!Number.isFinite(ms)) { toast("请填写非负的视频秒数和有效 IMU 时间"); return; }
    state.anchorVideo=v; state.anchorImuMs=ms; alignment.mode='manual'; refs.syncEvidence.hidden=true; refs.syncDialog.close(); updateTime(currentVideoTime()); renderSyncStatus(); toast("时间锚点已更新");
  }
  function currentImuMs() { return state.anchorImuMs===null?null:state.anchorImuMs+(state.currentTime-state.anchorVideo)*1000; }

  function clearAlignment() {
    state.anchorImuMs=null; state.anchorVideo=0;
    Object.assign(alignment,{attempted:false,mode:null,samples:[]});
    refs.syncEvidence.hidden=true; renderSyncStatus();
  }
  function maybeAutoSync() {
    if (runtime.ocr && state.imu.length && refs.video.readyState>=2 && !repair.busy && !alignment.mode && !alignment.attempted && !alignment.busy) autoSync();
  }
  function renderSyncStatus() {
    if(alignment.busy) return;
    if(state.anchorImuMs===null) { refs.syncStatus.textContent=runtime.ocr?'导入可播放视频和 IMU 后自动识别左上角日期时间（北京时间）。也可手动设置锚点。':'请使用“手动对齐”绑定视频秒数与 IMU 北京时间；自动识别需要 macOS 本机服务。'; return; }
    const base=state.anchorImuMs-state.anchorVideo*1000;
    const end=base+(Number.isFinite(refs.video.duration)?refs.video.duration:state.duration)*1000;
    const quality=alignment.mode==='auto'?'已通过 3 帧校验 · 水印精度约 ±1 秒':'已手动对齐';
    const coverage=!state.imu.length?'未载入 IMU':hasSamples(state.imu,base,end)?'已找到时间重叠的 IMU 数据':'视频与已载入 IMU 时间不重叠，波形为空';
    refs.syncStatus.textContent=`${quality}。${coverage}。拖动、暂停和倍速均与视频同步。`;
  }
  function waitMedia(video,event,action,signal) {
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>finish(new Error('视频帧读取超时，请确认视频可以播放。')),20000);
      const done=()=>finish(), fail=()=>finish(new Error('采样视频无法解码，请先修复视频。')), abort=()=>finish(new DOMException('已取消','AbortError'));
      function finish(error) { clearTimeout(timer); video.removeEventListener(event,done);video.removeEventListener('error',fail);signal.removeEventListener('abort',abort);error?reject(error):resolve(); }
      video.addEventListener(event,done,{once:true});video.addEventListener('error',fail,{once:true});signal.addEventListener('abort',abort,{once:true});
      if(signal.aborted) abort(); else action();
    });
  }
  async function autoSync() {
    if (!runtime.ocr) { toast('自动识别需要 macOS 本机服务，请使用手动对齐'); return; }
    if(alignment.busy) return;
    if(repair.busy || refs.video.readyState<2 || !Number.isFinite(refs.video.duration) || refs.video.duration<6) { toast('请先载入并完成修复，视频至少需要 6 秒。'); return; }
    alignment.busy=true; alignment.attempted=true; alignment.controller=new AbortController();
    const signal=alignment.controller.signal;
    refs.autoSyncBtn.disabled=true;refs.cancelSyncBtn.hidden=false;
    const sampleVideo=document.createElement('video');sampleVideo.muted=true;sampleVideo.preload='auto';sampleVideo.playsInline=true;
    try {
      refs.syncStatus.textContent='正在准备本机文字识别，首次运行可能需要约一分钟…';
      const capabilities=await repairRequest('/api/repair-capabilities',{signal});repair.token=capabilities.token;
      await waitMedia(sampleVideo,'loadeddata',()=>{sampleVideo.src=refs.video.currentSrc;sampleVideo.load();},signal);
      const duration=sampleVideo.duration;
      const times=[Math.min(2,duration/6),duration/2,Math.max(duration-2,duration*5/6)];
      const samples=[];
      for(let i=0;i<times.length;i++) {
        refs.syncStatus.textContent=`正在识别第 ${i+1}/3 帧（视频 ${formatClock(times[i])}），校验首段、中段和尾段的日期时间…`;
        await waitMedia(sampleVideo,'seeked',()=>sampleVideo.currentTime=times[i],signal);
        const canvas=document.createElement('canvas');
        const cropW=Math.ceil(sampleVideo.videoWidth*.65),cropH=Math.ceil(sampleVideo.videoHeight*.18);
        canvas.width=Math.min(cropW*4,2048);canvas.height=Math.round(cropH*canvas.width/cropW);
        const context=canvas.getContext('2d');context.imageSmoothingEnabled=false;
        context.drawImage(sampleVideo,0,0,cropW,cropH,0,0,canvas.width,canvas.height);
        const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
        if(!png) throw new Error('无法截取视频水印');
        const result=await repairRequest('/api/clock-ocr',{method:'POST',headers:{'Content-Type':'image/png'},body:png,signal});
        samples.push({...result,videoSeconds:sampleVideo.currentTime});
      }
      const fit=fitClock(samples);
      if(signal.aborted) throw new DOMException('已取消','AbortError');
      state.anchorVideo=0;state.anchorImuMs=fit.offsetMs;alignment.mode='auto';alignment.samples=fit.samples;
      refs.syncEvidenceText.textContent=fit.samples.map(s=>`视频 ${formatClock(s.videoSeconds,true)} → ${s.text}（北京时间）`).join('；')+`。以水印秒区间中点估计偏移，帧间偏移差 ${Math.round(fit.spreadMs)} ms。`;
      refs.syncEvidence.hidden=false;alignment.busy=false;renderSyncStatus();updateTime(currentVideoTime());
    } catch(error) {
      refs.syncStatus.textContent=(error.name==='AbortError'?'已取消时间识别。':`自动对齐未应用：${error.message}`)+(alignment.mode?' 保留原对齐。':' 请使用“手动对齐”。');
    } finally {
      alignment.busy=false;refs.autoSyncBtn.disabled=!runtime.ocr;refs.cancelSyncBtn.hidden=true;
      sampleVideo.pause();sampleVideo.removeAttribute('src');sampleVideo.load();
    }
  }

  function drawCharts() {
    drawChart(refs.accelChart,"a"); drawChart(refs.gyroChart,"g");
    const ms=currentImuMs(); const has=ms!==null&&hasImuNear(ms,state.chartWindow*1000); refs.noImuNotice.hidden=has||state.imu.length===0;
  }
  function drawChart(canvas,key) {
    const rect=canvas.getBoundingClientRect(); if (!rect.width) return; const dpr=Math.min(devicePixelRatio||1,2); canvas.width=rect.width*dpr; canvas.height=rect.height*dpr;
    const ctx=canvas.getContext("2d"); ctx.scale(dpr,dpr); const w=rect.width,h=rect.height,p={l:38,r:11,t:11,b:24}; ctx.clearRect(0,0,w,h);
    ctx.strokeStyle="#1d2a36"; ctx.lineWidth=1; ctx.fillStyle="#617180"; ctx.font="9px ui-monospace, monospace";
    for(let i=0;i<5;i++){const y=p.t+(h-p.t-p.b)*i/4;ctx.beginPath();ctx.moveTo(p.l,y+.5);ctx.lineTo(w-p.r,y+.5);ctx.stroke();}
    const center=currentImuMs(); let points=[];
    if(center!==null&&state.imu.length){const lo=center-state.chartWindow*1000,hi=center+state.chartWindow*1000;points=state.imu.slice(lowerBound(state.imu,lo),lowerBound(state.imu,hi+0.001)); if(points.length>1200){const step=Math.ceil(points.length/1200);points=points.filter((_,i)=>i%step===0);}}
    if(!points.length){ctx.fillStyle="#657482";ctx.font="12px system-ui";ctx.textAlign="center";ctx.fillText(state.imu.length?"当前窗口无数据":"载入 IMU CSV 后显示波形",w/2,h/2);return;}
    const vals=points.flatMap(r=>r[key]).filter(Number.isFinite); if (!vals.length) { ctx.fillText('当前窗口该传感器无有效数据', p.l, h/2); return; } let min=Math.min(...vals),max=Math.max(...vals); if(min===max){min-=1;max+=1;} const pad=(max-min)*.12;min-=pad;max+=pad;
    ctx.textAlign="right";ctx.fillStyle="#60707f";ctx.fillText(max.toFixed(key==="a"?1:2),p.l-5,p.t+4);ctx.fillText(min.toFixed(key==="a"?1:2),p.l-5,h-p.b);
    const lo=center-state.chartWindow*1000,hi=center+state.chartWindow*1000, colors=["#ff8a42","#5fd7ff","#ff668d"];
    colors.forEach((color,axis)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=1.35;let started=false;points.forEach(r=>{const v=r[key][axis];if(!Number.isFinite(v))return;const x=p.l+(r.t-lo)/(hi-lo)*(w-p.l-p.r);const y=p.t+(max-v)/(max-min)*(h-p.t-p.b);if(!started){ctx.moveTo(x,y);started=true;}else ctx.lineTo(x,y);});ctx.stroke();});
    const x=p.l+(w-p.l-p.r)/2;ctx.strokeStyle="#c7ff4a";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,p.t);ctx.lineTo(x,h-p.b);ctx.stroke();ctx.fillStyle="#c7ff4a";ctx.textAlign="center";ctx.fillText("NOW",x,h-7);
  }

  function updateCoverage(seg) {
    if (!state.imu.length || state.anchorImuMs===null) { refs.coverageStatus.className="coverage"; refs.coverageStatus.querySelector("span").textContent="未载入或未对齐 IMU；不影响标签"; return; }
    const start=state.anchorImuMs+(num(seg.start_seconds)-state.anchorVideo)*1000,end=state.anchorImuMs+(num(seg.end_seconds)-state.anchorVideo)*1000;
    const covered=hasSamples(state.imu,start,end); refs.coverageStatus.className=`coverage ${covered?"covered":"gap"}`; refs.coverageStatus.querySelector("span").textContent=covered?"该片段与 IMU 数据有交集":"该片段无 IMU 数据（允许）";
  }

  function exportCsv() {
    if (draftDirty && !saveCurrentSegment()) return;
    if (!state.labels.length) return; const headers=[...state.headers];
    ["segment_id","start_seconds","end_seconds","start_time","end_time","duration_seconds","class_id","label_zh","label_en","status","confidence","training_candidate","notes"].forEach(h=>{if(!headers.includes(h))headers.push(h);});
    const blob=new Blob([serializeLabels(headers,state.labels)],{type:"text/csv;charset=utf-8"}); const a=document.createElement("a");a.href=URL.createObjectURL(blob);
    const stem=(state.labelFileName||"labels").replace(/\.csv$/i,"");a.download=`${stem}_reviewed.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast(`已导出 ${state.labels.length} 个片段（UTF-8 CSV）`);
    unexported = false;
  }

  function handleKeys(e) {
    if (["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName) || refs.syncDialog.open) return;
    if (e.code==="Space") { e.preventDefault(); togglePlay(); }
    if (e.code==="ArrowLeft") { e.preventDefault(); seekTo(currentVideoTime()-1/25); }
    if (e.code==="ArrowRight") { e.preventDefault(); seekTo(currentVideoTime()+1/25); }
  }
  function selectAdjacent(delta){const i=state.labels.findIndex(s=>s.segment_id===state.selectedId);if(i<0)return;const next=state.labels[Math.max(0,Math.min(state.labels.length-1,i+delta))];selectSegment(next.segment_id);seekTo(num(next.start_seconds));}
  function currentSegmentAt(t){return state.labels.find(s=>t>=num(s.start_seconds)&&t<num(s.end_seconds));}
  function labelsDuration(){return state.labels.reduce((m,s)=>Math.max(m,num(s.end_seconds)),0);}
  function hasImuNear(ms,range){return hasSamples(state.imu,ms-range,ms+range);}
  function colorFor(seg,index){const key=String(seg.label_en||seg.label_zh||index);let n=0;for(const ch of key)n=(n*31+ch.charCodeAt(0))>>>0;return COLORS[n%COLORS.length];}
  function cleanBom(s){return String(s??"").replace(/^\uFEFF/,"");}
  function num(v){const n=Number(v);return Number.isFinite(n)?n:0;}
  function trimNum(v){return Number(v.toFixed(3)).toString();}
  function formatClock(s,ms=false){s=Math.max(0,Number(s)||0);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=Math.floor(s%60),mill=Math.floor((s-Math.floor(s))*1000);return `${h?String(h).padStart(2,"0")+":":""}${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}${ms?"."+String(mill).padStart(3,"0"):""}`;}
  function formatDateTime(ms){const d=new Date(ms);return new Intl.DateTimeFormat("zh-CN",{timeZone:"Asia/Shanghai",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,fractionalSecondDigits:3}).format(d);}
  function toDateTimeLocal(ms){const d=new Date(ms+8*3600e3);return d.toISOString().slice(0,23);}
  function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
  function setReady(card,badge,text){card.classList.add("ready");badge.textContent=text;}
  function updateSession(){const parts=[];if(state.videoName)parts.push("视频");if(state.imu.length)parts.push("IMU");if(state.labelFileName)parts.push("标签");refs.sessionText.textContent=parts.length?`${parts.join(" + ")} 已载入 · 数据仅在本机处理`:"示例模式 · 导入本地文件后开始审阅";refs.sessionDot.classList.toggle("live",parts.length>0);}
  let toastTimer; function toast(message){refs.toast.textContent=message;refs.toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>refs.toast.classList.remove("show"),2800);}

  function resetApp(){
    if(alignment.busy) { toast('请先等待或取消时间识别'); return; }
    if (repair.busy) { toast('请先等待或取消当前修复'); return; }
    if (!canDiscard()) return;
    draftDirty = false; unexported = false; labelLoad++; imuLoad++;
    refs.videoInput.value = refs.imuInput.value = refs.labelInput.value = '';
    clearAlignment();
    clearTimeout(repair.timer); Object.assign(repair, { file: null, job: null, stage: null, attempted: false });
    refs.repairInfo.hidden = true; refs.repairBtn.disabled = true;
    if(state.videoUrl)URL.revokeObjectURL(state.videoUrl);Object.assign(state,{videoUrl:null,videoName:"",duration:60,currentTime:0,imu:[],imuFiles:[],imuStart:null,imuEnd:null,labels:structuredClone(demoLabels),originalLabels:structuredClone(demoLabels),headers:[...defaultHeaders],labelFileName:"",selectedId:null,changed:new Set(),anchorVideo:0,anchorImuMs:null,demo:true});
    refs.video.removeAttribute("src");refs.video.load();refs.videoPickBtn.hidden=false;refs.videoError.hidden=true;[refs.videoDrop,refs.imuDrop,refs.labelDrop].forEach(x=>x.classList.remove("ready"));refs.videoName.textContent="选择或拖入视频文件";refs.imuName.textContent="可多选，按时间自动合并";refs.labelName.textContent="兼容 UTF-8 / GB18030";refs.videoState.textContent=refs.imuState.textContent=refs.labelState.textContent="未载入";refs.exportBtn.disabled=true;updateSession();renderAll();drawCharts();toast("已清空，回到示例模式");
  }

  function setupWebMCP(){
    const context=document.modelContext;if(!context?.registerTool)return;
    const tools=[
      {name:"read_current_review_state",title:"读取当前审阅状态",description:"读取当前视频时刻、选中标签、IMU 覆盖情况和修改数量。",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({video_seconds:state.currentTime,selected_segment_id:state.selectedId,imu_aligned:state.anchorImuMs!==null,changed_count:state.changed.size})},
      {name:"navigate_to_segment",title:"跳转到标签片段",description:"按 segment_id 选择标签片段，并把视频定位到该片段开始。",inputSchema:{type:"object",properties:{segment_id:{type:"string"}},required:["segment_id"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:({segment_id})=>{const seg=state.labels.find(s=>s.segment_id===segment_id);if(!seg)throw new Error("找不到该片段");selectSegment(segment_id);seekTo(num(seg.start_seconds));return{segment_id,video_seconds:num(seg.start_seconds)};}},
      {name:"update_segment_label",title:"更新片段标签",description:"更新指定片段的中英文标签、状态、置信度或备注，并标记为已修改。",inputSchema:{type:"object",properties:{segment_id:{type:"string"},label_zh:{type:"string"},label_en:{type:"string"},status:{type:"string",enum:["review","confirmed","rejected"]},confidence:{type:"string",enum:["low","medium","high"]},notes:{type:"string"}},required:["segment_id"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:(input)=>{const seg=state.labels.find(s=>s.segment_id===input.segment_id);if(!seg)throw new Error("找不到该片段");["label_zh","label_en","status","confidence","notes"].forEach(k=>{if(input[k]!==undefined)seg[k]=input[k];});state.changed.add(seg.segment_id);selectSegment(seg.segment_id);renderAll();return{segment_id:seg.segment_id,updated:true};}}
    ];
    tools.forEach(tool=>{try{Promise.resolve(context.registerTool(tool)).catch(()=>{});}catch{}});
  }

  init();
})();
