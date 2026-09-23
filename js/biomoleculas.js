// Módulo 9: Biomoléculas (carbohidratos, lípidos, proteínas y ácidos nucleicos).
const Biomoleculas = (function () {
  const NS = 'http://www.w3.org/2000/svg';

  // ---------- Figuras en dos tonos ----------
  const puntos = (r, angulos) => angulos.map(a => [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)]);
  const poligono = p => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  function hexagono(r, claro, oscuro) {
    const v = puntos(r, [-90, -30, 30, 90, 150, 210]);
    return `<polygon points="${poligono(v)}" fill="${claro}"/><polygon points="${poligono([v[0], v[1], v[2], v[3]])}" fill="${oscuro}"/>`;
  }
  function pentagono(r, claro, oscuro) {
    const v = puntos(r, [-90, -18, 54, 126, 198]);
    const base = [(v[2][0] + v[3][0]) / 2, (v[2][1] + v[3][1]) / 2];
    return `<polygon points="${poligono(v)}" fill="${claro}"/><polygon points="${poligono([v[0], v[1], v[2], base])}" fill="${oscuro}"/>`;
  }
  const circulo = (r, claro, oscuro) => `<circle r="${r}" fill="${claro}"/><path d="M0,${-r} A${r},${r} 0 0 1 0,${r} Z" fill="${oscuro}"/>`;
  const brillo = r => `<circle cx="${-r * 0.4}" cy="${-r * 0.45}" r="${r * 0.18}" fill="#fff" opacity="0.55"/>`;
  const etiqueta = (t, color = '#15163d') => `<text y="4" text-anchor="middle" class="bm-letra" fill="${color}">${t}</text>`;
  const agua = '<g class="bm-h2o"><circle r="7" fill="#ff6b6b"/><circle cx="-7" cy="-5" r="4.5" fill="#f4f6ff"/><circle cx="7" cy="-5" r="4.5" fill="#f4f6ff"/></g>';

  // ---------- Tipos de biomoléculas ----------
  const TIPOS = {
    carbohidratos: {
      nombre: 'Carbohidratos', icono: '🍞', enlace: 'enlace glucosídico', max: 16,
      intro: 'También llamados glúcidos o azúcares. Son la <b>fuente de energía rápida</b> de los seres vivos. Su unidad es el <b>monosacárido</b>.',
      piezas: [
        { id: 'glc', nombre: 'Glucosa', corto: 'Glc', dibujo: () => hexagono(24, '#ffd166', '#f0a830') },
        { id: 'fru', nombre: 'Fructosa', corto: 'Fru', dibujo: () => pentagono(24, '#ff9f43', '#e07a1f') },
        { id: 'gal', nombre: 'Galactosa', corto: 'Gal', dibujo: () => hexagono(24, '#ffe8a3', '#e9c46a') },
      ],
    },
    proteinas: {
      nombre: 'Proteínas', icono: '🥚', enlace: 'enlace peptídico', max: 16,
      intro: 'Forman músculos, enzimas, anticuerpos y mucho más: son las <b>constructoras</b> del cuerpo. Su unidad es el <b>aminoácido</b> (hay 20 distintos).',
      piezas: [
        { id: 'gly', nombre: 'Glicina', corto: 'Gly', dibujo: () => circulo(20, '#7c86ff', '#5a63d8') },
        { id: 'ala', nombre: 'Alanina', corto: 'Ala', dibujo: () => circulo(20, '#5cc8ff', '#3aa0d8') },
        { id: 'val', nombre: 'Valina', corto: 'Val', dibujo: () => circulo(20, '#2fd186', '#1a9a61') },
        { id: 'leu', nombre: 'Leucina', corto: 'Leu', dibujo: () => circulo(20, '#b6f36b', '#8fd14f') },
        { id: 'ser', nombre: 'Serina', corto: 'Ser', dibujo: () => circulo(20, '#ff9fb5', '#e0718f') },
        { id: 'cys', nombre: 'Cisteína', corto: 'Cys', dibujo: () => circulo(20, '#ffd166', '#f0a830') },
      ],
    },
    lipidos: {
      nombre: 'Lípidos', icono: '🧈', enlace: 'enlace éster', max: 4,
      intro: 'Grasas y aceites: son la <b>reserva de energía</b> a largo plazo y forman las membranas de las células. No se disuelven en agua.',
      piezas: [
        { id: 'gli', nombre: 'Glicerol', corto: 'Glicerol' },
        { id: 'sat', nombre: 'Ácido graso saturado', corto: 'Saturado' },
        { id: 'ins', nombre: 'Ácido graso insaturado', corto: 'Insaturado' },
      ],
    },
    adn: {
      nombre: 'Ácidos nucleicos', icono: '🧬', enlace: 'enlace fosfodiéster', max: 8,
      intro: 'El ADN y el ARN guardan y transmiten la <b>información genética</b>. Su unidad es el <b>nucleótido</b>: un azúcar, un fosfato y una base (A, T, C o G).',
      piezas: [
        { id: 'A', nombre: 'Adenina', corto: 'A', color: ['#ff6b6b', '#d94848'] },
        { id: 'T', nombre: 'Timina', corto: 'T', color: ['#ffd166', '#f0a830'] },
        { id: 'C', nombre: 'Citosina', corto: 'C', color: ['#5cc8ff', '#3aa0d8'] },
        { id: 'G', nombre: 'Guanina', corto: 'G', color: ['#2fd186', '#1a9a61'] },
      ],
    },
  };
  const PAR = { A: 'T', T: 'A', C: 'G', G: 'C' };

  // ---------- Laboratorio de reconocimiento ----------
  const MUESTRAS = [
    { id: 'agua', nombre: 'Agua (control)', icono: '💧', color: 'rgba(200, 225, 255, 0.35)' },
    { id: 'papa', nombre: 'Papa rallada', icono: '🥔', color: 'rgba(245, 240, 225, 0.85)' },
    { id: 'pan', nombre: 'Pan en agua', icono: '🍞', color: 'rgba(235, 215, 180, 0.85)' },
    { id: 'miel', nombre: 'Miel', icono: '🍯', color: 'rgba(240, 170, 50, 0.8)' },
    { id: 'azucar', nombre: 'Azúcar de mesa', icono: '🧂', color: 'rgba(230, 240, 255, 0.45)' },
    { id: 'clara', nombre: 'Clara de huevo', icono: '🥚', color: 'rgba(245, 245, 225, 0.6)' },
    { id: 'aceite', nombre: 'Aceite', icono: '🫒', color: 'rgba(240, 200, 60, 0.75)' },
    { id: 'leche', nombre: 'Leche', icono: '🥛', color: 'rgba(250, 250, 250, 0.95)' },
  ];
  const REACTIVOS = [
    { id: 'lugol', nombre: 'Lugol', busca: 'almidón', color: '#b07a2a', positivo: '#1b1464', negativo: '#c9953a',
      si: 'El lugol se volvió <b>azul oscuro casi negro</b>: hay <b>almidón</b>, un polisacárido.',
      no: 'El lugol quedó <b>amarillo-marrón</b>: no hay almidón.' },
    { id: 'benedict', nombre: 'Benedict + calor', busca: 'azúcares simples (reductores)', color: '#4dabf7', positivo: '#d9480f', negativo: '#4dabf7', calor: true,
      si: 'Al calentar apareció un color <b>rojo ladrillo</b>: hay <b>azúcares reductores</b>, como la glucosa.',
      no: 'Siguió <b>azul</b>: no hay azúcares reductores.' },
    { id: 'biuret', nombre: 'Biuret', busca: 'proteínas', color: '#74c0fc', positivo: '#862e9c', negativo: '#74c0fc',
      si: 'Se volvió <b>violeta</b>: hay <b>proteínas</b> (el reactivo reconoce los enlaces peptídicos).',
      no: 'Quedó <b>celeste</b>: no hay proteínas.' },
    { id: 'sudan', nombre: 'Sudán III', busca: 'lípidos', color: '#e8590c', positivo: '#e8590c', negativo: '#ffc9c9', capa: true,
      si: 'Se formó una <b>capa roja</b> arriba: hay <b>lípidos</b>, que se tiñen con Sudán III y flotan sobre el agua.',
      no: 'El colorante quedó repartido y pálido: no hay lípidos.' },
  ];
  // Resultado de cada combinación muestra-reactivo.
  const POSITIVOS = {
    papa: ['lugol'], pan: ['lugol', 'biuret'], miel: ['benedict'], clara: ['biuret'], aceite: ['sudan'], leche: ['benedict', 'biuret', 'sudan'],
  };
  const NOTAS = {
    'azucar-benedict': 'El azúcar de mesa es <b>sacarosa</b>, que no es un azúcar reductor: por eso el Benedict no cambia aunque sea un azúcar.',
    'leche-benedict': 'La leche tiene <b>lactosa</b>, un azúcar reductor.',
    'pan-biuret': 'La harina de trigo tiene <b>gluten</b>, una proteína.',
    'agua-lugol': 'El agua es el <b>control</b>: sirve para comparar y saber cómo se ve un resultado negativo.',
  };

  // ---------- Clasificar alimentos ----------
  const ALIMENTOS = [
    { e: '🍞', n: 'Pan', r: 'carbohidratos', x: 'Está hecho de harina, rica en <b>almidón</b>.' },
    { e: '🍚', n: 'Arroz', r: 'carbohidratos', x: 'Casi todo es <b>almidón</b>.' },
    { e: '🥔', n: 'Papa', r: 'carbohidratos', x: 'Guarda su energía como <b>almidón</b>.' },
    { e: '🍝', n: 'Fideos', r: 'carbohidratos', x: 'Se hacen con harina: mucho <b>almidón</b>.' },
    { e: '🍯', n: 'Miel', r: 'carbohidratos', x: 'Es casi pura <b>glucosa y fructosa</b>.' },
    { e: '🍌', n: 'Banana', r: 'carbohidratos', x: 'Tiene azúcares y almidón.' },
    { e: '🫒', n: 'Aceite de oliva', r: 'lipidos', x: 'Es un lípido <b>insaturado</b>, líquido a temperatura ambiente.' },
    { e: '🧈', n: 'Manteca', r: 'lipidos', x: 'Es una grasa <b>saturada</b>, sólida a temperatura ambiente.' },
    { e: '🥑', n: 'Palta', r: 'lipidos', x: 'Es una fruta muy rica en <b>grasas insaturadas</b>.' },
    { e: '🥜', n: 'Maní', r: 'lipidos', x: 'Tiene mucha grasa (y también bastante proteína).' },
    { e: '🥩', n: 'Carne', r: 'proteinas', x: 'El músculo está formado sobre todo por <b>proteínas</b>.' },
    { e: '🍗', n: 'Pollo', r: 'proteinas', x: 'Rico en <b>proteínas</b>.' },
    { e: '🐟', n: 'Pescado', r: 'proteinas', x: 'Aporta <b>proteínas</b> y grasas saludables (omega 3).' },
    { e: '🥚', n: 'Clara de huevo', r: 'proteinas', x: 'Es casi pura <b>proteína</b> (albúmina) y agua.' },
  ];
  const GRUPOS_ALIM = { carbohidratos: '🍞 Carbohidratos', lipidos: '🧈 Lípidos', proteinas: '🥩 Proteínas' };

  let raiz, modo = 'armar', tipo = 'carbohidratos';
  let cadena = [], aguas = 0, plegada = false, complementaria = null, girar = false, fase = 0, animGiro = null;
  let tubo = null, resultados = {}; // resultados["muestra-reactivo"] = true/false
  let juego = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🧬 Biomoléculas</h1>
        <p>Las moléculas de la vida: <b>carbohidratos, lípidos, proteínas y ácidos nucleicos</b>. Ármalas, reconócelas en el laboratorio y descubre en qué alimentos están.</p>
      </div>
      <div class="segmentado" id="bm-modos">
        <button data-m="armar">🧩 Armar</button>
        <button data-m="reconocer">🧪 Reconocer en el laboratorio</button>
        <button data-m="clasificar">🍽️ Clasificar alimentos</button>
      </div>
      <div id="bm-vista"></div>`;
    raiz.querySelectorAll('#bm-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    cambiarModo('armar');
  }

  function cambiarModo(m) {
    modo = m;
    cancelAnimationFrame(animGiro);
    raiz.querySelectorAll('#bm-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    if (m === 'armar') vistaArmar();
    else if (m === 'reconocer') vistaReconocer();
    else vistaClasificar();
  }

  // =====================================================================
  // ARMAR
  // =====================================================================

  function vistaArmar() {
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="bm-tipos" id="bm-tipos">
        ${Object.entries(TIPOS).map(([k, t]) => `<button data-t="${k}">${t.icono} ${t.nombre}</button>`).join('')}
      </div>
      <div class="bm-grid">
        <div class="panel bm-mesa">
          <svg id="bm-svg" viewBox="0 0 760 300" role="img" aria-label="Mesa para armar biomoléculas">
            <defs><radialGradient id="bm-fondo" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="#23266b"/><stop offset="1" stop-color="#0e1033"/></radialGradient></defs>
            <rect width="760" height="300" fill="url(#bm-fondo)"/>
            <g id="bm-enlaces"></g><g id="bm-piezas"></g><g id="bm-efectos"></g><g id="bm-helice"></g>
          </svg>
          <div class="bm-botonera" id="bm-botonera"></div>
          <div class="bm-acciones" id="bm-acciones"></div>
        </div>
        <aside class="panel bm-info" id="bm-info"></aside>
      </div>`;
    raiz.querySelectorAll('#bm-tipos button').forEach(b => b.addEventListener('click', () => elegirTipo(b.dataset.t)));
    elegirTipo(tipo);
  }

  function elegirTipo(t) {
    tipo = t;
    cadena = [];
    aguas = 0;
    plegada = false;
    complementaria = null;
    girar = false;
    cancelAnimationFrame(animGiro);
    raiz.querySelector('#bm-helice').innerHTML = '';
    ['#bm-piezas', '#bm-enlaces', '#bm-efectos'].forEach(sel => { raiz.querySelector(sel).style.opacity = ''; });
    raiz.querySelectorAll('#bm-tipos button').forEach(b => b.classList.toggle('activo', b.dataset.t === t));
    raiz.querySelector('#bm-piezas').innerHTML = '';
    raiz.querySelector('#bm-enlaces').innerHTML = '';
    raiz.querySelector('#bm-efectos').innerHTML = '';
    const T = TIPOS[t];
    raiz.querySelector('#bm-botonera').innerHTML = T.piezas.map(p => `
      <button class="bm-pieza-btn" data-p="${p.id}">
        <svg viewBox="-28 -28 56 56" width="34" height="34" aria-hidden="true">${miniatura(p)}</svg>
        <span>${p.nombre}</span>
      </button>`).join('');
    raiz.querySelectorAll('.bm-pieza-btn').forEach(b => b.addEventListener('click', () => agregar(b.dataset.p)));
    actualizarArmar();
  }

  function miniatura(p) {
    if (tipo === 'lipidos') {
      if (p.id === 'gli') return '<rect x="-12" y="-24" width="24" height="48" rx="8" fill="#b197fc"/><rect x="0" y="-24" width="12" height="48" rx="0" fill="#9775fa"/>';
      return p.id === 'sat'
        ? '<polyline points="-24,4 -16,-4 -8,4 0,-4 8,4 16,-4 24,4" fill="none" stroke="#ffd166" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>'
        : '<polyline points="-24,10 -16,2 -8,10 0,2 6,-10 14,-18 22,-10" fill="none" stroke="#ff9f43" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    if (tipo === 'adn') return nucleotido(p.id, false, true);
    return p.dibujo() + brillo(20) + etiqueta(p.corto);
  }

  function nucleotido(base, abajo = false, mini = false) {
    const pz = TIPOS.adn.piezas.find(x => x.id === base);
    const s = abajo ? -1 : 1;
    const esc = mini ? 0.8 : 1;
    return `<g transform="scale(${esc})">
      <circle cx="-14" cy="${-10 * s}" r="6" fill="#ffe8a3"/>
      ${`<g transform="translate(0 ${-6 * s})">${pentagono(11, '#b197fc', '#9775fa')}</g>`}
      <rect x="-8" y="${abajo ? -34 : 6}" width="16" height="28" rx="5" fill="${pz.color[0]}"/>
      <rect x="0" y="${abajo ? -34 : 6}" width="8" height="28" rx="0" fill="${pz.color[1]}"/>
      <text y="${abajo ? -16 : 25}" text-anchor="middle" class="bm-letra" fill="#15163d">${base}</text></g>`;
  }

  // Posición de cada pieza en la mesa (en zigzag si la cadena es larga).
  function posicion(i, n) {
    if (tipo === 'adn') return { x: 380 - (n - 1) * 36 + i * 72, y: 100 };
    if (tipo === 'lipidos') return i === 0 ? { x: 150, y: 150 } : { x: 150, y: 150 + (i - 2) * 58 };
    if (plegada) {
      // Proteína plegada: los aminoácidos se acomodan en un ovillo compacto.
      const r = 14 * Math.sqrt(i + 0.5), a = i * 2.4;
      return { x: 380 + r * Math.cos(a) * 1.4, y: 150 + r * Math.sin(a) };
    }
    const porFila = 9, fila = Math.floor(i / porFila), col = i % porFila;
    const x = fila % 2 === 0 ? 100 + col * 70 : 100 + (porFila - 1 - col) * 70;
    return { x, y: n > porFila ? 95 + fila * 110 : 150 };
  }

  function agregar(id) {
    const T = TIPOS[tipo];
    if (complementaria) return;
    if (tipo === 'lipidos') {
      if (!cadena.length && id !== 'gli') return avisar('Primero necesitas un <b>glicerol</b>: es la base a la que se unen los ácidos grasos.');
      if (cadena.length && id === 'gli') return avisar('Cada triglicérido tiene un solo glicerol.');
      if (cadena.length >= 4) return avisar('El glicerol solo tiene lugar para <b>3 ácidos grasos</b>.');
    } else if (cadena.length >= T.max) {
      return avisar(`¡Cadena completa! En la realidad pueden tener ${tipo === 'adn' ? 'millones de nucleótidos' : 'cientos o miles de unidades'}.`);
    }
    if (plegada) return avisar('Primero desnaturaliza la proteína para seguir agregando aminoácidos.');
    cadena.push(id);
    const hayEnlace = cadena.length > 1;
    if (hayEnlace) {
      aguas++;
      const a = posicion(cadena.length - 2, cadena.length), b = posicion(cadena.length - 1, cadena.length);
      efectoAgua(tipo === 'lipidos' ? { x: 200, y: b.y } : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, 'sale');
    }
    actualizarArmar(true);
  }

  function hidrolisis() {
    if (!cadena.length || complementaria) return;
    if (plegada) return avisar('Primero desnaturaliza la proteína.');
    if (cadena.length > 1) {
      const a = posicion(cadena.length - 2, cadena.length), b = posicion(cadena.length - 1, cadena.length);
      efectoAgua(tipo === 'lipidos' ? { x: 200, y: b.y } : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, 'entra');
      aguas = Math.max(0, aguas - 1);
    }
    const g = raiz.querySelector(`#bm-piezas [data-i="${cadena.length - 1}"]`);
    if (g) g.classList.add('sale');
    cadena.pop();
    setTimeout(() => actualizarArmar(), 350);
  }

  function efectoAgua(p, sentido) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${p.x} ${p.y})`);
    g.innerHTML = `<g class="bm-agua ${sentido}">${agua}<text y="24" text-anchor="middle" class="bm-agua-txt">H₂O</text></g>`;
    raiz.querySelector('#bm-efectos').appendChild(g);
    setTimeout(() => g.remove(), 1600);
  }

  function actualizarArmar(nueva) {
    const capa = raiz.querySelector('#bm-piezas');
    const n = cadena.length;
    // Crea o mueve cada pieza (las transiciones CSS animan el movimiento).
    [...capa.children].forEach(g => { if (+g.dataset.i >= n) g.remove(); });
    cadena.forEach((id, i) => {
      let g = capa.querySelector(`[data-i="${i}"]`);
      const pos = posicion(i, n);
      if (!g) {
        g = document.createElementNS(NS, 'g');
        g.dataset.i = i;
        g.setAttribute('class', 'bm-pieza' + (nueva && i === n - 1 ? ' nueva' : ''));
        g.innerHTML = `<g class="bm-pieza-int">${dibujoPieza(id, i)}</g>`;
        capa.appendChild(g);
      }
      g.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    });
    dibujarEnlaces();
    dibujarComplementaria();
    pintarAcciones();
    pintarInfo();
  }

  function dibujoPieza(id, i) {
    const p = TIPOS[tipo].piezas.find(x => x.id === id);
    if (tipo === 'adn') return nucleotido(id);
    if (tipo === 'lipidos') {
      if (id === 'gli') return `<rect x="-18" y="-86" width="36" height="172" rx="14" fill="#b197fc"/><rect x="0" y="-86" width="18" height="172" fill="#9775fa"/>
        <rect x="-18" y="-86" width="36" height="172" rx="14" fill="none"/>${brillo(30)}<text y="4" text-anchor="middle" transform="rotate(-90)" class="bm-letra" fill="#15163d">GLICEROL</text>`;
      const pts = [];
      for (let k = 0; k <= 12; k++) {
        let x = 30 + k * 26, y = k % 2 ? -8 : 8;
        if (id === 'ins' && k > 6) { x = 30 + 6 * 26 + (k - 6) * 22; y = (k % 2 ? -8 : 8) - (k - 6) * 5; }
        pts.push(`${x},${y}`);
      }
      return `<polyline points="${pts.join(' ')}" fill="none" stroke="${id === 'sat' ? '#ffd166' : '#ff9f43'}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
        ${id === 'ins' ? '<circle cx="186" cy="8" r="6" fill="#fff" opacity="0.8"/>' : ''}
        <circle cx="22" cy="0" r="7" fill="#ff6b6b"/>`;
    }
    return p.dibujo() + brillo(22) + etiqueta(p.corto);
  }

  function dibujarEnlaces() {
    const n = cadena.length;
    let svg = '';
    if (tipo === 'lipidos') {
      for (let i = 1; i < n; i++) { const p = posicion(i, n); svg += `<line x1="150" y1="${p.y}" x2="172" y2="${p.y}" class="bm-enlace"/>`; }
    } else if (!plegada) {
      for (let i = 1; i < n; i++) {
        const a = posicion(i - 1, n), b = posicion(i, n);
        const ya = tipo === 'adn' ? a.y - 10 : a.y, yb = tipo === 'adn' ? b.y - 10 : b.y;
        svg += `<line x1="${a.x}" y1="${ya}" x2="${b.x}" y2="${yb}" class="bm-enlace"/>`;
      }
    } else {
      const pts = cadena.map((_, i) => posicion(i, n)).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      svg = `<polyline points="${pts}" class="bm-enlace plegada"/>`;
    }
    raiz.querySelector('#bm-enlaces').innerHTML = svg;
  }

  // ADN: la hebra complementaria que completa el estudiante.
  function dibujarComplementaria() {
    const capa = raiz.querySelector('#bm-efectos');
    capa.querySelectorAll('.bm-comp').forEach(e => e.remove());
    if (!complementaria) return;
    const n = cadena.length;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'bm-comp');
    let svg = '';
    cadena.forEach((b, i) => {
      const p = posicion(i, n), yb = 220;
      const c = complementaria[i];
      if (c) {
        const enlacesH = (b === 'A' || b === 'T') ? 2 : 3;
        svg += `<g class="bm-par" data-i="${i}">
          ${Array.from({ length: enlacesH }, (_, k) => `<line x1="${p.x - 5 + k * 5}" y1="134" x2="${p.x - 5 + k * 5}" y2="186" class="bm-puente"/>`).join('')}
          <g transform="translate(${p.x} ${yb})">${nucleotido(c, true)}</g></g>`;
      } else {
        svg += `<g transform="translate(${p.x} ${yb})"><rect x="-12" y="-36" width="24" height="32" rx="6" class="bm-hueco ${i === complementaria.length ? 'actual' : ''}"/><text y="-15" text-anchor="middle" class="bm-letra" fill="#9aa3ff">?</text></g>`;
      }
    });
    if (complementaria.filter(Boolean).length > 1) {
      const xs = complementaria.map((c, i) => c ? posicion(i, n).x : null).filter(x => x !== null);
      svg = `<line x1="${xs[0]}" y1="226" x2="${xs[xs.length - 1]}" y2="226" class="bm-enlace"/>` + svg;
    }
    g.innerHTML = svg;
    capa.appendChild(g);
  }

  function pintarAcciones() {
    const n = cadena.length;
    let html = `<button class="btn chico" id="bm-hidro" ${n && !complementaria ? '' : 'disabled'}>💧 Hidrólisis (romper un enlace)</button>
      <button class="btn chico" id="bm-vaciar" ${n ? '' : 'disabled'}>↺ Empezar de nuevo</button>`;
    if (tipo === 'proteinas') {
      html += `<button class="btn chico primario" id="bm-plegar" ${n >= 8 ? '' : 'disabled'}>${plegada ? '🔥 Desnaturalizar (calor)' : '🌀 Plegar la proteína'}</button>`;
    }
    if (tipo === 'adn') {
      html += complementaria
        ? `<span class="bm-teclas">Base complementaria: ${['A', 'T', 'C', 'G'].map(b => `<button class="bm-tecla" data-b="${b}" style="--c:${TIPOS.adn.piezas.find(x => x.id === b).color[0]}">${b}</button>`).join('')}</span>
           <button class="btn chico" id="bm-girar" ${complementaria.length === cadena.length ? '' : 'disabled'}>${girar ? '⏸ Detener' : '🔄 Girar la doble hélice'}</button>`
        : `<button class="btn chico primario" id="bm-doble" ${n >= 4 ? '' : 'disabled'}>🧬 Formar la doble hélice</button>`;
    }
    const cont = raiz.querySelector('#bm-acciones');
    cont.innerHTML = html;
    cont.querySelector('#bm-hidro').addEventListener('click', hidrolisis);
    cont.querySelector('#bm-vaciar').addEventListener('click', () => elegirTipo(tipo));
    cont.querySelector('#bm-plegar')?.addEventListener('click', () => {
      plegada = !plegada;
      raiz.querySelector('#bm-enlaces').innerHTML = '';
      actualizarArmar();
      setTimeout(dibujarEnlaces, 750);
    });
    cont.querySelector('#bm-doble')?.addEventListener('click', () => { complementaria = []; actualizarArmar(); });
    cont.querySelectorAll('.bm-tecla').forEach(b => b.addEventListener('click', () => ponerBase(b.dataset.b)));
    cont.querySelector('#bm-girar')?.addEventListener('click', () => { girar = !girar; girar ? animarHelice() : detenerHelice(); pintarAcciones(); });
  }

  function ponerBase(b) {
    const i = complementaria.length;
    if (i >= cadena.length) return;
    if (PAR[cadena[i]] !== b) {
      avisar(`✖ Frente a <b>${cadena[i]}</b> no va <b>${b}</b>. Recuerda: <b>A</b> se une con <b>T</b> y <b>C</b> se une con <b>G</b>.`, true);
      return;
    }
    complementaria.push(b);
    actualizarArmar();
    if (complementaria.length === cadena.length) avisar('🎉 ¡Doble hélice completa! Las bases se unen por <b>puentes de hidrógeno</b>: 2 entre A y T, 3 entre C y G.');
  }

  // Rotación de la doble hélice: las dos hebras se dibujan como curvas que se entrelazan
  // y los pares de bases se acortan y alargan según el ángulo, como si girara en 3D.
  function animarHelice() {
    const n = cadena.length;
    const x0 = posicion(0, n).x, dx = 72, amp = 62, yc = 160;
    ['#bm-piezas', '#bm-enlaces', '#bm-efectos'].forEach(sel => { raiz.querySelector(sel).style.opacity = 0; });
    const colorDe = b => TIPOS.adn.piezas.find(p => p.id === b).color[0];
    const paso = () => {
      fase += 0.025;
      const ang = x => fase + ((x - x0) / dx) * 0.8;
      const hebra = sgn => {
        let d = '';
        for (let x = x0 - 30; x <= x0 + (n - 1) * dx + 30; x += 5) d += `${d ? ' L' : 'M'}${x.toFixed(1)},${(yc - sgn * amp * Math.cos(ang(x))).toFixed(1)}`;
        return d;
      };
      let svg = `<path d="${hebra(-1)}" class="bm-hebra atras"/>`;
      cadena.forEach((b, i) => {
        const x = x0 + i * dx, c = Math.cos(ang(x));
        const y1 = yc - amp * c, y2 = yc + amp * c, ym = yc;
        const frente = Math.sin(ang(x)) > 0 ? 1 : 0.55;
        svg += `<g opacity="${frente}">
          <line x1="${x}" y1="${y1.toFixed(1)}" x2="${x}" y2="${ym}" stroke="${colorDe(b)}" stroke-width="9" stroke-linecap="round"/>
          <line x1="${x}" y1="${ym}" x2="${x}" y2="${y2.toFixed(1)}" stroke="${colorDe(complementaria[i])}" stroke-width="9" stroke-linecap="round"/>
          ${Math.abs(c) > 0.35 ? `<text x="${x + 10}" y="${(y1 + (c > 0 ? 16 : -8)).toFixed(1)}" class="bm-letra" fill="#e9ebff">${b}</text>
          <text x="${x + 10}" y="${(y2 + (c > 0 ? -8 : 16)).toFixed(1)}" class="bm-letra" fill="#e9ebff">${complementaria[i]}</text>` : ''}
          <circle cx="${x}" cy="${y1.toFixed(1)}" r="6" fill="#b197fc"/><circle cx="${x}" cy="${y2.toFixed(1)}" r="6" fill="#9775fa"/></g>`;
      });
      svg += `<path d="${hebra(1)}" class="bm-hebra"/>`;
      raiz.querySelector('#bm-helice').innerHTML = svg;
      animGiro = requestAnimationFrame(paso);
    };
    animGiro = requestAnimationFrame(paso);
  }

  function detenerHelice() {
    cancelAnimationFrame(animGiro);
    raiz.querySelector('#bm-helice').innerHTML = '';
    ['#bm-piezas', '#bm-enlaces', '#bm-efectos'].forEach(sel => { raiz.querySelector(sel).style.opacity = ''; });
    actualizarArmar();
  }

  function avisar(html, error) {
    const a = raiz.querySelector('#bm-aviso');
    if (!a) return;
    a.innerHTML = html;
    a.className = 'bm-aviso' + (error ? ' error' : '');
  }

  // Nombre de lo que se armó.
  function nombreMolecula() {
    const n = cadena.length;
    if (!n) return { nombre: 'Nada todavía', desc: 'Toca las piezas de abajo para empezar a armar.' };
    if (tipo === 'carbohidratos') {
      if (n === 1) return { nombre: 'Monosacárido', desc: `Una molécula de ${TIPOS.carbohidratos.piezas.find(p => p.id === cadena[0]).nombre.toLowerCase()}: el azúcar más simple.` };
      if (n === 2) {
        const k = [...cadena].sort().join('+');
        const d = { 'glc+glc': ['Maltosa', 'el azúcar de la malta, que se forma al digerir el almidón'], 'fru+glc': ['Sacarosa', 'el azúcar de mesa, que se obtiene de la caña o la remolacha'], 'gal+glc': ['Lactosa', 'el azúcar de la leche'] }[k];
        return d ? { nombre: `Disacárido: ${d[0]}`, desc: `Es ${d[1]}.` } : { nombre: 'Disacárido', desc: 'Dos monosacáridos unidos.' };
      }
      if (n < 10) return { nombre: 'Oligosacárido', desc: 'Una cadena corta de monosacáridos. Agrega más glucosas para formar un polisacárido.' };
      const soloGlc = cadena.every(c => c === 'glc');
      return soloGlc
        ? { nombre: 'Polisacárido', desc: 'Una larga cadena de glucosas. Según cómo se unan forman <b>almidón</b> (reserva de las plantas), <b>glucógeno</b> (reserva en hígado y músculos) o <b>celulosa</b> (pared de las células vegetales).' }
        : { nombre: 'Polisacárido', desc: 'Una larga cadena de monosacáridos.' };
    }
    if (tipo === 'proteinas') {
      if (n === 1) return { nombre: 'Aminoácido', desc: 'La unidad de las proteínas.' };
      if (n === 2) return { nombre: 'Dipéptido', desc: 'Dos aminoácidos unidos por un enlace peptídico.' };
      if (n < 8) return { nombre: 'Péptido', desc: 'Una cadena corta de aminoácidos.' };
      return plegada
        ? { nombre: 'Proteína plegada', desc: 'La cadena se plegó con una <b>forma tridimensional</b>. Esa forma determina su función: por ejemplo, una enzima encaja con la sustancia sobre la que actúa como una llave en su cerradura.' }
        : { nombre: 'Polipéptido', desc: 'Una cadena larga de aminoácidos. El <b>orden</b> de los aminoácidos está escrito en el ADN. ¡Pliégala para que funcione como proteína!' };
    }
    if (tipo === 'lipidos') {
      const acidos = cadena.slice(1);
      if (!acidos.length) return { nombre: 'Glicerol', desc: 'Un alcohol con 3 lugares donde pueden unirse ácidos grasos.' };
      const nombres = ['Monoglicérido', 'Diglicérido', 'Triglicérido'];
      let desc = `${acidos.length} ácido${acidos.length > 1 ? 's' : ''} graso${acidos.length > 1 ? 's' : ''} unido${acidos.length > 1 ? 's' : ''} al glicerol.`;
      if (acidos.length === 3) {
        desc = acidos.every(a => a === 'sat')
          ? 'Todos sus ácidos grasos son <b>saturados</b> y rectos: se apilan bien y forman una <b>grasa sólida</b> a temperatura ambiente, como la manteca.'
          : 'Tiene ácidos grasos <b>insaturados</b>, doblados por un enlace doble: no se apilan bien y forman un <b>aceite líquido</b>, como el de oliva o girasol.';
      }
      return { nombre: nombres[acidos.length - 1], desc };
    }
    return {
      nombre: complementaria && complementaria.length === n ? 'ADN (doble hélice)' : 'Hebra de ADN',
      desc: `La secuencia <b>${cadena.join('-')}</b> es información: el orden de las bases indica cómo fabricar las proteínas.`,
    };
  }

  function pintarInfo() {
    const T = TIPOS[tipo];
    const m = nombreMolecula();
    const monomero = { carbohidratos: 'monosacáridos', proteinas: 'aminoácidos', lipidos: 'ácidos grasos + glicerol', adn: 'nucleótidos' }[tipo];
    raiz.querySelector('#bm-info').innerHTML = `
      <h2>${T.icono} ${T.nombre}</h2>
      <p>${T.intro}</p>
      <div class="bm-resultado">
        <span class="bm-res-lab">Formaste</span>
        <strong class="bm-res-nombre">${m.nombre}</strong>
        <p>${m.desc}</p>
      </div>
      <dl class="bm-datos">
        <dt>Unidades</dt><dd>${cadena.length} ${monomero}</dd>
        <dt>Tipo de enlace</dt><dd>${T.enlace}</dd>
        <dt>Agua liberada</dt><dd>${aguas} H₂O</dd>
      </dl>
      <p class="bm-aviso" id="bm-aviso">💡 Cada vez que se forma un enlace se libera una molécula de <b>agua</b> (<b>condensación</b>). La <b>hidrólisis</b> usa agua para romperlo: así digerimos los alimentos.</p>`;
  }

  // =====================================================================
  // RECONOCER EN EL LABORATORIO
  // =====================================================================

  function vistaReconocer() {
    tubo = null;
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="bm-lab">
        <div class="panel bm-lab-controles">
          <h2>1. Elige una muestra</h2>
          <div class="bm-lista" id="bm-muestras">${MUESTRAS.map(m => `<button data-m="${m.id}"><span>${m.icono}</span>${m.nombre}</button>`).join('')}</div>
          <h2>2. Agrega un reactivo</h2>
          <div class="bm-lista" id="bm-reactivos">${REACTIVOS.map(r => `<button data-r="${r.id}" disabled><b>${r.nombre}</b><small>detecta ${r.busca}</small></button>`).join('')}</div>
        </div>
        <div class="panel bm-lab-mesa">
          <svg id="bm-tubo" viewBox="0 0 260 320" role="img" aria-label="Tubo de ensayo"></svg>
          <p id="bm-lab-texto" class="bm-lab-texto">Elige una muestra para llenar el tubo de ensayo.</p>
        </div>
        <div class="panel bm-lab-tabla">
          <h2>📋 Resultados</h2>
          <div class="tabla-scroll"><table class="bm-tabla" id="bm-tabla"></table></div>
          <p class="bm-ayuda">+ = positivo · − = negativo. Prueba cada muestra con los cuatro reactivos para saber qué biomoléculas tiene.</p>
        </div>
      </div>`;
    raiz.querySelectorAll('#bm-muestras button').forEach(b => b.addEventListener('click', () => elegirMuestra(b.dataset.m)));
    raiz.querySelectorAll('#bm-reactivos button').forEach(b => b.addEventListener('click', () => agregarReactivo(b.dataset.r)));
    dibujarTubo();
    pintarTabla();
  }

  function dibujarTubo() {
    const m = tubo && MUESTRAS.find(x => x.id === tubo.muestra);
    const r = tubo && tubo.reactivo && REACTIVOS.find(x => x.id === tubo.reactivo);
    const nivel = m ? (r ? 150 : 110) : 0;
    raiz.querySelector('#bm-tubo').innerHTML = `
      <defs>
        <clipPath id="bm-clip-tubo"><path d="M100,40 L100,250 A30,30 0 0 0 160,250 L160,40 Z"/></clipPath>
        <linearGradient id="bm-vidrio" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.3" stop-color="#fff" stop-opacity="0.05"/><stop offset="1" stop-color="#fff" stop-opacity="0.2"/></linearGradient>
      </defs>
      <rect width="260" height="320" rx="14" fill="#12143a"/>
      ${r && r.calor ? `<g class="bm-bano"><rect x="70" y="200" width="120" height="80" rx="10" fill="#4c8dff" opacity="0.35"/><g class="bm-llama"><path d="M130,316 C112,300 120,290 130,280 C140,290 148,300 130,316 Z" fill="#ff9f43"/><path d="M130,314 C122,306 126,300 130,294 C134,300 138,306 130,314 Z" fill="#ffd166"/></g></g>` : ''}
      <g clip-path="url(#bm-clip-tubo)">
        <rect id="bm-liquido" x="100" y="${280 - nivel}" width="60" height="${nivel + 10}" fill="${m ? m.color : 'transparent'}"/>
        <rect id="bm-capa" x="100" y="${280 - nivel}" width="60" height="0" fill="#e8590c"/>
        <rect id="bm-precipitado" x="100" y="280" width="60" height="0" fill="#c92a2a"/>
      </g>
      <path d="M100,40 L100,250 A30,30 0 0 0 160,250 L160,40" fill="url(#bm-vidrio)" stroke="#c9ccf5" stroke-width="3"/>
      <rect x="92" y="32" width="76" height="10" rx="5" fill="#c9ccf5"/>
      <g id="bm-gotero"></g>`;
  }

  function elegirMuestra(id) {
    tubo = { muestra: id, reactivo: null };
    raiz.querySelectorAll('#bm-muestras button').forEach(b => b.classList.toggle('activo', b.dataset.m === id));
    raiz.querySelectorAll('#bm-reactivos button').forEach(b => { b.disabled = false; b.classList.remove('activo'); });
    dibujarTubo();
    const m = MUESTRAS.find(x => x.id === id);
    raiz.querySelector('#bm-lab-texto').innerHTML = `Pusiste <b>${m.nombre.toLowerCase()}</b> en el tubo. Ahora agrega un reactivo.`;
  }

  function agregarReactivo(id) {
    if (!tubo || tubo.reactivo) return;
    tubo.reactivo = id;
    const r = REACTIVOS.find(x => x.id === id), m = MUESTRAS.find(x => x.id === tubo.muestra);
    raiz.querySelectorAll('#bm-reactivos button').forEach(b => { b.disabled = true; b.classList.toggle('activo', b.dataset.r === id); });
    dibujarTubo();
    const positivo = (POSITIVOS[tubo.muestra] || []).includes(id);
    const liq = raiz.querySelector('#bm-liquido');
    // Gotas del reactivo cayendo.
    raiz.querySelector('#bm-gotero').innerHTML = `
      <rect x="120" y="-4" width="20" height="26" rx="6" fill="#c9ccf5"/><rect x="126" y="20" width="8" height="14" fill="#c9ccf5"/>
      ${[0, 1, 2].map(i => `<circle cx="130" cy="40" r="4" fill="${r.color}" class="bm-gota" style="animation-delay:${i * 0.3}s"/>`).join('')}`;
    const texto = raiz.querySelector('#bm-lab-texto');
    texto.innerHTML = `Agregando <b>${r.nombre}</b>…`;
    setTimeout(() => { liq.style.fill = mezclar(m.color, r.color); }, 500);
    const demora = r.calor ? 2600 : 1400;
    if (r.calor) setTimeout(() => { texto.innerHTML = '🔥 Calentando a baño María…'; }, 900);
    setTimeout(() => {
      raiz.querySelector('#bm-gotero').innerHTML = '';
      if (r.capa && positivo) {
        const capa = raiz.querySelector('#bm-capa');
        capa.style.height = '34px';
        liq.style.fill = 'rgba(255, 220, 220, 0.5)';
      } else {
        liq.style.fill = positivo ? r.positivo : r.negativo;
        if (positivo && r.id === 'benedict') raiz.querySelector('#bm-precipitado').style.cssText = 'height:22px; y:258px';
      }
      resultados[`${tubo.muestra}-${id}`] = positivo;
      const nota = NOTAS[`${tubo.muestra}-${id}`];
      texto.innerHTML = `<span class="${positivo ? 'bm-pos' : 'bm-neg'}">${positivo ? '✔ Positivo' : '✖ Negativo'}</span> ${positivo ? r.si : r.no}${nota ? `<br><small>💡 ${nota}</small>` : ''}
        <br><button class="btn chico" id="bm-otro">🧽 Lavar el tubo y probar otra vez</button>`;
      texto.querySelector('#bm-otro').addEventListener('click', () => elegirMuestra(tubo.muestra));
      pintarTabla();
    }, demora);
  }

  // Mezcla aproximada de dos colores (para el momento en que cae el reactivo).
  function mezclar(a, b) {
    const n = c => {
      if (c.startsWith('#')) return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
      return c.match(/[\d.]+/g).slice(0, 3).map(Number);
    };
    const [x, y] = [n(a), n(b)];
    return `rgb(${x.map((v, i) => Math.round(v * 0.4 + y[i] * 0.6)).join(',')})`;
  }

  function pintarTabla() {
    raiz.querySelector('#bm-tabla').innerHTML = `
      <thead><tr><th>Muestra</th>${REACTIVOS.map(r => `<th>${{ lugol: 'Lugol', benedict: 'Benedict', biuret: 'Biuret', sudan: 'Sudán' }[r.id]}</th>`).join('')}</tr></thead>
      <tbody>${MUESTRAS.map(m => `<tr><td>${m.icono} ${m.nombre}</td>${REACTIVOS.map(r => {
        const v = resultados[`${m.id}-${r.id}`];
        return `<td>${v === undefined ? '<span class="bm-sin">·</span>' : v ? `<span class="bm-chip" style="background:${r.positivo}">+</span>` : '<span class="bm-menos">−</span>'}</td>`;
      }).join('')}</tr>`).join('')}</tbody>`;
  }

  // =====================================================================
  // CLASIFICAR ALIMENTOS
  // =====================================================================

  function vistaClasificar() {
    juego = { lista: Util.mezclar(ALIMENTOS).slice(0, 10), i: 0, puntos: 0, errores: [] };
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="grid-juego">
        <div class="panel">
          <div class="marcador"><span id="bm-prog"></span><span id="bm-pts"></span></div>
          <div class="barra"><div id="bm-barra"></div></div>
          <div id="bm-juego"></div>
        </div>
        <aside class="panel bm-guia">
          <h2>¿Para qué nos sirven?</h2>
          <div class="bm-guia-item"><b>🍞 Carbohidratos</b><p>Energía rápida. Están en harinas, cereales, papas, frutas y dulces.</p></div>
          <div class="bm-guia-item"><b>🧈 Lípidos</b><p>Reserva de energía y aislante del frío. Aceites, manteca, palta y frutos secos.</p></div>
          <div class="bm-guia-item"><b>🥩 Proteínas</b><p>Construyen y reparan el cuerpo. Carnes, huevos, lácteos y legumbres.</p></div>
          <div class="bm-guia-item"><b>🧬 Ácidos nucleicos</b><p>Están en todas las células, pero comemos muy poco: no son una fuente importante de energía.</p></div>
        </aside>
      </div>`;
    mostrarAlimento();
  }

  function marcadorJuego() {
    raiz.querySelector('#bm-prog').textContent = `Alimento ${Math.min(juego.i + 1, juego.lista.length)} de ${juego.lista.length}`;
    raiz.querySelector('#bm-pts').textContent = `⭐ ${juego.puntos}`;
    raiz.querySelector('#bm-barra').style.width = (juego.i / juego.lista.length * 100) + '%';
  }

  function mostrarAlimento() {
    marcadorJuego();
    const a = juego.lista[juego.i];
    const c = raiz.querySelector('#bm-juego');
    c.innerHTML = `
      <div class="tarjeta-caso"><div class="emoji-grande">${a.e}</div><p class="caso-texto">${a.n}</p></div>
      <p class="bm-pregunta">¿Qué biomolécula tiene en mayor cantidad?</p>
      <div class="opciones">${Object.entries(GRUPOS_ALIM).map(([k, t]) => `<button class="btn-opcion bm-op" data-r="${k}">${t}</button>`).join('')}</div>
      <div id="bm-fb"></div>`;
    c.querySelectorAll('.bm-op').forEach(b => b.addEventListener('click', () => responderAlimento(b.dataset.r)));
  }

  function responderAlimento(r) {
    const a = juego.lista[juego.i];
    const ok = r === a.r;
    if (ok) juego.puntos++; else juego.errores.push(a);
    raiz.querySelectorAll('.bm-op').forEach(b => {
      b.disabled = true;
      if (b.dataset.r === a.r) b.classList.add('correcta');
      else if (b.dataset.r === r) b.classList.add('incorrecta');
    });
    const ultimo = juego.i === juego.lista.length - 1;
    raiz.querySelector('#bm-fb').innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'mal'}">
        <p class="fb-titulo">${ok ? '✅ ¡Correcto!' : `❌ Tiene sobre todo ${GRUPOS_ALIM[a.r].slice(3).toLowerCase()}.`}</p>
        <p>${a.x}</p>
        <button class="btn primario" id="bm-sig">${ultimo ? 'Ver resultados' : 'Siguiente →'}</button>
      </div>`;
    raiz.querySelector('#bm-pts').textContent = `⭐ ${juego.puntos}`;
    raiz.querySelector('#bm-sig').addEventListener('click', () => {
      juego.i++;
      if (juego.i < juego.lista.length) mostrarAlimento();
      else {
        marcadorJuego();
        raiz.querySelector('#bm-juego').innerHTML = `
          <div class="resultado-final">
            <div class="emoji-grande">${juego.puntos >= 7 ? '🎉' : '📚'}</div>
            <p class="puntaje-final">${juego.puntos} / ${juego.lista.length}</p>
            ${juego.errores.length ? `<ul class="lista-repaso">${juego.errores.map(e => `<li><b>${e.e} ${e.n}</b> → ${GRUPOS_ALIM[e.r].slice(3)}. ${e.x}</li>`).join('')}</ul>` : '<p>¡Perfecto! 🏆</p>'}
            <button class="btn primario" id="bm-otra">Jugar otra ronda</button>
          </div>`;
        raiz.querySelector('#bm-otra').addEventListener('click', vistaClasificar);
      }
    });
  }

  return { iniciar };
})();
