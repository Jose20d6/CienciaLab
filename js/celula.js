// Módulo 7: Explorador de la célula animal y vegetal.
const Celula = (function () {
  const ORGANULOS = {
    membrana: { nombre: 'Membrana plasmática', animal: true, vegetal: true,
      funcion: 'Rodea la célula y controla qué sustancias entran y salen.',
      analogia: 'Es como la puerta de seguridad de un edificio.' },
    pared: { nombre: 'Pared celular', animal: false, vegetal: true,
      funcion: 'Capa rígida de celulosa por fuera de la membrana. Le da forma y protección a la célula vegetal.',
      analogia: 'Es como los ladrillos de una casa.' },
    citoplasma: { nombre: 'Citoplasma', animal: true, vegetal: true,
      funcion: 'Medio gelatinoso, formado sobre todo por agua, donde flotan los orgánulos y ocurren muchas reacciones químicas.',
      analogia: 'Es como el patio donde todo sucede.' },
    nucleo: { nombre: 'Núcleo', animal: true, vegetal: true,
      funcion: 'Guarda el ADN, con la información genética, y dirige las actividades de la célula. Adentro está el nucléolo, que fabrica los ribosomas.',
      analogia: 'Es el centro de control: el director de la fábrica.' },
    mitocondria: { nombre: 'Mitocondria', animal: true, vegetal: true,
      funcion: 'Realiza la respiración celular: usa glucosa y oxígeno para obtener energía (ATP).',
      analogia: 'Es la central eléctrica de la célula.' },
    cloroplasto: { nombre: 'Cloroplasto', animal: false, vegetal: true,
      funcion: 'Realiza la fotosíntesis: con la luz del Sol fabrica glucosa a partir de CO₂ y agua. Tiene clorofila, que le da el color verde.',
      analogia: 'Es un panel solar que además fabrica alimento.' },
    ribosoma: { nombre: 'Ribosomas', animal: true, vegetal: true,
      funcion: 'Fabrican las proteínas siguiendo las instrucciones del ADN. Pueden estar libres o pegados al retículo.',
      analogia: 'Son los obreros de la fábrica.' },
    rer: { nombre: 'Retículo endoplasmático rugoso', animal: true, vegetal: true,
      funcion: 'Red de membranas con ribosomas pegados (por eso se ve "rugoso"). Fabrica y transporta proteínas.',
      analogia: 'Es una cinta transportadora con obreros.' },
    rel: { nombre: 'Retículo endoplasmático liso', animal: true, vegetal: true,
      funcion: 'Red de tubos sin ribosomas. Fabrica lípidos (grasas) y ayuda a eliminar sustancias tóxicas.',
      analogia: 'Es el laboratorio de grasas y la planta de limpieza.' },
    golgi: { nombre: 'Aparato de Golgi', animal: true, vegetal: true,
      funcion: 'Modifica, empaqueta y distribuye las proteínas dentro de pequeñas bolsitas llamadas vesículas.',
      analogia: 'Es la oficina de correo.' },
    lisosoma: { nombre: 'Lisosomas', animal: true, vegetal: false,
      funcion: 'Contienen enzimas que digieren restos y partes viejas de la célula. En las células vegetales esta tarea la hace sobre todo la vacuola.',
      analogia: 'Son el servicio de reciclaje.' },
    vacuola: { nombre: 'Vacuola', animal: true, vegetal: true,
      funcion: 'Almacena agua, nutrientes y desechos. La célula vegetal tiene una vacuola central enorme que la mantiene firme; la animal tiene varias pequeñas.',
      analogia: 'Es un depósito o tanque de agua.' },
    centriolo: { nombre: 'Centríolos', animal: true, vegetal: false,
      funcion: 'Participan en la división celular: organizan los "hilos" que separan los cromosomas.',
      analogia: 'Son los organizadores de una mudanza.' },
  };

  const VB = { x: 0, y: 0, w: 640, h: 460 };
  const MIN_W = 110;

  // ---------- Dibujo de orgánulos ----------
  // Estilo divulgación: fondo oscuro, formas planas sin contorno, sombreado en dos tonos y brillos.
  // Cada orgánulo va en un <g data-org> sin transform (para medirlo) con un <g> interno que lo ubica.
  // Sombreado en dos tonos: la copia oscura se recorta con un semiplano. Se recorta la copia (no un
  // rectángulo grande) para que getBBox mida solo la forma y el zoom quede centrado.
  let nClip = 0;
  const dosTonos = (formas, claro, oscuro, corte) => {
    const id = 'cel-dt-' + (nClip++);
    const zona = corte.x !== undefined
      ? `<rect x="${corte.x}" y="-500" width="1000" height="1000"/>`
      : `<rect x="-500" y="${corte.y}" width="1000" height="1000"/>`;
    return `${formas.replace(/FILL/g, claro)}<clipPath id="${id}">${zona}</clipPath><g clip-path="url(#${id})">${formas.replace(/FILL/g, oscuro)}</g>`;
  };
  const org = (tipo, x, y, ang, contenido, s = 1) =>
    `<g class="org" data-org="${tipo}"><title>${ORGANULOS[tipo].nombre}</title><g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})">${contenido}</g></g>`;
  const brillo = (x, y, r, a0 = 200, a1 = 250, ancho = 3) => {
    const p = a => [x + r * Math.cos(a * Math.PI / 180), y + r * Math.sin(a * Math.PI / 180)].map(v => v.toFixed(1)).join(',');
    return `<path d="M${p(a0)} A${r},${r} 0 0 1 ${p(a1)}" stroke="#fff" stroke-width="${ancho}" stroke-linecap="round" fill="none" opacity="0.55"/>`;
  };

  // Degradados y motas del fondo. Cada dibujo usa su propio prefijo de id (hay varios SVG en la página).
  let nDibujo = 0;
  const defs = p => `<defs>
    <radialGradient id="${p}-cito" cx="0.45" cy="0.4" r="0.65"><stop offset="0" stop-color="#4b3f9e"/><stop offset="1" stop-color="#2f276f"/></radialGradient>
    <radialGradient id="${p}-citov" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stop-color="#2f6a78"/><stop offset="1" stop-color="#1d3f5c"/></radialGradient>
    <radialGradient id="${p}-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.6" stop-color="#ff7eb3" stop-opacity="0.22"/><stop offset="1" stop-color="#ff7eb3" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-nuc" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#b9a4ff"/><stop offset="1" stop-color="#8a6cf0"/></radialGradient>
    <radialGradient id="${p}-vac" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#8fd0ff" stop-opacity="0.75"/><stop offset="1" stop-color="#3f8ce0" stop-opacity="0.55"/></radialGradient>
  </defs>`;
  const motas = (n, x0, y0, w, h, c) => Array.from({ length: n }, (_, i) =>
    `<circle cx="${(x0 + (i * 137.5) % w).toFixed(1)}" cy="${(y0 + (i * 71.3) % h).toFixed(1)}" r="${(0.8 + (i % 3) * 0.6).toFixed(1)}" fill="${c}" opacity="${0.18 + (i % 4) * 0.08}"/>`).join('');

  const nucleo = (x, y, r) => org('nucleo', x, y, 0, `
    <circle r="${r + 10}" fill="#8a6cf0" opacity="0.18"/>
    ${dosTonos(`<circle r="${r}" fill="FILL"/>`, '#7b5cf0', '#5f43cf', { x: r * 0.35 })}
    <circle r="${r - 7}" fill="url(#P-nuc)"/>
    ${Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<circle cx="${((r - 3.5) * Math.cos(a)).toFixed(1)}" cy="${((r - 3.5) * Math.sin(a)).toFixed(1)}" r="2" fill="#3d2a9e"/>`; }).join('')}
    ${[[-0.62, -0.28, 1], [-0.55, 0.32, -1], [-0.1, -0.58, 1], [0.02, 0.5, -1]].map(([dx, dy, g]) => `<path d="M${r * dx},${r * dy} q${r * 0.12},${-r * 0.2 * g} ${r * 0.25},0 t${r * 0.25},0 t${r * 0.2},${r * 0.05}" fill="none" stroke="#e3d9ff" stroke-width="3" stroke-linecap="round" opacity="0.75"/>`).join('')}
    ${dosTonos(`<circle cx="${r * 0.18}" cy="${r * 0.1}" r="${r * 0.3}" fill="FILL"/>`, '#5b3fd6', '#4630b0', { x: r * 0.28 })}
    <circle cx="${r * 0.08}" cy="${-r * 0.02}" r="${r * 0.07}" fill="#fff" opacity="0.5"/>
    ${brillo(0, 0, r - 12, 200, 250, 4)}`);

  const mitocondria = (x, y, ang, s) => org('mitocondria', x, y, ang, `
    ${dosTonos('<rect x="-34" y="-16" width="68" height="32" rx="16" fill="FILL"/>', '#ff7b54', '#e0563a', { y: 5 })}
    <rect x="-29" y="-11" width="58" height="22" rx="11" fill="#ffc07a"/>
    ${[-20, -12, -4, 4, 12, 20].map((dx, i) => `<rect x="${dx - 2.6}" y="${i % 2 ? -1 : -11}" width="5.2" height="12" rx="2.6" fill="#ff8d5c"/>`).join('')}
    <path d="M-24,-12 a14,14 0 0 1 12,-2" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>`, s);

  const cloroplasto = (x, y, ang, s) => org('cloroplasto', x, y, ang, `
    ${dosTonos('<rect x="-33" y="-17" width="66" height="34" rx="17" fill="FILL"/>', '#37d67a', '#1fae6c', { y: 5 })}
    <rect x="-28" y="-12" width="56" height="24" rx="12" fill="#8af0bd"/>
    <path d="M-24,1 L24,1" stroke="#1fae6c" stroke-width="2" stroke-linecap="round"/>
    ${[-17, -5, 7, 19].map(dx => [-7, -2.5, 2, 6.5].map(dy => `<rect x="${dx - 4.5}" y="${dy - 2}" width="9" height="4" rx="2" fill="${dy < 0 ? '#16955a' : '#127a4a'}"/>`).join('')).join('')}
    <path d="M-23,-13 a14,14 0 0 1 12,-2" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>`, s);

  const golgi = (x, y, ang) => org('golgi', x, y, ang, `
    ${[0, 1, 2, 3].map(i => `<path d="M${-42 + i * 5},${i * 11} Q0,${-16 + i * 11} ${42 - i * 5},${i * 11}" fill="none" stroke="${['#ff8fc0', '#f76fa9', '#e85a96', '#d24884'][i]}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${-38 + i * 5},${i * 11 - 2.5} Q0,${-18 + i * 11} ${30 - i * 5},${i * 11 - 5}" fill="none" stroke="#ffd1e6" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>`).join('')}
    ${[[50, 8, 5], [-50, 10, 4], [46, 28, 4], [58, 22, 3]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ff8fc0"/><circle cx="${cx - r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.3}" fill="#fff" opacity="0.6"/>`).join('')}`);

  const rer = (x, y, ang) => org('rer', x, y, ang, `
    ${[0, 1, 2].map(i => `<path d="M0,${i * 16} q16,-12 32,0 t32,0 t32,0" fill="none" stroke="${['#5cb6ff', '#4a9ff0', '#3d8ae0'][i]}" stroke-width="8" stroke-linecap="round"/>
      <path d="M2,${i * 16 - 2.5} q14,-11 30,0 t32,0 t30,0" fill="none" stroke="#c5e6ff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>`).join('')}
    ${[0, 1, 2].map(i => [6, 22, 38, 54, 70, 86].map(dx => `<circle cx="${dx}" cy="${i * 16 + (dx % 32 < 16 ? -7 : 7) * 0.6 - 6}" r="2.6" fill="#e599f7"/>`).join('')).join('')}`);

  const rel = (x, y, ang) => org('rel', x, y, ang, `
    <path d="M0,0 c20,-20 40,20 60,0 s40,20 60,0" fill="none" stroke="#22b8cf" stroke-width="10" stroke-linecap="round"/>
    <path d="M10,22 c20,-18 40,18 60,0 s30,16 50,2" fill="none" stroke="#1c9fb5" stroke-width="10" stroke-linecap="round"/>
    <path d="M0,0 c20,-20 40,20 60,0 s40,20 60,0 M10,22 c20,-18 40,18 60,0 s30,16 50,2" fill="none" stroke="#99e9f2" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`);

  const lisosoma = (x, y) => org('lisosoma', x, y, 0, `
    <circle r="15" fill="#ffd43b" opacity="0.18"/>
    ${dosTonos('<circle r="11" fill="FILL"/>', '#ffd43b', '#f5a524', { x: 3 })}
    <circle cx="-3" cy="-1" r="1.9" fill="#c75b00"/><circle cx="3.5" cy="2" r="1.9" fill="#c75b00"/><circle cx="-1" cy="5" r="1.7" fill="#c75b00"/>
    <circle cx="-4" cy="-5" r="2.2" fill="#fff" opacity="0.7"/>`);

  const vacuolaChica = (x, y, r) => org('vacuola', x, y, 0, `<circle r="${r}" fill="url(#P-vac)"/>${brillo(0, 0, r * 0.65, 200, 260, 2.2)}`);

  const centriolo = `${dosTonos('<rect x="-14" y="-5.5" width="28" height="11" rx="5.5" fill="FILL"/>', '#ffe066', '#fcc419', { y: 1 })}
    ${[-8, -3, 2, 7].map(dx => `<rect x="${dx - 1}" y="-5.5" width="2" height="11" fill="#e8a500" opacity="0.8"/>`).join('')}`;
  const centriolos = (x, y) => org('centriolo', x, y, 0, `<g>${centriolo}</g><g transform="translate(10 13) rotate(90)">${centriolo}</g>`);

  const ribosomas = puntos => `<g class="org" data-org="ribosoma"><title>Ribosomas</title>
    ${puntos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="transparent"/><circle cx="${x}" cy="${y}" r="4.5" fill="#e599f7" opacity="0.25"/><circle cx="${x}" cy="${y}" r="2.8" fill="#e599f7"/>`).join('')}</g>`;

  // Reemplaza el prefijo de ids para que cada SVG tenga sus propios degradados.
  const conPrefijo = svg => { const p = 'cel' + (nDibujo++); return defs(p) + svg.replace(/url\(#P-/g, `url(#${p}-`); };

  function celulaAnimal() {
    const borde = 'M62,232 C58,96 196,34 330,36 C474,40 590,112 584,244 C578,372 452,428 320,424 C178,420 66,366 62,232 Z';
    return conPrefijo(`
      ${motas(40, 0, 0, 640, 460, '#8e9bff')}
      <path d="${borde}" fill="none" stroke="#ff7eb3" stroke-width="40" opacity="0.07"/>
      <path d="${borde}" fill="none" stroke="#ff7eb3" stroke-width="22" opacity="0.1"/>
      <g class="org" data-org="citoplasma"><title>Citoplasma</title><path d="${borde}" fill="url(#P-cito)"/>
        <g opacity="0.35" stroke="#7c6cd8" stroke-width="1.4" fill="none">
          <path d="M120,180 C200,160 240,250 330,230 M380,300 C430,280 470,330 540,300 M200,400 C240,360 300,380 340,340 M420,80 C440,120 500,110 520,150"/></g>
        ${motas(60, 80, 60, 490, 350, '#c7b8ff')}</g>
      <g class="org" data-org="membrana"><title>Membrana plasmática</title>
        <path d="${borde}" fill="none" stroke="#d94d8a" stroke-width="10"/>
        <path d="${borde}" fill="none" stroke="#ff8fc0" stroke-width="4"/>
        <path d="${borde}" pathLength="100" fill="none" stroke="#ffd1e6" stroke-width="2.5" stroke-dasharray="14 86" stroke-dashoffset="-6" stroke-linecap="round"/>
        <path d="${borde}" fill="none" stroke="transparent" stroke-width="16" pointer-events="stroke"/></g>
      ${rer(196, 140, -12)}
      ${rel(420, 330, -8)}
      ${nucleo(300, 222, 66)}
      ${golgi(440, 170, 20)}
      ${mitocondria(150, 300, 30, 1)}${mitocondria(470, 260, -20, 0.9)}${mitocondria(300, 370, 5, 0.95)}${mitocondria(510, 120, 50, 0.8)}
      ${lisosoma(390, 110)}${lisosoma(212, 370)}${lisosoma(528, 330)}
      ${vacuolaChica(120, 200, 16)}${vacuolaChica(400, 395, 12)}
      ${centriolos(380, 250)}
      ${ribosomas([[140, 250], [175, 330], [250, 330], [360, 310], [380, 150], [480, 220], [540, 200], [250, 90], [330, 410], [110, 280], [455, 380], [560, 270]])}`);
  }

  function celulaVegetal() {
    return conPrefijo(`
      ${motas(30, 0, 0, 640, 460, '#8e9bff')}
      <g class="org" data-org="pared"><title>Pared celular</title>
        <rect x="26" y="22" width="588" height="416" rx="20" fill="#2f9e44"/>
        <rect x="26" y="22" width="588" height="416" rx="20" fill="none" stroke="#1f7a33" stroke-width="5"/>
        <path d="M34,40 L34,420 M606,40 L606,420 M44,30 L596,30 M44,430 L596,430" stroke="#69db7c" stroke-width="2" stroke-dasharray="10 7" stroke-linecap="round" opacity="0.6"/>
        <path d="M46,30 L200,30" stroke="#b2f2bb" stroke-width="3" stroke-linecap="round" opacity="0.6"/></g>
      <g class="org" data-org="citoplasma"><title>Citoplasma</title>
        <rect x="46" y="42" width="548" height="376" rx="12" fill="url(#P-citov)"/>
        ${motas(50, 60, 55, 520, 350, '#b8f0e0')}</g>
      <g class="org" data-org="membrana"><title>Membrana plasmática</title>
        <rect x="46" y="42" width="548" height="376" rx="12" fill="none" stroke="#d94d8a" stroke-width="6"/>
        <rect x="46" y="42" width="548" height="376" rx="12" fill="none" stroke="#ff8fc0" stroke-width="2.5"/>
        <rect x="46" y="42" width="548" height="376" rx="12" fill="none" stroke="transparent" stroke-width="14" pointer-events="stroke"/></g>
      ${org('vacuola', 0, 0, 0, `<path d="M250,120 C250,92 290,86 380,88 C470,90 520,100 522,150 C526,220 530,300 500,330 C470,358 360,356 300,344 C258,336 246,300 248,250 Z" fill="url(#P-vac)"/>
        <path d="M268,132 C272,108 310,104 360,104" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.45"/>
        <circle cx="470" cy="300" r="5" fill="#fff" opacity="0.25"/><circle cx="450" cy="318" r="3" fill="#fff" opacity="0.25"/>`)}
      ${nucleo(140, 140, 52)}
      ${rer(90, 220, 0)}
      ${golgi(150, 330, -10)}
      ${rel(210, 385, 0)}
      ${mitocondria(230, 70, 0, 0.8)}${mitocondria(560, 250, 90, 0.8)}${mitocondria(100, 290, 60, 0.75)}
      ${cloroplasto(420, 70, 5, 0.9)}${cloroplasto(560, 120, 70, 0.9)}${cloroplasto(555, 370, -30, 0.9)}${cloroplasto(420, 385, 0, 0.9)}${cloroplasto(250, 305, 80, 0.8)}${cloroplasto(300, 70, -8, 0.8)}
      ${ribosomas([[80, 110], [210, 120], [220, 200], [200, 260], [80, 360], [330, 395], [480, 400], [580, 190], [490, 60], [360, 60]])}`);
  }

  // ---------- Estado ----------
  let raiz, tipo = 'animal', seleccion = null, vb = { ...VB }, animZoom = null;
  let quiz = null; // { preguntas, i, puntos, esperando }

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🔬 Explorador de la célula</h1>
        <p>Toca un orgánulo para acercarte y conocer su función. Cambia entre la célula animal y la vegetal, o compáralas.</p>
      </div>
      <div class="cel-controles">
        <div class="segmentado" id="cel-tipos">
          <button data-t="animal">🐾 Célula animal</button>
          <button data-t="vegetal">🌿 Célula vegetal</button>
          <button data-t="comparar">⚖️ Comparar</button>
        </div>
        <button class="btn primario" id="cel-quiz">🎯 ¿Dónde está?</button>
      </div>
      <div id="cel-barra-quiz" class="barra-desafio" hidden></div>

      <div id="cel-vista-una" class="cel-grid">
        <div class="panel cel-visor">
          <div class="cel-zoom">
            <button class="btn chico" id="cel-acercar" aria-label="Acercar">➕</button>
            <button class="btn chico" id="cel-alejar" aria-label="Alejar">➖</button>
            <button class="btn chico" id="cel-completa">⟲ Ver toda la célula</button>
          </div>
          <svg id="cel-svg" class="cel-svg" viewBox="0 0 640 460" role="img" aria-label="Dibujo de la célula"></svg>
          <div class="cel-lista" id="cel-lista"></div>
        </div>
        <aside class="panel cel-info" id="cel-info"></aside>
      </div>

      <div id="cel-vista-comparar" hidden>
        <div class="cel-comparar">
          <div class="panel"><h2>🐾 Célula animal</h2><svg class="cel-svg chica" viewBox="0 0 640 460">${celulaAnimal()}</svg></div>
          <div class="panel"><h2>🌿 Célula vegetal</h2><svg class="cel-svg chica" viewBox="0 0 640 460">${celulaVegetal()}</svg></div>
        </div>
        <div class="panel">
          <h2>¿Qué tiene cada una?</h2>
          <div class="tabla-scroll">
            <table class="cel-tabla">
              <thead><tr><th>Estructura</th><th>Animal</th><th>Vegetal</th></tr></thead>
              <tbody>${Object.entries(ORGANULOS).map(([k, o]) => `
                <tr class="${o.animal !== o.vegetal ? 'distinto' : ''}"><td><button class="cel-link" data-org="${k}">${o.nombre}</button></td>
                <td>${o.animal ? '✔' : '—'}</td><td>${o.vegetal ? '✔' : '—'}</td></tr>`).join('')}</tbody>
            </table>
          </div>
          <p class="cel-resumen">Las filas marcadas son las diferencias: la célula <b>vegetal</b> tiene pared celular, cloroplastos y una vacuola central grande; la <b>animal</b> tiene centríolos y lisosomas.</p>
        </div>
      </div>`;

    raiz.querySelectorAll('#cel-tipos button').forEach(b => b.addEventListener('click', () => cambiarTipo(b.dataset.t)));
    const svg = raiz.querySelector('#cel-svg');
    svg.addEventListener('click', e => {
      const g = e.target.closest('.org');
      if (g) tocar(g.dataset.org, g);
    });
    raiz.querySelector('#cel-vista-comparar').addEventListener('click', e => {
      const g = e.target.closest('[data-org]');
      if (!g) return;
      raiz.querySelectorAll('#cel-vista-comparar .org').forEach(o => o.classList.toggle('sel', o.dataset.org === g.dataset.org));
      raiz.querySelectorAll('#cel-vista-comparar .cel-svg').forEach(s => s.classList.add('con-sel'));
      raiz.querySelectorAll('.cel-tabla tr').forEach(tr => tr.classList.toggle('marcada', !!tr.querySelector(`[data-org="${g.dataset.org}"]`)));
    });
    raiz.querySelector('#cel-acercar').addEventListener('click', () => zoomFactor(0.7));
    raiz.querySelector('#cel-alejar').addEventListener('click', () => zoomFactor(1 / 0.7));
    raiz.querySelector('#cel-completa').addEventListener('click', () => { seleccion = null; marcar(); zoomA({ ...VB }); pintarInfo(); });
    raiz.querySelector('#cel-quiz').addEventListener('click', () => (quiz ? terminarQuiz() : empezarQuiz()));
    cambiarTipo('animal');
  }

  function cambiarTipo(t) {
    if (quiz && t === 'comparar') terminarQuiz();
    tipo = t;
    raiz.querySelectorAll('#cel-tipos button').forEach(b => b.classList.toggle('activo', b.dataset.t === t));
    raiz.querySelector('#cel-vista-una').hidden = t === 'comparar';
    raiz.querySelector('#cel-vista-comparar').hidden = t !== 'comparar';
    raiz.querySelector('#cel-quiz').hidden = t === 'comparar';
    if (t === 'comparar') return;
    raiz.querySelector('#cel-svg').innerHTML = t === 'animal' ? celulaAnimal() : celulaVegetal();
    raiz.querySelector('#cel-svg').setAttribute('aria-label', t === 'animal' ? 'Dibujo de una célula animal' : 'Dibujo de una célula vegetal');
    seleccion = null;
    vb = { ...VB };
    aplicarVB();
    marcar();
    pintarLista();
    pintarInfo();
    if (quiz) empezarQuiz();
  }

  const presentes = () => Object.keys(ORGANULOS).filter(k => ORGANULOS[k][tipo]);

  function pintarLista() {
    const lista = raiz.querySelector('#cel-lista');
    lista.innerHTML = presentes().map(k => `<button class="cel-chip" data-org="${k}">${ORGANULOS[k].nombre}</button>`).join('');
    lista.querySelectorAll('.cel-chip').forEach(b => b.addEventListener('click', () => {
      const g = raiz.querySelector(`#cel-svg .org[data-org="${b.dataset.org}"]`);
      tocar(b.dataset.org, g);
    }));
  }

  function tocar(clave, g) {
    if (quiz) return responderQuiz(clave, g);
    seleccion = clave;
    marcar();
    pintarInfo();
    // La membrana, la pared y el citoplasma ocupan toda la célula: no hace falta acercarse.
    if (g && !['membrana', 'pared', 'citoplasma'].includes(clave)) zoomAElemento(g);
    else zoomA({ ...VB });
  }

  function marcar() {
    const svg = raiz.querySelector('#cel-svg');
    svg.classList.toggle('con-sel', !!seleccion);
    svg.querySelectorAll('.org').forEach(o => o.classList.toggle('sel', o.dataset.org === seleccion));
    raiz.querySelectorAll('#cel-lista .cel-chip').forEach(b => b.classList.toggle('activo', b.dataset.org === seleccion));
  }

  function pintarInfo() {
    const info = raiz.querySelector('#cel-info');
    if (!seleccion) {
      info.innerHTML = `
        <h2>${tipo === 'animal' ? '🐾 Célula animal' : '🌿 Célula vegetal'}</h2>
        <p>${tipo === 'animal'
          ? 'Forma parte de los animales, como nosotros. No tiene pared celular, así que su forma es flexible.'
          : 'Forma parte de las plantas. Tiene pared celular (por eso su forma es rectangular), cloroplastos para hacer fotosíntesis y una gran vacuola central.'}</p>
        <p class="cel-ayuda">👆 Toca cualquier parte del dibujo, o un nombre de la lista, para ver qué es y para qué sirve.</p>`;
      return;
    }
    const o = ORGANULOS[seleccion];
    info.innerHTML = `
      <h2>${o.nombre}</h2>
      <p>${o.funcion}</p>
      <p class="cel-analogia">💡 ${o.analogia}</p>
      <div class="cel-presencia">
        <span class="${o.animal ? 'si' : 'no'}">${o.animal ? '✔' : '✖'} Célula animal</span>
        <span class="${o.vegetal ? 'si' : 'no'}">${o.vegetal ? '✔' : '✖'} Célula vegetal</span>
      </div>`;
  }

  // ---------- Zoom ----------

  function aplicarVB() {
    raiz.querySelector('#cel-svg').setAttribute('viewBox', `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`);
  }

  function limitar(v) {
    const w = Math.max(MIN_W, Math.min(VB.w, v.w));
    const h = w * VB.h / VB.w;
    return { w, h, x: Math.max(0, Math.min(VB.w - w, v.x)), y: Math.max(0, Math.min(VB.h - h, v.y)) };
  }

  function zoomA(destino) {
    destino = limitar(destino);
    const inicio = { ...vb }, t0 = performance.now(), dur = 550;
    cancelAnimationFrame(animZoom);
    const paso = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      ['x', 'y', 'w', 'h'].forEach(k => { vb[k] = inicio[k] + (destino[k] - inicio[k]) * e; });
      aplicarVB();
      if (p < 1) animZoom = requestAnimationFrame(paso);
    };
    animZoom = requestAnimationFrame(paso);
  }

  function zoomAElemento(g) {
    const b = g.getBBox();
    let w = Math.max(b.width * 2.6, b.height * 2.6 * VB.w / VB.h, 180);
    const h = w * VB.h / VB.w;
    zoomA({ x: b.x + b.width / 2 - w / 2, y: b.y + b.height / 2 - h / 2, w, h });
  }

  function zoomFactor(f) {
    const w = vb.w * f, h = vb.h * f;
    zoomA({ x: vb.x + (vb.w - w) / 2, y: vb.y + (vb.h - h) / 2, w, h });
  }

  // ---------- Juego: ¿Dónde está? ----------

  function empezarQuiz() {
    const orden = Util.mezclar(presentes());
    quiz = { preguntas: orden.slice(0, 8), i: 0, puntos: 0, esperando: false };
    seleccion = null;
    marcar();
    zoomA({ ...VB });
    raiz.querySelector('#cel-quiz').textContent = '✕ Salir del juego';
    raiz.querySelector('#cel-barra-quiz').hidden = false;
    raiz.querySelector('#cel-lista').hidden = true;
    raiz.querySelector('#cel-info').innerHTML = `<h2>🎯 ¿Dónde está?</h2><p>Toca en el dibujo la estructura que se pide arriba. Puedes acercarte con los botones ➕ y ➖.</p>`;
    preguntaQuiz();
  }

  function preguntaQuiz() {
    const k = quiz.preguntas[quiz.i];
    raiz.querySelector('#cel-barra-quiz').innerHTML = `
      <span class="bd-num">${quiz.i + 1}/${quiz.preguntas.length}</span>
      <span class="bd-texto">Toca: <b>${ORGANULOS[k].nombre}</b></span>
      <span class="bd-puntos">⭐ ${quiz.puntos}</span>`;
  }

  function responderQuiz(clave) {
    if (quiz.esperando) return;
    quiz.esperando = true;
    const buscada = quiz.preguntas[quiz.i];
    const ok = clave === buscada;
    if (ok) quiz.puntos++;
    seleccion = buscada;
    marcar();
    const barra = raiz.querySelector('#cel-barra-quiz');
    barra.querySelector('.bd-puntos').textContent = `⭐ ${quiz.puntos}`;
    barra.querySelector('.bd-texto').innerHTML += ok
      ? ' <span class="bd-fb ok">¡Correcto!</span>'
      : ` <span class="bd-fb mal">Eso es: ${ORGANULOS[clave].nombre}</span>`;
    raiz.querySelector('#cel-info').innerHTML = `<h2>${ORGANULOS[buscada].nombre}</h2><p>${ORGANULOS[buscada].funcion}</p>`;
    setTimeout(() => {
      if (!quiz) return;
      quiz.esperando = false;
      seleccion = null;
      marcar();
      quiz.i++;
      if (quiz.i < quiz.preguntas.length) preguntaQuiz();
      else {
        const { puntos, preguntas } = quiz;
        terminarQuiz();
        const barra2 = raiz.querySelector('#cel-barra-quiz');
        barra2.hidden = false;
        barra2.innerHTML = `<span class="bd-texto">🏁 Encontraste <b>${puntos} de ${preguntas.length}</b> estructuras. ${puntos === preguntas.length ? '¡Perfecto! 🏆' : ''}</span>
          <button class="btn primario chico" id="cel-otra">Jugar otra vez</button>`;
        barra2.querySelector('#cel-otra').addEventListener('click', empezarQuiz);
      }
    }, ok ? 1100 : 2000);
  }

  function terminarQuiz() {
    quiz = null;
    raiz.querySelector('#cel-quiz').textContent = '🎯 ¿Dónde está?';
    raiz.querySelector('#cel-barra-quiz').hidden = true;
    raiz.querySelector('#cel-lista').hidden = false;
    seleccion = null;
    marcar();
    pintarInfo();
  }

  return { iniciar };
})();
