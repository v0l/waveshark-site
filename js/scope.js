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

  // Power in dBFS, mapped to 0..1 for drawing. A receiver's floor is exponentially
  // distributed power, which is what makes a waterfall speckle instead of wash.
  const DB_LO = -95, DB_HI = -20;
  const FLOOR_DB = -70;
  const norm = db => Math.max(0, Math.min(1, (db - DB_LO) / (DB_HI - DB_LO)));

  const shape = new Float32Array(BINS);
  for (let i = 0; i < BINS; i++) {
    const u = i / (BINS - 1) - 0.5;
    shape[i] = -3.5 * Math.pow(Math.abs(u) * 2, 6); // the front end's skirt
    peak[i] = 0;
  }
  const BIRDIES = [
    { bin: BINS >> 1, w: 1.1, db: 22 },              // the DC spike every RTL-SDR has
    { bin: (BINS * 0.245) | 0, w: 0.9, db: 9 },      // a clock harmonic in the tuner
    { bin: (BINS * 0.83) | 0, w: 1.4, db: 6 },
  ];

  function spawn() {
    const s = CATALOG[(Math.random() * CATALOG.length) | 0];
    const bin = Math.round((s.off / SPAN + 0.5) * BINS);
    const snr = 8 + Math.random() * 26;
    bursts.push({
      bin, w: s.w, snr, mod: s.mod,
      born: performance.now(),
      // A frame or a packet is milliseconds long, so most of these are a dash on the
      // waterfall rather than a bar. A mesh or a meter transmission runs longer.
      life: s.mod === 'LoRa' ? 700 + Math.random() * 900 : 120 + Math.random() * 260,
    });
    addRow(s, bin, snr);
  }

  function addRow(s, bin, snr, ageSec) {
    const freq = (CENTER + (bin / BINS - 0.5) * SPAN).toFixed(3);
    const el = document.createElement('li');
    if (!s.why) el.className = 'unclaimed';
    el.innerHTML =
      `<span class="t">${clock(ageSec || 0)}</span>` +
      `<span class="f">${freq} MHz</span>` +
      `<span class="m">${s.mod}</span>` +
      `<span class="s">${snr.toFixed(1)} dB</span>` +
      `<span class="why">${s.why || 'unclaimed  ' + s.mod + ' PWM, ' + (24 + ((Math.random() * 40) | 0)) + ' bits'}</span>`;
    rowsEl.prepend(el);
    el.classList.add('fresh');
    setTimeout(() => el.classList.remove('fresh'), 700);
    while (rowsEl.children.length > 7) rowsEl.lastElementChild.remove();
  }

  function clock(ageSec) {
    return new Date(Date.now() - ageSec * 1000).toTimeString().slice(0, 8);
  }

  function seedRows(n) {
    for (let k = n; k > 0; k--) {
      const s = CATALOG[(Math.random() * CATALOG.length) | 0];
      addRow(s, Math.round((s.off / SPAN + 0.5) * BINS), 8 + Math.random() * 26, k * 3 + Math.random() * 4);
    }
  }

  // The floor stays nearly black, the way it does on a real span, so a burst is the
  // only thing with any colour in it.
  const STOPS = [
    [0.00, 7, 11, 15], [0.40, 10, 20, 32], [0.52, 14, 44, 68],
    [0.62, 22, 96, 130], [0.74, 47, 190, 214], [0.86, 150, 236, 244],
    [0.93, 255, 176, 32], [1.00, 255, 250, 225],
  ];
  function level(v) {
    const x = Math.max(0, Math.min(1, v));
    for (let s = 1; s < STOPS.length; s++) {
      if (x <= STOPS[s][0]) {
        const a = STOPS[s - 1], b = STOPS[s];
        const k = (x - a[0]) / (b[0] - a[0]);
        return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k];
      }
    }
    return [255, 255, 235];
  }

  const power = new Float32Array(BINS); // linear power this frame, floor = 1

  // What a transmission puts on the screen depends on how it is keyed: one carrier
  // for OOK, two tones for FSK, an occupied block for a chirp.
  function profile(d, w, mod) {
    const skirt = 0.006 / (1 + (d / w) ** 4);
    if (mod === 'FSK') {
      const s = w * 1.8, n = w * 0.55;
      return 0.5 * Math.exp(-((d - s) ** 2) / (2 * n * n))
        + 0.5 * Math.exp(-((d + s) ** 2) / (2 * n * n)) + skirt;
    }
    if (mod === 'LoRa') {
      const half = w * 2.2, edge = w * 0.5;
      const over = Math.abs(d) - half;
      const flat = over <= 0 ? 1 : Math.exp(-(over * over) / (2 * edge * edge));
      return flat * (0.85 + 0.3 * Math.random()) + skirt; // the chirp sweeps the block
    }
    return Math.exp(-(d * d) / (2 * w * w)) + skirt;
  }

  function step(now) {
    for (let i = 0; i < BINS; i++) {
      // -ln(U) is exponentially distributed: the power of a complex Gaussian bin.
      power[i] = -Math.log(1 - Math.random()) * Math.pow(10, shape[i] / 10);
    }
    for (const c of BIRDIES) {
      const amp = Math.pow(10, c.db / 10) * (0.8 + Math.random() * 0.4);
      for (let d = -4; d <= 4; d++) {
        const i = c.bin + d;
        if (i >= 0 && i < BINS) power[i] += amp * Math.exp(-(d * d) / (2 * c.w * c.w));
      }
    }
    bursts = bursts.filter(b => now - b.born < b.life);
    for (const b of bursts) {
      const age = (now - b.born) / b.life;
      // Keying is far faster than a frame, so a burst is on at full level for its
      // length and only its first and last frames are partial.
      const env = Math.min(1, age * 40) * Math.min(1, (1 - age) * 40);
      if (env <= 0) continue;
      const amp = Math.pow(10, b.snr / 10) * env * (0.9 + Math.random() * 0.2);
      const span = Math.ceil(b.w * 5);
      for (let d = -span; d <= span; d++) {
        const i = b.bin + d;
        if (i < 0 || i >= BINS) continue;
        power[i] += amp * profile(d, b.w, b.mod);
      }
    }
    for (let i = 0; i < BINS; i++) {
      mag[i] = norm(FLOOR_DB + 10 * Math.log10(power[i]));
      peak[i] = Math.max(mag[i], peak[i] * 0.99);
    }
  }

  function pushFallLine() {
    fctx.drawImage(fall, 0, 1);
    const row = fctx.createImageData(BINS, 1);
    for (let i = 0; i < BINS; i++) {
      const [r, g, b] = level(mag[i]);
      const j = i * 4;
      row.data[j] = r; row.data[j + 1] = g; row.data[j + 2] = b; row.data[j + 3] = 255;
    }
    fctx.putImageData(row, 0, 0);
  }

  function draw() {
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(fall, 0, specH, W, fallH);

    ctx.strokeStyle = COL.rule;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, specH + 0.5); ctx.lineTo(W, specH + 0.5); ctx.stroke();

    ctx.font = '500 10px "IBM Plex Mono", monospace';
    for (let k = 1; k <= 7; k++) {
      const gx = Math.round((k / 8) * W) + 0.5;
      ctx.beginPath();
      ctx.moveTo(gx, 0); ctx.lineTo(gx, specH);
      ctx.strokeStyle = 'rgba(34,51,61,0.45)';
      ctx.stroke();
    }
    ctx.textAlign = 'right';
    for (const db of [-40, -55, -70]) {
      const gy = Math.round(specH - norm(db) * (specH - 22)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, gy); ctx.lineTo(W, gy);
      ctx.strokeStyle = 'rgba(34,51,61,0.45)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(159,179,189,0.45)';
      ctx.fillText(db === -40 ? `${db} dBFS` : `${db}`, W - 8, gy - 5);
    }
    ctx.textAlign = 'left';

    ctx.font = '500 10px "IBM Plex Mono", monospace';
    for (let k = 0; k <= 4; k++) {
      const x = Math.round((k / 4) * W) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, specH - 8);
      ctx.lineTo(x, specH);
      ctx.strokeStyle = COL.rule; ctx.stroke();
      ctx.fillStyle = 'rgba(159,179,189,0.55)';
      ctx.textAlign = k === 4 ? 'right' : 'left';
      const f = (CENTER + (k / 4 - 0.5) * SPAN).toFixed(2);
      ctx.fillText(f, k === 4 ? x - 6 : x + 6, specH - 12);
    }
    ctx.textAlign = 'left';

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

  let nextSpawn = 0, nextLine = 0;
  const LINE_MS = 110; // the waterfall scrolls at about nine lines a second
  function frame(now) {
    if (now > nextSpawn) { spawn(); nextSpawn = now + 900 + Math.random() * 2200; }
    step(now);
    if (now >= nextLine) { nextLine = now + LINE_MS; pushFallLine(); }
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
    seedRows(6);
  } else {
    for (let k = 0; k < 60; k++) { step(t0 + k * 30); pushFallLine(); }
    seedRows(6);
    requestAnimationFrame(frame);
  }
})();
