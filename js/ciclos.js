// Módulo 8: Ciclos de la naturaleza (agua, carbono y nitrógeno).
// Cada ciclo tiene un paisaje ilustrado en SVG. Los procesos ocurren sobre el paisaje: partículas
// (gotas, vapor, copos, moléculas) recorren una "ruta" dibujada a mano para cada proceso.
const Ciclos = (function () {
  // ---------- Partículas ----------
  // Cada estilo es una figura centrada en (0,0). Se usan para la animación y para el viajero.
  const ESTILOS = {
    gota: { nombre: 'Gota de agua', svg: '<path d="M0,-9 C6,-2 7,4 0,8 C-7,4 -6,-2 0,-9 Z" fill="#5cc8ff" stroke="#fff" stroke-width="1.4"/><circle cx="-2" cy="1" r="1.6" fill="#fff" opacity="0.8"/>' },
    vapor: { nombre: 'Vapor de agua', svg: '<path d="M-3,8 q5,-4 0,-8 t0,-8" fill="none" stroke="#2f6fd6" stroke-opacity="0.55" stroke-width="5.5" stroke-linecap="round"/><path d="M-3,8 q5,-4 0,-8 t0,-8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' },
    copo: { nombre: 'Nieve', svg: [0, 60, 120].map(a => `<g transform="rotate(${a})"><line x1="0" y1="-8" x2="0" y2="8" stroke="#2f6fd6" stroke-opacity="0.6" stroke-width="4.5" stroke-linecap="round"/><line x1="0" y1="-8" x2="0" y2="8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>`).join('') },
    co2: { nombre: 'CO₂ (dióxido de carbono)', svg: '<circle cx="-7.5" r="4.3" fill="#ff6b6b" stroke="#fff" stroke-width="0.9"/><circle cx="7.5" r="4.3" fill="#ff6b6b" stroke="#fff" stroke-width="0.9"/><circle r="5.3" fill="#2b2d42" stroke="#fff" stroke-width="0.9"/><circle cx="-1.6" cy="-1.8" r="1.4" fill="#fff" opacity="0.6"/>' },
    c: { nombre: 'Carbono dentro de seres vivos o fósiles', svg: '<circle r="7" fill="#2b2d42" stroke="#ffd166" stroke-width="1.6"/><text y="3.2" text-anchor="middle" font-size="9" font-weight="800" fill="#ffd166">C</text>' },
    n2: { nombre: 'N₂ (nitrógeno del aire)', svg: '<circle cx="-4.5" r="5" fill="#7c86ff" stroke="#fff" stroke-width="0.9"/><circle cx="4.5" r="5" fill="#7c86ff" stroke="#fff" stroke-width="0.9"/>' },
    nh4: { nombre: 'Amonio (NH₄⁺)', svg: '<circle r="6" fill="#c05ce0" stroke="#fff" stroke-width="0.9"/>' + [[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#f1f3ff" stroke="#c05ce0" stroke-width="1"/>`).join('') },
    no3: { nombre: 'Nitrato (NO₃⁻)', svg: [0, 120, 240].map(a => `<circle cx="${(8 * Math.sin(a * Math.PI / 180)).toFixed(1)}" cy="${(-8 * Math.cos(a * Math.PI / 180)).toFixed(1)}" r="3.4" fill="#ff6b6b" stroke="#fff" stroke-width="0.9"/>`).join('') + '<circle r="5.5" fill="#7c86ff" stroke="#fff" stroke-width="0.9"/>' },
    n: { nombre: 'Nitrógeno dentro de seres vivos', svg: '<circle r="7" fill="#3b44b8" stroke="#a5b4ff" stroke-width="1.6"/><text y="3.2" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">N</text>' },
  };
  const figura = (estilo, x, y, s = 1) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">${ESTILOS[estilo].svg}</g>`;

  // ---------- Paisajes (estilo ilustración de divulgación) ----------

  const DEFS = `
    <linearGradient id="cc-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171b55"/><stop offset="0.5" stop-color="#2d56a8"/><stop offset="1" stop-color="#6fc3df"/></linearGradient>
    <radialGradient id="cc-sol" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6d5"/><stop offset="0.35" stop-color="#ffd166"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
    <linearGradient id="cc-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c8dff"/><stop offset="1" stop-color="#172a7a"/></linearGradient>
    <linearGradient id="cc-pasto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34d27f"/><stop offset="1" stop-color="#1b9e63"/></linearGradient>
    <linearGradient id="cc-suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a48"/><stop offset="1" stop-color="#43283d"/></linearGradient>
    <linearGradient id="cc-roca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d2f6e"/><stop offset="1" stop-color="#15163d"/></linearGradient>
    <linearGradient id="cc-acuifero" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3563c9"/><stop offset="1" stop-color="#22358a"/></linearGradient>
    <radialGradient id="cc-vineta" cx="0.5" cy="0.45" r="0.78"><stop offset="0.62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient>
    <pattern id="cc-poros" width="16" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.8" fill="#bcd6ff" opacity="0.55"/><circle cx="12" cy="10" r="1.4" fill="#bcd6ff" opacity="0.45"/></pattern>
    <pattern id="cc-granos" width="18" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r="1.3" fill="#fff" opacity="0.08"/><circle cx="12" cy="12" r="1.6" fill="#000" opacity="0.12"/></pattern>
    <marker id="cc-flecha" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#fff"/></marker>`;

  // ---------- Piezas de ilustración ----------
  // Luz siempre desde el Sol: caras iluminadas más claras, sombras suaves al pie de cada objeto.

  const cielo = (solX, solY, rayos = true) => `
    <rect width="800" height="460" fill="url(#cc-cielo)"/>
    ${[[120, 30], [260, 18], [380, 42], [520, 22], [600, 50], [760, 30], [330, 70]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 1 : 1.4}" fill="#fff" class="cc-estrella" style="animation-delay:${i * 0.4}s"/>`).join('')}
    ${rayos ? `<g opacity="0.06">${[0, 1, 2, 3, 4].map(i => {
      const dir = solX < 400 ? 1 : -1, a1 = (18 + i * 14) * Math.PI / 180, a2 = a1 + 6 * Math.PI / 180;
      return `<path d="M${solX},${solY} L${solX + dir * 900 * Math.cos(a1)},${solY + 900 * Math.sin(a1)} L${solX + dir * 900 * Math.cos(a2)},${solY + 900 * Math.sin(a2)} Z" fill="#fff6d5"/>`;
    }).join('')}</g>` : ''}
    <g class="cc-sol-latido"><circle cx="${solX}" cy="${solY}" r="120" fill="url(#cc-sol)" opacity="0.55"/></g>
    <circle cx="${solX}" cy="${solY}" r="54" fill="url(#cc-sol)"/><circle cx="${solX}" cy="${solY}" r="28" fill="#fff3c4"/>`;
  const vineta = '<rect width="800" height="460" fill="url(#cc-vineta)" pointer-events="none"/>';
  const sombra = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${Math.max(2, rx * 0.18)}" fill="#0a0c2a" opacity="0.28"/>`;

  // Capas lejanas: cuanto más lejos, más claras y azuladas (perspectiva atmosférica).
  const lejanas = (d1, d2) => `<path d="${d1}" fill="#6d8fd6" opacity="0.55"/><path d="${d2}" fill="#4f74c4" opacity="0.75"/>`;

  const nube = (x, y, s = 1, extra = '', oscura = false) => {
    const [c1, c2, c3] = oscura ? ['#8e92d6', '#a5a9ea', '#6b6fb5'] : ['#ffffff', '#ffffff', '#c9d3ff'];
    return `<g transform="translate(${x} ${y}) scale(${s})"><g class="cc-nube ${extra}">
      <rect x="-62" y="-4" width="124" height="26" rx="13" fill="${c1}"/>
      <circle cx="-26" cy="-8" r="22" fill="${c1}"/><circle cx="10" cy="-18" r="29" fill="${c2}"/><circle cx="40" cy="-2" r="17" fill="${c1}"/>
      <path d="M-62,12 L62,12 L62,9 a13,13 0 0 1 -13,13 L-49,22 a13,13 0 0 1 -13,-13 Z" fill="${c3}"/>
      <circle cx="0" cy="-26" r="10" fill="#fff" opacity="${oscura ? 0.25 : 0.6}"/></g></g>`;
  };

  // Montaña facetada con nieve; k = cuánta nieve hay (1 = normal).
  const montania = (x, base, w, h, nieve = true, k = 1) => {
    const py = base - h;
    const n = 0.42 * k;
    return `<g>
      <path d="M${x - w},${base} L${x},${py} L${x + w},${base} Z" fill="#46559f"/>
      <path d="M${x},${py} L${x - w},${base} L${x - w * 0.45},${base} Z" fill="#5b6dc2"/>
      <path d="M${x},${py} L${x + w},${base} L${x + w * 0.2},${base} L${x + w * 0.12},${base - h * 0.45} Z" fill="#2c376e"/>
      <path d="M${x - w},${base} L${x},${py}" stroke="#a9b8ff" stroke-width="1.8" opacity="0.7"/>
      ${nieve ? `<path d="M${x - w * n},${py + h * n} L${x},${py} L${x + w * n},${py + h * n} L${x + w * n * 0.55},${py + h * n * 0.8} L${x + w * n * 0.2},${py + h * n * 1.05} L${x - w * n * 0.2},${py + h * n * 0.78} L${x - w * n * 0.6},${py + h * n * 0.95} Z" fill="#f4f6ff"/>
        <path d="M${x},${py} L${x + w * n},${py + h * n} L${x + w * n * 0.55},${py + h * n * 0.8} L${x + w * n * 0.2},${py + h * n * 1.05} L${x + w * 0.05},${py + h * n * 0.6} Z" fill="#c3cbff"/>` : ''}</g>`;
  };

  const pino = (x, y, h) => `<g>${sombra(x + 3, y + 1, h * 0.32)}
    <rect x="${x - 1.8}" y="${y - h * 0.22}" width="3.6" height="${h * 0.24}" fill="#553a2f"/>
    <path d="M${x - h * 0.3},${y - h * 0.18} L${x},${y - h * 0.72} L${x + h * 0.3},${y - h * 0.18} Z" fill="#1fae6c"/>
    <path d="M${x},${y - h * 0.72} L${x + h * 0.3},${y - h * 0.18} L${x},${y - h * 0.18} Z" fill="#158553"/>
    <path d="M${x - h * 0.22},${y - h * 0.5} L${x},${y - h} L${x + h * 0.22},${y - h * 0.5} Z" fill="#27c07a"/>
    <path d="M${x},${y - h} L${x + h * 0.22},${y - h * 0.5} L${x},${y - h * 0.5} Z" fill="#1a9a61"/></g>`;
  // Sombreado en dos tonos (característico del estilo): las formas se pintan con el color claro
  // y la parte en sombra se recorta con la misma silueta.
  let idArte = 0;
  const dosTonos = (formas, claro, oscuro, corte) => {
    const id = 'cc-dt-' + (idArte++);
    const zona = corte.x !== undefined
      ? `<rect x="${corte.x}" y="-2000" width="4000" height="4000" fill="${oscuro}"/>`
      : `<rect x="-2000" y="${corte.y}" width="4000" height="4000" fill="${oscuro}"/>`;
    return `${formas.replace(/FILL/g, claro)}<clipPath id="${id}">${formas.replace(/FILL/g, '#000')}</clipPath><g clip-path="url(#${id})">${zona}${corte.extra || ''}</g>`;
  };
  // Ojo típico: blanco grande, pupila mirando hacia adelante y un brillito.
  const ojo = (x, y, r, dir = -1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + dir * r * 0.3}" cy="${y + r * 0.1}" r="${r * 0.55}" fill="#15163d"/><circle cx="${x + dir * r * 0.45}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/>`;

  const arbusto = (x, y, r) => `<g>${sombra(x + 2, y + 1, r * 1.3)}
    ${dosTonos(`<circle cx="${x - r * 0.6}" cy="${y - r * 0.5}" r="${r * 0.7}" fill="FILL"/><circle cx="${x + r * 0.5}" cy="${y - r * 0.55}" r="${r * 0.75}" fill="FILL"/><circle cx="${x}" cy="${y - r}" r="${r * 0.85}" fill="FILL"/>`, '#2fd186', '#1a9a61', { x: x + r * 0.1 })}
    <circle cx="${x - r * 0.3}" cy="${y - r * 1.3}" r="${r * 0.22}" fill="#9df5c8" opacity="0.7"/></g>`;

  const arbol = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0,0 C-2,18 -12,32 -22,48 M0,0 C4,22 18,36 32,46 M0,0 L0,44 M-10,26 L-26,30 M12,24 L26,22" stroke="#e0b08a" stroke-opacity="0.75" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    ${sombra(8, 1, 36)}
    ${dosTonos('<path d="M-8,2 C-6,-20 -5,-40 -5,-62 L5,-62 C5,-40 6,-20 8,2 Z" fill="FILL"/>', '#7a543f', '#5a3c30', { x: 1 })}
    ${dosTonos('<rect x="-44" y="-128" width="88" height="92" rx="44" fill="FILL"/><circle cx="-30" cy="-58" r="22" fill="FILL"/><circle cx="30" cy="-60" r="24" fill="FILL"/>', '#2fd186', '#1a9a61', { x: 4 })}
    <path d="M-30,-104 a34,34 0 0 1 22,-18" stroke="#9df5c8" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.6"/>
    <circle cx="-26" cy="-86" r="4" fill="#9df5c8" opacity="0.6"/></g>`;

  const pajaro = (x, y, s = 1, retraso = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="cc-pajaro" style="animation-delay:${retraso}s">
    ${dosTonos('<ellipse cx="0" cy="0" rx="11" ry="9" fill="FILL"/>', '#5c7cfa', '#4263eb', { y: 2 })}
    <ellipse cx="-2" cy="3" rx="6" ry="4.5" fill="#e7ecff"/>
    <path d="M-10,-1 L-17,1 L-10,3 Z" fill="#ffb347"/>
    ${ojo(-5, -3, 3)}
    <g class="cc-ala"><ellipse cx="4" cy="-4" rx="7" ry="4" fill="#3b5bdb" transform="rotate(-25 4 -4)"/></g>
    <path d="M10,-1 L16,-4 L15,2 Z" fill="#3b5bdb"/></g></g>`;

  // Vaca mirando hacia la izquierda (hacia el árbol).
  const vaca = (x, y) => {
    const cuerpo = '<rect x="-38" y="-26" width="80" height="40" rx="20" fill="FILL"/>';
    return `<g transform="translate(${x} ${y})">
      ${sombra(2, 30, 46)}
      <path d="M40,-10 C50,-6 50,6 46,14" stroke="#3b3d5c" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="46" cy="15" r="3.5" fill="#3b3d5c"/>
      ${[-26, -12, 16, 30].map(lx => `<rect x="${lx - 4}" y="6" width="9" height="24" rx="4.5" fill="#3b3d5c"/><rect x="${lx - 4}" y="24" width="9" height="6" rx="3" fill="#1f2037"/>`).join('')}
      ${dosTonos(cuerpo, '#f4f1ff', '#d4d0f5', { y: -4, extra: '<path d="M-10,-26 C-4,-14 10,-16 14,-26 Z M20,-4 C28,-14 42,-8 40,6 C32,10 22,6 20,-4 Z M-30,0 C-24,-8 -14,-4 -16,6 C-22,10 -30,8 -30,0 Z" fill="#2b2d42"/>' })}
      <ellipse cx="18" cy="14" rx="9" ry="5" fill="#ff9fb5"/>
      <g transform="translate(-44 -14)">
        <path d="M-6,-16 C-10,-26 -4,-30 -2,-22 M8,-16 C12,-26 6,-30 4,-22" stroke="#ffe8a3" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="-16" cy="-10" rx="9" ry="5" fill="#f4f1ff" transform="rotate(-20 -16 -10)"/><ellipse cx="-16" cy="-10" rx="5" ry="2.5" fill="#ff9fb5" transform="rotate(-20 -16 -10)"/>
        ${dosTonos('<rect x="-14" y="-18" width="30" height="32" rx="14" fill="FILL"/>', '#f4f1ff', '#d4d0f5', { x: 4 })}
        <rect x="-19" y="0" width="28" height="18" rx="9" fill="#ff9fb5"/><rect x="-19" y="10" width="28" height="8" rx="4" fill="#f07f9c"/>
        <ellipse cx="-12" cy="8" rx="2" ry="2.6" fill="#8a3b52"/><ellipse cx="-3" cy="8" rx="2" ry="2.6" fill="#8a3b52"/>
        ${ojo(-4, -7, 4.6)}</g></g>`;
  };

  // Conejo mirando hacia la izquierda.
  const conejo = (x, y) => `<g transform="translate(${x} ${y})">
    ${sombra(4, 20, 38)}
    <circle cx="32" cy="2" r="9" fill="#fff"/>
    ${dosTonos('<path d="M-14,18 C-34,18 -30,-16 -6,-18 C22,-20 34,-4 30,10 C28,18 20,20 10,20 Z" fill="FILL"/>', '#ece9ff', '#c9c4f3', { y: 4 })}
    <ellipse cx="4" cy="18" rx="10" ry="4" fill="#c9c4f3"/>
    <g transform="translate(-26 -14)">
      <g transform="rotate(-12)">${dosTonos('<rect x="-4" y="-44" width="10" height="40" rx="5" fill="FILL"/>', '#ece9ff', '#c9c4f3', { x: 2 })}<rect x="-1" y="-38" width="4" height="28" rx="2" fill="#ff9fb5"/></g>
      <g transform="rotate(8)">${dosTonos('<rect x="4" y="-46" width="10" height="42" rx="5" fill="FILL"/>', '#ece9ff', '#c9c4f3', { x: 10 })}<rect x="7" y="-40" width="4" height="30" rx="2" fill="#ff9fb5"/></g>
      ${dosTonos('<circle cx="0" cy="0" r="15" fill="FILL"/>', '#ece9ff', '#c9c4f3', { x: 6 })}
      <circle cx="-13" cy="3" r="2.6" fill="#ff7a9c"/>
      <circle cx="-8" cy="7" r="3" fill="#ffb3c7" opacity="0.7"/>
      ${ojo(-5, -3, 4.4)}</g></g>`;

  // Hongos y hojas caídas.
  const hongos = (x, y) => `<g transform="translate(${x} ${y})">
    ${[[-26, 4, 20], [-8, 8, -30], [14, 4, 40], [30, 8, -10]].map(([hx, hy, a]) => `<ellipse cx="${hx}" cy="${hy}" rx="9" ry="4" transform="rotate(${a} ${hx} ${hy})" fill="#ff9f43"/><ellipse cx="${hx + 2}" cy="${hy + 1}" rx="6" ry="2" transform="rotate(${a} ${hx} ${hy})" fill="#e8762a"/>`).join('')}
    ${[[-2, 0, 1], [18, 4, 0.7]].map(([hx, hy, e]) => `<g transform="translate(${hx} ${hy}) scale(${e})">
      ${dosTonos('<rect x="-4" y="-14" width="9" height="16" rx="4" fill="FILL"/>', '#fff1dc', '#e6d3b8', { x: 1 })}
      ${dosTonos('<path d="M-13,-12 C-13,-28 13,-28 13,-12 Z" fill="FILL"/>', '#ff5d5d', '#d94848', { x: 3 })}
      <circle cx="-6" cy="-19" r="2" fill="#fff"/><circle cx="2" cy="-23" r="1.6" fill="#fff"/><circle cx="7" cy="-16" r="1.5" fill="#fff" opacity="0.8"/></g>`).join('')}</g>`;

  // Fábrica con chimenea a rayas.
  const fabrica = (x, yb) => `<g>
    ${sombra(x + 54, yb + 1, 60)}
    ${dosTonos(`<rect x="${x}" y="${yb - 52}" width="100" height="54" rx="6" fill="FILL"/>`, '#6272e6', '#4c59c4', { x: x + 70 })}
    <path d="M${x},${yb - 50} L${x + 20},${yb - 70} L${x + 20},${yb - 50} L${x + 40},${yb - 70} L${x + 40},${yb - 50} L${x + 60},${yb - 70} L${x + 60},${yb - 50} Z" fill="#7f8cff" stroke="#7f8cff" stroke-width="4" stroke-linejoin="round"/>
    ${[0, 1, 2].map(i => `<rect x="${x + 10 + i * 22}" y="${yb - 38}" width="12" height="12" rx="3" fill="#ffe8a3"/>`).join('')}
    <rect x="${x + 76}" y="${yb - 24}" width="14" height="26" rx="3" fill="#2b2d42"/>
    <g>${[0, 1, 2, 3].map(i => `<rect x="${x + 68}" y="${yb - 116 + i * 16}" width="20" height="16" fill="${i % 2 ? '#fff' : '#ff6b6b'}"/>`).join('')}
      <rect x="${x + 82}" y="${yb - 116}" width="6" height="64" fill="#000" opacity="0.15"/>
      <rect x="${x + 65}" y="${yb - 122}" width="26" height="8" rx="4" fill="#ff6b6b"/></g></g>`;

  // Legumbre con nódulos en las raíces y vainas.
  const legumbre = (x, y) => `<g transform="translate(${x} ${y})">
    ${sombra(4, 1, 26)}
    <path d="M0,0 C-2,20 -14,34 -24,50 M0,0 C4,22 16,36 30,48 M0,0 L0,52" stroke="#e0b08a" stroke-opacity="0.8" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${[[-14, 28], [-22, 44], [10, 30], [22, 42], [0, 40], [-6, 18]].map(([nx, ny]) => `<circle cx="${nx}" cy="${ny}" r="5.5" fill="#ff8fb1"/><circle cx="${nx - 1.5}" cy="${ny - 1.5}" r="1.6" fill="#fff" opacity="0.7"/>`).join('')}
    <path d="M0,0 C-2,-30 2,-60 0,-96" stroke="#1fae6c" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${[[-18, -30, -28], [18, -46, 28], [-16, -66, -24], [15, -82, 20], [0, -98, 0]].map(([lx, ly, a]) => `<g transform="rotate(${a} ${lx} ${ly})">${dosTonos(`<ellipse cx="${lx}" cy="${ly}" rx="${lx ? 16 : 10}" ry="${lx ? 9 : 12}" fill="FILL"/>`, '#2fd186', '#1a9a61', { y: ly + 1 })}</g>`).join('')}
    <path d="M8,-56 C20,-50 24,-38 18,-28" stroke="#b6f36b" stroke-width="8" fill="none" stroke-linecap="round"/>
    ${[-50, -42, -34].map(py => `<circle cx="${14 + (py + 50) * 0.2}" cy="${py + 4}" r="2.4" fill="#8fd14f"/>`).join('')}</g>`;

  // Suelo en corte: tierra con estratos ondulados y piedritas.
  const suelo = (d, x0, x1, y0, y1) => {
    let lineas = '', piedras = '';
    for (let y = y0 + 14, i = 0; y < y1; y += 16, i++) {
      let p = `M${x0},${y}`;
      for (let x = x0; x < x1; x += 40) p += ` q20,${i % 2 ? -4 : 4} 40,0`;
      lineas += `<path d="${p}" stroke="#000" stroke-opacity="0.13" stroke-width="2" fill="none"/>`;
    }
    for (let i = 0; i < 22; i++) {
      const x = x0 + ((i * 97) % (x1 - x0)), y = y0 + 10 + ((i * 53) % Math.max(10, y1 - y0 - 14));
      piedras += `<ellipse cx="${x}" cy="${y}" rx="${3 + (i % 3)}" ry="${2 + (i % 2)}" fill="${i % 2 ? '#a8786a' : '#6e4a55'}" opacity="0.8"/>`;
    }
    return `<path d="${d}" fill="url(#cc-suelo)"/><clipPath id="cc-clip-${x0}-${y0}"><path d="${d}"/></clipPath>
      <g clip-path="url(#cc-clip-${x0}-${y0})">${lineas}${piedras}<path d="${d}" fill="url(#cc-granos)"/></g>`;
  };
  // Borde de pasto con pequeñas lomas.
  const pasto = (pts) => {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
    let lomas = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1];
      for (let t = 0; t < 1; t += 18 / Math.max(18, xb - xa)) {
        const x = xa + (xb - xa) * t, y = ya + (yb - ya) * t;
        lomas += `<circle cx="${x.toFixed(1)}" cy="${(y + 2).toFixed(1)}" r="6" fill="#2fd186"/>`;
      }
    }
    return `${lomas}<path d="${d}" stroke="#34d27f" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#8af0bd" stroke-opacity="0.45" stroke-width="2" fill="none" transform="translate(0 -3)"/>`;
  };
  const mar = (x, y, w, h) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#cc-mar)"/>
    ${[0, 1, 2, 3].map(i => `<path d="M${x + 10 + (i % 2) * 30},${y + 22 + i * 24} q12,-5 24,0 t24,0" stroke="#9ec5ff" stroke-opacity="0.35" stroke-width="2" fill="none"/>`).join('')}
    <ellipse cx="${x + w * 0.45}" cy="${y + 8}" rx="${w * 0.3}" ry="5" fill="#fff" opacity="0.18"/>
    <path class="cc-olas" d="M${x - 40},${y + 4} ${'q10,-7 20,0 t20,0 '.repeat(Math.ceil((w + 80) / 40))}" fill="none" stroke="#dbe9ff" stroke-opacity="0.75" stroke-width="2.5"/>`;
  const edificio = (x, yb, w, h, c) => {
    let v = '';
    for (let yy = yb - h + 5; yy < yb - 5; yy += 8) for (let xx = x + 4; xx < x + w - 5; xx += 7) {
      if ((xx * 7 + yy * 3) % 5 > 1) v += `<rect x="${xx}" y="${yy}" width="3" height="4" fill="#ffe8a3" opacity="0.9"/>`;
    }
    return `<rect x="${x}" y="${yb - h}" width="${w}" height="${h}" rx="2" fill="${c}"/><rect x="${x + w - 6}" y="${yb - h}" width="6" height="${h}" fill="#000" opacity="0.15"/>${v}`;
  };

  const ESCENAS = {
    agua: `
      ${cielo(80, 70)}
      ${lejanas('M300,300 C360,262 420,270 470,250 C520,232 560,250 600,240 L620,300 Z', 'M330,300 C380,280 430,286 480,272 C520,262 550,275 580,270 L600,300 Z')}
      ${montania(795, 300, 70, 120, true)}
      ${montania(700, 305, 140, 183, true)}
      ${montania(612, 305, 55, 78, false)}
      ${nube(640, 55, 0.6, 'lenta')}
      ${mar(0, 330, 270, 130)}
      ${suelo('M230,336 C262,318 300,300 350,298 L800,296 L800,460 L230,460 Z', 230, 800, 300, 380)}
      <path d="M240,382 C400,372 600,380 800,372 L800,432 C600,440 400,436 240,442 Z" fill="url(#cc-acuifero)"/>
      <path d="M240,382 C400,372 600,380 800,372 L800,432 C600,440 400,436 240,442 Z" fill="url(#cc-poros)"/>
      <path d="M240,382 C400,372 600,380 800,372" stroke="#9ec5ff" stroke-opacity="0.5" stroke-width="2" fill="none"/>
      <path d="M232,442 C400,436 600,440 800,432 L800,460 L232,460 Z" fill="url(#cc-roca)"/>
      <path d="M232,340 C262,322 300,304 350,302" stroke="#e7f5ff" stroke-opacity="0.7" stroke-width="3" fill="none"/>
      ${pasto([[232, 340], [262, 322], [300, 305], [350, 299], [800, 297]])}
      <path d="M650,302 C600,310 560,300 520,312 S420,320 380,318 S300,330 246,337" fill="none" stroke="#2a4cb8" stroke-width="14" stroke-linecap="round"/>
      <path d="M650,302 C600,310 560,300 520,312 S420,320 380,318 S300,330 246,337" fill="none" stroke="#4c8dff" stroke-width="9" stroke-linecap="round"/>
      <path class="cc-corriente" d="M650,302 C600,310 560,300 520,312 S420,320 380,318 S300,330 246,337" fill="none" stroke="#e7f5ff" stroke-width="2" stroke-dasharray="6 16" stroke-linecap="round"/>
      ${[[590, 300, 24], [606, 298, 30], [624, 299, 22], [760, 297, 26], [778, 296, 20]].map(([x, y, h]) => pino(x, y, h)).join('')}
      ${arbusto(440, 314, 9)}${arbusto(470, 312, 7)}${arbusto(292, 318, 8)}
      ${arbol(352, 300)}
      <g class="cc-vaho" opacity="0.85">${[[165, 230], [195, 215], [220, 232]].map(([x, y]) => `<path d="M${x},${y} q6,-6 0,-12 t0,-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>
      ${nube(440, 88, 1)}
      ${pajaro(565, 150, 0.9)}${pajaro(598, 168, 0.7, 0.4)}
      ${vineta}`,
    carbono: `
      ${cielo(730, 62)}
      ${lejanas('M180,330 C260,290 330,300 400,286 C470,272 540,292 620,280 L660,330 Z', 'M220,330 C300,306 360,312 430,302 C500,294 560,306 610,300 L640,330 Z')}
      ${mar(0, 340, 200, 120)}
      ${suelo('M170,348 C200,332 240,326 280,326 L800,326 L800,460 L170,460 Z', 170, 800, 330, 388)}
      <path d="M180,388 C400,382 600,390 800,384 L800,460 L180,460 Z" fill="url(#cc-roca)"/>
      <path d="M180,388 C400,382 600,390 800,384" stroke="#6d73c9" stroke-opacity="0.45" stroke-width="2" fill="none"/>
      <path d="M560,420 C570,400 640,394 700,402 C752,408 772,426 742,441 C690,453 600,452 570,441 Z" fill="#0b0c1f"/>
      <path d="M598,410 C630,402 670,402 700,408" fill="none" stroke="#5a60b8" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <path d="M172,352 C200,336 240,330 280,330" stroke="#e7f5ff" stroke-opacity="0.7" stroke-width="3" fill="none"/>
      ${pasto([[172, 352], [200, 336], [240, 329], [280, 327], [800, 327]])}
      <line x1="690" y1="402" x2="690" y2="330" stroke="#5a60b8" stroke-width="6"/>
      ${sombra(705, 330, 60)}
      ${fabrica(652, 328)}
      <g class="cc-humo">${[0, 1, 2, 3].map(i => `<circle cx="730" cy="200" r="${9 + i * 2}" fill="#b8bff5" style="animation-delay:${i * 0.8}s"/>`).join('')}</g>
      ${[[560, 327, 24], [580, 326, 30], [600, 327, 22]].map(([x, y, h]) => pino(x, y, h)).join('')}
      ${arbusto(300, 336, 8)}${arbusto(520, 334, 9)}
      ${arbol(240, 330, 1.05)}
      ${vaca(440, 300)}
      ${hongos(330, 352)}
      ${pajaro(150, 200, 0.85)}${pajaro(118, 218, 0.65, 0.5)}
      <g class="cc-deco" opacity="0.7">${[[330, 45], [505, 60], [560, 120], [290, 125]].map(([x, y]) => figura('co2', x, y, 1)).join('')}</g>
      ${vineta}`,
    nitrogeno: `
      ${cielo(-200, -200, false)}
      ${lejanas('M0,300 C80,262 160,272 240,258 C330,244 400,266 480,256 C560,246 640,262 800,250 L800,300 Z', 'M0,302 C100,284 180,288 260,280 C360,270 460,286 560,278 C660,272 740,284 800,280 L800,302 Z')}
      ${nube(662, 64, 1.05, '', true)}
      <path class="cc-rayo" d="M654,86 L638,130 L656,130 L640,178 L680,120 L662,120 L676,86 Z" fill="#ffd166" stroke="#fff3c4" stroke-width="1.5"/>
      ${nube(240, 70, 0.6, 'lenta')}
      ${pajaro(170, 150, 0.85)}${pajaro(205, 168, 0.65, 0.5)}
      ${suelo('M0,304 C200,294 500,300 800,294 L800,460 L0,460 Z', 0, 800, 298, 460)}
      ${pasto([[0, 306], [200, 297], [500, 300], [800, 296]])}
      <g opacity="0.95">${[[250, 390], [280, 410], [335, 395], [360, 418], [300, 425]].map(([x, y]) => figura('nh4', x, y, 0.7)).join('')}
        ${[[545, 392], [585, 420], [640, 395], [660, 425], [610, 410]].map(([x, y]) => figura('no3', x, y, 0.7)).join('')}</g>
      ${[[700, 297, 24], [720, 296, 30], [742, 296, 22], [40, 305, 26], [60, 304, 20]].map(([x, y, h]) => pino(x, y, h)).join('')}
      ${arbusto(430, 300, 8)}${arbusto(470, 300, 6)}
      ${legumbre(300, 300)}
      ${conejo(566, 274)}
      <g transform="translate(130 312)">
        ${[[-30, 4, 20], [-12, 8, -30], [10, 2, 40], [26, 8, -10], [0, -2, 70]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" transform="rotate(${a} ${x} ${y})" fill="#ff9f43"/>`).join('')}
        <ellipse cx="40" cy="6" rx="8" ry="5" fill="#6b4a3a"/></g>
      ${vineta}`,
  };

  // ---------- Datos de cada ciclo ----------
  // nodos: x,y = zona que se puede tocar; etq = posición del rótulo; forma = cómo se ve el viajero ahí.
  // procesos: ruta = camino dibujado sobre el paisaje; estilo = partícula que lo recorre.
  const CICLOS = {
    agua: {
      nombre: 'Ciclo del agua', icono: '💧', viajeroNombre: 'una gota de agua', inicio: 'oceano',
      nodos: {
        oceano: { nombre: 'Océano', x: 120, y: 395, etq: [120, 440], forma: 'gota', desc: 'Guarda el 97 % del agua del planeta. Es salada.' },
        vapor: { nombre: 'Vapor de agua', x: 192, y: 215, etq: [192, 252], forma: 'vapor', desc: 'El agua en estado gaseoso: es invisible y forma parte del aire.' },
        nube: { nombre: 'Nubes', x: 440, y: 92, etq: [440, 140], forma: 'gota', desc: 'Millones de gotitas de agua o cristales de hielo suspendidos en el aire.' },
        glaciar: { nombre: 'Glaciar', x: 700, y: 165, etq: [700, 212], forma: 'copo', desc: 'Agua dulce congelada. Guarda agua durante años o siglos.' },
        rio: { nombre: 'Río', x: 560, y: 306, etq: [600, 336], forma: 'gota', desc: 'Agua dulce que corre por la superficie hacia el mar.' },
        planta: { nombre: 'Plantas', x: 352, y: 215, etq: [285, 262], forma: 'gota', desc: 'Absorben agua por las raíces y la liberan por las hojas.' },
        subterranea: { nombre: 'Agua subterránea', x: 520, y: 405, etq: [520, 407], forma: 'gota', desc: 'Agua que se filtró y llena los poros de las rocas bajo tierra (acuíferos).' },
      },
      procesos: [
        { de: 'oceano', a: 'vapor', nombre: 'Evaporación', estilo: 'vapor', ruta: 'M110,330 C112,290 150,255 180,228', desc: 'El Sol calienta el agua del mar y la transforma en vapor.' },
        { de: 'vapor', a: 'nube', nombre: 'Condensación', estilo: 'vapor', ruta: 'M205,196 C260,140 330,105 390,96', desc: 'El vapor sube, se enfría y se convierte en gotitas que forman las nubes.' },
        { de: 'nube', a: 'oceano', nombre: 'Precipitación (lluvia sobre el mar)', estilo: 'gota', t: 0.85, ruta: 'M405,118 C340,170 260,240 200,325', desc: 'Las gotitas se juntan, pesan más y caen como lluvia.' },
        { de: 'nube', a: 'rio', nombre: 'Precipitación (lluvia)', estilo: 'gota', t: 0.35, ruta: 'M470,118 C495,190 525,250 548,298', desc: 'La lluvia cae sobre la tierra y llena ríos y lagos.' },
        { de: 'nube', a: 'glaciar', nombre: 'Precipitación (nieve)', estilo: 'copo', ruta: 'M492,84 C570,70 640,100 680,140', desc: 'En lugares fríos o altos el agua cae como nieve y forma glaciares.' },
        { de: 'glaciar', a: 'rio', nombre: 'Fusión (deshielo)', estilo: 'gota', ruta: 'M700,195 C690,240 665,285 640,300 C615,305 595,303 575,304', desc: 'Cuando hace más calor, el hielo se derrite y alimenta a los ríos.' },
        { de: 'glaciar', a: 'vapor', nombre: 'Sublimación', estilo: 'vapor', ruta: 'M672,140 C560,30 320,90 212,192', desc: 'Con viento y sol, el hielo pasa directamente a vapor, sin derretirse.' },
        { de: 'rio', a: 'oceano', nombre: 'Escorrentía', estilo: 'gota', ruta: 'M548,306 C500,315 450,318 400,318 C340,320 290,330 240,337', desc: 'El agua corre por la superficie, en ríos y arroyos, hasta el mar.' },
        { de: 'rio', a: 'subterranea', nombre: 'Infiltración', estilo: 'gota', ruta: 'M530,312 C532,340 528,365 522,390', desc: 'Parte del agua se filtra por el suelo y llega a las capas subterráneas.' },
        { de: 'rio', a: 'vapor', nombre: 'Evaporación', estilo: 'vapor', t: 0.12, ruta: 'M585,298 C540,230 380,160 218,208', desc: 'El agua de ríos y lagos también se evapora con el calor del Sol.' },
        { de: 'subterranea', a: 'planta', nombre: 'Absorción por las raíces', estilo: 'gota', ruta: 'M500,398 C440,392 380,375 362,345 C355,325 352,290 352,258', desc: 'Las raíces de las plantas toman el agua del suelo y la llevan hacia las hojas.' },
        { de: 'subterranea', a: 'oceano', nombre: 'Flujo subterráneo', estilo: 'gota', ruta: 'M505,422 C420,430 320,432 240,420 C200,412 170,404 145,398', desc: 'El agua subterránea se mueve lentamente hasta desembocar en el mar.' },
        { de: 'planta', a: 'vapor', nombre: 'Transpiración', estilo: 'vapor', t: 0.3, ruta: 'M322,212 C290,196 252,196 222,208', desc: 'Las plantas liberan vapor de agua por pequeños poros de las hojas.' },
      ],
      orden: [
        { nombre: 'Evaporación', desc: 'El Sol calienta el agua de mares y ríos y se vuelve vapor.' },
        { nombre: 'Condensación', desc: 'El vapor se enfría en la altura y forma nubes.' },
        { nombre: 'Precipitación', desc: 'El agua cae como lluvia, nieve o granizo.' },
        { nombre: 'Escorrentía e infiltración', desc: 'El agua corre por ríos o se filtra en el suelo.' },
        { nombre: 'Acumulación', desc: 'El agua se junta en océanos, lagos y acuíferos… y todo vuelve a empezar.' },
      ],
    },
    carbono: {
      nombre: 'Ciclo del carbono', icono: '🌿', viajeroNombre: 'un átomo de carbono', inicio: 'aire',
      nodos: {
        aire: { nombre: 'CO₂ en el aire', x: 420, y: 70, etq: [420, 108], forma: 'co2', desc: 'El carbono está en la atmósfera formando dióxido de carbono (CO₂).' },
        plantas: { nombre: 'Plantas', x: 240, y: 240, etq: [168, 262], forma: 'c', desc: 'Guardan el carbono en su cuerpo: en la glucosa, la madera y las hojas.' },
        animales: { nombre: 'Animales', x: 440, y: 298, etq: [440, 352], forma: 'c', desc: 'Obtienen el carbono al comer plantas u otros animales.' },
        suelo: { nombre: 'Restos y descomponedores', x: 330, y: 352, etq: [330, 400], forma: 'c', desc: 'Hojas caídas, restos y desechos que hongos y bacterias descomponen.' },
        fosiles: { nombre: 'Combustibles fósiles', x: 660, y: 422, etq: [660, 424], forma: 'c', desc: 'Petróleo, carbón y gas: restos de seres vivos enterrados hace millones de años.' },
        oceano: { nombre: 'Océano', x: 95, y: 395, etq: [95, 440], forma: 'co2', desc: 'El mar disuelve mucho CO₂. Es uno de los grandes depósitos de carbono.' },
      },
      procesos: [
        { de: 'aire', a: 'plantas', nombre: 'Fotosíntesis', estilo: 'co2', t: 0.78, ruta: 'M388,82 C330,120 285,165 262,205', desc: 'Las plantas toman CO₂ del aire y, con la luz del Sol, fabrican glucosa.' },
        { de: 'plantas', a: 'aire', nombre: 'Respiración de las plantas', estilo: 'co2', t: 0.3, ruta: 'M222,205 C228,140 300,92 380,72', desc: 'Las plantas también respiran y devuelven algo de CO₂ al aire.' },
        { de: 'plantas', a: 'animales', nombre: 'Alimentación', estilo: 'c', ruta: 'M275,262 C320,270 360,282 395,290', desc: 'Los animales comen plantas y el carbono pasa a formar parte de su cuerpo.' },
        { de: 'animales', a: 'aire', nombre: 'Respiración de los animales', estilo: 'co2', ruta: 'M452,276 C462,200 455,130 432,92', desc: 'Al respirar, los animales liberan CO₂.' },
        { de: 'plantas', a: 'suelo', nombre: 'Muerte y caída de hojas', estilo: 'c', t: 0.25, ruta: 'M248,300 C262,325 290,342 314,348', desc: 'Las hojas y las plantas muertas quedan en el suelo.' },
        { de: 'animales', a: 'suelo', nombre: 'Muerte y desechos', estilo: 'c', t: 0.2, ruta: 'M425,320 C400,338 372,350 350,352', desc: 'Los restos y excrementos de los animales llegan al suelo.' },
        { de: 'suelo', a: 'aire', nombre: 'Descomposición', estilo: 'co2', ruta: 'M338,340 C352,260 382,160 408,92', desc: 'Hongos y bacterias descomponen los restos y liberan CO₂.' },
        { de: 'suelo', a: 'fosiles', nombre: 'Fosilización', estilo: 'c', ruta: 'M345,370 C420,398 520,415 600,420', desc: 'Algunos restos quedan enterrados y, durante millones de años, se transforman en petróleo o carbón.' },
        { de: 'fosiles', a: 'aire', nombre: 'Combustión', estilo: 'co2', ruta: 'M690,402 L690,330 L729,300 L729,212 C700,150 560,95 462,75', desc: 'Al quemar combustibles fósiles (autos, fábricas) se libera CO₂ muy rápido.' },
        { de: 'aire', a: 'oceano', nombre: 'Disolución', estilo: 'co2', t: 0.86, ruta: 'M385,78 C260,110 150,240 118,340', desc: 'El CO₂ del aire se disuelve en el agua del mar.' },
        { de: 'oceano', a: 'aire', nombre: 'Liberación del océano', estilo: 'co2', t: 0.3, ruta: 'M72,342 C80,220 240,100 380,66', desc: 'Cuando el agua se calienta, parte del CO₂ disuelto vuelve al aire.' },
      ],
      orden: [
        { nombre: 'Fotosíntesis', desc: 'Las plantas toman CO₂ del aire.' },
        { nombre: 'Alimentación', desc: 'Los animales comen plantas y el carbono pasa a ellos.' },
        { nombre: 'Muerte y descomposición', desc: 'Los restos llegan al suelo y los descomponedores actúan.' },
        { nombre: 'Formación de combustibles fósiles', desc: 'En millones de años algunos restos se vuelven petróleo o carbón.' },
        { nombre: 'Combustión', desc: 'Al quemarlos, el CO₂ vuelve al aire.' },
      ],
    },
    nitrogeno: {
      nombre: 'Ciclo del nitrógeno', icono: '🫘', viajeroNombre: 'un átomo de nitrógeno', inicio: 'aire',
      nodos: {
        aire: { nombre: 'N₂ en el aire', x: 400, y: 65, etq: [400, 102], forma: 'n2', desc: 'El 78 % del aire es nitrógeno (N₂), pero plantas y animales no pueden usarlo así.' },
        plantas: { nombre: 'Plantas (legumbres)', x: 300, y: 235, etq: [215, 250], forma: 'n', desc: 'Usan el nitrógeno para fabricar proteínas y ADN. Las legumbres tienen nódulos con bacterias en las raíces.' },
        animales: { nombre: 'Animales', x: 570, y: 262, etq: [575, 312], forma: 'n', desc: 'Obtienen el nitrógeno al comer plantas.' },
        restos: { nombre: 'Restos y desechos', x: 130, y: 312, etq: [130, 350], forma: 'n', desc: 'Restos de seres vivos, orina y excrementos.' },
        amonio: { nombre: 'Amonio en el suelo', x: 305, y: 405, etq: [305, 442], forma: 'nh4', desc: 'Nitrógeno en forma de amonio (NH₄⁺), producido por bacterias.' },
        nitratos: { nombre: 'Nitratos en el suelo', x: 600, y: 405, etq: [600, 442], forma: 'no3', desc: 'Nitrógeno en forma de nitratos (NO₃⁻): la forma que las plantas pueden absorber.' },
      },
      procesos: [
        { de: 'aire', a: 'amonio', nombre: 'Fijación por bacterias', estilo: 'n2', t: 0.22, ruta: 'M372,80 C330,150 312,240 305,300 C302,340 304,368 306,388', desc: 'Bacterias del suelo y de los nódulos de las raíces de las legumbres (porotos, soja) transforman el N₂ en amonio.' },
        { de: 'aire', a: 'nitratos', nombre: 'Fijación por rayos', estilo: 'n2', ruta: 'M620,80 L640,130 L656,130 L640,178 C640,250 625,330 606,388', desc: 'La energía de los rayos une el nitrógeno con el oxígeno; la lluvia lleva esos compuestos al suelo.' },
        { de: 'amonio', a: 'nitratos', nombre: 'Nitrificación', estilo: 'no3', ruta: 'M335,410 C420,428 500,428 572,410', desc: 'Otras bacterias del suelo transforman el amonio en nitratos.' },
        { de: 'nitratos', a: 'plantas', nombre: 'Asimilación', estilo: 'no3', ruta: 'M578,398 C480,375 380,352 326,338 C308,330 302,300 300,262', desc: 'Las raíces absorben los nitratos y la planta los usa para fabricar proteínas.' },
        { de: 'plantas', a: 'animales', nombre: 'Alimentación', estilo: 'n', ruta: 'M328,232 C420,222 500,232 536,252', desc: 'Los animales obtienen el nitrógeno comiendo plantas.' },
        { de: 'plantas', a: 'restos', nombre: 'Muerte', estilo: 'n', ruta: 'M280,250 C235,270 195,290 162,302', desc: 'Las plantas muertas quedan en el suelo.' },
        { de: 'animales', a: 'restos', nombre: 'Muerte y excreción', estilo: 'n', t: 0.3, ruta: 'M548,290 C430,306 260,310 170,316', desc: 'Los restos, la orina y los excrementos de los animales llegan al suelo.' },
        { de: 'restos', a: 'amonio', nombre: 'Amonificación', estilo: 'nh4', ruta: 'M140,332 C170,375 230,398 278,404', desc: 'Los descomponedores transforman los restos en amonio.' },
        { de: 'nitratos', a: 'aire', nombre: 'Desnitrificación', estilo: 'n2', ruta: 'M625,398 C770,330 760,150 440,62', desc: 'Algunas bacterias transforman los nitratos en N₂, que vuelve al aire.' },
      ],
      orden: [
        { nombre: 'Fijación', desc: 'Bacterias transforman el N₂ del aire en amonio.' },
        { nombre: 'Nitrificación', desc: 'El amonio se transforma en nitratos.' },
        { nombre: 'Asimilación', desc: 'Las plantas absorben los nitratos.' },
        { nombre: 'Amonificación', desc: 'Los descomponedores devuelven los restos al suelo como amonio.' },
        { nombre: 'Desnitrificación', desc: 'Bacterias devuelven el nitrógeno al aire como N₂.' },
      ],
    },
  };

  const VELOCIDAD = 55; // px por segundo de las partículas

  let raiz, svg, ciclo = 'agua', modo = 'explorar', verRotulos = false;
  let particulas = [], rutas = [], ultimo = 0, procSel = null;
  let seguir = null; // { nodo, pasos, moviendo, errores }
  let ordenar = null; // { elegidos, mezcla, revisado }

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>♻️ Ciclos de la naturaleza</h1>
        <p>La materia no se pierde: el agua, el carbono y el nitrógeno se mueven una y otra vez entre el aire, el agua, el suelo y los seres vivos.</p>
      </div>
      <div class="cic-controles">
        <div class="segmentado" id="cic-ciclos">
          ${Object.entries(CICLOS).map(([k, c]) => `<button data-c="${k}">${c.icono} ${c.nombre.replace('Ciclo del ', '').replace(/^./, m => m.toUpperCase())}</button>`).join('')}
        </div>
        <div class="segmentado" id="cic-modos">
          <button data-m="explorar">👀 Explorar</button>
          <button data-m="seguir">🧭 Seguir el viaje</button>
          <button data-m="ordenar">🔢 Ordenar etapas</button>
        </div>
      </div>
      <div class="cic-grid">
        <div class="panel cic-visor">
          <svg id="cic-svg" viewBox="0 0 800 460" role="img"></svg>
          <div class="cic-pie">
            <div class="cic-leyenda" id="cic-leyenda"></div>
            <label class="cic-toggle"><input type="checkbox" id="cic-rotulos"> Mostrar flechas y nombres de los procesos</label>
          </div>
        </div>
        <aside class="panel cic-panel" id="cic-panel"></aside>
      </div>`;
    svg = raiz.querySelector('#cic-svg');
    raiz.querySelectorAll('#cic-ciclos button').forEach(b => b.addEventListener('click', () => { ciclo = b.dataset.c; preparar(); }));
    raiz.querySelectorAll('#cic-modos button').forEach(b => b.addEventListener('click', () => { modo = b.dataset.m; preparar(); }));
    raiz.querySelector('#cic-rotulos').addEventListener('change', e => {
      verRotulos = e.target.checked;
      svg.classList.toggle('ver-rotulos', verRotulos);
    });
    svg.addEventListener('click', e => {
      if (modo !== 'explorar') return;
      const n = e.target.closest('[data-nodo]');
      const p = e.target.closest('[data-proc]');
      if (n) mostrarNodo(n.dataset.nodo);
      else if (p) mostrarProceso(+p.dataset.proc);
      else { procSel = null; marcarProceso(null); marcarNodo(null); panelExplorar(); }
    });
    preparar();
    requestAnimationFrame(bucle);
  }

  // ---------- Armado de la escena ----------

  function preparar() {
    const c = CICLOS[ciclo];
    raiz.querySelectorAll('#cic-ciclos button').forEach(b => b.classList.toggle('activo', b.dataset.c === ciclo));
    raiz.querySelectorAll('#cic-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === modo));
    raiz.querySelector('.cic-toggle').hidden = modo !== 'explorar';
    svg.setAttribute('aria-label', `Paisaje del ${c.nombre.toLowerCase()}`);
    svg.classList.toggle('ver-rotulos', verRotulos && modo === 'explorar');
    svg.classList.toggle('modo-explorar', modo === 'explorar');
    procSel = null;

    svg.innerHTML = `
      <defs>${DEFS}</defs>
      <g class="cic-escena">${ESCENAS[ciclo]}</g>
      <g id="cic-procesos">${c.procesos.map((p, i) => `
        <g class="cic-proc" data-proc="${i}">
          <path d="${p.ruta}" class="cic-guia" marker-end="url(#cc-flecha)"/>
          <path d="${p.ruta}" class="cic-toque"/>
        </g>`).join('')}</g>
      <g id="cic-particulas"></g>
      <g id="cic-nodos">${Object.entries(c.nodos).map(([k, n]) => {
        const ancho = n.nombre.length * 7.4 + 22;
        return `<g class="cic-nodo" data-nodo="${k}">
          <circle cx="${n.x}" cy="${n.y}" r="40" class="cic-zona"/>
          <g transform="translate(${n.etq[0]} ${n.etq[1]})">
            <rect x="${-ancho / 2}" y="-13" width="${ancho}" height="26" rx="13" class="cic-pastilla"/>
            <text y="5" text-anchor="middle" class="cic-pastilla-txt">${n.nombre}</text>
          </g></g>`;
      }).join('')}</g>
      <g id="cic-etiquetas"></g>
      <g id="cic-viajero"></g>`;

    // Rótulos de los procesos a mitad de cada ruta.
    rutas = [...svg.querySelectorAll('#cic-procesos .cic-guia')];
    raiz.querySelector('#cic-etiquetas').innerHTML = c.procesos.map((p, i) => {
      const largo = rutas[i].getTotalLength();
      const m = rutas[i].getPointAtLength(largo * (p.t || 0.5));
      const texto = p.nombre.replace(/ \(.*\)/, '');
      const ancho = texto.length * 6.6 + 16;
      return `<g class="cic-etq" data-etq="${i}" transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)})">
        <rect x="${-ancho / 2}" y="-11" width="${ancho}" height="22" rx="6"/><text y="4" text-anchor="middle">${texto}</text></g>`;
    }).join('');

    // Partículas de ambiente: dos por proceso, repartidas a lo largo de la ruta.
    const capa = raiz.querySelector('#cic-particulas');
    particulas = [];
    capa.innerHTML = '';
    if (modo !== 'seguir') {
      c.procesos.forEach((p, i) => {
        const largo = rutas[i].getTotalLength();
        [0].forEach(desfase => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', 'cic-part');
          g.dataset.proc = i;
          g.innerHTML = ESTILOS[p.estilo].svg;
          capa.appendChild(g);
          particulas.push({ g, proc: i, largo, t: (desfase + Math.random() * 0.2) % 1 });
        });
      });
    }

    const usados = [...new Set(c.procesos.map(p => p.estilo).concat(Object.values(c.nodos).map(n => n.forma)))];
    raiz.querySelector('#cic-leyenda').innerHTML = usados.map(e =>
      `<span><svg viewBox="-12 -12 24 24" width="22" height="22" aria-hidden="true">${ESTILOS[e].svg}</svg>${ESTILOS[e].nombre}</span>`).join('');

    marcarProceso(null);
    marcarNodo(null);
    seguir = null;
    ordenar = null;
    if (modo === 'explorar') panelExplorar();
    else if (modo === 'seguir') empezarSeguir();
    else empezarOrdenar();
  }

  function bucle(t) {
    const dt = Math.min(0.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    if (!raiz.hidden && raiz.offsetParent !== null) {
      particulas.forEach(p => {
        p.t = (p.t + VELOCIDAD * dt / p.largo) % 1;
        const pt = rutas[p.proc].getPointAtLength(p.largo * p.t);
        // Aparecen y desaparecen suavemente en los extremos de la ruta.
        const alfa = Math.min(1, p.t * 6, (1 - p.t) * 6);
        p.g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        p.g.setAttribute('opacity', alfa.toFixed(2));
      });
    }
    requestAnimationFrame(bucle);
  }

  // ---------- Explorar ----------

  function panelExplorar() {
    const c = CICLOS[ciclo];
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${c.icono} ${c.nombre}</h2>
      <p>Las partículas que se mueven por el paisaje muestran los <b>procesos</b> que llevan ${c.viajeroNombre} de un lugar a otro.</p>
      <p class="cic-ayuda">👆 Toca un lugar (los rótulos blancos) o el camino de una partícula para saber más.</p>`;
  }

  function mostrarNodo(k) {
    const c = CICLOS[ciclo], n = c.nodos[k];
    const sale = c.procesos.filter(p => p.de === k), entra = c.procesos.filter(p => p.a === k);
    procSel = null;
    marcarProceso(null);
    marcarNodo(k);
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${n.nombre}</h2>
      <p>${n.desc}</p>
      <h3>Llega por…</h3><ul>${entra.map(p => `<li><button class="cic-link" data-p="${c.procesos.indexOf(p)}">${p.nombre}</button> desde ${c.nodos[p.de].nombre.toLowerCase()}</li>`).join('')}</ul>
      <h3>Sale por…</h3><ul>${sale.map(p => `<li><button class="cic-link" data-p="${c.procesos.indexOf(p)}">${p.nombre}</button> hacia ${c.nodos[p.a].nombre.toLowerCase()}</li>`).join('')}</ul>`;
    raiz.querySelectorAll('.cic-link').forEach(b => b.addEventListener('click', () => mostrarProceso(+b.dataset.p)));
  }

  function mostrarProceso(i) {
    const c = CICLOS[ciclo], p = c.procesos[i];
    procSel = i;
    marcarNodo(null);
    marcarProceso(i);
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${p.nombre}</h2>
      <p class="cic-ruta">${c.nodos[p.de].nombre} → ${c.nodos[p.a].nombre}</p>
      <p>${p.desc}</p>
      <p class="cic-asi"><svg viewBox="-12 -12 24 24" width="28" height="28" aria-hidden="true">${ESTILOS[p.estilo].svg}</svg> Viaja como: <b>${ESTILOS[p.estilo].nombre.toLowerCase()}</b></p>`;
  }

  function marcarProceso(i) {
    svg.classList.toggle('con-sel', i !== null);
    svg.querySelectorAll('.cic-proc').forEach(g => g.classList.toggle('activo', +g.dataset.proc === i));
    svg.querySelectorAll('.cic-etq').forEach(g => g.classList.toggle('activo', +g.dataset.etq === i));
    particulas.forEach(p => p.g.classList.toggle('activa', p.proc === i));
  }

  function marcarNodo(k) {
    svg.querySelectorAll('.cic-nodo').forEach(g => g.classList.toggle('marcado', g.dataset.nodo === k));
  }

  // ---------- Seguir el viaje ----------

  function empezarSeguir() {
    const c = CICLOS[ciclo];
    seguir = { nodo: c.inicio, pasos: [], moviendo: false, errores: 0 };
    ponerViajero(c.inicio);
    marcarNodo(c.inicio);
    panelSeguir();
  }

  function ponerViajero(k) {
    const n = CICLOS[ciclo].nodos[k];
    raiz.querySelector('#cic-viajero').innerHTML = `<g class="cic-viajero reposo">${figura(n.forma, n.x, n.y, 2)}</g>`;
  }

  function panelSeguir(aviso) {
    const c = CICLOS[ciclo], n = c.nodos[seguir.nodo];
    const validas = c.procesos.map((p, i) => ({ p, i })).filter(o => o.p.de === seguir.nodo);
    // Distractores: procesos del ciclo que no pueden ocurrir desde este lugar.
    const nombresValidos = new Set(validas.map(o => o.p.nombre));
    const falsas = Util.mezclar(c.procesos.map((p, i) => ({ p, i })).filter(o => o.p.de !== seguir.nodo && !nombresValidos.has(o.p.nombre))).slice(0, 2);
    const opciones = Util.mezclar(validas.concat(falsas));
    const completo = seguir.pasos.length >= 3 && seguir.nodo === c.inicio;
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>🧭 El viaje de ${c.viajeroNombre}</h2>
      ${completo ? `<div class="cic-logro">🎉 ¡Volviste al punto de partida! Completaste un ciclo en <b>${seguir.pasos.length} pasos</b>${seguir.errores ? ` (con ${seguir.errores} intento${seguir.errores > 1 ? 's' : ''} fallido${seguir.errores > 1 ? 's' : ''})` : ''}.</div>` : ''}
      <p class="cic-ahora"><svg viewBox="-12 -12 24 24" width="30" height="30" aria-hidden="true">${ESTILOS[n.forma].svg}</svg><span>Ahora está en: <b>${n.nombre}</b><small>${ESTILOS[n.forma].nombre}</small></span></p>
      <p class="cic-pregunta">¿Qué puede pasarle ahora?</p>
      <div class="cic-opciones">${opciones.map(o => `<button class="cic-opcion" data-proc="${o.i}">${o.p.nombre} <small>→ ${c.nodos[o.p.a].nombre}</small></button>`).join('')}</div>
      <div id="cic-aviso">${aviso || ''}</div>
      ${seguir.pasos.length ? `<h3>Recorrido</h3><ol class="cic-diario">${seguir.pasos.map(i => `<li>${c.procesos[i].nombre} → ${c.nodos[c.procesos[i].a].nombre}</li>`).join('')}</ol>` : `<p class="cic-ayuda">Elige un proceso posible desde este lugar. ¡Cuidado, algunas opciones no pueden ocurrir aquí!</p>`}
      <button class="btn chico" id="cic-reiniciar-viaje">↺ Empezar de nuevo</button>`;
    raiz.querySelectorAll('.cic-opcion').forEach(b => b.addEventListener('click', () => elegirPaso(+b.dataset.proc, b)));
    raiz.querySelector('#cic-reiniciar-viaje').addEventListener('click', empezarSeguir);
  }

  function elegirPaso(i, boton) {
    if (seguir.moviendo) return;
    const c = CICLOS[ciclo], p = c.procesos[i];
    if (p.de !== seguir.nodo) {
      seguir.errores++;
      boton.classList.add('incorrecta');
      boton.disabled = true;
      raiz.querySelector('#cic-aviso').innerHTML = `<p class="cic-error">✖ No puede ser: <b>${p.nombre}</b> ocurre desde ${c.nodos[p.de].nombre.toLowerCase()}, no desde aquí. ${p.desc}</p>`;
      return;
    }
    seguir.moviendo = true;
    raiz.querySelectorAll('.cic-opcion').forEach(b => { b.disabled = true; });
    boton.classList.add('correcta');
    marcarNodo(null);
    marcarProceso(i);
    const ruta = rutas[i], largo = ruta.getTotalLength(), t0 = performance.now();
    const dur = Math.max(1400, largo / 0.22);
    const capa = raiz.querySelector('#cic-viajero');
    // El viajero cambia de forma: en el camino toma la forma del proceso (vapor, copo, CO₂…).
    const paso = t => {
      const f = Math.min(1, (t - t0) / dur);
      const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      const pt = ruta.getPointAtLength(largo * e);
      capa.innerHTML = `<g class="cic-viajero">${figura(p.estilo, pt.x, pt.y, 2)}</g>`;
      if (f < 1) return requestAnimationFrame(paso);
      marcarProceso(null);
      seguir.pasos.push(i);
      seguir.nodo = p.a;
      seguir.moviendo = false;
      ponerViajero(p.a);
      marcarNodo(p.a);
      panelSeguir(`<p class="cic-ok">✔ <b>${p.nombre}:</b> ${p.desc}</p>`);
    };
    requestAnimationFrame(paso);
  }

  // ---------- Ordenar etapas ----------

  function empezarOrdenar() {
    const c = CICLOS[ciclo];
    ordenar = { elegidos: [], mezcla: Util.mezclar(c.orden.map((_, i) => i)), revisado: false };
    panelOrdenar();
  }

  function panelOrdenar() {
    const c = CICLOS[ciclo];
    const quedan = ordenar.mezcla.filter(i => !ordenar.elegidos.includes(i));
    const lleno = ordenar.elegidos.length === c.orden.length;
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>🔢 Ordena las etapas</h2>
      <p>Toca las etapas del ${c.nombre.toLowerCase()} en el orden en que ocurren.</p>
      <ol class="cic-orden">${c.orden.map((_, pos) => {
        const i = ordenar.elegidos[pos];
        const estado = ordenar.revisado && i !== undefined ? (i === pos ? 'bien' : 'mal') : '';
        return `<li class="${i === undefined ? 'vacio' : 'lleno'} ${estado}">${i === undefined ? '…' : `<b>${c.orden[i].nombre}</b>${ordenar.revisado ? `<small>${c.orden[i].desc}</small>` : ''}`}</li>`;
      }).join('')}</ol>
      <div class="cic-fichas">${quedan.map(i => `<button class="cic-ficha" data-i="${i}">${c.orden[i].nombre}</button>`).join('')}</div>
      <div class="cic-orden-botones">
        <button class="btn chico" id="cic-deshacer" ${ordenar.elegidos.length && !ordenar.revisado ? '' : 'disabled'}>↩ Deshacer</button>
        <button class="btn chico primario" id="cic-revisar" ${lleno && !ordenar.revisado ? '' : 'disabled'}>Revisar</button>
        <button class="btn chico" id="cic-otra">↺ Empezar de nuevo</button>
      </div>
      <div id="cic-resultado">${ordenar.revisado ? resultadoOrden() : ''}</div>`;
    raiz.querySelectorAll('.cic-ficha').forEach(b => b.addEventListener('click', () => {
      if (ordenar.revisado) return;
      ordenar.elegidos.push(+b.dataset.i);
      panelOrdenar();
    }));
    raiz.querySelector('#cic-deshacer').addEventListener('click', () => { ordenar.elegidos.pop(); panelOrdenar(); });
    raiz.querySelector('#cic-revisar').addEventListener('click', () => { ordenar.revisado = true; panelOrdenar(); });
    raiz.querySelector('#cic-otra').addEventListener('click', empezarOrdenar);
  }

  function resultadoOrden() {
    const bien = ordenar.elegidos.filter((i, pos) => i === pos).length;
    const total = CICLOS[ciclo].orden.length;
    return bien === total
      ? `<p class="cic-ok">🎉 ¡Perfecto! Ordenaste las ${total} etapas correctamente. Recuerda que es un <b>ciclo</b>: después de la última etapa, todo vuelve a empezar.</p>`
      : `<p class="cic-error">Acertaste ${bien} de ${total}. Las etapas en rojo están fuera de lugar. Lee las descripciones y vuelve a intentarlo.</p>`;
  }

  return { iniciar };
})();
