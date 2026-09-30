// Física · Mediciones: calcular el área total y el volumen de cajas con medidas en distintas unidades.
const Mediciones = (function () {
  const { dosTonos, ojo, esfera, estrellas, tono } = Arte;
  const W = 760, H = 430, PISO = 338;
  const COL = { l: '#ffd166', a: '#74c0fc', h: '#ff8fab' };

  // Objetos con forma de caja (prisma rectangular). Medidas en cm: [mínimo, máximo, paso].
  const OBJETOS = [
    { id: 'carton', n: 'Caja de cartón', e: '📦', c: '#d9a066', l: [40, 60, 5], a: [30, 40, 5], h: [25, 40, 5], cara: true },
    { id: 'zapatos', n: 'Caja de zapatillas', e: '👟', c: '#4dabf7', l: [30, 34, 1], a: [18, 22, 1], h: [10, 13, 1] },
    { id: 'regalo', n: 'Caja de regalo', e: '🎁', c: '#b197fc', l: [15, 25, 1], a: [15, 25, 1], h: [10, 20, 1], cara: true },
    { id: 'pecera', n: 'Pecera', e: '🐠', c: '#a5d8ff', l: [50, 80, 10], a: [25, 35, 5], h: [30, 45, 5], litros: true },
    { id: 'ladrillo', n: 'Ladrillo hueco', e: '🧱', c: '#e8590c', l: [24, 33, 3], a: [12, 18, 3], h: [8, 12, 2], cara: true },
    { id: 'contenedor', n: 'Contenedor de barco', e: '🚢', c: '#40c057', l: [600, 1200, 600], a: [240, 240, 1], h: [250, 260, 10], grande: true },
    { id: 'dado', n: 'Dado gigante', e: '🎲', c: '#f8f9fa', l: [10, 20, 2], cubo: true },
    { id: 'libro', n: 'Libro', e: '📕', c: '#f03e3e', l: [20, 28, 1], a: [14, 20, 1], h: [2, 4, 1] },
    { id: 'pileta', n: 'Pileta de lona', e: '🏊', c: '#339af0', l: [200, 400, 50], a: [150, 250, 50], h: [60, 100, 10], grande: true, litros: true },
    { id: 'heladera', n: 'Heladera', e: '🧊', c: '#dee2e6', l: [60, 70, 5], a: [60, 70, 5], h: [150, 180, 10], cara: true },
  ];
  const NIVELES = {
    1: { n: 'Nivel 1 · misma unidad', d: 'Todas las medidas están en la misma unidad.' },
    2: { n: 'Nivel 2 · unidades distintas', d: 'Las medidas están en unidades distintas: primero pasalas a la misma.' },
    3: { n: 'Nivel 3 · resultado en otra unidad', d: 'Unidades distintas, y el resultado se pide en otra unidad (m², m³ o litros).' },
  };
  const RONDA = 5;
  const U = { mm: 0.1, cm: 1, m: 100 }; // cuántos cm hay en cada unidad

  // Números con coma decimal, como se escriben en la Argentina.
  const num = (x, dec = 4) => (+x.toFixed(dec)).toLocaleString('es-AR', { maximumFractionDigits: dec });
  function leer(t) {
    t = String(t).trim().replace(/\s/g, '');
    if (!t) return NaN;
    if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
    return parseFloat(t);
  }
  const azar = ([a, b, p]) => a + p * Math.floor(Math.random() * (Math.floor((b - a) / p) + 1));

  // Arma un problema: medidas reales en cm, cómo se muestran y en qué unidad se pide la respuesta.
  function problema(o, nivel) {
    const l = azar(o.l), a = o.cubo ? l : azar(o.a), h = o.cubo ? l : azar(o.h);
    const cm = { l, a, h };
    const base = o.grande ? 'm' : 'cm';
    const unidad = {};
    ['l', 'a', 'h'].forEach(k => {
      if (nivel === 1) { unidad[k] = base; return; }
      const v = cm[k], ops = [];
      if (v >= 100) ops.push('m');
      if (v <= 300) ops.push('cm');
      if (v <= 40) ops.push('mm');
      if (v >= 20 && v < 100) ops.push('m');
      unidad[k] = Util.elegir(ops);
    });
    // Que en los niveles 2 y 3 haya al menos dos unidades distintas.
    if (nivel > 1 && new Set(Object.values(unidad)).size === 1) {
      const k = Util.elegir(['l', 'a', 'h']), v = cm[k];
      unidad[k] = unidad[k] === 'cm' ? (v >= 20 ? 'm' : 'mm') : 'cm';
    }
    let ua = base + '²', uv = base + '³';
    if (nivel === 3) {
      ua = o.grande ? 'm²' : Util.elegir(['cm²', 'm²']);
      uv = o.litros ? 'L' : o.grande ? 'm³' : Util.elegir(['cm³', 'L', 'dm³']);
    }
    return { o, cm, unidad, ua, uv };
  }
  const valor = (p, k) => p.cm[k] / U[p.unidad[k]];
  const ENcm2 = { 'cm²': 1, 'm²': 10000, 'mm²': 0.01 };
  const ENcm3 = { 'cm³': 1, 'm³': 1e6, 'mm³': 0.001, 'dm³': 1000, 'L': 1000 };
  function resultados(p) {
    const { l, a, h } = p.cm;
    const areaCm = 2 * (l * a + l * h + a * h), volCm = l * a * h;
    return { area: areaCm / ENcm2[p.ua], vol: volCm / ENcm3[p.uv], areaCm, volCm };
  }

  // ---------- Dibujo de la caja (perspectiva oblicua, con volumen) ----------
  function geometria(p) {
    const m = Math.max(p.cm.l, p.cm.a, p.cm.h);
    const v = k => Math.max(p.cm[k], m * 0.22);
    const L = v('l'), A = v('a'), Hh = v('h');
    const s = Math.min(400 / (L + A * 0.55), 220 / (Hh + A * 0.36));
    const w = L * s, alto = Hh * s, dx = A * s * 0.55, dy = -A * s * 0.36;
    const x0 = W / 2 - (w + dx) / 2 + 10, y0 = PISO;
    return { x0, y0, w, alto, dx, dy };
  }
  // Matrices que llevan un cuadrado unidad (0..1) a cada cara, para dibujar detalles.
  const MF = g => `matrix(${g.w} 0 0 ${-g.alto} ${g.x0} ${g.y0})`;
  const MT = g => `matrix(${g.w} 0 ${g.dx} ${g.dy} ${g.x0} ${g.y0 - g.alto})`;
  const ML = g => `matrix(${g.dx} ${g.dy} 0 ${-g.alto} ${g.x0 + g.w} ${g.y0})`;
  const cara = (m, d) => `<g transform="${m}">${d}</g>`;
  const R = (x, y, w, h, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;

  function caraFrente(g) { return `M${g.x0},${g.y0} h${g.w} v${-g.alto} h${-g.w} Z`; }
  function caraArriba(g) { return `M${g.x0},${g.y0 - g.alto} h${g.w} l${g.dx},${g.dy} h${-g.w} Z`; }
  function caraLado(g) { return `M${g.x0 + g.w},${g.y0} l${g.dx},${g.dy} v${-g.alto} l${-g.dx},${-g.dy} Z`; }

  function caja(p, animo) {
    const o = p.o, g = geometria(p), c = o.c;
    const frente = tono(c, 0), arriba = tono(c, 0.22), lado = tono(c, -0.22);
    let s = `<ellipse cx="${g.x0 + (g.w + g.dx) / 2 + 10}" cy="${g.y0 + 6}" rx="${(g.w + g.dx) / 2 + 30}" ry="12" fill="#05061a" opacity="0.45"/>`;
    if (o.id === 'pecera') {
      // Agua adentro: un prisma más bajo, y el vidrio translúcido por encima.
      const ag = { ...g, alto: g.alto * 0.8 };
      s += `<path d="${caraLado(ag)}" fill="#1c7ed6" opacity="0.8"/><path d="${caraFrente(ag)}" fill="#339af0" opacity="0.85"/><path d="${caraArriba(ag)}" fill="#74c0fc" opacity="0.9"/>
        ${cara(MF(g), `${R(0, 0, 1, 0.08, '#e9c46a')}`)}
        ${[[0.3, 0.45, 1], [0.65, 0.3, -1]].map(([u, t, k]) => `<g transform="translate(${g.x0 + u * g.w} ${g.y0 - t * g.alto}) scale(${k * 1.2} 1.2)"><ellipse rx="12" ry="7" fill="#ffa94d"/><path d="M-10,0 L-19,-7 L-19,7 Z" fill="#ff922b"/>${ojo(6, -2, 2.4, 1)}</g>`).join('')}
        ${[0, 1, 2].map(i => `<circle cx="${g.x0 + g.w * 0.8 + i * 4}" cy="${g.y0 - g.alto * (0.4 + i * 0.12)}" r="${3 + i}" fill="none" stroke="#e7f5ff" stroke-width="1.5" opacity="0.8"/>`).join('')}
        <path d="${caraLado(g)}" fill="#d0ebff" opacity="0.18"/><path d="${caraFrente(g)}" fill="#d0ebff" opacity="0.14"/><path d="${caraArriba(g)}" fill="#d0ebff" opacity="0.1"/>
        ${[caraFrente(g), caraLado(g), caraArriba(g)].map(d => `<path d="${d}" fill="none" stroke="#e7f5ff" stroke-width="3" stroke-linejoin="round" opacity="0.9"/>`).join('')}
        <path d="M${g.x0 + 12},${g.y0 - 12} V${g.y0 - g.alto + 14}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.5"/>`;
      return { s, g };
    }
    s += `<path d="${caraLado(g)}" fill="${lado}"/><path d="${caraFrente(g)}" fill="${frente}"/><path d="${caraArriba(g)}" fill="${arriba}"/>`;
    const deco = {
      carton: () => cara(MT(g), R(0, 0.4, 1, 0.2, '#f4e1c1', 'opacity="0.85"')) + cara(MF(g), R(0.42, 0.82, 0.16, 0.18, '#f4e1c1', 'opacity="0.85"'))
        + cara(ML(g), `<path d="M0.3,0.35 L0.3,0.6 M0.22,0.5 L0.3,0.62 L0.38,0.5 M0.6,0.35 L0.6,0.6 M0.52,0.5 L0.6,0.62 L0.68,0.5" stroke="#6e4529" stroke-width="2.5" fill="none" vector-effect="non-scaling-stroke"/>`),
      zapatos: () => cara(MF(g), R(0, 0.72, 1, 0.28, tono(c, -0.35))) + cara(ML(g), R(0, 0.72, 1, 0.28, tono(c, -0.5)))
        + cara(MF(g), `<path d="M0.2,0.35 C0.4,0.2 0.6,0.25 0.8,0.45" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`),
      regalo: () => cara(MF(g), R(0.44, 0, 0.12, 1, '#ffd43b')) + cara(ML(g), R(0.44, 0, 0.12, 1, '#f0b400')) + cara(MT(g), R(0.44, 0, 0.12, 1, '#ffe066') + R(0, 0.44, 1, 0.12, '#ffe066')),
      ladrillo: () => cara(MF(g), [0.12, 0.42, 0.72].map(u => R(u, 0.25, 0.16, 0.5, tono(c, -0.5), 'rx="0.03"')).join('')) + cara(ML(g), R(0, 0, 1, 1, 'url(#md-rugoso)')),
      contenedor: () => cara(MF(g), Array.from({ length: 14 }, (_, i) => R(0.04 + i * 0.068, 0.05, 0.03, 0.9, tono(c, -0.18))).join('')) + cara(ML(g), R(0.05, 0.05, 0.42, 0.9, tono(c, -0.35)) + R(0.53, 0.05, 0.42, 0.9, tono(c, -0.35)) + R(0.47, 0.35, 0.06, 0.3, '#adb5bd')),
      dado: () => {
        const pips = (pts) => pts.map(([u, v]) => `<ellipse cx="${u}" cy="${v}" rx="0.08" ry="0.08" fill="#343a40"/>`).join('');
        return cara(MF(g), pips([[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]])) + cara(MT(g), pips([[0.5, 0.5]])) + cara(ML(g), pips([[0.25, 0.75], [0.5, 0.5], [0.75, 0.25]]));
      },
      libro: () => cara(MF(g), R(0, 0.15, 0.97, 0.7, '#fff8e6') + [0.3, 0.45, 0.6, 0.75].map(t => R(0, t, 0.97, 0.02, '#e9dcc0')).join(''))
        + cara(ML(g), R(0, 0.15, 1, 0.7, '#f3e9d2')) + cara(MT(g), R(0.1, 0.25, 0.8, 0.14, '#ffd43b') + R(0.1, 0.5, 0.5, 0.06, '#fff', 'opacity="0.6"')),
      pileta: () => cara(MT(g), R(0.04, 0.06, 0.92, 0.88, '#74c0fc') + [0.3, 0.55, 0.8].map(v => `<path d="M0.15,${v} q0.1,-0.06 0.2,0 t0.2,0 t0.2,0" stroke="#e7f5ff" stroke-width="2" fill="none" vector-effect="non-scaling-stroke" opacity="0.8"/>`).join(''))
        + cara(MF(g), [0.2, 0.5, 0.8].map(t => R(0, t, 1, 0.08, '#fff', 'opacity="0.35"')).join('')),
      heladera: () => cara(MF(g), R(0, 0.66, 1, 0.012, '#adb5bd') + R(0.86, 0.72, 0.04, 0.16, '#868e96', 'rx="0.02"') + R(0.86, 0.3, 0.04, 0.24, '#868e96', 'rx="0.02"')),
    };
    s += (deco[o.id] || (() => ''))();
    // Contorno y brillo del borde superior.
    s += `<path d="${caraArriba(g)}" fill="none" stroke="#fff" stroke-width="2" opacity="0.35"/>
      <path d="M${g.x0 + 6},${g.y0 - g.alto + 10} V${g.y0 - 12}" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity="0.28"/>`;
    if (o.id === 'regalo') s += `<g transform="translate(${g.x0 + g.w / 2 + g.dx / 2} ${g.y0 - g.alto + g.dy / 2})">
      ${dosTonos('<path d="M0,0 C-26,-24 -30,4 0,0 Z M0,0 C26,-24 30,4 0,0 Z" fill="FILL"/>', '#ffe066', '#f0b400', { y: -4 })}<circle r="5" fill="#fab005"/></g>`;
    if (o.cara) {
      const cx = g.x0 + g.w / 2, cy = g.y0 - g.alto * (o.id === 'heladera' ? 0.82 : 0.45), r = Math.min(8, Math.max(4, g.w / 26));
      const boca = animo === 'feliz' ? `q${r},${r} ${r * 2},0` : animo === 'triste' ? `q${r},${-r * 0.8} ${r * 2},0` : `h${r * 2}`;
      s += `${ojo(cx - r * 1.5, cy, r)}${ojo(cx + r * 1.5, cy, r)}<path d="M${cx - r},${cy + r * 1.8} ${boca}" stroke="#15163d" stroke-width="${r * 0.35}" fill="none" stroke-linecap="round"/>
        ${animo === 'feliz' ? `<circle cx="${cx - r * 2.8}" cy="${cy + r * 1.3}" r="${r * 0.6}" fill="#ff6b9d" opacity="0.5"/><circle cx="${cx + r * 2.8}" cy="${cy + r * 1.3}" r="${r * 0.6}" fill="#ff6b9d" opacity="0.5"/>` : ''}`;
    }
    return { s, g };
  }

  // Cotas: largo (abajo), alto (izquierda) y ancho (en diagonal, a la derecha).
  function cotas(p, g, convertidas) {
    const pillW = t => t.length * 7.4 + 22;
    const pill = (x, y, t, c, t2) => {
      const w = Math.max(pillW(t), t2 ? pillW(t2) : 0);
      return `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-13" width="${w}" height="${t2 ? 42 : 26}" rx="13" fill="#12143a" stroke="${c}" stroke-width="2.5"/>
        <text y="5" text-anchor="middle" class="md-cota" fill="${c}">${t}</text>${t2 ? `<text y="23" text-anchor="middle" class="md-cota2">${t2}</text>` : ''}</g>`;
    };
    const flecha = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.5" marker-start="url(#md-p-${c.slice(1)})" marker-end="url(#md-p-${c.slice(1)})"/>`;
    const txt = k => `${num(valor(p, k))} ${p.unidad[k]}`;
    const conv = k => convertidas && p.unidad[k] !== convertidas ? `= ${num(p.cm[k] / U[convertidas])} ${convertidas}` : '';
    const yl = g.y0 + 30, xh = g.x0 - 26;
    const ax1 = g.x0 + g.w + 16, ay1 = g.y0 + 8, ax2 = ax1 + g.dx, ay2 = ay1 + g.dy;
    return `${flecha(g.x0, yl, g.x0 + g.w, yl, COL.l)}${flecha(xh, g.y0, xh, g.y0 - g.alto, COL.h)}${flecha(ax1, ay1, ax2, ay2, COL.a)}
      <path d="M${g.x0},${g.y0 + 6} v${yl - g.y0 + 4} M${g.x0 + g.w},${g.y0 + 6} v${yl - g.y0 + 4} M${g.x0 - 6},${g.y0} h${xh - g.x0} M${g.x0 - 6},${g.y0 - g.alto} h${xh - g.x0}" stroke="#9aa0d8" stroke-width="1.2" stroke-dasharray="3 3"/>
      ${pill(g.x0 + g.w / 2, yl + 26, txt('l'), COL.l, conv('l'))}
      ${pill(xh - 64, g.y0 - g.alto / 2, txt('h'), COL.h, conv('h'))}
      ${pill((ax1 + ax2) / 2 + 70, (ay1 + ay2) / 2, txt('a'), COL.a, conv('a'))}`;
  }

  // Cinta métrica con cara, que acompaña en la escena.
  const cinta = () => `<g transform="translate(58 ${PISO + 50}) scale(0.8)">
    <path d="M18,20 H120" stroke="#ffd43b" stroke-width="10"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${26 + i * 10},15 v${i % 5 ? 5 : 9}" stroke="#343a40" stroke-width="1.5"/>`).join('')}
    ${dosTonos('<circle r="30" fill="FILL"/>', '#ffd43b', '#f0b400', { x: 8 })}<circle r="12" fill="#fab005"/><circle r="5" fill="#343a40"/>
    ${ojo(-10, -12, 5)}${ojo(6, -12, 5)}<path d="M-8,-1 q6,5 12,0" stroke="#15163d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <rect x="-28" y="-40" width="10" height="8" rx="3" fill="#e03131"/></g>`;

  function escena(p, estado) {
    const colores = Object.values(COL);
    const { s, g } = caja(p, estado === 'ok' ? 'feliz' : estado === 'mal' ? 'triste' : 'neutral');
    return `<defs>
        <radialGradient id="md-fondo" cx="0.5" cy="0.35" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <pattern id="md-rugoso" width="0.2" height="0.2" patternUnits="objectBoundingBox"><circle cx="0.1" cy="0.1" r="0.03" fill="#000" opacity="0.15"/></pattern>
        ${colores.map(c => `<marker id="md-p-${c.slice(1)}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="${c}"/></marker>`).join('')}
      </defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#md-fondo)"/>${estrellas(30, W, 220)}
      ${dosTonos(`<rect x="0" y="${PISO}" width="${W}" height="${H - PISO}" fill="FILL"/>`, '#3b3f8f', '#2d3178', { y: PISO + 30 })}
      <rect x="0" y="${PISO}" width="${W}" height="4" fill="#5c62b8"/>
      ${cinta()}${s}${cotas(p, g, estado && estado !== 'nada' ? baseUnidad(p) : null)}
      <text x="${W / 2}" y="30" text-anchor="middle" class="md-titulo">${p.o.e} ${p.o.n.toUpperCase()}</text>`;
  }
  // Unidad a la que conviene pasar todo antes de calcular.
  const baseUnidad = p => p.o.grande ? 'm' : 'cm';

  // ---------- Estado y vista ----------
  let raiz, nivel = 1, ronda = [], i = 0, aciertos = 0, estado = null, pistas = 0;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>📏 Mediciones: área y volumen</h1>
        <p>Cada caja tiene su <b>largo</b>, <b>ancho</b> y <b>alto</b>. Calculá cuánto cartón hace falta para armarla (<b>área total</b>) y cuánto entra adentro (<b>volumen</b>). ¡Ojo con las unidades!</p>
      </div>
      <div class="segmentado" id="md-niveles">${Object.entries(NIVELES).map(([k, n]) => `<button data-n="${k}">${n.n}</button>`).join('')}</div>
      <div class="nu-grid">
        <div class="panel nu-escena"><div class="nx-scroll"><svg id="md-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Caja con sus medidas"></svg></div>
          <div class="md-leyenda"><span style="--c:${COL.l}">largo</span><span style="--c:${COL.a}">ancho</span><span style="--c:${COL.h}">alto</span></div></div>
        <aside class="panel nu-info" id="md-info"></aside>
      </div>`;
    raiz.querySelectorAll('#md-niveles button').forEach(b => b.addEventListener('click', () => empezar(+b.dataset.n)));
    empezar(1);
  }

  function empezar(n) {
    nivel = n;
    raiz.querySelectorAll('#md-niveles button').forEach(b => b.classList.toggle('activo', +b.dataset.n === n));
    ronda = Util.tomar('mediciones', OBJETOS, RONDA, o => o.id).map(o => problema(o, n));
    i = 0; aciertos = 0;
    mostrar();
  }

  function mostrar() {
    estado = null; pistas = 0;
    if (i >= ronda.length) return final();
    const p = ronda[i];
    raiz.querySelector('#md-svg').innerHTML = escena(p, null);
    const info = raiz.querySelector('#md-info');
    info.innerHTML = `<div class="md-cab"><span>Caja ${i + 1} de ${ronda.length}</span><span>⭐ ${aciertos}</span></div>
      <div class="barra"><div style="width:${i / ronda.length * 100}%"></div></div>
      <h2>${p.o.e} ${p.o.n}</h2>
      <p class="nu-ayuda">${NIVELES[nivel].d}</p>
      <label class="md-campo"><span>Área total</span><input id="md-area" inputmode="decimal" autocomplete="off" placeholder="?"><b>${p.ua}</b></label>
      <label class="md-campo"><span>Volumen</span><input id="md-vol" inputmode="decimal" autocomplete="off" placeholder="?"><b>${p.uv}</b></label>
      <p class="nu-ayuda">Usá coma para los decimales (por ejemplo, 0,25).</p>
      <div class="md-botones"><button class="btn primario" id="md-comprobar">✔️ Comprobar</button><button class="btn" id="md-pista">💡 Pista</button></div>
      <div id="md-pistas"></div><div id="md-resultado"></div>
      <details class="md-ayudas"><summary>📐 Fórmulas y equivalencias</summary>
        <p><b>Área total</b> = 2 · (largo · ancho + largo · alto + ancho · alto)</p>
        <p><b>Volumen</b> = largo · ancho · alto</p>
        <table class="md-tabla"><tr><td>1 m = 100 cm</td><td>1 cm = 10 mm</td></tr><tr><td>1 m² = 10 000 cm²</td><td>1 cm² = 100 mm²</td></tr>
          <tr><td>1 m³ = 1 000 000 cm³</td><td>1 dm³ = 1000 cm³</td></tr><tr><td colspan="2">1 litro = 1 dm³ = 1000 cm³ · 1 m³ = 1000 litros</td></tr></table>
      </details>`;
    info.querySelector('#md-comprobar').addEventListener('click', comprobar);
    info.querySelector('#md-pista').addEventListener('click', pista);
    info.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') comprobar(); }));
  }

  function pista() {
    const p = ronda[i], b = baseUnidad(p), cont = raiz.querySelector('#md-pistas');
    pistas++;
    const pasos = [
      Object.keys(COL).some(k => p.unidad[k] !== b) ? `1️⃣ Pasá todas las medidas a <b>${b}</b>: ${['l', 'a', 'h'].map(k => `${num(valor(p, k))} ${p.unidad[k]} = <b>${num(p.cm[k] / U[b])} ${b}</b>`).join(' · ')}` : `1️⃣ Las tres medidas ya están en <b>${b}</b>.`,
      `2️⃣ Las caras de la caja son tres pares iguales: <b>largo × ancho</b> (arriba y abajo), <b>largo × alto</b> (adelante y atrás) y <b>ancho × alto</b> (los costados). Sumalas y multiplicá por 2.`,
      `3️⃣ Para el volumen multiplicá <b>largo × ancho × alto</b>.${p.uv === 'L' ? ' Después recordá que <b>1 litro = 1000 cm³</b>.' : ''}${p.ua === 'm²' && b === 'cm' ? ' Para pasar cm² a m², dividí por <b>10 000</b>.' : ''}`,
    ];
    cont.innerHTML = `<ol class="md-pasos">${pasos.slice(0, Math.min(pistas, 3)).map(x => `<li>${x}</li>`).join('')}</ol>`;
    if (pistas === 1) raiz.querySelector('#md-svg').innerHTML = escena(p, 'pista');
  }

  function comprobar() {
    if (estado) return;
    const p = ronda[i], r = resultados(p);
    const va = leer(raiz.querySelector('#md-area').value), vv = leer(raiz.querySelector('#md-vol').value);
    if (isNaN(va) || isNaN(vv)) { raiz.querySelector('#md-resultado').innerHTML = '<p class="nu-error">Completá los dos resultados con números.</p>'; return; }
    const cerca = (x, y) => Math.abs(x - y) <= Math.max(Math.abs(y) * 0.01, 1e-9);
    const okA = cerca(va, r.area), okV = cerca(vv, r.vol);
    estado = okA && okV ? 'ok' : 'mal';
    if (okA && okV) aciertos++;
    raiz.querySelector('#md-area').closest('.md-campo').classList.add(okA ? 'ok' : 'mal');
    raiz.querySelector('#md-vol').closest('.md-campo').classList.add(okV ? 'ok' : 'mal');
    raiz.querySelectorAll('#md-info input').forEach(x => { x.disabled = true; });
    raiz.querySelector('#md-svg').innerHTML = escena(p, estado);
    const b = baseUnidad(p), f = k => num(p.cm[k] / U[b]);
    const ab = 2 * (p.cm.l * p.cm.a + p.cm.l * p.cm.h + p.cm.a * p.cm.h) / (U[b] ** 2), vb = p.cm.l * p.cm.a * p.cm.h / (U[b] ** 3);
    const convA = p.ua !== b + '²' ? ` = <b>${num(r.area)} ${p.ua}</b>` : '', convV = p.uv !== b + '³' ? ` = <b>${num(r.vol)} ${p.uv}</b>` : '';
    raiz.querySelector('#md-resultado').innerHTML = `<div class="feedback ${estado}">
        <p class="fb-titulo">${estado === 'ok' ? '✅ ¡Muy bien! Las dos respuestas son correctas.' : `${okA ? '✅ Área correcta' : '✖ Revisá el área'} · ${okV ? '✅ volumen correcto' : '✖ revisá el volumen'}`}</p>
        <p class="md-sol">📏 Medidas en ${b}: largo <b>${f('l')}</b>, ancho <b>${f('a')}</b>, alto <b>${f('h')}</b></p>
        <p class="md-sol">🟨 Área total = 2 · (${f('l')} · ${f('a')} + ${f('l')} · ${f('h')} + ${f('a')} · ${f('h')}) = <b>${num(ab)} ${b}²</b>${convA}</p>
        <p class="md-sol">🧊 Volumen = ${f('l')} · ${f('a')} · ${f('h')} = <b>${num(vb)} ${b}³</b>${convV}</p>
      </div><button class="btn primario" id="md-sig">${i + 1 < ronda.length ? 'Siguiente caja →' : 'Ver resultado'}</button>`;
    raiz.querySelector('#md-sig').addEventListener('click', () => { i++; mostrar(); });
    raiz.querySelector('#md-comprobar').disabled = true;
  }

  function final() {
    const p = ronda[ronda.length - 1];
    raiz.querySelector('#md-svg').innerHTML = escena(p, aciertos >= 4 ? 'ok' : 'nada');
    raiz.querySelector('#md-info').innerHTML = `<h2>📏 Resultado</h2>
      <div class="feedback ${aciertos >= 4 ? 'ok' : 'mal'}"><p class="fb-titulo">${aciertos >= 4 ? '🏆' : '💪'} ${aciertos} de ${ronda.length} cajas resueltas</p>
      <p>${aciertos === ronda.length ? '¡Perfecto! Manejás muy bien las unidades.' : aciertos >= 4 ? '¡Muy bien! Revisá con cuidado las conversiones.' : 'Practicá un poco más: usá las pistas para pasar todo a la misma unidad.'}</p></div>
      <button class="btn primario" id="md-otra">Otra ronda</button>${nivel < 3 ? ` <button class="btn" id="md-subir">Pasar al nivel ${nivel + 1} →</button>` : ''}`;
    raiz.querySelector('#md-otra').addEventListener('click', () => empezar(nivel));
    raiz.querySelector('#md-subir')?.addEventListener('click', () => empezar(nivel + 1));
  }

  return { iniciar, resultados, actual: () => ronda[i] };
})();
