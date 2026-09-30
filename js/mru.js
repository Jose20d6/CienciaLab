// Física · Movimiento rectilíneo uniforme (MRU): simulador, problemas y lectura de gráficos.
const MRU = (function () {
  const { dosTonos, ojo, estrellas, tono } = Arte;
  const W = 760, HE = 240, HG = 280;
  const C1 = '#3987e5', C2 = '#d95926';
  const num = (x, d = 2) => (+x.toFixed(d)).toLocaleString('es-AR', { maximumFractionDigits: d });
  function leer(t) {
    t = String(t).trim().replace(/\s/g, '');
    if (!t) return NaN;
    if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
    return parseFloat(t);
  }

  // ---------- Dibujos ----------
  // Auto con cara, mirando hacia la derecha (dir = 1) o hacia la izquierda (dir = -1).
  function auto(x, y, color, dir, giro, animo = 'feliz') {
    const rueda = cx => `<g transform="translate(${cx} 0)"><circle r="11" fill="#15163d"/><circle r="6" fill="#8f96b8"/>
      <g transform="rotate(${giro})">${[0, 60, 120].map(a => `<rect x="-1.2" y="-6" width="2.4" height="12" fill="#15163d" transform="rotate(${a})"/>`).join('')}</g></g>`;
    const boca = animo === 'feliz' ? 'q4,4 8,0' : 'h8';
    return `<g transform="translate(${x.toFixed(1)} ${y}) scale(${dir} 1)">
      <ellipse cx="0" cy="12" rx="40" ry="5" fill="#05061a" opacity="0.4"/>
      ${dosTonos('<path d="M-38,0 C-38,-12 -32,-16 -24,-16 L-14,-32 C-12,-35 -8,-36 -4,-36 H14 C20,-36 24,-32 28,-24 L32,-16 C38,-15 40,-10 40,-4 V0 C40,4 36,6 32,6 H-34 C-37,6 -38,4 -38,0 Z" fill="FILL"/>', color, tono(color, -0.3), { y: -6 })}
      <path d="M-10,-30 H12 C16,-30 18,-28 21,-18 H-17 Z" fill="#d0ebff"/><path d="M-6,-28 L-12,-20" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
      <circle cx="37" cy="-8" r="3" fill="#ffe066"/><rect x="-38" y="-10" width="5" height="5" rx="1.5" fill="#ff6b6b"/>
      ${ojo(4, -23, 3.2, 1)}${ojo(13, -23, 3.2, 1)}<path d="M5,-16 ${boca}" stroke="#15163d" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      ${rueda(-22)}${rueda(24)}</g>`;
  }
  const ESC = { x0: 60, x1: 700 };
  const px = (m, xmax) => ESC.x0 + (m / xmax) * (ESC.x1 - ESC.x0);

  function calle(xmax) {
    const paso = xmax <= 200 ? 25 : xmax <= 400 ? 50 : 100;
    let marcas = '';
    for (let m = 0; m <= xmax; m += paso) marcas += `<path d="M${px(m, xmax)},196 v8" stroke="#c9ccf5" stroke-width="2"/><text x="${px(m, xmax)}" y="222" text-anchor="middle" class="mr-marca">${m} m</text>`;
    return `<defs><linearGradient id="mr-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15174a"/><stop offset="1" stop-color="#3a3290"/></linearGradient></defs>
      <rect width="${W}" height="${HE}" rx="14" fill="url(#mr-cielo)"/>${estrellas(26, W, 110)}
      <circle cx="680" cy="46" r="18" fill="#fff3c4"/><circle cx="674" cy="42" r="4" fill="#f0dc9c"/>
      <path d="M0,130 C120,96 220,120 330,104 C450,88 560,118 760,98 V160 H0 Z" fill="#2a2b72"/>
      ${[[40, 110, 26], [140, 104, 34], [520, 100, 30], [610, 108, 22]].map(([x, y, h]) => `<rect x="${x}" y="${y - h}" width="22" height="${h + 40}" fill="#23246a"/>${[0, 1].map(i => `<rect x="${x + 7}" y="${y - h + 8 + i * 12}" width="5" height="6" fill="#ffe28a" opacity="0.5"/>`).join('')}`).join('')}
      ${dosTonos(`<rect x="0" y="150" width="${W}" height="46" fill="FILL"/>`, '#3d4166', '#33365a', { y: 176 })}
      <rect x="0" y="148" width="${W}" height="4" fill="#5c62b8"/><path d="M0,173 H${W}" stroke="#ffd166" stroke-width="3" stroke-dasharray="22 16"/>
      <rect x="0" y="196" width="${W}" height="${HE - 196}" fill="#1c1d52"/>${marcas}
`;
  }

  // Gráficos posición-tiempo y velocidad-tiempo (pequeño, a la derecha).
  const G = { x: 62, y: 24, w: 420, h: 196 }, GV = { x: 560, y: 24, w: 170, h: 196 };
  function ejes(tmax, xmax, vmin, vmax) {
    const tp = tmax <= 12 ? 2 : tmax <= 25 ? 5 : 10, xp = xmax <= 200 ? 50 : xmax <= 400 ? 100 : 200;
    let s = `<rect width="${W}" height="${HG}" rx="14" fill="#12143a"/>`;
    for (let t = 0; t <= tmax + 1e-9; t += tp) { const X = G.x + t / tmax * G.w; s += `<path d="M${X},${G.y} V${G.y + G.h}" stroke="#2a2e6e"/><text x="${X}" y="${G.y + G.h + 16}" text-anchor="middle" class="mr-eje">${num(t)}</text>`; }
    for (let x = 0; x <= xmax + 1e-9; x += xp) { const Y = G.y + G.h - x / xmax * G.h; s += `<path d="M${G.x},${Y} H${G.x + G.w}" stroke="#2a2e6e"/><text x="${G.x - 8}" y="${Y + 4}" text-anchor="end" class="mr-eje">${x}</text>`; }
    s += `<path d="M${G.x},${G.y} V${G.y + G.h} H${G.x + G.w}" stroke="#8f96b8" stroke-width="1.5" fill="none"/>
      <text x="${G.x + G.w}" y="${G.y + G.h + 34}" text-anchor="end" class="mr-tit">tiempo (s)</text><text x="${G.x - 50}" y="${G.y - 8}" class="mr-tit">posición (m)</text>`;
    // v-t
    const vy = v => GV.y + GV.h - (v - vmin) / (vmax - vmin) * GV.h;
    const vp = vmax - vmin <= 40 ? 10 : 20;
    for (let v = Math.ceil(vmin / vp) * vp; v <= vmax; v += vp) s += `<path d="M${GV.x},${vy(v)} H${GV.x + GV.w}" stroke="${v === 0 ? '#8f96b8' : '#2a2e6e'}"/><text x="${GV.x - 6}" y="${vy(v) + 4}" text-anchor="end" class="mr-eje">${v}</text>`;
    s += `<path d="M${GV.x},${GV.y} V${GV.y + GV.h}" stroke="#8f96b8" stroke-width="1.5"/>
      <text x="${GV.x + GV.w}" y="${G.y + G.h + 34}" text-anchor="end" class="mr-tit">tiempo (s)</text><text x="${GV.x - 30}" y="${GV.y - 8}" class="mr-tit">velocidad (m/s)</text>`;
    return { s, vy };
  }
  const gx = (t, tmax) => G.x + t / tmax * G.w, gy = (x, xmax) => G.y + G.h - x / xmax * G.h;
  function linea(pts, color) {
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    return `<path d="${d}" stroke="#12143a" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  // ---------- Estado ----------
  let raiz, modo = 'sim', anim = null, ultimo = 0;
  // Un "movimiento" tiene autos [{x0, v, color}], tiempo máximo y largo de la calle.
  let mov = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🚗 Movimiento rectilíneo uniforme (MRU)</h1>
        <p>En un MRU el móvil va en línea recta y con <b>velocidad constante</b>: recorre <b>distancias iguales en tiempos iguales</b>. Su posición se calcula con <b>x = x₀ + v · t</b>.</p>
      </div>
      <div class="segmentado" id="mr-modos">
        <button data-m="sim">🎛️ Simulador</button>
        <button data-m="prob">🧮 Problemas</button>
        <button data-m="graf">📈 ¿Qué gráfico es?</button>
      </div>
      <div class="nu-grid">
        <div class="panel nu-escena">
          <div class="nx-scroll"><svg id="mr-calle" viewBox="0 0 ${W} ${HE}" role="img" aria-label="Calle con los autos"></svg></div>
          <div class="nx-scroll"><svg id="mr-graf" viewBox="0 0 ${W} ${HG}" role="img" aria-label="Gráficos de posición y velocidad en función del tiempo"></svg></div>
          <div id="mr-controles"></div>
        </div>
        <aside class="panel nu-info" id="mr-info"></aside>
      </div>`;
    raiz.querySelectorAll('#mr-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    cambiarModo('sim');
    requestAnimationFrame(bucle);
  }

  function cambiarModo(m) {
    modo = m;
    anim = null;
    raiz.querySelectorAll('#mr-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    raiz.querySelector('#mr-calle').parentElement.hidden = m === 'graf';
    if (m === 'sim') vistaSim(); else if (m === 'prob') empezarProblemas(); else empezarGraficos();
  }

  // Dibuja la calle y los gráficos para el tiempo t del movimiento actual.
  function dibujar(t) {
    const { autos, tmax, xmax } = mov;
    const pos = a => Math.max(0, Math.min(xmax, a.x0 + a.v * t));
    let calleS = calle(xmax);
    // Banderitas cada 1 s (o cada 2 s si es largo): distancias iguales en tiempos iguales.
    const cada = tmax > 24 ? 5 : tmax > 12 ? 2 : 1;
    autos.forEach(a => {
      for (let k = cada; k <= t + 1e-9; k += cada) {
        const m = a.x0 + a.v * k;
        if (m < 0 || m > xmax) break;
        calleS += `<g transform="translate(${px(m, xmax)} ${a === autos[0] ? 150 : 197})"><path d="M0,0 V${a === autos[0] ? -16 : 16}" stroke="#e9ebff" stroke-width="1.5"/><path d="M0,${a === autos[0] ? -16 : 16} l9,${a === autos[0] ? 4 : -4} l-9,${a === autos[0] ? 4 : -4} Z" fill="${a.color}"/></g>`;
      }
    });
    autos.forEach((a, i) => { calleS += auto(px(pos(a), mov.xmax), i ? 188 : 164, a.color, a.v < 0 ? -1 : 1, (pos(a) * 14) % 360, a.v === 0 ? 'quieto' : 'feliz'); });
    if (mov.encuentro && t >= mov.encuentro.t) calleS += `<g transform="translate(${px(mov.encuentro.x, xmax)} 118)"><rect x="-72" y="-14" width="144" height="26" rx="13" fill="#ffd166"/><text y="4" text-anchor="middle" class="mr-cartel">¡Se encuentran!</text></g>`;
    calleS += `<g transform="translate(90 22)"><rect x="-58" y="-2" width="136" height="30" rx="15" fill="#12143a" stroke="#ffd166" stroke-width="2"/><text x="10" y="19" text-anchor="middle" class="mr-reloj">⏱ ${num(t, 1)} s</text></g>`;
    raiz.querySelector('#mr-calle').innerHTML = calleS;

    const vs = autos.map(a => a.v), E = ejes(tmax, xmax, Math.min(-10, ...vs.map(v => Math.floor(v / 10) * 10)), Math.max(30, ...vs.map(v => Math.ceil(v / 10) * 10 + (v % 10 ? 0 : 10))));
    let g = E.s;
    autos.forEach(a => {
      // Hasta dónde se dibuja: el tiempo actual o cuando sale de la calle.
      const tf = Math.min(t, a.v > 0 ? (xmax - a.x0) / a.v : a.v < 0 ? a.x0 / -a.v : Infinity);
      if (mov.fantasma) g += `<path d="M${gx(0, tmax)},${gy(a.x0, xmax)} L${gx(tmax, tmax)},${gy(a.x0 + a.v * tmax, xmax)}" stroke="${a.color}" stroke-width="2" stroke-dasharray="4 5" opacity="0.4"/>`;
      g += linea([[gx(0, tmax), gy(a.x0, xmax)], [gx(tf, tmax), gy(a.x0 + a.v * tf, xmax)]], a.color);
      g += `<circle cx="${gx(tf, tmax)}" cy="${gy(a.x0 + a.v * tf, xmax)}" r="5.5" fill="${a.color}" stroke="#fff" stroke-width="2"/>`;
      g += linea([[GV.x, E.vy(a.v)], [GV.x + t / tmax * GV.w, E.vy(a.v)]], a.color);
    });
    if (mov.encuentro && t >= mov.encuentro.t) g += `<circle cx="${gx(mov.encuentro.t, tmax)}" cy="${gy(mov.encuentro.x, xmax)}" r="9" fill="none" stroke="#ffd166" stroke-width="3"/>`;
    raiz.querySelector('#mr-graf').innerHTML = g;
  }

  function bucle(ahora) {
    const dt = Math.min(0.05, (ahora - ultimo) / 1000);
    ultimo = ahora;
    if (anim && !raiz.hidden && modo !== 'graf') {
      anim.t = Math.min(mov.tmax, anim.t + dt * anim.vel);
      const fuera = mov.autos.every(a => (a.v > 0 && a.x0 + a.v * anim.t >= mov.xmax) || (a.v < 0 && a.x0 + a.v * anim.t <= 0) || a.v === 0);
      dibujar(anim.t);
      if (modo === 'sim') infoSim();
      if (anim.t >= mov.tmax || (fuera && mov.autos.some(a => a.v !== 0))) { const fin = anim.alTerminar; anim = null; if (modo === 'sim') botonesSim(); fin && fin(); }
    }
    requestAnimationFrame(bucle);
  }

  // ---------- 1. Simulador ----------
  const sim = { v1: 20, x1: 0, dos: false, v2: -15, x2: 300, t: 0 };
  function vistaSim() {
    raiz.querySelector('#mr-controles').innerHTML = `<div class="mr-ctrl">
        <label class="mr-slider" style="--c:${C1}"><span>🚙 Velocidad</span><input type="range" id="mr-v1" min="-30" max="40" step="1" value="${sim.v1}"><b id="mr-v1-t"></b></label>
        <label class="mr-slider" style="--c:${C1}"><span>🚙 Posición inicial</span><input type="range" id="mr-x1" min="0" max="400" step="10" value="${sim.x1}"><b id="mr-x1-t"></b></label>
        <label class="mr-check"><input type="checkbox" id="mr-dos" ${sim.dos ? 'checked' : ''}> Agregar un segundo auto</label>
        <div id="mr-auto2" ${sim.dos ? '' : 'hidden'}>
          <label class="mr-slider" style="--c:${C2}"><span>🚗 Velocidad</span><input type="range" id="mr-v2" min="-30" max="40" step="1" value="${sim.v2}"><b id="mr-v2-t"></b></label>
          <label class="mr-slider" style="--c:${C2}"><span>🚗 Posición inicial</span><input type="range" id="mr-x2" min="0" max="400" step="10" value="${sim.x2}"><b id="mr-x2-t"></b></label>
        </div>
        <div class="nv-botones"><button class="btn primario" id="mr-play">▶ Iniciar</button><button class="btn" id="mr-reset">↺ Reiniciar</button></div>
      </div>`;
    const c = raiz.querySelector('#mr-controles');
    ['v1', 'x1', 'v2', 'x2'].forEach(k => c.querySelector('#mr-' + k).addEventListener('input', e => { sim[k] = +e.target.value; reiniciarSim(); }));
    c.querySelector('#mr-dos').addEventListener('change', e => { sim.dos = e.target.checked; c.querySelector('#mr-auto2').hidden = !sim.dos; reiniciarSim(); });
    c.querySelector('#mr-play').addEventListener('click', () => {
      if (anim) { sim.t = anim.t; anim = null; botonesSim(); return; }
      if (sim.t >= mov.tmax - 1e-6) sim.t = 0;
      anim = { t: sim.t, vel: 2, alTerminar: () => { sim.t = mov.tmax; } };
      botonesSim();
    });
    c.querySelector('#mr-reset').addEventListener('click', reiniciarSim);
    reiniciarSim();
  }

  function reiniciarSim() {
    anim = null;
    sim.t = 0;
    const autos = [{ x0: sim.x1, v: sim.v1, color: C1 }];
    if (sim.dos) autos.push({ x0: sim.x2, v: sim.v2, color: C2 });
    mov = { autos, tmax: 20, xmax: 400 };
    if (sim.dos && sim.v1 !== sim.v2) {
      const t = (sim.x2 - sim.x1) / (sim.v1 - sim.v2), x = sim.x1 + sim.v1 * t;
      if (t > 0 && t <= 20 && x >= 0 && x <= 400) mov.encuentro = { t, x };
    }
    const kmh = v => num(v * 3.6, 1);
    const c = raiz.querySelector('#mr-controles');
    c.querySelector('#mr-v1-t').textContent = `${sim.v1} m/s (${kmh(sim.v1)} km/h)`;
    c.querySelector('#mr-x1-t').textContent = `${sim.x1} m`;
    c.querySelector('#mr-v2-t').textContent = `${sim.v2} m/s (${kmh(sim.v2)} km/h)`;
    c.querySelector('#mr-x2-t').textContent = `${sim.x2} m`;
    dibujar(0);
    botonesSim();
    infoSim();
  }

  function botonesSim() {
    const b = raiz.querySelector('#mr-play');
    if (b) b.textContent = anim ? '⏸ Pausa' : sim.t > 0 && sim.t < mov.tmax ? '▶ Seguir' : '▶ Iniciar';
  }

  function infoSim() {
    const t = anim ? anim.t : sim.t;
    const fila = (a, e) => {
      const x = Math.max(0, Math.min(mov.xmax, a.x0 + a.v * t));
      return `<div class="mr-ec" style="--c:${a.color}"><b>${e}</b> x = ${a.x0} m + (${a.v} m/s) · ${num(t, 1)} s = <b>${num(x, 1)} m</b></div>`;
    };
    const a = mov.autos[0];
    raiz.querySelector('#mr-info').innerHTML = `<h2>🎛️ Simulador</h2>
      <p>Elegí la <b>velocidad</b> y la <b>posición inicial</b> y tocá <b>Iniciar</b>. Las banderitas marcan dónde está el auto cada segundo.</p>
      ${mov.autos.map((x, i) => fila(x, i ? '🚗' : '🚙')).join('')}
      ${mov.encuentro ? `<p class="nv-clave">🤝 Se encuentran a los <b>${num(mov.encuentro.t, 1)} s</b>, en <b>x = ${num(mov.encuentro.x, 1)} m</b>.</p>` : ''}
      <ul class="mr-ideas">
        <li>Las banderitas quedan <b>a la misma distancia</b>: eso es velocidad constante.</li>
        <li>En el gráfico posición-tiempo el MRU es una <b>recta</b>. Cuanto más rápido, <b>más inclinada</b>.</li>
        <li>Si la velocidad es <b>negativa</b>, el auto va hacia atrás y la recta <b>baja</b>. Si es cero, la recta es <b>horizontal</b>.</li>
        <li>El gráfico velocidad-tiempo es una <b>línea horizontal</b>: la velocidad no cambia.</li>
      </ul>
      <p class="nu-ayuda">1 m/s = 3,6 km/h. ${a.v ? `A ${Math.abs(a.v)} m/s, el auto azul recorre ${Math.abs(a.v)} m cada segundo.` : ''}</p>`;
  }

  // ---------- 2. Problemas ----------
  const elegir = l => l[Math.floor(Math.random() * l.length)];
  const GENERADORES = {
    posicion: () => {
      const v = elegir([5, 10, 15, 20, 25]), t = elegir([4, 6, 8, 10, 12]), x0 = elegir([0, 20, 50, 100]);
      return { texto: `Un auto parte de <b>x₀ = ${x0} m</b> y va a <b>${v} m/s</b> con MRU. ¿En qué posición está a los <b>${t} s</b>?`, pide: 'x', u: 'm', r: x0 + v * t,
        sol: `x = x₀ + v · t = ${x0} m + ${v} m/s · ${t} s = <b>${x0 + v * t} m</b>`, autos: [{ x0, v, color: C1 }], tmax: t };
    },
    tiempo: () => {
      const v = elegir([5, 10, 20, 25]), t = elegir([4, 5, 6, 8, 10, 12]), x0 = elegir([0, 50, 100]), x = x0 + v * t;
      return { texto: `Un ciclista está en <b>x₀ = ${x0} m</b> y avanza a <b>${v} m/s</b>. ¿Cuánto tarda en llegar a <b>x = ${x} m</b>?`, pide: 't', u: 's', r: t,
        sol: `t = (x − x₀) / v = (${x} m − ${x0} m) / ${v} m/s = <b>${t} s</b>`, autos: [{ x0, v, color: C1 }], tmax: t };
    },
    velocidad: () => {
      const v = elegir([5, 10, 15, 20, 25, 30]), t = elegir([4, 5, 8, 10]), x0 = elegir([0, 40, 80]), x = x0 + v * t;
      return { texto: `Una moto pasa por <b>x = ${x0} m</b> y <b>${t} s</b> después está en <b>x = ${x} m</b>. ¿Cuál es su velocidad?`, pide: 'v', u: 'm/s', r: v,
        sol: `v = Δx / Δt = (${x} m − ${x0} m) / ${t} s = ${x - x0} m / ${t} s = <b>${v} m/s</b>`, autos: [{ x0, v, color: C1 }], tmax: t };
    },
    conversion: () => {
      const kmh = elegir([36, 54, 72, 90]), v = kmh / 3.6, t = elegir([4, 6, 8, 10]);
      return { texto: `Un colectivo va a <b>${kmh} km/h</b> con MRU. ¿Qué distancia recorre en <b>${t} s</b>? (Primero pasá la velocidad a m/s.)`, pide: 'd', u: 'm', r: v * t,
        sol: `${kmh} km/h ÷ 3,6 = ${num(v)} m/s → d = v · t = ${num(v)} m/s · ${t} s = <b>${num(v * t)} m</b>`, autos: [{ x0: 0, v, color: C1 }], tmax: t };
    },
    encuentro: () => {
      let v1, v2, t, D;
      do { v1 = elegir([10, 15, 20]); v2 = elegir([5, 10, 15, 20]); t = elegir([5, 6, 8, 10]); D = (v1 + v2) * t; } while (D > 400);
      return { texto: `Dos autos están separados por <b>${D} m</b> y van uno hacia el otro: el azul a <b>${v1} m/s</b> y el naranja a <b>${v2} m/s</b>. ¿A los cuántos segundos se encuentran?`, pide: 't', u: 's', r: t,
        sol: `Se acercan ${v1} + ${v2} = ${v1 + v2} m cada segundo → t = ${D} m / ${v1 + v2} m/s = <b>${t} s</b>. Se encuentran en x = ${v1 * t} m.`,
        autos: [{ x0: 0, v: v1, color: C1 }, { x0: D, v: -v2, color: C2 }], tmax: t, encuentro: { t, x: v1 * t } };
    },
    grafico: () => {
      const v = elegir([5, 10, 15, 20, 30]), x0 = elegir([0, 50, 100]), t = elegir([4, 6, 8, 10]);
      return { texto: `Mirá el <b>gráfico posición-tiempo</b> (la recta azul). ¿Cuál es la velocidad del auto?`, pide: 'v', u: 'm/s', r: v, previo: true,
        sol: `Entre t = 0 s y t = ${t} s pasa de ${x0} m a ${x0 + v * t} m: v = ${v * t} m / ${t} s = <b>${v} m/s</b>`, autos: [{ x0, v, color: C1 }], tmax: t };
    },
  };
  const NOMBRE_PIDE = { x: 'Posición', t: 'Tiempo', v: 'Velocidad', d: 'Distancia' };
  let prob = null;

  function empezarProblemas() {
    raiz.querySelector('#mr-controles').innerHTML = '';
    prob = { lista: Util.mezclar(Object.keys(GENERADORES)).map(k => GENERADORES[k]()), i: 0, aciertos: 0, resp: null };
    mostrarProblema();
  }

  function preparar(p) {
    const maxX = Math.max(...p.autos.map(a => Math.max(a.x0, a.x0 + a.v * p.tmax)));
    mov = { autos: p.autos, tmax: p.tmax, xmax: Math.max(200, Math.ceil(maxX / 100) * 100), encuentro: p.encuentro, fantasma: false };
  }

  function mostrarProblema() {
    const info = raiz.querySelector('#mr-info');
    if (prob.i >= prob.lista.length) {
      info.innerHTML = `<h2>🧮 Resultado</h2><div class="feedback ${prob.aciertos >= 5 ? 'ok' : 'mal'}"><p class="fb-titulo">${prob.aciertos >= 5 ? '🏆' : '💪'} ${prob.aciertos} de ${prob.lista.length} correctos</p>
        <p>${prob.aciertos >= 5 ? '¡Muy bien! Ya dominás las cuentas del MRU.' : 'Repasá la fórmula x = x₀ + v · t y probá otra vez.'}</p></div><button class="btn primario" id="mr-otra">Otra ronda</button>`;
      info.querySelector('#mr-otra').addEventListener('click', empezarProblemas);
      return;
    }
    const p = prob.lista[prob.i];
    preparar(p);
    if (p.previo) { mov.fantasma = false; dibujar(p.tmax); } else dibujar(0);
    info.innerHTML = `<div class="md-cab"><span>Problema ${prob.i + 1} de ${prob.lista.length}</span><span>⭐ ${prob.aciertos}</span></div>
      <div class="barra"><div style="width:${prob.i / prob.lista.length * 100}%"></div></div>
      <p class="nx-caso">${p.texto}</p>
      <label class="md-campo"><span>${NOMBRE_PIDE[p.pide]}</span><input id="mr-resp" inputmode="decimal" autocomplete="off" placeholder="?"><b>${p.u}</b></label>
      <div class="md-botones"><button class="btn primario" id="mr-comp">✔️ Comprobar</button></div>
      <div id="mr-fb"></div>
      <details class="md-ayudas"><summary>📐 Fórmulas del MRU</summary><p><b>x = x₀ + v · t</b></p><p><b>v = Δx / Δt</b> · <b>t = (x − x₀) / v</b></p><p>km/h ÷ 3,6 = m/s · m/s × 3,6 = km/h</p></details>`;
    const inp = info.querySelector('#mr-resp');
    inp.focus();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') comprobar(); });
    info.querySelector('#mr-comp').addEventListener('click', comprobar);
  }

  function comprobar() {
    const p = prob.lista[prob.i], val = leer(raiz.querySelector('#mr-resp').value);
    if (isNaN(val) || prob.resp !== null) return;
    const ok = Math.abs(val - p.r) <= Math.max(Math.abs(p.r) * 0.01, 0.05);
    prob.resp = val;
    if (ok) prob.aciertos++;
    raiz.querySelector('#mr-resp').disabled = true;
    raiz.querySelector('#mr-resp').closest('.md-campo').classList.add(ok ? 'ok' : 'mal');
    raiz.querySelector('#mr-comp').disabled = true;
    raiz.querySelector('#mr-fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'mal'}"><p class="fb-titulo">${ok ? '✅ ¡Correcto!' : `✖ La respuesta es ${num(p.r)} ${p.u}`}</p><p>${p.sol}</p><p class="nu-ayuda">🎬 Mirá la simulación: el auto hace exactamente ese recorrido.</p></div>
      <button class="btn primario" id="mr-sig">${prob.i + 1 < prob.lista.length ? 'Siguiente →' : 'Ver resultado'}</button>`;
    raiz.querySelector('#mr-sig').addEventListener('click', () => { anim = null; prob.i++; prob.resp = null; mostrarProblema(); });
    anim = { t: 0, vel: Math.max(1, p.tmax / 5) };
  }

  // ---------- 3. ¿Qué gráfico es? ----------
  const PREGUNTAS = [
    { t: 'Está <b>quieto</b>: su velocidad es cero.', ok: m => m.v === 0, x: 'La recta es <b>horizontal</b>: pasa el tiempo y la posición no cambia.' },
    { t: 'Va <b>hacia atrás</b>, acercándose al origen.', ok: m => m.v < 0, x: 'La recta <b>baja</b>: la posición disminuye, la velocidad es negativa.' },
    { t: 'Es el <b>más rápido</b> de los cuatro.', unico: l => Math.max(...l.map(m => Math.abs(m.v))), ok: (m, l) => Math.abs(m.v) === Math.max(...l.map(k => Math.abs(k.v))), x: 'Es la recta <b>más inclinada</b>: recorre más metros en cada segundo.' },
    { t: 'Avanza, pero es el <b>más lento</b> de los que avanzan.', ok: (m, l) => m.v > 0 && m.v === Math.min(...l.filter(k => k.v > 0).map(k => k.v)), x: 'Entre las rectas que suben, es la <b>menos inclinada</b>.' },
    { t: '<b>Parte del origen</b> (x₀ = 0 m) y avanza.', ok: m => m.x0 === 0 && m.v > 0, x: 'La recta <b>empieza en 0</b> sobre el eje de posición y sube.' },
    { t: 'Va a <b>20 m/s</b> hacia adelante.', ok: m => m.v === 20, x: 'Cada 5 s sube 100 m: 100 m / 5 s = 20 m/s.' },
    { t: 'Va a <b>10 m/s</b> hacia adelante.', ok: m => m.v === 10, x: 'Cada 10 s sube 100 m: 100 m / 10 s = 10 m/s.' },
  ];
  let gr = null;

  function generarGrafico() {
    for (let intento = 0; intento < 200; intento++) {
      const lista = [];
      while (lista.length < 4) {
        const m = { v: elegir([-15, -10, -5, 0, 5, 10, 15, 20, 30]), x0: elegir([0, 50, 100, 150, 200, 300]) };
        if (m.x0 + m.v * 10 < 0 || m.x0 + m.v * 10 > 400) continue;
        if (!lista.some(k => k.v === m.v && k.x0 === m.x0)) lista.push(m);
      }
      const posibles = PREGUNTAS.filter(q => lista.filter(m => q.ok(m, lista)).length === 1);
      const q = posibles.find(x => !gr || !gr.usadas.includes(x.t)) || posibles[0];
      if (q) return { lista, q, ok: lista.findIndex(m => q.ok(m, lista)) };
    }
  }

  function empezarGraficos() {
    raiz.querySelector('#mr-controles').innerHTML = '';
    gr = { i: 0, aciertos: 0, usadas: [] };
    siguienteGrafico();
  }

  function siguienteGrafico() {
    if (gr.i >= 6) return finGraficos();
    Object.assign(gr, generarGrafico(), { resp: null });
    gr.usadas.push(gr.q.t);
    pintarGraficos();
  }

  function pintarGraficos() {
    const pw = 170, ph = 190, tmax = 10, xmax = 400;
    let s = `<rect width="${W}" height="${HG}" rx="14" fill="#12143a"/>`;
    gr.lista.forEach((m, k) => {
      const ox = 22 + k * 184, oy = 44, X = t => ox + 26 + t / tmax * (pw - 34), Y = x => oy + ph - 24 - x / xmax * (ph - 40);
      const est = gr.resp === null ? '' : k === gr.ok ? 'ok' : k === gr.resp ? 'mal' : 'off';
      s += `<g class="mr-panel ${est}" data-k="${k}"><rect x="${ox}" y="${oy - 30}" width="${pw}" height="${ph + 46}" rx="12" class="mr-panel-fondo"/>
        <text x="${ox + pw / 2}" y="${oy - 8}" text-anchor="middle" class="mr-letra">${'ABCD'[k]}</text>
        ${[0, 100, 200, 300, 400].map(x => `<path d="M${X(0)},${Y(x)} H${X(tmax)}" stroke="#2a2e6e"/><text x="${X(0) - 4}" y="${Y(x) + 3}" text-anchor="end" class="mr-eje chico">${x}</text>`).join('')}
        ${[0, 5, 10].map(t => `<text x="${X(t)}" y="${Y(0) + 14}" text-anchor="middle" class="mr-eje chico">${t}</text>`).join('')}
        <path d="M${X(0)},${Y(xmax)} V${Y(0)} H${X(tmax)}" stroke="#8f96b8" fill="none"/>
        ${linea([[X(0), Y(m.x0)], [X(tmax), Y(m.x0 + m.v * tmax)]], C1)}
        ${gr.resp !== null ? `<text x="${ox + pw / 2}" y="${oy + ph + 8}" text-anchor="middle" class="mr-eje">v = ${m.v} m/s · x₀ = ${m.x0} m</text>` : ''}</g>`;
    });
    s += `<text x="${W / 2}" y="${HG - 6}" text-anchor="middle" class="mr-tit">Cada gráfico: posición (m) en función del tiempo (s)</text>`;
    const svg = raiz.querySelector('#mr-graf');
    svg.innerHTML = s;
    svg.onclick = e => { const g = e.target.closest('[data-k]'); if (g && gr.resp === null) responderGrafico(+g.dataset.k); };
    const info = raiz.querySelector('#mr-info');
    info.innerHTML = `<div class="md-cab"><span>Pregunta ${gr.i + 1} de 6</span><span>⭐ ${gr.aciertos}</span></div>
      <div class="barra"><div style="width:${gr.i / 6 * 100}%"></div></div>
      <h2>📈 ¿Qué gráfico es?</h2><p class="nx-caso">🚙 ${gr.q.t}</p><p class="nu-ayuda">Tocá el gráfico A, B, C o D que corresponde.</p>
      ${gr.resp !== null ? `<div class="feedback ${gr.resp === gr.ok ? 'ok' : 'mal'}"><p class="fb-titulo">${gr.resp === gr.ok ? '✅ ¡Correcto!' : `✖ Era el gráfico ${'ABCD'[gr.ok]}`}</p><p>${gr.q.x}</p></div>
        <button class="btn primario" id="mr-gsig">${gr.i + 1 < 6 ? 'Siguiente →' : 'Ver resultado'}</button>` : ''}`;
    info.querySelector('#mr-gsig')?.addEventListener('click', () => { gr.i++; siguienteGrafico(); });
  }

  function responderGrafico(k) {
    gr.resp = k;
    if (k === gr.ok) gr.aciertos++;
    pintarGraficos();
  }

  function finGraficos() {
    raiz.querySelector('#mr-info').innerHTML = `<h2>📈 Resultado</h2><div class="feedback ${gr.aciertos >= 5 ? 'ok' : 'mal'}"><p class="fb-titulo">${gr.aciertos >= 5 ? '🏆' : '💪'} ${gr.aciertos} de 6 correctas</p>
      <p>Recordá: en el gráfico posición-tiempo, la <b>inclinación</b> de la recta es la <b>velocidad</b>.</p></div><button class="btn primario" id="mr-gotra">Otra ronda</button>`;
    raiz.querySelector('#mr-gotra').addEventListener('click', empezarGraficos);
  }

  return { iniciar };
})();
