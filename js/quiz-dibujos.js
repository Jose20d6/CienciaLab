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

  // Alimentos ilustrados del módulo Alimentación saludable.
  const comida = (id, x, y, k = 1.5) => `${sombra(x + 2, PISO + 2, 16 * k)}${Alimentacion.alimento(id, x, y, k)}`;
  // Órganos con cara (para Sistemas de la nutrición).
  const ORGANO = {
    estomago: (x, y) => `<g transform="translate(${x} ${y})">${dt('<path d="M-6,-40 C14,-46 36,-28 32,-4 C28,22 -2,32 -20,20 C-32,12 -24,0 -12,-2 C-2,-4 2,-14 -6,-22 C-12,-28 -14,-36 -6,-40 Z" fill="FILL"/>', '#ff8fab', '#e0607f', { x: 12 })}<path d="M-8,-40 V-54" stroke="#e0607f" stroke-width="9" stroke-linecap="round"/>${brillo('M2,-34 q16,-2 22,12', 3)}${cara(10, -2, 3.2, 'feliz')}</g>`,
    pulmones: (x, y) => `<g transform="translate(${x} ${y})"><path d="M0,-50 V-22 M0,-22 L-12,-12 M0,-22 L12,-12" stroke="#dbe4ff" stroke-width="6" stroke-linecap="round" fill="none"/>${[-1, 1].map(k => `<g transform="scale(${k} 1)">${dt('<path d="M-6,-24 C-6,-34 -16,-38 -24,-30 C-36,-18 -38,8 -34,24 C-30,34 -14,34 -8,24 C-4,16 -6,0 -6,-24 Z" fill="FILL"/>', '#ffa8c5', '#e06f97', { x: -20 })}</g>`).join('')}${cara(0, 4, 2.8, 'feliz')}</g>`,
    corazon: (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><g><animateTransform attributeName="transform" type="scale" values="1;1.08;0.97;1.05;1" keyTimes="0;0.15;0.3;0.45;1" dur="1s" repeatCount="indefinite"/><path d="M-6,-30 V-44 M8,-30 C8,-40 18,-44 22,-46" stroke="#5c7cfa" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M2,-28 C2,-40 -10,-46 -14,-50" stroke="#ff6b6b" stroke-width="8" fill="none" stroke-linecap="round"/>${dt('<path d="M0,30 C-24,14 -34,0 -32,-12 C-30,-26 -14,-30 -2,-20 L0,-18 L2,-20 C14,-30 30,-26 32,-12 C34,0 24,14 0,30 Z" fill="FILL"/>', '#ff6b6b', '#d63c3c', { x: 6 })}${brillo('M-24,-12 a10,10 0 0 1 10,-8', 3)}${cara(0, -2, 3.4, 'feliz')}</g></g>`,
    rinon: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-4,8 C-16,16 -18,28 -20,42" stroke="#e8a0b0" stroke-width="5" fill="none" stroke-linecap="round"/>${dt('<path d="M-2,-34 C26,-38 38,-10 32,14 C26,36 0,40 -14,28 C-6,18 -4,4 -12,-6 C-20,-18 -16,-32 -2,-34 Z" fill="FILL"/>', '#e8707a', '#b94a55', { x: 14 })}${brillo('M-4,-26 a24,20 0 0 1 22,0', 3)}${cara(12, -2, 3, 'feliz')}</g>`,
  };
  // Célula animal (núcleo, mitocondrias y otras organelas) sin rótulos.
  const celulaAnimal = (x, y, k = 1, cid = 'c') => `<g transform="translate(${x} ${y}) scale(${k})">
      <path d="M-70,-6 C-72,-40 -36,-58 0,-56 C40,-58 74,-34 70,0 C68,36 36,56 0,54 C-38,56 -68,34 -70,-6 Z" fill="#b197fc" opacity="0.35"/>
      <path d="M-70,-6 C-72,-40 -36,-58 0,-56 C40,-58 74,-34 70,0 C68,36 36,56 0,54 C-38,56 -68,34 -70,-6 Z" fill="none" stroke="#d0bfff" stroke-width="4"/>
      ${dt('<circle cx="-6" cy="-4" r="20" fill="FILL"/>', '#7048e8', '#5f3dc4', { x: 0 })}<circle cx="-2" cy="-8" r="6" fill="#4c2fa8"/>${brillo('M-20,-12 a16,16 0 0 1 8,-10', 2.5)}
      ${[[38, -18, 20], [-42, 24, -30], [30, 28, 40]].map(([mx, my, a]) => `<g transform="translate(${mx} ${my}) rotate(${a})">${dt('<ellipse rx="14" ry="7" fill="FILL"/>', '#ff922b', '#e8590c', { y: 0 })}<path d="M-9,0 q3,-4 6,0 t6,0 t6,0" stroke="#ffd8a8" stroke-width="1.5" fill="none"/></g>`).join('')}
      ${[[-40, -26], [-26, 34], [48, 6], [6, 40], [-50, 0]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="2.5" fill="#eebefa"/>`).join('')}
      <path d="M18,-38 q10,4 18,0 M16,-32 q10,4 18,0" stroke="#e599f7" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  // Tejido visto con el microscopio (células genéricas, sin rótulos).
  const vistaMicroscopio = (x, y, r, cid) => `<g><clipPath id="${cid}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>
      <circle cx="${x}" cy="${y}" r="${r}" fill="#e7f5ff"/>
      <g clip-path="url(#${cid})">${Array.from({ length: 30 }, (_, i) => { const fx = i % 6, fy = Math.floor(i / 6); const cx = x - r + 14 + fx * 26 + (fy % 2) * 13, cy = y - r + 14 + fy * 24; return `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="11" fill="#ffc9de" stroke="#e64980" stroke-width="1.5"/><circle cx="${cx + 2}" cy="${cy - 1}" r="3.5" fill="#862e9c"/>`; }).join('')}</g>
      <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#495057" stroke-width="8"/>${brillo(`M${x - r * 0.6},${y - r * 0.6} a${r * 0.8},${r * 0.8} 0 0 1 ${r * 0.5},${-r * 0.25}`, 4)}</g>`;
  function microscopio(x, etiquetas) {
    return `<g transform="translate(${x} ${PISO})">${sombra(4, 2, 44)}
      ${dt('<rect x="-44" y="-12" width="88" height="12" rx="4" fill="FILL"/>', '#495057', '#343a40', { x: 12 })}
      <path d="M22,-12 C54,-36 52,-92 18,-112" stroke="#5c636a" stroke-width="16" fill="none" stroke-linecap="round"/>
      <rect x="-40" y="-50" width="64" height="7" rx="2" fill="#868e96"/><circle cx="-10" cy="-30" r="6" fill="#ffe066"/>
      ${dt('<rect x="-20" y="-118" width="20" height="54" rx="4" fill="FILL"/>', '#adb5bd', '#868e96', { x: -8 })}
      <rect x="-18" y="-134" width="16" height="16" rx="3" fill="#343a40"/><rect x="-16" y="-66" width="12" height="12" rx="2" fill="#343a40"/>
      <circle cx="38" cy="-62" r="9" fill="#868e96"/><circle cx="38" cy="-62" r="4" fill="#495057"/>
      ${etiquetas ? `<path d="M-20,-128 H-60 M-16,-60 H-60" stroke="#ffd166" stroke-width="1.5" stroke-dasharray="3 3"/>${texto(-96, -124, 'ocular 10×', 13, '#ffd166', 'font-weight="800"')}${texto(-100, -56, 'objetivo 40×', 13, '#ffd166', 'font-weight="800"')}` : ''}</g>`;
  }

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
    'Alimentación saludable': () => `${mesada()}${[['manzana', 70], ['pan', 150], ['leche', 230], ['pescado', 310], ['zanahoria', 390], ['huevo', 460], ['brocoli', 535]].map(([id, x]) => comida(id, x, PISO - 26)).join('')}`,
    'Sistemas de la nutrición': () => `${mesada()}${ORGANO.estomago(120, PISO - 44)}${ORGANO.pulmones(250, PISO - 48)}${ORGANO.corazon(380, PISO - 46)}${ORGANO.rinon(500, PISO - 50)}`,
    'La célula': () => `${mesada()}${microscopio(170, false)}
      <path d="M170,${PISO - 134} L380,24 M170,${PISO - 118} L380,136" stroke="#c9ccf5" stroke-width="1.5" stroke-dasharray="4 5" opacity="0.5"/>
      ${vistaMicroscopio(430, 80, 62, 'qzd-vm' + n)}`,
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
    'bebidas': () => `${mesada()}${comida('agua', 110, PISO - 30, 2)}${comida('gaseosa', 240, PISO - 30, 2)}
      <g transform="translate(370 ${PISO})">${sombra(2, 2, 22)}${dt('<rect x="-20" y="-64" width="40" height="64" rx="4" fill="FILL"/>', '#ffa94d', '#f76707', { x: 6 })}<path d="M8,-64 L14,-80" stroke="#f8f9fa" stroke-width="4" stroke-linecap="round"/>${texto(0, -24, 'JUGO', 10, '#fff', 'font-weight="900"')}${texto(0, -12, 'en polvo', 7, '#fff')}</g>
      <g transform="translate(490 ${PISO})">${sombra(2, 2, 20)}${dt('<rect x="-18" y="-70" width="36" height="70" rx="8" fill="FILL"/>', '#212529', '#000000', { x: 6 })}<ellipse cy="-70" rx="18" ry="4" fill="#adb5bd"/><path d="M4,-58 L-8,-34 H2 L-4,-14 L10,-40 H0 Z" fill="#94d82d"/></g>`,
    'octogonos': () => `${mesada()}<g transform="translate(220 ${PISO})">${sombra(4, 2, 60)}
      ${dt('<rect x="-60" y="-124" width="120" height="124" rx="6" fill="FILL"/>', '#ffd43b', '#f59f00', { x: 34 })}
      <rect x="-48" y="-112" width="72" height="22" rx="4" fill="#e03131"/>${texto(-12, -96, 'CEREAL', 12, '#fff', 'font-weight="900"')}
      ${Alimentacion.alimento('galletita', -24, -52, 1)}${Alimentacion.alimento('galletita', 4, -40, 0.8)}
      ${[0, 1, 2].map(i => `<g transform="translate(${40} ${-104 + i * 34})"><path d="M-7,-15 H7 L15,-7 V7 L7,15 H-7 L-15,7 V-7 Z" fill="#000" stroke="#fff" stroke-width="2"/><path d="M-8,-3 H8 M-8,3 H8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>`).join('')}</g>
      ${texto(430, 72, '¿Qué indican', 15, '#ffd166', 'font-weight="800"')}${texto(430, 94, 'los octógonos?', 15, '#ffd166', 'font-weight="800"')}`,
    'sangre': () => `<rect width="${W}" height="${H}" fill="#2b0d1e"/><path d="M0,24 H${W} V146 H0 Z" fill="#8c1a41"/><path d="M0,34 H${W} V136 H0 Z" fill="#a51f4c"/><path d="M0,40 H${W}" stroke="#ff8fab" stroke-width="3" opacity="0.4"/>
      <g class="qzd-fluye">${[[60, 70], [150, 100], [230, 62], [330, 108], [420, 70], [520, 104], [100, 118], [470, 52], [280, 86]].map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${i * 40})"><ellipse rx="20" ry="13" fill="#ff5c7a"/><ellipse rx="10" ry="5" fill="#c9184a"/><path d="M-14,-6 a20,10 0 0 1 14,-6" stroke="#ffb3c1" stroke-width="2" fill="none"/></g>`).join('')}
        <g transform="translate(380 84)">${dt('<path d="M-22,-4 C-26,-20 -8,-26 0,-22 C12,-28 26,-14 22,0 C28,14 12,26 0,22 C-12,28 -28,14 -22,-4 Z" fill="FILL"/>', '#f1f3ff', '#c5cae9', { x: 8 })}<path d="M-8,-6 q6,-8 12,0 q-6,8 -12,0" fill="#9775fa"/></g>
        ${[[190, 74], [200, 120], [560, 78], [40, 100]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#ffd8a8"/>`).join('')}</g>`,
    'islas': () => `<rect width="${W}" height="${H}" fill="#1f4fa0"/>${Array.from({ length: 16 }, (_, i) => `<path d="M${(i * 97) % 600},${20 + (i * 41) % 140} q6,-4 12,0 t12,0" stroke="#7fb4ff" stroke-width="1.6" fill="none" opacity="0.3"/>`).join('')}
      <path d="M150,96 C220,70 380,70 450,96" stroke="#5cc8ff" stroke-width="14" opacity="0.25" fill="none"/>
      ${[[120, 100, 80, 44, '#5fd38d'], [300, 92, 100, 54, '#69db7c'], [480, 100, 80, 44, '#b2c79a']].map(([x, y, rx, ry, c]) => `<ellipse cx="${x + 5}" cy="${y + 8}" rx="${rx}" ry="${ry}" fill="#05061a" opacity="0.3"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#ffe8a3"/><ellipse cx="${x}" cy="${y - 4}" rx="${rx - 12}" ry="${ry - 12}" fill="${c}"/>`).join('')}
      ${[[280, 84, '#ff7b54'], [306, 78, '#5b7cfa'], [330, 90, '#b197fc'], [292, 104, '#ff7b54']].map(([x, y, c]) => `<g transform="translate(${x} ${y})"><rect x="-8" y="-6" width="16" height="12" fill="#f4f1ff"/><path d="M-10,-5 L0,-14 L10,-5 Z" fill="${c}"/></g>`).join('')}
      <g transform="translate(470 92)"><rect x="-22" y="-14" width="44" height="26" rx="4" fill="#ffd166"/><path d="M-6,-2 a7,7 0 1 1 5,6" stroke="#2fb67c" stroke-width="3" fill="none"/></g>
      ${[100, 120, 140].map((x, i) => `<path d="M${x},${96 - i * 6} h50" stroke="#2f9e44" stroke-width="5" stroke-linecap="round"/>`).join('')}
      <g transform="translate(212 74)"><path d="M-14,-3 L14,-3 L10,6 L-10,6 Z" fill="#ff6b6b"/><rect x="-6" y="-11" width="9" height="8" rx="1.5" fill="#ff9f43"/></g>
      ${texto(300, 158, 'EL ARCHIPIÉLAGO DE LAS ISLAS SIN', 11, '#ffd166', 'font-weight="800" letter-spacing="1.5"')}`,
    'corazon': () => `${mesada()}<path d="M80,70 H230 M370,70 H520" stroke="#ff6b6b" stroke-width="10" stroke-linecap="round" opacity="0.6"/><path d="M80,104 H230 M370,104 H520" stroke="#5c7cfa" stroke-width="10" stroke-linecap="round" opacity="0.6"/>
      ${ORGANO.corazon(300, 92, 1.5)}`,
    'celula-animal': () => `${celulaAnimal(300, 86, 1.25)}`,
    'hoja': () => `${mesada()}<g transform="translate(110 56)">${Array.from({ length: 10 }, (_, i) => `<path d="M0,-40 L5,-30 H-5 Z" fill="#ffd43b" transform="rotate(${i * 36})"/>`).join('')}${dt('<circle r="26" fill="FILL"/>', '#ffd43b', '#fab005', { x: 7 })}${cara(0, 0, 3.5, 'feliz')}</g>
      ${[0, 1, 2].map(i => `<path d="M${150 + i * 6},${64 + i * 12} L${270 + i * 6},${78 + i * 8}" stroke="#ffe066" stroke-width="3" stroke-dasharray="6 6" opacity="0.8"/>`).join('')}
      <g transform="translate(380 92) rotate(-20)">${dt('<path d="M-90,0 C-50,-56 50,-56 90,0 C50,56 -50,56 -90,0 Z" fill="FILL"/>', '#69db7c', '#2f9e44', { y: 0 })}<path d="M-100,4 L84,0" stroke="#d3f9d8" stroke-width="4" stroke-linecap="round"/>${[-50, -10, 30].map(x => `<path d="M${x},0 l24,-22 M${x},0 l24,22" stroke="#d3f9d8" stroke-width="2.5" stroke-linecap="round"/>`).join('')}${cara(30, -18, 3.4, 'feliz')}</g>
      ${texto(540, 60, 'CO₂ + agua', 11, '#c9ccf5', 'font-weight="800"')}`,
    'microscopio': () => `${mesada()}${microscopio(330, true)}`,
    'celulas-zoom': () => `${vistaMicroscopio(300, 85, 72, 'qzd-cz' + n)}${texto(470, 76, '¿Con qué se', 14, '#ffd166', 'font-weight="800"')}${texto(470, 96, 'pueden ver?', 14, '#ffd166', 'font-weight="800"')}`,
    'dos-ollas': () => `${mesada()}${olla(190, 82, true, '#495057', '1 L')}${olla(410, 128, true, '#495057', '2 L')}`,
  };

  // Devuelve el SVG completo de una pregunta.
  // ---------- Física ----------
  const mejillas = (x, y, d) => `<circle cx="${x - d}" cy="${y}" r="3.5" fill="#ff8fab" opacity="0.5"/><circle cx="${x + d}" cy="${y}" r="3.5" fill="#ff8fab" opacity="0.5"/>`;
  // Brazo con manga del color de la remera, desde el hombro derecho hasta (dx, dy).
  const brazoC = (dx, dy, c = '#ff922b') => `<path d="M14,-66 Q${(14 + dx) / 2 + 6},${(-66 + dy) / 2 - 4} ${dx},${dy}" stroke="${tono(c, -0.15)}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="${dx}" cy="${dy}" r="6" fill="#f2c094"/>`;
  const chico = (x, { color = '#ff922b', pelo = '#3d2614', brazo = '', animo = 'feliz', k = 0.8, y = PISO } = {}) => `<g transform="translate(${x} ${y}) scale(${k})">${sombra(2, 2, 24)}
      <rect x="-11" y="-30" width="9" height="30" rx="4" fill="#364fc7"/><rect x="2" y="-30" width="9" height="30" rx="4" fill="#364fc7"/>
      ${dt('<rect x="-20" y="-78" width="40" height="52" rx="14" fill="FILL"/>', color, tono(color, -0.2), { x: 7 })}
      ${brazo}
      <g transform="translate(0 -98)">${dt('<circle r="20" fill="FILL"/>', '#f2c094', '#d9a273', { x: 7 })}
        <path d="M-21,-2 C-24,-24 24,-26 21,-2 C14,-14 -14,-14 -21,-2 Z" fill="${pelo}"/>
        ${cara(0, 2, 4, animo)}${mejillas(0, 8, 12)}</g></g>`;
  const regla = (x, y, L, n = 10) => `<g transform="translate(${x} ${y})">${sombra(L / 2, 26, L * 0.5)}${dt(`<rect width="${L}" height="22" rx="3" fill="FILL"/>`, '#ffd43b', '#f0a830', { y: 15 })}
      ${Array.from({ length: n * 2 + 1 }, (_, i) => `<path d="M${6 + i * (L - 12) / (n * 2)},0 v${i % 2 ? 5 : 9}" stroke="#7a5a12" stroke-width="1.5"/>`).join('')}${brillo(`M6,17 H${L - 6}`, 2)}</g>`;
  const cronometro = (x, y, r = 30) => `<g transform="translate(${x} ${y})">${sombra(0, r + 4, r * 0.9)}
      <rect x="-6" y="${-r - 12}" width="12" height="10" rx="2" fill="#f0a830"/><rect x="-10" y="${-r - 16}" width="20" height="7" rx="3" fill="#ffd166"/>
      ${dt(`<circle r="${r}" fill="FILL"/>`, '#ffd166', '#f0a830', { x: r * 0.25 })}<circle r="${r * 0.78}" fill="#fff8e1"/>
      ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${-r * 0.7}" x2="0" y2="${i % 3 ? -r * 0.62 : -r * 0.55}" stroke="#c98a00" stroke-width="2" transform="rotate(${i * 30})"/>`).join('')}
      <line x1="0" y1="0" x2="0" y2="${-r * 0.6}" stroke="#e8590c" stroke-width="3" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite"/></line>
      <circle r="3" fill="#e8590c"/></g>`;
  const termometro = (x, h = 92, f = 0.62) => `<g transform="translate(${x} ${PISO - 14})">${sombra(2, 15, 16)}
      <rect x="-9" y="${-h}" width="18" height="${h}" rx="9" fill="#e7f5ff"/><rect x="-4" y="${-h * f}" width="8" height="${h * f}" fill="#ff6b6b"/>
      <circle r="13" fill="#ff6b6b"/><circle r="13" fill="none" stroke="#e7f5ff" stroke-width="3"/>
      ${[0.25, 0.4, 0.55, 0.7, 0.85].map(k => `<path d="M9,${-h * k} h-5" stroke="#868e96" stroke-width="1.5"/>`).join('')}${brillo(`M-4,${-h + 10} V-20`, 2)}</g>`;
  const planeta = (x, y, r, c1, c2, extra = '', animo = 'feliz') => `<g transform="translate(${x} ${y})">${dt(`<circle r="${r}" fill="FILL"/>`, c1, c2, { x: r * 0.3, extra })}
      ${brillo(`M${-r * 0.7},${-r * 0.25} a${r * 0.75},${r * 0.75} 0 0 1 ${r * 0.45},${-r * 0.45}`, 3)}${cara(0, r * 0.1, Math.max(2.4, r * 0.09), animo)}</g>`;
  const tierra = (x, y, r) => planeta(x, y, r, '#4dabf7', '#1c7ed6', `<path d="M${-r},${-r * 0.5} C${-r * 0.5},${-r * 0.9} ${-r * 0.1},${-r * 0.7} ${-r * 0.2},${-r * 0.35} C${-r * 0.3},${-r * 0.1} ${-r * 0.8},0 ${-r},${-r * 0.1} Z M${r * 0.2},${r * 0.45} C${r * 0.5},${r * 0.2} ${r},${r * 0.3} ${r},${r * 0.6} C${r * 0.7},${r} ${r * 0.2},${r} ${r * 0.2},${r * 0.45} Z M${r * 0.3},${-r * 0.8} C${r * 0.6},${-r * 0.9} ${r * 0.9},${-r * 0.5} ${r * 0.6},${-r * 0.3} C${r * 0.4},${-r * 0.2} ${r * 0.2},${-r * 0.5} ${r * 0.3},${-r * 0.8} Z" fill="#51cf66" opacity="0.9"/>`);
  const luna = (x, y, r) => planeta(x, y, r, '#e9ecef', '#adb5bd', [[-0.45, -0.45, 0.16], [0.5, -0.2, 0.12], [-0.5, 0.45, 0.1], [0.4, 0.55, 0.18]].map(([a, b, c]) => `<circle cx="${a * r}" cy="${b * r}" r="${c * r}" fill="#ced4da"/>`).join(''));
  const astronauta = (x, y, k = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">
      <rect x="-28" y="-18" width="16" height="34" rx="5" fill="#adb5bd"/>
      <rect x="-16" y="12" width="13" height="26" rx="6" fill="#e9ecef"/><rect x="3" y="12" width="13" height="26" rx="6" fill="#ced4da"/>
      <path d="M-14,-10 L-30,8 M14,-10 L30,-6" stroke="#dee2e6" stroke-width="10" stroke-linecap="round"/>
      ${dt('<rect x="-19" y="-22" width="38" height="42" rx="12" fill="FILL"/>', '#f8f9fa', '#ced4da', { x: 7 })}
      <rect x="-9" y="-6" width="18" height="11" rx="2" fill="#4dabf7"/><circle cx="-4" cy="0" r="2" fill="#ff6b6b"/><circle cx="3" cy="0" r="2" fill="#51cf66"/>
      ${dt('<circle cy="-40" r="21" fill="FILL"/>', '#f8f9fa', '#ced4da', { x: 7 })}
      <rect x="-15" y="-51" width="30" height="22" rx="10" fill="#1c3d6e"/>${cara(0, -42, 2.8, 'feliz')}${brillo('M-11,-48 q5,-3 10,-1', 2)}</g>`;
  // Dinamómetro colgado de un soporte: el resorte se estira «estiro» px y del gancho cuelga «carga» (dibujada con el origen en el gancho).
  const dinamometro = (x, estiro = 20, carga = '') => `<g transform="translate(${x} 0)">
      <rect x="-46" y="8" width="92" height="9" rx="3" fill="#a0703d"/><path d="M0,17 v8" stroke="#adb5bd" stroke-width="3"/>
      <path d="M0,28 ${Array.from({ length: 8 }, (_, i) => `L${i % 2 ? -7 : 7},${32 + i * (34 + estiro) / 8}`).join(' ')} L0,${66 + estiro}" stroke="#868e96" stroke-width="2.5" fill="none"/>
      <rect x="-12" y="24" width="24" height="58" rx="5" fill="#e7f5ff" opacity="0.35" stroke="#e7f5ff" stroke-width="2.5"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M12,${32 + i * 11} h-5" stroke="#e7f5ff" stroke-width="1.5"/>`).join('')}
      <rect x="-2" y="${66 + estiro}" width="4" height="16" fill="#adb5bd"/>
      <path d="M0,${82 + estiro} q8,2 6,9 q-3,6 -9,2" stroke="#adb5bd" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g transform="translate(0 ${92 + estiro})">${carga}</g></g>`;
  const mochila = (k = 1) => `<g transform="scale(${k})"><path d="M-10,0 q10,-10 20,0" stroke="#c92a2a" stroke-width="4" fill="none"/>
      ${dt('<rect x="-22" y="0" width="44" height="46" rx="12" fill="FILL"/>', '#ff6b6b', '#e03131', { x: 8 })}<rect x="-14" y="22" width="28" height="18" rx="5" fill="#c92a2a"/>${cara(0, 12, 2.6, 'feliz')}</g>`;
  const caja = (x, y, w, h, d, c, etq = {}) => `${sombra(x + w / 2 + d / 2, y + h + 2, (w + d) * 0.55)}
      <path d="M${x},${y} l${d},${-d} h${w} l${-d},${d} Z" fill="${tono(c, 0.28)}"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>
      <path d="M${x + w},${y} l${d},${-d} v${h} l${-d},${d} Z" fill="${tono(c, -0.25)}"/>
      <path d="M${x},${y} l${d},${-d} h${w} v${h} l${-d},${d} h${-w} Z M${x},${y} h${w} l${d},${-d} M${x + w},${y} v${h}" stroke="#e7f5ff" stroke-width="2" fill="none" stroke-linejoin="round" opacity="0.8"/>
      ${etq.largo ? texto(x + w / 2, y + h + 17, etq.largo, 14, '#ffd166', 'font-weight="800"') : ''}
      ${etq.alto ? texto(x - 22, y + h / 2 + 5, etq.alto, 14, '#ffd166', 'font-weight="800"') : ''}
      ${etq.ancho ? texto(x + w + d / 2 + 30, y - d / 2 - 6, etq.ancho, 14, '#ffd166', 'font-weight="800"') : ''}`;
  function velocimetro(x, y, r = 50) {
    const p = (a, rr) => `${(rr * Math.cos(a * Math.PI / 180)).toFixed(1)},${(-rr * Math.sin(a * Math.PI / 180)).toFixed(1)}`;
    const arco = (a1, a2, c) => `<path d="M${p(a1, r * 0.8)} A${r * 0.8},${r * 0.8} 0 0 1 ${p(a2, r * 0.8)}" stroke="${c}" stroke-width="7" fill="none"/>`;
    return `<g transform="translate(${x} ${y})">${sombra(0, 8, r)}
      ${dt(`<path d="M${-r},6 A${r},${r} 0 0 1 ${r},6 Z" fill="FILL"/>`, '#343a40', '#212529', { x: r * 0.3 })}
      ${arco(180, 90, '#51cf66')}${arco(90, 36, '#ffd43b')}${arco(36, 0, '#ff6b6b')}
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${p(180 - i * 22.5, r * 0.62)} L${p(180 - i * 22.5, r * 0.7)}" stroke="#e7f5ff" stroke-width="2"/>`).join('')}
      ${texto(0, -r * 0.28, 'km/h', 11, '#c9ccf5', 'font-weight="800"')}
      <line x1="0" y1="0" x2="0" y2="${-r * 0.7}" stroke="#ff922b" stroke-width="4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-60;40;10;55;-60" dur="5s" repeatCount="indefinite"/></line>
      <circle r="6" fill="#ff922b"/></g>`;
  }
  // Probeta graduada (0 a 200 mL) con el agua hasta «ml»; «piedra» la dibuja en el fondo.
  function probetaP(x, ml, piedra = false, marcas = []) {
    const base = PISO - 8, k = 0.5, top = base - 112, yN = base - ml * k;
    return `${sombra(x + 3, PISO + 2, 32)}<rect x="${x - 26}" y="${PISO - 8}" width="52" height="8" rx="3" fill="#a5d8ff" opacity="0.7"/>
      <rect x="${x - 16}" y="${top}" width="32" height="${base - top}" rx="4" fill="#dbe4ff" opacity="0.12"/>
      ${dt(`<rect x="${x - 14}" y="${yN}" width="28" height="${base - yN}" fill="FILL"/>`, '#74c0fc', '#4dabf7', { x: x + 5 })}<rect x="${x - 14}" y="${yN}" width="28" height="3" fill="#d0ebff"/>
      ${piedra ? `<g>${dt(`<path d="M${x - 11},${base} C${x - 14},${base - 14} ${x - 4},${base - 22} ${x + 4},${base - 20} C${x + 14},${base - 18} ${x + 13},${base - 4} ${x + 10},${base} Z" fill="FILL"/>`, '#868e96', '#5c636a', { x: x + 3 })}${cara(x, base - 10, 2.2, 'oh')}</g>` : ''}
      ${Array.from({ length: 10 }, (_, i) => `<path d="M${x + 16},${base - (i + 1) * 20 * k} h${i % 5 === 4 ? -10 : -6}" stroke="#e7f5ff" stroke-width="1.5"/>`).join('')}
      <path d="M${x - 20},${top} H${x - 16} V${base} M${x + 16},${base} V${top}" stroke="#e7f5ff" stroke-width="3" fill="none"/>
      ${brillo(`M${x - 10},${top + 8} V${base - 12}`, 2.5)}
      ${marcas.map(([v, t]) => `<path d="M${x + 18},${base - v * k} H${x + 34}" stroke="#ffd166" stroke-width="1.5" stroke-dasharray="3 2"/>${texto(x + 60, base - v * k + 4, t, 13, '#ffd166', 'font-weight="800"')}`).join('')}`;
  }
  const arbolManzanas = (x, cae = true) => `<g transform="translate(${x} ${PISO})">${sombra(4, 2, 50)}
      ${dt('<path d="M-10,0 L-7,-52 H7 L10,0 Z" fill="FILL"/>', '#a0703d', '#7a4a2a', { x: 2 })}
      ${dt('<path d="M-56,-70 C-66,-96 -40,-122 -14,-116 C-4,-136 30,-136 40,-114 C64,-110 70,-80 54,-64 C50,-46 20,-44 6,-52 C-10,-42 -48,-46 -56,-70 Z" fill="FILL"/>', '#51cf66', '#2f9e44', { x: 14 })}
      ${[[-34, -84], [10, -104], [34, -76], [-8, -70]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="#ff6b6b"/><circle cx="${a - 2}" cy="${b - 2}" r="2" fill="#fff" opacity="0.6"/>`).join('')}
      ${cae ? `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 42;0 42" keyTimes="0;0.55;1" dur="2.4s" repeatCount="indefinite"/><circle cx="46" cy="-48" r="8" fill="#ff6b6b"/><path d="M46,-56 v-5" stroke="#7a4a2a" stroke-width="2"/><circle cx="44" cy="-50" r="2" fill="#fff" opacity="0.6"/></g>` : ''}</g>`;
  const rayo = (x, y) => `${nube(x, y, 1.3, '#868e96', '#5c636a')}<path d="M${x - 4},${y + 14} l-12,26 h12 l-8,24 l24,-32 h-12 l10,-18 Z" fill="#ffe066" class="qzd-pulsa"/>`;
  const lupa = (x, y, r = 30) => `<g transform="translate(${x} ${y})"><path d="M${r * 0.7},${r * 0.7} L${r * 1.6},${r * 1.6}" stroke="#7a4a2a" stroke-width="11" stroke-linecap="round"/>
      <circle r="${r}" fill="#a5d8ff" opacity="0.35"/><circle r="${r}" fill="none" stroke="#adb5bd" stroke-width="7"/>${brillo(`M${-r * 0.55},${-r * 0.2} a${r * 0.6},${r * 0.6} 0 0 1 ${r * 0.35},${-r * 0.35}`, 3)}${cara(0, 0, r * 0.13, 'feliz')}</g>`;
  const mano = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-10,0 V-14 M-4,0 V-20 M2,0 V-20 M8,0 V-15 M-13,4 L-20,-4" stroke="#f2c094" stroke-width="5" stroke-linecap="round"/><rect x="-14" y="-4" width="26" height="18" rx="7" fill="#f2c094"/><path d="M-12,10 h22" stroke="#d9a273" stroke-width="2"/></g>`;

  Object.assign(TEMAS, {
    'La física y el método científico': () => `${mesada()}${arbolManzanas(110)}${lupa(290, 70, 34)}${rayo(480, 46)}
      ${[0, 1, 2].map(i => `<path d="M${430 + i * 30},${PISO + 2} q4,-4 8,0" stroke="#74c0fc" stroke-width="2" fill="none" class="qzd-burbuja" style="animation-delay:${i * 0.3}s"/>`).join('')}`,
    'Magnitudes y unidades': () => `${mesada()}${regla(50, PISO - 26, 170)}${cronometro(290, 82, 36)}${termometro(392)}${balanza(500, `<rect x="${478}" y="${PISO - 56}" width="44" height="26" rx="5" fill="#ffa94d"/>${cara(500, PISO - 46, 2.6, 'feliz')}`)}`,
    'Masa y peso': () => `${tierra(130, 92, 58)}${luna(480, 80, 32)}<g class="qzd-flota">${astronauta(305, 98, 0.95, -12)}</g>
      <path d="M200,92 q100,-60 240,-22" stroke="#c9ccf5" stroke-width="2" stroke-dasharray="5 6" fill="none" opacity="0.6"/>`,
    'Magnitudes derivadas, área y volumen': () => `${mesada()}${caja(70, 70, 70, 70, 30, '#b197fc')}${velocimetro(310, 112, 58)}${probetaP(480, 110, true)}`,
  });
  Object.assign(DIBUJOS, {
    'tele': () => `${mesada()}<g transform="translate(250 ${PISO})">${sombra(4, 2, 80)}<rect x="-70" y="-8" width="140" height="8" rx="3" fill="#7a4a2a"/>
        <rect x="-10" y="-22" width="20" height="14" fill="#495057"/>${dt('<rect x="-74" y="-118" width="148" height="98" rx="10" fill="FILL"/>', '#495057', '#343a40', { x: 40 })}
        <rect x="-64" y="-108" width="128" height="78" rx="6" fill="#5f6b94"/>${cara(0, -74, 5, 'triste')}${brillo('M-56,-100 h26', 2.5)}
        <path d="M60,-14 C90,-4 110,6 150,4" stroke="#212529" stroke-width="4" fill="none"/><rect x="150" y="-2" width="16" height="11" rx="2" fill="#343a40"/><path d="M166,0 h7 M166,6 h7" stroke="#adb5bd" stroke-width="2"/></g>
        <rect x="455" y="${PISO - 60}" width="26" height="36" rx="4" fill="#f8f9fa"/><circle cx="462" cy="${PISO - 42}" r="2.5" fill="#495057"/><circle cx="474" cy="${PISO - 42}" r="2.5" fill="#495057"/>
        ${chico(530, { color: '#4dabf7', animo: 'oh' })}<circle cx="560" cy="34" r="14" fill="#fff"/>${texto(560, 41, '?', 20, '#12143a', 'font-weight="900"')}`,
    'manzana': () => `${mesada()}${arbolManzanas(250)}${chico(330, { color: '#845ef7', pelo: '#e9ecef', animo: 'oh' })}`,
    'pila': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(4, 2, 56)}
        ${dt('<rect x="-50" y="-80" width="100" height="80" rx="6" fill="FILL"/>', '#ff8fab', '#e0607f', { x: 16 })}<rect x="-8" y="-80" width="16" height="80" fill="#ffd43b"/>
        ${dt('<rect x="-56" y="-98" width="112" height="22" rx="5" fill="FILL"/>', '#ff8fab', '#e0607f', { x: 18 })}<rect x="-8" y="-98" width="16" height="22" fill="#ffd43b"/>
        <path d="M0,-98 C-20,-122 -40,-110 -24,-100 M0,-98 C20,-122 40,-110 24,-100" stroke="#ffd43b" stroke-width="6" fill="none" stroke-linecap="round"/>
        ${texto(-28, -30, '?', 34, '#fff', 'font-weight="900"')}${texto(30, -30, '?', 34, '#fff', 'font-weight="900"')}</g>
        ${[[180, 50], [420, 46], [200, 104], [410, 100]].map(([a, b], i) => `<path d="M${a},${b} l-8,14 h8 l-6,14 l16,-20 h-8 l6,-8 Z" fill="#ffe066" class="qzd-pulsa" style="animation-delay:${i * 0.4}s"/>`).join('')}`,
    'mano-banco': () => `${mesada()}<g transform="translate(0 0)">${sombra(300, PISO + 2, 170)}
        ${dt(`<rect x="130" y="${PISO - 62}" width="340" height="16" rx="4" fill="FILL"/>`, '#e8a65d', '#c97b33', { y: PISO - 52 })}
        <rect x="150" y="${PISO - 46}" width="12" height="46" fill="#a0612a"/><rect x="438" y="${PISO - 46}" width="12" height="46" fill="#a0612a"/>
        ${[0, 1, 2, 3].map(i => `${mano(164 + i * 44, PISO - 66, 1.2)}${texto(164 + i * 44, PISO - 98, i + 1, 13, '#ffd166', 'font-weight="800"')}`).join('')}
        ${texto(380, PISO - 92, '…', 24, '#ffd166', 'font-weight="900"')}${texto(430, PISO - 92, '?', 22, '#ffd166', 'font-weight="900"')}</g>`,
    'avion': () => `${nube(110, 120, 1.1, '#dbe4ff', '#a5b4fc')}${nube(500, 40, 0.9, '#dbe4ff', '#a5b4fc')}<g class="qzd-flota"><g transform="translate(300 86)">
        <path d="M-20,-4 L-60,-54 H-40 L20,-4 Z" fill="#a5b4fc"/><path d="M-90,-8 L-104,-40 H-90 L-70,-8 Z" fill="#5c7cfa"/>
        ${dt('<path d="M-104,-8 H90 C120,-8 124,20 96,20 H-96 C-110,20 -110,-8 -104,-8 Z" fill="FILL"/>', '#f8f9fa', '#ced4da', { y: 8 })}
        ${[-60, -40, -20, 0, 20, 40].map(dx => `<circle cx="${dx}" cy="2" r="4" fill="#4dabf7"/>`).join('')}
        <path d="M-20,10 L-50,46 H-30 L20,10 Z" fill="#5c7cfa"/>${cara(84, 2, 3.2, 'feliz')}${brillo('M-90,-3 H60', 2.5)}</g></g>`,
    'altura': () => `${mesada()}<g transform="translate(330 ${PISO})"><rect x="0" y="-130" width="26" height="130" fill="#fff3bf"/>
        ${Array.from({ length: 16 }, (_, i) => `<path d="M0,${-i * 8} h${i % 5 ? 7 : 13}" stroke="#7a5a12" stroke-width="1.5"/>`).join('')}</g>
        ${chico(290, { color: '#f783ac', pelo: '#7a4a2a', k: 0.94 })}<path d="M262,${PISO - 112} H338" stroke="#ffd166" stroke-width="2.5"/>${texto(410, PISO - 107, '140 cm', 15, '#ffd166', 'font-weight="800"')}`,
    'instrumentos': () => `${mesada()}${balanza(190, `<rect x="168" y="${PISO - 58}" width="44" height="28" rx="5" fill="#ffa94d"/>${cara(190, PISO - 47, 2.6, 'feliz')}`)}
        ${dinamometro(410, 16, `${dt('<circle cy="16" r="16" fill="FILL"/>', '#ff6b6b', '#e03131', { x: 5 })}<path d="M0,0 v-2" stroke="#2f9e44" stroke-width="3"/>${cara(0, 16, 2.4, 'feliz')}`)}`,
    'astronauta': () => `${tierra(110, 120, 70)}${luna(500, 60, 36)}<g class="qzd-flota">${astronauta(320, 86, 1.1, 10)}</g>`,
    'mochila': () => `${planeta(150, 86, 56, '#ff922b', '#e8590c', `<path d="M-60,-10 h120 M-60,14 h120" stroke="#ffc078" stroke-width="7"/>`)}${texto(150, 164, 'g = 12 m/s²', 13, '#ffd166', 'font-weight="800"')}
        ${dinamometro(390, 34, mochila(0.95))}`,
    'velocimetro': () => `<rect y="${PISO - 6}" width="${W}" height="${H - PISO + 6}" fill="#343a40"/>${velocimetro(300, 120, 82)}`,
    'bici': () => `<rect y="${PISO}" width="${W}" height="${H - PISO}" fill="#343a40"/><path d="M0,${PISO + 14} H${W}" stroke="#ffd43b" stroke-width="3" stroke-dasharray="24 18"/>
        ${[[40, '0 km'], [560, '30 km']].map(([a, t]) => `<path d="M${a},${PISO} V${PISO - 70}" stroke="#adb5bd" stroke-width="3"/><path d="M${a},${PISO - 70} h30 l-6,9 6,9 h-30 Z" fill="#ff6b6b"/>${texto(a, PISO - 78, t, 13, '#ffd166', 'font-weight="800"')}`).join('')}
        <g transform="translate(300 ${PISO - 22})">${[-40, 40].map(dx => `<g transform="translate(${dx} 0)"><circle r="21" fill="none" stroke="#e9ecef" stroke-width="4"/><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/>${[0, 60, 120].map(a => `<line x1="-20" y1="0" x2="20" y2="0" stroke="#adb5bd" stroke-width="1.5" transform="rotate(${a})"/>`).join('')}</g></g>`).join('')}
          <path d="M-40,0 L-10,0 L20,-34 L-18,-34 Z M-10,0 L-22,-46 M40,0 L22,-46 M14,-46 H30" stroke="#ff6b6b" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
          <path d="M-30,-48 h16" stroke="#343a40" stroke-width="6" stroke-linecap="round"/>
          <path d="M-20,-50 L0,-82 M-4,-74 L24,-48" stroke="#4dabf7" stroke-width="10" stroke-linecap="round"/><path d="M-20,-50 L-6,-18" stroke="#364fc7" stroke-width="8" stroke-linecap="round"/>
          <g transform="translate(6 -96)">${dt('<circle r="15" fill="FILL"/>', '#f2c094', '#d9a273', { x: 5 })}<path d="M-17,-2 C-18,-22 18,-22 17,-2 Z" fill="#ffd43b"/>${cara(4, 3, 3, 'feliz')}</g></g>
        ${cronometro(470, 50, 22)}${texto(470, 96, '2 h', 13, '#ffd166', 'font-weight="800"')}`,
    'probeta-piedra': () => `${mesada()}${probetaP(200, 120, false, [[120, '120 mL']])}<path d="M290,80 h40" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/><path d="M330,72 l10,8 -10,8" fill="#ffd166"/>${probetaP(400, 180, true, [[180, '180 mL']])}`,
    'piscina': () => `<rect y="${PISO - 10}" width="${W}" height="${H - PISO + 10}" fill="#2f9e44"/>${caja(200, 60, 200, 50, 46, '#4dabf7', { largo: '10 m', alto: '2 m', ancho: '5 m' })}
        ${[0, 1, 2].map(i => `<path d="M${226 + i * 50 + 23},${36} q8,-5 16,0 t16,0" stroke="#e7f5ff" stroke-width="2" fill="none" class="qzd-fluye"/>`).join('')}`,
    'terreno': () => `<g transform="translate(160 22)"><rect width="280" height="120" rx="4" fill="#51cf66"/><rect width="280" height="120" rx="4" fill="none" stroke="#a0703d" stroke-width="4" stroke-dasharray="10 6"/>
        <g transform="translate(70 60)">${dt('<rect x="-26" y="-14" width="52" height="34" fill="FILL"/>', '#ffe8cc', '#ffd8a8', { x: 8 })}<path d="M-32,-14 L0,-38 L32,-14 Z" fill="#e8590c"/><rect x="-6" y="4" width="12" height="16" fill="#7a4a2a"/></g>
        ${Arte.pino(220, 84, 56)}${Arte.pino(250, 108, 50)}</g>${texto(300, 162, '50 m', 15, '#ffd166', 'font-weight="800"')}${texto(124, 88, '30 m', 15, '#ffd166', 'font-weight="800"')}`,
    'carton-leche': () => `${mesada()}<g transform="translate(300 ${PISO})">${sombra(4, 2, 40)}
        ${dt('<path d="M-34,0 V-90 L-24,-112 H24 L34,-90 V0 Z" fill="FILL"/>', '#f8f9fa', '#dee2e6', { x: 12 })}<path d="M-34,-90 H34" stroke="#ced4da" stroke-width="2"/>
        <rect x="-24" y="-122" width="48" height="10" fill="#e9ecef"/><rect x="-34" y="-60" width="68" height="34" fill="#4dabf7"/>
        ${texto(0, -40, 'LECHE', 13, '#fff', 'font-weight="900"')}${texto(0, -12, '1 L', 13, '#1c7ed6', 'font-weight="900"')}${cara(0, -78, 3.6, 'feliz')}</g>`,
    'tanque': () => `${mesada()}${caja(230, 40, 100, 100, 40, '#74c0fc', { largo: '3 m', alto: '3 m', ancho: '3 m' })}<rect x="325" y="${PISO - 26}" width="26" height="8" rx="2" fill="#adb5bd"/><circle cx="350" cy="${PISO - 12}" r="3" fill="#74c0fc" class="qzd-cae"/>${cara(280, 90, 4, 'feliz')}`,
  });

  // ---------- 2.º año: Química y Ciencias naturales ----------
  // Partículas dentro de una caja: 'solido' (ordenadas, vibran), 'liquido' (juntas, se deslizan) o 'gas' (separadas, vuelan).
  function particulas(x, y, w, h, estado, c = '#74c0fc', semilla = 1) {
    let s = semilla;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const r = 7, pts = [];
    if (estado === 'solido') {
      for (let f = 0; f < 3; f++) for (let k = 0; k < 5; k++) pts.push([x + w / 2 - 34 + k * 17, y + h - 12 - f * 16]);
    } else if (estado === 'liquido') {
      for (let i = 0; i < 13; i++) pts.push([x + 12 + rnd() * (w - 24), y + h - 12 - rnd() * (h * 0.45)]);
    } else {
      for (let i = 0; i < 7; i++) pts.push([x + 12 + rnd() * (w - 24), y + 12 + rnd() * (h - 24)]);
    }
    const mov = (i) => {
      if (estado === 'solido') return `<animateTransform attributeName="transform" type="translate" values="0 0;1.5 -1;-1.5 1;0 0" dur="${0.4 + (i % 3) * 0.1}s" repeatCount="indefinite"/>`;
      const a = estado === 'gas' ? 26 : 7, d = estado === 'gas' ? 1.6 : 3;
      const v = Array.from({ length: 4 }, () => `${((rnd() - 0.5) * 2 * a).toFixed(1)} ${((rnd() - 0.5) * 2 * a * (estado === 'gas' ? 1 : 0.4)).toFixed(1)}`);
      return `<animateTransform attributeName="transform" type="translate" values="0 0;${v.join(';')};0 0" dur="${d + rnd()}s" repeatCount="indefinite"/>`;
    };
    return `${sombra(x + w / 2 + 3, y + h + 3, w * 0.55)}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#dbe4ff" opacity="0.1"/>
      ${pts.map(([px, py], i) => `<g>${mov(i)}<circle cx="${px}" cy="${py}" r="${r}" fill="${c}"/><circle cx="${px - 2}" cy="${py - 2}" r="2.2" fill="#fff" opacity="0.6"/></g>`).join('')}
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="#e7f5ff" stroke-width="3"/>`;
  }
  // Molécula de agua con cara.
  const molecula = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">
      <line x1="0" y1="0" x2="-26" y2="18" stroke="#dbe4ff" stroke-width="6"/><line x1="0" y1="0" x2="26" y2="18" stroke="#dbe4ff" stroke-width="6"/>
      ${[-26, 26].map(dx => dt(`<circle cx="${dx}" cy="18" r="12" fill="FILL"/>`, '#f8f9fa', '#ced4da', { x: dx + 4 })).join('')}
      ${dt('<circle r="20" fill="FILL"/>', '#ff6b6b', '#e03131', { x: 6 })}${brillo('M-12,-6 a12,12 0 0 1 8,-9', 2.5)}${cara(0, -1, 2.8, 'feliz')}</g>`;
  const carpincho = (x, y, k = 1, dir = 1) => `<g transform="translate(${x} ${y}) scale(${k * dir} ${k})">${sombra(0, 22, 36)}
      <rect x="-24" y="8" width="9" height="16" rx="4" fill="#7a4a2a"/><rect x="14" y="8" width="9" height="16" rx="4" fill="#7a4a2a"/>
      ${dt('<path d="M-36,4 C-40,-22 -8,-30 18,-24 C34,-22 46,-10 44,4 C42,16 -32,18 -36,4 Z" fill="FILL"/>', '#b07a4a', '#8c5a32', { y: 2 })}
      ${dt('<path d="M24,-22 C34,-34 58,-30 60,-14 C62,-4 50,2 36,0 C28,-2 22,-12 24,-22 Z" fill="FILL"/>', '#b07a4a', '#8c5a32', { y: -8 })}
      <ellipse cx="30" cy="-28" rx="5" ry="4" fill="#8c5a32"/>${ojo(44, -18, 3.2)}<circle cx="58" cy="-12" r="2" fill="#4a2c18"/>
      <path d="M50,-5 q4,2 8,0" stroke="#4a2c18" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  const juncos = (x, h = 46) => `<g>${[0, 8, 16].map((dx, i) => `<path d="M${x + dx},${PISO} q${-3 + i * 3},${-h / 2} ${-2 + i * 2},${-h + i * 6}" stroke="#2f9e44" stroke-width="3" fill="none"/>`).join('')}<rect x="${x + 5}" y="${PISO - h - 4}" width="6" height="16" rx="3" fill="#7a4a2a"/></g>`;
  const aguaPantano = () => `<rect y="${PISO - 14}" width="${W}" height="${H - PISO + 14}" fill="#1c7ed6" opacity="0.75"/>${[60, 220, 380, 520].map((a, i) => `<path d="M${a},${PISO + 4 + (i % 2) * 8} q8,-4 16,0 t16,0" stroke="#a5d8ff" stroke-width="2" fill="none" class="qzd-fluye"/>`).join('')}`;
  // Tubo digestivo con cara en el estómago (sin rótulos ni glándulas).
  const tuboDigestivo = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">
      <path d="M0,-70 V-34" stroke="#ff8fab" stroke-width="9" stroke-linecap="round"/>
      ${dt('<path d="M-6,-40 C14,-46 36,-28 32,-8 C28,10 4,14 -12,6 C-22,0 -16,-12 -6,-14 C2,-16 2,-24 -6,-28 Z" fill="FILL"/>', '#ff8fab', '#e0607f', { x: 12 })}
      <path d="M30,66 V18 H-34 V66 Q-34,74 -24,74 H6 V86" fill="none" stroke="#e8a0b0" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M-12,6 V28 H18 V38 H-20 V48 H18 V58 H-20" fill="none" stroke="#ffc9c9" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>${cara(10, -18, 2.8, 'feliz')}</g>`;
  const corredor = (x, color = '#4dabf7') => `<g transform="translate(${x} ${PISO}) scale(0.8)">${sombra(0, 2, 26)}
      <path d="M-4,-32 L-22,-2 M4,-32 L18,-14 L10,0" stroke="#364fc7" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${dt('<rect x="-18" y="-78" width="36" height="50" rx="14" fill="FILL" transform="rotate(12 0 -50)"/>', color, tono(color, -0.2), { x: 6 })}
      <path d="M-10,-66 L-30,-48 L-20,-36 M14,-68 L30,-58 L40,-70" stroke="#f2c094" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="translate(8 -96)">${dt('<circle r="19" fill="FILL"/>', '#f2c094', '#d9a273', { x: 7 })}<path d="M-20,-2 C-22,-22 22,-24 20,-2 C14,-12 -14,-12 -20,-2 Z" fill="#3d2614"/>${cara(3, 2, 3.8, 'oh')}
        <path d="M22,-6 q4,6 0,10" stroke="#74c0fc" stroke-width="3" fill="none" class="qzd-cae"/></g>
      ${[0, 1, 2].map(i => `<path d="M-40,${-80 + i * 18} h-${18 + i * 6}" stroke="#c9ccf5" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`).join('')}</g>`;
  const frascoMiel = (x) => `${sombra(x + 2, PISO + 2, 20)}${dt(`<rect x="${x - 18}" y="${PISO - 40}" width="36" height="40" rx="8" fill="FILL"/>`, '#fab005', '#e67700', { x: x + 6 })}<rect x="${x - 20}" y="${PISO - 48}" width="40" height="10" rx="3" fill="#e8590c"/>${cara(x, PISO - 22, 2.6, 'feliz')}`;
  const vasoTe = (x) => `${sombra(x + 2, PISO + 2, 34)}<path d="M${x + 30},${PISO - 40} q22,4 0,24" stroke="#f8f9fa" stroke-width="6" fill="none"/>
      ${dt(`<path d="M${x - 34},${PISO - 52} H${x + 34} L${x + 28},${PISO - 4} Q${x + 27},${PISO} ${x + 22},${PISO} H${x - 22} Q${x - 27},${PISO} ${x - 28},${PISO - 4} Z" fill="FILL"/>`, '#f8f9fa', '#dee2e6', { x: x + 12 })}
      <ellipse cx="${x}" cy="${PISO - 50}" rx="31" ry="5" fill="#c0792f"/>${vapor(x, PISO - 62, '#c9ccf5', 0.8)}`;

  Object.assign(TEMAS, {
    'Niveles de organización de la materia': () => `${tierra(110, 86, 56)}${lupa(300, 72, 34)}${molecula(480, 74, 1.3)}
      ${[[200, 80], [400, 80]].map(([a, b]) => `<path d="M${a - 16},${b} h28" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/><path d="M${a + 12},${b - 8} l10,8 -10,8" fill="#ffd166"/>`).join('')}`,
    'Modelo cinético de partículas': () => `${mesada()}${particulas(70, 66, 120, 70, 'solido', '#a5d8ff', 3)}${particulas(240, 66, 120, 70, 'liquido', '#74c0fc', 5)}${particulas(410, 30, 120, 106, 'gas', '#4dabf7', 7)}`,
    'Sustancias puras y soluciones': () => `${mesada()}${frasco(110, 'H₂O', '#a5d8ff', '#2f9e44')}
      ${vaso(270, 100, 100, [{ h: 70, c: '#74c0fc', borde: true }], `<path d="M${300},${PISO - 112} L${262},${PISO - 26}" stroke="#adb5bd" stroke-width="5" stroke-linecap="round"/>${[0, 1, 2, 3].map(i => `<circle cx="${250 + i * 14}" cy="${PISO - 60 + (i % 2) * 14}" r="3" fill="#fff" class="qzd-burbuja" style="animation-delay:${i * 0.3}s"/>`).join('')}`)}
      ${sombra(450, PISO + 2, 60)}${dt(`<path d="M${400},${PISO} L${410},${PISO - 26} H${500} L${490},${PISO} Z" fill="FILL"/>`, '#e8a33d', '#b8741c', { x: 470 })}${brillo(`M414,${PISO - 20} H480`, 2.5)}${cara(450, PISO - 13, 3, 'feliz')}`,
    'Alimentos y nutrientes': () => `${mesada()}${comida('pan', 90, PISO - 26)}${comida('leche', 200, PISO - 30)}${comida('huevo', 300, PISO - 24)}${comida('manzana', 400, PISO - 24)}${comida('carne', 510, PISO - 24)}`,
    'El sistema digestivo': () => `${mesada()}${comida('manzana', 130, PISO - 24)}<path d="M180,${PISO - 60} h40" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/><path d="M220,${PISO - 68} l10,8 -10,8" fill="#ffd166"/>${tuboDigestivo(320, 60, 0.95)}
      ${[0, 1, 2].map(i => `<circle cx="${430 + i * 30}" cy="${70 + (i % 2) * 20}" r="${7 - i}" fill="#ffd43b" class="qzd-flota" style="animation-delay:${i * 0.5}s"/>`).join('')}`,
    'La nutrición en la vida cotidiana': () => `${mesada()}${corredor(200)}${ORGANO.corazon(380, 70, 0.9)}${ORGANO.pulmones(500, 86)}`,
  });
  Object.assign(DIBUJOS, {
    'niveles': () => `${mesada()}${chico(90, { color: '#69db7c' })}${celulaAnimal(220, 80, 0.5)}${ORGANO.corazon(340, 86, 0.9)}${vistaMicroscopio(470, 78, 46, 'qzd-nv' + n)}`,
    'carpinchos': () => `${aguaPantano()}${juncos(30)}${juncos(560, 60)}${carpincho(150, PISO - 30, 1)}${carpincho(310, PISO - 26, 0.8, -1)}${carpincho(440, PISO - 30, 1.05)}`,
    'humedal': () => `${aguaPantano()}${juncos(40)}${juncos(110, 60)}${juncos(480, 54)}${juncos(540)}
      <g transform="translate(300 ${PISO - 40})"><path d="M-4,26 V48 M6,26 V48" stroke="#ffa94d" stroke-width="3"/>${dt('<ellipse cx="0" cy="12" rx="22" ry="16" fill="FILL"/>', '#f8f9fa', '#dee2e6', { y: 16 })}<path d="M14,4 C24,-16 16,-36 28,-42" stroke="#f8f9fa" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="30" cy="-44" r="9" fill="#f8f9fa"/><path d="M38,-44 l18,3 -18,3 Z" fill="#ffa94d"/>${ojo(32, -46, 2.6, 1)}</g>
      ${nube(150, 40, 0.8, '#dbe4ff', '#a5b4fc')}`,
    'particulas-calor': () => `${mesada()}${particulas(240, 36, 120, 80, 'liquido', '#74c0fc', 11)}${sombra(303, PISO + 2, 80)}${dt(`<rect x="226" y="${PISO - 22}" width="148" height="22" rx="5" fill="FILL"/>`, '#868e96', '#5c636a', { x: 330 })}<rect x="236" y="${PISO - 24}" width="128" height="5" rx="2" fill="#ff6b6b" class="qzd-pulsa"/>${termometro(450)}`,
    'particulas-estados': () => TEMAS['Modelo cinético de partículas'](),
    'globo': () => `${mesada()}${chico(250, { color: '#ffd43b', brazo: brazoC(30, -96, '#ffd43b'), animo: 'oh' })}
      <path d="M274,${PISO - 77} C290,${PISO - 110} 300,${PISO - 120} 320,${PISO - 124}" stroke="#adb5bd" stroke-width="1.5" fill="none"/>
      <g class="qzd-flota">${dt('<ellipse cx="330" cy="40" rx="26" ry="32" fill="FILL"/>', '#ff6b6b', '#e03131', { x: 338 })}${brillo('M316,26 q4,-10 12,-12', 3)}</g>
      ${[[420, 46], [450, 30], [470, 62], [440, 76], [490, 40]].map(([a, b], i) => `<path d="M${a},${b} l${(i % 2 ? 1 : -1) * 10},${-6 + i * 3}" stroke="#ffd166" stroke-width="3" stroke-linecap="round" class="qzd-pulsa"/>`).join('')}
      ${texto(450, 100, '¡PUM!', 22, '#ffd166', 'font-weight="900"')}`,
    'te': () => `${mesada()}${vasoTe(240)}<g transform="translate(400 ${PISO})">${sombra(2, 2, 30)}${dt('<path d="M-30,-40 H30 V-8 Q30,0 22,0 H-22 Q-30,0 -30,-8 Z" fill="FILL"/>', '#f8f9fa', '#dee2e6', { x: 10 })}<ellipse cx="0" cy="-40" rx="30" ry="6" fill="#fff"/>${[-12, -2, 9].map(dx => `<rect x="${dx}" y="-48" width="9" height="9" fill="#fff" stroke="#dee2e6"/>`).join('')}${cara(0, -22, 3, 'feliz')}</g>`,
    'azucar-fondo': () => `${mesada()}${vaso(300, 110, 112, [{ h: 14, c: '#f8f9fa' }, { h: 70, c: '#a5d8ff', borde: true }])}${cara(300, PISO - 50, 3.4, 'oh')}`,
    'origen': () => `${mesada()}${comida('huevo', 170, PISO - 24)}${frascoMiel(300)}${comida('leche', 430, PISO - 30)}${texto(300, 30, '?', 26, '#ffd166', 'font-weight="900"')}`,
    'etiqueta': () => `${mesada()}<g transform="translate(200 ${PISO})">${sombra(4, 2, 50)}${dt('<rect x="-50" y="-112" width="100" height="112" rx="8" fill="FILL"/>', '#ffa94d', '#e8590c', { x: 20 })}${cara(0, -84, 3.6, 'feliz')}</g>
      <g transform="translate(330 22)"><rect width="190" height="112" rx="6" fill="#fff"/>${texto(95, 18, 'Información nutricional', 11, '#12143a', 'font-weight="900"')}
        ${['Valor energético', 'Carbohidratos', 'Proteínas', 'Grasas totales', 'Sodio'].map((t, i) => `<path d="M10,${30 + i * 16} H180" stroke="#adb5bd"/><text x="12" y="${42 + i * 16}" class="qzd-t" style="font-size:10px" fill="#12143a">${t}</text><rect x="140" y="${33 + i * 16}" width="34" height="9" rx="2" fill="#dee2e6"/>`).join('')}</g>`,
    'chatarra': () => `${mesada()}${comida('snack', 160, PISO - 30, 1.8)}${comida('gaseosa', 300, PISO - 30, 1.9)}${comida('golosina', 440, PISO - 26, 1.8)}`,
    'digestivo': () => `${mesada()}${tuboDigestivo(300, 62, 0.95)}${[[210, 70], [400, 60], [390, 112]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="14" fill="#12143a" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 3"/>${texto(a, b + 6, '?', 16, '#ffd166', 'font-weight="900"')}`).join('')}`,
    'beaumont': () => `${mesada()}<g transform="translate(330 70)">${ORGANO.estomago(0, 0)}</g><path d="M180,24 C230,30 300,30 324,52" stroke="#e9ecef" stroke-width="2" fill="none"/><rect x="316" y="48" width="18" height="12" rx="4" fill="#c0392b"/>
      ${lupa(150, 70, 28)}<g transform="translate(470 ${PISO})">${sombra(0, 2, 30)}<rect x="-26" y="-40" width="52" height="40" rx="3" fill="#fff8e1"/><path d="M0,-40 V0" stroke="#dee2e6" stroke-width="2"/>${[0, 1, 2].map(i => `<path d="M-20,${-30 + i * 10} h14 M6,${-30 + i * 10} h14" stroke="#adb5bd" stroke-width="2"/>`).join('')}</g>`,
    'jarabe': () => `${mesada()}${frasco(150, 'JARABE', '#c2255c', '#495057', 46, 72)}<g transform="translate(260 ${PISO - 70}) rotate(-20)">${dt('<path d="M-50,-4 H10 C20,-14 50,-12 54,0 C50,12 20,14 10,4 H-50 Q-54,0 -50,-4 Z" fill="FILL"/>', '#e9ecef', '#adb5bd', { y: 0 })}<ellipse cx="34" cy="0" rx="14" ry="6" fill="#c2255c"/></g>
      ${chico(440, { color: '#748ffc', animo: 'oh' })}<circle cx="480" cy="30" r="14" fill="#fff"/>${texto(480, 37, '?', 20, '#12143a', 'font-weight="900"')}`,
    'antidoping': () => `${mesada()}${chico(220, { color: '#51cf66', brazo: brazoC(36, -92, '#51cf66') })}<g transform="translate(220 ${PISO - 72})"><path d="M-10,-14 L0,6 L10,-14" stroke="#4dabf7" stroke-width="4" fill="none"/><circle cy="12" r="9" fill="#ffd43b"/><circle cy="12" r="4" fill="#fab005"/></g>
      <g transform="translate(400 ${PISO})">${sombra(2, 2, 24)}<rect x="-20" y="-52" width="40" height="52" rx="6" fill="#e7f5ff" opacity="0.6" stroke="#e7f5ff" stroke-width="2.5"/><rect x="-17" y="-30" width="34" height="27" rx="4" fill="#ffe066"/><rect x="-23" y="-60" width="46" height="10" rx="3" fill="#4dabf7"/><rect x="-14" y="-46" width="28" height="12" fill="#fff"/></g>`,
    'pulso': () => `${mesada()}<g transform="translate(220 ${PISO}) scale(1.08)">${sombra(2, 2, 24)}${dt('<rect x="-20" y="-78" width="40" height="52" rx="14" fill="FILL"/>', '#ff922b', '#e8590c', { x: 7 })}<rect x="-7" y="-84" width="14" height="10" fill="#d9a273"/>
        <g transform="translate(0 -102)">${dt('<circle r="20" fill="FILL"/>', '#f2c094', '#d9a273', { x: 7 })}<path d="M-21,-2 C-24,-24 24,-26 21,-2 C14,-14 -14,-14 -21,-2 Z" fill="#7a4a2a"/>${cara(0, 2, 4, 'feliz')}</g>
        <path d="M14,-66 Q28,-76 10,-82" stroke="#e8590c" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="8" cy="-82" r="6" fill="#f2c094"/></g>
      ${ORGANO.corazon(400, 70, 0.8)}${cronometro(510, 70, 28)}`,
    'correr': () => `${mesada()}${corredor(230, '#ff6b6b')}${cronometro(420, 64, 32)}${[0, 1, 2].map(i => `<g class="qzd-flota" style="animation-delay:${i * 0.6}s"><circle cx="${500 + i * 26}" cy="${50 + (i % 2) * 30}" r="13" fill="#a5d8ff" opacity="0.8"/>${texto(500 + i * 26, 55 + (i % 2) * 30, 'O₂', 10, '#12143a', 'font-weight="900"')}</g>`).join('')}`,
    'arteria': () => `<rect width="${W}" height="${H}" fill="#2b0d1e"/><path d="M0,22 H${W} V148 H0 Z" fill="#c92a2a"/><path d="M0,34 H${W} V136 H0 Z" fill="#8c1a41"/>
      ${dt('<path d="M220,36 C260,36 300,64 340,64 C380,64 400,36 430,36 Z" fill="FILL"/>', '#ffe066', '#fab005', { y: 50 })}${dt('<path d="M240,134 C280,134 300,112 340,112 C370,112 390,134 420,134 Z" fill="FILL"/>', '#ffe066', '#fab005', { y: 124 })}
      <g class="qzd-fluye">${[[80, 70], [140, 100], [200, 84], [470, 80], [530, 104], [400, 92]].map(([a, b]) => `<g transform="translate(${a} ${b})">${dt('<ellipse rx="13" ry="9" fill="FILL"/>', '#ff6b6b', '#e03131', { y: 2 })}<ellipse rx="6" ry="3.5" fill="#c92a2a"/></g>`).join('')}</g>`,
    'galletitas': () => `${mesada()}${comida('avena', 90, PISO - 26)}${comida('huevo', 190, PISO - 24)}${comida('aceite', 290, PISO - 30)}${frascoMiel(390)}
      <g transform="translate(510 ${PISO - 14})">${sombra(0, 14, 40)}${[[-20, 0], [18, 2], [0, -14]].map(([a, b]) => `${dt(`<circle cx="${a}" cy="${b}" r="16" fill="FILL"/>`, '#e8a65d', '#c97b33', { x: a + 5 })}<circle cx="${a - 4}" cy="${b - 3}" r="2" fill="#7a4a2a"/><circle cx="${a + 5}" cy="${b + 4}" r="2" fill="#7a4a2a"/>`).join('')}</g>`,
  });

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
