// Módulo 10: Alimentación saludable (pirámide, óvalo y plato de la Gráfica de la Alimentación Diaria argentina).
const Alimentacion = (function () {
  const { dosTonos, ojo } = Arte;
  const rad = g => g * Math.PI / 180;

  // ---------- Alimentos ilustrados (centrados en 0,0; unos 40 px) ----------
  const ojos = (x, y, r = 2.6) => ojo(x - r * 1.35, y, r) + ojo(x + r * 1.35, y, r);
  const boca = (x, y, w = 3.5) => `<path d="M${x - w},${y} q${w},${w * 0.9} ${w * 2},0" stroke="#15163d" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const luz = (d, w = 2.4) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0.55"/>`;

  const ICONOS = {
    pan: () => `${dosTonos('<path d="M-19,6 C-21,-10 -8,-16 0,-16 C8,-16 21,-10 19,6 L19,12 Q19,15 16,15 L-16,15 Q-19,15 -19,12 Z" fill="FILL"/>', '#f2b066', '#d18b40', { x: 5 })}
      <path d="M-10,-10 l4,8 M-1,-12 l4,8 M8,-10 l4,8" stroke="#ffe0b0" stroke-width="2.6" stroke-linecap="round"/>${ojos(-3, 6, 2.4)}${boca(-3, 10, 2.5)}`,
    arroz: () => `${[-12, -6, 0, 6, 12].map(x => `<circle cx="${x}" cy="-4" r="4" fill="#fff"/>`).join('')}${[-8, -2, 4, 10].map(x => `<circle cx="${x - 1}" cy="-9" r="3.6" fill="#f1f3ff"/>`).join('')}
      ${dosTonos('<path d="M-20,-2 L20,-2 C19,12 10,17 0,17 C-10,17 -19,12 -20,-2 Z" fill="FILL"/>', '#5cc8ff', '#3aa0d8', { x: 5 })}<rect x="-20" y="-3" width="40" height="3.5" rx="1.7" fill="#a5dcff"/>`,
    fideos: () => `<ellipse cy="9" rx="20" ry="7" fill="#dfe3ff"/><ellipse cy="10" rx="20" ry="6" fill="#b8bff5" opacity="0.6"/>
      ${[0, 1, 2].map(i => `<path d="M${-14 + i * 3},${6 - i * 4} q6,-8 12,0 t12,0" stroke="${i % 2 ? '#f5c518' : '#ffe066'}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join('')}
      <circle cx="4" cy="-7" r="3.2" fill="#ff6b6b"/>`,
    papa: () => `${dosTonos('<ellipse rx="18" ry="13" fill="FILL"/>', '#d9a86c', '#b5854e', { x: 5 })}${[[-9, -4], [6, 5], [10, -6]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="1.3" fill="#9c6b3a"/>`).join('')}${ojos(-3, -1, 2.3)}`,
    batata: () => `${dosTonos('<path d="M-20,2 C-16,-12 12,-14 20,-2 C18,10 -12,14 -20,2 Z" fill="FILL"/>', '#d9643a', '#b24a28', { y: 2 })}${luz('M-10,-6 q8,-4 16,-2', 2)}`,
    choclo: () => `<g transform="rotate(-25)">${dosTonos('<ellipse rx="8.5" ry="18" fill="FILL"/>', '#ffd43b', '#f5b700', { x: 1 })}
      ${[-12, -6, 0, 6, 12].map(y => [-4, 0, 4].map(x => `<circle cx="${x}" cy="${y}" r="1.5" fill="#f08c00" opacity="0.55"/>`).join('')).join('')}
      <path d="M-8,18 C-16,4 -14,-8 -10,-14 C-8,0 -4,10 0,18 Z" fill="#51cf66"/><path d="M8,18 C16,4 14,-8 10,-14 C8,0 4,10 0,18 Z" fill="#2f9e44"/></g>`,
    legumbres: () => `${[[-10, 6, 20], [0, 8, -10], [10, 6, 30], [-5, -2, -20], [6, -2, 10], [0, -9, 0], [-13, -3, 40], [13, -3, -30]].map(([x, y, a], i) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.2" transform="rotate(${a} ${x} ${y})" fill="${i % 2 ? '#c47a45' : '#a0522d'}"/><ellipse cx="${x - 1.5}" cy="${y - 1.4}" rx="2" ry="1" fill="#e8b48a" opacity="0.7"/>`).join('')}`,
    avena: () => `${dosTonos('<path d="M-20,-2 L20,-2 C19,12 10,17 0,17 C-10,17 -19,12 -20,-2 Z" fill="FILL"/>', '#ff8fb1', '#e0607f', { x: 5 })}<ellipse cy="-3" rx="18" ry="5" fill="#f3e2c3"/>${[[-8, -4], [2, -5], [9, -3], [-2, -2]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.4" fill="#d9b98a"/>`).join('')}`,
    manzana: () => `${dosTonos('<path d="M0,-10 C8,-18 20,-10 18,4 C16,16 6,20 0,16 C-6,20 -16,16 -18,4 C-20,-10 -8,-18 0,-10 Z" fill="FILL"/>', '#ff5c5c', '#d63c3c', { x: 4 })}
      <path d="M0,-10 q1,-6 4,-9" stroke="#6b3f2a" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="8" cy="-16" rx="6" ry="3" transform="rotate(-25 8 -16)" fill="#51cf66"/>
      ${luz('M-12,-6 q2,-5 7,-6')}${ojos(-2, 2, 2.6)}${boca(-2, 7)}`,
    banana: () => `${dosTonos('<path d="M-19,-10 C-14,10 8,17 21,4 C23,2 21,-1 18,1 C8,8 -6,4 -12,-12 Z" fill="FILL"/>', '#ffe066', '#f5c518', { y: 5 })}<path d="M-19,-10 l-2,-4" stroke="#6b3f2a" stroke-width="3" stroke-linecap="round"/>${ojos(0, 3, 2.2)}`,
    naranja: () => `${dosTonos('<circle r="16" fill="FILL"/>', '#ffa94d', '#f08c00', { x: 4 })}${[[-6, -4], [5, 6], [8, -6], [-7, 7]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#d9480f"/>`).join('')}<ellipse cx="3" cy="-16" rx="5" ry="2.4" fill="#51cf66"/>${luz('M-10,-6 q2,-5 7,-6')}`,
    zanahoria: () => `<path d="M0,-14 C-4,-22 -10,-22 -12,-20 M0,-14 C0,-22 4,-24 6,-24 M0,-14 C4,-20 10,-20 12,-18" stroke="#2fd186" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      ${dosTonos('<path d="M-8,-14 L8,-14 L1.5,18 Q0,21 -1.5,18 Z" fill="FILL"/>', '#ff922b', '#e8590c', { x: 1 })}<path d="M-5,-4 h4 M-3,4 h4 M-4,10 h3" stroke="#d9480f" stroke-width="1.6" stroke-linecap="round"/>`,
    brocoli: () => `${dosTonos('<path d="M-5,4 L5,4 L6,18 L-6,18 Z" fill="FILL"/>', '#b2f2bb', '#8ce99a', { x: 0 })}
      ${dosTonos([[-10, -2, 8], [0, -8, 10], [10, -2, 8], [-4, 4, 7], [6, 4, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="FILL"/>`).join(''), '#2fd186', '#1a9a61', { x: 3 })}${ojos(0, -2, 2.3)}`,
    tomate: () => `${dosTonos('<circle r="16" fill="FILL"/>', '#ff6b6b', '#e03131', { x: 4 })}<path d="M0,-15 l-4,-5 l4,2 l4,-2 l0,4 l6,-1 l-5,4 l5,3 l-6,-1 Z" fill="#2f9e44"/>${luz('M-10,-5 q2,-5 6,-6')}${ojos(-1, 2, 2.4)}`,
    lechuga: () => `${dosTonos([[-10, 2, 10], [10, 2, 10], [0, -6, 12], [0, 6, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="FILL"/>`).join(''), '#8ce99a', '#51cf66', { x: 3 })}<path d="M0,-12 v22 M0,-2 l-7,-6 M0,4 l7,-6" stroke="#d3f9d8" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    zapallo: () => `${dosTonos('<ellipse cx="-7" rx="10" ry="14" fill="FILL"/><ellipse cx="7" rx="10" ry="14" fill="FILL"/><ellipse rx="10" ry="15" fill="FILL"/>', '#ff922b', '#e8590c', { x: 4 })}<path d="M0,-15 q2,-5 5,-6" stroke="#6b3f2a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    leche: () => `${dosTonos('<path d="M-12,-8 L0,-19 L12,-8 L12,18 L-12,18 Z" fill="FILL"/>', '#f1f3ff', '#c9cdf0', { x: 3 })}<rect x="-12" y="-2" width="24" height="11" fill="#5cc8ff"/><rect x="3" y="-2" width="9" height="11" fill="#3aa0d8"/>
      <path d="M-12,-8 L0,-19 L12,-8" stroke="#9aa3ff" stroke-width="2" fill="none"/>${ojos(-2, -8, 2.2)}${boca(-2, 13, 2.5)}`,
    yogur: () => `${dosTonos('<path d="M-13,-10 L13,-10 L10,16 L-10,16 Z" fill="FILL"/>', '#ffffff', '#dfe3ff', { x: 3 })}<ellipse cy="-10" rx="14" ry="4" fill="#ff8fb1"/><rect x="-11" y="0" width="22" height="7" fill="#ff8fb1" opacity="0.7"/>${ojos(-1, -3, 2.1)}`,
    queso: () => `${dosTonos('<path d="M-19,13 L-19,-1 L17,-13 L19,13 Z" fill="FILL"/>', '#ffd43b', '#f5b700', { y: 2 })}<path d="M-19,-1 L17,-13" stroke="#ffe8a3" stroke-width="2.4"/>${[[-8, 6, 3], [6, 2, 2.4], [10, 9, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f08c00" opacity="0.7"/>`).join('')}`,
    huevo: () => `${dosTonos('<ellipse rx="13" ry="17" fill="FILL"/>', '#fff3e0', '#e8d2b0', { x: 4 })}${luz('M-8,-8 q2,-6 6,-7')}${ojos(-1, 1, 2.4)}${boca(-1, 6, 2.5)}`,
    pescado: () => `<path d="M14,0 L24,-9 L24,9 Z" fill="#3aa0d8"/>${dosTonos('<ellipse rx="17" ry="11" fill="FILL"/>', '#5cc8ff', '#3aa0d8', { y: 2 })}
      <path d="M-2,-11 q6,-6 10,0 Z" fill="#3aa0d8"/><path d="M4,-6 q3,6 0,12" stroke="#a5dcff" stroke-width="1.6" fill="none"/>${ojo(-9, -2, 3)}`,
    carne: () => `${dosTonos('<path d="M-18,-4 C-18,-14 0,-16 10,-12 C20,-8 22,6 14,12 C6,18 -14,16 -18,6 Z" fill="FILL"/>', '#e8505b', '#c23a45', { y: 2 })}
      <path d="M-18,-4 C-18,-14 0,-16 10,-12 C20,-8 22,6 14,12" stroke="#ffc9d0" stroke-width="3" fill="none"/><circle cx="-6" cy="0" r="4" fill="#fff3e0"/><circle cx="-6" cy="0" r="1.8" fill="#e8d2b0"/>`,
    pollo: () => `<path d="M4,4 L14,14" stroke="#fff3e0" stroke-width="5" stroke-linecap="round"/><circle cx="15" cy="11" r="3" fill="#fff3e0"/><circle cx="12" cy="16" r="3" fill="#fff3e0"/>
      ${dosTonos('<ellipse cx="-4" cy="-4" rx="14" ry="12" transform="rotate(-35 -4 -4)" fill="FILL"/>', '#e8914a', '#c46f2e', { y: 0 })}${luz('M-12,-8 q3,-6 9,-7')}`,
    aceite: () => `${dosTonos('<path d="M-4,-20 L4,-20 L4,-12 C12,-8 12,-4 12,2 L12,18 L-12,18 L-12,2 C-12,-4 -12,-8 -4,-12 Z" fill="FILL"/>', '#c0eb75', '#94d82d', { x: 4 })}
      <rect x="-5" y="-23" width="10" height="5" rx="2" fill="#2f9e44"/><rect x="-10" y="2" width="20" height="9" rx="2" fill="#fff3bf"/><path d="M-3,6 c2,-4 4,-4 6,0" stroke="#94d82d" stroke-width="1.8" fill="none"/>`,
    nueces: () => `${[[-9, 4], [8, 5], [0, -6]].map(([x, y]) => `<g transform="translate(${x} ${y})">${dosTonos('<circle r="9" fill="FILL"/>', '#c9955f', '#a0703f', { x: 2 })}<path d="M0,-8 v16 M-5,-4 q3,3 0,6 M5,-4 q-3,3 0,6" stroke="#7a5230" stroke-width="1.3" fill="none"/></g>`).join('')}`,
    semillas: () => `${Array.from({ length: 14 }, (_, k) => { const a = k * 2.4, r = 3 * Math.sqrt(k); return `<ellipse cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a)).toFixed(1)}" rx="2.6" ry="1.8" transform="rotate(${k * 30} ${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)})" fill="${k % 3 ? '#5c4a3a' : '#e8d2b0'}"/>`; }).join('')}`,
    golosina: () => `<path d="M-10,0 L-20,-8 L-18,0 L-20,8 Z M10,0 L20,-8 L18,0 L20,8 Z" fill="#ff8fb1"/>${dosTonos('<ellipse rx="11" ry="9" fill="FILL"/>', '#ff6b9d', '#e0487f', { y: 1 })}<path d="M-6,-6 l4,12 M2,-7 l4,12" stroke="#ffd1e6" stroke-width="2"/>`,
    galletita: () => `${dosTonos('<circle r="16" fill="FILL"/>', '#e0a15a', '#c07f3c', { x: 4 })}${[[-6, -5], [5, -7], [7, 5], [-5, 6], [0, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#5c3a21"/>`).join('')}`,
    gaseosa: () => `${dosTonos('<rect x="-11" y="-17" width="22" height="34" rx="5" fill="FILL"/>', '#ff5c5c', '#d63c3c', { x: 4 })}<ellipse cy="-17" rx="11" ry="3" fill="#c9cdf0"/><path d="M-11,2 q6,-6 11,0 t11,0" stroke="#fff" stroke-width="3" fill="none"/>`,
    snack: () => `${dosTonos('<path d="M-14,-18 L14,-18 L12,-12 L14,18 L-14,18 L-12,-12 Z" fill="FILL"/>', '#ffd43b', '#f5b700', { x: 4 })}<rect x="-14" y="-18" width="28" height="4" fill="#e8590c"/><ellipse cy="2" rx="8" ry="6" fill="#ff922b"/><path d="M-5,2 q5,-4 10,0" stroke="#fff3bf" stroke-width="1.6" fill="none"/>`,
    fiambre: () => `${dosTonos('<circle r="16" fill="FILL"/>', '#ff8fa3', '#e8647f', { x: 4 })}${[[-6, -4], [5, -6], [6, 6], [-5, 6], [0, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#ffd1dc"/>`).join('')}`,
    manteca: () => `${dosTonos('<path d="M-18,-4 L-8,-12 L18,-12 L18,8 L-18,8 Z" fill="FILL"/>', '#fff3bf', '#ffe066', { y: -4 })}<rect x="-18" y="4" width="36" height="8" rx="2" fill="#ffd43b"/>`,
    canilla: () => `<rect x="-20" y="-10" width="10" height="16" rx="3" fill="#8a93b8"/>${dosTonos('<path d="M-12,-6 L10,-6 C18,-6 20,0 20,6 L20,12 L12,12 L12,8 C12,4 10,4 8,4 L-12,4 Z" fill="FILL"/>', '#e1e4fa', '#a3a9d1', { y: 0 })}
      <rect x="-4" y="-16" width="6" height="10" fill="#a3a9d1"/><rect x="-11" y="-20" width="20" height="5" rx="2.5" fill="#e1e4fa"/><rect x="11" y="12" width="10" height="3" rx="1.5" fill="#7a81ad"/>${luz('M-8,-3 h14', 1.6)}`,
    sandia: () => `${dosTonos('<path d="M-20,-4 A20,20 0 0 0 20,-4 Z" fill="FILL"/>', '#2fd186', '#1a9a61', { x: 6 })}<path d="M-17,-4 A17,17 0 0 0 17,-4 Z" fill="#b2f2bb"/><path d="M-15,-4 A15,15 0 0 0 15,-4 Z" fill="#ff5c7a"/>
      ${[[-8, 1], [0, 4], [8, 1], [-3, -1], [4, -1]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.1" ry="1.8" fill="#15163d"/>`).join('')}`,
    uvas: () => `<path d="M0,-16 q2,-6 6,-7" stroke="#6b3f2a" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="7" cy="-16" rx="5" ry="2.6" fill="#51cf66"/>
      ${[[-8, -9], [0, -9], [8, -9], [-4, -1], [4, -1], [-8, 7], [0, 7], [8, 7], [-4, 14], [4, 14], [0, 20]].filter((_, i) => i < 11).map(([x, y]) => `<circle cx="${x * 0.9}" cy="${y * 0.85}" r="4.6" fill="#8a4fcf"/><circle cx="${x * 0.9 - 1.4}" cy="${y * 0.85 - 1.4}" r="1.3" fill="#d0bfff" opacity="0.8"/>`).join('')}`,
    pera: () => `${dosTonos('<path d="M0,-16 C6,-16 7,-6 10,0 C16,8 14,18 0,18 C-14,18 -16,8 -10,0 C-7,-6 -6,-16 0,-16 Z" fill="FILL"/>', '#d8f5a2', '#a9e34b', { x: 3 })}<path d="M0,-16 q1,-5 3,-7" stroke="#6b3f2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>${luz('M-7,2 q0,-6 3,-10')}${ojos(0, 6, 2.3)}`,
    pimiento: () => `${dosTonos('<path d="M-14,-8 C-16,6 -10,18 -4,18 C0,14 0,14 4,18 C10,18 16,6 14,-8 C10,-12 4,-10 0,-12 C-4,-10 -10,-12 -14,-8 Z" fill="FILL"/>', '#ff6b6b', '#e03131', { x: 3 })}<path d="M0,-12 q0,-6 5,-8" stroke="#2f9e44" stroke-width="3.4" fill="none" stroke-linecap="round"/>${luz('M-9,-4 q-1,8 2,14')}`,
    agua: () => `<path d="M-12,-17 L12,-17 L9,17 L-9,17 Z" fill="#dfe3ff" opacity="0.35"/><path d="M-10.5,-5 L10.5,-5 L9,17 L-9,17 Z" fill="#5cc8ff"/><path d="M-10.5,-5 L10.5,-5" stroke="#a5dcff" stroke-width="2"/>
      <path d="M-12,-17 L12,-17 L9,17 L-9,17 Z" fill="none" stroke="#e9ebff" stroke-width="1.6" stroke-linejoin="round"/>${luz('M-7,-12 L-5,10', 2)}`,
    sal: () => `<rect x="-9" y="-6" width="18" height="24" rx="4" fill="#f1f3ff"/><rect x="2" y="-6" width="7" height="24" fill="#c9cdf0"/><path d="M-9,-6 C-9,-18 9,-18 9,-6 Z" fill="#9aa3ff"/>${[[-3, -12], [3, -12], [0, -9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#15163d"/>`).join('')}`,
  };
  const icono = (id, x, y, s = 1) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">${ICONOS[id]()}</g>`;
  const miniIcono = (id, tam = 30) => `<svg viewBox="-24 -24 48 48" width="${tam}" height="${tam}" aria-hidden="true">${ICONOS[id]()}</svg>`;

  // ---------- Grupos de cada modelo ----------
  const FUNCIONES = {
    energetica: '⚡ Energética: aporta la energía para moverse, pensar y mantener la temperatura.',
    constructora: '🧱 Constructora (plástica): forma y repara tejidos como músculos, huesos y piel.',
    reguladora: '⚙️ Reguladora: aporta vitaminas y minerales que regulan el funcionamiento del cuerpo.',
  };

  const PIRAMIDE = [
    { id: 'grasas', n: 'Grasas, aceites y dulces', corto: 'Grasas y dulces', porc: 'Con moderación', c: ['#ff8fb1', '#e0607f'], iconos: ['golosina', 'aceite', 'galletita'],
      nut: ['Lípidos', 'Azúcares simples'], fun: ['energetica'], x: 'En la punta: son alimentos muy energéticos y con pocos nutrientes, así que había que consumirlos poco. La pirámide no distinguía entre aceites saludables y grasas o azúcares agregados.' },
    { id: 'lacteos', n: 'Leche, yogur y queso', corto: 'Lácteos', porc: '2 a 3 porciones', c: ['#74c0fc', '#4a9fe0'], iconos: ['leche', 'queso'],
      nut: ['Proteínas', 'Calcio', 'Vitamina D'], fun: ['constructora'], x: 'Aportan calcio para huesos y dientes, y proteínas de alto valor biológico.' },
    { id: 'carnes', n: 'Carnes, pescado, huevos, legumbres y frutos secos', corto: 'Carnes y legumbres', porc: '2 a 3 porciones', c: ['#b197fc', '#8a6cf0'], iconos: ['carne', 'huevo', 'pescado'],
      nut: ['Proteínas', 'Hierro', 'Zinc'], fun: ['constructora'], x: 'Son la principal fuente de proteínas. Las legumbres y los frutos secos aparecían aquí por su aporte proteico.' },
    { id: 'verduras', n: 'Verduras', corto: 'Verduras', porc: '3 a 5 porciones', c: ['#2fd186', '#1a9a61'], iconos: ['brocoli', 'zanahoria', 'tomate'],
      nut: ['Vitaminas', 'Minerales', 'Fibra'], fun: ['reguladora'], x: 'Aportan vitaminas (A, C, ácido fólico), minerales, fibra y agua, con muy pocas calorías.' },
    { id: 'frutas', n: 'Frutas', corto: 'Frutas', porc: '2 a 4 porciones', c: ['#ff6b6b', '#d94848'], iconos: ['manzana', 'banana', 'naranja'],
      nut: ['Vitaminas', 'Fibra', 'Azúcares naturales'], fun: ['reguladora'], x: 'Aportan vitamina C, fibra y agua. Es mejor comerlas enteras que en jugo.' },
    { id: 'cereales', n: 'Pan, cereales, arroz y pastas', corto: 'Cereales', porc: '6 a 11 porciones', c: ['#ffb84d', '#e0922f'], iconos: ['pan', 'arroz', 'fideos', 'choclo'],
      nut: ['Carbohidratos (almidón)', 'Fibra', 'Vitaminas B'], fun: ['energetica'], x: 'Es la base: según este modelo, la mayor parte de la energía del día debía venir de aquí. No distinguía entre harinas integrales y refinadas.' },
  ];

  const OVALO = [
    { id: 'cereales', n: 'Cereales, sus derivados y legumbres', corto: 'Cereales,\nlegumbres, pastas', p: 0.27, c: ['#ffb84d', '#e0922f'], iconos: ['pan', 'fideos', 'legumbres'],
      nut: ['Carbohidratos (almidón)', 'Fibra', 'Proteínas vegetales'], fun: ['energetica'], x: 'Es el grupo más grande: la base de la energía diaria. Las legumbres (lentejas, porotos, garbanzos) se incluyen aquí.' },
    { id: 'hortalizas', n: 'Hortalizas y frutas', corto: 'Frutas y\nverduras', p: 0.26, c: ['#2fd186', '#1a9a61'], iconos: ['zanahoria', 'manzana', 'tomate'],
      nut: ['Vitaminas', 'Minerales', 'Fibra'], fun: ['reguladora'], x: 'El segundo grupo en tamaño: vitaminas, minerales, fibra y agua. Conviene variar los colores.' },
    { id: 'lacteos', n: 'Leche, yogur y quesos', corto: 'Lácteos', p: 0.14, c: ['#74c0fc', '#4a9fe0'], iconos: ['leche', 'queso'],
      nut: ['Proteínas', 'Calcio'], fun: ['constructora'], x: 'Principal fuente de calcio, necesario sobre todo en el crecimiento.' },
    { id: 'carnes', n: 'Carnes y huevos', corto: 'Carnes,\nhuevos', p: 0.14, c: ['#b197fc', '#8a6cf0'], iconos: ['carne', 'huevo'],
      nut: ['Proteínas', 'Hierro', 'Vitamina B12'], fun: ['constructora'], x: 'Proteínas de alto valor biológico y hierro de fácil absorción.' },
    { id: 'aceites', n: 'Aceites y grasas', corto: 'Aceites\ny grasas', p: 0.11, c: ['#c0eb75', '#94d82d'], iconos: ['aceite', 'manteca'],
      nut: ['Lípidos', 'Vitamina E'], fun: ['energetica'], x: 'Aportan energía y ácidos grasos esenciales. Se recomiendan con moderación.' },
    { id: 'azucares', n: 'Azúcar y dulces', corto: 'Azúcares', p: 0.08, c: ['#ff8fb1', '#e0607f'], iconos: ['golosina'],
      nut: ['Azúcares simples'], fun: ['energetica'], x: 'El grupo más chico: solo aportan energía, así que conviene consumirlos poco.' },
  ];

  // Gráfica de la Alimentación Diaria (Guías Alimentarias para la Población Argentina, 2016).
  const PLATO = [
    { id: 'verduras', n: 'Verduras y frutas', corto: 'Verduras y frutas', p: 0.40, c: ['#2fd186', '#1a9a61'], iconos: ['brocoli', 'tomate', 'zanahoria', 'manzana', 'banana'], msg: 3,
      nut: ['Vitaminas', 'Minerales', 'Fibra'], fun: ['reguladora'], x: 'Es el grupo más grande del plato: 5 porciones por día, en variedad de tipos y colores.' },
    { id: 'cereales', n: 'Legumbres, cereales, papa, pan y pastas', corto: 'Legumbres y cereales', p: 0.26, c: ['#ffb84d', '#e0922f'], iconos: ['pan', 'legumbres', 'papa', 'fideos'], msg: 8,
      nut: ['Carbohidratos (almidón)', 'Fibra', 'Proteínas vegetales'], fun: ['energetica'], x: 'Incluye papa, batata, choclo y mandioca: aunque parezcan verduras, aportan almidón como los cereales. Se recomiendan los cereales integrales.' },
    { id: 'lacteos', n: 'Leche, yogur y quesos', corto: 'Lácteos', p: 0.13, c: ['#74c0fc', '#4a9fe0'], iconos: ['leche', 'yogur', 'queso'], msg: 6,
      nut: ['Proteínas', 'Calcio'], fun: ['constructora'], x: 'Consumirlos a diario, preferentemente descremados.' },
    { id: 'carnes', n: 'Carnes y huevos', corto: 'Carnes y huevos', p: 0.13, c: ['#b197fc', '#8a6cf0'], iconos: ['carne', 'pescado', 'huevo'], msg: 7,
      nut: ['Proteínas', 'Hierro', 'Vitamina B12'], fun: ['constructora'], x: 'Quitar la grasa visible, comer más pescado e incluir huevo.' },
    { id: 'aceites', n: 'Aceites, frutas secas y semillas', corto: 'Aceites y semillas', p: 0.08, c: ['#c0eb75', '#94d82d'], iconos: ['aceite', 'nueces', 'semillas'], msg: 9,
      nut: ['Lípidos (ácidos grasos esenciales)', 'Vitamina E'], fun: ['energetica'], x: 'Usar el aceite crudo como condimento y sumar frutas secas o semillas.' },
    { id: 'opcionales', n: 'Alimentos de consumo opcional', corto: 'Consumo opcional', p: 0.05, c: ['#ff8fb1', '#e0607f'], iconos: ['golosina', 'gaseosa', 'snack'], msg: 5,
      nut: ['Azúcares simples', 'Grasas', 'Sodio'], fun: ['energetica'], x: 'Golosinas, gaseosas, snacks, fiambres, manteca, facturas… Tienen mucha azúcar, grasa o sal y pocos nutrientes: por eso ocupan la <b>franja más chica</b> del plato y se recomienda limitarlos.' },
  ];
  const EXTRAS_PLATO = {
    agua: { n: 'Agua segura', c: ['#5cc8ff', '#3aa0d8'], msg: 2, nut: ['Agua'], fun: ['reguladora'], x: 'Más de la mitad del cuerpo es agua: transporta nutrientes, regula la temperatura y elimina desechos. Se recomiendan 8 vasos por día, y el agua debe ser segura (potable).' },
    sal: { n: 'Menos sal', c: ['#dfe3ff', '#9aa3ff'], msg: 4, nut: ['Sodio'], fun: [], x: 'El exceso de sodio aumenta la presión arterial. Cocinar sin sal, no llevar el salero a la mesa y leer las etiquetas de los alimentos envasados.' },
    actividad: { n: 'Actividad física', c: ['#ffd166', '#f0a830'], msg: 1, nut: [], fun: [], x: 'Alimentarse bien va de la mano con moverse: al menos 30 minutos de actividad física por día.' },
  };
  const EXTRAS_OVALO = {
    agua: { n: 'El agua', c: ['#5cc8ff', '#3aa0d8'], porc: 'Consumo diario: 1,5 a 2 litros', nut: ['Agua'], fun: ['reguladora'], x: 'El óvalo incorpora el agua como elemento fundamental de la dieta, pues está presente en todos los procesos metabólicos y en la eliminación de toxinas. Por eso el recorrido empieza en la canilla.' },
  };
  const MENSAJES = [
    'Incorporar a diario alimentos de todos los grupos y realizar al menos 30 minutos de actividad física.',
    'Tomar a diario 8 vasos de agua segura.',
    'Consumir a diario 5 porciones de frutas y verduras en variedad de tipos y colores.',
    'Reducir el uso de sal y el consumo de alimentos con alto contenido de sodio.',
    'Limitar el consumo de bebidas azucaradas y de alimentos con elevado contenido de grasas, azúcar y sal.',
    'Consumir diariamente leche, yogur o queso, preferentemente descremados.',
    'Al consumir carnes quitarle la grasa visible, aumentar el consumo de pescado e incluir huevo.',
    'Consumir legumbres, cereales preferentemente integrales, papa, batata, choclo o mandioca.',
    'Consumir aceite crudo como condimento, frutas secas o semillas.',
    'El consumo de bebidas alcohólicas debe ser responsable. Los niños, adolescentes y mujeres embarazadas no deben consumirlas.',
  ];

  // ---------- Alimentos para las actividades ----------
  const ALIMENTOS = [
    { id: 'brocoli', n: 'Brócoli', g: 'verduras', x: 'Una verdura verde, rica en vitamina C y fibra.' },
    { id: 'tomate', n: 'Tomate', g: 'verduras', x: 'Botánicamente es un fruto, pero se come como verdura: está en el grupo de verduras y frutas.' },
    { id: 'zanahoria', n: 'Zanahoria', g: 'verduras', x: 'Rica en betacaroteno, que el cuerpo transforma en vitamina A.' },
    { id: 'lechuga', n: 'Lechuga', g: 'verduras', x: 'Verdura de hoja: mucha agua y fibra, casi sin calorías.' },
    { id: 'zapallo', n: 'Zapallo', g: 'verduras', x: 'Aunque es anaranjado y dulce, es una verdura (no aporta tanto almidón como la papa).' },
    { id: 'manzana', n: 'Manzana', g: 'verduras', x: 'Fruta con fibra (pectina): mejor entera que en jugo.' },
    { id: 'banana', n: 'Banana', g: 'verduras', x: 'Fruta rica en potasio.' },
    { id: 'naranja', n: 'Naranja', g: 'verduras', x: 'Fruta con mucha vitamina C.' },
    { id: 'pan', n: 'Pan', g: 'cereales', x: 'Hecho con harina de trigo: aporta almidón. Mejor si es integral.' },
    { id: 'arroz', n: 'Arroz', g: 'cereales', x: 'Un cereal: casi todo es almidón.' },
    { id: 'fideos', n: 'Fideos', g: 'cereales', x: 'Las pastas se hacen con harina: grupo de cereales.' },
    { id: 'avena', n: 'Avena', g: 'cereales', x: 'Un cereal integral con mucha fibra.' },
    { id: 'papa', n: 'Papa', g: 'cereales', x: '¡Trampa! No va con las verduras: por su almidón, la papa está en el grupo de <b>legumbres, cereales, papa, pan y pastas</b>.' },
    { id: 'batata', n: 'Batata', g: 'cereales', x: 'Como la papa, aporta almidón: grupo de legumbres y cereales.' },
    { id: 'choclo', n: 'Choclo', g: 'cereales', x: 'Es un cereal (maíz): va con legumbres y cereales, no con las verduras.' },
    { id: 'legumbres', n: 'Lentejas', g: 'cereales', x: 'Las legumbres están en el grupo de legumbres y cereales. Combinadas con cereales aportan proteínas completas.' },
    { id: 'leche', n: 'Leche', g: 'lacteos', x: 'Fuente de calcio y proteínas.' },
    { id: 'yogur', n: 'Yogur', g: 'lacteos', x: 'Leche fermentada por bacterias: mismo grupo que la leche.' },
    { id: 'queso', n: 'Queso', g: 'lacteos', x: 'Un lácteo concentrado: mucho calcio (y también grasa y sal).' },
    { id: 'carne', n: 'Carne vacuna', g: 'carnes', x: 'Proteínas y hierro. Conviene quitarle la grasa visible.' },
    { id: 'pollo', n: 'Pollo', g: 'carnes', x: 'Carne blanca: proteínas con menos grasa si se quita la piel.' },
    { id: 'pescado', n: 'Pescado', g: 'carnes', x: 'Proteínas y grasas omega 3. Se recomienda comer más pescado.' },
    { id: 'huevo', n: 'Huevo', g: 'carnes', x: 'Está en el grupo de carnes y huevos: proteínas de alto valor biológico.' },
    { id: 'aceite', n: 'Aceite', g: 'aceites', x: 'Mejor crudo, como condimento.' },
    { id: 'nueces', n: 'Nueces', g: 'aceites', x: 'Las frutas secas están con los aceites: aportan grasas saludables.' },
    { id: 'semillas', n: 'Semillas de chía', g: 'aceites', x: 'Las semillas van con aceites y frutas secas: aportan omega 3 y fibra.' },
    { id: 'golosina', n: 'Golosinas', g: 'opcionales', x: 'Casi pura azúcar: consumo opcional.' },
    { id: 'gaseosa', n: 'Gaseosa', g: 'opcionales', x: 'Bebida azucarada: hay que limitarla. Una lata puede tener más de 7 cucharaditas de azúcar.' },
    { id: 'snack', n: 'Papas fritas de paquete', g: 'opcionales', x: 'Aunque son de papa, tienen mucha grasa y sal: son de consumo opcional.' },
    { id: 'fiambre', n: 'Fiambres', g: 'opcionales', x: 'Tienen mucha grasa y sodio: son de consumo opcional, no del grupo de carnes.' },
    { id: 'manteca', n: 'Manteca', g: 'opcionales', x: 'Es grasa saturada: está en consumo opcional, no con los aceites.' },
    { id: 'galletita', n: 'Galletitas dulces', g: 'opcionales', x: 'Harina refinada con azúcar y grasas: consumo opcional.' },
  ];
  const NOMBRE_GRUPO = Object.fromEntries(PLATO.map(g => [g.id, g.n]));
  const OBJETIVO = { verduras: 5, cereales: 4, lacteos: 3, carnes: 2, aceites: 2, opcionales: 1 };

  // ---------- Estado ----------
  let raiz, modo = 'piramide', sel = null, dia = null, juego = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🥗 Alimentación saludable</h1>
        <p>Tres formas de mostrar qué y cuánto comer: la <b>pirámide nutricional</b>, el <b>óvalo nutricional</b> y el <b>plato</b> de las Guías Alimentarias para la Población Argentina. Tócalas para explorar cada grupo.</p>
      </div>
      <div class="segmentado" id="ali-modos">
        <button data-m="piramide">🔺 Pirámide</button>
        <button data-m="ovalo">🥚 Óvalo</button>
        <button data-m="plato">🍽️ Plato argentino</button>
        <button data-m="comparar">⚖️ Comparar</button>
        <button data-m="dia">🧑‍🍳 Armá tu día</button>
        <button data-m="grupos">🎯 ¿Qué grupo?</button>
      </div>
      <div id="ali-vista"></div>`;
    raiz.querySelectorAll('#ali-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    cambiarModo('piramide');
  }

  function cambiarModo(m) {
    modo = m;
    sel = null;
    raiz.querySelectorAll('#ali-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    if (m === 'comparar') return vistaComparar();
    if (m === 'dia') return vistaDia();
    if (m === 'grupos') return vistaGrupos();
    raiz.querySelector('#ali-vista').innerHTML = `
      <div class="ali-grid">
        <div class="panel ali-escena"><svg id="ali-svg" viewBox="0 0 760 460" role="img" aria-label="Guía alimentaria"></svg></div>
        <aside class="panel ali-info" id="ali-info"></aside>
      </div>`;
    const svg = raiz.querySelector('#ali-svg');
    svg.innerHTML = dibujo(m, true);
    svg.addEventListener('click', e => {
      const g = e.target.closest('[data-g]');
      sel = g ? g.dataset.g : null;
      marcar();
      pintarInfo();
    });
    pintarInfo();
  }

  const dibujo = (m, interactivo) => m === 'piramide' ? dibujarPiramide(interactivo) : m === 'ovalo' ? dibujarOvalo(interactivo) : dibujarPlato(interactivo);

  function marcar() {
    const svg = raiz.querySelector('#ali-svg');
    svg.classList.toggle('con-sel', !!sel);
    svg.querySelectorAll('[data-g]').forEach(g => g.classList.toggle('sel', g.dataset.g === sel));
  }

  // ---------- Fondo común (estilo ilustrado) ----------
  const fondo = () => `<defs>
      <radialGradient id="ali-fondo" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#272b78"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
      <radialGradient id="ali-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd166" stop-opacity="0.22"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="760" height="460" rx="14" fill="url(#ali-fondo)"/>
    ${Array.from({ length: 36 }, (_, i) => `<circle cx="${(i * 97.3) % 760}" cy="${(i * 53.9) % 460}" r="${0.7 + (i % 3) * 0.5}" fill="#c9ccf5" opacity="${0.2 + (i % 4) * 0.1}"/>`).join('')}`;
  const etiqueta = (x, y, titulo, sub, ancla = 'middle') => {
    const lineas = titulo.split('\n');
    return `<text x="${x}" y="${y}" text-anchor="${ancla}" class="ali-etq">${lineas.map((l, i) => `<tspan x="${x}" dy="${i ? 15 : 0}">${l}</tspan>`).join('')}</text>${sub ? `<text x="${x}" y="${y + 14 + (lineas.length - 1) * 15}" text-anchor="${ancla}" class="ali-etq-sub">${sub}</text>` : ''}`;
  };
  // Pastilla oscura con texto (para rotular sobre los dibujos).
  const pastilla = (x, y, texto) => {
    const lineas = texto.split('\n'), w = Math.max(...lineas.map(l => l.length)) * 7 + 18, h = lineas.length * 15 + 8;
    return `<g pointer-events="none"><rect x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="${Math.min(12, h / 2)}" fill="#12143a" opacity="0.88"/>
      <text x="${x}" y="${(y - h / 2 + 15.5).toFixed(1)}" text-anchor="middle" class="ali-pastilla">${lineas.map((l, i) => `<tspan x="${x}" dy="${i ? 15 : 0}">${l}</tspan>`).join('')}</text></g>`;
  };

  // ---------- Pirámide nutricional ----------
  function dibujarPiramide() {
    const AX = 380, AY = 34, BY = 420, MB = 285;
    const xl = y => AX - MB * (y - AY) / (BY - AY), xr = y => AX + MB * (y - AY) / (BY - AY);
    const pol = pts => `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="FILL"/>`;
    const G = Object.fromEntries(PIRAMIDE.map(g => [g.id, g]));
    const iconosEn = (ids, y0, y1, xa, xb) => {
      const s = Math.min(1.25, (y1 - y0) / 52), n = ids.length;
      return ids.map((id, i) => icono(id, xa + (xb - xa) * (i + 0.5) / n, (y0 + y1) / 2 + 3, s)).join('');
    };
    const bloque = (id, forma, claro, oscuro, corte, ic, lab) => `<g class="ali-sector" data-g="${id}">${dosTonos(forma, claro, oscuro, corte)}${ic}</g>${lab}`;
    const T = [[34, 140], [146, 226], [232, 318], [324, 420]];
    let s = fondo() + `<ellipse cx="380" cy="240" rx="330" ry="220" fill="url(#ali-halo)"/><ellipse cx="380" cy="430" rx="300" ry="14" fill="#05061a" opacity="0.5"/>`;
    // Punta: grasas y dulces.
    s += bloque('grasas', pol([[AX, AY], [xr(T[0][1]), T[0][1]], [xl(T[0][1]), T[0][1]]]), ...G.grasas.c, { x: AX },
      iconosEn(['golosina', 'aceite'], 78, 132, xl(110), xr(110)),
      etiqueta(xl(96) - 22, 92, G.grasas.corto, G.grasas.porc, 'end'));
    // Lácteos (izq.) y carnes (der.).
    s += bloque('lacteos', pol([[xl(T[1][0]), T[1][0]], [AX - 3, T[1][0]], [AX - 3, T[1][1]], [xl(T[1][1]), T[1][1]]]), G.lacteos.c[0], G.lacteos.c[0], { x: 999 },
      iconosEn(G.lacteos.iconos, T[1][0], T[1][1], xl(186) + 8, AX - 6), etiqueta(xl(186) - 18, 184, G.lacteos.corto, G.lacteos.porc, 'end'));
    s += bloque('carnes', pol([[AX + 3, T[1][0]], [xr(T[1][0]), T[1][0]], [xr(T[1][1]), T[1][1]], [AX + 3, T[1][1]]]), G.carnes.c[1], G.carnes.c[1], { x: 999 },
      iconosEn(G.carnes.iconos, T[1][0], T[1][1], AX + 6, xr(186) - 8), etiqueta(xr(186) + 18, 184, G.carnes.corto, G.carnes.porc, 'start'));
    // Verduras (izq.) y frutas (der.).
    s += bloque('verduras', pol([[xl(T[2][0]), T[2][0]], [AX - 3, T[2][0]], [AX - 3, T[2][1]], [xl(T[2][1]), T[2][1]]]), G.verduras.c[0], G.verduras.c[0], { x: 999 },
      iconosEn(G.verduras.iconos, T[2][0], T[2][1], xl(275) + 8, AX - 6), etiqueta(xl(275) - 18, 272, G.verduras.corto, G.verduras.porc, 'end'));
    s += bloque('frutas', pol([[AX + 3, T[2][0]], [xr(T[2][0]), T[2][0]], [xr(T[2][1]), T[2][1]], [AX + 3, T[2][1]]]), G.frutas.c[1], G.frutas.c[1], { x: 999 },
      iconosEn(G.frutas.iconos, T[2][0], T[2][1], AX + 6, xr(275) - 8), etiqueta(xr(275) + 18, 272, G.frutas.corto, G.frutas.porc, 'start'));
    // Base: cereales.
    s += bloque('cereales', pol([[xl(T[3][0]), T[3][0]], [xr(T[3][0]), T[3][0]], [xr(T[3][1]), T[3][1]], [xl(T[3][1]), T[3][1]]]), ...G.cereales.c, { x: AX },
      iconosEn(G.cereales.iconos, T[3][0], T[3][1], xl(372) + 14, xr(372) - 14), etiqueta(xl(372) - 18, 366, G.cereales.corto, G.cereales.porc, 'end'));
    s += `<path d="M${AX},${AY} L${xl(BY)},${BY}" stroke="#fff" stroke-width="3" opacity="0.28" stroke-linecap="round"/>`;
    s += `<text x="740" y="444" text-anchor="end" class="ali-pie">Pirámide de la guía alimentaria · EE. UU., 1992</text>`;
    return s;
  }

  function sectorAnillo(cx, cy, r0, r1, a0, a1) {
    const p = (r, a) => `${(cx + r * Math.cos(rad(a))).toFixed(1)},${(cy + r * Math.sin(rad(a))).toFixed(1)}`;
    const grande = a1 - a0 > 180 ? 1 : 0;
    return `M${p(r1, a0)} A${r1},${r1} 0 ${grande} 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 ${grande} 0 ${p(r0, a0)} Z`;
  }

  // ---------- Óvalo nutricional argentino ----------
  // Una pista azul que nace en una canilla (el agua) y se lee en sentido contrario a las agujas del reloj:
  // cereales, frutas y verduras, lácteos, carnes, aceites y azúcares. La pista y los grupos se achican
  // a lo largo del recorrido para sugerir las proporciones.
  const OVALO_POS = { cereales: 62, hortalizas: 6, lacteos: -40, carnes: -90, aceites: -130, azucares: -163 };
  const OVALO_ESC = { cereales: 1.55, hortalizas: 1.4, lacteos: 1.2, carnes: 0.85, aceites: 0.72, azucares: 0.62 };
  const OVALO_ICONOS = {
    cereales: ['arroz', 'legumbres', 'fideos', 'avena', 'choclo', 'pan', 'papa', 'batata', 'pan'],
    hortalizas: ['sandia', 'brocoli', 'uvas', 'zapallo', 'pera', 'tomate', 'zanahoria', 'lechuga', 'pimiento'],
    lacteos: ['queso', 'leche', 'yogur', 'leche', 'queso'],
    carnes: ['huevo', 'pollo', 'carne', 'pescado'], aceites: ['aceite', 'manteca', 'nueces'], azucares: ['golosina', 'galletita'],
  };
  const PILA = [[0, 0], [-26, 6], [26, 6], [-13, -15], [13, -15], [-39, -4], [39, -4], [0, -28], [-26, -26], [26, -26]];

  function dibujarOvalo() {
    const CX = 385, CY = 222, RX = 290, RY = 142;
    const P = a => [CX + RX * Math.cos(rad(a)), CY + RY * Math.sin(rad(a))];
    let s = fondo() + `<ellipse cx="${CX}" cy="${CY}" rx="${RX + 70}" ry="${RY + 90}" fill="url(#ali-halo)"/>`;
    // Pista: de la canilla hacia la derecha (sentido antihorario en pantalla), cada vez más angosta.
    const A0 = 128, A1 = -208;
    let pista = '', brillo = '', flechas = '';
    for (let a = A0; a > A1; a -= 2.5) {
      const t = (A0 - a) / (A0 - A1), [x0, y0] = P(a), [x1, y1] = P(a - 3);
      const w = 7 + 30 * (1 - t);
      const op = t > 0.9 ? Math.max(0, (1 - t) / 0.1) : t < 0.03 ? 0.5 + t / 0.06 : 1;
      pista += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="#1d4fb8" stroke-width="${w.toFixed(1)}" stroke-linecap="round" opacity="${op.toFixed(2)}"/>`;
      brillo += `<line x1="${x0.toFixed(1)}" y1="${(y0 - w * 0.22).toFixed(1)}" x2="${x1.toFixed(1)}" y2="${(y1 - w * 0.22).toFixed(1)}" stroke="#4d8dff" stroke-width="${(w * 0.42).toFixed(1)}" stroke-linecap="round" opacity="${op.toFixed(2)}"/>`;
    }
    // Flechas sobre la pista: indican el sentido de lectura.
    [108, 30, -18, -66, -112, -148, -186].forEach(a => {
      const [x, y] = P(a), [x2, y2] = P(a - 4), ang = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
      flechas += `<path d="M-5,-5 L3,0 L-5,5" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)})" stroke="#dbe9ff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
    });
    s += `<g opacity="0.55" transform="translate(6 10)">${pista.replace(/#1d4fb8/g, '#05061a')}</g>${pista}${brillo}${flechas}`;
    // Canilla con gotas: el agua inicia el recorrido.
    const [fx, fy] = P(A0);
    s += `<g class="ali-sector" data-g="agua"><circle cx="${fx - 14}" cy="${fy + 6}" r="40" fill="transparent"/>
      ${icono('canilla', fx - 30, fy - 8, 1.7)}<g class="ali-gotas">${[0, 1].map(i => `<path class="ali-gota" style="animation-delay:${i * 0.7}s" d="M${fx - 14},${fy + 20} c5,6 4,11 0,11 c-4,0 -5,-5 0,-11 Z" fill="#5cc8ff"/>`).join('')}</g></g>`;
    s += etiqueta(fx - 34, fy + 64, 'Agua', '1,5 a 2 litros por día', 'middle');
    // Grupos a lo largo de la pista (se dibujan de atrás hacia adelante).
    const grupos = OVALO.map(g => {
      const a = OVALO_POS[g.id], [x, y] = P(a);
      return { g, a, x, y, esc: OVALO_ESC[g.id] * (0.85 + 0.3 * (y - (CY - RY)) / (2 * RY)) };
    }).sort((u, v) => u.y - v.y);
    grupos.forEach(({ g, x, y, esc }) => {
      const ids = OVALO_ICONOS[g.id];
      const piezas = ids.map((id, i) => ({ id, x: x + PILA[i][0] * esc * 0.95, y: y - 10 * esc + PILA[i][1] * esc * 0.9 })).sort((u, v) => u.y - v.y);
      s += `<g class="ali-sector" data-g="${g.id}">
        <ellipse cx="${x + 4}" cy="${y + 8 * esc}" rx="${(34 + ids.length * 4) * esc}" ry="${9 * esc}" fill="#05061a" opacity="0.4"/>
        <circle cx="${x}" cy="${y - 14 * esc}" r="${(30 + ids.length * 3) * esc}" fill="transparent"/>
        ${piezas.map(p => icono(p.id, p.x, p.y, esc)).join('')}</g>`;
      // Rótulo junto a cada grupo, en el mismo lugar que en la gráfica original.
      const [dx, dy, ancla] = { cereales: [0, 34, 'middle'], hortalizas: [8, 46, 'middle'], lacteos: [0, -56, 'middle'], carnes: [0, -46, 'middle'], aceites: [0, -46, 'middle'], azucares: [-8, 34, 'end'] }[g.id];
      s += etiqueta(x + dx * esc, y + dy * esc, g.corto, '', ancla);
    });
    s += `<text x="${CX - 10}" y="${CY - 44}" text-anchor="middle" class="ali-centro">¿CÓMO SE LEE?</text>
      <text x="${CX - 10}" y="${CY - 24}" text-anchor="middle" class="ali-centro-txt">Desde el agua, en sentido contrario</text>
      <text x="${CX - 10}" y="${CY - 8}" text-anchor="middle" class="ali-centro-txt">a las agujas del reloj ↺,</text>
      <text x="${CX - 10}" y="${CY + 8}" text-anchor="middle" class="ali-centro-txt">de lo que más se come a lo que menos</text>
      <text x="740" y="448" text-anchor="end" class="ali-pie">Óvalo nutricional · Guías Alimentarias para la Población Argentina, 2000</text>`;
    return s;
  }

  // ---------- Plato: Gráfica de la Alimentación Diaria ----------
  // Mitad izquierda: verduras y frutas. Mitad derecha: franjas. Al centro, el agua. En el aro: actividad física y sal.
  const FRANJAS = [['cereales', -1], ['lacteos', -0.27], ['carnes', 0.21], ['aceites', 0.5], ['opcionales', 0.72]];
  const ROTULO_PLATO = {
    verduras: 'VERDURAS\nY FRUTAS', cereales: 'LEGUMBRES, CEREALES,\nPAPA, PAN Y PASTAS', lacteos: 'LECHE, YOGUR\nY QUESO',
    carnes: 'CARNES\nY HUEVOS', aceites: 'ACEITES, FRUTAS\nSECAS Y SEMILLAS', opcionales: 'OPCIONALES:\nDULCES Y GRASAS',
  };
  const PLATO_ICONOS = {
    verduras: ['brocoli', 'lechuga', 'zapallo', 'pimiento', 'tomate', 'zanahoria', 'sandia', 'pera', 'manzana', 'uvas', 'banana', 'naranja'],
    cereales: ['arroz', 'pan', 'legumbres', 'avena', 'fideos', 'papa', 'choclo'], lacteos: ['leche', 'yogur', 'queso'],
    carnes: ['pescado', 'carne', 'huevo', 'pollo'], aceites: ['nueces', 'semillas', 'aceite'], opcionales: ['golosina', 'galletita', 'gaseosa'],
  };
  let nPlato = 0;
  const arco = (cx, cy, r, a0, a1, sentido = 1) => {
    const p = a => `${(cx + r * Math.cos(rad(a))).toFixed(1)},${(cy + r * Math.sin(rad(a))).toFixed(1)}`;
    return `M${p(a0)} A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${sentido} ${p(a1)}`;
  };

  function geometriaPlato(cx, cy, R) {
    const div = -0.06 * R, rw = 0.27 * R, wx = cx + div, wy = cy - 0.02 * R;
    const franja = k => [cy + FRANJAS[k][1] * R, k + 1 < FRANJAS.length ? cy + FRANJAS[k + 1][1] * R : cy + R];
    const x0 = cx + div + 9;
    // Rótulos: arriba a la izquierda en las franjas anchas; a la izquierda y centrados en las angostas.
    const rotulos = {};
    FRANJAS.forEach(([id], k) => {
      const [y0, y1] = franja(k), lineas = ROTULO_PLATO[id].split('\n');
      const w = Math.max(...lineas.map(l => l.length)) * 5.6, alto = lineas.length * 11;
      // La franja de arriba es angosta cerca del borde: el rótulo va más abajo, donde el plato es más ancho.
      // La de los lácteos queda al lado del agua; la de los opcionales, arriba de todo en su franja.
      const angosta = y1 - y0 < 60;
      let x = x0, y = angosta ? (y0 + y1) / 2 - alto / 2 + 9 : y0 + 14;
      if (id === 'cereales') y = cy - R * 0.66;
      if (id === 'lacteos') { x = wx + rw + 10; y = y0 + 16; }
      if (id === 'opcionales') y = y0 + 13;
      rotulos[id] = { x, y, w, alto, lineas };
    });
    rotulos.verduras = { x: cx - R * 0.62, y: cy + R * 0.06, w: 60, alto: 22, lineas: ROTULO_PLATO.verduras.split('\n'), centrado: true };
    const dentroDeRotulo = (x, y) => Object.values(rotulos).some(r => {
      const rx0 = r.centrado ? r.x - r.w / 2 : r.x;
      return x > rx0 - 14 && x < rx0 + r.w + 14 && y > r.y - 20 && y < r.y + r.alto + 8;
    });
    const region = (x, y) => {
      if (Math.hypot(x - cx, y - cy) > R) return null;
      if (Math.hypot(x - wx, y - wy) < rw) return 'agua';
      if (x < cx + div) return 'verduras';
      const k = FRANJAS.findIndex((f, i) => y >= franja(i)[0] && y < franja(i)[1]);
      return k < 0 ? null : FRANJAS[k][0];
    };
    // Lugares para los alimentos: una grilla, lejos de los bordes, del agua y de los rótulos.
    const lugares = {};
    for (let y = cy - R + 18, fila = 0; y < cy + R - 8; y += R * 0.135, fila++) {
      for (let x = cx - R + 16 + (fila % 2) * R * 0.08; x < cx + R - 10; x += R * 0.16) {
        const r = region(x, y);
        if (!r || r === 'agua') continue;
        if (Math.hypot(x - cx, y - cy) > R - 17 || Math.hypot(x - wx, y - wy) < rw + 16 || Math.abs(x - (cx + div)) < 15 || dentroDeRotulo(x, y)) continue;
        if (r !== 'verduras') { const [y0, y1] = franja(FRANJAS.findIndex(f => f[0] === r)); if (y - y0 < 13 || y1 - y < 9) continue; }
        (lugares[r] = lugares[r] || []).push([x, y]);
      }
    }
    return { cx, cy, R, div, rw, wx, wy, franja, lugares, rotulos };
  }

  // Reparte los alimentos en los lugares de su región, de manera pareja.
  function repartir(G, region, ids, esc) {
    const L = G.lugares[region] || [];
    if (!L.length || !ids.length) return '';
    const orden = region === 'verduras' ? L.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0]) : L.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const n = Math.min(ids.length, orden.length);
    const usados = Array.from({ length: n }, (_, k) => orden[Math.floor((k + 0.5) * orden.length / n)]);
    return usados.map(([x, y], k) => ({ id: ids[k], x, y })).sort((a, b) => a.y - b.y)
      .map(p => `<ellipse cx="${p.x + 2}" cy="${p.y + 15 * esc}" rx="${15 * esc}" ry="${4 * esc}" fill="#05061a" opacity="0.25"/>${icono(p.id, p.x, p.y, esc)}`).join('');
  }

  function platoSVG(G, contenido, esc) {
    const { cx, cy, R, div, rw, wx, wy } = G, Ra = R * 1.2;
    const id = 'ali-pl' + (nPlato++);
    const colores = Object.fromEntries(PLATO.map(g => [g.id, g.c]));
    const rotulo = (gid) => {
      const r = G.rotulos[gid];
      return `<text class="ali-banda" text-anchor="${r.centrado ? 'middle' : 'start'}">${r.lineas.map((l, i) => `<tspan x="${r.x}" y="${r.y + i * 11}">${l}</tspan>`).join('')}</text>`;
    };
    let s = `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
        <path id="${id}-arr" d="${arco(cx, cy, (R + Ra) / 2 - 5, 200, 340)}"/><path id="${id}-aba" d="${arco(cx, cy, (R + Ra) / 2 + 6, 150, 30, 0)}"/></defs>
      <ellipse cx="${cx + 12}" cy="${cy + 20}" rx="${Ra + 4}" ry="${Ra}" fill="#05061a" opacity="0.5"/>
      ${dosTonos(`<circle cx="${cx}" cy="${cy}" r="${Ra}" fill="FILL"/>`, '#a3a9d1', '#7a81ad', { y: cy + Ra * 0.3 })}
      <path d="${arco(cx, cy, Ra - 4, 195, 300)}" stroke="#e1e4fa" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
      <g class="ali-sector" data-g="actividad"><path class="ali-aro-zona" d="${sectorAnillo(cx, cy, R + 4, Ra, 196, 344)}"/>
        <text class="ali-aro"><textPath href="#${id}-arr" startOffset="54%" text-anchor="middle">ACTIVIDAD FÍSICA</textPath></text>
        <g transform="translate(${cx + ((R + Ra) / 2) * Math.cos(rad(214))} ${cy + ((R + Ra) / 2) * Math.sin(rad(214))})"><circle r="${R * 0.07}" fill="#e1e4fa"/><path d="M${-R * 0.035},0 h${R * 0.07} M0,${-R * 0.035} v${R * 0.07}" stroke="#5a60a0" stroke-width="2.6" stroke-linecap="round"/></g></g>
      <g class="ali-sector" data-g="sal"><path class="ali-aro-zona" d="${sectorAnillo(cx, cy, R + 4, Ra, 64, 116)}"/>
        <text class="ali-aro"><textPath href="#${id}-aba" startOffset="44%" text-anchor="middle">SAL</textPath></text>
        <g transform="translate(${cx + ((R + Ra) / 2) * Math.cos(rad(107))} ${cy + ((R + Ra) / 2) * Math.sin(rad(107))})"><circle r="${R * 0.07}" fill="#e1e4fa"/><path d="M${-R * 0.035},0 h${R * 0.07}" stroke="#5a60a0" stroke-width="2.6" stroke-linecap="round"/></g></g>
      <circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="#3a3f72"/>
      <g clip-path="url(#${id})">`;
    // Verduras y frutas (mitad izquierda).
    const c = colores.verduras;
    s += `<g class="ali-sector" data-g="verduras">${dosTonos(`<rect x="${cx - R}" y="${cy - R}" width="${R + div}" height="${2 * R}" fill="FILL"/>`, c[0], c[1], { y: cy + R * 0.35 })}${repartir(G, 'verduras', contenido('verduras'), esc)}${rotulo('verduras')}</g>`;
    // Franjas de la mitad derecha.
    FRANJAS.forEach(([gid], k) => {
      const [y0, y1] = G.franja(k), col = colores[gid];
      s += `<g class="ali-sector" data-g="${gid}">${dosTonos(`<rect x="${cx + div}" y="${y0}" width="${R - div}" height="${y1 - y0}" fill="FILL"/>`, col[0], col[1], { y: y0 + (y1 - y0) * 0.66 })}
        <rect x="${cx + div}" y="${y0}" width="${R - div}" height="2.5" fill="#fff" opacity="0.35"/>${repartir(G, gid, contenido(gid), esc)}${rotulo(gid)}</g>`;
    });
    // Separaciones, sombra interior del borde y agua al centro.
    s += FRANJAS.slice(1).map(([, f]) => `<line x1="${cx + div}" x2="${cx + R}" y1="${cy + f * R}" y2="${cy + f * R}" stroke="#2b2f63" stroke-width="3.5"/>`).join('')
      + `<line x1="${cx + div}" x2="${cx + div}" y1="${cy - R}" y2="${cy + R}" stroke="#2b2f63" stroke-width="4"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#000" stroke-width="16" opacity="0.2"/></g>
      <g class="ali-sector" data-g="agua"><circle cx="${wx}" cy="${wy}" r="${rw + 9}" fill="#5cc8ff" opacity="0.22"/><circle cx="${wx}" cy="${wy}" r="${rw + 4}" fill="#2b2f63"/>
        ${dosTonos(`<circle cx="${wx}" cy="${wy}" r="${rw}" fill="FILL"/>`, '#3fb8f5', '#2396db', { y: wy + rw * 0.25 })}
        <path d="${arco(wx, wy, rw - 6, 200, 260)}" stroke="#bfe8ff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>
        ${icono('canilla', wx - rw * 0.12, wy - rw * 0.32, rw / 34)}
        <text x="${wx + rw * 0.05}" y="${wy + rw * 0.52}" text-anchor="middle" class="ali-agua-txt" style="font-size:${(rw * 0.3).toFixed(1)}px">AGUA</text></g>`;
    return s;
  }

  function dibujarPlato() {
    const G = geometriaPlato(380, 222, 172);
    return fondo() + `<ellipse cx="380" cy="222" rx="300" ry="230" fill="url(#ali-halo)"/>` + platoSVG(G, gid => PLATO_ICONOS[gid] || [], 0.8)
      + `<text x="740" y="450" text-anchor="end" class="ali-pie">Gráfica de la Alimentación Diaria · Guías Alimentarias para la Población Argentina, 2016</text>`;
  }

  // ---------- Ficha del grupo seleccionado ----------
  function pintarInfo() {
    const info = raiz.querySelector('#ali-info');
    const lista = modo === 'piramide' ? PIRAMIDE : modo === 'ovalo' ? OVALO : PLATO;
    const extras = modo === 'plato' ? EXTRAS_PLATO : modo === 'ovalo' ? EXTRAS_OVALO : {};
    const g = sel && (lista.find(x => x.id === sel) || (extras[sel] && { id: sel, ...extras[sel] }));
    if (!g) {
      const intro = {
        piramide: `<h2>🔺 Pirámide nutricional</h2>
          <p>Creada en <b>Estados Unidos en 1992</b>. Ordena los alimentos en pisos: los de la <b>base</b> se deben comer en mayor cantidad y los de la <b>punta</b>, muy poco.</p>
          <p>Fue muy usada en todo el mundo, pero recibió críticas: ponía todas las harinas en la base sin distinguir las integrales, y todas las grasas en la punta, sin separar los aceites saludables. En 2011 Estados Unidos la reemplazó por un plato (<i>MyPlate</i>).</p>`,
        ovalo: `<h2>🥚 Óvalo nutricional</h2>
          <p>Fue la gráfica de las <b>Guías Alimentarias para la Población Argentina del año 2000</b>. Sugiere una variedad de alimentos cotidianos, que se adecuan a nuestra cultura y costumbres, y que aportan los nutrientes necesarios para una alimentación completa y saludable.</p>
          <p><b>¿Cómo se lee?</b> El recorrido empieza en la <b>canilla</b>, porque el agua es la base de todo, y sigue en <b>sentido contrario a las agujas del reloj</b>: cereales y legumbres → frutas y verduras → lácteos → carnes y huevos → aceites y grasas → azúcares.</p>
          <p>El orden y el tamaño sugieren las <b>proporciones</b>: los primeros grupos, más grandes, se comen en mayor cantidad; los últimos, más chicos, en menor cantidad.</p>`,
        plato: `<h2>🍽️ Gráfica de la Alimentación Diaria</h2>
          <p>Es la gráfica actual de las <b>Guías Alimentarias para la Población Argentina (Ministerio de Salud, 2016)</b>. Tiene forma de <b>plato</b> para imaginar las proporciones en cada comida.</p>
          <p>¿Cómo se lee? La <b>mitad izquierda</b> son verduras y frutas; la otra mitad se divide en franjas que van de mayor a menor: legumbres y cereales, lácteos, carnes y huevos, aceites y semillas, y los opcionales. En el <b>centro está el agua</b>, y el aro recuerda sumar <b>actividad física (+)</b> y reducir la <b>sal (−)</b>.</p>
          <h3>Los 10 mensajes de las Guías</h3>
          <ol class="ali-mensajes">${MENSAJES.map(m => `<li>${m}</li>`).join('')}</ol>`,
      }[modo];
      info.innerHTML = intro + '<p class="ali-ayuda">👆 Toca un grupo del dibujo para ver qué nutrientes aporta y para qué sirve.</p>';
      return;
    }
    const ejemplos = ALIMENTOS.filter(a => (modo === 'plato' ? a.g === g.id : false)).slice(0, 8);
    info.innerHTML = `
      <h2><i class="ali-punto" style="background:${g.c[0]}"></i>${g.n}</h2>
      ${g.porc ? `<p class="ali-porc">${g.porc}</p>` : ''}
      <p>${g.x}</p>
      ${g.nut && g.nut.length ? `<h3>Nutrientes principales</h3><div class="ali-chips">${g.nut.map(n => `<span>${n}</span>`).join('')}</div>` : ''}
      ${g.fun && g.fun.length ? `<h3>Función</h3>${g.fun.map(f => `<p class="ali-funcion">${FUNCIONES[f]}</p>`).join('')}` : ''}
      ${g.msg ? `<div class="ali-msg"><b>Mensaje ${g.msg} de las Guías</b><p>${MENSAJES[g.msg - 1]}</p></div>` : ''}
      ${ejemplos.length ? `<h3>Ejemplos</h3><div class="ali-ejemplos">${ejemplos.map(a => `<span>${miniIcono(a.id, 26)}${a.n}</span>`).join('')}</div>` : ''}
      ${g.iconos && !ejemplos.length ? `<div class="ali-ejemplos">${g.iconos.map(id => `<span>${miniIcono(id, 30)}</span>`).join('')}</div>` : ''}`;
  }

  // ---------- Comparar los tres modelos ----------
  function vistaComparar() {
    const fila = (t, a, b, c) => `<tr><th>${t}</th><td>${a}</td><td>${b}</td><td>${c}</td></tr>`;
    raiz.querySelector('#ali-vista').innerHTML = `
      <div class="ali-comp">
        ${[['piramide', '🔺 Pirámide nutricional'], ['ovalo', '🥚 Óvalo nutricional'], ['plato', '🍽️ Plato argentino']].map(([m, t]) => `
          <button class="panel ali-mini" data-m="${m}"><h2>${t}</h2><svg viewBox="0 0 760 460" aria-hidden="true">${dibujo(m, false)}</svg></button>`).join('')}
      </div>
      <div class="panel">
        <div class="tabla-scroll"><table class="ali-tabla">
          <thead><tr><th></th><th>🔺 Pirámide</th><th>🥚 Óvalo</th><th>🍽️ Plato</th></tr></thead>
          <tbody>
            ${fila('Origen', 'Estados Unidos, 1992', 'Argentina, 2000', 'Argentina, Ministerio de Salud, 2016')}
            ${fila('Forma', 'Pisos: la base se come más y la punta, poco', 'Un óvalo en perspectiva: lo más cercano y grande se come en mayor cantidad', 'Un plato: mitad verduras y frutas; la otra mitad en franjas')}
            ${fila('Qué transmite', 'Una jerarquía entre los alimentos', 'Variedad y proporción, sin jerarquías', 'Proporciones en el plato y hábitos saludables')}
            ${fila('Grupos', '6 (verduras y frutas separadas)', '6, más el agua', '6, con el agua en el centro')}
            ${fila('Papa, legumbres', 'Papa con las verduras; legumbres con las carnes', 'Legumbres con los cereales', 'Papa, batata, choclo, mandioca y legumbres con los cereales')}
            ${fila('Grasas', 'Todas juntas en la punta', 'Aceites y grasas en un mismo grupo', 'Aceites, frutas secas y semillas por un lado; manteca y grasas de consumo opcional')}
            ${fila('Agua', 'No aparece', 'La canilla inicia el recorrido: 1,5 a 2 litros por día', 'En el centro del plato: 8 vasos de agua segura')}
            ${fila('Actividad física', 'No aparece', 'En sus mensajes', 'En el aro del plato (+): 30 minutos por día')}
            ${fila('Sal', 'No aparece', 'En sus mensajes', 'En el aro del plato (−): reducir la sal y el sodio')}
          </tbody></table></div>
        <p class="ali-ayuda">💡 Las guías cambian a medida que la ciencia aprende más sobre nutrición y según los alimentos y costumbres de cada país. Las tres coinciden en lo esencial: <b>comer variado</b>, mucha <b>verdura y fruta</b> y poco <b>azúcar, grasa y sal</b>. Toca un dibujo para explorarlo.</p>
      </div>`;
    raiz.querySelectorAll('.ali-mini').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
  }

  // ---------- Actividad: Armá tu día ----------
  const DIA_EJEMPLO = ['leche', 'pan', 'banana', 'tomate', 'lechuga', 'pollo', 'arroz', 'aceite', 'manzana', 'yogur', 'avena', 'zanahoria', 'legumbres', 'huevo', 'queso', 'naranja', 'nueces'];

  function vistaDia() {
    dia = dia || { elegidos: [], vasos: 0, evaluado: false };
    raiz.querySelector('#ali-vista').innerHTML = `
      <div class="ali-grid">
        <div class="panel ali-escena">
          <svg id="ali-dia-svg" viewBox="0 0 760 420" role="img" aria-label="Lo que comiste en el día"></svg>
          <div class="ali-alimentos" id="ali-alimentos">${ALIMENTOS.map(a => `<button data-a="${a.id}" title="${a.n}">${miniIcono(a.id, 34)}<span>${a.n}</span></button>`).join('')}
            <button data-a="agua" title="Vaso de agua">${miniIcono('agua', 34)}<span>Vaso de agua</span></button></div>
          <div class="bm-acciones">
            <button class="btn chico" id="ali-deshacer">↩ Quitar el último</button>
            <button class="btn chico" id="ali-vaciar">🗑 Empezar de nuevo</button>
            <button class="btn chico" id="ali-ejemplo">✨ Ver un día equilibrado</button>
            <button class="btn chico primario" id="ali-evaluar">¿Cómo quedó mi día?</button>
          </div>
        </div>
        <aside class="panel ali-info">
          <h2>🧑‍🍳 Armá tu día</h2>
          <p>Toca los alimentos que comerías en <b>un día completo</b> (desayuno, almuerzo, merienda y cena). Cada toque es <b>una porción</b>. Intenta seguir la Gráfica de la Alimentación Diaria.</p>
          <div id="ali-barras"></div>
          <div id="ali-eval"></div>
          <p class="ali-ayuda">Cantidades orientativas para un adolescente; las necesidades cambian según la edad y la actividad.</p>
        </aside>
      </div>`;
    raiz.querySelectorAll('#ali-alimentos button').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.a === 'agua') dia.vasos = Math.min(12, dia.vasos + 1);
      else if (dia.elegidos.length < 30) dia.elegidos.push(b.dataset.a);
      dia.evaluado = false;
      pintarDia();
    }));
    raiz.querySelector('#ali-deshacer').addEventListener('click', () => { dia.elegidos.pop(); dia.evaluado = false; pintarDia(); });
    raiz.querySelector('#ali-vaciar').addEventListener('click', () => { dia = { elegidos: [], vasos: 0, evaluado: false }; pintarDia(); });
    raiz.querySelector('#ali-ejemplo').addEventListener('click', () => { dia = { elegidos: DIA_EJEMPLO.slice(), vasos: 8, evaluado: true }; pintarDia(); });
    raiz.querySelector('#ali-evaluar').addEventListener('click', () => { dia.evaluado = true; pintarDia(); });
    pintarDia();
  }

  const cuenta = () => Object.fromEntries(PLATO.map(g => [g.id, dia.elegidos.filter(id => ALIMENTOS.find(a => a.id === id).g === g.id).length]));

  function pintarDia() {
    const c = cuenta();
    // El mismo plato de la gráfica, con los alimentos elegidos en su sector.
    const G = geometriaPlato(230, 206, 148);
    const elegidosDe = gid => dia.elegidos.filter(id => ALIMENTOS.find(x => x.id === id).g === gid);
    let s = `<defs><radialGradient id="ali-fondo-d" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#272b78"/><stop offset="1" stop-color="#0c0e30"/></radialGradient></defs>
      <rect width="760" height="420" rx="14" fill="url(#ali-fondo-d)"/>` + platoSVG(G, elegidosDe, 0.66);
    // Vasos de agua.
    s += `<text x="470" y="46" class="ali-etq">Agua: ${dia.vasos} de 8 vasos</text>`;
    for (let k = 0; k < 8; k++) {
      const x = 486 + (k % 4) * 60, y = 96 + Math.floor(k / 4) * 62;
      s += k < dia.vasos ? icono('agua', x, y, 1.1) : `<g transform="translate(${x} ${y}) scale(1.1)"><path d="M-12,-17 L12,-17 L9,17 L-9,17 Z" fill="none" stroke="#5a60b8" stroke-width="2" stroke-dasharray="4 3"/></g>`;
    }
    const total = dia.elegidos.length;
    s += `<text x="470" y="240" class="ali-etq">Porciones elegidas: ${total}</text>
      <text x="470" y="262" class="ali-etq-sub">Las verduras y frutas deberían ocupar</text><text x="470" y="276" class="ali-etq-sub">el sector más grande del plato.</text>
      <g transform="translate(560 340)">${total ? PLATO.map((g, i) => `<rect x="${-90 + i * 32}" y="${-(c[g.id] / Math.max(5, ...Object.values(c))) * 60}" width="26" height="${(c[g.id] / Math.max(5, ...Object.values(c))) * 60 + 0.1}" rx="4" fill="${g.c[0]}"/>
        <text x="${-77 + i * 32}" y="16" text-anchor="middle" class="ali-etq-sub">${c[g.id]}</text>`).join('') : '<text x="0" y="-20" text-anchor="middle" class="ali-etq-sub">Toca alimentos para llenar el plato</text>'}</g>`;
    raiz.querySelector('#ali-dia-svg').innerHTML = s;
    // Barras de progreso por grupo.
    raiz.querySelector('#ali-barras').innerHTML = PLATO.map(g => {
      const n = c[g.id], obj = OBJETIVO[g.id], op = g.id === 'opcionales';
      const estado = op ? (n <= obj ? 'ok' : 'mal') : n < obj ? 'falta' : n <= obj + 1 ? 'ok' : 'mal';
      return `<div class="ali-barra ${estado}"><div class="ali-barra-cab"><span><i class="ali-punto" style="background:${g.c[0]}"></i>${g.corto}</span><b>${n} ${op ? `(máx. ${obj})` : `/ ${obj}`}</b></div>
        <div class="ali-barra-fondo"><div style="width:${Math.min(100, n / Math.max(obj, 1) * 100)}%;background:${g.c[0]}"></div></div></div>`;
    }).join('') + `<div class="ali-barra ${dia.vasos >= 8 ? 'ok' : 'falta'}"><div class="ali-barra-cab"><span><i class="ali-punto" style="background:#5cc8ff"></i>Agua</span><b>${dia.vasos} / 8 vasos</b></div>
      <div class="ali-barra-fondo"><div style="width:${Math.min(100, dia.vasos / 8 * 100)}%;background:#5cc8ff"></div></div></div>`;
    raiz.querySelector('#ali-eval').innerHTML = dia.evaluado ? evaluarDia(c) : '';
  }

  function evaluarDia(c) {
    const consejos = [];
    let bien = 0;
    PLATO.forEach(g => {
      const n = c[g.id], obj = OBJETIVO[g.id];
      if (g.id === 'opcionales') {
        if (n <= obj) bien++;
        else consejos.push(`🍭 Elegiste ${n} alimentos de <b>consumo opcional</b>. Tienen mucha azúcar, grasa o sal: conviene limitarlos a uno por día como máximo.`);
      } else if (n < obj) consejos.push(`➕ Te ${obj - n === 1 ? 'falta 1 porción' : `faltan ${obj - n} porciones`} de <b>${g.n.toLowerCase()}</b>. ${g.id === 'verduras' ? 'Sumá una fruta en la merienda o una ensalada en la cena.' : g.id === 'lacteos' ? 'Un vaso de leche o un yogur en el desayuno ayudan.' : ''}`);
      else if (n > obj + 1) consejos.push(`➖ Te pasaste con <b>${g.n.toLowerCase()}</b> (${n} porciones). ${g.id === 'cereales' ? 'Cambiá una porción de harinas por verduras.' : g.id === 'carnes' ? 'Una porción de carne del tamaño de la palma de la mano alcanza.' : g.id === 'aceites' ? 'Aportan mucha energía: con poco alcanza.' : ''}`);
      else bien++;
    });
    if (dia.vasos >= 8) bien++; else consejos.push(`💧 Tomaste ${dia.vasos} vasos de agua: faltan ${8 - dia.vasos}. El agua es la mejor bebida.`);
    const total = PLATO.length + 1;
    return `<div class="feedback ${bien === total ? 'ok' : 'mal'}"><p class="fb-titulo">${bien === total ? '🎉 ¡Día equilibrado!' : `📋 ${bien} de ${total} grupos en equilibrio`}</p>
      ${consejos.length ? `<ul class="lista-repaso">${consejos.map(x => `<li>${x}</li>`).join('')}</ul>` : '<p>Comiste de todos los grupos en las proporciones recomendadas y tomaste suficiente agua. ¡No te olvides de los 30 minutos de actividad física! 🏃</p>'}</div>`;
  }

  // ---------- Actividad: ¿A qué grupo pertenece? ----------
  function vistaGrupos() {
    juego = { lista: Util.tomar('ali-grupos', ALIMENTOS, 10, x => x.id), i: 0, puntos: 0, errores: [] };
    raiz.querySelector('#ali-vista').innerHTML = `
      <div class="ali-juego">
        <div class="panel">
          <div class="marcador"><span id="ali-prog"></span><span id="ali-pts"></span></div>
          <div class="barra"><div id="ali-barra"></div></div>
          <div id="ali-juego"></div>
        </div>
      </div>`;
    mostrarAlimento();
  }

  function marcadorJuego() {
    raiz.querySelector('#ali-prog').textContent = `Alimento ${Math.min(juego.i + 1, juego.lista.length)} de ${juego.lista.length}`;
    raiz.querySelector('#ali-pts').textContent = `⭐ ${juego.puntos}`;
    raiz.querySelector('#ali-barra').style.width = (juego.i / juego.lista.length * 100) + '%';
  }

  function mostrarAlimento() {
    marcadorJuego();
    const a = juego.lista[juego.i];
    raiz.querySelector('#ali-juego').innerHTML = `
      <div class="ali-tarjeta"><svg viewBox="-60 -50 120 100" width="190" height="160" aria-hidden="true"><circle r="46" fill="#1f2256"/><circle r="46" fill="none" stroke="#3a3e85" stroke-width="2"/><g transform="scale(2)">${ICONOS[a.id]()}</g></svg><p class="caso-texto">${a.n}</p></div>
      <p class="bm-pregunta">¿En qué grupo de la Gráfica de la Alimentación Diaria va?</p>
      <div class="ali-opciones">${PLATO.map(g => `<button class="btn-opcion ali-op" data-g="${g.id}"><i class="ali-punto" style="background:${g.c[0]}"></i>${g.n}</button>`).join('')}</div>
      <div id="ali-fb"></div>`;
    raiz.querySelectorAll('.ali-op').forEach(b => b.addEventListener('click', () => responder(b.dataset.g)));
  }

  function responder(g) {
    const a = juego.lista[juego.i], ok = g === a.g;
    if (ok) juego.puntos++; else juego.errores.push(a);
    raiz.querySelectorAll('.ali-op').forEach(b => {
      b.disabled = true;
      if (b.dataset.g === a.g) b.classList.add('correcta');
      else if (b.dataset.g === g) b.classList.add('incorrecta');
    });
    const ultimo = juego.i === juego.lista.length - 1;
    raiz.querySelector('#ali-fb').innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'mal'}"><p class="fb-titulo">${ok ? '✅ ¡Correcto!' : `❌ Va en: ${NOMBRE_GRUPO[a.g]}`}</p><p>${a.x}</p>
        <button class="btn primario" id="ali-sig">${ultimo ? 'Ver resultados' : 'Siguiente →'}</button></div>`;
    raiz.querySelector('#ali-pts').textContent = `⭐ ${juego.puntos}`;
    raiz.querySelector('#ali-sig').addEventListener('click', () => {
      juego.i++;
      if (juego.i < juego.lista.length) return mostrarAlimento();
      marcadorJuego();
      raiz.querySelector('#ali-juego').innerHTML = `
        <div class="resultado-final">
          <div class="emoji-grande">${juego.puntos >= 7 ? '🎉' : '📚'}</div>
          <p class="puntaje-final">${juego.puntos} / ${juego.lista.length}</p>
          ${juego.errores.length ? `<ul class="lista-repaso">${juego.errores.map(e => `<li><b>${e.n}</b> → ${NOMBRE_GRUPO[e.g]}. ${e.x}</li>`).join('')}</ul>` : '<p>¡Perfecto! 🏆</p>'}
          <button class="btn primario" id="ali-otra">Jugar otra ronda</button>
        </div>`;
      raiz.querySelector('#ali-otra').addEventListener('click', vistaGrupos);
    });
  }

  // Los alimentos ilustrados también se usan en otras secciones.
  return { iniciar, alimento: icono };
})();
