// Sistemas de la nutrición (2.º año): "Completar el esquema" y "El archipiélago de las islas SIN" (analogía).
// Lo usa nutricion.js; cada actividad dibuja su escena en el contenedor que recibe.
const NutriExtra = (function () {
  const { dosTonos, ojo } = Arte;
  const COL = { digestivo: ['#ff8fab', '#e0607f'], respiratorio: ['#7fd3ff', '#48a6d9'], circulatorio: ['#ff6b6b', '#d63c3c'], excretor: ['#ffd166', '#f0a830'], celula: ['#b197fc', '#8b6cf0'] };
  const NOMBRE = { digestivo: 'Sistema digestivo', respiratorio: 'Sistema respiratorio', circulatorio: 'Sistema circulatorio', excretor: 'Sistema excretor', celula: 'Las células' };
  const brillo = (d, w = 3) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0.45"/>`;
  const carita = (x, y, r) => `${ojo(x - r * 1.2, y, r)}${ojo(x + r * 1.2, y, r)}<path d="M${x - r * 0.8},${y + r * 1.4} q${r * 0.8},${r * 0.8} ${r * 1.6},0" stroke="#15163d" stroke-width="${r * 0.32}" fill="none" stroke-linecap="round"/>`;
  const estrellas = (n, w, h) => Array.from({ length: n }, (_, i) => `<circle cx="${(i * 97.3) % w}" cy="${(i * 53.9) % h}" r="${0.7 + (i % 3) * 0.5}" fill="#c9ccf5" opacity="${0.15 + (i % 4) * 0.08}"/>`).join('');

  // Personajitos de cada sistema (órganos con volumen y cara), centrados en 0,0.
  const PERSONAJE = {
    digestivo: () => `${dosTonos('<path d="M-6,-16 C6,-26 26,-20 26,-2 C26,16 12,24 -4,24 C-18,24 -24,14 -20,6 C-14,-2 -6,2 -6,-16 Z" fill="FILL"/>', ...COL.digestivo, { y: 6 })}${brillo('M0,-16 a14,10 0 0 1 16,-2', 2.4)}${carita(6, 2, 3)}`,
    respiratorio: () => [-1, 1].map(k => `<g transform="scale(${k} 1)">${dosTonos('<path d="M-3,-18 C-3,-26 -12,-28 -18,-22 C-26,-14 -28,4 -26,16 C-24,24 -12,24 -6,18 C-2,12 -3,0 -3,-18 Z" fill="FILL"/>', '#ffa8c5', '#e06f97', { x: -14 })}</g>`).join('') + `<path d="M0,-26 V-12" stroke="#dbe4ff" stroke-width="4" stroke-linecap="round"/>${carita(0, 4, 2.6)}`,
    circulatorio: () => `${dosTonos('<path d="M0,20 C-18,8 -26,-2 -24,-12 C-22,-22 -10,-24 -2,-16 L0,-14 L2,-16 C10,-24 22,-22 24,-12 C26,-2 18,8 0,20 Z" fill="FILL"/>', ...COL.circulatorio, { x: 6 })}${brillo('M-18,-12 a8,8 0 0 1 8,-6', 2.4)}${carita(0, -3, 2.8)}`,
    excretor: () => `${dosTonos('<path d="M-4,-22 C16,-26 24,-8 20,8 C16,22 -2,26 -10,18 C-5,10 -4,2 -9,-5 C-14,-14 -12,-20 -4,-22 Z" fill="FILL"/>', '#e8707a', '#b94a55', { x: 8 })}${brillo('M-4,-16 a16,14 0 0 1 14,-2', 2.2)}${carita(6, -1, 2.6)}`,
  };

  // ========== 5. Completar el esquema ==========
  const EW = 760, EH = 460;
  const CAJAS = { digestivo: [220, 84], circulatorio: [430, 250], respiratorio: [232, 340], excretor: [560, 360] };
  const HUECOS = {
    fecal: { x: 312, y: 30, w: 118, v: 'Materia fecal', pista: 'Lo que el sistema digestivo no puede absorber sale del cuerpo por el ano.' },
    nutrientes: { x: 392, y: 84, w: 110, v: 'Nutrientes', pista: 'El digestivo transforma los alimentos en partículas muy pequeñas que pasan a la sangre.' },
    celDes: { x: 598, y: 226, w: 176, v: 'Agua, CO₂ y otros desechos', pista: 'Al trabajar, la célula produce agua, dióxido de carbono y otros desechos que se lleva la sangre.' },
    o2a: { x: 80, y: 238, w: 62, v: 'O₂', pista: 'Del aire tomamos un gas que las células necesitan para obtener energía.' },
    o2b: { x: 272, y: 232, w: 62, v: 'O₂', pista: 'Desde los pulmones, la sangre se lleva el gas que tomamos del aire.' },
    co2a: { x: 352, y: 322, w: 62, v: 'CO₂', pista: 'La sangre lleva a los pulmones el gas que produjeron las células.' },
    co2b: { x: 230, y: 414, w: 62, v: 'CO₂', pista: 'Por los pulmones sale el gas que se produjo en las células.' },
    espirado: { x: 362, y: 414, w: 120, v: 'Aire espirado', pista: 'El CO₂ sale del cuerpo mezclado con el aire que exhalamos.' },
    excDes: { x: 532, y: 306, w: 132, v: 'Agua y desechos', pista: 'El sistema excretor recibe de la sangre el agua que sobra y los desechos, como la urea.' },
    orina: { x: 702, y: 360, w: 80, v: 'Orina', pista: 'Los riñones forman un líquido con los desechos, que se elimina del cuerpo.' },
  };
  const HUECOS_SIST = {
    digestivo: 'Recibe los alimentos, entrega nutrientes y elimina la materia fecal.',
    circulatorio: 'Está en el centro: reparte a todos y recoge de todos.',
    respiratorio: 'Recibe el O₂ del aire y elimina el CO₂.',
    excretor: 'Recibe agua y desechos de la sangre y forma la orina.',
  };
  const CONCEPTOS = [
    ['Sistema digestivo', /digest/], ['Nutrientes', /nutriente/], ['Circulatorio o sangre', /circulator|sangre/],
    ['Sistema respiratorio', /respirator|pulmon/], ['Oxígeno', /oxigeno|o2|o₂/], ['Células', /celula/], ['Energía', /energia/],
    ['Dióxido de carbono', /dioxido|co2|co₂/], ['Sistema excretor', /excretor|rinon/], ['Orina o materia fecal', /orina|materia fecal|heces/],
  ];
  const CONECTORES = ['Primero,', 'Luego,', 'Después,', 'Al mismo tiempo,', 'Además,', 'Por eso,', 'Por último,'];
  let esq = null;

  const sinTildes = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const flecha = (d, gruesa) => `<path d="${d}" stroke="${gruesa ? '#ffd166' : '#c9ccf5'}" stroke-width="${gruesa ? 5 : 2.2}" fill="none" stroke-linejoin="round" marker-end="url(#${gruesa ? 'nx-pg' : 'nx-pf'})"/>`;

  function esquemaFijo() {
    const caja = (k, [x, y]) => {
      const oculto = esq.nivel === 2;
      return `<g class="nx-caja">
        <rect x="${x - 75 + 4}" y="${y - 25 + 6}" width="150" height="50" rx="16" fill="#05061a" opacity="0.4"/>
        ${dosTonos(`<rect x="${x - 75}" y="${y - 25}" width="150" height="50" rx="16" fill="FILL"/>`, '#262a70', '#1e2160', { y: y + 4 })}
        <rect x="${x - 75}" y="${y - 25}" width="150" height="50" rx="16" fill="none" stroke="${COL[k][0]}" stroke-width="2.5"/>
        ${brillo(`M${x - 62},${y - 18} h40`, 2.4)}
        <g transform="translate(${x - 72} ${y - 22}) scale(0.62)">${PERSONAJE[k]()}</g>
        ${oculto ? '' : `<text x="${x + 10}" y="${y - 3}" text-anchor="middle" class="nx-caja-t1">SISTEMA</text><text x="${x + 10}" y="${y + 12}" text-anchor="middle" class="nx-caja-t2">${NOMBRE[k].replace('Sistema ', '').toUpperCase()}</text>`}
      </g>`;
    };
    const cel = `<g>
      <ellipse cx="626" cy="116" rx="124" ry="80" fill="#05061a" opacity="0.4" transform="translate(6 8)"/>
      <ellipse cx="626" cy="112" rx="124" ry="80" fill="#d94d8a"/><ellipse cx="626" cy="112" rx="116" ry="73" fill="url(#nx-cito)"/>
      <path d="M530,84 a116,73 0 0 1 60,-40" stroke="#ffd1e6" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.7"/>
      <g transform="translate(556 112)">${dosTonos('<circle r="22" fill="FILL"/>', '#8b6cf0', '#6a4ce0', { x: 7 })}<circle r="16" fill="#b9a4ff"/>${carita(-1, -2, 3)}</g>
      ${[[716, 150, -20], [604, 164, 15]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(0.4)">${dosTonos('<rect x="-34" y="-16" width="68" height="32" rx="16" fill="FILL"/>', '#ff7b54', '#e0563a', { y: 5 })}<rect x="-29" y="-11" width="58" height="22" rx="11" fill="#ffc07a"/></g>`).join('')}
      <text x="660" y="96" text-anchor="middle" class="nx-cel">ENERGÍA</text>
      <text x="660" y="118" text-anchor="middle" class="nx-cel">Y MATERIAL DE</text><text x="660" y="132" text-anchor="middle" class="nx-cel">CONSTRUCCIÓN</text>
      <text x="626" y="22" text-anchor="middle" class="nu-rotulo">CÉLULA</text></g>`;
    return `<defs>
        <radialGradient id="nx-fondo" cx="0.45" cy="0.4" r="0.85"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="nx-cito" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#5a4bb0"/><stop offset="1" stop-color="#342a7c"/></radialGradient>
        <marker id="nx-pg" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#ffd166"/></marker>
        <marker id="nx-pf" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#c9ccf5"/></marker>
      </defs>
      <rect width="${EW}" height="${EH}" rx="14" fill="url(#nx-fondo)"/>${estrellas(26, EW, EH)}
      ${Alimentacion.alimento('pan', 44, 72, 0.8)}${Alimentacion.alimento('manzana', 72, 76, 0.7)}${Alimentacion.alimento('leche', 22, 80, 0.55)}
      <text x="52" y="112" text-anchor="middle" class="nx-txt">Alimentación</text>
      <g opacity="0.85">${[0, 1, 2].map(i => `<path d="M${34 + i * 10},${150 + i * 7} q10,-6 20,0 t20,0" stroke="#bfe8ff" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g>
      <text x="80" y="194" text-anchor="middle" class="nx-txt">Aire inspirado</text>
      ${flecha('M96,84 H136', true)}${flecha('M220,57 V30 H244', false)}${flecha('M297,84 H327', true)}
      ${flecha('M392,100 V216', true)}
      ${['agua', 'sales', 'proteínas', 'azúcares', 'lípidos'].map((t, i) => `<text x="402" y="${128 + i * 13}" class="nx-lista">${t}</text>`).join('')}
      ${flecha('M470,224 V112 H492', true)}${flecha('M690,176 V250 H515', false)}
      ${flecha('M80,200 V218', true)}${flecha('M80,256 V340 H148', true)}
      ${flecha('M190,314 V250 H347', true)}${flecha('M400,276 V340 H315', false)}
      ${flecha('M230,366 V396', false)}${flecha('M262,414 H296', false)}${flecha('M460,276 V360 H477', false)}${flecha('M636,360 H656', false)}
      ${Object.entries(CAJAS).map(([k, p]) => caja(k, p)).join('')}${cel}
      <g transform="translate(476 414)"><rect x="-8" y="-14" width="280" height="46" rx="10" fill="#12143a" opacity="0.8"/>
        ${flecha('M0,0 H34', true)}<text x="46" y="4" class="nx-ley">Del ambiente al organismo</text>
        ${flecha('M0,20 H34', false)}<text x="46" y="24" class="nx-ley">Del organismo al ambiente</text></g>`;
  }

  function huecosActivos() {
    const h = { ...HUECOS };
    if (esq.nivel === 2) Object.entries(CAJAS).forEach(([k, [x, y]]) => { h['s-' + k] = { x: x + 10, y: y + 4, w: 118, v: NOMBRE[k], pista: HUECOS_SIST[k], sist: true }; });
    return h;
  }

  function fichasNivel(nivel) {
    const f = Object.values(HUECOS).map(h => h.v);
    if (nivel === 2) f.push(...Object.keys(CAJAS).map(k => NOMBRE[k]));
    return Util.mezclar(f).map(v => ({ v, usada: false }));
  }

  function esquema(cont) {
    esq = esq || { nivel: 1 };
    reiniciarEsquema(esq.nivel);
    cont.innerHTML = `<div class="nu-grid">
        <div class="panel nu-escena"><div class="nx-scroll"><svg id="nx-svg" viewBox="0 0 ${EW} ${EH}" role="img" aria-label="Esquema de los sistemas de la nutrición para completar"><g id="nx-fijo"></g><g id="nx-huecos"></g></svg></div>
          <div class="nx-banco" id="nx-banco"></div>
          <div class="nx-acciones"><button class="btn primario" id="nx-comprobar">✔️ Comprobar</button><button class="btn" id="nx-reiniciar">↺ Empezar de nuevo</button>
            <span class="nx-nivel"><button data-n="1">Nivel 1</button><button data-n="2">Nivel 2: también los sistemas</button></span></div>
        </div>
        <aside class="panel nu-info" id="nx-info"></aside>
      </div>`;
    cont.querySelector('#nx-comprobar').addEventListener('click', comprobar);
    cont.querySelector('#nx-reiniciar').addEventListener('click', () => { reiniciarEsquema(esq.nivel); pintarEsquema(true); });
    cont.querySelectorAll('.nx-nivel button').forEach(b => b.addEventListener('click', () => { reiniciarEsquema(+b.dataset.n); pintarEsquema(true); }));
    cont.querySelector('#nx-huecos').addEventListener('click', e => { const g = e.target.closest('[data-h]'); if (g) tocarHueco(g.dataset.h); });
    cont.querySelector('#nx-banco').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) tocarFicha(+b.dataset.f); });
    esq.cont = cont;
    pintarEsquema(true);
  }

  function reiniciarEsquema(nivel) {
    Object.assign(esq, { nivel, fichas: fichasNivel(nivel), puestos: {}, estado: {}, selF: null, selH: null, errores: [], completo: false, intentos: 0 });
  }

  function pintarEsquema(todo) {
    const c = esq.cont;
    if (todo) c.querySelector('#nx-fijo').innerHTML = esquemaFijo();
    c.querySelectorAll('.nx-nivel button').forEach(b => b.classList.toggle('activo', +b.dataset.n === esq.nivel));
    const H = huecosActivos();
    c.querySelector('#nx-huecos').innerHTML = Object.entries(H).map(([id, h]) => {
      const f = esq.puestos[id], est = esq.estado[id] || (f !== undefined ? 'lleno' : 'vacio');
      const texto = f !== undefined ? esq.fichas[f].v : '?';
      const chico = texto.length > 16 ? ' chico' : '';
      return `<g class="nx-hueco ${est}${esq.selH === id ? ' activo' : ''}${h.sist ? ' sist' : ''}" data-h="${id}" tabindex="0" role="button" aria-label="${f !== undefined ? texto : 'Espacio vacío'}">
        <rect x="${h.x - h.w / 2}" y="${h.y - 13}" width="${h.w}" height="26" rx="13"/>
        <text x="${h.x}" y="${h.y + 4.5}" text-anchor="middle" class="${chico}">${texto}</text></g>`;
    }).join('');
    c.querySelector('#nx-banco').innerHTML = esq.fichas.map((f, i) => f.usada ? '' : `<button class="nx-ficha${esq.selF === i ? ' activo' : ''}" data-f="${i}">${f.v}</button>`).join('')
      || '<span class="nx-banco-vacio">Ya ubicaste todos los rótulos. ¡Tocá «Comprobar»!</span>';
    c.querySelectorAll('.nx-hueco').forEach(g => g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tocarHueco(g.dataset.h); } }));
    pintarInfoEsquema();
  }

  function poner(h, f) {
    const antes = esq.puestos[h];
    if (antes !== undefined) esq.fichas[antes].usada = false;
    esq.puestos[h] = f;
    esq.fichas[f].usada = true;
    delete esq.estado[h];
    esq.selF = esq.selH = null;
  }

  function tocarFicha(i) {
    if (esq.selH) poner(esq.selH, i);
    else esq.selF = esq.selF === i ? null : i;
    pintarEsquema();
  }

  function tocarHueco(h) {
    if (esq.estado[h] === 'ok') return;
    if (esq.selF !== null) poner(h, esq.selF);
    else if (esq.puestos[h] !== undefined) { esq.fichas[esq.puestos[h]].usada = false; delete esq.puestos[h]; delete esq.estado[h]; esq.selH = null; }
    else esq.selH = esq.selH === h ? null : h;
    pintarEsquema();
  }

  function comprobar() {
    const H = huecosActivos();
    esq.errores = [];
    esq.intentos++;
    Object.entries(H).forEach(([id, h]) => {
      const f = esq.puestos[id];
      if (f === undefined) return;
      if (esq.fichas[f].v === h.v) esq.estado[id] = 'ok';
      else { esq.estado[id] = 'mal'; esq.errores.push({ id, puesto: esq.fichas[f].v, pista: h.pista }); }
    });
    esq.completo = Object.keys(H).every(id => esq.estado[id] === 'ok');
    pintarEsquema();
  }

  function pintarInfoEsquema() {
    const info = esq.cont.querySelector('#nx-info');
    const H = huecosActivos(), total = Object.keys(H).length, bien = Object.values(esq.estado).filter(x => x === 'ok').length;
    if (esq.completo) return pintarTexto(info);
    const errores = esq.errores.filter(e => esq.estado[e.id] === 'mal');
    info.innerHTML = `<h2>🧩 Completá el esquema</h2>
      <p>Es el esquema de la clase, pero con los rótulos vacíos. Tocá un rótulo de abajo y después el <b>espacio con «?»</b> donde va (o al revés).</p>
      <p class="nu-ayuda">Las flechas <b style="color:#e0a800">gruesas</b> van del ambiente al organismo; las <b>finas</b>, del organismo al ambiente. Para sacar un rótulo, tocalo de nuevo.</p>
      <div class="nx-progreso"><div style="width:${bien / total * 100}%"></div></div><p class="nu-ayuda">${bien} de ${total} en su lugar</p>
      ${errores.length ? `<div class="feedback mal"><p class="fb-titulo">Revisá ${errores.length === 1 ? 'este rótulo' : 'estos rótulos'}:</p><ul class="nx-errores">${errores.map(e => `<li><b>«${e.puesto}»</b> no va ahí. 💡 ${e.pista}</li>`).join('')}</ul></div>` : ''}
      ${esq.intentos && !errores.length && bien < total ? '<p class="nu-ayuda">¡Vas bien! Faltan rótulos por ubicar.</p>' : ''}`;
  }

  function pintarTexto(info) {
    const guardado = Util.leer('nu-texto', '');
    info.innerHTML = `<div class="feedback ok"><p class="fb-titulo">🏆 ¡Esquema completo${esq.intentos === 1 ? ' al primer intento' : ''}!</p><p>El <b>sistema circulatorio</b> está en el centro: recibe y reparte a todos los demás.</p></div>
      <h3>✍️ Ahora explicalo con tus palabras</h3>
      <p class="nu-ayuda">Escribí un texto que cuente cómo se relacionan los sistemas. Usá conectores para ordenar las ideas:</p>
      <div class="nx-conectores">${CONECTORES.map(c => `<button data-c="${c}">${c}</button>`).join('')}</div>
      <textarea id="nx-texto" rows="7" placeholder="Primero, el sistema digestivo transforma los alimentos en nutrientes…">${guardado.replace(/</g, '&lt;')}</textarea>
      <h3>¿Qué ideas ya nombraste?</h3><ul class="nx-check" id="nx-check"></ul><p class="nu-ayuda" id="nx-conect"></p>
      <details class="nx-ejemplo"><summary>Ver un texto de ejemplo</summary><p>Primero, el <b>sistema digestivo</b> transforma los alimentos en <b>nutrientes</b> y elimina lo que no se absorbe como materia fecal. Al mismo tiempo, el <b>sistema respiratorio</b> toma el <b>oxígeno</b> del aire. Luego, el <b>sistema circulatorio</b> lleva los nutrientes y el oxígeno a todas las <b>células</b>, que los usan para obtener <b>energía</b> y material para crecer. Después, la sangre recoge los desechos de las células: el <b>dióxido de carbono</b> va a los pulmones y sale con el aire espirado, y el agua y los otros desechos van al <b>sistema excretor</b>, que forma la <b>orina</b>. Por eso, los cuatro sistemas trabajan juntos.</p></details>`;
    const area = info.querySelector('#nx-texto');
    const revisar = () => {
      const t = sinTildes(area.value);
      info.querySelector('#nx-check').innerHTML = CONCEPTOS.map(([n, re]) => `<li class="${re.test(t) ? 'si' : ''}">${re.test(t) ? '✅' : '⬜'} ${n}</li>`).join('');
      const usados = CONECTORES.filter(c => t.includes(sinTildes(c.replace(',', '')))).length;
      info.querySelector('#nx-conect').innerHTML = `Conectores usados: <b>${usados}</b>${usados >= 3 ? ' 👍' : ' (probá usar al menos 3)'}`;
      Util.guardar('nu-texto', area.value);
    };
    area.addEventListener('input', revisar);
    info.querySelectorAll('.nx-conectores button').forEach(b => b.addEventListener('click', () => {
      const v = area.value, sep = v && !/\s$/.test(v) ? ' ' : '';
      area.value = v + sep + b.dataset.c + ' ';
      area.focus();
      revisar();
    }));
    revisar();
  }

  // ========== 6. El archipiélago de las islas SIN (analogía) ==========
  const CW = 760, CH = 460;
  const TEXTO_SIN = [
    'Se trata de un grupo de islas de distintos tamaños ubicadas muy cerca unas de otras, conformando un archipiélago. En cada una de las islas hay casas, en general agrupadas por sectores y estos se comunican entre sí a través de pequeñas rutas. Debido a que están bastante alejadas del continente, todas las islas aportan al funcionamiento general del conjunto: alimentación, producción, reciclaje, etc.',
    'Las islas se comunican mediante barcos que navegan por caminos acuáticos.',
    'Cada una de las islas se especializa en una función distinta aprovechando las características de su terreno: la isla Huerta se encarga de recolectar frutas y verduras, la isla Granja se ocupa de la cría de animales y la elaboración de todos los productos derivados, y así las diferentes islas proveen a las otras de aquello que les falta y a cambio reciben lo que necesitan.',
    'La organización del transporte entre las islas garantiza que cada casa reciba todo lo que requiere y que los desechos sean recolectados. Para ello, se utilizan barcos que navegan por caminos acuáticos y transportan productos alimenticios y materiales de descarte.',
    'Cada casa descarta los materiales inservibles, pero algunos de ellos pueden ser reciclados. Para seleccionar lo que sirve y lo que no, los desechos llegan a una isla donde funciona una planta de reciclaje, que se encarga de separar los residuos, reciclarlos y descartar lo que verdaderamente no sirve. Aquellos productos reutilizables los envía nuevamente a las islas.',
  ];
  // En qué se parece cada parte del archipiélago al cuerpo.
  const CUERPO = {
    organismo: ['El organismo (todo el cuerpo)', 'Organismo', 'celula'],
    organo: ['Un órgano', 'Órgano', 'celula'],
    tejido: ['Los tejidos', 'Tejidos', 'celula'],
    celula: ['Las células', 'Células', 'celula'],
    sangre: ['La sangre', 'Sangre', 'circulatorio'],
    vasos: ['Los vasos sanguíneos', 'Vasos sanguíneos', 'circulatorio'],
    digestivo: ['El sistema digestivo', 'Sistema digestivo', 'digestivo'],
    rinon: ['Los riñones (sistema excretor)', 'Riñones', 'excretor'],
    reabs: ['Las sustancias útiles que se reabsorben', 'Reabsorción', 'excretor'],
    orina: ['La orina', 'Orina', 'excretor'],
    respiratorio: ['El sistema respiratorio', 'Sistema respiratorio', 'respiratorio'],
  };
  const PARTES = {
    archi: { l: 'A', n: 'El archipiélago', pill: [150, 27], ok: 'organismo', otras: ['organo', 'tejido', 'digestivo'],
      cita: 'Se trata de un grupo de islas de distintos tamaños ubicadas muy cerca unas de otras, conformando un archipiélago.',
      expl: 'El archipiélago es el <b>organismo</b>: todas sus partes trabajan juntas y ninguna isla podría funcionar sola.' },
    isla: { l: 'B', n: 'Cada isla', pill: [392, 336], ok: 'organo', otras: ['celula', 'organismo', 'tejido'],
      cita: 'Todas las islas aportan al funcionamiento general del conjunto: alimentación, producción, reciclaje, etc.',
      expl: 'Cada isla es como un <b>órgano</b>: está formada por varios sectores (tejidos) y cumple una función para todo el cuerpo.' },
    casas: { l: 'C', n: 'Las casas', pill: [300, 162], ok: 'celula', otras: ['tejido', 'organo', 'sangre'],
      cita: 'En cada una de las islas hay casas…',
      expl: 'Las casas son las <b>células</b>, las unidades más pequeñas del cuerpo. Cada una necesita recibir nutrientes y oxígeno, y produce desechos.' },
    sectores: { l: 'D', n: 'Los sectores de casas', pill: [482, 166], ok: 'tejido', otras: ['celula', 'organo', 'vasos'],
      cita: '…en general agrupadas por sectores y estos se comunican entre sí a través de pequeñas rutas.',
      expl: 'Un grupo de células parecidas que trabajan juntas forma un <b>tejido</b>. Varios tejidos forman un órgano.' },
    barcos: { l: 'E', n: 'Los barcos', pill: [255, 433], ok: 'sangre', otras: ['vasos', 'digestivo', 'rinon'],
      cita: 'Se utilizan barcos que navegan por caminos acuáticos y transportan productos alimenticios y materiales de descarte.',
      expl: 'Los barcos son la <b>sangre</b>: lleva los nutrientes y el oxígeno a cada célula y recoge sus desechos.' },
    caminos: { l: 'F', n: 'Los caminos acuáticos', pill: [450, 50], ok: 'vasos', otras: ['sangre', 'tejido', 'respiratorio'],
      cita: 'Las islas se comunican mediante barcos que navegan por caminos acuáticos.',
      expl: 'Los caminos son los <b>vasos sanguíneos</b> (arterias, venas y capilares). Con la sangre y el corazón forman el <b>sistema circulatorio</b>, que conecta a todos.' },
    huerta: { l: 'G', n: 'Las islas Huerta y Granja', pill: [128, 222], ok: 'digestivo', otras: ['respiratorio', 'rinon', 'celula'],
      cita: 'La isla Huerta se encarga de recolectar frutas y verduras, la isla Granja se ocupa de la cría de animales y la elaboración de todos los productos derivados…',
      expl: 'Son como el <b>sistema digestivo</b>: incorpora los alimentos y los transforma en <b>nutrientes</b> que la sangre reparte a todas las células.' },
    planta: { l: 'H', n: 'La planta de reciclaje', pill: [640, 420], ok: 'rinon', otras: ['digestivo', 'respiratorio', 'vasos'],
      cita: 'Los desechos llegan a una isla donde funciona una planta de reciclaje, que se encarga de separar los residuos, reciclarlos y descartar lo que verdaderamente no sirve.',
      expl: 'Es como los <b>riñones</b> (sistema excretor): filtran la sangre, separan los desechos y los eliminan con la <b>orina</b>.' },
    vuelve: { l: 'I', n: 'Lo que vuelve a las islas', pill: [560, 245], ok: 'reabs', otras: ['orina', 'sangre', 'digestivo'],
      cita: 'Aquellos productos reutilizables los envía nuevamente a las islas.',
      expl: 'En los riñones, el agua, la glucosa y las sales que todavía sirven se <b>reabsorben</b> y vuelven a la sangre. Lo que verdaderamente no sirve sale con la <b>orina</b>.' },
  };
  const CASOS = [
    { id: 'tormenta', t: '⛈️ Hay una <b>tormenta</b> y los barcos no pueden navegar.', ok: 'circulatorio', e: 'Si la sangre no circula, las células se quedan sin nutrientes ni oxígeno, y nadie retira sus desechos.' },
    { id: 'tronco', t: '🪵 Un <b>tronco bloquea un camino acuático</b> y un sector de casas no recibe nada.', ok: 'circulatorio', e: 'Es como una arteria tapada: las células de esa zona se quedan sin oxígeno. Así ocurre, por ejemplo, un infarto.' },
    { id: 'rota', t: '🏭 La <b>planta de reciclaje se rompe</b> y los desechos se acumulan en las islas.', ok: 'excretor', e: 'Si los riñones no funcionan, los desechos se acumulan en la sangre y se vuelven tóxicos.' },
    { id: 'reusa', t: '♻️ La planta <b>devuelve a las islas</b> los productos que todavía sirven.', ok: 'excretor', e: 'Los riñones reabsorben el agua, la glucosa y las sales útiles, y las devuelven a la sangre.' },
    { id: 'sequia', t: '🌵 Una <b>sequía</b> arruina la cosecha de la isla Huerta.', ok: 'digestivo', e: 'Sin alimentos no hay nutrientes para repartir: es como pasar mucho tiempo sin comer.' },
    { id: 'queso', t: '🧀 La isla Granja <b>transforma la leche en queso y manteca</b> antes de repartirla.', ok: 'digestivo', e: 'El sistema digestivo transforma los alimentos en nutrientes pequeños que pueden pasar a la sangre.' },
    { id: 'casa', t: '🏠 Cada casa <b>usa lo que recibe</b> para vivir y descarta materiales inservibles.', ok: 'celula', e: 'Las células usan los nutrientes y el oxígeno para obtener energía, y al hacerlo producen desechos.' },
    { id: 'retiran', t: '🛥️ Los barcos <b>recogen los descartes</b> de las casas y los llevan a la planta.', ok: 'circulatorio', e: 'La sangre recoge los desechos de las células y los lleva hasta los riñones (y el dióxido de carbono, hasta los pulmones).' },
  ];
  const RONDA = 5;
  let ciu = null;

  // Contorno irregular de una isla (siempre el mismo para la misma posición).
  function contorno(cx, cy, rx, ry) {
    const p = Array.from({ length: 22 }, (_, i) => {
      const a = i / 22 * Math.PI * 2, k = 1 + 0.07 * Math.sin(3 * a + cx) + 0.05 * Math.sin(5 * a + cy);
      return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
    });
    const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let d = `M${m(p[21], p[0]).map(v => v.toFixed(1)).join(',')}`;
    p.forEach((q, i) => { const n = m(q, p[(i + 1) % 22]); d += ` Q${q[0].toFixed(1)},${q[1].toFixed(1)} ${n[0].toFixed(1)},${n[1].toFixed(1)}`; });
    return d + ' Z';
  }
  const isla = (cx, cy, rx, ry, pasto = ['#5fd38d', '#3fb46f']) => `
    <path d="${contorno(cx, cy, rx + 14, ry + 12)}" fill="#5cc8ff" opacity="0.16"/>
    <path d="${contorno(cx + 6, cy + 10, rx, ry)}" fill="#05061a" opacity="0.32"/>
    ${dosTonos(`<path d="${contorno(cx, cy, rx, ry)}" fill="FILL"/>`, '#ffe8a3', '#efc56a', { y: cy + ry * 0.45 })}
    ${dosTonos(`<path d="${contorno(cx, cy - 5, rx - 13, ry - 13)}" fill="FILL"/>`, pasto[0], pasto[1], { y: cy + ry * 0.3 })}
    ${brillo(`M${cx - rx * 0.6},${cy - ry * 0.55} q${rx * 0.3},${-ry * 0.3} ${rx * 0.6},${-ry * 0.32}`, 3)}`;
  const rotulo = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" class="nx-isla-rot">${t}</text>`;
  const casita = (x, y, techo, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">
    <rect x="-9" y="-2" width="20" height="16" rx="2" fill="#05061a" opacity="0.3" transform="translate(2 2)"/>
    ${dosTonos('<rect x="-10" y="-4" width="20" height="16" rx="2" fill="FILL"/>', '#f4f1ff', '#d4d0f5', { x: 3 })}
    ${dosTonos('<path d="M-13,-3 L0,-15 L13,-3 Z" fill="FILL"/>', techo, Arte.tono(techo, -0.2), { x: 0 })}
    <rect x="-6" y="0" width="5" height="5" rx="1" fill="#ffe28a"/><rect x="2" y="3" width="5" height="9" rx="1" fill="#2b1d5c"/></g>`;
  // Rutas acuáticas: [id, recorrido].
  const RUTAS = {
    huerta: 'M200,138 C245,160 265,185 292,205',
    granja: 'M198,318 C240,305 265,290 292,272',
    planta: 'M488,282 C525,305 545,318 568,324',
    vuelta: 'M560,302 C540,285 520,270 498,262',
    arriba: 'M215,92 C380,24 660,40 664,266',
    abajo: 'M205,368 C320,425 470,428 565,372',
  };
  const barco = (carga, casco = ['#ff6b6b', '#d63c3c']) => {
    const cajas = {
      comida: '<rect x="-12" y="-13" width="9" height="8" rx="1.5" fill="#ff9f43"/><rect x="-2" y="-13" width="9" height="8" rx="1.5" fill="#51cf66"/><rect x="-7" y="-20" width="9" height="7" rx="1.5" fill="#ffd166"/>',
      desecho: '<path d="M-12,-5 C-14,-14 -4,-16 -4,-9 C-2,-15 8,-13 6,-5 Z" fill="#868e96"/><path d="M-6,-14 l2,-3 l2,3" stroke="#495057" stroke-width="1.5" fill="none"/>',
      aire: '<circle cx="-4" cy="-11" r="6.5" fill="#dff3ff" stroke="#48a6d9" stroke-width="1.5"/><text x="-4" y="-8.5" text-anchor="middle" class="nx-o2">O₂</text>',
      recicla: '<rect x="-12" y="-14" width="14" height="10" rx="2" fill="#2fb67c"/><path d="M-8,-9 a3,3 0 1 1 4,2" stroke="#fff" stroke-width="1.5" fill="none"/>',
    }[carga];
    return `<g>${dosTonos('<path d="M-17,-4 L17,-4 L12,7 L-13,7 Z" fill="FILL"/>', casco[0], casco[1], { y: 2 })}<rect x="6" y="-11" width="8" height="7" rx="2" fill="#f4f1ff"/>${cajas}
      <path d="M-20,9 q5,3 10,0 t10,0 t10,0 t10,0" stroke="#dff3ff" stroke-width="1.5" fill="none" opacity="0.6"/></g>`;
  };
  const navegar = (ruta, carga, dur, beg, atras, casco) => `<g>${barco(carga, casco)}<animateMotion dur="${dur}s" begin="${beg}s" repeatCount="indefinite" rotate="${atras ? 'auto-reverse' : 'auto'}" path="${RUTAS[ruta]}" ${atras ? 'keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : ''}/></g>`;

  function islasFija() {
    const olas = Array.from({ length: 34 }, (_, i) => { const x = (i * 131.7) % CW, y = 20 + (i * 67.3) % (CH - 30); return `<path d="M${x.toFixed(0)},${y.toFixed(0)} q6,-4 12,0 t12,0" stroke="#7fb4ff" stroke-width="1.6" fill="none" opacity="${0.12 + (i % 3) * 0.06}"/>`; }).join('');
    // F: caminos acuáticos
    const caminos = `<g class="nx-lugar" data-l="caminos">${Object.entries(RUTAS).filter(([k]) => k !== 'vuelta').map(([, d]) => `<path d="${d}" stroke="#5cc8ff" stroke-width="18" opacity="0.2" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#5cc8ff" stroke-width="26" opacity="0" fill="none"/><path d="${d}" stroke="#bfe8ff" stroke-width="2" stroke-dasharray="6 8" opacity="0.55" fill="none"/>`).join('')}</g>`;
    // G: islas Huerta y Granja
    const fila = (x, y) => `<path d="M${x},${y} h70" stroke="#8a5a35" stroke-width="7" stroke-linecap="round"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${x + 4 + i * 12.5}" cy="${y - 4}" r="5" fill="${i % 2 ? '#40c057' : '#69db7c'}"/>`).join('')}`;
    const arbol = (x, y) => `<g>${Arte.sombra(x + 4, y + 16, 14)}<rect x="${x - 2.5}" y="${y}" width="5" height="16" rx="2" fill="#7a4a2a"/>${dosTonos(`<circle cx="${x}" cy="${y - 4}" r="14" fill="FILL"/>`, '#2fb67c', '#1f8f5e', { x: x + 4 })}${[[-6, -8], [5, -2], [-2, 4], [7, -12]].map(([a, b]) => `<circle cx="${x + a}" cy="${y - 4 + b}" r="2.6" fill="#ff922b"/>`).join('')}</g>`;
    const molino = (x, y, dur) => `<g>${Arte.sombra(x + 3, y + 2, 10)}<path d="M${x - 3},${y} L${x - 1.5},${y - 38} L${x + 1.5},${y - 38} L${x + 3},${y} Z" fill="#f4f1ff"/>
      <g transform="translate(${x} ${y - 38})"><g>${[0, 120, 240].map(a => `<path d="M0,0 C3,-6 3,-18 0,-22 C-3,-18 -2,-6 0,0 Z" fill="#dff3ff" transform="rotate(${a})"/>`).join('')}<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}s" repeatCount="indefinite"/></g><circle r="3" fill="#48a6d9"/></g></g>`;
    const huerta = `<g class="nx-lugar" data-l="huerta">
      ${fila(78, 102)}${fila(84, 122)}${fila(90, 142)}${arbol(62, 132)}${molino(180, 112, 3)}${molino(204, 128, 2.4)}
      <g transform="translate(166 146)"><path d="M-10,-2 h20 l-3,11 h-14 Z" fill="#c98a3d"/><circle cx="-4" cy="-4" r="4" fill="#ff6b6b"/><circle cx="4" cy="-5" r="4" fill="#ffd43b"/></g>
      ${rotulo(128, 72, 'ISLA HUERTA')}
      <g transform="translate(0 0)">
        <g transform="translate(150 320)">${dosTonos('<rect x="-26" y="-22" width="52" height="34" rx="3" fill="FILL"/>', '#e8590c', '#c2410c', { x: 10 })}${dosTonos('<path d="M-31,-21 L0,-42 L31,-21 Z" fill="FILL"/>', '#a52a2a', '#7f1d1d', { x: 0 })}
          <rect x="-9" y="-10" width="18" height="22" fill="#fff4e6"/><path d="M-9,-10 L9,12 M9,-10 L-9,12" stroke="#e8590c" stroke-width="2.5"/>${carita(0, -27, 2.6)}</g>
        <g transform="translate(196 322)">${dosTonos('<rect x="-9" y="-36" width="18" height="48" rx="9" fill="FILL"/>', '#ced4da', '#adb5bd', { x: 2 })}<rect x="-9" y="-36" width="18" height="10" rx="5" fill="#868e96"/></g>
        <g transform="translate(86 336) scale(0.36)">${Arte.vaca(0, 0)}</g>
        <path d="M58,360 h60 M58,352 h60" stroke="#e9d8a6" stroke-width="2.5"/>${[60, 75, 90, 105, 118].map(x => `<line x1="${x}" x2="${x}" y1="346" y2="364" stroke="#e9d8a6" stroke-width="3"/>`).join('')}
        ${rotulo(124, 280, 'ISLA GRANJA')}</g></g>`;
    // B / C / D: isla de las casas
    const SECT = [[322, 212, '#ff7b54'], [448, 210, '#5b7cfa'], [388, 290, '#b197fc']];
    const rutitas = `<path d="M322,212 L448,210 M322,212 L388,290 M448,210 L388,290" stroke="#f1e3c0" stroke-width="5" stroke-linecap="round" opacity="0.85"/>`;
    const sectores = `<g class="nx-lugar" data-l="sectores">${SECT.map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="52" ry="34" fill="${c}" opacity="0.16"/><ellipse cx="${x}" cy="${y}" rx="52" ry="34" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="5 4" opacity="0.9"/>`).join('')}${rutitas}</g>`;
    const casas = `<g class="nx-lugar" data-l="casas">${SECT.map(([x, y, c]) => [[-26, -6], [0, -14], [24, -4], [-6, 12], [20, 16]].map(([a, b], i) => casita(x + a, y + b, c, i === 1 ? 1.1 : 0.95)).join('')).join('')}${carita(322, 192, 2.2)}</g>`;
    // H / I: planta de reciclaje
    const planta = `<g class="nx-lugar" data-l="planta">
      <g transform="translate(640 330)">${dosTonos('<rect x="-40" y="-30" width="80" height="48" rx="6" fill="FILL"/>', '#ffd166', '#f0a830', { x: 14 })}
        <rect x="-30" y="-18" width="10" height="10" rx="2" fill="#ffe28a"/><rect x="-14" y="-18" width="10" height="10" rx="2" fill="#3a3f8f"/>
        <rect x="22" y="-52" width="12" height="24" fill="#b37a00"/>${[0, 1].map(i => `<circle cx="${28 + i * 6}" cy="${-60 - i * 12}" r="${6 + i * 3}" fill="#e9ebff" opacity="${0.5 - i * 0.15}"/>`).join('')}
        <g transform="translate(6 -6)"><path d="M-10,-6 A11,11 0 1 1 -3,9" stroke="#2fb67c" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-7,11 L-1,6 L-9,4 Z" fill="#2fb67c"/></g>
        ${carita(-22, 6, 2.6)}
        ${[[-56, 12, '#4c6ef5'], [-44, 14, '#2fb67c'], [50, 12, '#868e96']].map(([x, y, c]) => `<rect x="${x - 6}" y="${y - 14}" width="12" height="14" rx="2" fill="${c}"/><rect x="${x - 7}" y="${y - 17}" width="14" height="4" rx="2" fill="#1f2256"/>`).join('')}</g>
      ${rotulo(640, 284, 'PLANTA DE RECICLAJE')}</g>`;
    // A: el archipiélago (cartel y rosa de los vientos)
    const archi = `<g class="nx-lugar" data-l="archi"><rect x="14" y="12" width="96" height="30" fill="transparent"/>
      <g transform="translate(40 410)"><circle r="24" fill="#12143a" opacity="0.6"/>${[0, 90, 180, 270].map(a => `<path d="M0,-20 L5,0 L0,4 L-5,0 Z" fill="${a ? '#c9ccf5' : '#ffd166'}" transform="rotate(${a})"/>`).join('')}<text y="-26" text-anchor="middle" class="nx-isla-rot">N</text></g>
      <path d="M8,10 h${CW - 16} v${CH - 20} h${-(CW - 16)} Z" stroke="#ffd166" stroke-width="3" fill="none" opacity="0.35" stroke-dasharray="2 10" stroke-linecap="round"/></g>`;
    // E / I: barcos (los verdes llevan lo reutilizable de vuelta)
    const barcos = `<g class="nx-lugar" data-l="barcos">
      ${navegar('huerta', 'comida', 7, 0)}${navegar('granja', 'comida', 7.5, -3)}${navegar('planta', 'desecho', 6, -1)}
      ${navegar('arriba', 'comida', 14, -4)}${navegar('arriba', 'desecho', 14, -11, true)}${navegar('abajo', 'desecho', 15, -9, true)}</g>`;
    const vuelve = `<g class="nx-lugar" data-l="vuelve"><path d="${RUTAS.vuelta}" stroke="#2fb67c" stroke-width="4" fill="none" stroke-dasharray="7 6" opacity="0.8"/><path d="M500,256 l-4,8 l9,1 Z" fill="#2fb67c"/>
      ${navegar('vuelta', 'recicla', 5, -1, false, ['#51cf66', '#2f9e44'])}</g>`;
    return `<defs><radialGradient id="nx-mar" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stop-color="#1f4fa0"/><stop offset="1" stop-color="#0c1640"/></radialGradient></defs>
      <rect width="${CW}" height="${CH}" rx="14" fill="url(#nx-mar)"/>${olas}${archi}
      ${caminos}
      <g class="nx-lugar" data-l="isla">${isla(128, 118, 92, 58)}${isla(126, 330, 90, 56, ['#8ce99a', '#5fd38d'])}${isla(386, 246, 140, 100)}${isla(642, 328, 92, 58, ['#b2c79a', '#94ab7c'])}</g>
      ${sectores}${casas}${huerta}${planta}${barcos}${vuelve}`;
  }

  function islas(cont) {
    ciu = { hechos: {}, sel: null, error: null, etapa: 'unir', casos: [], i: 0, aciertos: 0, resp: null, texto: true };
    cont.innerHTML = `<div class="nu-grid">
        <div class="panel nu-escena"><div class="nx-scroll"><svg id="nx-csvg" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="El archipiélago de las islas SIN"><g id="nx-cfijo"></g><g id="nx-cpills"></g></svg></div>
          <p class="nu-ayuda-esc">👆 Tocá cada parte del archipiélago (de la A a la I) y elegí qué representa en el cuerpo.</p></div>
        <aside class="panel nu-info" id="nx-cinfo"></aside>
      </div>`;
    ciu.cont = cont;
    cont.querySelector('#nx-cfijo').innerHTML = islasFija();
    cont.querySelector('#nx-csvg').addEventListener('click', e => {
      const g = e.target.closest('[data-l]');
      if (!g || ciu.etapa !== 'unir') return;
      ciu.sel = g.dataset.l;
      ciu.error = null;
      pintarIslas();
    });
    pintarIslas();
  }

  const opciones = id => { const P = PARTES[id]; return [P.ok, ...P.otras].sort((a, b) => ((a.charCodeAt(1) * 7 + id.length) % 11) - ((b.charCodeAt(1) * 7 + id.length) % 11)); };

  function pintarIslas() {
    const c = ciu.cont, svg = c.querySelector('#nx-csvg');
    const marcado = ciu.etapa === 'unir' ? ciu.sel : null;
    svg.classList.toggle('con-sel', !!marcado);
    svg.querySelectorAll('.nx-lugar').forEach(g => g.classList.toggle('sel', g.dataset.l === marcado));
    const total = Object.keys(PARTES).length;
    c.querySelector('#nx-cpills').innerHTML = Object.entries(PARTES).map(([k, P]) => {
      const [x, y] = P.pill, hecho = ciu.hechos[k], t = hecho ? CUERPO[P.ok][1] : '?', w = hecho ? t.length * 7.3 + 38 : 52;
      return `<g class="nx-pill clic ${hecho ? 'hecho' : ''}${ciu.sel === k && ciu.etapa === 'unir' ? ' activo' : ''}" data-l="${k}">
        <rect x="${x - w / 2}" y="${y - 13}" width="${w}" height="26" rx="13" fill="${hecho ? COL[CUERPO[P.ok][2]][0] : '#12143a'}"/>
        <circle cx="${x - w / 2 + 13}" cy="${y}" r="10" fill="#12143a" stroke="${hecho ? '#12143a' : '#ffd166'}" stroke-width="2"/><text x="${x - w / 2 + 13}" y="${y + 4}" text-anchor="middle" class="nx-letra">${P.l}</text>
        <text x="${x - w / 2 + 28}" y="${y + 4.5}" class="nx-pill-t">${t}</text></g>`;
    }).join('');
    const info = c.querySelector('#nx-cinfo');
    if (ciu.etapa === 'casos') return pintarCasos(info);
    const n = Object.keys(ciu.hechos).length;
    if (!ciu.sel) {
      info.innerHTML = `<h2>🏝️ El archipiélago de las islas SIN</h2>
        <details class="nx-texto" ${ciu.texto ? 'open' : ''}><summary>📖 Leer el texto</summary>${TEXTO_SIN.map(p => `<p>${p}</p>`).join('')}</details>
        <p class="nu-ayuda">El archipiélago funciona como nuestro cuerpo. Tocá cada parte de la escena y descubrí qué representa.</p>
        <div class="nx-progreso"><div style="width:${n / total * 100}%"></div></div><p class="nu-ayuda">${n} de ${total} partes descubiertas</p>
        ${n === total ? `<div class="feedback ok"><p class="fb-titulo">🏆 ¡Descubriste todo el archipiélago!</p><p>Ahora, a resolver situaciones: ¿qué pasa en el cuerpo cuando algo falla en las islas?</p></div><button class="btn primario" id="nx-casos">Seguir: situaciones en las islas →</button>` : ''}`;
      info.querySelector('details').addEventListener('toggle', e => { ciu.texto = e.target.open; });
      info.querySelector('#nx-casos')?.addEventListener('click', empezarCasos);
      return;
    }
    const P = PARTES[ciu.sel];
    const cab = `<h2><span class="nx-letra-h">${P.l}</span> ${P.n}</h2><blockquote class="nx-cita${P.extra ? ' extra' : ''}">${P.extra ? '' : '«'}${P.cita}${P.extra ? '' : '»'}</blockquote>`;
    if (ciu.hechos[ciu.sel]) {
      info.innerHTML = `${cab}<div class="feedback ok"><p class="fb-titulo">✅ ${CUERPO[P.ok][0]}</p><p>${P.expl}</p></div>
        <button class="btn primario" id="nx-seguir">${n === total ? 'Terminar' : 'Elegir otra parte'}</button>`;
      info.querySelector('#nx-seguir').addEventListener('click', () => { ciu.sel = null; pintarIslas(); });
      return;
    }
    info.innerHTML = `${cab}<p class="nu-pregunta">¿Qué representa en el cuerpo?</p>
      <div class="nu-opciones">${opciones(ciu.sel).map(k => `<button class="btn-opcion" data-o="${k}">${CUERPO[k][0]}</button>`).join('')}</div>
      ${ciu.error ? `<p class="nu-error">✖ ${ciu.error}</p>` : ''}`;
    info.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
      const o = b.dataset.o;
      if (o === P.ok) { ciu.hechos[ciu.sel] = true; ciu.error = null; }
      else ciu.error = `No es ${CUERPO[o][0].charAt(0).toLowerCase() + CUERPO[o][0].slice(1)}. Volvé a leer la parte del texto y pensá qué cumple una función parecida en el cuerpo.`;
      pintarIslas();
    }));
  }

  function empezarCasos() {
    Object.assign(ciu, { etapa: 'casos', casos: Util.tomar('nu-islas', CASOS, RONDA, x => x.id), i: 0, aciertos: 0, resp: null, sel: null });
    pintarIslas();
  }

  function pintarCasos(info) {
    if (ciu.i >= ciu.casos.length) {
      info.innerHTML = `<h2>🏝️ Situaciones en las islas</h2>
        <div class="feedback ${ciu.aciertos >= 4 ? 'ok' : 'mal'}"><p class="fb-titulo">${ciu.aciertos >= 4 ? '🏆' : '💪'} ${ciu.aciertos} de ${ciu.casos.length} correctas</p>
        <p>Recordá: los <b>barcos y los caminos acuáticos</b> (la sangre y los vasos sanguíneos) conectan todas las islas. Si se detienen, ninguna casa recibe ni descarta nada.</p></div>
        <button class="btn primario" id="nx-otra">Otra ronda</button> <button class="btn" id="nx-volver">Volver al archipiélago</button>`;
      info.querySelector('#nx-otra').addEventListener('click', empezarCasos);
      info.querySelector('#nx-volver').addEventListener('click', () => { ciu.etapa = 'unir'; ciu.sel = null; pintarIslas(); });
      return;
    }
    const caso = ciu.casos[ciu.i];
    info.innerHTML = `<h2>🏝️ Situación ${ciu.i + 1} de ${ciu.casos.length}</h2>
      <p class="nx-caso">${caso.t}</p><p class="nu-pregunta">¿Qué parte del cuerpo estaría fallando o funcionando?</p>
      <div class="nu-opciones">${Object.keys(NOMBRE).map(k => `<button class="btn-opcion${ciu.resp ? (k === caso.ok ? ' correcta' : k === ciu.resp ? ' incorrecta' : '') : ''}" data-o="${k}" ${ciu.resp ? 'disabled' : ''}>${NOMBRE[k]}</button>`).join('')}</div>
      ${ciu.resp ? `<div class="feedback ${ciu.resp === caso.ok ? 'ok' : 'mal'}"><p class="fb-titulo">${ciu.resp === caso.ok ? '✅ ¡Bien!' : `✖ Era: ${NOMBRE[caso.ok]}`}</p><p>${caso.e}</p></div>
        <button class="btn primario" id="nx-sig">${ciu.i + 1 < ciu.casos.length ? 'Siguiente' : 'Ver resultado'}</button>` : ''}`;
    info.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
      ciu.resp = b.dataset.o;
      if (ciu.resp === caso.ok) ciu.aciertos++;
      pintarIslas();
    }));
    info.querySelector('#nx-sig')?.addEventListener('click', () => { ciu.i++; ciu.resp = null; pintarIslas(); });
  }

  return { esquema, islas };
})();
