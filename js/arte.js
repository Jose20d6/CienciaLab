// Piezas de ilustración compartidas (estilo divulgación: formas planas, sombreado en dos tonos y ojos grandes).
const Arte = (function () {
  let idArte = 0;
  const sombra = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${Math.max(2, rx * 0.18)}" fill="#0a0c2a" opacity="0.28"/>`;

  // Sombreado en dos tonos (característico del estilo): las formas se pintan con el color claro
  // y la parte en sombra se recorta con la misma silueta.
    const dosTonos = (formas, claro, oscuro, corte) => {
    const id = 'dt-' + (idArte++);
    const zona = corte.x !== undefined
      ? `<rect x="${corte.x}" y="-2000" width="4000" height="4000" fill="${oscuro}"/>`
      : `<rect x="-2000" y="${corte.y}" width="4000" height="4000" fill="${oscuro}"/>`;
    return `${formas.replace(/FILL/g, claro)}<clipPath id="${id}">${formas.replace(/FILL/g, '#000')}</clipPath><g clip-path="url(#${id})">${zona}${corte.extra || ''}</g>`;
  };
  // Ojo típico: blanco grande, pupila mirando hacia adelante y un brillito.
  const ojo = (x, y, r, dir = -1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + dir * r * 0.3}" cy="${y + r * 0.1}" r="${r * 0.55}" fill="#15163d"/><circle cx="${x + dir * r * 0.45}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/>`;

  const pino = (x, y, h) => `<g>${sombra(x + 3, y + 1, h * 0.32)}
    <rect x="${x - 1.8}" y="${y - h * 0.22}" width="3.6" height="${h * 0.24}" fill="#553a2f"/>
    <path d="M${x - h * 0.3},${y - h * 0.18} L${x},${y - h * 0.72} L${x + h * 0.3},${y - h * 0.18} Z" fill="#1fae6c"/>
    <path d="M${x},${y - h * 0.72} L${x + h * 0.3},${y - h * 0.18} L${x},${y - h * 0.18} Z" fill="#158553"/>
    <path d="M${x - h * 0.22},${y - h * 0.5} L${x},${y - h} L${x + h * 0.22},${y - h * 0.5} Z" fill="#27c07a"/>
    <path d="M${x},${y - h} L${x + h * 0.22},${y - h * 0.5} L${x},${y - h * 0.5} Z" fill="#1a9a61"/></g>`;
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

  // Aclara (f > 0) u oscurece (f < 0) un color #rrggbb.
  const tono = (hex, f) => {
    const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
    return '#' + c.map(v => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f).toString(16).padStart(2, '0')).join('');
  };
  // Esfera con volumen: base oscura, cara iluminada corrida hacia arriba a la izquierda y un brillo.
  const esfera = (x, y, r, color, brillo = 0.55) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${tono(color, -0.3)}"/>` +
    `<circle cx="${(x - r * 0.12).toFixed(1)}" cy="${(y - r * 0.12).toFixed(1)}" r="${(r * 0.84).toFixed(1)}" fill="${color}"/>` +
    `<ellipse cx="${(x - r * 0.38).toFixed(1)}" cy="${(y - r * 0.4).toFixed(1)}" rx="${(r * 0.28).toFixed(1)}" ry="${(r * 0.17).toFixed(1)}" fill="#fff" opacity="${brillo}" transform="rotate(-35 ${(x - r * 0.38).toFixed(1)} ${(y - r * 0.4).toFixed(1)})"/>`;
  // Cielo nocturno con estrellas fijas (fondo de las escenas).
  const estrellas = (n, w, h, semilla = 0) => Array.from({ length: n }, (_, i) => `<circle cx="${((i + semilla) * 97.3) % w}" cy="${((i + semilla) * 53.9) % h}" r="${0.7 + (i % 3) * 0.5}" fill="#c9ccf5" opacity="${0.15 + (i % 4) * 0.08}"/>`).join('');

  return { sombra, dosTonos, ojo, pino, pajaro, vaca, fabrica, tono, esfera, estrellas };
})();
