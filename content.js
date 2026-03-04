(() => {
  /* ── If already injected, toggle visibility ── */
  const existingHost = document.getElementById('snap-tools-host');
  if (existingHost) {
    const vis = existingHost.style.getPropertyValue('display') === 'none' ? 'block' : 'none';
    existingHost.style.setProperty('display', vis, 'important');
    return;
  }

  /* ── Icons ── */
  const I = {
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    crop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13L16 6a2 2 0 012 2v15"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    color: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="#00cec9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    stop: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="#fff"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="#ff7675" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  };

  /* ── CSS (embedded for Shadow DOM isolation) ── */
  const CSS = `
    :host { all: initial; display: block !important; }
    *, *::before, *::after {
      box-sizing: border-box; margin: 0; padding: 0;
      -webkit-appearance: none; appearance: none;
    }

    .root {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      width: 48px; height: 48px;
    }

    /* Trigger */
    .trigger {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6c5ce7, #00cec9);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.35);
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease;
      position: relative; outline: none;
      z-index: 2;
      -webkit-appearance: none; appearance: none;
      padding: 0; margin: 0;
      overflow: hidden;
    }
    .trigger:focus, .trigger:focus-visible { outline: none; box-shadow: 0 4px 24px rgba(0,0,0,0.35); }
    .trigger:hover {
      transform: scale(1.15);
      box-shadow: 0 8px 36px rgba(108,92,231,0.55);
    }
    .trigger svg { width: 22px; height: 22px; display: block; flex-shrink: 0; }
    .trigger.active svg { transform: rotate(45deg); transition: transform .3s ease; }

    /* Menu */
    .menu {
      position: absolute; width: 280px; height: 280px;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      pointer-events: none; z-index: 1;
    }
    .menu.open { pointer-events: auto; }

    .menu::before {
      content: ''; position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 220px; height: 220px; border-radius: 50%;
      background: radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%);
      opacity: 0; transition: opacity .3s ease; pointer-events: none;
    }
    .menu.open::before { opacity: 1; }

    /* Menu Items */
    .item {
      position: absolute; width: 46px; height: 46px;
      border-radius: 50%;
      background: #1e1e2e;
      border: 1.5px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      top: 50%; left: 50%;
      transform: translate(-50%,-50%) scale(0);
      opacity: 0;
      transition: background .2s ease, box-shadow .2s ease, border-color .2s ease;
      outline: none;
      -webkit-appearance: none; appearance: none;
      padding: 0; margin: 0;
      overflow: visible;
    }
    .item:focus, .item:focus-visible { outline: none; }
    .item.visible { opacity: 1; }
    .item:hover {
      background: #6c5ce7;
      box-shadow: 0 6px 24px rgba(108,92,231,0.5);
      border-color: #a29bfe;
    }
    .item svg {
      width: 20px; height: 20px; display: block; flex-shrink: 0;
      color: #f5f5f7;
    }
    .item:hover svg { color: #fff; }

    /* Tooltip */
    .tip {
      position: absolute;
      background: rgba(15,15,25,0.95); color: #f5f5f7;
      font-size: 11px; font-weight: 600;
      letter-spacing: 0.2px;
      padding: 5px 12px; border-radius: 8px;
      white-space: nowrap; pointer-events: none;
      opacity: 0; transition: opacity .2s ease, transform .2s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.08);
      top: 50%; transform: translateY(-50%) scale(0.9);
      z-index: 10;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    }
    .item:hover .tip { opacity: 1; transform: translateY(-50%) scale(1); }
  `;

  /* ── State ── */
  let menuOpen = false, isRecording = false, isDragging = false;
  let mediaRecorder = null, recordedChunks = [], recordingStream = null;
  let dragOffset = { x: 0, y: 0 };

  const BTN = 48;

  function clamp(right, bottom) {
    return {
      right: Math.min(Math.max(0, right), window.innerWidth - BTN),
      bottom: Math.min(Math.max(0, bottom), window.innerHeight - BTN)
    };
  }

  /* ── Create Shadow DOM host ── */
  const host = document.createElement('div');
  host.id = 'snap-tools-host';
  const pos = clamp(loadPos().right, loadPos().bottom);
  host.style.cssText = `position:fixed!important;z-index:2147483647!important;bottom:${pos.bottom}px;right:${pos.right}px;pointer-events:none!important;display:block!important;`;

  const shadow = host.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  shadow.appendChild(styleEl);

  /* ── Build UI in shadow root ── */
  const root = document.createElement('div');
  root.className = 'root';

  const trigger = document.createElement('button');
  trigger.className = 'trigger';
  trigger.innerHTML = I.bolt;
  trigger.style.pointerEvents = 'auto';

  const menu = document.createElement('div');
  menu.className = 'menu';

  const ACTIONS = [
    { id: 'screenshot', icon: I.camera,    label: 'Screenshot',          fn: captureScreenshot },
    { id: 'area',       icon: I.crop,      label: 'Area Capture',        fn: startAreaCapture },
    { id: 'record',     icon: I.video,     label: 'Record Screen',       fn: toggleRecording },
    { id: 'copy-url',   icon: I.link,      label: 'Copy URL',            fn: copyUrl },
    { id: 'copy-info',  icon: I.clipboard, label: 'Copy Title + URL',    fn: copyTitleUrl },
    { id: 'share',      icon: I.share,     label: 'Share Page',          fn: sharePage },
    { id: 'color',      icon: I.color,     label: 'Color Picker',        fn: pickColor },
    { id: 'dl',         icon: I.download,  label: 'Download Screenshot', fn: downloadScreenshot },
  ];

  const radius = 105;
  ACTIONS.forEach((act, i) => {
    const btn = document.createElement('button');
    btn.className = 'item';
    btn.dataset.id = act.id;
    btn.innerHTML = act.icon;

    const angle = (i / ACTIONS.length) * 2 * Math.PI - Math.PI / 2;
    const tx = Math.cos(angle) * radius;
    const ty = Math.sin(angle) * radius;
    btn.dataset.tx = tx;
    btn.dataset.ty = ty;

    const tip = document.createElement('span');
    tip.className = 'tip';
    tip.textContent = act.label;
    tip.style[tx > 0 ? 'left' : 'right'] = '110%';
    btn.appendChild(tip);

    btn.addEventListener('click', (e) => { e.stopPropagation(); act.fn(); });
    menu.appendChild(btn);
  });

  root.appendChild(menu);
  root.appendChild(trigger);
  shadow.appendChild(root);
  document.body.appendChild(host);

  /* ── Menu open / close ── */
  let hoverTimer = null;
  trigger.addEventListener('mouseenter', () => { hoverTimer = setTimeout(openMenu, 200); });
  trigger.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
  trigger.addEventListener('click', (e) => { e.stopPropagation(); if (!isDragging) toggleMenu(); });

  /* Close when clicking outside — events from inside shadow DOM retarget e.target to host */
  document.addEventListener('click', (e) => {
    if (menuOpen && e.target !== host) closeMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

  function toggleMenu() { menuOpen ? closeMenu() : openMenu(); }

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    menu.classList.add('open');
    trigger.classList.add('active');
    const items = menu.querySelectorAll('.item');
    items.forEach((el, i) => {
      setTimeout(() => {
        const tx = parseFloat(el.dataset.tx);
        const ty = parseFloat(el.dataset.ty);
        el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`;
        el.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1), opacity .2s ease, background .2s ease, box-shadow .2s ease, border-color .2s ease';
        el.classList.add('visible');
      }, i * 40);
    });
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    menu.classList.remove('open');
    trigger.classList.remove('active');
    const items = menu.querySelectorAll('.item');
    items.forEach((el, i) => {
      setTimeout(() => {
        el.style.transform = 'translate(-50%,-50%) scale(0)';
        el.classList.remove('visible');
      }, (items.length - i) * 20);
    });
  }

  /* ── Dragging ── */
  let dragStart = null;
  trigger.addEventListener('mousedown', (e) => {
    dragStart = { x: e.clientX, y: e.clientY };
    const rect = host.getBoundingClientRect();
    dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const onMove = (ev) => {
      if (Math.hypot(ev.clientX - dragStart.x, ev.clientY - dragStart.y) > 5) {
        isDragging = true;
        const raw = {
          right: window.innerWidth - ev.clientX - (BTN - dragOffset.x),
          bottom: window.innerHeight - ev.clientY - (BTN - dragOffset.y)
        };
        const c = clamp(raw.right, raw.bottom);
        host.style.right = c.right + 'px';
        host.style.bottom = c.bottom + 'px';
      }
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (isDragging) {
        savePos({ right: parseInt(host.style.right), bottom: parseInt(host.style.bottom) });
        setTimeout(() => { isDragging = false; }, 50);
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  window.addEventListener('resize', () => {
    const c = clamp(parseInt(host.style.right), parseInt(host.style.bottom));
    host.style.right = c.right + 'px';
    host.style.bottom = c.bottom + 'px';
  });

  /* ── Listen for toggle from toolbar click ── */
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'toggle-snap-tools') {
      toggleMenu();
      sendResponse({ ok: true });
    }
  });

  /* ═══════ Actions ═══════ */

  function showHost() { host.style.setProperty('display', 'block', 'important'); }
  function hideHost() { host.style.setProperty('display', 'none', 'important'); }

  function hideAndWaitRepaint() {
    hideHost();
    return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  async function captureScreenshot() {
    closeMenu();
    await hideAndWaitRepaint();
    chrome.runtime.sendMessage({ action: 'capture-visible-tab' }, async (resp) => {
      showHost();
      if (chrome.runtime.lastError || resp?.error || !resp?.dataUrl) return toast('Capture failed', true);
      try {
        const r = await fetch(resp.dataUrl);
        const blob = await r.blob();
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        toast('Screenshot copied to clipboard!');
      } catch {
        toast('Clipboard copy failed', true);
      }
    });
  }

  async function downloadScreenshot() {
    closeMenu();
    await hideAndWaitRepaint();
    chrome.runtime.sendMessage({ action: 'capture-visible-tab' }, (resp) => {
      showHost();
      if (chrome.runtime.lastError || resp?.error || !resp?.dataUrl) return toast('Capture failed', true);
      const a = document.createElement('a');
      a.href = resp.dataUrl;
      a.download = `snap-${Date.now()}.png`;
      a.click();
      toast('Screenshot downloaded!');
    });
  }

  /* ── Area Capture ── */
  function startAreaCapture() {
    closeMenu();
    hideHost();

    const ov = document.createElement('div');
    Object.assign(ov.style, { position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh', zIndex:'2147483647', cursor:'crosshair', background:'rgba(0,0,0,0.18)' });
    document.body.appendChild(ov);

    let sx, sy, box = null, dim = null;

    ov.addEventListener('mousedown', (e) => {
      sx = e.clientX; sy = e.clientY;
      box = document.createElement('div');
      dim = document.createElement('div');
      document.body.appendChild(box);
      document.body.appendChild(dim);
    });

    ov.addEventListener('mousemove', (e) => {
      if (!box) return;
      const x = Math.min(e.clientX, sx), y = Math.min(e.clientY, sy);
      const w = Math.abs(e.clientX - sx), h = Math.abs(e.clientY - sy);
      Object.assign(box.style, { position:'fixed', left:x+'px', top:y+'px', width:w+'px', height:h+'px', border:'2px dashed #6c5ce7', background:'rgba(108,92,231,0.08)', zIndex:'2147483647', pointerEvents:'none' });
      Object.assign(dim.style, { position:'fixed', left:(x+w+8)+'px', top:(y-4)+'px', background:'#1e1e2e', color:'#f5f5f7', fontSize:'11px', fontWeight:'500', padding:'3px 8px', borderRadius:'4px', zIndex:'2147483647', pointerEvents:'none', fontFamily:'monospace' });
      dim.textContent = `${w} \u00d7 ${h}`;
    });

    ov.addEventListener('mouseup', (e) => {
      const x = Math.min(e.clientX, sx), y = Math.min(e.clientY, sy);
      const w = Math.abs(e.clientX - sx), h = Math.abs(e.clientY - sy);
      cleanup();
      if (w < 5 || h < 5) { showHost(); return; }
      const dpr = window.devicePixelRatio || 1;
      const crop = { x: x*dpr, y: y*dpr, w: w*dpr, h: h*dpr };
      chrome.runtime.sendMessage({ action: 'capture-visible-tab', crop: true }, (resp) => {
        if (chrome.runtime.lastError || resp?.error) { showHost(); return toast('Capture failed', true); }
        cropAndCopy(resp.dataUrl, crop).then(() => { showHost(); toast('Area screenshot copied!'); });
      });
    });

    function cleanup() { ov.remove(); if (box) box.remove(); if (dim) dim.remove(); }
    const onEsc = (e) => { if (e.key === 'Escape') { cleanup(); showHost(); document.removeEventListener('keydown', onEsc); } };
    document.addEventListener('keydown', onEsc);
  }

  async function cropAndCopy(dataUrl, crop) {
    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => { img.onload = r; });
    const c = document.createElement('canvas');
    c.width = crop.w; c.height = crop.h;
    c.getContext('2d').drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  }

  /* ── Recording ── */
  function toggleRecording() { isRecording ? stopRec() : startRec(); }

  function startRec() {
    closeMenu();
    chrome.runtime.sendMessage({ action: 'start-recording' }, async (resp) => {
      if (chrome.runtime.lastError || resp?.error) return toast('Recording cancelled', true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: resp.streamId } }
        });
        recordingStream = stream;
        recordedChunks = [];
        const mime = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';
        mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
        mediaRecorder.onstop = async () => {
          const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
          recordingStream?.getTracks().forEach(t => t.stop());
          recordingStream = null; isRecording = false;
          removeRecBadge(); updateRecBtn();
          chrome.runtime.sendMessage({ action: 'stop-recording' }, () => {});
          try {
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            toast('Recording copied to clipboard!');
          } catch {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `recording-${Date.now()}.webm`;
            a.click();
            toast('Recording saved as file');
          }
        };
        await countdown();
        mediaRecorder.start(100);
        isRecording = true;
        showRecBadge();
        updateRecBtn();
      } catch (err) { toast('Recording failed: ' + err.message, true); }
    });
  }

  function stopRec() { if (mediaRecorder?.state !== 'inactive') mediaRecorder.stop(); }

  function updateRecBtn() {
    const btn = menu.querySelector('[data-id="record"]');
    if (!btn) return;
    if (isRecording) { btn.innerHTML = I.stop; btn.style.background = '#ff7675'; }
    else {
      btn.innerHTML = I.video;
      btn.style.background = '';
      const tip = document.createElement('span');
      tip.className = 'tip'; tip.textContent = 'Record Screen';
      tip.style[parseFloat(btn.dataset.tx) > 0 ? 'left' : 'right'] = '110%';
      btn.appendChild(tip);
    }
  }

  /* Inject a keyframes stylesheet once; reuse on subsequent calls */
  let injectedStyles = null;
  function ensureKeyframes() {
    if (injectedStyles) return;
    injectedStyles = document.createElement('style');
    injectedStyles.id = 'st-keyframes';
    injectedStyles.textContent = [
      '@keyframes stpop{0%{transform:scale(.3);opacity:0}50%{transform:scale(1.1);opacity:1}100%{transform:scale(.8);opacity:0}}',
      '@keyframes stblink{0%,100%{opacity:1}50%{opacity:.3}}'
    ].join('\n');
    document.head.appendChild(injectedStyles);
  }

  function countdown() {
    return new Promise(resolve => {
      ensureKeyframes();
      let n = 3;
      const ov = document.createElement('div');
      Object.assign(ov.style, { position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', zIndex:'2147483647', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' });
      document.body.appendChild(ov);
      const tick = () => {
        if (n <= 0) { ov.remove(); resolve(); return; }
        ov.innerHTML = `<span style="font-size:120px;font-weight:700;color:#fff;font-family:-apple-system,sans-serif;opacity:0;animation:stpop .7s forwards;">` + n + '</span>';
        n--;
        setTimeout(tick, 800);
      };
      tick();
    });
  }

  function showRecBadge() {
    if (document.getElementById('st-rec-badge')) return;
    ensureKeyframes();
    const b = document.createElement('div');
    b.id = 'st-rec-badge';
    Object.assign(b.style, { position:'fixed', top:'16px', left:'50%', transform:'translateX(-50%)', background:'#ff7675', color:'#fff', padding:'8px 20px', borderRadius:'24px', fontSize:'13px', fontWeight:'600', fontFamily:'-apple-system,sans-serif', display:'flex', alignItems:'center', gap:'8px', boxShadow:'0 4px 20px rgba(255,118,117,.5)', zIndex:'2147483647', cursor:'pointer' });
    b.innerHTML = '<span style="width:10px;height:10px;border-radius:50%;background:#fff;animation:stblink 1s ease-in-out infinite;display:inline-block;"></span> Recording \u2014 click to stop';
    b.addEventListener('click', stopRec);
    document.body.appendChild(b);
  }

  function removeRecBadge() {
    document.getElementById('st-rec-badge')?.remove();
  }

  /* ── URL actions ── */
  function copyUrl() {
    closeMenu();
    navigator.clipboard.writeText(window.location.href).then(() => toast('URL copied!')).catch(() => toast('Failed', true));
  }

  function copyTitleUrl() {
    closeMenu();
    navigator.clipboard.writeText(document.title + '\n' + window.location.href).then(() => toast('Title + URL copied!')).catch(() => toast('Failed', true));
  }

  function sharePage() {
    closeMenu();
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href }).catch(() => fallbackShare());
    } else fallbackShare();
  }
  function fallbackShare() {
    navigator.clipboard.writeText(document.title + ' \u2014 ' + window.location.href).then(() => toast('Link copied!'));
  }

  function pickColor() {
    closeMenu();
    if (!window.EyeDropper) return toast('Not supported in this browser', true);
    new EyeDropper().open().then(r => {
      navigator.clipboard.writeText(r.sRGBHex);
      toast('Color ' + r.sRGBHex + ' copied!');
    }).catch(() => {});
  }

  /* ── Toast ── */
  let toastEl = null, toastTimer = null;
  function toast(msg, err = false) {
    if (toastEl) toastEl.remove();
    clearTimeout(toastTimer);
    toastEl = document.createElement('div');
    Object.assign(toastEl.style, {
      position:'fixed', bottom:'24px', left:'50%',
      transform:'translateX(-50%) translateY(80px)',
      background:'#1e1e2e', color:'#f5f5f7',
      padding:'12px 24px', borderRadius:'12px',
      fontSize:'13px', fontWeight:'500',
      fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif',
      display:'flex', alignItems:'center', gap:'8px',
      boxShadow:'0 8px 32px rgba(0,0,0,.4)',
      border:'1px solid rgba(255,255,255,.06)',
      zIndex:'2147483647', pointerEvents:'none',
      transition:'transform .35s cubic-bezier(.34,1.56,.64,1), opacity .25s ease',
      opacity:'0'
    });
    toastEl.innerHTML = (err ? I.x : I.check) + '<span>' + msg + '</span>';
    const svg = toastEl.querySelector('svg');
    if (svg) { svg.style.width = '18px'; svg.style.height = '18px'; svg.style.flexShrink = '0'; }
    document.body.appendChild(toastEl);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      toastEl.style.transform = 'translateX(-50%) translateY(0)';
      toastEl.style.opacity = '1';
    }));
    toastTimer = setTimeout(() => {
      if (!toastEl) return;
      toastEl.style.transform = 'translateX(-50%) translateY(80px)';
      toastEl.style.opacity = '0';
      setTimeout(() => { toastEl?.remove(); toastEl = null; }, 350);
    }, 3000);
  }

  /* ── Persistence ── */
  function loadPos() {
    try { const s = localStorage.getItem('snap-tools-pos'); if (s) return JSON.parse(s); } catch {}
    return { right: 24, bottom: 24 };
  }
  function savePos(p) {
    try { localStorage.setItem('snap-tools-pos', JSON.stringify(p)); } catch {}
  }
})();
