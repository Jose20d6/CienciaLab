// Ilustraciones del Quiz (estilo de divulgación: fondo azul noche, dos tonos, brillos y caritas).
// QuizDibujos.svg(pregunta) devuelve el dibujo propio de la pregunta (campo "imagen" de preguntas.json)
// o, si no tiene, la escena de su tema. Todas usan un lienzo de 600 × 170.
const QuizDibujos = (function () {
  const { dosTonos: dt, ojo, sombra, estrellas, tono } = Arte;
  const W = 600, H = 170, PISO = 140;
  let n = 0;

  // ---------- Piezas ----------
  const boca = (x, y, r, animo = 'feliz') => ({
    feliz: `<path d="M${x - r},${y} q${r},${r} ${r * 2},0" stroke="#15163d" stroke-width="${Math.max(1.6, r * 0.45)}" fill="none" stroke-linecap="round"/>`,
    triste: `<path d="M${x - r},${y + r * 0.6} q${r},${-r} ${r * 2},0" stroke="#15163d" stroke-width="${Math.max(1.6, r * 0.45)}" fill="none" stroke-linecap="round"/>`,
    oh: `<ellipse cx="${x}" cy="${y + r * 0.3}" rx="${r * 0.55}" ry="${r * 0.7}" fill="#15163d"/>`,
  })[animo];
  const cara = (x, y, r, animo) => `${ojo(x - r * 1.25, y, r)}${ojo(x + r * 1.25, y, r)}${boca(x - r * 0.7, y + r * 1.5, r * 0.7, animo)}`;
  const mesada = () => `<rect y="${PISO}" width="${W}" height="${H - PISO}" fill="#2c3070"/><rect y="${PISO}" width="${W}" height="5" fill="#4c52b8"/>`;
  const texto = (x, y, t, tam = 11, color = '#e9ebff', extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" class="qzd-t" style="font-size:${tam}px" fill="${color}" ${extra}>${t}</text>`;
  const llama = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,-30 C-14,-10 -10,0 0,0 C10,0 14,-10 0,-30 Z" fill="#ff922b"/><path d="M0,-18 C-6,-7 -4,0 0,0 C4,0 6,-7 0,-18 Z" fill="#ffe066"/></g>`;
  const brillo = (d, w = 3) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0.55"/>`;
  // Vaso de precipitados con capas de abajo hacia arriba: [{ h, c, borde? }]
  function vaso(x, w, h, capas = [], extra = '') {
    let y = PISO - 4, s = '';
    capas.forEach(k => {
      y -= k.h;
      s += dt(`<rect x="${x - w / 2 + 4}" y="${y}" width="${w - 8}" height="${k.h}" fill="FILL"/>`, k.c, tono(k.c, -0.18), { x: x + w * 0.18 });
      if (k.borde) s += `<rect x="${x - w / 2 + 4}" y="${y}" width="${w - 8}" height="3" fill="${tono(k.c, 0.35)}"/>`;
    });
    return `${sombra(x + 4, PISO + 2, w * 0.6)}
      <rect x="${x - w / 2}" y="${PISO - h}" width="${w}" height="${h}" rx="8" fill="#dbe4ff" opacity="0.12"/>
      ${s}${extra}
      <path d="M${x - w / 2 - 4},${PISO - h} H${x - w / 2} V${PISO - 8} Q${x - w / 2},${PISO} ${x - w / 2 + 8},${PISO} H${x + w / 2 - 8} Q${x + w / 2},${PISO} ${x + w / 2},${PISO - 8} V${PISO - h}" stroke="#e7f5ff" stroke-width="3.5" fill="none" stroke-linejoin="round"/>
      ${[0.25, 0.45, 0.65].map(f => `<path d="M${x + w / 2 - 12},${PISO - h * f} h8" stroke="#e7f5ff" stroke-width="1.5" opacity="0.6"/>`).join('')}
      ${brillo(`M${x - w / 2 + 8},${PISO - h + 10} V${PISO - 16}`)}`;
  }
  function frasco(x, etiqueta, liquido, tapa = '#e8590c', ancho = 36, alto = 58) {
    const y0 = PISO - alto;
    return `${sombra(x + 3, PISO + 2, ancho * 0.6)}
      ${dt(`<rect x="${x - ancho / 2}" y="${y0}" width="${ancho}" height="${alto}" rx="8" fill="FILL"/>`, liquido, tono(liquido, -0.2), { x: x + ancho * 0.15 })}
      <rect x="${x - 8}" y="${y0 - 10}" width="16" height="12" fill="${tono(liquido, 0.2)}"/>
      ${dt(`<rect x="${x - 10}" y="${y0 - 18}" width="20" height="10" rx="3" fill="FILL"/>`, tapa, tono(tapa, -0.25), { x: x + 3 })}
      ${etiqueta !== null ? `<rect x="${x - ancho / 2 + 4}" y="${y0 + 16}" width="${ancho - 8}" height="22" rx="3" fill="#fff8e1"/>${texto(x, y0 + 31, etiqueta, etiqueta.length > 6 ? 6.5 : 9, '#12143a', 'font-weight="800"')}` : ''}
      ${brillo(`M${x - ancho / 2 + 6},${y0 + 6} V${y0 + 14}`, 2.5)}`;
  }
  function mechero(x, encendido = true) {
    return `${sombra(x + 3, PISO + 2, 26)}
      ${dt(`<rect x="${x - 22}" y="${PISO - 10}" width="44" height="10" rx="4" fill="FILL"/>`, '#868e96', '#5c636a', { x: x + 6 })}
      ${dt(`<rect x="${x - 6}" y="${PISO - 56}" width="12" height="48" rx="2" fill="FILL"/>`, '#adb5bd', '#868e96', { x: x + 2 })}
      <rect x="${x + 6}" y="${PISO - 22}" width="16" height="6" rx="3" fill="#495057"/>
      ${encendido ? `<g class="qzd-llama">${llama(x, PISO - 56, 1.1)}</g>` : ''}`;
  }
  // Armando Siempretarde: guardapolvo desprendido, pelo revuelto y sin anteojos de seguridad.
  function armando(x, animo = 'feliz', brazo = '') {
    return `<g transform="translate(${x} ${PISO}) scale(0.8)">${sombra(2, 2, 26)}
      <rect x="-12" y="-32" width="9" height="32" rx="4" fill="#3b5bdb"/><rect x="3" y="-32" width="9" height="32" rx="4" fill="#3b5bdb"/>
      ${dt('<rect x="-22" y="-84" width="44" height="58" rx="14" fill="FILL"/>', '#f8f9ff', '#cfd4f2', { x: 7 })}
      <path d="M0,-84 V-30" stroke="#b8bde6" stroke-width="2"/><path d="M-5,-84 L0,-70 L5,-84" fill="#4dabf7"/>
      ${brazo}
      <g transform="translate(0 -104)">
        ${dt('<circle r="21" fill="FILL"/>', '#f2c094', '#d9a273', { x: 7 })}
        <path d="M-21,-4 C-24,-20 -12,-30 -2,-26 C2,-34 16,-32 18,-22 C26,-20 24,-6 21,-4 C16,-14 8,-18 0,-14 C-8,-18 -16,-14 -21,-4 Z" fill="#7a4a2a"/>
        <path d="M-6,-28 l-4,-8 M4,-29 l3,-8 M12,-26 l6,-6" stroke="#7a4a2a" stroke-width="4" stroke-linecap="round"/>
        ${cara(0, 2, 4.2, animo)}
        <circle cx="-12" cy="8" r="3.5" fill="#ff8fab" opacity="0.5"/><circle cx="12" cy="8" r="3.5" fill="#ff8fab" opacity="0.5"/></g>
      <g transform="translate(0 -138)"><rect x="-44" y="-10" width="88" height="17" rx="8.5" fill="#12143a" stroke="#ffd166" stroke-width="1.5"/>${texto(0, 2.5, 'ARMANDO', 9, '#ffd166', 'font-weight="800" letter-spacing="1.5"')}</g></g>`;
  }
  const brazoA = (dx, dy) => `<path d="M14,-70 Q${(14 + dx) / 2 + 6},${(-70 + dy) / 2 - 4} ${dx},${dy}" stroke="#cfd4f2" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="${dx}" cy="${dy}" r="6" fill="#f2c094"/>`;
  const vapor = (x, y, color = '#c9ccf5', k = 1) => `<g class="qzd-sube" opacity="0.8">${[0, 1, 2].map(i => `<path d="M${x - 10 + i * 10},${y} q-6,-10 0,-20 t0,-20" stroke="${color}" stroke-width="${3 * k}" fill="none" stroke-linecap="round" style="animation-delay:${i * 0.5}s"/>`).join('')}</g>`;
  const nube = (x, y, s, c1, c2) => `<g transform="translate(${x} ${y}) scale(${s})">${dt('<path d="M-34,10 C-48,10 -48,-10 -32,-12 C-30,-30 -6,-32 0,-18 C8,-32 32,-26 30,-8 C46,-8 46,10 32,10 Z" fill="FILL"/>', c1, c2, { y: 2 })}</g>`;
  function olla(x, ancho = 92, hirviendo = true, mango = '#7a4a2a', etiqueta = '') {
    const y0 = PISO - 46;
    return `${sombra(x + 4, PISO + 2, ancho * 0.6)}
      <rect x="${x - ancho / 2 - 22}" y="${y0 + 10}" width="24" height="8" rx="4" fill="${mango}"/><rect x="${x + ancho / 2 - 2}" y="${y0 + 10}" width="24" height="8" rx="4" fill="${mango}"/>
      ${dt(`<path d="M${x - ancho / 2},${y0} H${x + ancho / 2} V${PISO - 8} Q${x + ancho / 2},${PISO} ${x + ancho / 2 - 10},${PISO} H${x - ancho / 2 + 10} Q${x - ancho / 2},${PISO} ${x - ancho / 2},${PISO - 8} Z" fill="FILL"/>`, '#adb5bd', '#7d858d', { x: x + ancho * 0.18 })}
      <ellipse cx="${x}" cy="${y0}" rx="${ancho / 2}" ry="7" fill="#495057"/><ellipse cx="${x}" cy="${y0 + 1}" rx="${ancho / 2 - 5}" ry="5" fill="#4dabf7"/>
      ${hirviendo ? [-0.3, 0, 0.28].map((f, i) => `<circle cx="${x + f * ancho}" cy="${y0}" r="${3 + i}" fill="#a5d8ff" class="qzd-burbuja" style="animation-delay:${i * 0.3}s"/>`).join('') + vapor(x, y0 - 10) : ''}
      ${brillo(`M${x - ancho / 2 + 8},${y0 + 10} V${PISO - 14}`)}
      ${etiqueta ? texto(x, PISO - 18, etiqueta, 13, '#12143a', 'font-weight="900"') : ''}`;
  }
  const hielo = (x, y, s = 1, animo = 'feliz') => `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-18,-18 L-10,-26 H22 L14,-18 Z" fill="#e7f5ff" opacity="0.9"/><path d="M14,-18 L22,-26 V8 L14,16 Z" fill="#74c0fc" opacity="0.8"/>
      <rect x="-18" y="-18" width="32" height="34" rx="4" fill="#a5d8ff" opacity="0.85" stroke="#e7f5ff" stroke-width="2"/>
      ${brillo('M-13,-6 V-12 H-6', 2.5)}${animo ? cara(-2, 0, 3.2, animo) : ''}</g>`;
  const balanza = (x, extra = '') => `${sombra(x + 3, PISO + 2, 50)}
      ${dt(`<path d="M${x - 46},${PISO} L${x - 40},${PISO - 24} H${x + 40} L${x + 46},${PISO} Z" fill="FILL"/>`, '#5c7cfa', '#3b5bdb', { x: x + 14 })}
      <rect x="${x - 28}" y="${PISO - 18}" width="34" height="12" rx="2" fill="#12143a"/>${extra}
      <rect x="${x - 38}" y="${PISO - 30}" width="76" height="6" rx="3" fill="#dbe4ff"/>`;

  // ---------- Escenas de cada tema (cuando la pregunta no tiene dibujo propio) ----------
  const TEMAS = {
    'Normas de seguridad y material de laboratorio': () => `${mesada()}
      ${frasco(90, 'NaCl', '#74c0fc', '#3b5bdb')}${frasco(142, 'H₂O', '#a5d8ff', '#2f9e44', 30, 46)}
      <g transform="translate(250 ${PISO})">${sombra(4, 2, 40)}
        ${dt('<path d="M-12,-74 H12 V-40 L44,-6 Q48,0 40,0 H-40 Q-48,0 -44,-6 L-12,-40 Z" fill="FILL"/>', '#e7f5ff', '#c5d8f5', { x: 0 })}
        ${dt('<path d="M-28,-22 H28 L44,-6 Q48,0 40,0 H-40 Q-48,0 -44,-6 Z" fill="FILL"/>', '#69db7c', '#2f9e44', { x: 0 })}
        ${cara(0, -10, 3.6, 'feliz')}${brillo('M-6,-68 V-44', 3)}</g>
      ${mechero(370)}
      <g transform="translate(480 ${PISO})">${sombra(2, 2, 40)}
        <rect x="-44" y="-36" width="88" height="8" rx="3" fill="#a0703d"/><rect x="-40" y="-28" width="6" height="28" fill="#7a4a2a"/><rect x="34" y="-28" width="6" height="28" fill="#7a4a2a"/>
        ${[-26, -8, 10, 28].map((dx, i) => `<rect x="${dx - 6}" y="-74" width="12" height="54" rx="6" fill="#dbe4ff" opacity="0.35" stroke="#e7f5ff" stroke-width="2"/><rect x="${dx - 4}" y="${-44 + i * 3}" width="8" height="${22 - i * 3}" rx="4" fill="${['#ff8787', '#ffd43b', '#69db7c', '#74c0fc'][i]}"/>`).join('')}</g>`,
    'Estados de la materia y cambios de estado': () => `${mesada()}
      ${hielo(130, PISO - 22, 1.5)}${texto(130, PISO + 22, 'SÓLIDO', 10, '#a5d8ff', 'font-weight="800" letter-spacing="1.5"')}
      <path d="M190,${PISO - 40} h44" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/><path d="M234,${PISO - 48} l10,8 -10,8" fill="#ffd166"/>
      <g transform="translate(300 ${PISO - 38})">${dt('<path d="M0,-34 C18,-10 24,2 24,12 C24,26 13,34 0,34 C-13,34 -24,26 -24,12 C-24,2 -18,-10 0,-34 Z" fill="FILL"/>', '#74c0fc', '#3b8dd8', { x: 4 })}${cara(0, 12, 3.6, 'feliz')}${brillo('M-12,4 q2,-10 8,-16', 3)}</g>
      ${texto(300, PISO + 22, 'LÍQUIDO', 10, '#74c0fc', 'font-weight="800" letter-spacing="1.5"')}
      <path d="M366,${PISO - 40} h44" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/><path d="M410,${PISO - 48} l10,8 -10,8" fill="#ffd166"/>
      <g class="qzd-flota">${nube(480, PISO - 50, 1.2, '#e9ecef', '#c7ccd6')}${cara(480, PISO - 52, 3.6, 'feliz')}</g>
      ${texto(480, PISO + 22, 'GASEOSO', 10, '#dee2e6', 'font-weight="800" letter-spacing="1.5"')}`,
    'Sistemas materiales': () => `${mesada()}
      ${vaso(150, 80, 96, [{ h: 22, c: '#e9c46a' }, { h: 46, c: '#4dabf7', borde: true }])}
      ${vaso(300, 80, 96, [{ h: 68, c: '#74c0fc', borde: true }], `<g>${[[-20, -40], [8, -60], [18, -30], [-6, -20]].map(([dx, dy]) => `<rect x="${300 + dx}" y="${PISO + dy}" width="3" height="3" fill="#fff" opacity="0.7"/>`).join('')}</g>`)}
      ${vaso(450, 80, 96, [{ h: 40, c: '#4dabf7' }, { h: 28, c: '#ffd43b', borde: true }])}`,
    'Materia y energía': () => `${mesada()}
      <g transform="translate(110 64)" class="qzd-gira-lento">${Array.from({ length: 10 }, (_, i) => `<path d="M0,-44 L5,-34 H-5 Z" fill="#ffd43b" transform="rotate(${i * 36})"/>`).join('')}</g>
      <g transform="translate(110 64)">${dt('<circle r="30" fill="FILL"/>', '#ffd43b', '#fab005', { x: 8 })}${cara(0, 0, 4, 'feliz')}</g>
      <path d="M262,26 L238,82 H258 L242,128 L290,64 H268 L286,26 Z" fill="#ffd43b" stroke="#fab005" stroke-width="3" stroke-linejoin="round"/>
      <g transform="translate(390 ${PISO})">${sombra(2, 2, 30)}${dt('<rect x="-22" y="-74" width="44" height="74" rx="8" fill="FILL"/>', '#51cf66', '#2f9e44', { x: 6 })}<rect x="-22" y="-74" width="44" height="22" rx="8" fill="#343a40"/><rect x="-8" y="-82" width="16" height="9" rx="2" fill="#adb5bd"/>${texto(0, -30, '+', 22, '#fff', 'font-weight="900"')}</g>
      <g transform="translate(500 ${PISO})">${sombra(2, 2, 24)}<circle cy="-62" r="40" fill="#fff3bf" opacity="0.18" class="qzd-pulsa"/>
        ${dt('<path d="M-24,-62 C-24,-90 24,-90 24,-62 C24,-48 12,-40 10,-28 H-10 C-12,-40 -24,-48 -24,-62 Z" fill="FILL"/>', '#fff3bf', '#ffe066', { x: 6 })}
        <path d="M-6,-30 V-50 L0,-56 L6,-50 V-30" stroke="#f08c00" stroke-width="2.5" fill="none"/>
        <rect x="-11" y="-28" width="22" height="18" rx="3" fill="#868e96"/><path d="M-11,-22 H11 M-11,-16 H11" stroke="#495057" stroke-width="2"/></g>`,
    'Cuerpos y materiales': () => `${mesada()}
      <g transform="translate(110 ${PISO})">${sombra(2, 2, 24)}${dt('<path d="M-8,-96 H8 V-80 C22,-72 24,-60 24,-48 V-6 Q24,0 18,0 H-18 Q-24,0 -24,-6 V-48 C-24,-60 -22,-72 -8,-80 Z" fill="FILL"/>', '#8ce99a', '#51cf66', { x: 6 })}<rect x="-9" y="-104" width="18" height="10" rx="2" fill="#2b8a3e"/>${brillo('M-16,-56 V-14')}${texto(0, 18, 'VIDRIO', 9, '#c9ccf5', 'font-weight="800" letter-spacing="1"')}</g>
      <g transform="translate(240 ${PISO - 8}) rotate(-8)">${dt('<path d="M-62,-6 H10 C24,-16 52,-16 56,-2 C52,12 24,12 10,4 H-62 Q-66,-1 -62,-6 Z" fill="FILL"/>', '#e9ecef', '#adb5bd', { y: 0 })}${brillo('M18,-8 q14,-6 28,0', 2.5)}</g>
      ${texto(240, PISO + 18, 'METAL', 9, '#c9ccf5', 'font-weight="800" letter-spacing="1"')}
      <g transform="translate(370 ${PISO})">${sombra(2, 2, 22)}${dt('<path d="M-22,-62 H22 L16,0 H-16 Z" fill="FILL"/>', '#ff8787', '#e03131', { x: 6 })}<ellipse cy="-62" rx="22" ry="5" fill="#ffc9c9"/>${texto(0, 18, 'PLÁSTICO', 9, '#c9ccf5', 'font-weight="800" letter-spacing="1"')}</g>
      <g transform="translate(490 ${PISO - 8}) rotate(-12)">${dt('<path d="M-60,-7 H44 L62,0 L44,7 H-60 Z" fill="FILL"/>', '#ffd43b', '#f08c00', { y: 0 })}<path d="M44,-7 L62,0 L44,7 Z" fill="#f4d6a0"/><path d="M56,-2 L62,0 L56,2 Z" fill="#343a40"/><rect x="-66" y="-7" width="8" height="14" rx="2" fill="#ff8fab"/></g>
      ${texto(490, PISO + 18, 'MADERA', 9, '#c9ccf5', 'font-weight="800" letter-spacing="1"')}`,
    'Propiedades intensivas y extensivas': () => `${mesada()}
      ${balanza(140, texto(117, PISO - 9, '250 g', 9, '#69db7c', 'font-weight="800"'))}
      ${hielo(140, PISO - 52, 1, 'feliz')}
      ${vaso(300, 70, 100, [{ h: 56, c: '#74c0fc', borde: true }])}
      <g transform="translate(440 ${PISO})">${sombra(2, 2, 14)}<rect x="-8" y="-118" width="16" height="112" rx="8" fill="#f8f9fa"/><circle cy="-8" r="13" fill="#f8f9fa"/><circle cy="-8" r="9" fill="#fa5252"/><rect x="-3" y="-80" width="6" height="74" rx="3" fill="#fa5252"/>${[-110, -95, -80, -65, -50, -35].map(y => `<path d="M8,${y} h6" stroke="#adb5bd" stroke-width="2"/>`).join('')}</g>
      ${texto(540, 60, 'masa', 13, '#ffd166', 'font-weight="800"')}${texto(540, 82, 'volumen', 13, '#ffd166', 'font-weight="800"')}${texto(540, 104, 'densidad', 13, '#ffd166', 'font-weight="800"')}`,
  };

  // ---------- Dibujos propios de algunas preguntas ----------
  const DIBUJOS = {
    'armando-lavandina': () => `${mesada()}${armando(120, 'oh', brazoA(34, -56))}
      ${frasco(250, 'LAVANDINA', '#fff3bf', '#3b5bdb', 40, 64)}${frasco(320, 'AMONÍACO', '#d0ebff', '#e03131', 40, 64)}
      ${vaso(440, 74, 70, [{ h: 34, c: '#c0eb75', borde: true }])}
      <g class="qzd-flota">${nube(470, 50, 1.1, '#b2f2bb', '#8ce99a')}<path d="M458,44 l8,8 m0,-8 l-8,8 M478,44 l8,8 m0,-8 l-8,8" stroke="#2b8a3e" stroke-width="3" stroke-linecap="round"/></g>
      ${texto(560, 34, '⚠️', 26)}`,
    'armando-frasco': () => `${mesada()}${armando(200, 'feliz', brazoA(46, -60))}
      <g transform="translate(244 -14) rotate(8 0 ${PISO})">${frasco(0, '?', '#e599f7', '#868e96', 30, 46)}</g>
      ${frasco(360, 'HCl', '#ffc9c9', '#e03131')}${frasco(410, 'NaOH', '#d0ebff', '#3b5bdb')}${frasco(460, 'CuSO₄', '#74c0fc', '#2f9e44')}
      <g transform="translate(300 34)" class="qzd-flota">${texto(0, 0, '?', 30, '#ffd166', 'font-weight="900"')}</g>`,
    'armando-mate': () => `${mesada()}${armando(220, 'feliz', brazoA(48, -62))}
      <g transform="translate(260 ${PISO - 56})">${dt('<path d="M-12,-10 C-14,4 -8,16 0,16 C8,16 14,4 12,-10 Z" fill="FILL"/>', '#a0703d', '#7a4a2a', { x: 3 })}<ellipse cy="-10" rx="12" ry="4" fill="#5c940d"/><path d="M4,-10 L14,-34" stroke="#ced4da" stroke-width="3" stroke-linecap="round"/></g>
      ${vapor(260, PISO - 72, '#dee2e6', 0.7)}
      ${frasco(400, 'H₂SO₄', '#fff3bf', '#e03131')}${vaso(480, 60, 64, [{ h: 30, c: '#ffa8a8', borde: true }])}
      <g transform="translate(110 70)"><circle r="30" fill="#12143a" stroke="#ff6b6b" stroke-width="5"/><path d="M-20,20 L20,-20" stroke="#ff6b6b" stroke-width="5"/>${texto(0, 8, '🧉', 24)}</g>`,
    'armando-mechero': () => `${mesada()}${mechero(170)}
      <g transform="translate(-6 0)">${armando(440, 'feliz', '')}</g>
      <g transform="translate(540 ${PISO})"><rect x="-26" y="-118" width="52" height="118" rx="3" fill="#7a4a2a"/><rect x="-20" y="-112" width="40" height="112" fill="#a0703d"/><circle cx="12" cy="-56" r="3" fill="#ffd43b"/>${texto(0, -124, 'SALIDA', 9, '#69db7c', 'font-weight="800"')}</g>
      <path d="M380,${PISO - 50} h-30 M380,${PISO - 34} h-40 M380,${PISO - 18} h-26" stroke="#c9ccf5" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      ${texto(250, 40, '¿Y el mechero?', 14, '#ffd166', 'font-weight="800"')}`,
    'tubo': () => `${mesada()}${mechero(300)}
      <g transform="translate(296 46) rotate(-35) scale(0.7)"><rect x="-9" y="-56" width="18" height="86" rx="9" fill="#dbe4ff" opacity="0.35" stroke="#e7f5ff" stroke-width="2.5"/><rect x="-6" y="0" width="12" height="27" rx="6" fill="#ff8787"/>
        ${[0, 1, 2].map(i => `<circle cx="${-2 + i * 2}" cy="${16 - i * 7}" r="2" fill="#fff" class="qzd-burbuja" style="animation-delay:${i * 0.3}s"/>`).join('')}
        <rect x="-16" y="-30" width="32" height="8" rx="3" fill="#a0703d"/><rect x="14" y="-30" width="60" height="6" rx="3" fill="#a0703d"/></g>`,
    'probeta': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(3, 2, 34)}
      <path d="M-30,0 H30 L24,-10 H-24 Z" fill="#adb5bd"/>
      <rect x="-16" y="-128" width="32" height="118" rx="4" fill="#dbe4ff" opacity="0.15"/>
      ${dt('<rect x="-14" y="-74" width="28" height="64" fill="FILL"/>', '#74c0fc', '#4dabf7', { x: 4 })}
      <path d="M-14,-74 q14,6 28,0" fill="#a5d8ff"/>
      <path d="M-16,-128 V-10 M16,-128 V-10 M-16,-128 l-6,-6 M16,-128 h4" stroke="#e7f5ff" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${Array.from({ length: 10 }, (_, i) => `<path d="M16,${-20 - i * 10} h${i % 5 ? -6 : -11}" stroke="#e7f5ff" stroke-width="1.6"/>`).join('')}
      ${brillo('M-10,-120 V-20', 2.5)}</g>${texto(160, 80, 'PROBETA', 13, '#ffd166', 'font-weight="800" letter-spacing="2"')}`,
    'pipeta': () => `${mesada()}${vaso(380, 80, 80, [{ h: 40, c: '#b197fc', borde: true }])}
      <g transform="translate(300 0) rotate(18 0 80)">
        <rect x="-4" y="22" width="8" height="122" rx="3" fill="#dbe4ff" opacity="0.3" stroke="#e7f5ff" stroke-width="2"/><rect x="-2.5" y="90" width="5" height="50" fill="#b197fc"/>
        ${dt('<ellipse cx="0" cy="10" rx="14" ry="16" fill="FILL"/>', '#ff8787', '#e03131', { x: 4 })}
        ${Array.from({ length: 8 }, (_, i) => `<path d="M4,${40 + i * 12} h5" stroke="#e7f5ff" stroke-width="1.4"/>`).join('')}</g>
      ${texto(150, 70, 'PIPETA', 13, '#ffd166', 'font-weight="800" letter-spacing="2"')}${texto(150, 90, 'con propipeta', 10, '#c9ccf5')}`,
    'embudo': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(2, 2, 30)}
      <rect x="40" y="-128" width="6" height="128" fill="#868e96"/><rect x="0" y="-92" width="46" height="5" fill="#868e96"/><path d="M-30,0 H70" stroke="#5c636a" stroke-width="8" stroke-linecap="round"/>
      <g transform="translate(0 -92)">${dt('<path d="M-36,-30 H36 L6,4 V26 H-6 V4 Z" fill="FILL"/>', '#dbe4ff', '#b8c4e8', { x: 0 })}
        <path d="M-28,-26 H28 L0,2 Z" fill="#fff8e1"/><path d="M-28,-26 L0,2 L28,-26" stroke="#e9d8a6" stroke-width="2" fill="none"/>
        ${brillo('M-26,-24 L-6,-2', 2.5)}</g></g>
      ${texto(160, 70, 'EMBUDO', 13, '#ffd166', 'font-weight="800" letter-spacing="2"')}${texto(160, 90, 'con papel de filtro', 10, '#c9ccf5')}`,
    'balon': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(3, 2, 40)}
      <rect x="-10" y="-130" width="20" height="56" rx="3" fill="#dbe4ff" opacity="0.25" stroke="#e7f5ff" stroke-width="2.5"/>
      ${dt('<circle cy="-42" r="42" fill="FILL"/>', '#dbe4ff', '#b8c4e8', { x: 10 })}
      ${dt('<path d="M-38,-30 A42,42 0 0 0 38,-30 Z" fill="FILL"/>', '#ffa94d', '#f76707', { x: 10 })}
      <circle cy="-42" r="42" fill="none" stroke="#e7f5ff" stroke-width="3"/>${brillo('M-28,-62 a34,34 0 0 1 18,-16', 3)}${cara(0, -50, 3.6, 'feliz')}</g>
      ${texto(150, 70, 'BALÓN', 13, '#ffd166', 'font-weight="800" letter-spacing="2"')}${texto(150, 90, 'de fondo redondo', 10, '#c9ccf5')}`,
    'espejo': () => `<rect width="${W}" height="${H}" fill="#1b1f5c"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${i * 90}" y="0" width="88" height="${H}" fill="${i % 2 ? '#232867' : '#20245f'}"/>`).join('')}
      <g transform="translate(300 84)"><rect x="-120" y="-66" width="240" height="132" rx="60" fill="#868e96"/><rect x="-112" y="-58" width="224" height="116" rx="54" fill="#cfe8ff"/>
        <rect x="-112" y="-58" width="224" height="116" rx="54" fill="#f1f3f5" opacity="0.65"/>
        ${Array.from({ length: 24 }, (_, i) => `<ellipse cx="${-96 + (i * 37) % 190}" cy="${-44 + (i * 23) % 92}" rx="${2 + (i % 3)}" ry="${3 + (i % 3)}" fill="#74c0fc" opacity="0.8"/>`).join('')}
        <path d="M-60,-20 q20,-16 40,-6" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/></g>
      ${vapor(70, 120, '#e9ecef', 1.4)}${vapor(530, 120, '#e9ecef', 1.4)}`,
    'naftalina': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(4, 2, 110)}
      ${dt('<rect x="-130" y="-70" width="260" height="70" rx="6" fill="FILL"/>', '#a0703d', '#7a4a2a', { x: 60 })}
      <rect x="-118" y="-60" width="236" height="52" rx="4" fill="#5c3b1e"/><rect x="-20" y="-40" width="40" height="8" rx="4" fill="#ffd43b"/>
      ${[-80, -40, 30, 80].map((dx, i) => `<circle cx="${dx}" cy="-${70 + 6}" r="7" fill="#f8f9fa"/><circle cx="${dx - 2}" cy="-${70 + 8}" r="2" fill="#fff"/>`).join('')}
      ${vapor(-40, -88, '#f8f9fa', 0.6)}${vapor(80, -88, '#f8f9fa', 0.6)}</g>
      ${texto(110, 60, 'NAFTALINA', 13, '#ffd166', 'font-weight="800" letter-spacing="2"')}${texto(110, 80, 'en el ropero', 10, '#c9ccf5')}`,
    'hielo': () => `${mesada()}<ellipse cx="290" cy="${PISO + 2}" rx="80" ry="8" fill="#74c0fc" opacity="0.6"/>${hielo(290, PISO - 30, 2.2, 'oh')}
      ${[0, 1].map(i => `<path d="M${270 + i * 40},${PISO - 4} q-4,6 0,9 q4,-3 0,-9 Z" fill="#a5d8ff" class="qzd-cae" style="animation-delay:${i * 0.6}s"/>`).join('')}
      <g transform="translate(440 ${PISO})">${sombra(2, 2, 14)}<rect x="-8" y="-118" width="16" height="112" rx="8" fill="#f8f9fa"/><circle cy="-8" r="13" fill="#f8f9fa"/><circle cy="-8" r="9" fill="#4dabf7"/><rect x="-3" y="-50" width="6" height="44" rx="3" fill="#4dabf7"/>${texto(30, -46, '?', 22, '#ffd166', 'font-weight="900"')}</g>`,
    'olla': () => `${mesada()}${olla(300, 120)}<g transform="translate(300 ${PISO + 2})">${[-36, 0, 36].map(dx => llama(dx, 0, 0.5)).join('')}</g>`,
    'agua-aceite-hielo': () => `${mesada()}${vaso(300, 110, 112, [{ h: 52, c: '#4dabf7' }, { h: 34, c: '#ffd43b', borde: true }], hielo(300, PISO - 58, 0.9, 'feliz'))}
      ${texto(440, 70, 'aceite', 12, '#ffd43b', 'font-weight="800"')}${texto(440, 116, 'agua', 12, '#74c0fc', 'font-weight="800"')}${texto(160, 88, 'hielo', 12, '#e7f5ff', 'font-weight="800"')}
      <path d="M180,84 H266" stroke="#e7f5ff" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M372,66 H418 M372,112 H418" stroke="#c9ccf5" stroke-width="1.5" stroke-dasharray="3 3"/>`,
    'agua-sal-hielo': () => `${mesada()}${vaso(300, 110, 112, [{ h: 82, c: '#74c0fc', borde: true }], hielo(282, PISO - 82, 0.8, 'feliz') + hielo(318, PISO - 80, 0.7, ''))}
      <g transform="translate(450 ${PISO})">${sombra(2, 2, 18)}${dt('<path d="M-16,-50 C-16,-62 16,-62 16,-50 V-4 Q16,0 12,0 H-12 Q-16,0 -16,-4 Z" fill="FILL"/>', '#f8f9fa', '#ced4da', { x: 5 })}<path d="M-14,-56 C-12,-70 12,-70 14,-56 Z" fill="#adb5bd"/>${[-6, 0, 6].map(dx => `<circle cx="${dx}" cy="-62" r="1.5" fill="#495057"/>`).join('')}${texto(0, -24, 'SAL', 9, '#495057', 'font-weight="800"')}</g>`,
    'hierro-arena': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(0, 2, 130)}
      ${dt('<path d="M-140,0 C-110,-56 -40,-74 0,-74 C40,-74 110,-56 140,0 Z" fill="FILL"/>', '#f4d6a0', '#e0b36a', { x: 40 })}
      ${Array.from({ length: 46 }, (_, i) => { const x = -110 + (i * 53) % 220, y = -6 - (i * 29) % 58; return Math.abs(x) < 120 - (-y) * 1.4 ? `<rect x="${x}" y="${y}" width="6" height="2" rx="1" fill="#495057" transform="rotate(${(i * 47) % 180} ${x} ${y})"/>` : ''; }).join('')}
      ${Array.from({ length: 30 }, (_, i) => `<circle cx="${-100 + (i * 41) % 200}" cy="${-4 - (i * 17) % 44}" r="1.4" fill="#c99a4a"/>`).join('')}</g>
      ${texto(470, 60, 'arena', 12, '#f4d6a0', 'font-weight="800"')}${texto(470, 80, '+ limaduras de hierro', 11, '#ced4da', 'font-weight="700"')}`,
    'agua-aceite': () => `${mesada()}${vaso(300, 110, 112, [{ h: 52, c: '#4dabf7' }, { h: 36, c: '#ffd43b', borde: true }])}
      ${texto(440, 70, 'aceite', 12, '#ffd43b', 'font-weight="800"')}${texto(440, 116, 'agua', 12, '#74c0fc', 'font-weight="800"')}
      <path d="M372,66 H418 M372,112 H418" stroke="#c9ccf5" stroke-width="1.5" stroke-dasharray="3 3"/>`,
    'agua-salada': () => `${mesada()}${vaso(260, 110, 112, [{ h: 80, c: '#74c0fc', borde: true }])}
      <g transform="translate(420 ${PISO})">${sombra(2, 2, 18)}${dt('<path d="M-16,-50 C-16,-62 16,-62 16,-50 V-4 Q16,0 12,0 H-12 Q-16,0 -16,-4 Z" fill="FILL"/>', '#f8f9fa', '#ced4da', { x: 5 })}<path d="M-14,-56 C-12,-70 12,-70 14,-56 Z" fill="#adb5bd"/>${texto(0, -24, 'SAL', 9, '#495057', 'font-weight="800"')}</g>
      ${texto(260, 24, 'AGUA SALADA', 12, '#ffd166', 'font-weight="800" letter-spacing="1.5"')}`,
    'arena-piedras': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(0, 2, 130)}
      ${dt('<path d="M-140,0 C-110,-56 -40,-74 0,-74 C40,-74 110,-56 140,0 Z" fill="FILL"/>', '#f4d6a0', '#e0b36a', { x: 40 })}
      ${[[-80, -14, 12], [-30, -40, 10], [20, -22, 14], [60, -50, 9], [90, -12, 11], [-60, -50, 8], [0, -60, 9]].map(([x, y, r]) => dt(`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.75}" fill="FILL"/>`, '#adb5bd', '#868e96', { x: x + r * 0.3 })).join('')}</g>
      ${texto(470, 70, 'arena', 12, '#f4d6a0', 'font-weight="800"')}${texto(470, 90, '+ piedras', 12, '#ced4da', 'font-weight="800"')}`,
    'pelota-mesa': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(0, 2, 90)}
      <rect x="-90" y="-80" width="180" height="12" rx="4" fill="#a0703d"/><rect x="-80" y="-68" width="10" height="68" fill="#7a4a2a"/><rect x="70" y="-68" width="10" height="68" fill="#7a4a2a"/></g>
      <g transform="translate(330 ${PISO - 104})">${dt('<circle r="24" fill="FILL"/>', '#ff6b6b', '#e03131', { x: 7 })}<path d="M-24,0 Q0,12 24,0 M0,-24 Q-10,0 0,24" stroke="#fff" stroke-width="2.5" fill="none" opacity="0.8"/>${cara(-4, -6, 3, 'feliz')}</g>
      <path d="M470,${PISO - 96} V${PISO - 8}" stroke="#ffd166" stroke-width="2.5" stroke-dasharray="4 4"/><path d="M462,${PISO - 96} h16 M462,${PISO - 8} h16" stroke="#ffd166" stroke-width="2.5"/>${texto(500, PISO - 48, 'altura', 11, '#ffd166', 'font-weight="800"')}`,
    'auto': () => `<rect y="${PISO - 6}" width="${W}" height="${H - PISO + 6}" fill="#343a40"/><path d="M0,${PISO + 12} H${W}" stroke="#ffd43b" stroke-width="3" stroke-dasharray="24 18"/>
      <g transform="translate(300 ${PISO - 8})" class="qzd-sacude">${dt('<path d="M-80,-6 V-26 Q-80,-34 -70,-36 L-40,-40 L-20,-62 H34 L56,-38 L74,-34 Q84,-30 84,-20 V-6 Z" fill="FILL"/>', '#ff6b6b', '#c92a2a', { y: -22 })}
        <path d="M-14,-56 H28 L44,-38 H-30 Z" fill="#a5d8ff"/><path d="M8,-56 V-38" stroke="#c92a2a" stroke-width="3"/>
        ${[-48, 50].map(dx => `<circle cx="${dx}" cy="-4" r="15" fill="#212529"/><circle cx="${dx}" cy="-4" r="6" fill="#adb5bd"/>`).join('')}<rect x="76" y="-28" width="8" height="6" rx="2" fill="#ffe066"/></g>
      ${[0, 1, 2].map(i => `<path d="M${150 - i * 10},${PISO - 50 + i * 16} h-${60 - i * 14}" stroke="#c9ccf5" stroke-width="4" stroke-linecap="round" opacity="0.6"/>`).join('')}`,
    'lamparita': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(2, 2, 24)}<circle cy="-74" r="60" fill="#fff3bf" opacity="0.14" class="qzd-pulsa"/>
      ${Array.from({ length: 8 }, (_, i) => `<path d="M0,-${74 + 50} v-12" stroke="#ffe066" stroke-width="4" stroke-linecap="round" transform="rotate(${-70 + i * 20} 0 -74)"/>`).join('')}
      ${dt('<path d="M-32,-80 C-32,-118 32,-118 32,-80 C32,-60 16,-50 14,-34 H-14 C-16,-50 -32,-60 -32,-80 Z" fill="FILL"/>', '#fff3bf', '#ffe066', { x: 8 })}
      <path d="M-8,-36 V-64 L0,-72 L8,-64 V-36" stroke="#f08c00" stroke-width="3" fill="none"/>
      <rect x="-15" y="-34" width="30" height="24" rx="4" fill="#868e96"/><path d="M-15,-26 H15 M-15,-18 H15" stroke="#495057" stroke-width="2.5"/><path d="M-6,-10 H6 L2,0 H-2 Z" fill="#495057"/>
      ${brillo('M-22,-88 a24,24 0 0 1 12,-16', 3)}</g>`,
    'panel': () => `${mesada()}<g transform="translate(110 56)">${Array.from({ length: 10 }, (_, i) => `<path d="M0,-40 L5,-30 H-5 Z" fill="#ffd43b" transform="rotate(${i * 36})"/>`).join('')}${dt('<circle r="26" fill="FILL"/>', '#ffd43b', '#fab005', { x: 7 })}${cara(0, 0, 3.5, 'feliz')}</g>
      ${[0, 1, 2].map(i => `<path d="M${150 + i * 6},${70 + i * 10} L${250 + i * 10},${86 + i * 6}" stroke="#ffe066" stroke-width="3" stroke-dasharray="6 6" opacity="0.8"/>`).join('')}
      <g transform="translate(330 ${PISO})">${sombra(0, 2, 70)}<rect x="-4" y="-50" width="8" height="50" fill="#868e96"/>
        <g transform="translate(0 -56) skewX(-18)">${dt('<rect x="-62" y="-30" width="124" height="44" rx="3" fill="FILL"/>', '#364fc7', '#1c2f8f', { x: 20 })}${[-31, 0, 31].map(dx => `<path d="M${dx},-30 V14" stroke="#748ffc" stroke-width="1.5"/>`).join('')}<path d="M-62,-8 H62" stroke="#748ffc" stroke-width="1.5"/></g></g>
      <path d="M400,${PISO - 40} C440,${PISO - 40} 440,${PISO - 10} 470,${PISO - 10}" stroke="#212529" stroke-width="4" fill="none"/>
      <g transform="translate(500 ${PISO})">${sombra(2, 2, 22)}<circle cy="-54" r="36" fill="#fff3bf" opacity="0.14"/>${dt('<path d="M-20,-54 C-20,-80 20,-80 20,-54 C20,-42 10,-36 9,-26 H-9 C-10,-36 -20,-42 -20,-54 Z" fill="FILL"/>', '#fff3bf', '#ffe066', { x: 5 })}<rect x="-10" y="-26" width="20" height="16" rx="3" fill="#868e96"/></g>`,
    'alimentos': () => `${mesada()}<g transform="translate(200 ${PISO})">${sombra(2, 2, 50)}${dt('<path d="M-56,0 C-62,-30 -40,-50 0,-50 C40,-50 62,-30 56,0 Z" fill="FILL"/>', '#e8a65d', '#c97b33', { x: 18 })}${[-30, -6, 18].map(dx => `<path d="M${dx},-40 l10,14" stroke="#a0612a" stroke-width="4" stroke-linecap="round"/>`).join('')}${cara(0, -22, 3.6, 'feliz')}</g>
      <g transform="translate(400 ${PISO})">${sombra(2, 2, 26)}${dt('<rect x="-22" y="-60" width="44" height="60" rx="10" fill="FILL"/>', '#4dabf7', '#1c7ed6', { x: 6 })}<rect x="-6" y="-72" width="12" height="14" fill="#adb5bd"/>${texto(0, -24, 'GAS', 11, '#fff', 'font-weight="900"')}</g>
      <g class="qzd-llama">${llama(400, PISO - 76, 1)}</g>`,
    'cuchara': () => `${mesada()}<g transform="translate(300 ${PISO - 40}) rotate(-12)">${sombra(0, 46, 90)}${dt('<path d="M-120,-8 H20 C40,-28 100,-26 110,-2 C100,22 40,24 20,6 H-120 Q-128,-1 -120,-8 Z" fill="FILL"/>', '#e9ecef', '#adb5bd', { y: -1 })}${brillo('M36,-12 q30,-12 60,-2', 4)}${brillo('M-110,-4 H0', 2.5)}</g>
      ${texto(300, 28, 'una cuchara de acero', 13, '#ffd166', 'font-weight="800"')}`,
    'olla-mango': () => `${mesada()}${olla(280, 120, true, '#a0703d')}<g transform="translate(280 ${PISO + 2})">${[-36, 0, 36].map(dx => llama(dx, 0, 0.5)).join('')}</g>
      ${texto(480, 60, 'olla de metal', 12, '#dee2e6', 'font-weight="800"')}${texto(480, 80, 'mangos de madera', 12, '#e0b36a', 'font-weight="800"')}
      <path d="M420,76 Q390,82 372,${PISO - 34}" stroke="#e0b36a" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`,
    'cable': () => `${mesada()}<g transform="translate(0 ${PISO - 50})">
      ${dt('<rect x="40" y="-14" width="360" height="28" rx="14" fill="FILL"/>', '#ff6b6b', '#c92a2a', { y: 2 })}
      ${dt('<rect x="400" y="-8" width="90" height="16" rx="4" fill="FILL"/>', '#f08c00', '#c25e00', { y: 1 })}
      ${[0, 1, 2].map(i => `<path d="M490,${-6 + i * 6} l${40 + i * 8},${-8 + i * 8}" stroke="#f08c00" stroke-width="4" stroke-linecap="round"/>`).join('')}
      ${brillo('M60,-6 H380', 3)}</g>
      ${texto(220, PISO - 76, 'plástico', 12, '#ffc9c9', 'font-weight="800"')}${texto(450, PISO - 76, 'cobre', 12, '#ffd8a8', 'font-weight="800"')}`,
    'vasos': () => `${mesada()}${vaso(160, 70, 90, [{ h: 50, c: '#a5d8ff', borde: true }])}
      <g transform="translate(300 ${PISO})">${sombra(2, 2, 30)}${dt('<path d="M-30,-90 H30 L24,0 H-24 Z" fill="FILL"/>', '#ff8787', '#e03131', { x: 8 })}<ellipse cy="-90" rx="30" ry="6" fill="#ffc9c9"/></g>
      <g transform="translate(440 ${PISO})">${sombra(2, 2, 30)}${dt('<rect x="-30" y="-90" width="60" height="90" rx="6" fill="FILL"/>', '#ced4da', '#868e96', { x: 10 })}<ellipse cy="-90" rx="30" ry="6" fill="#e9ecef"/>${brillo('M-20,-80 V-12', 4)}</g>
      ${texto(160, PISO + 22, 'vidrio', 10, '#c9ccf5', 'font-weight="800"')}${texto(300, PISO + 22, 'plástico', 10, '#c9ccf5', 'font-weight="800"')}${texto(440, PISO + 22, 'metal', 10, '#c9ccf5', 'font-weight="800"')}`,
    'cubo-densidad': () => `${mesada()}${balanza(260, texto(237, PISO - 9, '20 g', 9, '#69db7c', 'font-weight="800"'))}
      <g transform="translate(260 ${PISO - 64})"><path d="M-26,-26 L-14,-38 H34 L22,-26 Z" fill="#ffd8a8"/><path d="M22,-26 L34,-38 V10 L22,22 Z" fill="#e8590c"/>${dt('<rect x="-26" y="-26" width="48" height="48" rx="3" fill="FILL"/>', '#ff922b', '#f76707', { x: 10 })}${cara(-2, -6, 3.4, 'feliz')}</g>
      ${texto(430, 70, 'masa: 20 g', 15, '#69db7c', 'font-weight="800"')}${texto(430, 98, 'volumen: 10 cm³', 15, '#74c0fc', 'font-weight="800"')}${texto(430, 126, 'densidad: ?', 15, '#ffd166', 'font-weight="800"')}`,
    'barra-hierro': () => `${mesada()}<g transform="translate(0 ${PISO - 22})">
      ${dt('<path d="M80,-24 L100,-40 H290 L270,-24 Z M270,-24 L290,-40 V2 L270,18 Z" fill="FILL"/>', '#adb5bd', '#868e96', { x: 270 })}
      ${dt('<rect x="80" y="-24" width="190" height="42" rx="3" fill="FILL"/>', '#868e96', '#5c636a', { y: 0 })}
      <g transform="translate(70 0)">${dt('<path d="M240,-24 L260,-40 H450 L430,-24 Z M430,-24 L450,-40 V2 L430,18 Z" fill="FILL"/>', '#adb5bd', '#868e96', { x: 430 })}${dt('<rect x="240" y="-24" width="190" height="42" rx="3" fill="FILL"/>', '#868e96', '#5c636a', { y: 0 })}</g>
      ${brillo('M90,-14 H250', 3)}${brillo('M320,-14 H480', 3)}</g>
      <path d="M300,26 l8,10 -8,10 8,10 -8,10 8,10" stroke="#ffd166" stroke-width="3" fill="none"/>${texto(300, 20, 'corte', 10, '#ffd166', 'font-weight="800"')}
      ${texto(175, PISO + 22, 'HIERRO', 10, '#c9ccf5', 'font-weight="800" letter-spacing="1"')}${texto(425, PISO + 22, 'HIERRO', 10, '#c9ccf5', 'font-weight="800" letter-spacing="1"')}`,
    'fuentes': () => `${mesada()}${[['🛢️', 'petróleo'], ['⛽', 'gas'], ['⛏️', 'carbón'], ['☀️', 'Sol']].map(([e, t], i) => `<g transform="translate(${120 + i * 120} 78)"><circle r="40" fill="#12143a" stroke="#4c52b8" stroke-width="3"/>${texto(0, 12, e, 34)}${texto(0, 66, t, 12, '#c9ccf5', 'font-weight="800"')}</g>`).join('')}`,
    'dos-ollas': () => `${mesada()}${olla(190, 82, true, '#495057', '1 L')}${olla(410, 128, true, '#495057', '2 L')}`,
  };

  // Devuelve el SVG completo de una pregunta.
  function svg(p) {
    const id = 'qzd' + (n++);
    const dibujo = (p.imagen && DIBUJOS[p.imagen]) || TEMAS[p.tema];
    if (!dibujo) return '';
    return `<svg viewBox="0 0 ${W} ${H}" class="qz-dibujo" role="img" aria-hidden="true">
      <defs><radialGradient id="${id}" cx="0.5" cy="0.35" r="0.85"><stop offset="0" stop-color="#2b2f86"/><stop offset="1" stop-color="#0c0e30"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#${id})"/>${estrellas(30, W, 110, n)}${dibujo()}</svg>`;
  }

  return { svg, DIBUJOS, TEMAS };
})();
