// Química · Mezclas homogéneas y heterogéneas: verlas al microscopio, clasificarlas y elegir cómo separarlas.
const Mezclas = (function () {
  const { dosTonos, ojo, esfera, estrellas, tono } = Arte;
  const W = 760, H = 420;
  const V = { x0: 110, x1: 300, y0: 120, y1: 360 }; // interior del vaso
  const L = { x: 562, y: 212, r: 148 }; // lupa

  // ---------- Partículas (dibujadas centradas en x, y, con un giro a) ----------
  const rot = (x, y, a, dx, dy) => [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)];
  const poli = (x, y, a, r, n, irreg, semilla) => Array.from({ length: n }, (_, k) => {
    const ang = a + k * 2 * Math.PI / n, rr = r * (1 - irreg * ((semilla * 7 + k * 13) % 10) / 10);
    return `${(x + rr * Math.cos(ang)).toFixed(1)},${(y + rr * Math.sin(ang)).toFixed(1)}`;
  }).join(' ');
  const PART = {
    agua: (x, y, a) => { const [h1x, h1y] = rot(x, y, a, -5, 4), [h2x, h2y] = rot(x, y, a, 5, 4); return esfera(h1x, h1y, 2.7, '#f1f3f5') + esfera(h2x, h2y, 2.7, '#f1f3f5') + esfera(x, y, 4.4, '#ff6b6b'); },
    na: (x, y) => esfera(x, y, 3.8, '#b197fc'),
    cl: (x, y) => esfera(x, y, 5.4, '#69db7c'),
    azucar: (x, y, a, s) => `<polygon points="${poli(x, y, a, 8, 6, 0, s)}" fill="#fff3bf" stroke="#e9c46a" stroke-width="1.5"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#fff" opacity="0.8"/>`,
    alcohol: (x, y, a) => { const [ax, ay] = rot(x, y, a, -7, 0), [bx, by] = rot(x, y, a, 7, 0); return esfera(ax, ay, 4.2, '#5c636a') + esfera(x, y, 4.2, '#5c636a') + esfera(bx, by, 3.8, '#ff6b6b'); },
    acido: (x, y, a) => { const [ax, ay] = rot(x, y, a, -6, 0), [bx, by] = rot(x, y, a, 6, -4), [cx, cy] = rot(x, y, a, 6, 5); return esfera(ax, ay, 4, '#5c636a') + esfera(x, y, 4, '#5c636a') + esfera(bx, by, 3.4, '#ff6b6b') + esfera(cx, cy, 3.4, '#ff6b6b'); },
    aceite: (x, y, a) => Array.from({ length: 6 }, (_, k) => { const [px, py] = rot(x, y, a, (k - 2.5) * 6, k % 2 ? 3 : -3); return esfera(px, py, 3.6, '#ffd43b'); }).join(''),
    arena: (x, y, a, s) => `<polygon points="${poli(x, y, a, 13, 7, 0.35, s)}" fill="#d4a373"/><polygon points="${poli(x - 1, y - 1, a, 8, 6, 0.3, s + 1)}" fill="#e9c891" opacity="0.7"/>`,
    piedra: (x, y, a, s) => `<polygon points="${poli(x, y, a, 26, 9, 0.22, s)}" fill="#868e96"/><polygon points="${poli(x - 4, y - 5, a, 15, 8, 0.2, s + 2)}" fill="#adb5bd" opacity="0.8"/>`,
    hierro: (x, y, a) => { const [ax, ay] = rot(x, y, a, -9, 0), [bx, by] = rot(x, y, a, 9, 0); return `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#495057" stroke-width="5.5" stroke-linecap="round"/><line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#ced4da" stroke-width="2.4" stroke-linecap="round"/>`; },
    n2: (x, y, a) => { const [ax, ay] = rot(x, y, a, -4, 0), [bx, by] = rot(x, y, a, 4, 0); return esfera(ax, ay, 4, '#74c0fc') + esfera(bx, by, 4, '#74c0fc'); },
    o2: (x, y, a) => { const [ax, ay] = rot(x, y, a, -4, 0), [bx, by] = rot(x, y, a, 4, 0); return esfera(ax, ay, 4, '#ff8787') + esfera(bx, by, 4, '#ff8787'); },
    cobre: (x, y) => esfera(x, y, 9, '#e8590c'),
    estano: (x, y) => esfera(x, y, 9, '#ced4da'),
    arcilla: (x, y, a, s) => `<polygon points="${poli(x, y, a, 7, 5, 0.3, s)}" fill="#8d5a3b"/>`,
    burbuja: (x, y, a) => `<circle cx="${x}" cy="${y}" r="17" fill="#e7f5ff" fill-opacity="0.12" stroke="#e7f5ff" stroke-width="1.6" opacity="0.9"/>${PART.co2(x, y, a)}<path d="M${x - 9},${y - 9} a12,12 0 0 1 7,-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    co2: (x, y, a) => { const [ax, ay] = rot(x, y, a, -6, 0), [bx, by] = rot(x, y, a, 6, 0); return esfera(ax, ay, 3.2, '#ff6b6b') + esfera(bx, by, 3.2, '#ff6b6b') + esfera(x, y, 3.8, '#343a40'); },
    pulpa: (x, y, a) => { const [ax, ay] = rot(x, y, a, -12, 0), [bx, by] = rot(x, y, a, 12, 0); return `<path d="M${ax},${ay} Q${x},${y - 9} ${bx},${by} Q${x},${y + 5} ${ax},${ay} Z" fill="#ffa94d" stroke="#e8590c" stroke-width="1.2"/>`; },
    cuarzo: (x, y, a, s) => `<polygon points="${poli(x, y, a, 30, 6, 0.25, s)}" fill="#e9ecef"/><polygon points="${poli(x - 5, y - 5, a, 14, 5, 0.2, s)}" fill="#fff" opacity="0.7"/>`,
    feldespato: (x, y, a, s) => `<polygon points="${poli(x, y, a, 30, 5, 0.25, s)}" fill="#f783ac"/><polygon points="${poli(x - 5, y - 5, a, 14, 5, 0.2, s)}" fill="#faa2c1" opacity="0.8"/>`,
    mica: (x, y, a, s) => `<polygon points="${poli(x, y, a, 22, 6, 0.3, s)}" fill="#212529"/><line x1="${x - 8}" y1="${y - 4}" x2="${x + 8}" y2="${y - 6}" stroke="#868e96" stroke-width="1.5"/>`,
    banana: (x, y, a) => `<circle cx="${x}" cy="${y}" r="24" fill="#ffe066" stroke="#fab005" stroke-width="3"/>${[0, 1, 2].map(k => { const [px, py] = rot(x, y, a + k * 2.1, 9, 0); return `<circle cx="${px}" cy="${py}" r="2.2" fill="#5c3d1e"/>`; }).join('')}`,
    frutilla: (x, y, a) => `<path d="M${x},${y + 24} C${x - 26},${y + 4} ${x - 22},${y - 20} ${x},${y - 16} C${x + 22},${y - 20} ${x + 26},${y + 4} ${x},${y + 24} Z" fill="#fa5252"/>${[[-8, -4], [7, -2], [0, 8], [-4, 14], [9, 10]].map(([dx, dy]) => `<ellipse cx="${x + dx}" cy="${y + dy}" rx="1.6" ry="2.4" fill="#ffe066"/>`).join('')}`,
    kiwi: (x, y, a) => `<circle cx="${x}" cy="${y}" r="24" fill="#94d82d" stroke="#5c940d" stroke-width="3"/><circle cx="${x}" cy="${y}" r="7" fill="#f4fce3"/>${Array.from({ length: 10 }, (_, k) => { const [px, py] = rot(x, y, a + k * 0.63, 12, 0); return `<ellipse cx="${px}" cy="${py}" rx="1.6" ry="1" fill="#212529"/>`; }).join('')}`,
  };
  const TAM = { agua: 9, na: 5, cl: 6, azucar: 9, alcohol: 12, acido: 10, aceite: 18, arena: 14, piedra: 27, hierro: 10, n2: 9, o2: 9, cobre: 10, estano: 10, arcilla: 8, burbuja: 19, co2: 9, pulpa: 13, cuarzo: 28, feldespato: 28, mica: 22, banana: 25, frutilla: 25, kiwi: 25 };
  const NOMBRE_PART = { agua: 'agua', na: 'sodio (de la sal)', cl: 'cloro (de la sal)', azucar: 'azúcar', alcohol: 'alcohol', acido: 'ácido acético', aceite: 'aceite', arena: 'arena', piedra: 'piedra', hierro: 'hierro', n2: 'nitrógeno', o2: 'oxígeno', cobre: 'cobre', estano: 'estaño', arcilla: 'barro (arcilla)', burbuja: 'burbuja de CO₂', co2: 'dióxido de carbono', pulpa: 'pulpa', cuarzo: 'cuarzo', feldespato: 'feldespato', mica: 'mica', banana: 'banana', frutilla: 'frutilla', kiwi: 'kiwi' };

  // ---------- Mezclas ----------
  // vaso: capas de abajo hacia arriba [alto (0-1), color, opacidad, motas]; obj: dibujo propio para sólidos.
  // lupa: regiones [x0, y0, x1, y1] (de 0 a 1) con su fondo y sus partículas.
  const AGUA = '#1c3a6e';
  const MEZCLAS = [
    { id: 'salmuera', n: 'Agua con sal', e: '🧂', tipo: 'homo', comp: ['agua', 'sal'], fases: 1, sep: 'evaporacion',
      vaso: { capas: [[0.75, '#a5d8ff', 0.55]] }, foco: 0.4,
      lupa: [{ r: [0, 0, 1, 1], fondo: AGUA, items: [['agua', 24], ['na', 7], ['cl', 7]] }],
      x: 'La sal se <b>disuelve</b>: sus partículas se reparten entre las del agua. No se ven ni con un microscopio común: hay <b>una sola fase</b>. Es una <b>solución</b>.' },
    { id: 'azucar', n: 'Agua con azúcar', e: '🍬', tipo: 'homo', comp: ['agua', 'azúcar'], fases: 1, sep: 'evaporacion',
      vaso: { capas: [[0.7, '#d0ebff', 0.55]] }, foco: 0.4,
      lupa: [{ r: [0, 0, 1, 1], fondo: AGUA, items: [['agua', 26], ['azucar', 8]] }],
      x: 'El azúcar se disuelve en el agua y queda repartido de forma pareja. Se ve todo igual: <b>una sola fase</b>.' },
    { id: 'alcohol', n: 'Agua y alcohol', e: '🧴', tipo: 'homo', comp: ['agua', 'alcohol'], fases: 1, sep: 'destilacion',
      vaso: { capas: [[0.7, '#e7f5ff', 0.5]] }, foco: 0.4,
      lupa: [{ r: [0, 0, 1, 1], fondo: AGUA, items: [['agua', 20], ['alcohol', 11]] }],
      x: 'El agua y el alcohol se mezclan en cualquier proporción y no se pueden distinguir: <b>una sola fase</b>.' },
    { id: 'vinagre', n: 'Vinagre', e: '🫙', tipo: 'homo', comp: ['agua', 'ácido acético'], fases: 1, sep: 'destilacion',
      vaso: { capas: [[0.72, '#ffe8a3', 0.6]] }, foco: 0.4,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#3a3420', items: [['agua', 24], ['acido', 7]] }],
      x: 'El vinagre es agua con un poco de <b>ácido acético</b> disuelto. Se ve igual en todas partes: es una solución.' },
    { id: 'aire', n: 'Aire', e: '💨', tipo: 'homo', comp: ['nitrógeno', 'oxígeno', 'otros gases'], fases: 1, sep: 'destilacion',
      vaso: { capas: [[1, '#d0ebff', 0.12]], frasco: true }, foco: 0.55,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#151a3d', items: [['n2', 16], ['o2', 5]] }],
      x: 'El aire es una mezcla de gases: casi 4 de cada 5 partículas son de <b>nitrógeno</b> y 1 de <b>oxígeno</b>. Están repartidas parejo: es homogénea. Se separa enfriándolo mucho hasta hacerlo líquido y destilándolo.' },
    { id: 'bronce', n: 'Bronce', e: '🥉', tipo: 'homo', comp: ['cobre', 'estaño'], fases: 1, sep: null,
      obj: 'medalla', foco: 0.5,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#3d2414', red: true, items: [['cobre', 30], ['estano', 6]] }],
      x: 'El bronce es una <b>aleación</b>: cobre y estaño fundidos juntos. Al enfriarse, los átomos quedan mezclados de forma pareja. ¡Las soluciones también pueden ser sólidas!' },
    { id: 'aceite', n: 'Agua y aceite', e: '🫒', tipo: 'hetero', comp: ['agua', 'aceite'], fases: 2, sep: 'decantacion',
      vaso: { capas: [[0.45, '#a5d8ff', 0.6], [0.25, '#ffd43b', 0.85]] }, foco: 0.45,
      lupa: [{ r: [0, 0, 1, 0.46], fondo: '#5a4a10', items: [['aceite', 9]] }, { r: [0, 0.46, 1, 1], fondo: AGUA, items: [['agua', 20]] }],
      x: 'El aceite no se mezcla con el agua: queda <b>arriba</b> porque es menos denso. Se ven <b>dos fases</b> y el límite entre ellas.' },
    { id: 'arena', n: 'Agua y arena', e: '🏖️', tipo: 'hetero', comp: ['agua', 'arena'], fases: 2, sep: 'filtracion',
      vaso: { capas: [[0.2, '#d4a373', 1, ['#b08968', '#e9c891']], [0.5, '#a5d8ff', 0.55]] }, foco: 0.2,
      lupa: [{ r: [0, 0, 1, 0.5], fondo: AGUA, items: [['agua', 16]] }, { r: [0, 0.5, 1, 1], fondo: '#3d2b1a', items: [['arena', 9], ['agua', 5]] }],
      x: 'La arena no se disuelve: se va al fondo. Se distinguen a simple vista <b>dos fases</b>: el agua y la arena.' },
    { id: 'barro', n: 'Agua con barro', e: '🟤', tipo: 'hetero', comp: ['agua', 'arcilla'], fases: 2, sep: 'filtracion',
      vaso: { capas: [[0.1, '#8d5a3b', 1], [0.62, '#b08968', 0.75, ['#8d5a3b']]] }, foco: 0.45,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#2e2418', items: [['agua', 18], ['arcilla', 14]] }],
      x: 'El agua queda turbia: tiene pedacitos de barro que flotan (una <b>suspensión</b>). Con el tiempo se van al fondo. Se distinguen los componentes: es heterogénea.' },
    { id: 'gaseosa', n: 'Gaseosa con burbujas', e: '🥤', tipo: 'hetero', comp: ['agua con azúcar', 'gas (CO₂)'], fases: 2, sep: null,
      vaso: { capas: [[0.75, '#5c3d2e', 0.85]], burbujas: 14 }, foco: 0.45,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#2a1a12', items: [['burbuja', 4], ['agua', 18], ['azucar', 4]] }],
      x: 'La parte líquida es una solución, pero las <b>burbujas</b> de gas se ven: hay <b>dos fases</b> (líquido y gas). Por eso, con burbujas, es heterogénea.' },
    { id: 'jugo', n: 'Jugo de naranja con pulpa', e: '🍊', tipo: 'hetero', comp: ['jugo', 'pulpa'], fases: 2, sep: 'filtracion',
      vaso: { capas: [[0.72, '#ffa94d', 0.85, ['#e8590c', '#ffd8a8']]] }, foco: 0.45,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#5a2e0a', items: [['pulpa', 5], ['agua', 18], ['azucar', 4]] }],
      x: 'Los pedacitos de <b>pulpa</b> se ven a simple vista y no se disuelven. Un colador (filtro) los separa del jugo.' },
    { id: 'hierro', n: 'Arena con limaduras de hierro', e: '🧲', tipo: 'hetero', comp: ['arena', 'hierro'], fases: 2, sep: 'imantacion',
      vaso: { capas: [[0.35, '#d4a373', 1, ['#495057', '#495057', '#e9c891']]] }, foco: 0.2,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#2a1f14', items: [['arena', 10], ['hierro', 10]] }],
      x: 'Mirando con atención se distinguen los granos de arena y las limaduras de hierro: cada uno conserva su aspecto. Es heterogénea.' },
    { id: 'piedras', n: 'Arena con piedras', e: '🪨', tipo: 'hetero', comp: ['arena', 'piedras'], fases: 2, sep: 'tamizacion',
      vaso: { capas: [[0.4, '#d4a373', 1, ['#868e96', '#868e96', '#e9c891']]] }, foco: 0.2,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#2a1f14', items: [['piedra', 4], ['arena', 12]] }],
      x: 'Las piedras son mucho más grandes que los granos de arena: se distinguen a simple vista. Un tamiz deja pasar la arena y retiene las piedras.' },
    { id: 'granito', n: 'Granito', e: '🪨', tipo: 'hetero', comp: ['cuarzo', 'feldespato', 'mica'], fases: 3, sep: null,
      obj: 'roca', foco: 0.5,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#495057', items: [['cuarzo', 6], ['feldespato', 6], ['mica', 5]] }],
      x: 'El granito es una roca formada por tres minerales que se ven a simple vista: el <b>cuarzo</b> (gris claro), el <b>feldespato</b> (rosado) y la <b>mica</b> (negra). Tres fases.' },
    { id: 'ensalada', n: 'Ensalada de frutas', e: '🥗', tipo: 'hetero', comp: ['banana', 'frutilla', 'kiwi', 'jugo'], fases: 4, sep: 'tria',
      obj: 'bol', foco: 0.5,
      lupa: [{ r: [0, 0, 1, 1], fondo: '#4a2a3a', items: [['banana', 3], ['frutilla', 3], ['kiwi', 3]] }],
      x: 'Cada fruta se ve y se puede sacar con la mano o un tenedor. Es una mezcla heterogénea con varias fases.' },
  ];
  const POR_ID = Object.fromEntries(MEZCLAS.map(m => [m.id, m]));

  // ---------- Métodos de separación (con su dibujo) ----------
  const METODOS = {
    filtracion: { n: 'Filtración', e: '☕', d: 'Se pasa la mezcla por un papel de filtro (o colador): el líquido pasa y el sólido queda retenido.', clase: 'fases' },
    decantacion: { n: 'Decantación', e: '⚗️', d: 'Se deja reposar: el componente más denso queda abajo y se separan las capas (con una ampolla de decantación).', clase: 'fases' },
    imantacion: { n: 'Imantación', e: '🧲', d: 'Un imán atrae el hierro y deja la arena.', clase: 'fases' },
    tamizacion: { n: 'Tamización', e: '🕸️', d: 'Un tamiz (colador de malla) deja pasar los granos chicos y retiene los grandes.', clase: 'fases' },
    tria: { n: 'Tría', e: '🤏', d: 'Se separan los componentes a mano o con una pinza, porque se ven y son grandes.', clase: 'fases' },
    evaporacion: { n: 'Evaporación', e: '♨️', d: 'Se calienta: el agua se evapora y el sólido disuelto queda en el recipiente.', clase: 'fraccion' },
    destilacion: { n: 'Destilación', e: '🔥', d: 'Se calienta: el componente que hierve primero se evapora, se enfría en un tubo y se junta en otro recipiente.', clase: 'fraccion' },
  };
  function dibujoMetodo(id) {
    const vidrio = '#d0ebff';
    const llama = (x, y) => `<path d="M${x},${y - 30} C${x - 14},${y - 12} ${x - 10},${y} ${x},${y} C${x + 10},${y} ${x + 14},${y - 12} ${x},${y - 30} Z" fill="#ff922b"/><path d="M${x},${y - 18} C${x - 6},${y - 8} ${x - 4},${y} ${x},${y} C${x + 4},${y} ${x + 6},${y - 8} ${x},${y - 18} Z" fill="#ffe066"/>`;
    const D = {
      filtracion: () => `<path d="M-60,-70 L60,-70 L8,0 V30 H-8 V0 Z" fill="${vidrio}" fill-opacity="0.25" stroke="${vidrio}" stroke-width="3"/>
        <path d="M-48,-64 L48,-64 L0,-6 Z" fill="#f8f9fa"/><path d="M-30,-56 L30,-56 L12,-36 L-12,-36 Z" fill="#b08968"/>
        ${[0, 1, 2].map(i => `<circle cx="0" cy="${44 + i * 12}" r="3.5" fill="#74c0fc"/>`).join('')}
        <path d="M-40,70 V110 Q-40,120 -30,120 H30 Q40,120 40,110 V70" fill="none" stroke="${vidrio}" stroke-width="3"/><rect x="-37" y="92" width="74" height="26" rx="6" fill="#74c0fc" opacity="0.7"/>`,
      decantacion: () => `<path d="M0,-80 V-66 M-8,-66 H8 L42,-10 C52,30 30,56 0,60 C-30,56 -52,30 -42,-10 Z" fill="${vidrio}" fill-opacity="0.2" stroke="${vidrio}" stroke-width="3"/>
        <path d="M-46,8 C-50,30 -28,54 0,56 C28,54 50,30 46,8 Z" fill="#74c0fc" opacity="0.8"/><path d="M-40,-14 L40,-14 L46,8 L-46,8 Z" fill="#ffd43b" opacity="0.9"/>
        <path d="M0,60 V100" stroke="${vidrio}" stroke-width="4"/><rect x="-10" y="74" width="20" height="8" rx="3" fill="#e03131"/>
        <circle cx="0" cy="${108}" r="4" fill="#74c0fc"/>`,
      imantacion: () => `<g transform="translate(0 -30)">${dosTonos('<path d="M-46,-40 V10 A46,46 0 0 0 46,10 V-40 H22 V10 A22,22 0 0 1 -22,10 V-40 Z" fill="FILL"/>', '#ff6b6b', '#c92a2a', { x: 0 })}
        <rect x="-46" y="-52" width="24" height="14" fill="#dee2e6"/><rect x="22" y="-52" width="24" height="14" fill="#dee2e6"/></g>
        ${Array.from({ length: 9 }, (_, i) => `<line x1="${-30 + i * 7}" y1="${36 + (i % 3) * 4}" x2="${-24 + i * 7}" y2="${28 + (i % 2) * 6}" stroke="#495057" stroke-width="3" stroke-linecap="round"/>`).join('')}
        <path d="M-70,100 Q0,80 70,100 V112 H-70 Z" fill="#d4a373"/>`,
      tamizacion: () => `<ellipse cx="0" cy="-20" rx="70" ry="22" fill="#868e96"/><ellipse cx="0" cy="-24" rx="62" ry="17" fill="#343a40"/>
        <g opacity="0.6">${Array.from({ length: 9 }, (_, i) => `<line x1="${-56 + i * 14}" y1="-38" x2="${-56 + i * 14}" y2="-10" stroke="#adb5bd" stroke-width="1"/>`).join('')}</g>
        ${[[-24, -30], [10, -32], [32, -26], [-6, -24]].map(([x, y], i) => PART.piedra(x, y, i, i + 3).replace(/26/g, '11')).join('')}
        ${Array.from({ length: 14 }, (_, i) => `<circle cx="${-40 + (i * 37) % 80}" cy="${10 + (i * 23) % 60}" r="2.4" fill="#e9c891"/>`).join('')}
        <path d="M-60,100 Q0,84 60,100 V110 H-60 Z" fill="#d4a373"/>`,
      tria: () => `<ellipse cx="0" cy="60" rx="80" ry="22" fill="#e9ecef"/><ellipse cx="0" cy="56" rx="70" ry="16" fill="#f8f9fa"/>
        ${PART.banana(-34, 46, 0).replace(/r="24"/, 'r="16"')}${PART.kiwi(30, 50, 0).replace(/r="24"/, 'r="16"')}
        <path d="M60,-80 L8,10 M70,-74 L14,14" stroke="#adb5bd" stroke-width="6" stroke-linecap="round"/>${PART.frutilla(10, 8, 0).replace(/24/g, '14')}`,
      evaporacion: () => `<path d="M-60,-10 Q0,40 60,-10 Z" fill="#f1f3f5"/><path d="M-50,-4 Q0,30 50,-4 Z" fill="#74c0fc" opacity="0.5"/>
        ${[[-16, 4], [0, 10], [16, 4], [-6, -2], [10, -1]].map(([x, y]) => `<rect x="${x - 3}" y="${y - 3}" width="6" height="6" fill="#fff" stroke="#adb5bd" transform="rotate(20 ${x} ${y})"/>`).join('')}
        ${[-20, 0, 20].map(x => `<path d="M${x},-24 q-8,-14 0,-28 q8,-14 0,-28" stroke="#e7f5ff" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/>`).join('')}
        <path d="M-50,30 L-62,90 M50,30 L62,90" stroke="#8f96b8" stroke-width="4"/>${llama(0, 96)}`,
      destilacion: () => `<circle cx="-54" cy="0" r="34" fill="${vidrio}" fill-opacity="0.2" stroke="${vidrio}" stroke-width="3"/><path d="M-84,10 A32,32 0 0 0 -24,10 Z" fill="#74c0fc" opacity="0.7"/>
        <path d="M-54,-34 V-56 L60,-6" stroke="${vidrio}" stroke-width="5" fill="none"/><path d="M-20,-38 L40,-12" stroke="#4dabf7" stroke-width="16" opacity="0.35" stroke-linecap="round"/>
        <path d="M60,-6 V20" stroke="${vidrio}" stroke-width="5"/><circle cx="60" cy="${30}" r="3.5" fill="#74c0fc"/>
        <path d="M38,44 V80 Q38,88 46,88 H74 Q82,88 82,80 V44" fill="none" stroke="${vidrio}" stroke-width="3"/><rect x="41" y="66" width="38" height="20" rx="4" fill="#74c0fc" opacity="0.7"/>
        ${llama(-54, 80)}`,
    };
    return (D[id] || (() => ''))();
  }

  // ---------- Escena ----------
  function semillas(m) {
    // Posiciones fijas (pseudoaleatorias) de las partículas dentro de cada región de la lupa.
    let s = m.id.length * 97 + 13;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const lista = [];
    m.lupa.forEach((reg, ri) => {
      const [x0, y0, x1, y1] = reg.r, X = u => L.x - L.r + u * 2 * L.r, Y = v => L.y - L.r + v * 2 * L.r;
      if (reg.red) {
        // Red cristalina (metales): una grilla con los átomos mezclados.
        const tipos = reg.items.flatMap(([t, n]) => Array(n).fill(t)).sort(() => rnd() - 0.5);
        let k = 0;
        for (let fy = 0; fy < 9; fy++) for (let fx = 0; fx < 9; fx++) {
          const x = X(0.06 + fx * 0.112 + (fy % 2) * 0.056), y = Y(0.08 + fy * 0.105);
          if (Math.hypot(x - L.x, y - L.y) < L.r - 6) lista.push({ t: tipos[k++ % tipos.length], x, y, a: 0, s: k, f: rnd() * 6, vib: 0.8 });
        }
        return;
      }
      reg.items.forEach(([t, n]) => {
        for (let i = 0; i < n; i++) {
          let x, y, ok = false;
          for (let intento = 0; intento < 40 && !ok; intento++) {
            x = X(x0 + rnd() * (x1 - x0)); y = Y(y0 + rnd() * (y1 - y0));
            const margen = TAM[t] + 4;
            ok = Math.hypot(x - L.x, y - L.y) < L.r - margen * 0.6 && y > Y(y0) + TAM[t] * 0.5 && y < Y(y1) - TAM[t] * 0.5 &&
              lista.every(p => Math.hypot(p.x - x, p.y - y) > (TAM[p.t] + TAM[t]) * 0.62);
          }
          if (ok) lista.push({ t, x, y, a: rnd() * 6.28, s: i + 1, f: rnd() * 6, vib: TAM[t] > 20 ? 0.6 : 2.2, reg: ri });
        }
      });
    });
    return lista;
  }

  function vaso(m) {
    const { x0, x1, y0, y1 } = V, w = x1 - x0, h = y1 - y0;
    if (m.obj === 'roca') return `<g>${dosTonos(`<path d="M${x0 - 10},${y1} L${x0 + 10},${y0 + 90} L${x0 + 70},${y0 + 50} L${x1 - 20},${y0 + 70} L${x1 + 10},${y1} Z" fill="FILL"/>`, '#adb5bd', '#868e96', { x: x0 + 120 })}
      ${Array.from({ length: 70 }, (_, i) => { const x = x0 + 8 + (i * 53) % (w - 10), y = y0 + 100 + (i * 37) % 130; return `<rect x="${x}" y="${y}" width="${5 + i % 4}" height="${4 + i % 3}" fill="${['#f783ac', '#212529', '#f1f3f5'][i % 3]}" transform="rotate(${i * 23} ${x} ${y})"/>`; }).join('')}</g>`;
    if (m.obj === 'medalla') return `<path d="M${x0 + 60},${y0 - 20} L${x0 + 85},${y0 + 90} M${x1 - 60},${y0 - 20} L${x1 - 85},${y0 + 90}" stroke="#4dabf7" stroke-width="14"/>
      <circle cx="${(x0 + x1) / 2}" cy="${y0 + 160}" r="80" fill="#a0522d"/>${dosTonos(`<circle cx="${(x0 + x1) / 2}" cy="${y0 + 160}" r="72" fill="FILL"/>`, '#cd7f32', '#a86426', { x: (x0 + x1) / 2 + 10 })}
      <text x="${(x0 + x1) / 2}" y="${y0 + 176}" text-anchor="middle" class="mz-medalla">3</text><path d="M${x0 + 40},${y0 + 120} a70,70 0 0 1 40,-35" stroke="#ffe8cc" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>`;
    if (m.obj === 'bol') return `<path d="M${x0 - 20},${y0 + 110} Q${(x0 + x1) / 2},${y1 + 50} ${x1 + 20},${y0 + 110} Z" fill="#e9ecef"/><ellipse cx="${(x0 + x1) / 2}" cy="${y0 + 110}" rx="${w / 2 + 20}" ry="22" fill="#d6336c" opacity="0.5"/>
      ${[[0.15, 'banana'], [0.35, 'frutilla'], [0.55, 'kiwi'], [0.75, 'banana'], [0.28, 'kiwi'], [0.62, 'frutilla']].map(([u, t], i) => PART[t](x0 + u * w, y0 + 100 - (i > 3 ? 18 : 0), i).replace(/r="24"/g, 'r="18"')).join('')}
      <path d="M${x0 - 20},${y0 + 110} Q${(x0 + x1) / 2},${y1 + 50} ${x1 + 20},${y0 + 110}" fill="none" stroke="#adb5bd" stroke-width="3"/>`;
    let s = '', base = y1;
    m.vaso.capas.forEach(([fr, color, op, motas], i) => {
      const alto = fr * h, top = base - alto;
      s += `<rect x="${x0}" y="${top}" width="${w}" height="${alto}" fill="${color}" opacity="${op}" ${i === 0 ? `rx="14"` : ''}/>`;
      if (motas) s += Array.from({ length: Math.round(alto * 0.6) }, (_, k) => { const u = (Math.sin(k * 12.9898) * 43758.5453) % 1, v = (Math.sin(k * 78.233) * 12345.678) % 1; return `<circle cx="${(x0 + 8 + Math.abs(u) * (w - 16)).toFixed(1)}" cy="${(top + 5 + Math.abs(v) * Math.max(2, alto - 10)).toFixed(1)}" r="${2 + k % 2}" fill="${motas[k % motas.length]}"/>`; }).join('');
      s += `<ellipse cx="${(x0 + x1) / 2}" cy="${top}" rx="${w / 2}" ry="6" fill="${tono(color, 0.3)}" opacity="${Math.min(1, op + 0.15)}"/>`;
      base = top;
    });
    if (m.vaso.burbujas) s += Array.from({ length: m.vaso.burbujas }, (_, k) => `<circle cx="${x0 + 14 + (k * 41) % (w - 28)}" cy="${y1 - 10 - (k * 53) % (h * 0.7)}" r="${2 + k % 3}" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.7"/>`).join('');
    const borde = m.vaso.frasco
      ? `<path d="M${x0},${y0 + 30} Q${x0},${y0} ${x0 + 40},${y0 - 6} V${y0 - 40} H${x1 - 40} V${y0 - 6} Q${x1},${y0} ${x1},${y0 + 30} V${y1 - 14} Q${x1},${y1} ${x1 - 14},${y1} H${x0 + 14} Q${x0},${y1} ${x0},${y1 - 14} Z" fill="none" stroke="#e7f5ff" stroke-width="4"/><rect x="${x0 + 34}" y="${y0 - 56}" width="${w - 68}" height="18" rx="5" fill="#868e96"/>`
      : `<path d="M${x0 - 8},${y0 - 8} H${x0} V${y1 - 14} Q${x0},${y1} ${x0 + 14},${y1} H${x1 - 14} Q${x1},${y1} ${x1},${y1 - 14} V${y0 - 8} H${x1 + 8}" fill="none" stroke="#e7f5ff" stroke-width="4" stroke-linejoin="round"/>`;
    return s + borde + `<path d="M${x0 + 14},${y0 + 10} V${y1 - 24}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.3"/>`;
  }
  const focoXY = m => [m.obj ? (V.x0 + V.x1) / 2 : V.x0 + (V.x1 - V.x0) * 0.62, V.y1 - (V.y1 - V.y0) * m.foco];

  function escenaFija(m) {
    const [fx, fy] = focoXY(m), rf = 16;
    const a = Math.atan2(L.y - fy, L.x - fx), d = Math.hypot(L.x - fx, L.y - fy), b = Math.acos((rf - L.r) / d);
    const t = [a + b, a - b].map(k => [[fx + rf * Math.cos(k), fy + rf * Math.sin(k)], [L.x + L.r * Math.cos(k), L.y + L.r * Math.sin(k)]]);
    return `<defs>
        <radialGradient id="mz-fondo" cx="0.4" cy="0.4" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <clipPath id="mz-clip"><circle cx="${L.x}" cy="${L.y}" r="${L.r - 3}"/></clipPath>
      </defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#mz-fondo)"/>${estrellas(26, W, H)}
      <rect x="0" y="${V.y1 + 4}" width="${W}" height="${H - V.y1 - 4}" fill="#2d3178"/><rect x="0" y="${V.y1 + 4}" width="${W}" height="5" fill="#4a50a8"/>
      <ellipse cx="${(V.x0 + V.x1) / 2 + 8}" cy="${V.y1 + 8}" rx="120" ry="10" fill="#05061a" opacity="0.45"/>
      ${vaso(m)}
      <path d="M${t[0][0]} L${t[0][1]} L${t[1][1]} L${t[1][0]} Z" fill="#b197fc" opacity="0.08"/>
      <path d="M${t[0][0]} L${t[0][1]} M${t[1][0]} L${t[1][1]}" stroke="#c9b8ff" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.6"/>
      <circle cx="${fx}" cy="${fy}" r="${rf}" fill="#b197fc" fill-opacity="0.15" stroke="#e5dbff" stroke-width="2.4"/>
      <circle cx="${L.x + 7}" cy="${L.y + 9}" r="${L.r}" fill="#05061a" opacity="0.45"/>
      <text x="${(V.x0 + V.x1) / 2}" y="${V.y1 + 40}" text-anchor="middle" class="mz-rotulo">A SIMPLE VISTA</text>
      <text x="${L.x}" y="${L.y + L.r + 30}" text-anchor="middle" class="mz-rotulo">🔍 CON UN MICROSCOPIO</text>`;
  }

  // ---------- Estado ----------
  let raiz, modo = 'ver', sel = 'salmuera', part = [], lupa = 'mezcla', quiz = null, bucle = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🥣 Mezclas homogéneas y heterogéneas</h1>
        <p>Una <b>mezcla</b> tiene dos o más sustancias juntas. Si se ve <b>igual en todas partes</b> (una sola fase) es <b>homogénea</b>; si se distinguen sus partes (dos o más <b>fases</b>) es <b>heterogénea</b>.</p>
      </div>
      <div class="segmentado" id="mz-modos">
        <button data-m="ver">🔍 Al microscopio</button>
        <button data-m="clasificar">❓ ¿Homogénea o heterogénea?</button>
        <button data-m="separar">🧪 ¿Cómo la separo?</button>
      </div>
      <div class="nu-grid">
        <div class="panel nu-escena"><div class="nx-scroll"><svg id="mz-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Una mezcla a simple vista y al microscopio"><g id="mz-fijo"></g><g id="mz-lupa"></g></svg></div>
          <div id="mz-controles"></div></div>
        <aside class="panel nu-info" id="mz-info"></aside>
      </div>`;
    raiz.querySelectorAll('#mz-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    cambiarModo('ver');
    const loop = t => { if (!raiz.hidden) dibujarLupa(t / 1000); bucle = requestAnimationFrame(loop); };
    bucle = requestAnimationFrame(loop);
  }

  function cambiarModo(m) {
    modo = m;
    raiz.querySelectorAll('#mz-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    if (m === 'ver') vistaVer();
    else empezarQuiz(m);
  }

  function mostrar(id, comoLupa) {
    sel = id;
    lupa = comoLupa;
    const m = POR_ID[id];
    part = semillas(m);
    raiz.querySelector('#mz-fijo').innerHTML = escenaFija(m);
  }

  function dibujarLupa(t) {
    const g = raiz.querySelector('#mz-lupa');
    if (!g) return;
    const m = POR_ID[sel];
    const marco = `<circle cx="${L.x}" cy="${L.y}" r="${L.r}" fill="none" stroke="#e5dbff" stroke-width="6"/>
      <path d="M${L.x - L.r * 0.72},${L.y - L.r * 0.5} a${L.r - 14},${L.r - 14} 0 0 1 ${L.r * 0.5},${-L.r * 0.4}" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.4"/>`;
    if (lupa === 'oculta') {
      g.innerHTML = `<circle cx="${L.x}" cy="${L.y}" r="${L.r}" fill="#17153f"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${L.x + Math.cos(t * 0.6 + i) * 60}" cy="${L.y + Math.sin(t * 0.8 + i * 2) * 50}" r="${16 + i * 3}" fill="#b197fc" opacity="0.08"/>`).join('')}
        <text x="${L.x}" y="${L.y + 32}" text-anchor="middle" class="tr-incognita">?</text>${marco}`;
      return;
    }
    if (lupa === 'metodo') {
      const k = m.sep;
      g.innerHTML = `<circle cx="${L.x}" cy="${L.y}" r="${L.r}" fill="#1f2256"/><g transform="translate(${L.x} ${L.y - 6}) scale(0.95)">${dibujoMetodo(k)}</g>
        <g transform="translate(${L.x} ${L.y + L.r - 24})"><rect x="-70" y="-14" width="140" height="28" rx="14" fill="#ffd166"/><text y="5" text-anchor="middle" class="mz-metodo">${METODOS[k].e} ${METODOS[k].n}</text></g>${marco}`;
      return;
    }
    let fondo = '';
    m.lupa.forEach(reg => {
      const [x0, y0, x1, y1] = reg.r;
      fondo += `<rect x="${L.x - L.r + x0 * 2 * L.r}" y="${L.y - L.r + y0 * 2 * L.r}" width="${(x1 - x0) * 2 * L.r}" height="${(y1 - y0) * 2 * L.r}" fill="${reg.fondo}"/>`;
    });
    if (m.lupa.length > 1) m.lupa.slice(1).forEach(reg => { const y = L.y - L.r + reg.r[1] * 2 * L.r; fondo += `<path d="M${L.x - L.r},${y} H${L.x + L.r}" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5" opacity="0.7"/>`; });
    const ps = part.map(p => {
      const x = p.x + Math.sin(t * 2 + p.f) * p.vib, y = p.y + Math.cos(t * 1.7 + p.f * 1.3) * p.vib;
      return PART[p.t](x, y, p.a + Math.sin(t + p.f) * 0.15, p.s);
    }).join('');
    g.innerHTML = `<g clip-path="url(#mz-clip)">${fondo}${ps}</g>${marco}
      ${m.lupa.length > 1 ? `<g transform="translate(${L.x + L.r - 8} ${L.y - L.r + 22})"><rect x="-58" y="-12" width="66" height="22" rx="11" fill="#12143a" opacity="0.9"/><text x="-25" y="4" text-anchor="middle" class="mz-fase">${m.fases} fases</text></g>` : ''}`;
  }

  // ---------- 1. Al microscopio ----------
  function vistaVer() {
    raiz.querySelector('#mz-controles').innerHTML = `<div class="nu-viajeros">${MEZCLAS.map(m => `<button data-id="${m.id}">${m.e} ${m.n}</button>`).join('')}</div>`;
    raiz.querySelectorAll('#mz-controles [data-id]').forEach(b => b.addEventListener('click', () => { mostrar(b.dataset.id, 'mezcla'); pintarVer(); }));
    mostrar(sel, 'mezcla');
    pintarVer();
  }

  function pintarVer() {
    const m = POR_ID[sel], homo = m.tipo === 'homo';
    raiz.querySelectorAll('#mz-controles [data-id]').forEach(b => b.classList.toggle('activo', b.dataset.id === sel));
    const tiposVistos = [...new Set(m.lupa.flatMap(r => r.items.map(i => i[0])))];
    raiz.querySelector('#mz-info').innerHTML = `<h2>${m.e} ${m.n}</h2>
      <span class="nv-sello ${homo ? '' : 'vida'}">${homo ? '🟦 Mezcla homogénea' : '🧩 Mezcla heterogénea'}</span>
      <p>${m.x}</p>
      <div class="mz-datos"><div><b>${m.fases}</b><span>fase${m.fases > 1 ? 's' : ''}</span></div><div><b>${m.comp.length}</b><span>componentes</span></div></div>
      <h3>Componentes</h3><div class="nu-chips">${m.comp.map(c => `<span>${c}</span>`).join('')}</div>
      <h3>En la lupa se ven</h3><div class="mz-ley">${tiposVistos.map(t => `<span><svg viewBox="-16 -16 32 32" width="26" height="26">${PART[t](0, 0, 0.4, 1).replace(/r="(2[0-9]|3[0-9])"/g, 'r="13"')}</svg>${NOMBRE_PART[t]}</span>`).join('')}</div>
      ${m.sep ? `<p class="nv-clave">🧪 <b>¿Cómo se separa?</b> ${METODOS[m.sep].e} ${METODOS[m.sep].n}: ${METODOS[m.sep].d}</p>` : ''}
      <details class="md-ayudas"><summary>📚 Para recordar</summary>
        <p><b>Fase:</b> cada parte de una mezcla que se ve igual en todos sus puntos.</p>
        <p><b>Homogénea:</b> una sola fase. Las <b>soluciones</b> (como el agua con sal) son homogéneas: tienen un <b>solvente</b> (el agua) y un <b>soluto</b> (la sal).</p>
        <p><b>Heterogénea:</b> dos o más fases que se distinguen a simple vista o con una lupa.</p>
        <p>Las heterogéneas se separan con métodos de <b>separación de fases</b> (filtración, decantación, tamización, imantación, tría). Las homogéneas, con métodos de <b>fraccionamiento</b> (evaporación, destilación).</p></details>`;
  }

  // ---------- 2 y 3. Preguntas ----------
  const RONDA = { clasificar: 8, separar: 6 };
  function empezarQuiz(tipo) {
    const lista = tipo === 'separar' ? MEZCLAS.filter(m => m.sep) : MEZCLAS;
    quiz = { tipo, preguntas: Util.tomar('mezclas-' + tipo, lista, RONDA[tipo], m => m.id), i: 0, aciertos: 0, resp: null };
    raiz.querySelector('#mz-controles').innerHTML = '';
    pintarQuiz();
  }

  function pintarQuiz() {
    const info = raiz.querySelector('#mz-info'), n = quiz.preguntas.length;
    if (quiz.i >= n) {
      info.innerHTML = `<h2>🏁 Resultado</h2><div class="feedback ${quiz.aciertos >= n * 0.75 ? 'ok' : 'mal'}"><p class="fb-titulo">${quiz.aciertos >= n * 0.75 ? '🏆' : '💪'} ${quiz.aciertos} de ${n} correctas</p>
        <p>${quiz.tipo === 'separar' ? 'Recordá: las heterogéneas se separan por <b>separación de fases</b>; las homogéneas, por <b>fraccionamiento</b>.' : 'Recordá: si se ve igual en todas partes, es <b>homogénea</b>; si se distinguen partes, es <b>heterogénea</b>.'}</p></div>
        <button class="btn primario" id="mz-otra">Otra ronda</button>`;
      info.querySelector('#mz-otra').addEventListener('click', () => empezarQuiz(quiz.tipo));
      return;
    }
    const m = quiz.preguntas[quiz.i], hay = quiz.resp !== null;
    let opciones, ok, pregunta;
    if (quiz.tipo === 'clasificar') {
      mostrar(m.id, hay ? 'mezcla' : 'oculta');
      opciones = [['homo', '🟦 Homogénea'], ['hetero', '🧩 Heterogénea']];
      ok = m.tipo;
      pregunta = '¿Es una mezcla homogénea o heterogénea?';
    } else {
      mostrar(m.id, hay ? 'metodo' : 'mezcla');
      if (!quiz.opciones || quiz.opcionesDe !== quiz.i) {
        quiz.opciones = Util.mezclar([m.sep, ...Util.mezclar(Object.keys(METODOS).filter(k => k !== m.sep)).slice(0, 3)]);
        quiz.opcionesDe = quiz.i;
      }
      opciones = quiz.opciones.map(k => [k, `${METODOS[k].e} ${METODOS[k].n}`]);
      ok = m.sep;
      pregunta = '¿Con qué método separarías sus componentes?';
    }
    const bien = quiz.resp === ok, M = METODOS[m.sep];
    info.innerHTML = `<div class="md-cab"><span>Mezcla ${quiz.i + 1} de ${n}</span><span>⭐ ${quiz.aciertos}</span></div>
      <div class="barra"><div style="width:${quiz.i / n * 100}%"></div></div>
      <p class="nx-caso">${m.e} <b>${m.n}</b></p><p class="nu-pregunta">${pregunta}</p>
      ${quiz.tipo === 'clasificar' && !hay ? '<p class="nu-ayuda">Mirá el vaso «a simple vista». Al responder vas a ver cómo es por dentro.</p>' : ''}
      <div class="nu-opciones">${opciones.map(([k, t]) => `<button class="btn-opcion${hay ? (k === ok ? ' correcta' : k === quiz.resp ? ' incorrecta' : '') : ''}" data-r="${k}" ${hay ? 'disabled' : ''}>${t}</button>`).join('')}</div>
      ${hay ? `<div class="feedback ${bien ? 'ok' : 'mal'}"><p class="fb-titulo">${bien ? '✅ ¡Correcto!' : '✖ No es así'}</p>
        <p>${quiz.tipo === 'clasificar' ? `Es <b>${m.tipo === 'homo' ? 'homogénea' : 'heterogénea'}</b> (${m.fases} fase${m.fases > 1 ? 's' : ''}). ${m.x}` : `<b>${M.n}:</b> ${M.d} ${M.clase === 'fraccion' ? 'Como es homogénea, hace falta un método de <b>fraccionamiento</b>.' : 'Como es heterogénea, alcanza con un método de <b>separación de fases</b>.'}`}</p></div>
        <button class="btn primario" id="mz-sig">${quiz.i + 1 < n ? 'Siguiente →' : 'Ver resultado'}</button>` : ''}`;
    info.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => {
      quiz.resp = b.dataset.r;
      if (quiz.resp === ok) quiz.aciertos++;
      pintarQuiz();
    }));
    info.querySelector('#mz-sig')?.addEventListener('click', () => { quiz.i++; quiz.resp = null; pintarQuiz(); });
  }

  return { iniciar };
})();
