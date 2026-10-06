// Química · Estados de la materia y cambios de estado: simulador de partículas con curva de calentamiento,
// mapa de los cambios de estado y preguntas con situaciones cotidianas.
const Estados = (function () {
  const { dosTonos, ojo, esfera, estrellas } = Arte;
  const W = 760, H = 420;

  // Una molécula de agua: oxígeno rojo y dos hidrógenos blancos.
  const molecula = (x, y, a, e = 1) => {
    const h = k => [x + e * (k * 5 * Math.cos(a) - 4 * Math.sin(a)), y + e * (k * 5 * Math.sin(a) + 4 * Math.cos(a))];
    const [ax, ay] = h(-1), [bx, by] = h(1);
    return esfera(ax, ay, 2.9 * e, '#f1f3f5') + esfera(bx, by, 2.9 * e, '#f1f3f5') + esfera(x, y, 4.8 * e, '#ff6b6b');
  };

  // ---------- Curva de calentamiento del agua (1 kg, presión normal) ----------
  // Energía en kJ para cada tramo: calentar el hielo, fundirlo, calentar el agua, hervirla y calentar el vapor.
  const T_MIN = -40, T_MAX = 140;
  const TRAMOS = [
    { fase: 'solido', e: 2.1 * 40, t0: T_MIN, t1: 0 },
    { fase: 'fusion', e: 334, t0: 0, t1: 0 },
    { fase: 'liquido', e: 4.18 * 100, t0: 0, t1: 100 },
    { fase: 'ebullicion', e: 2260, t0: 100, t1: 100 },
    { fase: 'gas', e: 2.0 * 40, t0: 100, t1: T_MAX },
  ];
  const E_TOTAL = TRAMOS.reduce((a, t) => a + t.e, 0);
  function estadoDe(E) {
    let acum = 0;
    for (const t of TRAMOS) {
      if (E <= acum + t.e || t === TRAMOS[TRAMOS.length - 1]) {
        const f = Math.max(0, Math.min(1, (E - acum) / t.e));
        return { fase: t.fase, f, T: t.t0 + (t.t1 - t.t0) * f };
      }
      acum += t.e;
    }
  }
  const energiaPara = T => {
    if (T <= 0) return (T - T_MIN) * 2.1;
    if (T <= 100) return 84 + 334 + T * 4.18;
    return 84 + 334 + 418 + 2260 + (T - 100) * 2;
  };

  const PROPIEDADES = {
    solido: { n: 'Sólido', e: '🧊', forma: 'Propia (no cambia)', volumen: 'Propio', comprime: 'No', part: 'Muy juntas y ordenadas. Solo vibran en su lugar.' },
    liquido: { n: 'Líquido', e: '💧', forma: 'La del recipiente', volumen: 'Propio', comprime: 'Casi nada', part: 'Juntas pero desordenadas. Se deslizan unas sobre otras.' },
    gas: { n: 'Gaseoso', e: '💨', forma: 'La del recipiente', volumen: 'Ocupa todo el recipiente', comprime: 'Sí, mucho', part: 'Muy separadas. Se mueven rápido en todas direcciones.' },
  };

  // ---------- Caja de partículas ----------
  const B = { x0: 120, x1: 380, y0: 62, y1: 330 };
  const N = 40, COLS = 8;
  let parts = [];
  function crearParticulas() {
    parts = Array.from({ length: N }, (_, i) => ({ x: B.x0 + 30 + (i % COLS) * 28, y: B.y1 - 20 - Math.floor(i / COLS) * 26, vx: 0, vy: 0, a: Math.random() * 6, va: 0, fase: 'solido' }));
  }

  function moverParticulas(dt, est) {
    // Cuántas partículas están en cada estado según el momento de la curva.
    let nSol = 0, nGas = 0;
    if (est.fase === 'solido') nSol = N;
    else if (est.fase === 'fusion') nSol = Math.round(N * (1 - est.f));
    else if (est.fase === 'ebullicion') nGas = Math.round(N * est.f);
    else if (est.fase === 'gas') nGas = N;
    const nLiq = N - nSol - nGas;
    // El agua líquida ocupa el fondo; el hielo flota encima.
    const filasLiq = Math.ceil(nLiq / 9), altoLiq = filasLiq * 25;
    const sup = B.y1 - altoLiq;
    const vel = 40 + Math.max(0, est.T) * 1.1, velGas = 170 + Math.max(0, est.T - 100) * 3;
    let kSol = 0;
    parts.forEach((p, i) => {
      // Las primeras en pasar al gas son las de la superficie del líquido (las de índice más alto).
      p.fase = i < nSol ? 'solido' : i >= N - nGas ? 'gas' : 'liquido';
      if (p.fase === 'solido') {
        const k = kSol++, fila = Math.floor(k / COLS), col = k % COLS;
        const bx = B.x0 + 32 + col * 28 + (fila % 2) * 8, by = sup - 14 - fila * 25;
        const amp = 1 + (est.T - T_MIN) / 40 * 1.6, t = performance.now() / 1000;
        p.x += (bx + Math.sin(t * 9 + i) * amp - p.x) * Math.min(1, dt * 8);
        p.y += (by + Math.cos(t * 8 + i * 1.3) * amp - p.y) * Math.min(1, dt * 8);
        p.a += (0.5 - p.a) * Math.min(1, dt * 4);
        p.vx = p.vy = 0;
        return;
      }
      const v = p.fase === 'gas' ? velGas : vel;
      if (Math.hypot(p.vx, p.vy) < 1) { const a = Math.random() * 6.28; p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v; }
      const m = Math.hypot(p.vx, p.vy);
      p.vx = p.vx / m * v; p.vy = p.vy / m * v;
      if (p.fase === 'liquido') { const a = (Math.random() - 0.5) * 2.5 * dt; [p.vx, p.vy] = [p.vx * Math.cos(a) - p.vy * Math.sin(a), p.vx * Math.sin(a) + p.vy * Math.cos(a)]; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.a += (p.fase === 'gas' ? 6 : 2) * dt;
      const top = p.fase === 'liquido' ? sup + 10 : B.y0 + 12;
      if (p.x < B.x0 + 10) { p.x = B.x0 + 10; p.vx = Math.abs(p.vx); }
      if (p.x > B.x1 - 10) { p.x = B.x1 - 10; p.vx = -Math.abs(p.vx); }
      if (p.y > B.y1 - 10) { p.y = B.y1 - 10; p.vy = -Math.abs(p.vy); }
      if (p.y < top) { if (p.fase === 'liquido') p.y += (top - p.y) * Math.min(1, dt * 6); p.vy = Math.abs(p.vy); }
    });
    return { sup, nLiq };
  }

  function escenaSim(est, info) {
    const P = est.fase === 'fusion' || est.fase === 'ebullicion' ? null : est.fase;
    const fuego = potencia > 0, frio = potencia < 0;
    const tPct = (est.T - T_MIN) / (T_MAX - T_MIN);
    const llama = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,-40 C-20,-14 -14,0 0,0 C14,0 20,-14 0,-40 Z" fill="#ff922b"/><path d="M0,-24 C-9,-10 -6,0 0,0 C6,0 9,-10 0,-24 Z" fill="#ffe066"/></g>`;
    return `<defs><radialGradient id="es-fondo" cx="0.4" cy="0.4" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <linearGradient id="es-termo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#4dabf7"/><stop offset="0.4" stop-color="#69db7c"/><stop offset="0.75" stop-color="#ff922b"/><stop offset="1" stop-color="#e03131"/></linearGradient></defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#es-fondo)"/>${estrellas(24, W, H)}
      <ellipse cx="${(B.x0 + B.x1) / 2 + 6}" cy="${B.y1 + 32}" rx="170" ry="10" fill="#05061a" opacity="0.45"/>
      ${info.nLiq ? `<rect x="${B.x0 + 4}" y="${info.sup}" width="${B.x1 - B.x0 - 8}" height="${B.y1 - info.sup - 4}" rx="10" fill="#4dabf7" opacity="0.22"/><path d="M${B.x0 + 4},${info.sup} H${B.x1 - 4}" stroke="#a5d8ff" stroke-width="2" opacity="0.6"/>` : ''}
      <rect x="${B.x0}" y="${B.y0}" width="${B.x1 - B.x0}" height="${B.y1 - B.y0}" rx="16" fill="none" stroke="#e7f5ff" stroke-width="4"/>
      <rect x="${B.x0 - 8}" y="${B.y0 - 14}" width="${B.x1 - B.x0 + 16}" height="16" rx="6" fill="#868e96"/>
      <path d="M${B.x0 + 14},${B.y0 + 16} V${B.y1 - 20}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.25"/>
      <rect x="${B.x0 - 20}" y="${B.y1 + 8}" width="${B.x1 - B.x0 + 40}" height="16" rx="5" fill="#495057"/>
      ${fuego ? [-60, 0, 60].map((d, i) => llama((B.x0 + B.x1) / 2 + d, B.y1 + 62, 0.7 + 0.15 * Math.sin(performance.now() / 120 + i))).join('') : ''}
      ${frio ? [-60, 0, 60].map(d => `<g transform="translate(${(B.x0 + B.x1) / 2 + d} ${B.y1 + 48})"><rect x="-16" y="-12" width="32" height="24" rx="5" fill="#d0ebff" stroke="#74c0fc" stroke-width="2"/><path d="M-8,0 h16 M0,-8 v16 M-6,-6 l12,12 M6,-6 l-12,12" stroke="#4dabf7" stroke-width="2"/></g>`).join('') : ''}
      <g transform="translate(470 50)">
        <rect x="0" y="0" width="26" height="250" rx="13" fill="#e9ecef" stroke="#adb5bd" stroke-width="2"/>
        <rect x="6" y="${8 + 234 * (1 - tPct)}" width="14" height="${234 * tPct + 10}" rx="7" fill="url(#es-termo)"/>
        <circle cx="13" cy="262" r="20" fill="${est.T > 100 ? '#e03131' : est.T > 0 ? '#69db7c' : '#4dabf7'}" stroke="#adb5bd" stroke-width="2"/>
        ${[-40, 0, 50, 100, 140].map(v => { const y = 8 + 234 * (1 - (v - T_MIN) / (T_MAX - T_MIN)); return `<path d="M26,${y} h8" stroke="#c9ccf5" stroke-width="2"/><text x="38" y="${y + 4}" class="es-marca ${v === 0 || v === 100 ? 'clave' : ''}">${v} °C</text>`; }).join('')}
      </g>
      <g transform="translate(640 120)"><text text-anchor="middle" class="es-temp">${est.T.toFixed(0)} °C</text>
        <text y="44" text-anchor="middle" class="es-fase">${P ? PROPIEDADES[P].e + ' ' + PROPIEDADES[P].n.toUpperCase() : est.fase === 'fusion' ? '🧊→💧 FUSIÓN' : '💧→💨 EBULLICIÓN'}</text>
        ${!P ? `<text y="70" text-anchor="middle" class="es-sub">la temperatura no cambia</text>` : ''}</g>
      <g id="es-part"></g>`;
  }

  function curva(est) {
    const GW = 520, GH = 170, x0 = 54, y0 = 14, w = GW - x0 - 14, h = GH - y0 - 30;
    const X = E => x0 + E / E_TOTAL * w, Y = T => y0 + h - (T - T_MIN) / (T_MAX - T_MIN) * h;
    let acum = 0, pts = [], etq = '';
    const nombres = { solido: 'hielo', fusion: 'fusión', liquido: 'agua', ebullicion: 'ebullición (vaporización)', gas: 'vapor' };
    TRAMOS.forEach(t => { pts.push([X(acum), Y(t.t0)]); etq += `<text x="${X(acum + t.e / 2) + (t.fase === 'solido' ? -10 : 0)}" y="${Y(t.t1) + (t.fase === 'fusion' ? 16 : -8)}" text-anchor="${t.fase === 'solido' ? 'end' : 'middle'}" class="es-tramo ${t.fase === est.fase ? 'activo' : ''}">${nombres[t.fase]}</text>`; acum += t.e; });
    pts.push([X(acum), Y(T_MAX)]);
    const E = energia;
    return `<svg viewBox="0 0 ${GW} ${GH}" class="es-curva" role="img" aria-label="Curva de calentamiento del agua">
      <rect width="${GW}" height="${GH}" rx="10" class="es-curva-fondo"/>
      ${[-40, 0, 100, 140].map(v => `<path d="M${x0},${Y(v)} H${x0 + w}" class="es-grilla"/><text x="${x0 - 6}" y="${Y(v) + 4}" text-anchor="end" class="es-eje">${v} °C</text>`).join('')}
      <polyline points="${pts.map(p => p.join(',')).join(' ')}" class="es-linea"/>
      <polyline points="${pts.filter(p => p[0] <= X(E)).map(p => p.join(',')).join(' ')} ${X(E)},${Y(est.T)}" class="es-linea hecha"/>
      ${etq}<circle cx="${X(E)}" cy="${Y(est.T)}" r="6" class="es-punto"/>
      <text x="${x0 + w}" y="${GH - 8}" text-anchor="end" class="es-eje">energía entregada (calor) →</text></svg>`;
  }

  // ---------- Cambios de estado ----------
  const NODOS = { solido: [140, 320], liquido: [620, 320], gas: [380, 96] };
  const CAMBIOS = {
    fusion: { n: 'Fusión', de: 'solido', a: 'liquido', calor: true, curva: -1, d: 'Un sólido se convierte en líquido al recibir calor. Las partículas vibran tanto que se salen de su lugar.', ej: '🧊 Un hielo que se derrite · 🍫 un chocolate al sol', temp: 'El agua se funde a 0 °C (punto de fusión).' },
    solidificacion: { n: 'Solidificación', de: 'liquido', a: 'solido', calor: false, curva: 1, d: 'Un líquido se convierte en sólido al perder calor. Las partículas se frenan y se ordenan.', ej: '🧊 Agua en el freezer · 🕯️ la cera de una vela que se endurece', temp: 'Ocurre a la misma temperatura que la fusión: 0 °C para el agua.' },
    vaporizacion: { n: 'Vaporización', de: 'liquido', a: 'gas', calor: true, curva: -1, d: 'Un líquido se convierte en gas. Si pasa solo en la superficie es <b>evaporación</b>; si pasa en todo el líquido, con burbujas, es <b>ebullición</b>.', ej: '👕 La ropa que se seca · ♨️ el agua que hierve en la pava', temp: 'El agua hierve a 100 °C (punto de ebullición), pero se evapora a cualquier temperatura.' },
    condensacion: { n: 'Condensación', de: 'gas', a: 'liquido', calor: false, curva: 1, d: 'Un gas se convierte en líquido al enfriarse. Las partículas se frenan y se juntan en gotitas.', ej: '🪞 El espejo empañado · 🥤 gotitas en un vaso frío · 🌿 el rocío', temp: 'Pasa cuando el vapor toca algo más frío.' },
    sublimacion: { n: 'Sublimación', de: 'solido', a: 'gas', calor: true, curva: -1, d: 'Un sólido pasa directamente a gas, sin hacerse líquido.', ej: '🌫️ El hielo seco que larga "humo" · la naftalina que se achica en el placard', temp: 'Algunas sustancias, como el hielo seco (CO₂ sólido), lo hacen a presión normal.' },
    sublimacion_inversa: { n: 'Sublimación inversa', de: 'gas', a: 'solido', calor: false, curva: 1, d: 'Un gas pasa directamente a sólido, sin hacerse líquido. También se la llama <b>deposición</b>.', ej: '❄️ La escarcha en el pasto o en el freezer', temp: 'Pasa en noches muy frías: el vapor de agua del aire se convierte en cristales de hielo.' },
  };
  function flecha(k, c, estado) {
    const [ax, ay] = NODOS[c.de], [bx, by] = NODOS[c.a];
    // Se acorta para que no tape las cajas y se curva hacia un lado según el sentido.
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const sx = ax + ux * 100, sy = ay + uy * 76, ex = bx - ux * 100, ey = by - uy * 76;
    const off = 42, mx = (sx + ex) / 2 - uy * off, my = (sy + ey) / 2 + ux * off;
    const col = c.calor ? '#ff8787' : '#74c0fc';
    const lx = (sx + ex) / 2 - uy * off * 1.15, ly = (sy + ey) / 2 + ux * off * 1.15;
    return `<g class="es-cambio ${estado}" data-c="${k}">
      <path d="M${sx},${sy} Q${mx},${my} ${ex},${ey}" stroke="transparent" stroke-width="26" fill="none"/>
      <path d="M${sx},${sy} Q${mx},${my} ${ex},${ey}" stroke="${col}" stroke-width="5" fill="none" marker-end="url(#es-p-${c.calor ? 'c' : 'f'})" class="es-trazo"/>
      <g transform="translate(${lx} ${ly})"><rect x="${-c.n.length * 3.9 - 12}" y="-13" width="${c.n.length * 7.8 + 24}" height="26" rx="13" fill="#12143a" stroke="${col}" stroke-width="2"/>
        <text y="5" text-anchor="middle" class="es-cambio-t">${c.n}</text></g></g>`;
  }
  function cajaEstado(k) {
    const [x, y] = NODOS[k], P = PROPIEDADES[k];
    let ps = '';
    if (k === 'solido') for (let f = 0; f < 3; f++) for (let c = 0; c < 5; c++) ps += molecula(x - 52 + c * 26 + (f % 2) * 6, y + 26 - f * 22, 0.4);
    if (k === 'liquido') [[-50, 26], [-24, 30], [2, 24], [28, 30], [52, 24], [-40, 6], [-12, 8], [16, 4], [44, 8], [-26, -14], [6, -12], [34, -16]].forEach(([dx, dy], i) => { ps += molecula(x + dx, y + dy, i * 1.3); });
    if (k === 'gas') [[-55, 20], [10, -12], [50, 28], [-20, -30], [40, -32], [-48, -20]].forEach(([dx, dy], i) => { ps += molecula(x + dx, y + dy, i * 1.9); });
    return `<g><rect x="${x - 82}" y="${y - 58}" width="164" height="112" rx="16" fill="#1f2256" stroke="#3a3e85" stroke-width="2"/>
      ${k === 'liquido' ? `<rect x="${x - 76}" y="${y - 30}" width="152" height="78" rx="10" fill="#4dabf7" opacity="0.2"/>` : ''}${ps}
      <g transform="translate(${x} ${y - 72})"><rect x="-58" y="-14" width="116" height="28" rx="14" fill="#ffd166"/><text y="5" text-anchor="middle" class="es-nodo">${P.e} ${P.n.toUpperCase()}</text></g></g>`;
  }
  function mapa(marcado, error) {
    return `<defs><radialGradient id="es-fondo2" cx="0.5" cy="0.5" r="0.8"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <marker id="es-p-c" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#ff8787"/></marker>
        <marker id="es-p-f" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#74c0fc"/></marker></defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#es-fondo2)"/>${estrellas(24, W, H)}
      ${Object.keys(NODOS).map(cajaEstado).join('')}
      ${Object.entries(CAMBIOS).map(([k, c]) => flecha(k, c, k === marcado ? 'sel' : k === error ? 'mal' : marcado ? 'off' : '')).join('')}
      <g transform="translate(18 ${H - 18})"><rect x="0" y="-16" width="300" height="24" rx="12" fill="#12143a" opacity="0.85"/>
        <path d="M12,-4 h26" stroke="#ff8787" stroke-width="4"/><text x="44" y="0" class="es-ley">absorbe calor</text>
        <path d="M150,-4 h26" stroke="#74c0fc" stroke-width="4"/><text x="182" y="0" class="es-ley">libera calor</text></g>`;
  }

  const SITUACIONES = [
    { t: 'Un cubito de hielo se derrite en un vaso.', e: '🧊', ok: 'fusion' },
    { t: 'Un chocolate se derrite en la mano.', e: '🍫', ok: 'fusion' },
    { t: 'Se funde metal para fabricar una moneda.', e: '🪙', ok: 'fusion' },
    { t: 'El agua de una cubetera se congela en el freezer.', e: '🧊', ok: 'solidificacion' },
    { t: 'La cera que gotea de una vela se endurece.', e: '🕯️', ok: 'solidificacion' },
    { t: 'La lava de un volcán se enfría y forma roca.', e: '🌋', ok: 'solidificacion' },
    { t: 'Un charco se seca al sol.', e: '☀️', ok: 'vaporizacion' },
    { t: 'El agua hierve en la pava.', e: '♨️', ok: 'vaporizacion' },
    { t: 'La ropa colgada se seca.', e: '👕', ok: 'vaporizacion' },
    { t: 'El espejo del baño se empaña después de bañarse.', e: '🪞', ok: 'condensacion' },
    { t: 'Aparecen gotitas afuera de una botella fría.', e: '🥤', ok: 'condensacion' },
    { t: 'A la mañana hay rocío en las hojas.', e: '🌿', ok: 'condensacion' },
    { t: 'Un trozo de hielo seco larga "humo" sin derretirse.', e: '🌫️', ok: 'sublimacion' },
    { t: 'Las bolitas de naftalina se achican en el placard.', e: '⚪', ok: 'sublimacion' },
    { t: 'En una noche helada se forma escarcha sobre el pasto.', e: '❄️', ok: 'sublimacion_inversa' },
    { t: 'Se forma escarcha en las paredes del freezer.', e: '🧊', ok: 'sublimacion_inversa' },
  ];

  // ---------- Estado y vistas ----------
  let raiz, modo = 'sim', energia = energiaPara(-20), potencia = 0, velocidad = 1, sel = null, quiz = null, ultimo = 0;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🧊 Estados de la materia y cambios de estado</h1>
        <p>La materia puede estar en estado <b>sólido</b>, <b>líquido</b> o <b>gaseoso</b>. Lo que cambia es cómo están y cómo se mueven sus <b>partículas</b>. Al dar o quitar calor, la materia cambia de estado, pero <b>sigue siendo la misma sustancia</b>.</p>
      </div>
      <div class="segmentado" id="es-modos">
        <button data-m="sim">🔥 Calentar y enfriar</button>
        <button data-m="mapa">🔄 Los cambios de estado</button>
        <button data-m="quiz">❓ ¿Qué cambio es?</button>
      </div>
      <div class="nu-grid">
        <div class="panel nu-escena"><div class="nx-scroll"><svg id="es-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Partículas de agua en un recipiente"></svg></div>
          <div id="es-controles"></div></div>
        <aside class="panel nu-info" id="es-info"></aside>
      </div>`;
    raiz.querySelectorAll('#es-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    raiz.querySelector('#es-svg').addEventListener('click', e => {
      const g = e.target.closest('[data-c]');
      if (g && modo === 'mapa') { sel = g.dataset.c; pintarMapa(); }
    });
    crearParticulas();
    cambiarModo('sim');
    requestAnimationFrame(bucle);
  }

  function cambiarModo(m) {
    modo = m;
    raiz.querySelectorAll('#es-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    if (m === 'sim') vistaSim();
    else if (m === 'mapa') { raiz.querySelector('#es-controles').innerHTML = '<p class="nu-ayuda-esc">👆 Tocá una flecha para ver cómo es ese cambio de estado.</p>'; pintarMapa(); }
    else empezarQuiz();
  }

  // ---------- 1. Simulador ----------
  function vistaSim() {
    raiz.querySelector('#es-controles').innerHTML = `<div class="mr-ctrl">
        <div class="nv-botones"><div class="segmentado oscuro" id="es-pot">
          <button data-p="-1">❄️ Enfriar</button><button data-p="0">⏸ Nada</button><button data-p="1">🔥 Calentar</button></div>
          <div class="segmentado oscuro" id="es-vel"><button data-v="1">x1</button><button data-v="3">x3</button></div></div>
        <div class="nu-viajeros"><span class="es-empezar">Empezar con:</span>
          <button data-t="-20">🧊 Hielo a −20 °C</button><button data-t="25">💧 Agua a 25 °C</button><button data-t="120">💨 Vapor a 120 °C</button></div>
        <div class="es-curva-caja" id="es-curva"></div></div>`;
    const c = raiz.querySelector('#es-controles');
    c.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { potencia = +b.dataset.p; marcarBotones(); }));
    c.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { velocidad = +b.dataset.v; marcarBotones(); }));
    c.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => {
      energia = energiaPara(+b.dataset.t); potencia = 0;
      const est = estadoDe(energia);
      parts.forEach(p => { p.vx = p.vy = 0; if (est.fase === 'gas') p.y = B.y0 + 20 + Math.random() * 200; });
      marcarBotones();
    }));
    marcarBotones();
  }
  function marcarBotones() {
    raiz.querySelectorAll('#es-pot [data-p]').forEach(b => b.classList.toggle('activo', +b.dataset.p === potencia));
    raiz.querySelectorAll('#es-vel [data-v]').forEach(b => b.classList.toggle('activo', +b.dataset.v === velocidad));
  }

  let ultimaInfo = '';
  function infoSim(est) {
    const P = est.fase === 'fusion' || est.fase === 'ebullicion' ? null : est.fase;
    let html;
    if (P) {
      const p = PROPIEDADES[P];
      html = `<h2>${p.e} Estado ${p.n.toLowerCase()}</h2>
        <table class="es-tabla"><tr><th>Forma</th><td>${p.forma}</td></tr><tr><th>Volumen</th><td>${p.volumen}</td></tr><tr><th>¿Se comprime?</th><td>${p.comprime}</td></tr><tr><th>Partículas</th><td>${p.part}</td></tr></table>
        <p class="nu-ayuda">${potencia > 0 ? '🔥 Al recibir calor, las partículas se mueven cada vez más rápido y la temperatura sube.' : potencia < 0 ? '❄️ Al perder calor, las partículas se frenan y la temperatura baja.' : 'Tocá 🔥 Calentar o ❄️ Enfriar.'}</p>`;
    } else {
      const fus = est.fase === 'fusion';
      html = `<h2>${fus ? '🧊→💧 Fusión' : '💧→💨 Ebullición'}</h2>
        <p class="nv-clave">🌡️ La temperatura se queda en <b>${fus ? '0' : '100'} °C</b> mientras dura el cambio de estado: toda la energía se usa para ${fus ? 'separar las partículas del hielo' : 'que las partículas escapen del líquido'}.</p>
        <p>${fus ? 'Fijate que el <b>hielo flota</b> sobre el agua: sus partículas ordenadas ocupan más lugar.' : 'Hervir el agua necesita <b>mucha más energía</b> que fundir el hielo: por eso este tramo de la curva es tan largo.'}</p>
        <p class="nu-ayuda">${Math.round(est.f * 100)} % ${fus ? 'del hielo ya se fundió' : 'del agua ya se evaporó'}${potencia < 0 ? ' (enfriando: ' + (fus ? 'se está solidificando' : 'se está condensando') + ')' : ''}.</p>`;
    }
    html += `<details class="md-ayudas"><summary>📚 Puntos de fusión y ebullición</summary>
      <table class="es-tabla"><tr><th>Sustancia</th><td><b>Funde</b></td><td><b>Hierve</b></td></tr><tr><th>Agua</th><td>0 °C</td><td>100 °C</td></tr><tr><th>Alcohol</th><td>−114 °C</td><td>78 °C</td></tr><tr><th>Hierro</th><td>1538 °C</td><td>2862 °C</td></tr><tr><th>Oxígeno</th><td>−218 °C</td><td>−183 °C</td></tr></table>
      <p>A temperatura ambiente, cada sustancia está en un estado distinto según sus puntos de fusión y de ebullición.</p></details>`;
    if (html !== ultimaInfo) { raiz.querySelector('#es-info').innerHTML = html; ultimaInfo = html; }
  }

  function bucle(t) {
    const dt = Math.min(0.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    if (!raiz.hidden && modo === 'sim') {
      energia = Math.max(0, Math.min(E_TOTAL, energia + potencia * 110 * velocidad * dt));
      if ((energia <= 0 && potencia < 0) || (energia >= E_TOTAL && potencia > 0)) { potencia = 0; marcarBotones(); }
      const est = estadoDe(energia);
      const info = moverParticulas(dt, est);
      const svg = raiz.querySelector('#es-svg');
      svg.innerHTML = escenaSim(est, info);
      svg.querySelector('#es-part').innerHTML = parts.map(p => molecula(p.x, p.y, p.a)).join('');
      raiz.querySelector('#es-curva').innerHTML = curva(est);
      infoSim(est);
    }
    requestAnimationFrame(bucle);
  }

  // ---------- 2. Mapa de cambios ----------
  function pintarMapa() {
    raiz.querySelector('#es-svg').innerHTML = mapa(sel);
    const info = raiz.querySelector('#es-info');
    if (!sel) {
      info.innerHTML = `<h2>🔄 Los cambios de estado</h2><p>Hay <b>seis</b> cambios de estado. Los que van hacia arriba (hacia el gas) <b style="color:#e03131">absorben calor</b>; los que bajan (hacia el sólido) <b style="color:#1c7ed6">liberan calor</b>.</p>
        <div class="nu-lista">${Object.entries(CAMBIOS).map(([k, c]) => `<button data-c="${k}"><i style="background:${c.calor ? '#ff8787' : '#74c0fc'}"></i>${c.n}</button>`).join('')}</div>
        <p class="nu-ayuda">En todos los cambios de estado la sustancia <b>sigue siendo la misma</b>: son cambios físicos.</p>`;
      info.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => { sel = b.dataset.c; pintarMapa(); }));
      return;
    }
    const c = CAMBIOS[sel];
    info.innerHTML = `<h2>${c.n}</h2>
      <p class="es-flujo">${PROPIEDADES[c.de].e} ${PROPIEDADES[c.de].n} <b>→</b> ${PROPIEDADES[c.a].e} ${PROPIEDADES[c.a].n}</p>
      <span class="nv-sello ${c.calor ? 'calor' : ''}">${c.calor ? '🔥 Absorbe calor' : '❄️ Libera calor'}</span>
      <p>${c.d}</p><p class="nv-clave">💡 ${c.ej}</p><p class="nu-ayuda">🌡️ ${c.temp}</p>
      <button class="btn chico" id="es-volver">← Ver todos</button>`;
    info.querySelector('#es-volver').addEventListener('click', () => { sel = null; pintarMapa(); });
  }

  // ---------- 3. ¿Qué cambio es? ----------
  const RONDA = 8;
  function empezarQuiz() {
    raiz.querySelector('#es-controles').innerHTML = '';
    quiz = { preguntas: Util.tomar('estados', SITUACIONES, RONDA, s => s.t), i: 0, aciertos: 0, resp: null };
    pintarQuiz();
  }
  function pintarQuiz() {
    const info = raiz.querySelector('#es-info');
    if (quiz.i >= RONDA) {
      raiz.querySelector('#es-svg').innerHTML = mapa(null);
      info.innerHTML = `<h2>🏁 Resultado</h2><div class="feedback ${quiz.aciertos >= 6 ? 'ok' : 'mal'}"><p class="fb-titulo">${quiz.aciertos >= 6 ? '🏆' : '💪'} ${quiz.aciertos} de ${RONDA} correctas</p>
        <p>Pensá siempre de qué estado parte y a cuál llega.</p></div><button class="btn primario" id="es-otra">Otra ronda</button>`;
      info.querySelector('#es-otra').addEventListener('click', empezarQuiz);
      return;
    }
    const q = quiz.preguntas[quiz.i], hay = quiz.resp !== null;
    if (!quiz.opciones || quiz.opcionesDe !== quiz.i) {
      quiz.opciones = Util.mezclar([q.ok, ...Util.mezclar(Object.keys(CAMBIOS).filter(k => k !== q.ok)).slice(0, 3)]);
      quiz.opcionesDe = quiz.i;
    }
    raiz.querySelector('#es-svg').innerHTML = mapa(hay ? q.ok : null, hay && quiz.resp !== q.ok ? quiz.resp : null);
    const c = CAMBIOS[q.ok];
    info.innerHTML = `<div class="md-cab"><span>Situación ${quiz.i + 1} de ${RONDA}</span><span>⭐ ${quiz.aciertos}</span></div>
      <div class="barra"><div style="width:${quiz.i / RONDA * 100}%"></div></div>
      <p class="nx-caso">${q.e} ${q.t}</p><p class="nu-pregunta">¿Qué cambio de estado ocurre?</p>
      <div class="nu-opciones">${quiz.opciones.map(k => `<button class="btn-opcion${hay ? (k === q.ok ? ' correcta' : k === quiz.resp ? ' incorrecta' : '') : ''}" data-r="${k}" ${hay ? 'disabled' : ''}>${CAMBIOS[k].n}</button>`).join('')}</div>
      ${hay ? `<div class="feedback ${quiz.resp === q.ok ? 'ok' : 'mal'}"><p class="fb-titulo">${quiz.resp === q.ok ? '✅ ¡Correcto!' : `✖ Es ${c.n.toLowerCase()}`}</p>
        <p>Pasa de <b>${PROPIEDADES[c.de].n.toLowerCase()}</b> a <b>${PROPIEDADES[c.a].n.toLowerCase()}</b> y ${c.calor ? 'absorbe' : 'libera'} calor. Mirá la flecha en el mapa.</p></div>
        <button class="btn primario" id="es-sig">${quiz.i + 1 < RONDA ? 'Siguiente →' : 'Ver resultado'}</button>` : ''}`;
    info.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { quiz.resp = b.dataset.r; if (quiz.resp === q.ok) quiz.aciertos++; pintarQuiz(); }));
    info.querySelector('#es-sig')?.addEventListener('click', () => { quiz.i++; quiz.resp = null; pintarQuiz(); });
  }

  return { iniciar };
})();
