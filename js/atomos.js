// Módulo 5: Formar átomos y moléculas.
const Atomos = (function () {
  const POR_Z = Object.fromEntries(ELEMENTOS.map(e => [e.z, e]));
  const MAX = { p: 20, n: 30, e: 20 };
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻' };
  const sup = t => String(t).split('').map(c => SUP[c] || c).join('');

  // ---------- Datos de átomos ----------

  // Cantidad de neutrones de los isótopos estables (Z = 1 a 20).
  const ESTABLES = {
    1: [0, 1], 2: [1, 2], 3: [3, 4], 4: [5], 5: [5, 6], 6: [6, 7], 7: [7, 8], 8: [8, 9, 10], 9: [10], 10: [10, 11, 12],
    11: [12], 12: [12, 13, 14], 13: [14], 14: [14, 15, 16], 15: [16], 16: [16, 17, 18, 20], 17: [18, 20], 18: [18, 20, 22],
    19: [20, 22], 20: [20, 22, 23, 24, 26, 28],
  };
  const ISOTOPOS_FAMOSOS = {
    '1-0': 'Es el <b>protio</b>, el hidrógeno más común: su núcleo es un solo protón.',
    '1-1': 'Es el <b>deuterio</b> o "hidrógeno pesado". Forma el agua pesada que se usa en algunos reactores nucleares.',
    '1-2': 'Es el <b>tritio</b>, un isótopo radiactivo del hidrógeno.',
    '6-6': 'El <b>carbono-12</b> es el isótopo más abundante (99 %). Se usa como referencia para medir las masas atómicas.',
    '6-8': 'El <b>carbono-14</b> es radiactivo. Se usa para calcular la edad de fósiles y restos arqueológicos.',
    '19-21': 'El <b>potasio-40</b> es radiactivo y natural: está presente en pequeñas cantidades en las bananas.',
  };
  // Carga habitual de los iones de cada elemento.
  const IONES = { 1: 1, 3: 1, 4: 2, 7: -3, 8: -2, 9: -1, 11: 1, 12: 2, 13: 3, 15: -3, 16: -2, 17: -1, 19: 1, 20: 2 };
  const ANIONES = { 1: 'hidruro', 7: 'nitruro', 8: 'óxido', 9: 'fluoruro', 15: 'fosfuro', 16: 'sulfuro', 17: 'cloruro' };
  const GAS_NOBLE = { 2: 'helio', 10: 'neón', 18: 'argón' };

  const MISIONES_ATOMO = [
    { id: 'a1', texto: 'Forma un átomo de hidrógeno común (sin neutrones).', p: 1, n: 0, e: 1 },
    { id: 'a2', texto: 'Forma un átomo neutro de helio-4.', p: 2, n: 2, e: 2 },
    { id: 'a3', texto: 'Forma un átomo neutro de carbono-12.', p: 6, n: 6, e: 6 },
    { id: 'a4', texto: 'Forma el isótopo carbono-14 (neutro).', p: 6, n: 8, e: 6 },
    { id: 'a5', texto: 'Forma el ion Na⁺ a partir de sodio-23.', p: 11, n: 12, e: 10 },
    { id: 'a6', texto: 'Forma el ion óxido O²⁻ a partir de oxígeno-16.', p: 8, n: 8, e: 10 },
    { id: 'a7', texto: 'Forma el ion cloruro Cl⁻ a partir de cloro-35.', p: 17, n: 18, e: 18 },
    { id: 'a8', texto: 'Forma el ion Ca²⁺ a partir de calcio-40.', p: 20, n: 20, e: 18 },
  ];

  // ---------- Datos de moléculas ----------

  const TIPOS_ATOMO = {
    H: { nombre: 'hidrógeno', valencia: 1, color: '#f8f9fa', texto: '#343a40', r: 20 },
    C: { nombre: 'carbono', valencia: 4, color: '#343a40', texto: '#fff', r: 26 },
    N: { nombre: 'nitrógeno', valencia: 3, color: '#3b5bdb', texto: '#fff', r: 26 },
    O: { nombre: 'oxígeno', valencia: 2, color: '#e03131', texto: '#fff', r: 26 },
    S: { nombre: 'azufre', valencia: 2, color: '#fab005', texto: '#343a40', r: 28 },
    Cl: { nombre: 'cloro', valencia: 1, color: '#2f9e44', texto: '#fff', r: 28 },
  };

  // Clave = composición ordenada alfabéticamente, p. ej. "H2O1".
  const MOLECULAS = {
    'H2': { f: 'H2', nombre: 'Hidrógeno', dato: 'Es el gas más liviano. Al quemarse solo produce agua, por eso se lo estudia como combustible limpio.' },
    'O2': { f: 'O2', nombre: 'Oxígeno', dato: 'Sus dos átomos están unidos por un enlace doble. Es el gas que respiramos.' },
    'N2': { f: 'N2', nombre: 'Nitrógeno', dato: 'Su enlace triple es muy fuerte: por eso el nitrógeno del aire casi no reacciona.' },
    'Cl2': { f: 'Cl2', nombre: 'Cloro', dato: 'Gas amarillo verdoso y tóxico que se usa para potabilizar el agua.' },
    'H2O1': { f: 'H2O', nombre: 'Agua', dato: 'El oxígeno forma 2 enlaces y cada hidrógeno forma 1. La molécula tiene forma angular.' },
    'H2O2': { f: 'H2O2', nombre: 'Agua oxigenada (peróxido de hidrógeno)', dato: 'Se usa como antiséptico. Se descompone lentamente en agua y oxígeno.' },
    'C1H4': { f: 'CH4', nombre: 'Metano', dato: 'Es el principal componente del gas natural. El carbono forma 4 enlaces simples.' },
    'C1O2': { f: 'CO2', nombre: 'Dióxido de carbono', dato: 'El carbono forma dos enlaces dobles (O=C=O). Lo exhalamos al respirar.' },
    'H3N1': { f: 'NH3', nombre: 'Amoníaco', dato: 'Tiene un olor muy fuerte y se usa para fabricar fertilizantes.' },
    'Cl1H1': { f: 'HCl', nombre: 'Cloruro de hidrógeno', dato: 'Disuelto en agua forma el ácido clorhídrico, que también está en el jugo gástrico.' },
    'H2S1': { f: 'H2S', nombre: 'Sulfuro de hidrógeno', dato: 'Es el gas con olor a huevo podrido.' },
    'C2H6': { f: 'C2H6', nombre: 'Etano', dato: 'Hidrocarburo con enlaces simples: es un alcano.' },
    'C2H4': { f: 'C2H4', nombre: 'Eteno (etileno)', dato: 'Tiene un enlace doble C=C (es un alqueno). Las frutas lo liberan al madurar.' },
    'C2H2': { f: 'C2H2', nombre: 'Etino (acetileno)', dato: 'Tiene un enlace triple C≡C (es un alquino). Se usa en soldadura.' },
    'C3H8': { f: 'C3H8', nombre: 'Propano', dato: 'Es el gas de las garrafas.' },
    'C1H4O1': { f: 'CH3OH', nombre: 'Metanol', dato: 'Es un alcohol muy tóxico: no se puede beber.' },
    'C2H6O1': { f: 'C2H5OH', nombre: 'Etanol (o su isómero, el éter dimetílico)', dato: 'Con estos mismos átomos unidos de otra forma se obtiene una sustancia distinta: eso se llama isómero.' },
    'C1H2O1': { f: 'CH2O', nombre: 'Metanal (formaldehído)', dato: 'Disuelto en agua es el formol, que se usa para conservar muestras biológicas.' },
    'C1H1N1': { f: 'HCN', nombre: 'Cianuro de hidrógeno', dato: 'Es muy tóxico. Tiene un enlace triple entre el carbono y el nitrógeno.' },
    'C1Cl4': { f: 'CCl4', nombre: 'Tetracloruro de carbono', dato: 'Antes se usaba en matafuegos; hoy está prohibido por ser tóxico.' },
    'C1Cl1H3': { f: 'CH3Cl', nombre: 'Clorometano', dato: 'Es un gas que producen naturalmente algunas algas y hongos.' },
    'C1S2': { f: 'CS2', nombre: 'Disulfuro de carbono', dato: 'Es un líquido que se usa como solvente industrial.' },
    'H4N2': { f: 'N2H4', nombre: 'Hidracina', dato: 'Se usa como combustible en satélites y cohetes.' },
  };

  const MISIONES_MOLECULA = [
    { id: 'm1', clave: 'H2', texto: 'Forma una molécula de hidrógeno (H₂).' },
    { id: 'm2', clave: 'H2O1', texto: 'Forma una molécula de agua (H₂O).' },
    { id: 'm3', clave: 'C1H4', texto: 'Forma metano (CH₄), el gas natural.' },
    { id: 'm4', clave: 'H3N1', texto: 'Forma amoníaco (NH₃).' },
    { id: 'm5', clave: 'Cl1H1', texto: 'Forma cloruro de hidrógeno (HCl).' },
    { id: 'm6', clave: 'O2', texto: 'Forma oxígeno (O₂). Pista: vas a necesitar un enlace doble.' },
    { id: 'm7', clave: 'C1O2', texto: 'Forma dióxido de carbono (CO₂).' },
    { id: 'm8', clave: 'N2', texto: 'Forma nitrógeno (N₂). Pista: ¡enlace triple!' },
    { id: 'm9', clave: 'C2H4', texto: 'Forma eteno (C₂H₄).' },
    { id: 'm10', clave: 'C1H4O1', texto: 'Forma metanol (CH₃OH).' },
  ];

  // ---------- Estado ----------

  let raiz, modo = 'atomo';
  let hechas = new Set(Util.leer('am-misiones', []));
  const at = { p: 7, n: 7, e: 7 }; // ejemplo inicial: nitrógeno-14 (no coincide con ninguna misión)
  let misionAtomo = 0, misionMolecula = 0, ultimaConfig = '';

  let svgMol, atomosMol = [], enlaces = [], sigId = 1, seleccion = null, arrastre = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>⚛️ Átomos y moléculas</h1>
        <p>Arma átomos con protones, neutrones y electrones, y después une átomos para formar moléculas.</p>
      </div>
      <div class="segmentado" id="am-modos">
        <button data-m="atomo">⚛️ Formar átomos</button>
        <button data-m="molecula">🔗 Formar moléculas</button>
      </div>

      <div id="am-vista-atomo" class="am-grid">
        <div class="panel am-controles">
          <h2>Partículas</h2>
          ${fila('p', 'Protones', 'p⁺', 'proton')}
          ${fila('n', 'Neutrones', 'n⁰', 'neutron')}
          ${fila('e', 'Electrones', 'e⁻', 'electron')}
          <p class="am-recordatorio">El número de <b>protones</b> define qué elemento es.<br>Protones + neutrones = <b>número másico</b>.</p>
          <div class="am-mision" id="am-mision-atomo"></div>
        </div>
        <div class="panel am-visor">
          <svg id="am-svg-atomo" viewBox="0 0 320 320" role="img" aria-label="Modelo del átomo"></svg>
          <div class="am-leyenda">
            <span><i class="particula proton"></i>Protón</span>
            <span><i class="particula neutron"></i>Neutrón</span>
            <span><i class="particula electron"></i>Electrón</span>
          </div>
        </div>
        <div class="panel am-info" id="am-info-atomo"></div>
      </div>

      <div id="am-vista-molecula" class="am-grid" hidden>
        <div class="panel am-controles">
          <h2>Átomos</h2>
          <div class="am-paleta">
            ${Object.entries(TIPOS_ATOMO).map(([s, t]) => `
              <button class="am-ficha" data-s="${s}">
                <span class="am-bolita" style="background:${t.color};color:${t.texto}">${s}</span>
                <span><b>${t.nombre[0].toUpperCase() + t.nombre.slice(1)}</b><small>forma ${t.valencia} enlace${t.valencia > 1 ? 's' : ''}</small></span>
              </button>`).join('')}
          </div>
          <div class="am-acciones">
            <button class="btn chico" id="am-borrar" disabled>Quitar átomo elegido</button>
            <button class="btn chico" id="am-vaciar">Vaciar</button>
          </div>
          <div class="am-mision" id="am-mision-molecula"></div>
        </div>
        <div class="panel am-visor">
          <p class="am-ayuda">Toca un átomo y después otro para <b>unirlos</b>. Toca el mismo par otra vez para hacer un enlace <b>doble</b> o <b>triple</b>. Arrastra los átomos para acomodarlos.</p>
          <svg id="am-svg-mol" viewBox="0 0 600 400" role="img" aria-label="Mesa de trabajo de moléculas"></svg>
          <p class="am-aviso" id="am-aviso" aria-live="polite"></p>
        </div>
        <div class="panel am-info" id="am-info-mol"></div>
      </div>`;

    raiz.querySelectorAll('#am-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    raiz.querySelectorAll('.am-paso').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k;
      at[k] = Math.max(0, Math.min(MAX[k], at[k] + +b.dataset.d));
      dibujarAtomo();
    }));

    svgMol = raiz.querySelector('#am-svg-mol');
    raiz.querySelectorAll('.am-ficha').forEach(b => b.addEventListener('click', () => agregarAtomo(b.dataset.s)));
    raiz.querySelector('#am-borrar').addEventListener('click', quitarSeleccionado);
    raiz.querySelector('#am-vaciar').addEventListener('click', () => { atomosMol = []; enlaces = []; seleccion = null; avisar(''); dibujarMolecula(); });
    svgMol.addEventListener('pointerdown', alPresionar);
    svgMol.addEventListener('pointermove', alMover);
    svgMol.addEventListener('pointerup', alSoltar);
    svgMol.addEventListener('pointercancel', () => { arrastre = null; });

    // Ejemplo inicial: un oxígeno y dos hidrógenos listos para unir.
    atomosMol = [
      { id: sigId++, s: 'O', x: 300, y: 150 },
      { id: sigId++, s: 'H', x: 180, y: 270 },
      { id: sigId++, s: 'H', x: 420, y: 270 },
    ];
    misionAtomo = primeraPendiente(MISIONES_ATOMO);
    misionMolecula = primeraPendiente(MISIONES_MOLECULA);
    cambiarModo('atomo');
    dibujarAtomo();
    dibujarMolecula();
  }

  function fila(k, nombre, simbolo, clase) {
    return `
      <div class="am-fila">
        <span class="am-etiqueta"><i class="particula ${clase}"></i>${nombre} <small>${simbolo}</small></span>
        <button class="am-paso" data-k="${k}" data-d="-1" aria-label="Quitar ${nombre.toLowerCase()}">−</button>
        <span class="am-num" id="am-num-${k}"></span>
        <button class="am-paso" data-k="${k}" data-d="1" aria-label="Agregar ${nombre.toLowerCase()}">+</button>
      </div>`;
  }

  function cambiarModo(m) {
    modo = m;
    raiz.querySelectorAll('#am-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    raiz.querySelector('#am-vista-atomo').hidden = m !== 'atomo';
    raiz.querySelector('#am-vista-molecula').hidden = m !== 'molecula';
  }

  function primeraPendiente(lista) {
    const i = lista.findIndex(x => !hechas.has(x.id));
    return i === -1 ? 0 : i;
  }

  function pintarMision(cont, lista, i, cumplida, alSiguiente) {
    const m = lista[i];
    const total = lista.filter(x => hechas.has(x.id)).length;
    cont.innerHTML = `
      <div class="am-mision-cab"><b>🎯 Misión ${i + 1} de ${lista.length}</b><span>${total}/${lista.length} ✓</span></div>
      <p>${m.texto}</p>
      ${cumplida ? `<p class="am-logro">✅ ¡Misión cumplida!</p>` : ''}
      <button class="btn chico ${cumplida ? 'primario' : ''}">${cumplida ? 'Siguiente misión →' : 'Saltar misión'}</button>`;
    cont.classList.toggle('cumplida', cumplida);
    cont.querySelector('button').addEventListener('click', alSiguiente);
  }

  function marcarHecha(id) {
    if (hechas.has(id)) return;
    hechas.add(id);
    Util.guardar('am-misiones', [...hechas]);
  }

  // ---------- Formar átomos ----------

  function capas(e) {
    const cap = [2, 8, 8, 2];
    const r = [];
    let resto = e;
    for (const c of cap) {
      if (resto <= 0) break;
      r.push(Math.min(c, resto));
      resto -= c;
    }
    return r;
  }

  function textoCarga(c) {
    if (c === 0) return '';
    return (Math.abs(c) > 1 ? Math.abs(c) : '') + (c > 0 ? '+' : '−');
  }

  function dibujarAtomo() {
    ['p', 'n', 'e'].forEach(k => { raiz.querySelector('#am-num-' + k).textContent = at[k]; });
    raiz.querySelectorAll('.am-paso').forEach(b => {
      const k = b.dataset.k, d = +b.dataset.d;
      b.disabled = d < 0 ? at[k] === 0 : at[k] === MAX[k];
    });

    // Núcleo: protones y neutrones mezclados, acomodados en espiral.
    const total = at.p + at.n;
    let svg = '';
    const niveles = capas(at.e);
    niveles.forEach((n, i) => {
      const r = 62 + i * 26;
      svg += `<circle cx="160" cy="160" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 4"/>`;
      let puntos = '';
      for (let j = 0; j < n; j++) {
        const a = (j / n) * Math.PI * 2 - Math.PI / 2;
        puntos += `<circle cx="${(160 + r * Math.cos(a)).toFixed(1)}" cy="${(160 + r * Math.sin(a)).toFixed(1)}" r="6" class="electron"/>`;
      }
      svg += `<g class="orbita" style="animation-duration:${12 + i * 6}s">${puntos}</g>`;
    });
    // Si el núcleo es inestable, vibra levemente.
    const inestable = at.p > 0 && !ESTABLES[at.p].includes(at.n);
    svg += `<g class="nucleo${inestable ? ' inestable' : ''}">`;
    for (let i = 0; i < total; i++) {
      const esProton = Math.floor((i + 1) * at.p / total) > Math.floor(i * at.p / total);
      const r = 6.3 * Math.sqrt(i + 0.3);
      const a = i * 2.39996;
      svg += `<circle cx="${(160 + r * Math.cos(a)).toFixed(1)}" cy="${(160 + r * Math.sin(a)).toFixed(1)}" r="6.5" class="${esProton ? 'proton' : 'neutron'}"/>`;
    }
    svg += '</g>';
    if (!total) svg += `<text x="160" y="165" text-anchor="middle" class="am-vacio">Núcleo vacío</text>`;
    raiz.querySelector('#am-svg-atomo').innerHTML = svg;

    pintarInfoAtomo(niveles);

    // Si lo que se armó corresponde a cualquier misión, se muestra y se marca esa.
    // Solo al cambiar las partículas, para que "Siguiente misión" pueda avanzar.
    const config = `${at.p}-${at.n}-${at.e}`;
    const lograda = MISIONES_ATOMO.findIndex(x => at.p === x.p && at.n === x.n && at.e === x.e);
    if (config !== ultimaConfig && lograda !== -1) misionAtomo = lograda;
    ultimaConfig = config;
    const m = MISIONES_ATOMO[misionAtomo];
    const cumplida = lograda === misionAtomo;
    if (cumplida) marcarHecha(m.id);
    pintarMision(raiz.querySelector('#am-mision-atomo'), MISIONES_ATOMO, misionAtomo, cumplida, () => {
      misionAtomo = (misionAtomo + 1) % MISIONES_ATOMO.length;
      dibujarAtomo();
    });
  }

  function pintarInfoAtomo(niveles) {
    const info = raiz.querySelector('#am-info-atomo');
    if (!at.p) {
      info.innerHTML = `
        <h2>¿Qué formaste?</h2>
        <p class="am-grande">Todavía nada</p>
        <p>Sin protones no hay elemento. <b>Agrega un protón</b> para empezar.</p>`;
      return;
    }
    const el = POR_Z[at.p];
    const A = at.p + at.n;
    const carga = at.p - at.e;
    const estable = ESTABLES[at.p].includes(at.n);
    const famoso = ISOTOPOS_FAMOSOS[`${at.p}-${at.n}`];

    let nombre, tipo;
    if (carga === 0) { nombre = `${el.nombre}-${A}`; tipo = 'Átomo neutro'; }
    else if (carga > 0) { nombre = `Ion ${el.nombre.toLowerCase()}`; tipo = `Catión (carga ${textoCarga(carga)})`; }
    else { nombre = `Ion ${ANIONES[at.p] || el.nombre.toLowerCase()}`; tipo = `Anión (carga ${textoCarga(carga)})`; }

    let ion = '';
    if (carga === 0) {
      ion = `<p>Tiene la misma cantidad de protones que de electrones, por eso <b>no tiene carga</b>.</p>`;
    } else {
      const perdio = carga > 0;
      ion = `<p>${perdio ? 'Perdió' : 'Ganó'} <b>${Math.abs(carga)} electrón${Math.abs(carga) > 1 ? 'es' : ''}</b>, por eso quedó con carga ${perdio ? 'positiva' : 'negativa'}.</p>`;
      if (IONES[at.p] === carga) {
        ion += `<p class="am-ok">✓ Es un ion habitual${GAS_NOBLE[at.e] ? `: queda con ${at.e} electrones, como el gas noble <b>${GAS_NOBLE[at.e]}</b>, una configuración muy estable` : ''}.</p>`;
      } else if (IONES[at.p] !== undefined) {
        ion += `<p class="am-alerta">Este ion no es habitual: el ${el.nombre.toLowerCase()} suele formar ${el.simbolo}${sup(textoCarga(IONES[at.p]).replace('−', '-'))}.</p>`;
      } else {
        ion += `<p class="am-alerta">El ${el.nombre.toLowerCase()} no suele formar iones.</p>`;
      }
    }

    const valencia = niveles.length ? niveles[niveles.length - 1] : 0;
    info.innerHTML = `
      <h2>¿Qué formaste?</h2>
      <div class="am-notacion" aria-label="${el.simbolo} con número másico ${A} y número atómico ${at.p}">
        <span class="am-n-izq"><span>${A}</span><span>${at.p}</span></span>
        <span class="am-n-sim">${el.simbolo}</span>
        <span class="am-n-carga">${textoCarga(carga)}</span>
      </div>
      <p class="am-grande">${nombre}</p>
      <p class="am-tipo">${tipo}</p>
      <dl class="am-datos">
        <dt>Número atómico (Z)</dt><dd>${at.p}</dd>
        <dt>Número másico (A)</dt><dd>${A}</dd>
        <dt>Carga</dt><dd>${carga === 0 ? '0' : (carga > 0 ? '+' : '−') + Math.abs(carga)}</dd>
        <dt>Electrones por nivel</dt><dd>${niveles.length ? niveles.join(' – ') : '—'}</dd>
        <dt>Electrones de valencia</dt><dd>${valencia}</dd>
      </dl>
      <p class="${estable ? 'am-ok' : 'am-alerta'}">${estable ? '✓ Núcleo estable: este isótopo existe en la naturaleza.' : '⚠️ Núcleo inestable: con esta cantidad de neutrones el isótopo sería radiactivo o no existe.'}</p>
      ${famoso ? `<p class="am-dato">💡 ${famoso}</p>` : ''}
      ${ion}`;
  }

  // ---------- Formar moléculas ----------

  const usados = a => enlaces.filter(b => b.a === a.id || b.b === a.id).reduce((s, b) => s + b.orden, 0);
  const libres = a => TIPOS_ATOMO[a.s].valencia - usados(a);
  const buscar = id => atomosMol.find(a => a.id === id);

  function agregarAtomo(s) {
    // Busca un lugar libre en espiral desde el centro.
    for (let i = 0; i < 400; i++) {
      const r = 14 * Math.sqrt(i), ang = i * 2.39996;
      const x = 300 + r * Math.cos(ang) * 1.5, y = 200 + r * Math.sin(ang);
      if (x < 35 || x > 565 || y < 35 || y > 365) continue;
      if (atomosMol.every(a => Math.hypot(a.x - x, a.y - y) > 100)) {
        atomosMol.push({ id: sigId++, s, x, y });
        avisar('');
        dibujarMolecula();
        return;
      }
    }
    avisar('No hay más lugar en la mesa. Quita algún átomo.');
  }

  function quitarSeleccionado() {
    if (!seleccion) return;
    atomosMol = atomosMol.filter(a => a.id !== seleccion);
    enlaces = enlaces.filter(b => b.a !== seleccion && b.b !== seleccion);
    seleccion = null;
    dibujarMolecula();
  }

  function unir(idA, idB) {
    const a = buscar(idA), b = buscar(idB);
    const e = enlaces.find(x => (x.a === idA && x.b === idB) || (x.a === idB && x.b === idA));
    const hayLugar = libres(a) > 0 && libres(b) > 0;
    const lleno = x => `El ${TIPOS_ATOMO[x.s].nombre} ya formó sus ${TIPOS_ATOMO[x.s].valencia} enlace${TIPOS_ATOMO[x.s].valencia > 1 ? 's' : ''}.`;
    if (!e) {
      if (hayLugar) { enlaces.push({ a: idA, b: idB, orden: 1 }); avisar('Enlace simple: comparten un par de electrones.'); }
      else avisar(lleno(libres(a) > 0 ? b : a), true);
    } else if (e.orden < 3 && hayLugar) {
      e.orden++;
      avisar(e.orden === 2 ? 'Enlace doble: comparten dos pares de electrones.' : 'Enlace triple: comparten tres pares de electrones.');
    } else {
      enlaces = enlaces.filter(x => x !== e);
      avisar('Se deshizo el enlace.');
    }
  }

  function avisar(texto, alerta) {
    const p = raiz.querySelector('#am-aviso');
    p.textContent = texto;
    p.classList.toggle('alerta', !!alerta);
  }

  function puntoSVG(ev) {
    const pt = svgMol.createSVGPoint();
    pt.x = ev.clientX;
    pt.y = ev.clientY;
    return pt.matrixTransform(svgMol.getScreenCTM().inverse());
  }

  function alPresionar(ev) {
    const g = ev.target.closest('[data-id]');
    if (!g) {
      seleccion = null;
      dibujarMolecula();
      return;
    }
    arrastre = { id: +g.dataset.id, x0: ev.clientX, y0: ev.clientY, movido: false };
    svgMol.setPointerCapture(ev.pointerId);
  }

  function alMover(ev) {
    if (!arrastre) return;
    if (!arrastre.movido && Math.hypot(ev.clientX - arrastre.x0, ev.clientY - arrastre.y0) < 6) return;
    arrastre.movido = true;
    const p = puntoSVG(ev);
    const a = buscar(arrastre.id);
    a.x = Math.max(30, Math.min(570, p.x));
    a.y = Math.max(30, Math.min(370, p.y));
    dibujarMolecula();
  }

  function alSoltar() {
    if (!arrastre) return;
    const { id, movido } = arrastre;
    arrastre = null;
    if (movido) return;
    if (seleccion === null) seleccion = id;
    else if (seleccion === id) seleccion = null;
    else { unir(seleccion, id); seleccion = null; }
    dibujarMolecula();
  }

  function composicion() {
    const c = {};
    atomosMol.forEach(a => { c[a.s] = (c[a.s] || 0) + 1; });
    return c;
  }

  function claveDe(c) {
    return Object.keys(c).sort().map(s => s + c[s]).join('');
  }

  // Fórmula en orden de Hill: C, H y luego el resto por orden alfabético.
  function formulaHill(c) {
    const orden = c.C ? ['C', 'H', ...Object.keys(c).filter(s => s !== 'C' && s !== 'H').sort()] : Object.keys(c).sort();
    return orden.filter(s => c[s]).map(s => s + (c[s] > 1 ? c[s] : '')).join('');
  }

  function conectada() {
    if (!atomosMol.length) return false;
    const vistos = new Set([atomosMol[0].id]);
    const pila = [atomosMol[0].id];
    while (pila.length) {
      const id = pila.pop();
      enlaces.forEach(b => {
        const otro = b.a === id ? b.b : b.b === id ? b.a : null;
        if (otro !== null && !vistos.has(otro)) { vistos.add(otro); pila.push(otro); }
      });
    }
    return vistos.size === atomosMol.length;
  }

  function dibujarMolecula() {
    let svg = '';
    enlaces.forEach(b => {
      const a = buscar(b.a), c = buscar(b.b);
      const dx = c.x - a.x, dy = c.y - a.y, len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const desp = b.orden === 1 ? [0] : b.orden === 2 ? [-4.5, 4.5] : [-7, 0, 7];
      desp.forEach(d => {
        svg += `<line x1="${(a.x + nx * d).toFixed(1)}" y1="${(a.y + ny * d).toFixed(1)}" x2="${(c.x + nx * d).toFixed(1)}" y2="${(c.y + ny * d).toFixed(1)}" class="am-enlace"/>`;
      });
    });
    atomosMol.forEach(a => {
      const t = TIPOS_ATOMO[a.s];
      const l = libres(a);
      const sel = seleccion === a.id;
      svg += `<g data-id="${a.id}" class="am-atomo${sel ? ' sel' : ''}">
        ${sel ? `<circle cx="${a.x}" cy="${a.y}" r="${t.r + 7}" class="am-anillo"/>` : ''}
        <circle cx="${a.x}" cy="${a.y}" r="${t.r}" fill="${t.color}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>
        <text x="${a.x}" y="${a.y + 6}" text-anchor="middle" fill="${t.texto}" class="am-sim">${a.s}</text>
        <circle cx="${a.x + t.r * 0.8}" cy="${a.y - t.r * 0.8}" r="10" class="am-libres ${l ? '' : 'completo'}"/>
        <text x="${a.x + t.r * 0.8}" y="${a.y - t.r * 0.8 + 4}" text-anchor="middle" class="am-libres-txt">${l ? l : '✓'}</text>
      </g>`;
    });
    if (!atomosMol.length) svg = `<text x="300" y="205" text-anchor="middle" class="am-vacio">Agrega átomos desde la izquierda</text>`;
    svgMol.innerHTML = svg;
    raiz.querySelector('#am-borrar').disabled = seleccion === null;
    pintarInfoMolecula();
  }

  function pintarInfoMolecula() {
    const info = raiz.querySelector('#am-info-mol');
    const c = composicion();
    const clave = claveDe(c);
    const conocida = MOLECULAS[clave];
    // Suma de los lugares libres de todos los átomos: cada enlace ocupa dos (uno en cada átomo).
    const faltan = atomosMol.reduce((s, a) => s + libres(a), 0);
    const unida = conectada();
    const completa = atomosMol.length > 1 && faltan === 0 && unida;
    const simples = enlaces.filter(b => b.orden === 1).length;
    const dobles = enlaces.filter(b => b.orden === 2).length;
    const triples = enlaces.filter(b => b.orden === 3).length;

    let estado;
    if (atomosMol.length < 2) estado = `<p>Agrega al menos dos átomos y únelos.</p>`;
    else if (!completa) {
      const pend = [];
      if (faltan % 2) {
        pend.push('Con estos átomos la molécula no se puede completar: la suma de los enlaces libres es impar, así que siempre sobraría uno. Agrega o quita algún átomo.');
      } else if (faltan) {
        const n = faltan / 2;
        pend.push(`Falta${n > 1 ? 'n' : ''} <b>${n}</b> enlace${n > 1 ? 's' : ''} por formar (mira los números sobre cada átomo).`);
      }
      if (!unida) pend.push('Hay átomos sueltos: todos deben quedar unidos en una sola molécula.');
      estado = `<p class="am-alerta">${pend.join('<br>')}</p>`;
    } else if (conocida) {
      estado = `<p class="am-ok">✅ ¡Molécula completa!</p>
        <p class="am-grande">${conocida.nombre}</p>
        <p class="am-dato">💡 ${conocida.dato}</p>`;
    } else {
      estado = `<p class="am-ok">✅ ¡Molécula completa!</p><p>Cada átomo formó todos sus enlaces. Esta molécula no está en nuestra lista, pero es válida según las reglas de enlace.</p>`;
    }

    info.innerHTML = `
      <h2>Tu molécula</h2>
      <p class="am-formula">${atomosMol.length ? Util.formula(conocida && completa ? conocida.f : formulaHill(c)) : '—'}</p>
      ${estado}
      ${enlaces.length ? `<p class="am-enlaces-cuenta">Enlaces: ${[simples && `${simples} simple${simples > 1 ? 's' : ''}`, dobles && `${dobles} doble${dobles > 1 ? 's' : ''}`, triples && `${triples} triple${triples > 1 ? 's' : ''}`].filter(Boolean).join(' · ')}</p>` : ''}
      <p class="am-recordatorio">Cada línea es un <b>enlace covalente</b>: un par de electrones compartidos entre dos átomos.</p>`;

    const lograda = completa ? MISIONES_MOLECULA.findIndex(x => x.clave === clave) : -1;
    if (lograda !== -1) misionMolecula = lograda;
    const m = MISIONES_MOLECULA[misionMolecula];
    const cumplida = lograda !== -1;
    if (cumplida) marcarHecha(m.id);
    pintarMision(raiz.querySelector('#am-mision-molecula'), MISIONES_MOLECULA, misionMolecula, cumplida, () => {
      misionMolecula = (misionMolecula + 1) % MISIONES_MOLECULA.length;
      if (cumplida) { atomosMol = []; enlaces = []; seleccion = null; avisar(''); }
      dibujarMolecula();
    });
  }

  return { iniciar };
})();
