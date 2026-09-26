// Módulo: Niveles de organización de la materia (de las partículas subatómicas a la biosfera).
const Niveles = (function () {
  const { dosTonos, ojo, esfera, estrellas } = Arte;
  const W = 760, H = 472, C = [236, 236], R = 212;

  // Del más pequeño (0) al más grande (13). Seguimos a un carpincho de los Esteros del Iberá.
  const NIVELES = [
    { id: 'subatomico', n: 'Partículas subatómicas', e: '✨', escala: '0,000001 nm', vida: false,
      desc: 'Son las partículas que forman los átomos: <b>protones</b> y <b>neutrones</b> (en el núcleo) y <b>electrones</b> (alrededor).',
      ejemplo: 'Los protones, neutrones y electrones de un átomo de carbono.' },
    { id: 'atomico', n: 'Átomo', e: '⚛️', escala: '0,1 nm', vida: false,
      desc: 'Es la unidad más pequeña de un <b>elemento químico</b>. Cada elemento tiene átomos con una cantidad distinta de protones.',
      ejemplo: 'Un átomo de carbono, con 6 protones, 6 neutrones y 6 electrones.' },
    { id: 'molecular', n: 'Molécula', e: '💧', escala: '1 nm', vida: false,
      desc: 'Dos o más átomos unidos por <b>enlaces químicos</b>. Pueden ser de un mismo elemento (O₂) o de varios (H₂O, glucosa).',
      ejemplo: 'Una molécula de glicina, uno de los aminoácidos que forman las proteínas.' },
    { id: 'macromolecular', n: 'Macromolécula', e: '🧬', escala: '10 nm', vida: false,
      desc: 'Moléculas <b>gigantes</b> formadas por muchas moléculas pequeñas unidas en cadena: proteínas, ADN, almidón.',
      ejemplo: 'Una proteína: una larga cadena de aminoácidos plegada.' },
    { id: 'organela', n: 'Organela', e: '🟠', escala: '1 µm (una milésima de milímetro)', vida: false,
      desc: 'Estructuras dentro de la célula que cumplen una función, como las <b>mitocondrias</b>, el <b>núcleo</b> o los <b>cloroplastos</b>. Solas no tienen vida.',
      ejemplo: 'Una mitocondria, que obtiene la energía para la célula del músculo.' },
    { id: 'celular', n: 'Célula', e: '🔬', escala: '0,1 mm', vida: true,
      desc: 'Es la <b>unidad de la vida</b>: el nivel más pequeño que está vivo. Se nutre, crece, se relaciona y se reproduce.',
      ejemplo: 'Una célula del músculo del corazón, llena de mitocondrias.' },
    { id: 'tisular', n: 'Tejido', e: '🧱', escala: '1 mm', vida: true,
      desc: 'Un grupo de <b>células parecidas</b> que trabajan juntas en la misma función.',
      ejemplo: 'El tejido muscular del corazón: sus células se contraen todas juntas.' },
    { id: 'organo', n: 'Órgano', e: '❤️', escala: '10 cm', vida: true,
      desc: 'Una estructura formada por <b>varios tejidos</b> que cumple una función determinada.',
      ejemplo: 'El corazón del carpincho, que bombea la sangre.' },
    { id: 'sistema', n: 'Sistema de órganos', e: '🩸', escala: '1 m', vida: true,
      desc: 'Varios <b>órganos</b> que trabajan coordinados para una función más amplia.',
      ejemplo: 'El sistema circulatorio del carpincho: corazón, arterias y venas.' },
    { id: 'organismo', n: 'Organismo', e: '🦫', escala: '1,2 m', vida: true,
      desc: 'Un <b>ser vivo completo</b>. Puede tener una sola célula (unicelular) o muchas (pluricelular).',
      ejemplo: 'Un carpincho, el roedor más grande del mundo.' },
    { id: 'poblacion', n: 'Población', e: '👨‍👩‍👧', escala: '100 m', vida: true,
      desc: 'Todos los organismos de la <b>misma especie</b> que viven en el mismo lugar al mismo tiempo.',
      ejemplo: 'Todos los carpinchos que viven en una laguna de los Esteros del Iberá.' },
    { id: 'comunidad', n: 'Comunidad', e: '🐊', escala: '1 km', vida: true,
      desc: 'Todas las <b>poblaciones de distintas especies</b> que conviven en un lugar y se relacionan entre sí.',
      ejemplo: 'Carpinchos, yacarés, garzas, peces, juncos y ceibos de la misma laguna.' },
    { id: 'ecosistema', n: 'Ecosistema', e: '🏞️', escala: '10 km', vida: true,
      desc: 'La <b>comunidad</b> junto con el <b>ambiente</b> donde vive: el agua, el suelo, el aire, la luz y la temperatura.',
      ejemplo: 'Los Esteros del Iberá, en Corrientes: sus seres vivos y su ambiente.' },
    { id: 'biosfera', n: 'Biosfera', e: '🌍', escala: '12 700 km (el diámetro de la Tierra)', vida: true,
      desc: 'Todos los <b>ecosistemas del planeta</b>: la parte de la Tierra donde hay vida.',
      ejemplo: 'Todo el planeta Tierra, desde el fondo del mar hasta las montañas.' },
  ];
  const POR_ID = Object.fromEntries(NIVELES.map((n, i) => [n.id, i]));

  // ---------- Personajes y piezas ----------
  const carita = (x, y, r, dir = -1) => `${ojo(x - r * 1.2, y, r, dir)}${ojo(x + r * 1.2, y, r, dir)}<path d="M${x - r * 0.8},${y + r * 1.4} q${r * 0.8},${r * 0.8} ${r * 1.6},0" stroke="#15163d" stroke-width="${r * 0.32}" fill="none" stroke-linecap="round"/>`;
  const brillo = (d, w = 3) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0.45"/>`;
  function carpincho(x, y, s, dir = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s * dir} ${s})">
      <ellipse cx="4" cy="40" rx="52" ry="7" fill="#05061a" opacity="0.3"/>
      ${[-30, -14, 14, 30].map(lx => `<rect x="${lx - 5}" y="18" width="10" height="22" rx="4" fill="#7a4e2f"/>`).join('')}
      ${dosTonos('<ellipse cx="0" cy="0" rx="48" ry="30" fill="FILL"/><path d="M28,-24 C48,-36 76,-28 80,-8 C82,6 72,14 56,14 C44,14 32,8 26,0 Z" fill="FILL"/>', '#b07a4f', '#8a5a36', { y: 8 })}
      <circle cx="40" cy="-28" r="6" fill="#6e4529"/>${ojo(58, -13, 4.4, 1)}<ellipse cx="77" cy="-5" rx="4" ry="3" fill="#4a2d1a"/>
      <circle cx="64" cy="0" r="4" fill="#ff8fab" opacity="0.5"/>${brillo('M-30,-20 C-16,-30 4,-30 18,-26', 3)}</g>`;
  }
  function garza(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-4,20 L-8,50 M6,20 L8,50" stroke="#ffd43b" stroke-width="2.5"/>
      ${dosTonos('<ellipse cx="0" cy="8" rx="20" ry="13" fill="FILL"/><path d="M10,2 C14,-14 8,-26 12,-36 L20,-34 C18,-24 22,-12 16,4 Z" fill="FILL"/><circle cx="16" cy="-38" r="7" fill="FILL"/>', '#ffffff', '#d0d7f0', { y: 10 })}
      <path d="M22,-38 L40,-35 L22,-34 Z" fill="#ffd43b"/>${ojo(17, -39, 2.2, 1)}</g>`;
  }
  function yacare(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${dosTonos('<path d="M-60,0 C-40,-12 30,-12 50,-4 L78,-2 C80,4 60,6 50,6 C30,10 -40,10 -60,0 Z" fill="FILL"/>', '#5c940d', '#3f6b08', { y: 2 })}
      ${[-40, -20, 0, 20].map(bx => `<path d="M${bx},-9 l5,-5 l5,5 Z" fill="#3f6b08"/>`).join('')}
      <circle cx="46" cy="-9" r="6" fill="#5c940d"/>${ojo(46, -10, 3.4, 1)}</g>`;
  }
  const pez = (x, y, s, c = '#ffa94d') => `<g transform="translate(${x} ${y}) scale(${s})">${dosTonos('<ellipse cx="0" cy="0" rx="14" ry="8" fill="FILL"/><path d="M-12,0 L-24,-8 L-24,8 Z" fill="FILL"/>', c, '#e8590c', { y: 1 })}${ojo(7, -2, 2.2, 1)}</g>`;
  const junco = (x, y, h) => `<path d="M${x},${y} q${-3},${-h / 2} 0,${-h}" stroke="#2f9e44" stroke-width="3" fill="none"/><rect x="${x - 3}" y="${y - h - 4}" width="6" height="14" rx="3" fill="#8a5a36"/>`;
  function ceibo(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-6,0 L-4,-50 L4,-50 L6,0 Z" fill="#6e4529"/>
      ${dosTonos('<circle cx="0" cy="-70" r="34" fill="FILL"/><circle cx="-26" cy="-56" r="22" fill="FILL"/><circle cx="26" cy="-56" r="22" fill="FILL"/>', '#51cf66', '#2f9e44', { x: 6 })}
      ${[[-20, -80], [8, -92], [20, -66], [-8, -58], [-34, -60], [34, -52], [0, -74]].map(([fx, fy]) => `<circle cx="${fx}" cy="${fy}" r="4" fill="#f03e3e"/>`).join('')}</g>`;
  }
  const CORAZON = 'M0,60 C-54,24 -80,-6 -74,-36 C-68,-66 -30,-72 -8,-48 L0,-40 L8,-48 C30,-72 68,-66 74,-36 C80,-6 54,24 0,60 Z';
  const pill = (x, y, t) => { const w = t.length * 6.6 + 18; return `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-11" width="${w}" height="22" rx="11" fill="#12143a" opacity="0.92"/><text y="4" text-anchor="middle" class="nv-pill">${t}</text></g>`; };

  // ---------- Ilustraciones de cada nivel (centradas en 0,0; radio visible 212) ----------
  function paisaje(comunidad) {
    let s = `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-cielo)"/>
      <circle cx="120" cy="-120" r="56" fill="#ffd43b" opacity="0.25"/><circle cx="120" cy="-120" r="30" fill="#ffd43b"/>
      ${[[-120, -140], [10, -110]].map(([x, y]) => `<g fill="#fff" opacity="0.85"><ellipse cx="${x}" cy="${y}" rx="34" ry="12"/><ellipse cx="${x + 20}" cy="${y - 8}" rx="22" ry="12"/></g>`).join('')}
      <path d="M-220,10 C-160,-20 -80,0 -20,-12 C40,-24 120,-4 220,-16 V60 H-220 Z" fill="#40c057"/>
      ${dosTonos('<path d="M-220,40 C-120,20 -20,40 60,34 C140,28 180,40 220,36 V220 H-220 Z" fill="FILL"/>', '#8ce99a', '#69db7c', { y: 120 })}
      ${dosTonos('<ellipse cx="110" cy="130" rx="150" ry="70" fill="FILL"/>', '#4dabf7', '#339af0', { y: 140 })}
      ${[[70, 110], [130, 150], [60, 165]].map(([x, y]) => `<path d="M${x - 20},${y} h40" stroke="#d0ebff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`).join('')}`;
    if (comunidad) s += `<rect x="-220" y="-220" width="440" height="440" fill="#0c0e30" opacity="0.55"/>`;
    s += `${ceibo(-150, 40, 1)}${[-10, 4, 18, 30, 170, 182, 196].map((x, i) => junco(x, 90 + (i % 3) * 8, 44 + (i % 2) * 14)).join('')}
      ${pez(120, 175, 0.9)}${pez(60, 140, 0.7, '#ffd43b')}${garza(150, 70, 1)}${yacare(90, 118, 0.8)}
      ${carpincho(-110, 110, 0.5)}${carpincho(-40, 135, 0.42)}${carpincho(-150, 150, 0.38)}`;
    if (comunidad) s += `${pill(-80, 80, 'carpinchos')}${pill(150, 16, 'garza')}${pill(60, 96, 'yacaré')}${pill(-150, -60, 'ceibo')}${pill(20, 60, 'juncos')}${pill(150, 196, 'peces')}`;
    else s += `${pill(120, -76, '☀️ luz')}${pill(-80, -150, '💨 aire')}${pill(110, 150, '💧 agua')}${pill(-70, 168, '🟫 suelo')}`;
    return s;
  }

  const DIBUJO = {
    biosfera: () => `<rect x="-220" y="-220" width="440" height="440" fill="#0c0e30"/>
      ${estrellas(40, 440, 440).replace(/cx="([\d.]+)" cy="([\d.]+)"/g, (m, x, y) => `cx="${(+x - 220).toFixed(1)}" cy="${(+y - 220).toFixed(1)}"`)}
      <circle cx="0" cy="0" r="178" fill="#4dabf7" opacity="0.28"/><circle cx="0" cy="0" r="168" fill="#74c0fc" opacity="0.35"/>
      <g clip-path="url(#nv-tierra)"><circle cx="0" cy="0" r="160" fill="#339af0"/>
        ${dosTonos('<path d="M-110,-90 C-70,-130 -10,-120 0,-86 C10,-54 -30,-44 -52,-50 C-80,-58 -130,-50 -110,-90 Z" fill="FILL"/><path d="M-4,-10 C30,-18 52,10 44,46 C36,84 22,120 4,140 C-4,104 -16,70 -22,44 C-28,16 -24,-6 -4,-10 Z" fill="FILL"/><path d="M76,-74 C110,-86 140,-54 136,-18 C132,18 110,56 94,44 C76,24 64,-24 76,-74 Z" fill="FILL"/>', '#69db7c', '#40c057', { x: 30 })}
        <ellipse cx="-10" cy="-156" rx="80" ry="22" fill="#f8f9fa"/>
        ${[[-60, -20, 60], [40, -110, 50], [70, 90, 70]].map(([x, y, w]) => `<path d="M${x},${y} q${w / 2},-10 ${w},0" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.6"/>`).join('')}
        <circle cx="-40" cy="-40" r="230" fill="none" stroke="#05061a" stroke-width="130" opacity="0.3"/></g>
      ${brillo('M-120,-60 a130,130 0 0 1 70,-74', 6)}`,
    ecosistema: () => paisaje(false),
    comunidad: () => paisaje(true),
    poblacion: () => `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-cielo)"/>
      ${dosTonos('<path d="M-220,-40 C-100,-70 60,-50 220,-70 V220 H-220 Z" fill="FILL"/>', '#8ce99a', '#69db7c', { y: 90 })}
      ${[[-150, -10], [-60, 30], [90, -20], [150, 60], [-120, 120], [10, 150]].map(([x, y]) => `<path d="M${x},${y} l4,-10 l4,10 M${x + 14},${y + 4} l4,-10 l4,10" stroke="#2f9e44" stroke-width="2.4" fill="none"/>`).join('')}
      ${carpincho(-110, -10, 0.62, -1)}${carpincho(80, 0, 0.55)}${carpincho(40, 50, 0.85)}${carpincho(-60, 110, 0.72)}${carpincho(110, 130, 0.45)}${carpincho(-150, 70, 0.4)}
      ${pill(0, -150, 'todos de la misma especie')}`,
    organismo: () => `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/>${carpincho(-30, 20, 2.1)}${pill(0, 170, 'un carpincho')}`,
    sistema: () => `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/>
      <g opacity="0.35">${carpincho(-30, 20, 2.1)}</g>
      ${[['M18,4 C60,-20 100,-40 140,-44', '#ff6b6b'], ['M18,4 C-40,-20 -100,-20 -120,10', '#ff6b6b'], ['M18,4 C30,40 40,70 36,100', '#ff6b6b'], ['M18,4 C-20,40 -60,70 -80,100', '#ff6b6b'],
        ['M26,14 C66,-10 104,-28 146,-30', '#5b8def'], ['M26,14 C-34,-8 -96,-6 -116,22', '#5b8def'], ['M26,14 C40,48 48,76 46,104', '#5b8def'], ['M26,14 C-12,48 -52,78 -70,104', '#5b8def']]
        .map(([d, c]) => `<path d="${d}" stroke="#05061a" stroke-width="9" fill="none" opacity="0.3"/><path d="${d}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
      <g transform="translate(22 8) scale(0.36)">${dosTonos(`<path d="${CORAZON}" fill="FILL"/>`, '#ff6b6b', '#d63c3c', { x: 10 })}</g>
      ${pill(0, 170, 'sistema circulatorio')}`,
    organo: () => `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/>
      <path d="M20,-80 C20,-150 90,-160 110,-110" stroke="#d63c3c" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M20,-80 C20,-150 90,-160 110,-110" stroke="#ff8787" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M-40,-70 L-40,-160" stroke="#3f63c9" stroke-width="28" stroke-linecap="round"/><path d="M-40,-70 L-40,-160" stroke="#7aa7ff" stroke-width="12" stroke-linecap="round"/>
      <g transform="translate(0 20) scale(2)">${dosTonos(`<path d="${CORAZON}" fill="FILL"/>`, '#ff6b6b', '#d63c3c', { x: 12 })}${brillo('M-58,-36 a26,26 0 0 1 24,-22', 3)}</g>
      ${carita(-10, 0, 9)}`,
    tisular: () => {
      let s = '<rect x="-220" y="-220" width="440" height="440" fill="#4a1d3f"/>';
      for (let f = -4; f <= 4; f++) for (let k = -3; k <= 3; k++) {
        const x = k * 116 + (f % 2 ? 58 : 0), y = f * 50;
        s += `<g transform="translate(${x} ${y})">${dosTonos('<rect x="-54" y="-21" width="108" height="42" rx="18" fill="FILL"/>', '#ff8fab', '#e0607f', { y: 6 })}
          ${[-40, -30, -20, -10, 10, 20, 30, 40].map(sx => `<path d="M${sx},-17 v34" stroke="#c9486b" stroke-width="2" opacity="0.5"/>`).join('')}
          <ellipse cx="0" cy="0" rx="11" ry="7" fill="#9c36b5"/><ellipse cx="-3" cy="-2" rx="4" ry="2" fill="#e5dbff" opacity="0.6"/></g>`;
      }
      return s + pill(0, 172, 'tejido muscular del corazón');
    },
    celular: () => `<rect x="-220" y="-220" width="440" height="440" fill="#4a1d3f"/>
      ${dosTonos('<rect x="-196" y="-88" width="392" height="176" rx="70" fill="FILL"/>', '#ff8fab', '#e0607f', { y: 30 })}
      ${Array.from({ length: 17 }, (_, i) => `<path d="M${-160 + i * 20},-70 v140" stroke="#c9486b" stroke-width="3" opacity="0.35"/>`).join('')}
      ${[[-120, 40, 20], [20, -46, -10], [110, 30, 15], [150, -40, -20], [-150, -40, 10], [60, 56, 5]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(0.7)">${dosTonos('<rect x="-34" y="-16" width="68" height="32" rx="16" fill="FILL"/>', '#ff922b', '#e8590c', { y: 5 })}<rect x="-29" y="-11" width="58" height="22" rx="11" fill="#ffc078"/>${[-20, -8, 4, 16].map((dx, i) => `<rect x="${dx - 2.6}" y="${i % 2 ? -1 : -11}" width="5.2" height="12" rx="2.6" fill="#ff922b"/>`).join('')}</g>`).join('')}
      <g transform="translate(-40 0)">${dosTonos('<ellipse rx="44" ry="30" fill="FILL"/>', '#9775fa', '#7048e8', { x: 12 })}<ellipse rx="32" ry="21" fill="#b197fc"/>${carita(0, -2, 4.5)}</g>
      ${brillo('M-170,-60 C-150,-80 -110,-84 -80,-82', 5)}${pill(0, 130, 'una célula muscular')}`,
    organela: () => `<rect x="-220" y="-220" width="440" height="440" fill="#4a1d3f"/>
      ${dosTonos('<ellipse rx="190" ry="108" fill="FILL"/>', '#ff922b', '#e8590c', { y: 30 })}
      <ellipse rx="170" ry="90" fill="#ffc078"/>
      <path d="M-150,0 C-140,-60 -120,-60 -110,0 C-100,60 -80,60 -70,0 C-60,-60 -40,-60 -30,0 C-20,60 0,60 10,0 C20,-60 40,-60 50,0 C60,60 80,60 90,0 C100,-60 120,-60 130,0" stroke="#ff922b" stroke-width="14" fill="none" stroke-linecap="round"/>
      ${[[-130, -34], [-50, -34], [30, -34], [110, -34], [-90, 34], [-10, 34], [70, 34]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0,0 V${y < 0 ? 10 : -10}" stroke="#495057" stroke-width="3"/>${esfera(0, 0, 6, '#74c0fc')}</g>`).join('')}
      ${carita(-60, -60, 6)}${brillo('M-160,-50 C-140,-90 -90,-104 -40,-106', 5)}${pill(0, 136, 'una mitocondria')}`,
    macromolecular: () => {
      const cols = ['#ff6b6b', '#ffd43b', '#69db7c', '#74c0fc', '#b197fc', '#ffa94d'];
      const pts = pts46();
      return `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/>
        <polyline points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#dbe4ff" stroke-width="5" stroke-linejoin="round" opacity="0.8"/>
        ${pts.map((p, i) => esfera(p[0], p[1], 11, cols[(i * 7) % 6])).join('')}${pill(0, 176, 'una proteína')}`;
    },
    molecular: () => {
      const A = { N: [-90, -10, '#4c6ef5', 28], Ca: [-10, 20, '#5c636a', 28], C: [70, -10, '#5c636a', 28], O1: [80, -90, '#f03e3e', 28], O2: [140, 40, '#f03e3e', 28],
        H1: [-140, -60, '#f1f3f5', 18], H2: [-140, 40, '#f1f3f5', 18], H3: [-10, 96, '#f1f3f5', 18], H4: [-30, -54, '#f1f3f5', 18], H5: [190, 16, '#f1f3f5', 18] };
      const enl = [['N', 'Ca'], ['Ca', 'C'], ['C', 'O1', 2], ['C', 'O2'], ['N', 'H1'], ['N', 'H2'], ['Ca', 'H3'], ['Ca', 'H4'], ['O2', 'H5']];
      return `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/>
        ${enl.map(([a, b, d]) => { const [x1, y1] = A[a], [x2, y2] = A[b]; return (d ? [-6, 6] : [0]).map(o => `<line x1="${x1 + o}" y1="${y1 + o}" x2="${x2 + o}" y2="${y2 + o}" stroke="#dbe4ff" stroke-width="8" stroke-linecap="round"/>`).join(''); }).join('')}
        ${Object.entries(A).map(([k, [x, y, c, r]]) => `${esfera(x, y, r, c)}<text x="${x}" y="${y + 6}" text-anchor="middle" class="nv-sim ${k[0] === 'H' ? 'osc' : ''}">${k.replace(/\d|a/g, '')}</text>`).join('')}
        ${pill(0, 170, 'glicina, un aminoácido')}`;
    },
    atomico: () => {
      let s = `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/><circle r="60" fill="#ffd166" opacity="0.15"/>
        ${[80, 150].map(r => `<circle r="${r}" fill="none" stroke="#9aa3ff" stroke-width="2" stroke-dasharray="4 6" opacity="0.6"/>`).join('')}`;
      for (let i = 11; i >= 0; i--) { const r = 9 * Math.sqrt(i + 0.3), a = i * 2.39996; s += esfera(r * Math.cos(a), r * Math.sin(a), 10, i % 2 ? '#ced4da' : '#4dabf7'); }
      [[80, 2, 0.3], [150, 4, 1]].forEach(([r, n, f]) => { for (let j = 0; j < n; j++) { const a = j / n * 2 * Math.PI + f, x = r * Math.cos(a), y = r * Math.sin(a); s += `<circle cx="${x}" cy="${y}" r="16" fill="#ff6b6b" opacity="0.25"/>${esfera(x, y, 9, '#ff6b6b', 0.7)}`; } });
      return s + pill(0, 184, 'un átomo de carbono');
    },
    subatomico: () => `<rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/>
      <circle cx="-100" cy="-40" r="80" fill="#4dabf7" opacity="0.15"/>${esfera(-100, -40, 62, '#4dabf7')}${carita(-100, -44, 7)}<text x="-100" y="46" text-anchor="middle" class="nv-carga">+</text>
      <circle cx="80" cy="-60" r="80" fill="#ced4da" opacity="0.12"/>${esfera(80, -60, 62, '#ced4da')}${carita(80, -64, 7)}<text x="80" y="26" text-anchor="middle" class="nv-carga">0</text>
      <circle cx="10" cy="110" r="44" fill="#ff6b6b" opacity="0.2"/>${esfera(10, 110, 26, '#ff6b6b', 0.7)}${carita(10, 108, 3.4)}<text x="58" y="118" class="nv-carga">−</text>
      ${pill(-100, 60, 'protón')}${pill(80, 40, 'neutrón')}${pill(10, 160, 'electrón (mucho más chico)')}`,
  };
  // Dónde está el nivel siguiente (más pequeño) dentro de cada dibujo.
  const FOCO = { biosfera: [10, 70], ecosistema: [-110, 110], comunidad: [-110, 110], poblacion: [40, 50], organismo: [22, 20], sistema: [22, 10], organo: [40, 10],
    tisular: [0, 0], celular: [110, 30], organela: [30, -34], macromolecular: [pts46()[22][0], pts46()[22][1]], molecular: [-10, 20], atomico: [0, 0] };
  function pts46() {
    return Array.from({ length: 46 }, (_, i) => {
      const t = i / 45;
      if (t < 0.45) { const a = t / 0.45 * 6 * Math.PI; return [-150 + t / 0.45 * 150 + Math.cos(a) * 26, -70 + Math.sin(a) * 30]; }
      const u = (t - 0.45) / 0.55;
      return [Math.sin(u * Math.PI * 3) * 120, -10 + u * 150 + Math.cos(u * Math.PI * 3) * 20];
    });
  }

  function capa(i, conFoco = true) {
    const id = NIVELES[i].id, f = conFoco && FOCO[id];
    return `<g transform="translate(${C[0]} ${C[1]})">${DIBUJO[id]()}
      ${f ? `<g class="nv-foco" data-foco="1" transform="translate(${f[0]} ${f[1]})"><circle r="26" fill="#ffd166" fill-opacity="0.12" stroke="#ffd166" stroke-width="3" stroke-dasharray="6 5"><animate attributeName="r" values="22;28;22" dur="1.8s" repeatCount="indefinite"/></circle><text y="6" text-anchor="middle" font-size="16">🔍</text></g>` : ''}</g>`;
  }

  function escenaFija() {
    const fila = i => 30 + (13 - i) * 31;
    return `<defs>
        <radialGradient id="nv-fondo" cx="0.35" cy="0.45" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <linearGradient id="nv-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4dabf7"/><stop offset="0.6" stop-color="#a5d8ff"/></linearGradient>
        <radialGradient id="nv-suave" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#34307a"/><stop offset="1" stop-color="#191a4d"/></radialGradient>
        <clipPath id="nv-lente"><circle cx="${C[0]}" cy="${C[1]}" r="${R}"/></clipPath>
        <clipPath id="nv-tierra"><circle cx="0" cy="0" r="160"/></clipPath>
      </defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#nv-fondo)"/>${estrellas(30, W, H)}
      <circle cx="${C[0] + 7}" cy="${C[1] + 9}" r="${R}" fill="#05061a" opacity="0.45"/>
      <g clip-path="url(#nv-lente)"><rect x="${C[0] - R}" y="${C[1] - R}" width="${R * 2}" height="${R * 2}" fill="#191a4d"/><g id="nv-capas"></g></g>
      <circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#e5dbff" stroke-width="6"/>
      <path d="M${C[0] - 150},${C[1] - 110} a${R - 14},${R - 14} 0 0 1 80,-72" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.4"/>
      <g id="nv-escalera">${NIVELES.map((n, i) => `<g class="nv-fila ${n.vida ? 'vida' : ''}" data-i="${i}" transform="translate(0 ${fila(i)})">
        <rect x="486" y="-13" width="226" height="26" rx="13"/><text x="500" y="5" class="nv-fila-e">${n.e}</text><text x="524" y="5" class="nv-fila-t">${n.n}</text></g>`).join('')}
        <path d="M722,${fila(13) - 12} h8 V${fila(5) + 12} h-8" stroke="#69db7c" stroke-width="2.5" fill="none"/>
        <text transform="translate(744 ${(fila(13) + fila(5)) / 2}) rotate(90)" text-anchor="middle" class="nv-llave vida">CON VIDA (BIÓTICOS)</text>
        <path d="M722,${fila(4) - 12} h8 V${fila(0) + 12} h-8" stroke="#74c0fc" stroke-width="2.5" fill="none"/>
        <text transform="translate(744 ${(fila(4) + fila(0)) / 2}) rotate(90)" text-anchor="middle" class="nv-llave">SIN VIDA</text>
        <text x="600" y="${fila(13) - 20}" text-anchor="middle" class="nv-flechita">▲ más grande</text><text x="600" y="${fila(0) + 28}" text-anchor="middle" class="nv-flechita">▼ más pequeño</text>
      </g>`;
  }

  // ---------- Estado y vistas ----------
  let raiz, modo = 'zoom', actual = 13, animando = false;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🔭 Niveles de organización de la materia</h1>
        <p>Todo lo que existe está formado por materia organizada en <b>niveles</b>: cada uno está formado por los del nivel anterior y tiene características nuevas. Hacé zoom desde la Tierra hasta las partículas más pequeñas.</p>
      </div>
      <div class="segmentado" id="nv-modos">
        <button data-m="zoom">🔍 Viaje con zoom</button>
        <button data-m="ordenar">🧩 Ordenar los niveles</button>
        <button data-m="quiz">❓ ¿Qué nivel es?</button>
      </div>
      <div class="nu-grid">
        <div class="panel nu-escena" id="nv-escena"></div>
        <aside class="panel nu-info" id="nv-info"></aside>
      </div>`;
    raiz.querySelectorAll('#nv-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    cambiarModo('zoom');
  }

  function cambiarModo(m) {
    modo = m;
    raiz.querySelectorAll('#nv-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    if (m === 'zoom') vistaZoom();
    else if (m === 'ordenar') vistaOrdenar();
    else vistaQuiz();
  }

  function montarEscena(controles) {
    const cont = raiz.querySelector('#nv-escena');
    cont.innerHTML = `<svg id="nv-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Niveles de organización de la materia">${escenaFija()}</svg><div id="nv-controles">${controles}</div>`;
    return cont.querySelector('#nv-svg');
  }

  // ---------- 1. Viaje con zoom ----------
  function vistaZoom() {
    const svg = montarEscena(`<div class="nv-botones"><button class="btn" id="nv-alejar">🔭 Alejar</button><button class="btn primario" id="nv-acercar">🔍 Acercar</button></div>
      <p class="nu-ayuda-esc">Tocá la lupa amarilla del dibujo para acercarte, o elegí un nivel en la escalera.</p>`);
    svg.querySelector('#nv-capas').innerHTML = `<g class="nv-capa">${capa(actual)}</g>`;
    svg.addEventListener('click', e => {
      if (e.target.closest('[data-foco]')) return ir(actual - 1);
      const f = e.target.closest('.nv-fila');
      if (f && modo === 'zoom') ir(+f.dataset.i);
    });
    raiz.querySelector('#nv-alejar').addEventListener('click', () => ir(actual + 1));
    raiz.querySelector('#nv-acercar').addEventListener('click', () => ir(actual - 1));
    pintarZoom();
  }

  function pintarZoom() {
    raiz.querySelectorAll('.nv-fila').forEach(f => f.classList.toggle('activo', +f.dataset.i === actual));
    raiz.querySelector('#nv-alejar').disabled = actual === 13;
    raiz.querySelector('#nv-acercar').disabled = actual === 0;
    const n = NIVELES[actual], menor = NIVELES[actual - 1], mayor = NIVELES[actual + 1];
    raiz.querySelector('#nv-info').innerHTML = `<h2>${n.e} ${n.n}</h2>
      <span class="nv-sello ${n.vida ? 'vida' : ''}">${n.vida ? '🌱 Nivel biótico: tiene vida' : '⚛️ Nivel abiótico: no tiene vida'}</span>
      <p>${n.desc}</p>
      <p><b>En nuestro viaje:</b> ${n.ejemplo}</p>
      <div class="nv-escala">📏 Tamaño aproximado: <b>${n.escala}</b></div>
      ${n.id === 'celular' ? '<p class="nv-destacado">⭐ Es el <b>primer nivel con vida</b>: todos los niveles de abajo son materia sin vida.</p>' : ''}
      <ul class="nv-rel">${menor ? `<li>⬇️ Está formado por: <b>${menor.n.toLowerCase()}</b></li>` : '<li>⬇️ Es el nivel más pequeño.</li>'}${mayor ? `<li>⬆️ Forma parte de: <b>${mayor.n.toLowerCase()}</b></li>` : '<li>⬆️ Es el nivel más grande: incluye a todos los demás.</li>'}</ul>`;
  }

  // Transición de zoom: la capa vieja se agranda (o achica) desde la lupa y aparece la nueva.
  function ir(i) {
    if (i < 0 || i > 13 || i === actual || animando) return;
    const svg = raiz.querySelector('#nv-svg'), capas = svg.querySelector('#nv-capas');
    const vieja = capas.querySelector('.nv-capa'), nueva = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nueva.setAttribute('class', 'nv-capa');
    nueva.innerHTML = capa(i);
    const adentro = i < actual;
    const f = FOCO[NIVELES[adentro ? actual : i].id] || [0, 0];
    const origen = `${C[0] + f[0]}px ${C[1] + f[1]}px`;
    [vieja, nueva].forEach(g => { g.style.transformBox = 'view-box'; g.style.transformOrigin = origen; });
    if (adentro) capas.appendChild(nueva); else capas.insertBefore(nueva, vieja);
    actual = i;
    const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!vieja || reducir || !vieja.animate) { vieja && vieja.remove(); pintarZoom(); return; }
    animando = true;
    const d = { duration: 900, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' };
    vieja.animate(adentro ? [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(6)', opacity: 0 }] : [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.15)', opacity: 0 }], d);
    const a = nueva.animate(adentro ? [{ transform: 'scale(0.15)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }] : [{ transform: 'scale(6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], d);
    a.onfinish = () => { vieja.remove(); nueva.getAnimations().forEach(x => x.cancel()); nueva.style.transform = ''; animando = false; };
    pintarZoom();
  }

  // ---------- 2. Ordenar ----------
  let ord = null;
  function vistaOrdenar(nivel) {
    const n = nivel || (ord && ord.nivel) || 1;
    const elegidos = n === 1 ? Util.mezclar([...NIVELES.keys()]).slice(0, 6).sort((a, b) => a - b) : [...NIVELES.keys()];
    ord = { nivel: n, fichas: Util.mezclar(elegidos), puestos: [], estado: null };
    const cont = raiz.querySelector('#nv-escena');
    cont.innerHTML = `<div class="nv-ordenar">
        <p class="nv-ord-titulo">Tocá los niveles <b>del más pequeño al más grande</b>.</p>
        <div class="nv-hilera" id="nv-hilera"></div>
        <div class="nv-banco" id="nv-banco"></div>
        <div class="nx-acciones"><button class="btn primario" id="nv-comprobar">✔️ Comprobar</button><button class="btn" id="nv-otra">↺ Otra ronda</button>
          <span class="nx-nivel"><button data-n="1">6 niveles</button><button data-n="2">Los 14 niveles</button></span></div>
      </div>`;
    cont.querySelector('#nv-comprobar').addEventListener('click', comprobarOrden);
    cont.querySelector('#nv-otra').addEventListener('click', () => vistaOrdenar(ord.nivel));
    cont.querySelectorAll('.nx-nivel button').forEach(b => b.addEventListener('click', () => vistaOrdenar(+b.dataset.n)));
    cont.querySelector('#nv-banco').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b && !ord.estado) { ord.puestos.push(+b.dataset.i); pintarOrden(); } });
    cont.querySelector('#nv-hilera').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b && !ord.estado) { ord.puestos.splice(+b.dataset.p, 1); pintarOrden(); } });
    pintarOrden();
  }

  function pintarOrden() {
    const cont = raiz.querySelector('#nv-escena');
    cont.querySelectorAll('.nx-nivel button').forEach(b => b.classList.toggle('activo', +b.dataset.n === ord.nivel));
    const correcto = [...ord.fichas].sort((a, b) => a - b);
    cont.querySelector('#nv-hilera').innerHTML = correcto.map((_, p) => {
      const i = ord.puestos[p], est = ord.estado ? (i === correcto[p] ? 'ok' : 'mal') : '';
      return `${p ? '<span class="nv-flecha">›</span>' : ''}<button class="nv-casilla ${i !== undefined ? 'llena' : ''} ${est}" data-p="${p}" ${i === undefined ? 'disabled' : ''}>
        ${i !== undefined ? `<span>${NIVELES[i].e}</span>${NIVELES[i].n}` : `<small>${p + 1}</small>`}</button>`;
    }).join('');
    cont.querySelector('#nv-banco').innerHTML = ord.fichas.filter(i => !ord.puestos.includes(i)).map(i => `<button class="nx-ficha" data-i="${i}">${NIVELES[i].e} ${NIVELES[i].n}</button>`).join('')
      || '<span class="nx-banco-vacio">¡Listo! Tocá «Comprobar».</span>';
    const info = raiz.querySelector('#nv-info');
    if (!ord.estado) {
      info.innerHTML = `<h2>🧩 Ordenar los niveles</h2><p>Cada nivel está <b>formado por</b> los niveles más pequeños. Por ejemplo, un tejido está formado por células, y una célula, por organelas.</p>
        <p class="nu-ayuda">Tocá una ficha para ponerla en el siguiente lugar. Para sacarla, tocala en la fila de arriba.</p>
        <p class="nu-ayuda">💡 Pista: pensá qué está <b>adentro</b> de qué.</p>`;
      return;
    }
    const bien = ord.puestos.filter((i, p) => i === correcto[p]).length;
    info.innerHTML = `<div class="feedback ${bien === correcto.length ? 'ok' : 'mal'}"><p class="fb-titulo">${bien === correcto.length ? '🏆 ¡Orden perfecto!' : `${bien} de ${correcto.length} en su lugar`}</p>
      <p>${bien === correcto.length ? 'Cada nivel está formado por el anterior.' : 'Las casillas en rojo no van ahí. Mirá el orden correcto:'}</p></div>
      <ol class="nv-correcto">${correcto.map(i => `<li class="${NIVELES[i].vida ? 'vida' : ''}">${NIVELES[i].e} ${NIVELES[i].n}</li>`).join('')}</ol>`;
  }

  function comprobarOrden() {
    if (ord.puestos.length < ord.fichas.length) {
      raiz.querySelector('#nv-info').innerHTML = `<h2>🧩 Ordenar los niveles</h2><p class="nu-error">Todavía faltan ${ord.fichas.length - ord.puestos.length} fichas por ubicar.</p>`;
      return;
    }
    ord.estado = 'visto';
    pintarOrden();
  }

  // ---------- 3. ¿Qué nivel es? ----------
  const EJEMPLOS = [
    { t: 'Un protón', e: '➕', ok: 'subatomico', x: 'Es una de las partículas que forman el núcleo de los átomos.' },
    { t: 'Un electrón', e: '➖', ok: 'subatomico', x: 'Es una partícula con carga negativa que se mueve alrededor del núcleo del átomo.' },
    { t: 'Un átomo de hierro', e: '🔩', ok: 'atomico', x: 'Es la unidad más pequeña del elemento hierro.' },
    { t: 'Un átomo de oxígeno', e: '⚛️', ok: 'atomico', x: 'Tiene 8 protones: eso lo hace ser oxígeno.' },
    { t: 'Una molécula de agua (H₂O)', e: '💧', ok: 'molecular', x: 'Está formada por dos átomos de hidrógeno y uno de oxígeno unidos.' },
    { t: 'La glucosa', e: '🍬', ok: 'molecular', x: 'Es una molécula formada por átomos de carbono, hidrógeno y oxígeno.' },
    { t: 'El dióxido de carbono (CO₂)', e: '🫧', ok: 'molecular', x: 'Es una molécula de un átomo de carbono y dos de oxígeno.' },
    { t: 'El ADN', e: '🧬', ok: 'macromolecular', x: 'Es una molécula gigante formada por millones de nucleótidos unidos.' },
    { t: 'El almidón de la papa', e: '🥔', ok: 'macromolecular', x: 'Es una cadena enorme de moléculas de glucosa.' },
    { t: 'La hemoglobina (una proteína de la sangre)', e: '🩸', ok: 'macromolecular', x: 'Las proteínas son macromoléculas: largas cadenas de aminoácidos.' },
    { t: 'Una mitocondria', e: '🟠', ok: 'organela', x: 'Es una organela: obtiene la energía dentro de la célula.' },
    { t: 'Un cloroplasto', e: '🟢', ok: 'organela', x: 'Es la organela de las células vegetales donde ocurre la fotosíntesis.' },
    { t: 'El núcleo de una célula', e: '🟣', ok: 'organela', x: 'Es una organela que guarda el ADN.' },
    { t: 'Una neurona', e: '🧠', ok: 'celular', x: 'Es una célula del sistema nervioso.' },
    { t: 'Un glóbulo rojo', e: '🔴', ok: 'celular', x: 'Es una célula de la sangre que transporta oxígeno.' },
    { t: 'Una bacteria', e: '🦠', ok: 'organismo', evitar: 'celular', x: 'Es un organismo unicelular: una sola célula que es un ser vivo completo. En ella el nivel celular y el de organismo coinciden.' },
    { t: 'La sangre', e: '🩸', ok: 'tisular', x: 'Es un tejido: células (glóbulos) que trabajan juntas en un líquido, el plasma.' },
    { t: 'El músculo de tu brazo, visto al microscopio', e: '💪', ok: 'tisular', x: 'Es tejido muscular: muchas células parecidas que se contraen juntas.' },
    { t: 'La piel fina de la cebolla', e: '🧅', ok: 'tisular', x: 'Es un tejido (epidermis): una capa de células iguales.' },
    { t: 'El corazón', e: '❤️', ok: 'organo', x: 'Es un órgano formado por tejido muscular, nervioso y otros.' },
    { t: 'Una hoja de un árbol', e: '🍃', ok: 'organo', x: 'La hoja es un órgano de la planta, formado por varios tejidos.' },
    { t: 'El estómago', e: '🫃', ok: 'organo', x: 'Es un órgano del sistema digestivo.' },
    { t: 'El sistema digestivo', e: '🍽️', ok: 'sistema', x: 'Es un conjunto de órganos (boca, esófago, estómago, intestinos…) que trabajan juntos.' },
    { t: 'El sistema nervioso', e: '🧠', ok: 'sistema', x: 'Encéfalo, médula y nervios trabajan coordinados.' },
    { t: 'Un carpincho', e: '🦫', ok: 'organismo', x: 'Es un ser vivo completo.' },
    { t: 'Un ceibo (el árbol nacional)', e: '🌳', ok: 'organismo', x: 'Es un organismo pluricelular.' },
    { t: 'Todos los carpinchos de los Esteros del Iberá', e: '🦫', ok: 'poblacion', x: 'Son organismos de la misma especie que viven en el mismo lugar.' },
    { t: 'Un cardumen de sábalos en el río Paraná', e: '🐟', ok: 'poblacion', x: 'Todos son de la misma especie y viven en el mismo lugar.' },
    { t: 'Todos los seres vivos de una laguna', e: '🐸', ok: 'comunidad', x: 'Son poblaciones de muchas especies distintas que conviven.' },
    { t: 'Las plantas, los insectos y las aves de una plaza', e: '🐦', ok: 'comunidad', x: 'Son distintas especies que viven juntas: forman una comunidad.' },
    { t: 'Una laguna con sus seres vivos, el agua, el suelo y la luz', e: '🏞️', ok: 'ecosistema', x: 'Incluye a la comunidad y también el ambiente: por eso es un ecosistema.' },
    { t: 'La selva misionera, con sus seres vivos y su clima', e: '🌴', ok: 'ecosistema', x: 'Seres vivos más ambiente: un ecosistema.' },
    { t: 'Todo el planeta donde hay vida', e: '🌍', ok: 'biosfera', x: 'La biosfera reúne a todos los ecosistemas de la Tierra.' },
  ];
  const RONDA = 8;
  let quiz = null;

  function vistaQuiz() {
    quiz = { preguntas: Util.tomar('niveles', EJEMPLOS, RONDA, x => x.t), i: 0, aciertos: 0, resp: null };
    const svg = montarEscena('');
    svg.addEventListener('click', e => { const f = e.target.closest('.nv-fila'); if (f && quiz && quiz.resp === null && quiz.i < RONDA) responder(+f.dataset.i); });
    pintarQuiz();
  }

  function pintarQuiz() {
    const svg = raiz.querySelector('#nv-svg'), info = raiz.querySelector('#nv-info');
    if (quiz.i >= RONDA) {
      svg.querySelector('#nv-capas').innerHTML = `<g class="nv-capa">${capa(13, false)}</g>`;
      raiz.querySelectorAll('.nv-fila').forEach(f => f.classList.remove('activo', 'ok', 'mal'));
      info.innerHTML = `<h2>❓ ¿Qué nivel es?</h2><div class="feedback ${quiz.aciertos >= 6 ? 'ok' : 'mal'}"><p class="fb-titulo">${quiz.aciertos >= 6 ? '🏆' : '💪'} ${quiz.aciertos} de ${RONDA} correctas</p>
        <p>${quiz.aciertos >= 6 ? '¡Muy bien! Ya reconocés los niveles de organización.' : 'Repasá con el viaje con zoom y volvé a intentarlo.'}</p></div>
        <button class="btn primario" id="nv-otra-q">Otra ronda</button>`;
      info.querySelector('#nv-otra-q').addEventListener('click', vistaQuiz);
      return;
    }
    const q = quiz.preguntas[quiz.i], ok = POR_ID[q.ok], hay = quiz.resp !== null;
    if (!quiz.opciones || quiz.opcionesDe !== quiz.i) {
      const cerca = [ok - 2, ok - 1, ok + 1, ok + 2].filter(k => k >= 0 && k <= 13 && NIVELES[k].id !== q.evitar);
      quiz.opciones = Util.mezclar([ok, ...Util.mezclar(cerca).slice(0, 3)]);
      quiz.opcionesDe = quiz.i;
    }
    raiz.querySelectorAll('.nv-fila').forEach(f => {
      const i = +f.dataset.i;
      f.classList.toggle('ok', hay && i === ok);
      f.classList.toggle('mal', hay && i === quiz.resp && i !== ok);
      f.classList.remove('activo');
    });
    svg.querySelector('#nv-capas').innerHTML = hay
      ? `<g class="nv-capa">${capa(ok, false)}</g>`
      : `<g class="nv-capa"><g transform="translate(${C[0]} ${C[1]})"><rect x="-220" y="-220" width="440" height="440" fill="url(#nv-suave)"/><circle r="120" fill="#ffd166" opacity="0.1"/>
          <text y="40" text-anchor="middle" class="nv-quiz-e">${q.e}</text><text y="150" text-anchor="middle" class="nv-quiz-t">¿Qué nivel es?</text></g></g>`;
    info.innerHTML = `<h2>❓ Pregunta ${quiz.i + 1} de ${RONDA}</h2><p class="nx-caso">${q.e} ${q.t}</p>
      <p class="nu-pregunta">¿A qué nivel de organización corresponde?</p>
      <div class="nu-opciones">${quiz.opciones.map(k => `<button class="btn-opcion${hay ? (k === ok ? ' correcta' : k === quiz.resp ? ' incorrecta' : '') : ''}" data-k="${k}" ${hay ? 'disabled' : ''}>${NIVELES[k].e} ${NIVELES[k].n}</button>`).join('')}</div>
      <p class="nu-ayuda">También podés tocar el nivel en la escalera.</p>
      ${hay ? `<div class="feedback ${quiz.resp === ok ? 'ok' : 'mal'}"><p class="fb-titulo">${quiz.resp === ok ? '✅ ¡Correcto!' : `✖ Es: ${NIVELES[ok].n.toLowerCase()}`}</p><p>${q.x}</p></div>
        <button class="btn primario" id="nv-sig">${quiz.i + 1 < RONDA ? 'Siguiente' : 'Ver resultado'}</button>` : ''}`;
    info.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => responder(+b.dataset.k)));
    info.querySelector('#nv-sig')?.addEventListener('click', () => { quiz.i++; quiz.resp = null; pintarQuiz(); });
  }

  function responder(k) {
    if (quiz.resp !== null) return;
    quiz.resp = k;
    if (k === POR_ID[quiz.preguntas[quiz.i].ok]) quiz.aciertos++;
    pintarQuiz();
  }

  return { iniciar };
})();
