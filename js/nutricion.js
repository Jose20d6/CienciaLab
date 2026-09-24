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
  // Puntos del esquema (coordenadas del dibujo).
  const LUGAR = {
    comida: [128, 92], aire: [128, 44], boca: [300, 84], nariz: [300, 66], traquea: [300, 122],
    pulmonI: [252, 176], pulmonD: [350, 176], corazon: [312, 226], estomago: [330, 290], intestino: [296, 362],
    rinonI: [224, 330], rinonD: [376, 330], vejiga: [300, 430], celula: [612, 250],
    salidaAire: [472, 44], orina: [338, 482], heces: [256, 482],
  };

  // ---------- Recorridos de las sustancias (para las partículas) ----------
  const RUTAS = {
    nutrientes: { n: 'Nutrientes', sist: ['digestivo', 'circulatorio'], pts: [LUGAR.comida, [240, 90], LUGAR.boca, [300, 130], [322, 250], LUGAR.estomago, [300, 330], LUGAR.intestino, [340, 330], [330, 268], LUGAR.corazon, [400, 214], [470, 212], [520, 232]] },
    oxigeno: { n: 'Oxígeno (O₂)', sist: ['respiratorio', 'circulatorio'], pts: [LUGAR.aire, [230, 50], LUGAR.nariz, LUGAR.traquea, [270, 150], LUGAR.pulmonI, [290, 210], LUGAR.corazon, [400, 214], [470, 212], [522, 238]] },
    co2: { n: 'Dióxido de carbono (CO₂)', sist: ['circulatorio', 'respiratorio'], pts: [[522, 266], [470, 288], [400, 272], LUGAR.corazon, [334, 200], LUGAR.pulmonD, [322, 140], LUGAR.traquea, [310, 84], [380, 58], LUGAR.salidaAire] },
    desechos: { n: 'Agua y desechos', sist: ['circulatorio', 'excretor'], pts: [[522, 270], [470, 292], [420, 310], LUGAR.rinonD, [352, 372], [318, 412], LUGAR.vejiga, [326, 454], LUGAR.orina] },
    heces: { n: 'Materia fecal', sist: ['digestivo'], pts: [LUGAR.intestino, [262, 398], [256, 440], LUGAR.heces] },
  };
  function largo(pts) {
    const acum = [0];
    for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return acum;
  }
  Object.values(RUTAS).forEach(r => { r.acum = largo(r.pts); r.total = r.acum[r.acum.length - 1]; });
  function puntoEn(r, t) {
    const d = t * r.total;
    let i = 1;
    while (i < r.acum.length - 1 && r.acum[i] < d) i++;
    const [a, b] = [r.pts[i - 1], r.pts[i]], f = (d - r.acum[i - 1]) / (r.acum[i] - r.acum[i - 1] || 1);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }

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

  // off = sistemas desconectados; animo de la célula.
  function escena(off = new Set(), animoCelula = 'feliz') {
    const o = id => off.has(id) ? 'nu-off' : '';
    const enchufe = (id, x, y) => off.has(id) ? `<g transform="translate(${x} ${y})"><circle r="13" fill="#12143a" stroke="#ff6b6b" stroke-width="2.5"/><path d="M-5,-5 L5,5 M5,-5 L-5,5" stroke="#ff6b6b" stroke-width="3" stroke-linecap="round"/></g>` : '';
    let s = `<defs>
        <radialGradient id="nu-fondo" cx="0.45" cy="0.4" r="0.85"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="nu-cito" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#5a4bb0"/><stop offset="1" stop-color="#342a7c"/></radialGradient>
        <radialGradient id="nu-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#b197fc" stop-opacity="0.35"/><stop offset="1" stop-color="#b197fc" stop-opacity="0"/></radialGradient>
        <filter id="nu-brillo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#nu-fondo)"/>
      ${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 97.3) % W}" cy="${(i * 53.9) % H}" r="${0.7 + (i % 3) * 0.5}" fill="#c9ccf5" opacity="${0.15 + (i % 4) * 0.08}"/>`).join('')}`;
    // Silueta del cuerpo.
    const cuerpo = 'M300,98 C262,98 250,104 224,112 C196,120 186,140 186,170 L190,300 C192,360 204,420 222,466 L378,466 C396,420 408,360 410,300 L414,170 C414,140 404,120 376,112 C350,104 338,98 300,98 Z';
    s += `<ellipse cx="300" cy="476" rx="140" ry="10" fill="#05061a" opacity="0.5"/>
      ${dosTonos(`<path d="${cuerpo}" fill="FILL"/><rect x="284" y="84" width="32" height="24" fill="FILL"/><circle cx="300" cy="58" r="38" fill="FILL"/>`, '#262b6e', '#1d2159', { x: 312 })}
      ${brillo('M200,172 C198,140 212,122 236,116', 4)}${brillo('M272,34 a38,38 0 0 1 22,-12', 3)}
      <path d="M288,58 a3,3 0 0 1 6,0 M306,58 a3,3 0 0 1 6,0" stroke="#9aa3ff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M292,76 q8,5 16,0" stroke="#ff8fab" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    // Vasos sanguíneos (detrás de los órganos): arterias rojas y venas azules.
    s += `<g class="${o('circulatorio')}">
      ${vaso('M306,222 C290,200 270,190 256,184', AZUL, 7)}${vaso('M318,220 C330,200 342,190 350,184', ROJO, 7)}
      ${vaso('M328,236 C352,262 350,300 336,330', ROJO, 6)}${vaso('M300,346 C290,300 296,262 304,240', AZUL, 6)}
      ${vaso('M326,242 C360,280 372,300 378,320', ROJO, 6)}${vaso('M296,244 C262,280 232,300 226,322', ROJO, 6)}
      ${vaso('M330,222 C400,206 470,204 520,232', ROJO, 9)}${vaso('M520,270 C470,300 400,280 330,236', AZUL, 9)}</g>`;
    // Sistema respiratorio: tráquea, bronquios y pulmones.
    s += `<g class="nu-sistema ${o('respiratorio')}" data-s="respiratorio">
      <path d="M300,92 L300,138 M300,138 C286,146 270,152 262,162 M300,138 C314,146 330,152 338,162" stroke="#dbe4ff" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${dosTonos('<path d="M286,148 C286,132 272,126 256,132 C232,142 222,176 224,206 C226,226 246,230 262,222 C280,212 288,190 286,148 Z" fill="FILL"/>', '#ffa8c5', '#e06f97', { x: 262 })}
      ${dosTonos('<path d="M314,148 C314,132 328,126 344,132 C368,142 378,176 376,206 C374,226 354,230 338,222 C320,212 312,190 314,148 Z" fill="FILL"/>', '#ffa8c5', '#e06f97', { x: 352 })}
      <path d="M270,150 q-10,20 -6,40 M330,150 q10,20 6,40" stroke="#ffd1e0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>
      ${brillo('M234,168 C236,150 244,140 254,136')}${cara(250, 186, 3.4)}${cara(350, 186, 3.4)}
      <circle cx="300" cy="62" r="24" fill="transparent"/>${enchufe('respiratorio', 222, 142)}</g>`;
    // Sistema circulatorio: el corazón (late).
    s += `<g class="nu-sistema ${o('circulatorio')}" data-s="circulatorio"><g class="nu-latido">
      ${dosTonos('<path d="M312,250 C290,236 276,222 278,208 C280,196 294,192 304,200 L312,207 L320,200 C330,192 344,196 346,208 C348,222 334,236 312,250 Z" fill="FILL"/>', '#ff6b6b', '#d63c3c', { x: 318 })}
      ${brillo('M286,206 a10,10 0 0 1 10,-8', 2.6)}${cara(308, 216, 2.8)}</g>
      <path d="M330,222 C400,206 470,204 520,232" stroke="transparent" stroke-width="18" fill="none"/><path d="M520,270 C470,300 400,280 330,236" stroke="transparent" stroke-width="18" fill="none"/>
      ${enchufe('circulatorio', 350, 250)}</g>`;
    // Sistema excretor: riñones, uréteres y vejiga.
    s += `<g class="nu-sistema ${o('excretor')}" data-s="excretor">
      <path d="M232,348 C250,380 280,400 296,420 M368,348 C350,380 320,400 304,420" stroke="#ffe8a3" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      ${[[LUGAR.rinonI, 1], [LUGAR.rinonD, -1]].map(([[x, y], k]) => `<g transform="translate(${x} ${y}) scale(${k} 1)">${dosTonos('<path d="M-4,-24 C18,-28 26,-8 22,10 C18,26 -2,30 -12,20 C-6,12 -4,2 -10,-6 C-16,-16 -14,-22 -4,-24 Z" fill="FILL"/>', '#e8707a', '#b94a55', { x: 8 })}${brillo('M-6,-18 a18,16 0 0 1 16,-2', 2.4)}</g>`).join('')}
      ${dosTonos('<path d="M286,418 C286,404 314,404 314,418 C316,434 306,442 300,442 C294,442 284,434 286,418 Z" fill="FILL"/>', '#ffd166', '#f0a830', { x: 302 })}
      ${cara(222, 330, 2.6)}${cara(378, 330, 2.6)}${enchufe('excretor', 404, 300)}</g>`;
    // Sistema digestivo: esófago, estómago e intestinos.
    s += `<g class="nu-sistema ${o('digestivo')}" data-s="digestivo">
      <path d="M300,92 C300,140 304,200 320,260" stroke="#e56b8f" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.9"/>
      ${dosTonos('<path d="M316,262 C330,250 356,256 358,276 C360,300 344,318 320,318 C302,318 296,306 300,296 C306,286 316,286 316,262 Z" fill="FILL"/>', '#ff8fab', '#e0607f', { y: 294 })}
      ${brillo('M322,262 a18,14 0 0 1 20,-2', 2.6)}
      <path d="M258,334 C240,334 238,354 256,356 C276,358 276,338 296,340 C316,342 316,360 336,358 C356,356 356,336 340,334 M256,356 C240,360 240,382 258,384 C278,386 278,366 298,368 C318,370 318,390 338,388 C356,386 356,366 340,364" stroke="#c9486b" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M258,334 C240,334 238,354 256,356 C276,358 276,338 296,340 C316,342 316,360 336,358 C356,356 356,336 340,334 M256,356 C240,360 240,382 258,384 C278,386 278,366 298,368 C318,370 318,390 338,388 C356,386 356,366 340,364" stroke="#ff9fb8" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M250,330 C232,330 228,380 244,400 C256,414 250,440 256,470" stroke="#b83a5e" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.8"/>
      ${cara(330, 286, 3.2)}${enchufe('digestivo', 372, 262)}</g>`;
    // Célula ampliada: el destino de la nutrición.
    const [cx, cy] = LUGAR.celula;
    s += `<path d="M430,340 L${cx - 60},${cy + 96} M430,360 L${cx - 20},${cy + 108}" stroke="#b197fc" stroke-width="1.5" stroke-dasharray="4 5" opacity="0.5"/>
      <circle cx="430" cy="350" r="12" fill="none" stroke="#b197fc" stroke-width="2" opacity="0.6"/>
      <g class="nu-sistema" data-s="celula">
        <circle cx="${cx}" cy="${cy}" r="132" fill="url(#nu-halo)"/>
        <circle cx="${cx + 6}" cy="${cy + 10}" r="108" fill="#05061a" opacity="0.4"/>
        <circle cx="${cx}" cy="${cy}" r="108" fill="#d94d8a"/><circle cx="${cx}" cy="${cy}" r="100" fill="url(#nu-cito)"/>
        <path d="M${cx - 80},${cy - 50} a100,100 0 0 1 60,-44" stroke="#ffd1e6" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <g transform="translate(${cx - 18} ${cy - 18})">${dosTonos('<circle r="34" fill="FILL"/>', '#8b6cf0', '#6a4ce0', { x: 12 })}<circle r="26" fill="#b9a4ff"/><circle cx="6" cy="4" r="9" fill="#5b3fd6"/>
          ${cara(-8, -6, 4.2, animoCelula)}</g>
        ${[[cx + 50, cy - 40, 30], [cx + 44, cy + 44, -20], [cx - 50, cy + 56, 10]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(0.62)">${dosTonos('<rect x="-34" y="-16" width="68" height="32" rx="16" fill="FILL"/>', '#ff7b54', '#e0563a', { y: 5 })}<rect x="-29" y="-11" width="58" height="22" rx="11" fill="#ffc07a"/>${[-20, -8, 4, 16].map((dx, i) => `<rect x="${dx - 2.6}" y="${i % 2 ? -1 : -11}" width="5.2" height="12" rx="2.6" fill="#ff8d5c"/>`).join('')}</g>`).join('')}
        <text x="${cx}" y="${cy - 118}" text-anchor="middle" class="nu-rotulo">UNA CÉLULA DEL CUERPO</text>
        <text x="${cx}" y="${cy + 128}" text-anchor="middle" class="nu-sub">energía y material de construcción</text>
      </g>`;
    // Entradas y salidas del ambiente.
    s += `${Alimentacion.alimento('pan', 88, 92, 0.9)}${Alimentacion.alimento('manzana', 58, 96, 0.75)}${Alimentacion.alimento('agua', 116, 112, 0.6)}
      <text x="84" y="132" text-anchor="middle" class="nu-rotulo">ALIMENTOS</text>
      <g opacity="0.8">${[0, 1, 2].map(i => `<path d="M${54 + i * 16},${34 + i * 6} q10,-6 20,0 t20,0" stroke="#bfe8ff" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g>
      <text x="84" y="22" text-anchor="middle" class="nu-rotulo">AIRE INSPIRADO</text>
      <text x="${LUGAR.salidaAire[0] + 10}" y="30" text-anchor="middle" class="nu-rotulo">AIRE ESPIRADO</text>
      <text x="${LUGAR.orina[0] + 44}" y="486" text-anchor="middle" class="nu-sub">orina</text>
      <text x="${LUGAR.heces[0] - 50}" y="486" text-anchor="middle" class="nu-sub">materia fecal</text>`;
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
      </div>
      <div class="nu-grid">
        <div class="panel nu-escena"><svg id="nu-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Los sistemas que intervienen en la nutrición"><g id="nu-fijo"></g><g id="nu-part" filter="url(#nu-brillo)"></g><g id="nu-ui"></g></svg>
          <div class="nu-refs">${Object.keys(RUTAS).map(k => `<span><svg viewBox="-9 -8 18 16" width="18" height="16">${PART[k](0, 0)}</svg>${RUTAS[k].n}</span>`).join('')}</div>
          <div id="nu-controles"></div>
        </div>
        <aside class="panel nu-info" id="nu-info"></aside>
      </div>`;
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
    if (raiz.hidden) { anim = requestAnimationFrame(bucle); return; }
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
      const [cx, cy] = LUGAR.celula, nd = Math.round((niveles.desechos - 20) / 10);
      for (let i = 0; i < nd; i++) { const a = i * 2.3 + reloj * 0.4, r = 40 + (i % 3) * 18; s += PART[i % 2 ? 'co2' : 'desechos'](cx + Math.cos(a) * r, cy + 20 + Math.sin(a) * r * 0.7); }
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
    digestivo: { n: 'Sistema digestivo', pos: LUGAR.intestino }, respiratorio: { n: 'Sistema respiratorio', pos: LUGAR.pulmonI },
    circulatorio: { n: 'Sistema circulatorio', pos: LUGAR.corazon }, excretor: { n: 'Sistema excretor', pos: LUGAR.rinonD },
    celula: { n: 'Las células', pos: LUGAR.celula }, aire: { n: 'Sale con el aire espirado', pos: LUGAR.salidaAire },
    orina: { n: 'Sale con la orina', pos: LUGAR.orina }, heces: { n: 'Sale con la materia fecal', pos: LUGAR.heces },
  };
  const VIAJEROS = [
    { id: 'glucosa', n: 'Glucosa del pan', part: 'nutrientes', inicio: LUGAR.comida, intro: 'Comiste un pedazo de pan. Su almidón se va a convertir en <b>glucosa</b>, un nutriente que da energía.',
      pasos: [
        { ok: 'digestivo', pos: LUGAR.intestino, pista: 'El pan entra por la boca. ¿Qué sistema lo transforma en nutrientes?', texto: 'En la boca, el estómago y el intestino el pan se <b>digiere</b>: el almidón se rompe en glucosa, un nutriente muy pequeño.' },
        { ok: 'circulatorio', pos: LUGAR.corazon, pista: 'La glucosa está en el intestino. ¿A qué sistema pasa para viajar por el cuerpo?', texto: 'Atraviesa la pared del intestino delgado y pasa a la <b>sangre</b> (absorción). El corazón la impulsa por los vasos sanguíneos.' },
        { ok: 'celula', pos: LUGAR.celula, pista: '¿A dónde la lleva la sangre?', texto: 'A <b>todas las células</b>. Allí, junto con el oxígeno, se usa para obtener <b>energía</b>. ¡Llegó a destino!' },
      ] },
    { id: 'oxigeno', n: 'Oxígeno del aire', part: 'oxigeno', inicio: LUGAR.aire, intro: 'Respiraste hondo. Seguí a una molécula de <b>oxígeno</b> desde el aire.',
      pasos: [
        { ok: 'respiratorio', pos: LUGAR.pulmonI, pista: 'El aire entra por la nariz. ¿Qué sistema lo recibe?', texto: 'Pasa por la nariz, la tráquea y los bronquios hasta llegar a los <b>alvéolos</b> de los pulmones.' },
        { ok: 'circulatorio', pos: LUGAR.corazon, pista: 'El oxígeno está en los pulmones. ¿Cómo sigue viaje?', texto: 'En los alvéolos pasa a la <b>sangre</b> y se une a los glóbulos rojos. El corazón la bombea a todo el cuerpo.' },
        { ok: 'celula', pos: LUGAR.celula, pista: '¿Quién necesita ese oxígeno?', texto: 'Las <b>células</b> lo usan para "quemar" la glucosa y obtener energía (respiración celular).' },
      ] },
    { id: 'co2', n: 'Dióxido de carbono', part: 'co2', inicio: LUGAR.celula, intro: 'Al obtener energía, la célula produce <b>dióxido de carbono</b>, un desecho que hay que sacar del cuerpo.',
      pasos: [
        { ok: 'circulatorio', pos: LUGAR.corazon, pista: 'El CO₂ sale de la célula. ¿Qué sistema lo recoge?', texto: 'La <b>sangre</b> lo recoge y lo lleva por las venas hasta el corazón.' },
        { ok: 'respiratorio', pos: LUGAR.pulmonD, pista: '¿Hacia qué sistema lo lleva la sangre para eliminarlo?', texto: 'Llega a los <b>pulmones</b>: en los alvéolos pasa de la sangre al aire.' },
        { ok: 'aire', pos: LUGAR.salidaAire, pista: '¿Cómo sale del cuerpo?', texto: 'Sale con el <b>aire espirado</b> cada vez que exhalamos.' },
      ] },
    { id: 'urea', n: 'Un desecho (urea)', part: 'desechos', inicio: LUGAR.celula, intro: 'Las células también producen otros desechos, como la <b>urea</b>, y agua que sobra.',
      pasos: [
        { ok: 'circulatorio', pos: LUGAR.corazon, pista: 'La urea sale de la célula. ¿Quién la transporta?', texto: 'La <b>sangre</b> la recoge y la transporta por el cuerpo.' },
        { ok: 'excretor', pos: LUGAR.rinonD, pista: '¿Qué órganos filtran la sangre para limpiarla?', texto: 'Los <b>riñones</b>, del sistema excretor, filtran la sangre y separan la urea y el agua que sobra.' },
        { ok: 'orina', pos: LUGAR.orina, pista: '¿Cómo sale del cuerpo?', texto: 'Forma la <b>orina</b>, que se guarda en la vejiga y se elimina.' },
      ] },
    { id: 'fibra', n: 'Fibra de la manzana', part: 'heces', inicio: LUGAR.comida, intro: 'La manzana tiene <b>fibra</b>, que nuestro cuerpo no puede digerir. ¿Qué le pasa?',
      pasos: [
        { ok: 'digestivo', pos: LUGAR.intestino, pista: '¿Por qué sistema pasa primero?', texto: 'Recorre el <b>sistema digestivo</b>, pero no se descompone en nutrientes: no pasa a la sangre. Igual es muy útil, porque ayuda al intestino a funcionar.' },
        { ok: 'heces', pos: LUGAR.heces, pista: 'Como no se absorbe, ¿cómo sale del cuerpo?', texto: 'Forma parte de la <b>materia fecal</b> y se elimina por el ano.' },
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
    viaje = { v, i: 0, pos: v.inicio.slice(), rastro: [v.inicio.slice()], errores: 0, moviendo: null, historia: [] };
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
      opciones = `<p class="nu-pregunta">${paso.pista}</p><div class="nu-opciones">${viaje.opciones.map(k => `<button class="btn-opcion nu-op" data-d="${k}">${DESTINOS[k].n}</button>`).join('')}</div>`;
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
      return pintarViaje(`${DESTINOS[d].n} no es el paso que sigue. ${pista}`);
    }
    viaje.moviendo = { desde: viaje.pos.slice(), hasta: paso.pos, t0: performance.now() };
    viaje.historia.push(paso.texto);
    viaje.i++;
    pintarViaje();
  }

  function dibujarViajero() {
    const v = viaje.v;
    if (viaje.moviendo) {
      const { desde, hasta, t0 } = viaje.moviendo, k = Math.min(1, (performance.now() - t0) / 1100), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      viaje.pos = [desde[0] + (hasta[0] - desde[0]) * e, desde[1] + (hasta[1] - desde[1]) * e - Math.sin(k * Math.PI) * 26];
      if (k >= 1) { viaje.pos = hasta.slice(); viaje.rastro.push(hasta.slice()); viaje.moviendo = null; }
    }
    const [x, y] = viaje.pos;
    const rastro = viaje.rastro.length > 1 ? `<polyline points="${viaje.rastro.map(p => p.join(',')).join(' ')}" fill="none" stroke="#ffd166" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>` : '';
    const numeros = viaje.rastro.slice(1).map((p, k) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#12143a" stroke="#ffd166" stroke-width="2"/><text x="${p[0]}" y="${p[1] + 4}" text-anchor="middle" class="nu-num">${k + 1}</text>`).join('');
    return `${rastro}${numeros}<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${16 + Math.sin(reloj * 5) * 2}" fill="#ffd166" opacity="0.25"/><g transform="scale(2.2)">${PART[v.part](0, 0)}</g></g>`;
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
