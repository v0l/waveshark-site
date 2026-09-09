// Hero receiver: a synthetic 433.92 MHz span, 2.4 MHz wide. A population of
// devices with real timings and modulations transmits into a receiver noise
// floor; the FFT and the waterfall are one line per tick and the packet list
// fills as bursts finish.
(() => {
  const cv = document.getElementById('scope');
  const rowsEl = document.getElementById('ticker-rows');
  if (!cv || !rowsEl) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = cv.getContext('2d', { alpha: false });

  const BINS = 512;
  const CENTER = 433.92, SPAN = 2.4;           // MHz
  const BIN_HZ = SPAN * 1e6 / BINS;            // 4687.5 Hz
  const TICK_MS = 45;                          // one FFT and one waterfall line
  const COL = { bg: '#0B1014', rule: '#22333D', cyan: '#2FD3E1', amber: '#FFB020', muted: '#9FB3BD' };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const irnd = (a, b) => Math.floor(rnd(a, b + 1));
  const pick = a => a[(Math.random() * a.length) | 0];
  const hex = n => Math.floor(Math.random() * 16 ** n).toString(16).padStart(n, '0');

  // ---- the population -----------------------------------------------------
  //
  // freq in MHz. scatter is the per-device offset a SAW resonator or a cheap
  // crystal gives, in kHz. on/gap/n are the packet length, the gap between
  // repeats and how many repeats, in ms. dev and baud describe an FSK signal,
  // bw a LoRa one. weight is how often it goes off, relative.

  const KINDS = [
    { name: 'Bresser 3CH', mod: 'OOK', freq: 433.92, scatter: 60, baud: 2000, on: 30, gap: 4, n: [12, 15], snr: [20, 40], weight: 3, instances: 2,
      state: () => ({ id: irnd(1, 255), ch: irnd(1, 3), t: rnd(-2, 26), h: irnd(35, 90) }),
      why: s => `Bresser 3CH  id ${s.id}  ch ${s.ch}  ${(s.t += rnd(-0.1, 0.1)).toFixed(1)} C  ${s.h} %` },
    { name: 'Nexus-TH', mod: 'OOK', freq: 433.92, scatter: 70, baud: 1000, on: 70, gap: 4, n: [12, 12], snr: [16, 36], weight: 3, instances: 2,
      state: () => ({ id: irnd(1, 255), ch: irnd(1, 3), t: rnd(15, 24), h: irnd(30, 70) }),
      why: s => `Nexus-TH  id ${s.id}  ch ${s.ch}  ${(s.t += rnd(-0.1, 0.1)).toFixed(1)} C  ${s.h} %` },
    { name: 'Fine Offset WH1080', mod: 'OOK', freq: 433.92, scatter: 40, baud: 1000, on: 100, gap: 0, n: [1, 1], snr: [24, 42], weight: 2, instances: 1,
      state: () => ({ id: irnd(1, 255), t: rnd(4, 19), h: irnd(50, 95), wind: rnd(0, 6), rain: rnd(0, 40) }),
      why: s => `Fineoffset-WHx080  id ${s.id}  ${(s.t += rnd(-0.1, 0.1)).toFixed(1)} C  ${s.h} %  wind ${(s.wind = Math.max(0, s.wind + rnd(-0.4, 0.4))).toFixed(1)} m/s  rain ${s.rain.toFixed(1)} mm` },
    { name: 'Acurite 609TXC', mod: 'OOK', freq: 433.92, scatter: 50, baud: 2000, on: 25, gap: 8, n: [3, 3], snr: [14, 32], weight: 2, instances: 1,
      state: () => ({ id: irnd(1, 255), t: rnd(2, 12), h: irnd(60, 95) }),
      why: s => `Acurite-609TXC  id ${s.id}  ${(s.t += rnd(-0.1, 0.1)).toFixed(1)} C  ${s.h} %  battery ok` },
    { name: 'Oregon THGR122N', mod: 'OOK', freq: 433.92, scatter: 45, baud: 1024, on: 90, gap: 10, n: [2, 2], snr: [18, 36], weight: 2, instances: 1,
      state: () => ({ id: hex(2).toUpperCase(), ch: irnd(1, 3), t: rnd(17, 23), h: irnd(35, 60) }),
      why: s => `Oregon-THGR122N  id ${s.id}  ch ${s.ch}  ${(s.t += rnd(-0.05, 0.05)).toFixed(1)} C  ${s.h} %` },
    { name: 'LaCrosse TX141TH', mod: 'OOK', freq: 433.92, scatter: 55, baud: 2000, on: 30, gap: 6, n: [4, 4], snr: [16, 34], weight: 1.5, instances: 1,
      state: () => ({ id: irnd(1, 255), t: rnd(-1, 8), h: irnd(70, 99) }),
      why: s => `LaCrosse-TX141THBv2  id ${s.id}  ${(s.t += rnd(-0.1, 0.1)).toFixed(1)} C  ${s.h} %` },
    { name: 'WH51 soil', mod: '2-FSK', freq: 433.92, scatter: 20, dev: 50e3, baud: 17.2e3, on: 12, gap: 0, n: [1, 1], snr: [16, 30], weight: 1, instances: 1,
      state: () => ({ id: hex(6), m: irnd(18, 60), ad: irnd(180, 420) }),
      why: s => `Fineoffset-WH51  id ${s.id}  moisture ${s.m} %  ad ${s.ad}  battery 1.5 V` },

    { name: 'Toyota TPMS', mod: '2-FSK', freq: 433.92, scatter: 25, dev: 38e3, baud: 10e3, on: 12, gap: 60, n: [3, 3], snr: [12, 28], weight: 2, instances: 4,
      state: () => ({ id: hex(8), p: rnd(2.1, 2.6), t: irnd(8, 30) }),
      why: s => `Toyota TPMS  id ${s.id}  ${s.p.toFixed(2)} bar  ${s.t} C` },
    { name: 'Ford TPMS', mod: '2-FSK', freq: 433.92, scatter: 25, dev: 35e3, baud: 19.2e3, on: 10, gap: 40, n: [4, 4], snr: [12, 28], weight: 1.5, instances: 4,
      state: () => ({ id: hex(6), p: rnd(2.0, 2.5), t: irnd(6, 28) }),
      why: s => `Ford TPMS  id ${s.id}  ${s.p.toFixed(2)} bar  ${s.t} C` },
    { name: 'Schrader TPMS', mod: '2-FSK', freq: 433.92, scatter: 30, dev: 40e3, baud: 8.2e3, on: 8, gap: 70, n: [3, 3], snr: [12, 26], weight: 1, instances: 4,
      state: () => ({ id: hex(7), p: rnd(2.2, 2.9), t: irnd(6, 32) }),
      why: s => `Schrader TPMS  id ${s.id}  ${s.p.toFixed(2)} bar  ${s.t} C` },

    { name: 'KeeLoq', mod: 'OOK', freq: 433.92, scatter: 80, baud: 833, on: 62, gap: 16, n: [4, 16], snr: [22, 44], weight: 1, instances: 2,
      state: () => ({ serial: hex(7), c: irnd(1000, 60000) }),
      why: s => `KeeLoq  serial ${s.serial}  button ${pick([1, 1, 2, 4])}  counter ${++s.c}` },
    { name: 'EV1527', mod: 'OOK', freq: 433.92, scatter: 90, baud: 700, on: 34, gap: 11, n: [4, 12], snr: [18, 40], weight: 1.5, instances: 3,
      state: () => ({ id: hex(5), b: pick([1, 2, 4, 8]) }),
      why: s => `EV1527  id ${s.id}  button ${s.b}` },
    { name: 'Somfy RTS', mod: 'OOK', freq: 433.42, scatter: 40, baud: 1208, on: 60, gap: 27, n: [2, 8], snr: [20, 40], weight: 1, instances: 1,
      state: () => ({ addr: hex(6), c: irnd(100, 4000) }),
      why: s => `Somfy RTS  address ${s.addr}  ${pick(['up', 'down', 'my', 'down'])}  rolling ${++s.c}` },
    { name: 'Keyfob', mod: '2-FSK', freq: 434.42, scatter: 15, dev: 20e3, baud: 20e3, on: 18, gap: 25, n: [3, 5], snr: [16, 36], weight: 1, instances: 2,
      state: () => ({ id: hex(8), c: irnd(1, 900) }),
      why: s => `Keyfob  VAG  id ${s.id}  ${pick(['unlock', 'lock', 'lock', 'boot'])}  rolling ${++s.c}` },
    { name: 'Door contact', mod: '2-FSK', freq: 433.92, scatter: 20, dev: 25e3, baud: 19.2e3, on: 15, gap: 30, n: [3, 3], snr: [16, 36], weight: 1.5, instances: 3,
      state: () => ({ id: hex(4), open: false }),
      why: s => `Door contact  id ${s.id}  ${(s.open = !s.open) ? 'open' : 'closed'}  battery ok` },

    { name: 'Meshtastic', mod: 'LoRa', freq: 433.875, scatter: 3, bw: 250e3, on: [520, 900], gap: 0, n: [1, 1], snr: [10, 32], weight: 2.5, instances: 3,
      state: () => ({ node: hex(8), name: pick(['KH1', 'MSHTK', 'roof', 'van', 'base', 'HILL']) }),
      why: s => `Meshtastic  !${s.node}  LongFast  ${pick([`text, ${irnd(8, 64)} bytes`, `position  ${s.name}`, `nodeinfo  ${s.name}`, 'telemetry', `text, ${irnd(8, 64)} bytes`])}` },
    { name: 'MeshCore', mod: 'LoRa', freq: 433.65, scatter: 3, bw: 62.5e3, on: [280, 600], gap: 0, n: [1, 1], snr: [10, 30], weight: 1, instances: 2,
      state: () => ({ name: pick(['Repeater North', 'MC-home', 'Room 12', 'Ridge']) }),
      why: s => `MeshCore  advert  ${s.name}  ${pick(['repeater', 'companion', 'room server'])}` },

    { name: 'LPD433 voice', mod: 'NFM', freq: null, scatter: 1, on: [700, 3800], gap: 0, n: [1, 1], snr: [14, 36], weight: 0.6, instances: 2,
      state: () => ({ ch: irnd(1, 69) }),
      freqOf: s => 433.075 + (s.ch - 1) * 0.025,
      why: (s, ms) => `NFM voice  LPD433 ch ${s.ch}  ${(ms / 1000).toFixed(1)} s` },

    { name: 'unknown', mod: 'OOK', freq: 433.92, scatter: 120, baud: 1500, on: 40, gap: 9, n: [3, 8], snr: [12, 28], weight: 1.5, instances: 3,
      state: () => ({ bits: irnd(20, 70) }),
      why: s => null, unclaimed: s => `unclaimed  OOK PWM, ${s.bits} bits` },
  ];

  const DEVICES = [];
  for (const k of KINDS) {
    for (let i = 0; i < k.instances; i++) {
      const s = k.state();
      const base = k.freqOf ? k.freqOf(s) : k.freq;
      DEVICES.push({ kind: k, s, freq: base + rnd(-k.scatter, k.scatter) / 1000, weight: k.weight / k.instances });
    }
  }
  const TOTAL_W = DEVICES.reduce((a, d) => a + d.weight, 0);
  function pickDevice() {
    let r = Math.random() * TOTAL_W;
    for (const d of DEVICES) { r -= d.weight; if (r <= 0) return d; }
    return DEVICES[0];
  }

  // ---- signal shapes -------------------------------------------------------

  function kernelFor(kind) {
    let R, f;
    if (kind.mod === 'LoRa') {
      const half = kind.bw / 2 / BIN_HZ, edge = 0.8;
      R = Math.ceil(half + 4);
      f = d => { const o = Math.abs(d) - half; return o <= 0 ? 1 : Math.exp(-(o * o) / (2 * edge * edge)); };
    } else if (kind.mod === '2-FSK') {
      const s = kind.dev / BIN_HZ, w = Math.max(0.6, kind.baud / BIN_HZ / 2.2);
      R = Math.ceil(s + 4 * w);
      f = d => 0.5 * Math.exp(-((d - s) ** 2) / (2 * w * w)) + 0.5 * Math.exp(-((d + s) ** 2) / (2 * w * w));
    } else if (kind.mod === 'NFM') {
      const w = 1.3;
      R = 6;
      f = d => Math.exp(-(d * d) / (2 * w * w));
    } else {
      const w = Math.max(0.55, kind.baud / BIN_HZ);
      R = 5;
      f = d => Math.exp(-(d * d) / (2 * w * w));
    }
    const k = new Float32Array(2 * R + 1);
    for (let d = -R; d <= R; d++) k[d + R] = f(d) + 0.004 / (1 + (d / 1.5) ** 4);
    return { R, k };
  }
  for (const k of KINDS) k.kernel = kernelFor(k);

  // ---- receiver state ------------------------------------------------------

  const DB_LO = -90, DB_HI = -25, FLOOR_DB = -72;
  const norm = db => Math.max(0, Math.min(1, (db - DB_LO) / (DB_HI - DB_LO)));

  const shape = new Float32Array(BINS);
  for (let i = 0; i < BINS; i++) {
    const u = i / (BINS - 1) - 0.5;
    shape[i] = Math.pow(10, -3.5 * Math.pow(Math.abs(u) * 2, 6) / 10);
  }
  const BIRDIES = [
    { bin: BINS >> 1, w: 1.0, db: 20 },
    { bin: (BINS * 0.245) | 0, w: 0.9, db: 8 },
    { bin: (BINS * 0.83) | 0, w: 1.3, db: 5 },
  ];

  const power = new Float32Array(BINS);
  const mag = new Float32Array(BINS);
  const peak = new Float32Array(BINS);
  let bursts = [];

  let W = 0, H = 0, dpr = 1, specH = 0, fallH = 0;
  const fall = document.createElement('canvas');
  const fctx = fall.getContext('2d');

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

  // ---- transmissions -------------------------------------------------------

  function spawn(now) {
    const d = pickDevice(), k = d.kind;
    const on = Array.isArray(k.on) ? rnd(k.on[0], k.on[1]) : k.on;
    const n = irnd(k.n[0], k.n[1]);
    const snr = rnd(k.snr[0], k.snr[1]);
    const bin = (d.freq - CENTER) * 1e6 / BIN_HZ + BINS / 2;
    const b = { d, bin, on, gap: k.gap, n, level: Math.pow(10, snr / 10), snr, start: now, end: now + n * (on + k.gap) };
    bursts.push(b);
    const row = () => addRow(d, snr, on * n + k.gap * (n - 1));
    if (still) row(); else setTimeout(row, on + 30);
  }

  // Fraction of the window [now - TICK, now] during which the burst is keyed.
  function onFraction(b, now) {
    const w0 = now - TICK_MS, w1 = now;
    let on = 0;
    const period = b.on + b.gap;
    const first = Math.max(0, Math.floor((w0 - b.start) / period));
    for (let r = first; r < b.n; r++) {
      const s = b.start + r * period, e = s + b.on;
      if (s > w1) break;
      on += Math.max(0, Math.min(e, w1) - Math.max(s, w0));
    }
    return on / TICK_MS;
  }

  function step(now) {
    for (let i = 0; i < BINS; i++) power[i] = -Math.log(1 - Math.random()) * shape[i];
    for (const c of BIRDIES) {
      const amp = Math.pow(10, c.db / 10) * rnd(0.8, 1.2);
      for (let d = -4; d <= 4; d++) {
        const i = c.bin + d;
        if (i >= 0 && i < BINS) power[i] += amp * Math.exp(-(d * d) / (2 * c.w * c.w));
      }
    }
    bursts = bursts.filter(b => now < b.end + TICK_MS);
    for (const b of bursts) {
      const frac = onFraction(b, now);
      if (frac <= 0) continue;
      const k = b.d.kind;
      let amp = b.level * frac;
      if (k.mod === 'OOK') amp *= rnd(0.55, 0.75);     // PWM keys the carrier most of the time
      if (k.mod === 'LoRa') amp *= rnd(0.85, 1.05);    // the chirp sweeps the block
      let centre = b.bin;
      if (k.mod === 'NFM') centre += rnd(-0.5, 0.5);   // speech wobbles the carrier
      const { R, k: kern } = k.kernel;
      const c0 = Math.round(centre), sub = centre - c0;
      for (let d = -R; d <= R; d++) {
        const i = c0 + d;
        if (i < 0 || i >= BINS) continue;
        const j = d - sub + R, j0 = Math.floor(j), t = j - j0;
        const v = j0 < 0 ? 0 : j0 + 1 >= kern.length ? kern[kern.length - 1] : kern[j0] * (1 - t) + kern[j0 + 1] * t;
        power[i] += amp * v;
      }
    }
    for (let i = 0; i < BINS; i++) {
      mag[i] = norm(FLOOR_DB + 10 * Math.log10(power[i]));
      peak[i] = Math.max(mag[i], peak[i] * 0.992);
    }
  }

  // ---- the packet list -----------------------------------------------------

  function addRow(d, snr, ms, ageSec) {
    const k = d.kind;
    const why = k.why(d.s, ms);
    const el = document.createElement('li');
    if (!why) el.className = 'unclaimed';
    el.innerHTML =
      `<span class="t">${clock(ageSec || 0)}</span>` +
      `<span class="f">${(d.freq + rnd(-0.001, 0.001)).toFixed(3)} MHz</span>` +
      `<span class="m">${k.mod}</span>` +
      `<span class="s">${(snr + rnd(-0.8, 0.8)).toFixed(1)} dB</span>` +
      `<span class="why">${why || k.unclaimed(d.s)}</span>`;
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
      const d = pickDevice();
      addRow(d, rnd(d.kind.snr[0], d.kind.snr[1]), 400, k * 3 + rnd(0, 4));
    }
  }

  // ---- drawing -------------------------------------------------------------

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
    return [255, 250, 225];
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
    for (const db of [-35, -50, -65]) {
      const gy = Math.round(specH - norm(db) * (specH - 22)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, gy); ctx.lineTo(W, gy);
      ctx.strokeStyle = 'rgba(34,51,61,0.45)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(159,179,189,0.45)';
      ctx.fillText(db === -35 ? `${db} dBFS` : `${db}`, W - 8, gy - 5);
    }
    ctx.textAlign = 'left';

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

  // ---- run -----------------------------------------------------------------

  let nextSpawn = 0, nextTick = 0;
  function advance(now) {
    if (now > nextSpawn) { spawn(now); nextSpawn = now + rnd(500, 2400); }
    step(now);
    pushFallLine();
  }
  function frame(now) {
    if (now >= nextTick) { nextTick = now + TICK_MS; advance(now); draw(); }
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', () => { resize(); draw(); });

  const t0 = performance.now();
  if (still) {
    for (let k = 0; k < fallH + 20; k++) advance(t0 + k * TICK_MS);
    draw();
    while (rowsEl.children.length > 7) rowsEl.lastElementChild.remove();
  } else {
    for (let k = 0; k < 40; k++) { step(t0 - (40 - k) * TICK_MS); pushFallLine(); }
    seedRows(6);
    requestAnimationFrame(frame);
  }
})();
