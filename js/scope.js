// Hero receiver: a synthetic 433.92 MHz span. Noise floor, bursts that decode,
// a waterfall of what has already gone past, and the packet list underneath.
(() => {
  const cv = document.getElementById('scope');
  const rowsEl = document.getElementById('ticker-rows');
  if (!cv || !rowsEl) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = cv.getContext('2d', { alpha: false });

  const BINS = 512;
  const CENTER = 433.92, SPAN = 2.4; // MHz
  const COL = { bg: '#0B1014', rule: '#22333D', cyan: '#2FD3E1', amber: '#FFB020', muted: '#9FB3BD' };

  const CATALOG = [
    { off: -0.62, w: 5, mod: 'OOK', why: 'Bresser 3CH  id 118  22.4 C  47 %' },
    { off: 0.00, w: 4, mod: 'OOK', why: 'Nexus-TH  id 205  ch 1  19.8 C' },
    { off: 0.31, w: 7, mod: 'FSK', why: 'Toyota TPMS  id 8c1f2a  2.41 bar' },
    { off: -0.18, w: 4, mod: 'OOK', why: 'Door contact  id 5c3d  open' },
    { off: 0.74, w: 6, mod: 'FSK', why: 'Ford TPMS  id 41b90c  2.28 bar' },
    { off: -0.91, w: 9, mod: 'LoRa', why: 'Meshtastic  LongFast  text, 41 bytes' },
    { off: 0.52, w: 3, mod: 'OOK', why: 'Gate remote  id 0x3f21  button 2' },
    { off: -0.44, w: 5, mod: 'OOK', why: null }, // unclaimed
    { off: 0.18, w: 4, mod: 'FSK', why: 'wM-Bus T  KAM  meter 66214470' },
    { off: 0.95, w: 8, mod: 'FSK', why: null },
    { off: -0.75, w: 4, mod: 'OOK', why: 'Acurite 609TXC  id 92  4.1 C' },
    { off: 0.62, w: 5, mod: 'OOK', why: 'Shelf label  id 7a02  refresh' },
  ];

  let W = 0, H = 0, dpr = 1, specH = 0, fallH = 0;
  const noise = new Float32Array(BINS);
  const mag = new Float32Array(BINS);
  const peak = new Float32Array(BINS);
  const fall = document.createElement('canvas');
  const fctx = fall.getContext('2d');
  let bursts = [];
  let t0 = performance.now();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    W = Math.max(320, Math.round(r.width));
    H = Math.max(200, Math.round(r.height));
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    specH = Math.round(H * 0.55);
    fallH = H - specH;
    fall.width = BINS; fall.height = Math.max(1, fallH);
    fctx.fillStyle = COL.bg;
    fctx.fillRect(0, 0, BINS, fall.height);
  }

  for (let i = 0; i < BINS; i++) { noise[i] = Math.random(); peak[i] = 0; }

  function spawn() {
    const s = CATALOG[(Math.random() * CATALOG.length) | 0];
    const bin = Math.round((s.off / SPAN + 0.5) * BINS);
    const snr = 8 + Math.random() * 26;
    bursts.push({ bin, w: s.w, snr, born: performance.now(), life: 900 + Math.random() * 1500 });
    addRow(s, bin, snr);
  }

  function addRow(s, bin, snr) {
    const freq = (CENTER + (bin / BINS - 0.5) * SPAN).toFixed(3);
    const el = document.createElement('li');
    if (!s.why) el.className = 'unclaimed';
    el.innerHTML =
      `<span class="t">${clock()}</span>` +
      `<span class="f">${freq} MHz</span>` +
      `<span class="m">${s.mod}</span>` +
      `<span class="s">${snr.toFixed(1)} dB</span>` +
      `<span class="why">${s.why || 'unclaimed  ' + s.mod + ' PWM, ' + (24 + ((Math.random() * 40) | 0)) + ' bits'}</span>`;
    rowsEl.prepend(el);
    el.classList.add('fresh');
    setTimeout(() => el.classList.remove('fresh'), 700);
    while (rowsEl.children.length > 7) rowsEl.lastElementChild.remove();
  }

  function clock() {
    const d = new Date(Date.now());
    return d.toTimeString().slice(0, 8);
  }

  function level(x) { // waterfall colour ramp, dark -> cyan -> amber -> white
    const v = Math.max(0, Math.min(1, x));
    if (v < 0.42) { const k = v / 0.42; return [11 + 25 * k, 16 + 60 * k, 20 + 75 * k]; }
    if (v < 0.72) { const k = (v - 0.42) / 0.3; return [36 + 11 * k, 76 + 135 * k, 95 + 130 * k]; }
    if (v < 0.9) { const k = (v - 0.72) / 0.18; return [47 + 208 * k, 211 - 35 * k, 225 - 193 * k]; }
    const k = (v - 0.9) / 0.1; return [255, 176 + 79 * k, 32 + 200 * k];
  }

  function step(now) {
    for (let i = 0; i < BINS; i++) {
      noise[i] += (Math.random() - 0.5) * 0.35;
      noise[i] = Math.max(0, Math.min(1, noise[i] * 0.86 + 0.07));
      mag[i] = 0.06 + noise[i] * 0.1;
    }
    bursts = bursts.filter(b => now - b.born < b.life);
    for (const b of bursts) {
      const age = (now - b.born) / b.life;
      const env = Math.sin(Math.PI * Math.min(1, age * 1.15)) ** 0.6;
      const amp = (b.snr / 34) * env;
      for (let d = -b.w * 3; d <= b.w * 3; d++) {
        const i = b.bin + d;
        if (i < 0 || i >= BINS) continue;
        mag[i] += amp * Math.exp(-(d * d) / (2 * b.w * b.w));
      }
    }
    for (let i = 0; i < BINS; i++) peak[i] = Math.max(mag[i], peak[i] * 0.985);
  }

  function pushFallLine() {
    fctx.drawImage(fall, 0, 1);
    const row = fctx.createImageData(BINS, 1);
    for (let i = 0; i < BINS; i++) {
      const [r, g, b] = level(mag[i] * 1.15);
      row.data[i * 4] = r; row.data[i * 4 + 1] = g; row.data[i * 4 + 2] = b; row.data[i * 4 + 3] = 255;
    }
    fctx.putImageData(row, 0, 0);
  }

  function draw() {
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);

    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.85;
    ctx.drawImage(fall, 0, specH, W, fallH);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = COL.rule;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, specH + 0.5); ctx.lineTo(W, specH + 0.5); ctx.stroke();

    ctx.font = '500 10px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(159,179,189,0.5)';
    for (let k = 0; k <= 4; k++) {
      const x = (k / 4) * W;
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, specH - 8);
      ctx.lineTo(Math.round(x) + 0.5, specH);
      ctx.strokeStyle = COL.rule; ctx.stroke();
      const f = (CENTER + (k / 4 - 0.5) * SPAN).toFixed(2);
      ctx.fillText(f, Math.min(W - 34, Math.max(4, x + 5)), specH - 12);
    }

    const y = i => specH - Math.min(1, mag[i]) * (specH - 22);

    ctx.beginPath();
    ctx.moveTo(0, specH);
    for (let i = 0; i < BINS; i++) ctx.lineTo((i / (BINS - 1)) * W, y(i));
    ctx.lineTo(W, specH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, specH);
    grad.addColorStop(0, 'rgba(47,211,225,0.34)');
    grad.addColorStop(1, 'rgba(47,211,225,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i < BINS; i++) {
      const x = (i / (BINS - 1)) * W;
      i ? ctx.lineTo(x, y(i)) : ctx.moveTo(x, y(i));
    }
    ctx.strokeStyle = COL.cyan;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < BINS; i++) {
      const x = (i / (BINS - 1)) * W;
      const py = specH - Math.min(1, peak[i]) * (specH - 22);
      i ? ctx.lineTo(x, py) : ctx.moveTo(x, py);
    }
    ctx.strokeStyle = 'rgba(255,176,32,0.42)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  let nextSpawn = 0;
  function frame(now) {
    if (now > nextSpawn) { spawn(); nextSpawn = now + 1400 + Math.random() * 2600; }
    step(now);
    pushFallLine();
    draw();
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', () => { resize(); draw(); });

  if (still) {
    for (let k = 0; k < fallH + 40; k++) { step(performance.now() + k * 40); pushFallLine(); }
    for (let k = 0; k < 3; k++) spawn();
    step(performance.now());
    draw();
    for (let k = 0; k < 4; k++) {
      const s = CATALOG[(Math.random() * CATALOG.length) | 0];
      addRow(s, Math.round((s.off / SPAN + 0.5) * BINS), 9 + Math.random() * 24);
    }
  } else {
    for (let k = 0; k < 60; k++) { step(t0 + k * 30); pushFallLine(); }
    requestAnimationFrame(frame);
  }
})();
