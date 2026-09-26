// Módulo 11: Sistemas de la nutrición (digestivo, respiratorio, circulatorio y excretor). Pensado para 2.º año.
const Nutricion = (function () {
  const { dosTonos, ojo } = Arte;
  const W = 760, H = 490;

  // ---------- Sistemas y lugares del esquema ----------
  const SISTEMAS = {
    digestivo: {
      n: 'Sistema digestivo', e: '🍽️', c: '#ff8fab', analogia: 'Es como la <b>cocina</b>: prepara los alimentos para que el cuerpo los pueda usar.',
      organos: ['Boca', 'Esófago', 'Estómago', 'Intestino delgado', 'Intestino grueso', 'Hígado y páncreas'],
      funcion: 'Transforma los alimentos en <b>nutrientes</b> muy pequeños (<b>digestión</b>) y los hace pasar a la sangre (<b>absorción</b>). Lo que no se aprovecha se elimina como <b>materia fecal</b>.',
      recibe: ['Alimentos', 'Agua'], entrega: ['Nutrientes y agua → a la sangre', 'Materia fecal → al exterior'],
    },
    respiratorio: {
      n: 'Sistema respiratorio', e: '🫁', c: '#7fd3ff', analogia: 'Es como la <b>ventilación</b> de una casa: entra aire nuevo y sale el aire usado.',
      organos: ['Nariz', 'Faringe y laringe', 'Tráquea', 'Bronquios', 'Pulmones (alvéolos)'],
      funcion: 'Toma el <b>oxígeno</b> del aire y se lo pasa a la sangre. Al mismo tiempo recibe de la sangre el <b>dióxido de carbono</b> y lo elimina con el aire que exhalamos.',
      recibe: ['Aire con oxígeno', 'Dióxido de carbono (desde la sangre)'], entrega: ['Oxígeno → a la sangre', 'Dióxido de carbono → al aire espirado'],
    },
    circulatorio: {
      n: 'Sistema circulatorio', e: '❤️', c: '#ff6b6b', analogia: 'Es como un <b>delivery</b> que recorre toda la ciudad: reparte lo que cada casa necesita y se lleva la basura.',
      organos: ['Corazón', 'Arterias', 'Venas', 'Capilares', 'Sangre'],
      funcion: 'Es el sistema que <b>conecta a todos</b>. La sangre, impulsada por el corazón, lleva los nutrientes y el oxígeno a todas las células y recoge sus desechos para llevarlos a los pulmones y a los riñones.',
      recibe: ['Nutrientes (del digestivo)', 'Oxígeno (del respiratorio)', 'Desechos (de las células)'], entrega: ['Nutrientes y oxígeno → a las células', 'Dióxido de carbono → al respiratorio', 'Desechos y agua → al excretor'],
    },
    excretor: {
      n: 'Sistema excretor', e: '🫘', c: '#ffd166', analogia: 'Es como el <b>servicio de limpieza</b>: filtra y saca la basura que produce el cuerpo.',
      organos: ['Riñones', 'Uréteres', 'Vejiga', 'Uretra'],
      funcion: 'Los <b>riñones</b> filtran la sangre y separan los <b>desechos</b> (como la urea) y el agua que sobra. Así se forma la <b>orina</b>, que se junta en la vejiga y se elimina.',
      recibe: ['Sangre con desechos'], entrega: ['Sangre limpia → al circulatorio', 'Orina → al exterior'],
    },
    celula: {
      n: 'Las células', e: '🔬', c: '#b197fc', analogia: 'Son como <b>fábricas</b>: usan materia prima y energía para trabajar, y producen residuos.',
      organos: ['Todo el cuerpo está formado por células'],
      funcion: 'Son el <b>destino final</b> de la nutrición. Con los nutrientes y el oxígeno obtienen <b>energía</b> y <b>material para crecer y reparar</b> el cuerpo. Al trabajar producen desechos: dióxido de carbono, agua y otros.',
      recibe: ['Nutrientes', 'Oxígeno'], entrega: ['Dióxido de carbono', 'Agua', 'Otros desechos'],
    },
  };
  // Puntos del esquema (coordenadas del dibujo). Los tubos, vasos y recorridos pasan por ellos.
  const P = {
    aire: [128, 44], comida: [128, 92], nariz: [300, 64], boca: [300, 78], faringe: [300, 96],
    traquea: [292, 116], bifurc: [292, 140], bronqI: [270, 158], pulmonI: [250, 188], bronqD: [316, 158], pulmonD: [350, 188],
    esofago: [308, 118], esofago2: [309, 206], cardias: [332, 262], estomago: [350, 284], piloro: [324, 312],
    duodeno: [292, 334], intestino: [304, 360], fin: [272, 392], ciego: [254, 402], colonA: [252, 324], colonA2: [262, 314],
    colonT: [342, 314], colonT2: [352, 324], colonD: [352, 396], sigma: [330, 412], recto: [276, 426], ano: [272, 466],
    corazon: [312, 220], aortaA: [324, 160], arco: [338, 130], sub: [368, 132], hombroA: [392, 142], brazoA: [413, 262],
    brazoV: [423, 262], hombroV: [404, 132], subV: [368, 120], cuello: [330, 112], cuello2: [300, 110], vcSup: [276, 124], vcSup2: [282, 196],
    venaPulm: [272, 204], artPulm: [338, 200], aortaS: [326, 242], aortaD: [324, 296], renal: [322, 334], rinonD: [386, 338], rinonI: [214, 338],
    ureterD: [360, 392], vejiga: [322, 434], uretra: [324, 466],
    portaV: [272, 324], higado: [256, 286], vcInf: [282, 268],
    zoomA: [488, 256], zoomV: [494, 270], capIn: [549, 178], capMid: [552, 228], celula: [624, 254], capOut: [556, 300], capBaja: [561, 336],
    salidaAire: [472, 44], orina: [334, 482], heces: [256, 482],
  };
  const ZOOM = { spot: [418, 262], r: 13, c: [628, 250], R: 118 }, CEL = [652, 250];
  // Nombres que aparecen al pasar el viajero.
  const ETQ = {
    nariz: 'nariz', boca: 'boca', faringe: 'faringe', traquea: 'tráquea', bronqI: 'bronquio', bronqD: 'bronquio', pulmonI: 'alvéolos', pulmonD: 'alvéolos',
    esofago: 'esófago', estomago: 'estómago', intestino: 'intestino delgado', higado: 'hígado', portaV: 'vena porta', vcInf: 'vena cava', vcSup: 'vena cava',
    corazon: 'corazón', arco: 'arteria aorta', aortaD: 'arteria aorta', hombroA: 'arteria', hombroV: 'vena', capMid: 'capilar', capOut: 'capilar', celula: 'célula',
    venaPulm: 'vena pulmonar', artPulm: 'arteria pulmonar', rinonD: 'riñón', ureterD: 'uréter', vejiga: 'vejiga', uretra: 'uretra',
    colonA: 'intestino grueso', recto: 'recto', ano: 'ano',
  };

  // Curva suave (Catmull-Rom) que pasa por los puntos: se usa para dibujar y para mover partículas.
  const pt = k => typeof k === 'string' ? P[k] : k;
  function tramos(pts) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      // Tangentes limitadas para que la curva no se pase de largo en los giros bruscos.
      const lim = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * 0.35;
      const tan = (u, v) => { const x = (v[0] - u[0]) / 6, y = (v[1] - u[1]) / 6, m = Math.hypot(x, y), f = m > lim ? lim / m : 1; return [x * f, y * f]; };
      const t1 = tan(p0, p2), t2 = tan(p1, p3);
      out.push([p1, [p1[0] + t1[0], p1[1] + t1[1]], [p2[0] - t2[0], p2[1] - t2[1]], p2]);
    }
    return out;
  }
  const suave = claves => { const pts = claves.map(pt); return `M${pts[0]}` + tramos(pts).map(([, a, b, c]) => ` C${a} ${b} ${c}`).join(''); };
  function muestrear(claves) {
    const pts = claves.map(pt), res = [pts[0]], marcas = [0];
    tramos(pts).forEach(([a, b, c, d]) => {
      for (let j = 1; j <= 10; j++) {
        const t = j / 10, u = 1 - t;
        res.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
      }
      marcas.push(res.length - 1);
    });
    const r = { pts: res, acum: largo(res) };
    r.total = r.acum[r.acum.length - 1];
    r.claves = claves.map((k, i) => ({ k, f: r.acum[marcas[i]] / (r.total || 1) }));
    return r;
  }
  function largo(pts) {
    const acum = [0];
    for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return acum;
  }
  function puntoEn(r, t) {
    const d = t * r.total;
    let i = 1;
    while (i < r.acum.length - 1 && r.acum[i] < d) i++;
    const [a, b] = [r.pts[i - 1], r.pts[i]], f = (d - r.acum[i - 1]) / (r.acum[i] - r.acum[i - 1] || 1);
    return [a[0] + (b[0] - a[0]) * Math.min(1, f), a[1] + (b[1] - a[1]) * Math.min(1, f)];
  }

  // Recorridos completos de cada sustancia (partes del viaje).
  const CAMINOS = {
    glucosa: [
      ['comida', 'boca', 'faringe', 'esofago', 'esofago2', 'cardias', 'estomago', 'piloro', 'duodeno', 'intestino'],
      ['intestino', 'portaV', 'higado', 'vcInf', 'corazon'],
      ['corazon', 'aortaA', 'arco', 'sub', 'hombroA', 'brazoA', 'zoomA', 'capIn', 'capMid', 'celula'],
    ],
    oxigeno: [
      ['aire', 'nariz', 'faringe', 'traquea', 'bifurc', 'bronqI', 'pulmonI'],
      ['pulmonI', 'venaPulm', 'corazon'],
      ['corazon', 'aortaA', 'arco', 'sub', 'hombroA', 'brazoA', 'zoomA', 'capIn', 'capMid', 'celula'],
    ],
    co2: [
      ['celula', 'capOut', 'capBaja', 'zoomV', 'brazoV', 'hombroV', 'subV', 'cuello', 'cuello2', 'vcSup', 'vcSup2', 'corazon'],
      ['corazon', 'artPulm', 'pulmonD', 'bronqD', 'bifurc', 'traquea', 'faringe'],
      ['faringe', 'nariz', [380, 52], 'salidaAire'],
    ],
    urea: [
      ['celula', 'capOut', 'capBaja', 'zoomV', 'brazoV', 'hombroV', 'subV', 'cuello', 'cuello2', 'vcSup', 'vcSup2', 'corazon'],
      ['corazon', 'aortaS', 'aortaD', 'renal', 'rinonD'],
      ['rinonD', 'ureterD', 'vejiga', 'uretra', 'orina'],
    ],
    fibra: [
      ['comida', 'boca', 'faringe', 'esofago', 'esofago2', 'cardias', 'estomago', 'piloro', 'duodeno', 'intestino', 'fin', 'ciego', 'colonA', 'colonA2', 'colonT', 'colonT2', 'colonD', 'sigma', 'recto'],
      ['recto', 'ano', 'heces'],
    ],
  };
  const unir = partes => partes.reduce((a, p) => a.concat(a.length ? p.slice(1) : p), []);
  const RUTAS = {
    nutrientes: { n: 'Nutrientes', sist: ['digestivo', 'circulatorio'], ...muestrear(unir(CAMINOS.glucosa)) },
    oxigeno: { n: 'Oxígeno (O₂)', sist: ['respiratorio', 'circulatorio'], ...muestrear(unir(CAMINOS.oxigeno)) },
    co2: { n: 'Dióxido de carbono (CO₂)', sist: ['circulatorio', 'respiratorio'], ...muestrear(unir(CAMINOS.co2)) },
    desechos: { n: 'Agua y desechos', sist: ['circulatorio', 'excretor'], ...muestrear(unir(CAMINOS.urea)) },
    heces: { n: 'Materia fecal', sist: ['digestivo'], ...muestrear(['intestino', 'fin', 'ciego', 'colonA', 'colonA2', 'colonT', 'colonT2', 'colonD', 'sigma', 'recto', 'ano', 'heces']) },
  };

  // ---------- Partículas ilustradas ----------
  const PART = {
    nutrientes: (x, y) => `<polygon points="${[-90, -30, 30, 90, 150, 210].map(a => `${(x + 5.5 * Math.cos(a * Math.PI / 180)).toFixed(1)},${(y + 5.5 * Math.sin(a * Math.PI / 180)).toFixed(1)}`).join(' ')}" fill="#ffd166"/>`,
    oxigeno: (x, y) => `<circle cx="${x - 3.6}" cy="${y}" r="4.4" fill="#ff6b6b"/><circle cx="${x + 3.6}" cy="${y}" r="4.4" fill="#ff8787"/><circle cx="${x - 4.6}" cy="${y - 1.6}" r="1.3" fill="#fff" opacity="0.7"/>`,
    co2: (x, y) => `<circle cx="${x - 6.4}" cy="${y}" r="3.6" fill="#ff6b6b"/><circle cx="${x + 6.4}" cy="${y}" r="3.6" fill="#ff6b6b"/><circle cx="${x}" cy="${y}" r="4.6" fill="#495057"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.2" fill="#fff" opacity="0.6"/>`,
    desechos: (x, y) => `<path d="M${x},${y - 6} c5,6 4,10 0,10 c-4,0 -5,-4 0,-10 Z" fill="#94d82d"/><circle cx="${x - 1.5}" cy="${y + 0.5}" r="1.2" fill="#fff" opacity="0.7"/>`,
    heces: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.4" fill="#8d5a3b"/><ellipse cx="${x - 1.5}" cy="${y - 1.4}" rx="2" ry="1" fill="#c08a64"/>`,
  };

  // ---------- Dibujo del cuerpo (estilo ilustrado, con volumen) ----------
  function cara(x, y, r, animo = 'feliz') {
    const boca = {
      feliz: `<path d="M${x - r * 0.9},${y + r * 1.5} q${r * 0.9},${r * 0.9} ${r * 1.8},0" stroke="#15163d" stroke-width="${r * 0.32}" fill="none" stroke-linecap="round"/>`,
      triste: `<path d="M${x - r * 0.8},${y + r * 2} q${r * 0.8},${-r * 0.8} ${r * 1.6},0" stroke="#15163d" stroke-width="${r * 0.32}" fill="none" stroke-linecap="round"/>`,
      mareado: `<path d="M${x - r * 0.8},${y + r * 1.8} q${r * 0.4},${-r * 0.4} ${r * 0.8},0 t${r * 0.8},0" stroke="#15163d" stroke-width="${r * 0.3}" fill="none" stroke-linecap="round"/>`,
    }[animo];
    const ojos = animo === 'mareado'
      ? [-1.2, 1.2].map(k => `<path d="M${x + k * r - r * 0.5},${y - r * 0.5} l${r},${r} M${x + k * r + r * 0.5},${y - r * 0.5} l${-r},${r}" stroke="#15163d" stroke-width="${r * 0.3}" stroke-linecap="round"/>`).join('')
      : `${ojo(x - r * 1.2, y, r)}${ojo(x + r * 1.2, y, r)}`;
    return ojos + boca + (animo === 'feliz' ? `<circle cx="${x - r * 2.1}" cy="${y + r * 1.1}" r="${r * 0.5}" fill="#ff6b9d" opacity="0.45"/><circle cx="${x + r * 2.1}" cy="${y + r * 1.1}" r="${r * 0.5}" fill="#ff6b9d" opacity="0.45"/>` : '');
  }
  const brillo = (d, w = 3) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0.45"/>`;
  const vaso = (d, color, ancho) => `<path d="${d}" stroke="#05061a" stroke-width="${ancho + 5}" fill="none" stroke-linecap="round" opacity="0.35"/>
    <path d="${d}" stroke="${color[1]}" stroke-width="${ancho}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${color[0]}" stroke-width="${ancho * 0.5}" fill="none" stroke-linecap="round" transform="translate(-1 -1.5)"/>`;
  const ROJO = ['#ff8787', '#d63c3c'], AZUL = ['#7aa7ff', '#3f63c9'];

  // Tubo con volumen (sombra, color oscuro y reflejo claro) que sigue una curva suave.
  const tubo = (claves, [claro, oscuro], ancho) => { const d = suave(claves); return `<path d="${d}" stroke="#05061a" stroke-width="${ancho + 4}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>
    <path d="${d}" stroke="${oscuro}" stroke-width="${ancho}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${claro}" stroke-width="${ancho * 0.45}" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(-0.8 -1)"/>`; };
  // Tangentes exteriores entre dos círculos (para el cono de la lupa).
  function tangentes([x1, y1], r1, [x2, y2], r2) {
    const a = Math.atan2(y2 - y1, x2 - x1), b = Math.acos((r1 - r2) / Math.hypot(x2 - x1, y2 - y1));
    return [a + b, a - b].map(t => [[x1 + r1 * Math.cos(t), y1 + r1 * Math.sin(t)], [x2 + r2 * Math.cos(t), y2 + r2 * Math.sin(t)]]);
  }
  // Rótulos de los órganos con línea guía: [texto, x del rótulo, y, punto del órgano].
  const ROTULOS = [
    ['tráquea', 454, 92, [294, 118]], ['esófago', 454, 112, [309, 132]], ['corazón', 454, 206, [340, 214]], ['estómago', 454, 290, [368, 286]],
    ['riñones', 454, 350, [404, 340]], ['vejiga', 454, 440, [334, 436]],
    ['pulmones', 150, 186, [232, 186]], ['hígado', 150, 272, [236, 280]], ['intestino grueso', 150, 318, [252, 318]],
    ['intestino delgado', 150, 372, [276, 372]], ['diafragma', 150, 244, [220, 250]],
  ];

  // off = sistemas desconectados; animo de la célula.
  function escena(off = new Set(), animoCelula = 'feliz') {
    const o = id => off.has(id) ? 'nu-off' : '';
    const enchufe = (id, x, y) => off.has(id) ? `<g transform="translate(${x} ${y})"><circle r="13" fill="#12143a" stroke="#ff6b6b" stroke-width="2.5"/><path d="M-5,-5 L5,5 M5,-5 L-5,5" stroke="#ff6b6b" stroke-width="3" stroke-linecap="round"/></g>` : '';
    const [lx, ly] = ZOOM.c, [cx, cy] = CEL;
    let s = `<defs>
        <radialGradient id="nu-fondo" cx="0.45" cy="0.4" r="0.85"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="nu-cito" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#5a4bb0"/><stop offset="1" stop-color="#342a7c"/></radialGradient>
        <radialGradient id="nu-tejido" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#2c2468"/><stop offset="1" stop-color="#1a1545"/></radialGradient>
        <radialGradient id="nu-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#b197fc" stop-opacity="0.35"/><stop offset="1" stop-color="#b197fc" stop-opacity="0"/></radialGradient>
        <linearGradient id="nu-cap" gradientUnits="userSpaceOnUse" x1="0" y1="140" x2="0" y2="380"><stop offset="0.2" stop-color="#ff6b6b"/><stop offset="0.8" stop-color="#5b7cfa"/></linearGradient>
        <linearGradient id="nu-cap2" gradientUnits="userSpaceOnUse" x1="0" y1="140" x2="0" y2="380"><stop offset="0.2" stop-color="#c83a3a"/><stop offset="0.8" stop-color="#3a55c0"/></linearGradient>
        <clipPath id="nu-lente"><circle cx="${lx}" cy="${ly}" r="${ZOOM.R}"/></clipPath>
        <filter id="nu-brillo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#nu-fondo)"/>
      ${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 97.3) % W}" cy="${(i * 53.9) % H}" r="${0.7 + (i % 3) * 0.5}" fill="#c9ccf5" opacity="${0.15 + (i % 4) * 0.08}"/>`).join('')}`;
    // Silueta del cuerpo con brazos.
    const cuerpo = 'M300,100 C262,100 246,106 222,114 C200,121 192,138 192,166 L194,300 C196,360 206,420 222,470 L378,470 C394,420 404,360 406,300 L408,166 C408,138 400,121 378,114 C354,106 338,100 300,100 Z';
    const brazos = '<rect x="-17" y="0" width="34" height="236" rx="17" fill="FILL" transform="translate(206 124) rotate(10)"/><rect x="-17" y="0" width="34" height="236" rx="17" fill="FILL" transform="translate(394 124) rotate(-10)"/><circle cx="165" cy="358" r="18" fill="FILL"/><circle cx="435" cy="358" r="18" fill="FILL"/>';
    s += `<ellipse cx="300" cy="478" rx="150" ry="10" fill="#05061a" opacity="0.5"/>
      ${dosTonos(brazos, '#2d3280', '#232868', { x: 300 })}
      ${dosTonos(`<path d="${cuerpo}" fill="FILL"/><rect x="284" y="84" width="32" height="24" fill="FILL"/><circle cx="300" cy="56" r="38" fill="FILL"/>`, '#2a2f76', '#20245f', { x: 312 })}
      ${brillo('M200,172 C198,140 212,122 236,116', 4)}${brillo('M272,32 a38,38 0 0 1 22,-12', 3)}
      <path d="M284,50 a3.4,3.4 0 0 1 7,0 M309,50 a3.4,3.4 0 0 1 7,0" stroke="#9aa3ff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
      <path d="M300,56 q-4,6 0,9" stroke="#9aa3ff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M293,76 q7,5 14,0" stroke="#ff8fab" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="M212,252 C250,236 350,236 390,252" stroke="#4a4f9e" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    // Sistema excretor: riñones, uréteres, vejiga y uretra.
    s += `<g class="nu-sistema ${o('excretor')}" data-s="excretor">
      ${tubo([[222, 358], [250, 396], [310, 428]], ['#fff1c2', '#e0b04a'], 3.6)}${tubo([[378, 358], 'ureterD', [332, 428]], ['#fff1c2', '#e0b04a'], 3.6)}
      ${[[P.rinonI, 1], [P.rinonD, -1]].map(([[x, y], k]) => `<g transform="translate(${x - k * 6} ${y}) scale(${k} 1)">${dosTonos('<path d="M-4,-24 C18,-28 26,-8 22,10 C18,26 -2,30 -12,20 C-6,12 -4,2 -10,-6 C-16,-16 -14,-22 -4,-24 Z" fill="FILL"/>', '#e8707a', '#b94a55', { x: 8 })}${brillo('M-6,-18 a18,16 0 0 1 16,-2', 2.4)}</g>`).join('')}
      ${tubo(['vejiga', 'uretra'], ['#fff1c2', '#e0b04a'], 3.4)}
      ${dosTonos('<path d="M308,428 C308,414 336,414 336,428 C338,444 328,452 322,452 C316,452 306,444 308,428 Z" fill="FILL"/>', '#ffd166', '#f0a830', { x: 324 })}
      ${brillo('M312,424 a10,8 0 0 1 8,-6', 2)}
      ${cara(P.rinonI[0] + 2, 336, 2.4)}${cara(P.rinonD[0] - 2, 336, 2.4)}${enchufe('excretor', 390, 300)}</g>`;
    // Sistema respiratorio: tráquea, bronquios y pulmones.
    s += `<g class="nu-sistema ${o('respiratorio')}" data-s="respiratorio">
      ${dosTonos('<path d="M282,150 C282,134 268,128 252,134 C228,144 218,178 220,208 C222,228 242,232 258,224 C276,214 284,192 282,150 Z" fill="FILL"/>', '#ffa8c5', '#e06f97', { x: 258 })}
      ${dosTonos('<path d="M320,150 C320,134 334,128 350,134 C374,144 384,178 382,208 C380,228 360,232 344,224 C326,214 318,192 320,150 Z" fill="FILL"/>', '#ffa8c5', '#e06f97', { x: 356 })}
      <path d="M266,166 q-10,16 -8,34 M258,176 l-12,10 M334,166 q10,16 8,34 M342,176 l12,10" stroke="#ffd1e0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>
      ${tubo(['faringe', 'traquea', 'bifurc'], ['#eef2ff', '#aab8e8'], 7)}${tubo(['bifurc', 'bronqI', 'pulmonI'], ['#eef2ff', '#aab8e8'], 5)}${tubo(['bifurc', 'bronqD', 'pulmonD'], ['#eef2ff', '#aab8e8'], 5)}
      ${[104, 112, 120, 128].map(y => `<path d="M${288 - (y - 104) * 0.05},${y} h8" stroke="#8795cc" stroke-width="1.6" stroke-linecap="round"/>`).join('')}
      ${brillo('M230,168 C232,150 240,140 250,136')}${cara(244, 206, 3.2)}${cara(358, 206, 3.2)}
      <circle cx="300" cy="64" r="10" fill="transparent"/>${enchufe('respiratorio', 212, 150)}</g>`;
    // Sistema circulatorio: arterias (rojo) y venas (azul).
    s += `<g class="nu-sistema ${o('circulatorio')}" data-s="circulatorio">
      ${tubo(['brazoV', 'hombroV', 'subV', 'cuello', 'cuello2', 'vcSup', 'vcSup2', [288, 212]], AZUL, 6)}${tubo([[284, 236], 'vcInf', [282, 352], [282, 462]], AZUL, 6)}
      ${tubo([[222, 350], [282, 352]], AZUL, 3.5)}${tubo([[378, 350], [282, 352]], AZUL, 3.5)}${tubo(['intestino', 'portaV', 'higado'], AZUL, 4)}
      ${tubo([[310, 208], 'artPulm', 'pulmonD'], AZUL, 5)}${tubo([[432, 350], [428, 300], 'brazoV'], AZUL, 5)}
      ${tubo([[320, 204], 'aortaA', 'arco', 'sub', 'hombroA', 'brazoA', [418, 300], [424, 350]], ROJO, 6)}${tubo(['aortaS', 'aortaD', 'renal', [322, 462]], ROJO, 6)}
      ${tubo(['renal', [350, 334], [374, 337]], ROJO, 3.5)}${tubo(['renal', [270, 334], [226, 337]], ROJO, 3.5)}${tubo(['pulmonI', 'venaPulm', [296, 214]], ROJO, 5)}</g>`;
    // Sistema digestivo: esófago, hígado, estómago e intestinos.
    s += `<g class="nu-sistema ${o('digestivo')}" data-s="digestivo">
      ${tubo(['faringe', 'esofago', 'esofago2', 'cardias'], ['#ffb3c6', '#d65a80'], 7)}
      ${tubo(['ciego', 'colonA', 'colonA2', 'colonT', 'colonT2', 'colonD', 'sigma', 'recto', 'ano'], ['#f28aa6', '#b83a5e'], 14)}
      ${tubo(['piloro', 'duodeno', [286, 342], [330, 346], [334, 356], [280, 360], [276, 370], [330, 374], [334, 384], 'fin', 'ciego'], ['#ffc2d1', '#d9577c'], 9)}
      ${dosTonos('<path d="M222,262 C240,250 292,252 314,262 C308,282 284,302 254,302 C232,302 218,286 222,262 Z" fill="FILL"/>', '#c97a55', '#9a5236', { y: 284 })}
      ${brillo('M232,262 a30,10 0 0 1 30,-6', 2.4)}
      ${dosTonos('<path d="M330,262 C344,250 372,256 374,278 C376,302 360,318 336,318 C318,318 312,306 316,296 C322,286 330,286 330,262 Z" fill="FILL"/>', '#ff8fab', '#e0607f', { y: 296 })}
      ${brillo('M336,262 a18,14 0 0 1 20,-2', 2.6)}
      ${cara(346, 284, 3)}${cara(262, 276, 2.6)}${enchufe('digestivo', 388, 262)}</g>`;
    // El corazón (late) va por encima de los vasos.
    s += `<g class="nu-sistema ${o('circulatorio')}" data-s="circulatorio"><g class="nu-latido">
      ${dosTonos('<path d="M312,250 C290,236 276,222 278,208 C280,196 294,192 304,200 L312,207 L320,200 C330,192 344,196 346,208 C348,222 334,236 312,250 Z" fill="FILL"/>', '#ff6b6b', '#d63c3c', { x: 318 })}
      ${brillo('M286,206 a10,10 0 0 1 10,-8', 2.6)}${cara(308, 216, 2.8)}</g>
      ${enchufe('circulatorio', 348, 246)}</g>`;
    // Lupa: un pedacito del brazo ampliado, con un capilar y las células.
    const [[a1, b1], [a2, b2]] = tangentes(ZOOM.spot, ZOOM.r, ZOOM.c, ZOOM.R);
    s += `<g class="nu-sistema" data-s="celula">
      <path d="M${a1} L${b1} A${ZOOM.R},${ZOOM.R} 0 0 0 ${b2} L${a2} Z" fill="#b197fc" opacity="0.1"/>
      <path d="M${a1} L${b1} M${a2} L${b2}" stroke="#c9b8ff" stroke-width="1.6" stroke-dasharray="5 5" opacity="0.7"/>
      <circle cx="${ZOOM.spot[0]}" cy="${ZOOM.spot[1]}" r="${ZOOM.r}" fill="#b197fc" fill-opacity="0.15" stroke="#e5dbff" stroke-width="2.4"/>
      <circle cx="${lx + 7}" cy="${ly + 10}" r="${ZOOM.R}" fill="#05061a" opacity="0.45"/>
      <g clip-path="url(#nu-lente)">
        <circle cx="${lx}" cy="${ly}" r="${ZOOM.R}" fill="url(#nu-tejido)"/>
        ${[[712, 132, 52], [738, 356, 60], [640, 392, 44], [640, 108, 40]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3a2f82" stroke="#8f3d72" stroke-width="5"/><circle cx="${x - r * 0.2}" cy="${y - r * 0.1}" r="${r * 0.32}" fill="#5f4bc4"/>`).join('')}
        <path d="M536,120 C558,200 546,300 570,390" stroke="#05061a" stroke-width="40" fill="none" opacity="0.35"/>
        <path d="M536,120 C558,200 546,300 570,390" stroke="url(#nu-cap2)" stroke-width="34" fill="none"/>
        <path d="M536,120 C558,200 546,300 570,390" stroke="url(#nu-cap)" stroke-width="26" fill="none"/>
        ${[[544, 170], [552, 214], [550, 262], [556, 318], [564, 352]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" transform="rotate(${70 + i * 4} ${x} ${y})" fill="${i < 3 ? '#e03131' : '#4c6ef5'}" stroke="#05061a" stroke-opacity="0.3"/>`).join('')}
        <path d="M530,130 C548,190 540,250 542,300" stroke="#fff" stroke-width="3" fill="none" opacity="0.3" stroke-linecap="round"/>
        <circle cx="${cx + 5}" cy="${cy + 8}" r="66" fill="#05061a" opacity="0.4"/>
        <circle cx="${cx}" cy="${cy}" r="66" fill="#d94d8a"/><circle cx="${cx}" cy="${cy}" r="59" fill="url(#nu-cito)"/>
        <path d="M${cx - 48},${cy - 30} a59,59 0 0 1 36,-26" stroke="#ffd1e6" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <g transform="translate(${cx + 6} ${cy - 6})">${dosTonos('<circle r="24" fill="FILL"/>', '#8b6cf0', '#6a4ce0', { x: 8 })}<circle r="18" fill="#b9a4ff"/>
          ${cara(-2, -3, 3.4, animoCelula)}</g>
        ${[[cx + 30, cy + 34, -20], [cx - 30, cy + 30, 30], [cx + 34, cy - 36, 10]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(0.42)">${dosTonos('<rect x="-34" y="-16" width="68" height="32" rx="16" fill="FILL"/>', '#ff7b54', '#e0563a', { y: 5 })}<rect x="-29" y="-11" width="58" height="22" rx="11" fill="#ffc07a"/>${[-20, -8, 4, 16].map((dx, i) => `<rect x="${dx - 2.6}" y="${i % 2 ? -1 : -11}" width="5.2" height="12" rx="2.6" fill="#ff8d5c"/>`).join('')}</g>`).join('')}
      </g>
      <circle cx="${lx}" cy="${ly}" r="${ZOOM.R}" fill="none" stroke="#e5dbff" stroke-width="5"/>
      <path d="M${lx - 88},${ly - 62} a${ZOOM.R - 10},${ZOOM.R - 10} 0 0 1 58,-44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.5"/>
      <text x="${lx}" y="${ly - ZOOM.R - 12}" text-anchor="middle" class="nu-rotulo">🔍 ZOOM: CÉLULAS DEL BRAZO</text>
      <text x="${lx}" y="${ly + ZOOM.R + 20}" text-anchor="middle" class="nu-sub">la sangre llega por los capilares</text>
      <text x="584" y="${ly - 92}" class="nu-mini" text-anchor="middle">capilar</text><text x="${cx}" y="${cy + 84}" class="nu-mini" text-anchor="middle">célula</text>
    </g>`;
    // Rótulos de los órganos (se ocultan durante el viaje).
    s += `<g class="nu-org-etq">${ROTULOS.map(([t, x, y, [px, py]]) => `<path d="M${x + (x < 300 ? 4 : -4)},${y - 3} L${px},${py}" stroke="#c9ccf5" stroke-width="1" stroke-dasharray="2 3" opacity="0.6"/><circle cx="${px}" cy="${py}" r="2" fill="#c9ccf5"/><text x="${x}" y="${y}" text-anchor="${x < 300 ? 'end' : 'start'}" class="nu-org">${t}</text>`).join('')}</g>`;
    // Entradas y salidas del ambiente.
    s += `${Alimentacion.alimento('pan', 88, 92, 0.9)}${Alimentacion.alimento('manzana', 58, 96, 0.75)}${Alimentacion.alimento('agua', 116, 112, 0.6)}
      <text x="84" y="132" text-anchor="middle" class="nu-rotulo">ALIMENTOS</text>
      <g opacity="0.8">${[0, 1, 2].map(i => `<path d="M${54 + i * 16},${34 + i * 6} q10,-6 20,0 t20,0" stroke="#bfe8ff" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g>
      <text x="84" y="22" text-anchor="middle" class="nu-rotulo">AIRE INSPIRADO</text>
      <text x="${P.salidaAire[0] + 10}" y="30" text-anchor="middle" class="nu-rotulo">AIRE ESPIRADO</text>
      <text x="${P.orina[0] + 34}" y="486" text-anchor="middle" class="nu-sub">orina</text>
      <text x="${P.heces[0] - 46}" y="486" text-anchor="middle" class="nu-sub">materia fecal</text>`;
    return s;
  }

  // ---------- Estado y vistas ----------
  let raiz, modo = 'explorar', sel = null, anim = null, ultimo = 0, reloj = 0;
  let off = new Set(), niveles = null, viaje = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🫀 Sistemas de la nutrición</h1>
        <p>Para nutrirnos no alcanza con el sistema digestivo: <b>cuatro sistemas trabajan juntos</b> para que cada célula reciba lo que necesita y se libre de sus desechos.</p>
      </div>
      <div class="segmentado" id="nu-modos">
        <button data-m="explorar">🧍 Explorar el cuerpo</button>
        <button data-m="viaje">🧭 Seguí el viaje</button>
        <button data-m="quepasa">⚠️ ¿Qué pasa si…?</button>
        <button data-m="esquema">🧩 Completar el esquema</button>
        <button data-m="ciudad">🏙️ La ciudad</button>
      </div>
      <div class="nu-grid">
        <div class="panel nu-escena"><svg id="nu-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Los sistemas que intervienen en la nutrición"><g id="nu-fijo"></g><g id="nu-part" filter="url(#nu-brillo)"></g><g id="nu-ui"></g></svg>
          <div class="nu-refs">${Object.keys(RUTAS).map(k => `<span><svg viewBox="-9 -8 18 16" width="18" height="16">${PART[k](0, 0)}</svg>${RUTAS[k].n}</span>`).join('')}</div>
          <div id="nu-controles"></div>
        </div>
        <aside class="panel nu-info" id="nu-info"></aside>
      </div>
      <div id="nu-alt" hidden></div>`;
    raiz.querySelectorAll('#nu-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    raiz.querySelector('#nu-svg').addEventListener('click', e => {
      const g = e.target.closest('[data-s]');
      if (!g || modo !== 'explorar') return;
      sel = g.dataset.s;
      marcar();
      pintarInfo();
    });
    cambiarModo('explorar');
  }

  function cambiarModo(m) {
    modo = m;
    sel = null;
    off = new Set();
    viaje = null;
    niveles = { nutrientes: 85, oxigeno: 90, desechos: 15, energia: 90 };
    raiz.querySelectorAll('#nu-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    // Completar el esquema y La ciudad tienen su propia escena (nutricion-extra.js).
    const aparte = m === 'esquema' || m === 'ciudad', alt = raiz.querySelector('#nu-alt');
    raiz.querySelector('.nu-grid').style.display = aparte ? 'none' : '';
    alt.hidden = !aparte;
    if (aparte) { alt.innerHTML = ''; NutriExtra[m](alt); return; }
    alt.innerHTML = '';
    raiz.querySelector('#nu-svg').classList.toggle('modo-viaje', m === 'viaje');
    redibujar();
    if (m === 'explorar') vistaExplorar();
    else if (m === 'viaje') vistaViaje();
    else vistaQuePasa();
    cancelAnimationFrame(anim);
    ultimo = performance.now();
    anim = requestAnimationFrame(bucle);
  }

  function redibujar() {
    const animo = niveles && niveles.energia < 35 ? (off.has('circulatorio') ? 'mareado' : 'triste') : 'feliz';
    const clave = [...off].join() + animo;
    const fijo = raiz.querySelector('#nu-fijo');
    if (fijo.dataset.clave !== clave) {
      fijo.dataset.clave = clave;
      fijo.innerHTML = escena(off, animo);
    }
    marcar();
  }

  function marcar() {
    const svg = raiz.querySelector('#nu-svg');
    svg.classList.toggle('con-sel', !!sel);
    svg.querySelectorAll('.nu-sistema').forEach(g => g.classList.toggle('sel', g.dataset.s === sel));
  }

  // Animación: partículas que recorren cada ruta (se detienen si pasan por un sistema desconectado).
  function bucle(t) {
    const dt = Math.min(0.05, (t - ultimo) / 1000);
    ultimo = t;
    // Con la pestaña oculta no se dibuja, pero el ciclo sigue para retomar al volver.
    if (raiz.hidden || modo === 'esquema' || modo === 'ciudad') { anim = requestAnimationFrame(bucle); return; }
    reloj += dt;
    let s = '';
    const flujos = modo !== 'viaje' || !viaje;
    if (flujos) {
      Object.entries(RUTAS).forEach(([k, r]) => {
        if (r.sist.some(x => off.has(x))) return;
        const n = k === 'heces' ? 2 : 5, dur = r.total / 55;
        for (let i = 0; i < n; i++) { const [x, y] = puntoEn(r, ((reloj / dur) + i / n) % 1); s += PART[k](x, y); }
      });
    }
    // Acumulación en la célula cuando algo falla.
    if (modo === 'quepasa' && niveles) {
      const [cx, cy] = CEL, nd = Math.round((niveles.desechos - 20) / 10);
      for (let i = 0; i < nd; i++) { const a = i * 2.3 + reloj * 0.4, r = 32 + (i % 3) * 9; s += PART[i % 2 ? 'co2' : 'desechos'](cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9); }
      actualizarNiveles(dt);
    }
    if (viaje) s += dibujarViajero();
    raiz.querySelector('#nu-part').innerHTML = s;
    anim = requestAnimationFrame(bucle);
  }

  // ---------- 1. Explorar ----------
  function vistaExplorar() {
    raiz.querySelector('#nu-controles').innerHTML = `<p class="nu-ayuda-esc">👆 Tocá cada sistema o la célula para ver qué hace. Las partículas muestran cómo viaja cada sustancia.</p>`;
    raiz.querySelector('#nu-ui').innerHTML = '';
    pintarInfo();
  }

  function pintarInfo() {
    const info = raiz.querySelector('#nu-info');
    if (modo !== 'explorar') return;
    if (!sel) {
      info.innerHTML = `<h2>🧍 La nutrición</h2>
        <p>Mediante la <b>nutrición</b> obtenemos de los alimentos la <b>materia</b> y la <b>energía</b> que necesitamos. En ella intervienen cuatro sistemas:</p>
        <div class="nu-lista">${['digestivo', 'respiratorio', 'circulatorio', 'excretor'].map(k => `<button data-s="${k}"><i style="background:${SISTEMAS[k].c}"></i>${SISTEMAS[k].e} ${SISTEMAS[k].n}</button>`).join('')}</div>
        <p class="nu-ayuda">Todos trabajan para lo mismo: que cada <b>célula</b> reciba nutrientes y oxígeno, y se libre de sus desechos.</p>`;
      info.querySelectorAll('.nu-lista button').forEach(b => b.addEventListener('click', () => { sel = b.dataset.s; marcar(); pintarInfo(); }));
      return;
    }
    const S = SISTEMAS[sel];
    info.innerHTML = `<h2><i class="nu-punto" style="background:${S.c}"></i>${S.e} ${S.n}</h2>
      <p>${S.funcion}</p>
      <h3>Órganos</h3><div class="nu-chips">${S.organos.map(o => `<span>${o}</span>`).join('')}</div>
      <div class="nu-io"><div><h3>⬇️ Recibe</h3><ul>${S.recibe.map(x => `<li>${x}</li>`).join('')}</ul></div><div><h3>⬆️ Entrega</h3><ul>${S.entrega.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
      <p class="nu-analogia">💡 ${S.analogia}</p>
      <button class="btn chico" id="nu-volver">← Ver todos los sistemas</button>`;
    info.querySelector('#nu-volver').addEventListener('click', () => { sel = null; marcar(); pintarInfo(); });
  }

  // ---------- 2. Seguí el viaje ----------
  const DESTINOS = {
    digestivo: 'Sistema digestivo', respiratorio: 'Sistema respiratorio', circulatorio: 'Sistema circulatorio', excretor: 'Sistema excretor',
    celula: 'Las células', aire: 'Sale con el aire espirado', orina: 'Sale con la orina', heces: 'Sale con la materia fecal',
  };
  const VIAJEROS = [
    { id: 'glucosa', n: 'Glucosa del pan', part: 'nutrientes', intro: 'Comiste un pedazo de pan. Su almidón se va a convertir en <b>glucosa</b>, un nutriente que da energía.',
      pasos: [
        { ok: 'digestivo', pista: 'El pan entra por la boca. ¿Qué sistema lo transforma en nutrientes?', texto: 'En la boca, el estómago y el intestino el pan se <b>digiere</b>: el almidón se rompe en glucosa, un nutriente muy pequeño.' },
        { ok: 'circulatorio', pista: 'La glucosa está en el intestino. ¿A qué sistema pasa para viajar por el cuerpo?', texto: 'Atraviesa la pared del intestino delgado y pasa a la <b>sangre</b> (absorción). La <b>vena porta</b> la lleva al hígado y la <b>vena cava</b>, hasta el <b>corazón</b>.' },
        { ok: 'celula', pista: '¿A dónde la lleva la sangre?', texto: 'El corazón la bombea por las <b>arterias</b> hasta los <b>capilares</b>, que pasan al lado de cada célula. Entra a la <b>célula</b> y, junto con el oxígeno, se usa para obtener <b>energía</b>. ¡Llegó a destino!' },
      ] },
    { id: 'oxigeno', n: 'Oxígeno del aire', part: 'oxigeno', intro: 'Respiraste hondo. Seguí a una molécula de <b>oxígeno</b> desde el aire.',
      pasos: [
        { ok: 'respiratorio', pista: 'El aire entra por la nariz. ¿Qué sistema lo recibe?', texto: 'Entra por la <b>nariz</b>, pasa por la faringe, la <b>tráquea</b> y los <b>bronquios</b> hasta llegar a los <b>alvéolos</b> de los pulmones.' },
        { ok: 'circulatorio', pista: 'El oxígeno está en los pulmones. ¿Cómo sigue viaje?', texto: 'En los alvéolos pasa a la <b>sangre</b> y se une a los glóbulos rojos. La <b>vena pulmonar</b> lo lleva al <b>corazón</b>.' },
        { ok: 'celula', pista: '¿Quién necesita ese oxígeno?', texto: 'El corazón lo bombea por las <b>arterias</b> hasta los <b>capilares</b>. Desde ahí entra a las <b>células</b>, que lo usan para "quemar" la glucosa y obtener energía (respiración celular).' },
      ] },
    { id: 'co2', n: 'Dióxido de carbono', part: 'co2', intro: 'Al obtener energía, la célula produce <b>dióxido de carbono</b>, un desecho que hay que sacar del cuerpo.',
      pasos: [
        { ok: 'circulatorio', pista: 'El CO₂ sale de la célula. ¿Qué sistema lo recoge?', texto: 'Sale de la célula y entra al <b>capilar</b>. La sangre lo lleva por las <b>venas</b> y la <b>vena cava</b> hasta el <b>corazón</b>.' },
        { ok: 'respiratorio', pista: '¿Hacia qué sistema lo lleva la sangre para eliminarlo?', texto: 'El corazón lo manda por la <b>arteria pulmonar</b> a los <b>pulmones</b>. En los alvéolos pasa de la sangre al aire y sube por los bronquios y la tráquea.' },
        { ok: 'aire', pista: '¿Cómo sale del cuerpo?', texto: 'Sale por la nariz con el <b>aire espirado</b> cada vez que exhalamos.' },
      ] },
    { id: 'urea', n: 'Un desecho (urea)', part: 'desechos', intro: 'Las células también producen otros desechos, como la <b>urea</b>, y agua que sobra.',
      pasos: [
        { ok: 'circulatorio', pista: 'La urea sale de la célula. ¿Quién la transporta?', texto: 'Sale de la célula al <b>capilar</b>. La sangre la lleva por las <b>venas</b> hasta el <b>corazón</b>.' },
        { ok: 'excretor', pista: '¿Qué órganos filtran la sangre para limpiarla?', texto: 'El corazón la bombea por la <b>arteria aorta</b> hasta los <b>riñones</b>, que filtran la sangre y separan la urea y el agua que sobra.' },
        { ok: 'orina', pista: '¿Cómo sale del cuerpo?', texto: 'Forma la <b>orina</b>, que baja por los <b>uréteres</b>, se guarda en la <b>vejiga</b> y sale por la <b>uretra</b>.' },
      ] },
    { id: 'fibra', n: 'Fibra de la manzana', part: 'heces', intro: 'La manzana tiene <b>fibra</b>, que nuestro cuerpo no puede digerir. ¿Qué le pasa?',
      pasos: [
        { ok: 'digestivo', pista: '¿Por qué sistema pasa primero?', texto: 'Recorre la boca, el esófago, el estómago y el <b>intestino delgado</b>, pero no se descompone en nutrientes: no pasa a la sangre. Sigue hasta el <b>intestino grueso</b>, donde ayuda a formar la materia fecal.' },
        { ok: 'heces', pista: 'Como no se absorbe, ¿cómo sale del cuerpo?', texto: 'Llega al <b>recto</b> como parte de la <b>materia fecal</b> y se elimina por el <b>ano</b>.' },
      ] },
  ];

  function vistaViaje() {
    raiz.querySelector('#nu-ui').innerHTML = '';
    raiz.querySelector('#nu-controles').innerHTML = `<div class="nu-viajeros">${VIAJEROS.map(v => `<button data-v="${v.id}"><svg viewBox="-10 -9 20 18" width="20" height="18">${PART[v.part](0, 0)}</svg>${v.n}</button>`).join('')}</div>`;
    raiz.querySelectorAll('.nu-viajeros button').forEach(b => b.addEventListener('click', () => empezarViaje(b.dataset.v)));
    raiz.querySelector('#nu-info').innerHTML = `<h2>🧭 Seguí el viaje</h2><p>Elegí un viajero y acompañalo por el cuerpo. En cada paso, decidí <b>a qué sistema va</b>.</p>
      <p class="nu-ayuda">Mientras no elijas, las partículas muestran todos los recorridos a la vez.</p>`;
  }

  function empezarViaje(id) {
    const v = VIAJEROS.find(x => x.id === id);
    viaje = { v, i: 0, pos: pt(CAMINOS[id][0][0]).slice(), rastro: [], fines: [], vistas: [], errores: 0, moviendo: null, historia: [] };
    raiz.querySelectorAll('.nu-viajeros button').forEach(b => b.classList.toggle('activo', b.dataset.v === id));
    pintarViaje();
  }

  function pintarViaje(error) {
    const { v, i } = viaje, fin = i >= v.pasos.length, paso = v.pasos[i];
    const info = raiz.querySelector('#nu-info');
    let opciones = '';
    if (!fin) {
      if (!viaje.opciones || viaje.opcionesPaso !== i) {
        const otras = Util.mezclar(Object.keys(DESTINOS).filter(k => k !== paso.ok)).slice(0, 2);
        viaje.opciones = Util.mezclar([paso.ok, ...otras]);
        viaje.opcionesPaso = i;
      }
      opciones = `<p class="nu-pregunta">${paso.pista}</p><div class="nu-opciones">${viaje.opciones.map(k => `<button class="btn-opcion nu-op" data-d="${k}">${DESTINOS[k]}</button>`).join('')}</div>`;
    }
    info.innerHTML = `<h2><svg viewBox="-10 -9 20 18" width="26" height="22">${PART[v.part](0, 0)}</svg> ${v.n}</h2>
      <p>${v.intro}</p>
      <ol class="nu-pasos">${viaje.historia.map(h => `<li>${h}</li>`).join('')}</ol>
      ${error ? `<p class="nu-error">✖ ${error}</p>` : ''}
      ${fin ? `<div class="feedback ok"><p class="fb-titulo">🏁 ¡Viaje completo${viaje.errores ? ` con ${viaje.errores} error${viaje.errores > 1 ? 'es' : ''}` : ' sin errores 🏆'}!</p><p>Fijate que en casi todos los viajes pasa por el <b>sistema circulatorio</b>: es el que conecta a los demás.</p></div>
        <button class="btn primario" id="nu-otro">Elegir otro viajero</button>` : opciones}`;
    info.querySelectorAll('.nu-op').forEach(b => b.addEventListener('click', () => responderViaje(b.dataset.d)));
    info.querySelector('#nu-otro')?.addEventListener('click', () => {
      const siguiente = VIAJEROS[(VIAJEROS.indexOf(v) + 1) % VIAJEROS.length];
      empezarViaje(siguiente.id);
    });
  }

  function responderViaje(d) {
    if (viaje.moviendo) return;
    const paso = viaje.v.pasos[viaje.i];
    if (d !== paso.ok) {
      viaje.errores++;
      const pista = { heces: 'Solo sale con la materia fecal lo que no se absorbe.', orina: 'La orina la forman los riñones con los desechos de la sangre.', aire: 'Con el aire espirado sale el dióxido de carbono.', celula: 'Primero tiene que llegar por algún sistema.' }[d] || 'Pensá qué órganos hacen ese trabajo.';
      return pintarViaje(`${DESTINOS[d]} no es el paso que sigue. ${pista}`);
    }
    viaje.moviendo = { r: muestrear(CAMINOS[viaje.v.id][viaje.i]), t0: performance.now() };
    viaje.historia.push(paso.texto);
    viaje.i++;
    pintarViaje();
  }

  // El viajero recorre todo el camino (órganos y vasos), dejando un rastro y los nombres de lo que atraviesa.
  function dibujarViajero() {
    const v = viaje.v;
    let parcial = [];
    if (viaje.moviendo) {
      const { r, t0 } = viaje.moviendo, dur = Math.max(1.6, r.total / 160);
      const k = Math.min(1, (performance.now() - t0) / 1000 / dur), e = k * k * (3 - 2 * k) * 0.3 + k * 0.7;
      viaje.pos = puntoEn(r, e);
      r.claves.forEach(({ k: c, f }) => { if (f <= e + 1e-6 && ETQ[c] && !viaje.vistas.includes(c)) viaje.vistas.push(c); });
      const d = e * r.total;
      parcial = r.pts.filter((_, n) => r.acum[n] <= d).concat([viaje.pos]);
      if (k >= 1) { viaje.rastro.push(r.pts); viaje.fines.push(r.pts[r.pts.length - 1]); viaje.moviendo = null; parcial = []; }
    }
    const linea = pts => pts.length > 1 ? `<polyline points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="#ffd166" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    const rastro = viaje.rastro.map(linea).join('') + linea(parcial);
    const etiquetas = viaje.vistas.map(c => {
      const [px, py] = P[c], der = px >= 300 || c === 'celula', t = ETQ[c], w = t.length * 5.6 + 10;
      const x = der ? px + 10 : px - 10 - w;
      return `<g class="nu-etq"><rect x="${x}" y="${py - 17}" width="${w}" height="15" rx="7.5" fill="#12143a" stroke="#ffd166" stroke-opacity="0.6"/><text x="${x + w / 2}" y="${py - 6.5}" text-anchor="middle">${t}</text></g>`;
    }).join('');
    const numeros = viaje.fines.map((p, k) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#12143a" stroke="#ffd166" stroke-width="2"/><text x="${p[0]}" y="${p[1] + 4}" text-anchor="middle" class="nu-num">${k + 1}</text>`).join('');
    const [x, y] = viaje.pos;
    return `${rastro}${etiquetas}${numeros}<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${16 + Math.sin(reloj * 5) * 2}" fill="#ffd166" opacity="0.25"/><g transform="scale(2.2)">${PART[v.part](0, 0)}</g></g>`;
  }

  // ---------- 4. ¿Qué pasa si…? ----------
  const METAS = {
    ninguno: { nutrientes: 85, oxigeno: 90, desechos: 15, energia: 90 },
    digestivo: { nutrientes: 8, oxigeno: 90, desechos: 20, energia: 22 },
    respiratorio: { nutrientes: 85, oxigeno: 4, desechos: 75, energia: 8 },
    excretor: { nutrientes: 85, oxigeno: 90, desechos: 96, energia: 55 },
    circulatorio: { nutrientes: 0, oxigeno: 0, desechos: 100, energia: 0 },
  };
  const CONSECUENCIAS = {
    ninguno: 'Todo funciona: las células reciben nutrientes y oxígeno, obtienen energía y sus desechos se eliminan. Tocá un sistema para desconectarlo.',
    digestivo: 'Sin sistema digestivo, los alimentos no se transforman en nutrientes. La sangre sigue circulando, pero <b>no lleva nutrientes</b>: las células se quedan sin "combustible" y sin material para crecer.',
    respiratorio: 'Sin sistema respiratorio, no entra oxígeno ni sale el dióxido de carbono. Las células no pueden obtener energía de los nutrientes y el <b>CO₂ se acumula</b>. Sin oxígeno, el cuerpo solo resiste unos pocos minutos.',
    excretor: 'Sin sistema excretor, la sangre no se limpia: la <b>urea y otros desechos se acumulan</b> y se vuelven tóxicos. Por eso, cuando los riñones fallan, las personas necesitan diálisis.',
    circulatorio: 'Sin sistema circulatorio <b>nada llega a ningún lado</b>: los nutrientes quedan en el intestino, el oxígeno en los pulmones y los desechos en las células. Ningún otro sistema puede ayudar a las células. Por eso es el sistema que <b>relaciona a todos los demás</b>.',
  };
  const NOMBRES_NIVEL = { nutrientes: ['🍞', 'Nutrientes que llegan a las células'], oxigeno: ['🫧', 'Oxígeno que llega a las células'], desechos: ['🗑️', 'Desechos acumulados'], energia: ['⚡', 'Energía de las células'] };

  function vistaQuePasa() {
    raiz.querySelector('#nu-ui').innerHTML = '';
    raiz.querySelector('#nu-controles').innerHTML = `<div class="nu-desconectar"><span>Desconectar:</span>
      ${['digestivo', 'respiratorio', 'circulatorio', 'excretor'].map(k => `<button data-s="${k}">🔌 ${SISTEMAS[k].n.replace('Sistema ', '')}</button>`).join('')}
      <button data-s="ninguno" class="activo">✅ Todo conectado</button></div>`;
    raiz.querySelectorAll('.nu-desconectar button').forEach(b => b.addEventListener('click', () => {
      off = b.dataset.s === 'ninguno' ? new Set() : new Set([b.dataset.s]);
      raiz.querySelectorAll('.nu-desconectar button').forEach(x => x.classList.toggle('activo', x === b));
      pintarQuePasa();
    }));
    pintarQuePasa();
  }

  function pintarQuePasa() {
    const k = [...off][0] || 'ninguno';
    raiz.querySelector('#nu-info').innerHTML = `<h2>⚠️ ¿Qué pasa si…?</h2>
      <p class="nu-ayuda">Desconectá un sistema y mirá qué les pasa a las células.</p>
      <div id="nu-niveles"></div>
      <div class="nu-consecuencia ${k === 'ninguno' ? 'ok' : 'mal'}">${k === 'ninguno' ? '✅' : '🔌'} ${CONSECUENCIAS[k]}</div>
      ${k === 'ninguno' ? '<p class="nu-ayuda">❓ ¿Cuál de los sistemas está en relación directa con todos los demás? Probá desconectando cada uno.</p>' : ''}`;
    redibujar();
  }

  function actualizarNiveles(dt) {
    const meta = METAS[[...off][0] || 'ninguno'];
    Object.keys(niveles).forEach(k => { niveles[k] += (meta[k] - niveles[k]) * Math.min(1, dt * 1.2); });
    const cont = raiz.querySelector('#nu-niveles');
    if (!cont) return;
    cont.innerHTML = Object.entries(NOMBRES_NIVEL).map(([k, [e, n]]) => {
      const v = niveles[k], malo = k === 'desechos' ? v > 50 : v < 40;
      return `<div class="nu-nivel ${malo ? 'mal' : ''}"><div class="nu-nivel-cab"><span>${e} ${n}</span><b>${Math.round(v)} %</b></div><div class="nu-nivel-barra"><div style="width:${v}%"></div></div></div>`;
    }).join('');
    redibujar();
  }

  return { iniciar };
})();
