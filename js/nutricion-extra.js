// Sistemas de la nutrición (2.º año): "Completar el esquema" y "La ciudad" (analogías).
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

  // ========== 6. La ciudad (analogías) ==========
  const CW = 760, CH = 450;
  const LUGARES = {
    digestivo: { n: 'Planta procesadora de alimentos', pill: [118, 172], desc: 'Recibe la materia prima, la separa en partes pequeñas y útiles, y tira los restos que no sirven.', expl: 'Como el <b>sistema digestivo</b>: transforma los alimentos en <b>nutrientes</b> y elimina lo que no se absorbe como materia fecal.' },
    respiratorio: { n: 'Torres de ventilación', pill: [268, 84], desc: 'Hacen entrar aire fresco a la ciudad y sacan el aire viciado.', expl: 'Como el <b>sistema respiratorio</b>: toma el <b>oxígeno</b> del aire y elimina el <b>dióxido de carbono</b>.' },
    celula: { n: 'Casas y fábricas', pill: [428, 150], desc: 'Es donde se vive y se trabaja: usan la mercadería y la energía para producir, y generan basura.', expl: 'Como las <b>células</b>: usan los nutrientes y el oxígeno para obtener <b>energía</b> y crecer, y producen <b>desechos</b>.' },
    excretor: { n: 'Planta de tratamiento de residuos', pill: [638, 164], desc: 'Recibe la basura y el agua sucia, los filtra y saca de la ciudad lo que no sirve.', expl: 'Como el <b>sistema excretor</b>: los <b>riñones</b> filtran la sangre y eliminan los desechos con la <b>orina</b>.' },
    circulatorio: { n: 'Rutas y camiones de reparto', pill: [380, 424], desc: 'Recorren toda la ciudad: llevan mercadería a cada casa y fábrica, y se llevan la basura.', expl: 'Como el <b>sistema circulatorio</b>: la sangre, impulsada por el corazón, lleva nutrientes y oxígeno a todas las células y recoge sus desechos. ¡Conecta a todos!' },
  };
  const LETRA = { digestivo: 'A', respiratorio: 'B', celula: 'C', excretor: 'D', circulatorio: 'E' };
  const CASOS = [
    { id: 'corte', t: '🚧 Hay un <b>corte de rutas</b> y los camiones no pueden pasar.', ok: 'circulatorio', e: 'Es como cuando una arteria se tapa: la sangre no llega y las células se quedan sin nutrientes ni oxígeno.' },
    { id: 'paro', t: '🗑️ Hay un <b>paro de recolectores</b> y la basura se acumula en las calles.', ok: 'excretor', e: 'Es como cuando los riñones no funcionan: los desechos se acumulan en la sangre y se vuelven tóxicos.' },
    { id: 'venti', t: '🌫️ Se rompen los <b>ventiladores</b> y el aire se vuelve pesado y lleno de humo.', ok: 'respiratorio', e: 'Sin sistema respiratorio no entra oxígeno ni sale el dióxido de carbono: las células no pueden obtener energía.' },
    { id: 'materia', t: '📦 A la planta procesadora <b>no le llega materia prima</b>.', ok: 'digestivo', e: 'Es como pasar mucho tiempo sin comer: no hay nutrientes para repartir a las células.' },
    { id: 'trabajo', t: '🏭 En las casas y fábricas <b>se trabaja, se usa energía y se produce basura</b>.', ok: 'celula', e: 'Las células usan nutrientes y oxígeno para obtener energía, y al hacerlo producen desechos.' },
    { id: 'llevar', t: '🚚 Los camiones <b>llevan la basura</b> de las casas hasta la planta de tratamiento.', ok: 'circulatorio', e: 'La sangre recoge los desechos de las células y los lleva hasta los riñones y los pulmones.' },
    { id: 'separa', t: '♻️ La planta procesadora <b>separa lo que sirve</b> y tira los restos.', ok: 'digestivo', e: 'El digestivo absorbe los nutrientes y elimina lo que no se aprovecha como materia fecal.' },
    { id: 'filtra', t: '💧 La planta de tratamiento <b>filtra el agua sucia</b> y devuelve agua limpia a la ciudad.', ok: 'excretor', e: 'Los riñones filtran la sangre: separan los desechos y devuelven la sangre limpia.' },
    { id: 'fresco', t: '🌬️ Entra <b>aire fresco</b> a la ciudad y sale el aire usado.', ok: 'respiratorio', e: 'Inspiramos aire con oxígeno y espiramos aire con dióxido de carbono.' },
  ];
  const RONDA = 5;
  let ciu = null;

  function ciudadFija() {
    const ventana = (x, y, w = 9, h = 11, luz = true) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${luz ? '#ffe28a' : '#3a3f8f'}"/>`;
    const edificio = (x, y, w, h, c1, c2, extra = '') => `<rect x="${x + 5}" y="${y + 6}" width="${w}" height="${h}" rx="4" fill="#05061a" opacity="0.35"/>${dosTonos(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="FILL"/>`, c1, c2, { x: x + w * 0.62 })}${extra}`;
    // A: planta procesadora (digestivo)
    const planta = `<g class="nx-lugar" data-l="digestivo"><rect x="14" y="160" width="200" height="190" fill="transparent"/>
      ${edificio(40, 234, 150, 106, '#ff8fab', '#e0607f')}
      ${[0, 1, 2, 3].map(i => dosTonos(`<path d="M${40 + i * 37.5},234 L${40 + i * 37.5},212 L${77.5 + i * 37.5},234 Z" fill="FILL"/>`, '#ffb3c6', '#e0607f', { x: 70 + i * 37.5 })).join('')}
      <rect x="150" y="186" width="16" height="48" fill="#b83a5e"/><rect x="146" y="182" width="24" height="8" rx="3" fill="#e0607f"/>
      ${[0, 1, 2].map(i => `<circle cx="${158 + i * 8}" cy="${170 - i * 16}" r="${7 + i * 3}" fill="#e9ebff" opacity="${0.55 - i * 0.14}"/>`).join('')}
      ${[56, 80, 104].map(x => ventana(x, 252)).join('')}${[56, 80].map(x => ventana(x, 272, 9, 11, false)).join('')}
      ${carita(146, 266, 4)}${brillo('M46,246 V300', 3)}
      <rect x="10" y="318" width="96" height="8" rx="4" fill="#3a3e85"/>${[18, 38, 58, 78, 98].map(x => `<circle cx="${x}" cy="326" r="4" fill="#1f2256" stroke="#6b70c9" stroke-width="1.5"/>`).join('')}
      ${Alimentacion.alimento('pan', 30, 306, 0.6)}${Alimentacion.alimento('manzana', 62, 307, 0.55)}${Alimentacion.alimento('zanahoria', 92, 306, 0.5)}
      <rect x="112" y="296" width="30" height="44" rx="3" fill="#8f2d4b"/>
      ${[[196, 330], [206, 318], [196, 306]].map(([x, y]) => `<polygon points="${[-90, -30, 30, 90, 150, 210].map(a => `${(x + 6 * Math.cos(a * Math.PI / 180)).toFixed(1)},${(y + 6 * Math.sin(a * Math.PI / 180)).toFixed(1)}`).join(' ')}" fill="#ffd166" stroke="#c98a00" stroke-width="1"/>`).join('')}</g>`;
    // B: torres de ventilación (respiratorio)
    const torre = (x) => `${edificio(x, 120, 36, 220, '#7fd3ff', '#48a6d9')}${[150, 190, 230, 270, 310].map(y => `<rect x="${x + 6}" y="${y}" width="24" height="4" rx="2" fill="#2f86b8" opacity="0.6"/>`).join('')}
      <g transform="translate(${x + 18} 110)"><circle r="24" fill="#05061a" opacity="0.3" transform="translate(3 4)"/><circle r="24" fill="#dff3ff" stroke="#48a6d9" stroke-width="4"/>
        <g>${[0, 120, 240].map(a => `<path d="M0,0 C6,-8 6,-18 0,-20 C-6,-18 -4,-8 0,0 Z" fill="#48a6d9" transform="rotate(${a})"/>`).join('')}
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${x > 250 ? 2.4 : 3}s" repeatCount="indefinite"/></g>
        <circle r="4" fill="#1f5f86"/></g>`;
    const torres = `<g class="nx-lugar" data-l="respiratorio"><rect x="216" y="76" width="112" height="274" fill="transparent"/>
      ${[0, 1, 2].map(i => `<path d="M${196 + i * 4},${150 + i * 18} q10,-6 20,0 t20,0" stroke="#bfe8ff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>`).join('')}
      ${torre(226)}${torre(278)}${carita(262, 214, 3.6)}
      ${[0, 1].map(i => `<path d="M${320 + i * 6},${140 + i * 20} q10,-6 20,0 t20,0" stroke="#8f96b8" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>`).join('')}</g>`;
    // C: casas y fábricas (células)
    const casa = (x, y, w, h, c1, c2, techo, cara) => `${edificio(x, y, w, h, c1, c2)}${dosTonos(`<path d="M${x - 6},${y} L${x + w / 2},${y - techo} L${x + w + 6},${y} Z" fill="FILL"/>`, '#ff7b54', '#e0563a', { x: x + w / 2 })}
      ${ventana(x + 8, y + 14)}${ventana(x + w - 17, y + 14)}<rect x="${x + w / 2 - 7}" y="${y + h - 22}" width="14" height="22" rx="3" fill="#2b1d5c"/>${cara ? carita(x + w / 2, y + 40, 3.2) : ''}`;
    const casas = `<g class="nx-lugar" data-l="celula"><rect x="336" y="140" width="184" height="210" fill="transparent"/>
      ${edificio(420, 196, 90, 144, '#8b6cf0', '#6a4ce0', `${[430, 452, 474, 494].flatMap(x => [214, 238, 262].map((y, j) => ventana(x, y, 9, 12, (x + j) % 3 !== 0))).join('')}
        <g transform="translate(466 300)"><circle r="14" fill="#ffd166"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="-3" y="-18" width="6" height="8" rx="1" fill="#ffd166" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#6a4ce0"/>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" additive="sum"/></g>`)}
      ${casa(344, 260, 58, 80, '#b197fc', '#8b6cf0', 26, true)}${casa(396, 290, 44, 50, '#d0bfff', '#b197fc', 18, false)}
</g>`;
    // D: planta de tratamiento (excretor)
    const tanque = (x, y) => `<g>${dosTonos(`<rect x="${x - 26}" y="${y}" width="52" height="${340 - y}" rx="6" fill="FILL"/>`, '#ffd166', '#f0a830', { x: x + 8 })}
      <ellipse cx="${x}" cy="${y}" rx="26" ry="8" fill="#7fd3ff"/><ellipse cx="${x - 6}" cy="${y - 2}" rx="10" ry="3" fill="#dff3ff" opacity="0.8"/>${brillo(`M${x - 20},${y + 10} V${y + 50}`, 3)}</g>`;
    const planta2 = `<g class="nx-lugar" data-l="excretor"><rect x="536" y="150" width="210" height="200" fill="transparent"/>
      ${edificio(600, 232, 110, 108, '#ffd166', '#f0a830')}${ventana(614, 250)}${ventana(638, 250)}${ventana(686, 250, 9, 11, false)}
      ${carita(662, 290, 4)}${tanque(566, 262)}${tanque(726, 280)}
      <path d="M592,300 H600 M710,310 H700" stroke="#b37a00" stroke-width="6"/>
      <g transform="translate(628 180)"><path d="M-12,-8 A14,14 0 1 1 -4,12" stroke="#2fb67c" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-8,14 L-2,8 L-10,6 Z" fill="#2fb67c"/></g>
      ${[[572, 334, '#4c6ef5'], [590, 334, '#2fb67c']].map(([x, y, c]) => `<rect x="${x - 7}" y="${y - 18}" width="14" height="18" rx="2" fill="${c}"/><rect x="${x - 8}" y="${y - 21}" width="16" height="4" rx="2" fill="#1f2256"/>`).join('')}</g>`;
    // E: rutas y camiones (circulatorio)
    const camion = (color, caja, dir) => `<g transform="scale(${dir} 1)"><rect x="-26" y="-18" width="34" height="22" rx="3" fill="${caja}"/><rect x="-24" y="-16" width="30" height="4" rx="2" fill="#fff" opacity="0.35"/>
      ${dosTonos('<rect x="8" y="-14" width="18" height="18" rx="4" fill="FILL"/>', color, '#05061a', { y: 0 })}<rect x="16" y="-11" width="8" height="7" rx="2" fill="#dff3ff"/>
      <circle cx="-16" cy="5" r="5" fill="#15163d"/><circle cx="16" cy="5" r="5" fill="#15163d"/><circle cx="-16" cy="5" r="2" fill="#8f96b8"/><circle cx="16" cy="5" r="2" fill="#8f96b8"/></g>`;
    const rutas = `<g class="nx-lugar" data-l="circulatorio"><rect x="0" y="346" width="${CW}" height="62" fill="transparent"/>
      <rect x="0" y="352" width="${CW}" height="50" fill="#2b2d42"/><rect x="0" y="348" width="${CW}" height="5" fill="#4a4f7a"/><rect x="0" y="401" width="${CW}" height="5" fill="#4a4f7a"/>
      <path d="M0,377 H${CW}" stroke="#ffd166" stroke-width="3" stroke-dasharray="18 14"/>
      ${[[150, '#ff6b6b', '#ffd166', 1, 11, 0], [150, '#ff6b6b', '#ff9f9f', 1, 11, -5.5], [150, '#5b7cfa', '#8f96b8', -1, 13, -3]].map(([, c, caja, dir, dur, beg]) => `<g>${camion(c, caja, dir)}<animateMotion dur="${dur}s" begin="${beg}s" repeatCount="indefinite" path="${dir > 0 ? `M-60,370 H${CW + 60}` : `M${CW + 60},394 H-60`}"/></g>`).join('')}</g>`;
    return `<defs>
        <linearGradient id="nx-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15174a"/><stop offset="0.75" stop-color="#3a3290"/><stop offset="1" stop-color="#6a3f8f"/></linearGradient>
        <radialGradient id="nx-luna" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff3c4" stop-opacity="0.5"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${CW}" height="${CH}" rx="14" fill="url(#nx-cielo)"/>${estrellas(34, CW, 240)}
      <circle cx="690" cy="62" r="46" fill="url(#nx-luna)"/><circle cx="690" cy="62" r="20" fill="#fff3c4"/><circle cx="684" cy="56" r="4" fill="#f0dc9c"/>
      <path d="M0,300 C80,270 160,290 240,276 C330,260 420,290 520,272 C610,258 690,280 760,268 V350 H0 Z" fill="#2a2b72"/>
      ${[[20, 240, 30, 70], [330, 250, 24, 60], [520, 230, 30, 90], [700, 250, 40, 60]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h + 60}" fill="#23246a"/>${[0, 1, 2].map(i => `<rect x="${x + 6}" y="${y + 10 + i * 18}" width="5" height="7" fill="#ffe28a" opacity="0.4"/>`).join('')}`).join('')}
      <rect x="0" y="336" width="${CW}" height="${CH - 336}" fill="#1c3f4f"/><rect x="0" y="406" width="${CW}" height="${CH - 406}" fill="#173543"/>
      ${[[118, 340], [268, 340], [428, 340], [648, 340]].map(([x]) => `<rect x="${x - 10}" y="336" width="20" height="16" fill="#3a3d5c"/>`).join('')}
      ${rutas}${planta}${torres}${casas}${planta2}`;
  }

  function ciudad(cont) {
    ciu = { hechos: {}, sel: null, error: null, etapa: 'unir', casos: [], i: 0, aciertos: 0, resp: null };
    cont.innerHTML = `<div class="nu-grid">
        <div class="panel nu-escena"><div class="nx-scroll"><svg id="nx-csvg" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="Una ciudad que funciona como el cuerpo"><g id="nx-cfijo"></g><g id="nx-cpills"></g></svg></div>
          <p class="nu-ayuda-esc">👆 Tocá cada lugar de la ciudad (A, B, C, D y E) y elegí a qué parte del cuerpo se parece.</p></div>
        <aside class="panel nu-info" id="nx-cinfo"></aside>
      </div>`;
    ciu.cont = cont;
    cont.querySelector('#nx-cfijo').innerHTML = ciudadFija();
    cont.querySelector('#nx-csvg').addEventListener('click', e => {
      const g = e.target.closest('[data-l]');
      if (!g || ciu.etapa !== 'unir') return;
      ciu.sel = g.dataset.l;
      ciu.error = null;
      pintarCiudad();
    });
    pintarCiudad();
  }

  function pintarCiudad() {
    const c = ciu.cont, svg = c.querySelector('#nx-csvg');
    const marcado = ciu.etapa === 'unir' ? ciu.sel : (ciu.resp ? ciu.casos[ciu.i].ok : null);
    svg.classList.toggle('con-sel', !!marcado);
    svg.querySelectorAll('.nx-lugar').forEach(g => g.classList.toggle('sel', g.dataset.l === marcado));
    c.querySelector('#nx-cpills').innerHTML = Object.entries(LUGARES).map(([k, L]) => {
      const [x, y] = L.pill, hecho = ciu.hechos[k], t = hecho ? NOMBRE[k] : '?', w = hecho ? t.length * 7.3 + 38 : 52;
      return `<g class="nx-pill ${hecho ? 'hecho' : ''}${ciu.sel === k && ciu.etapa === 'unir' ? ' activo' : ''}" data-l="${k}">
        <rect x="${x - w / 2}" y="${y - 13}" width="${w}" height="26" rx="13" fill="${hecho ? COL[k][0] : '#12143a'}"/>
        <circle cx="${x - w / 2 + 13}" cy="${y}" r="10" fill="#12143a" stroke="${hecho ? '#12143a' : '#ffd166'}" stroke-width="2"/><text x="${x - w / 2 + 13}" y="${y + 4}" text-anchor="middle" class="nx-letra">${LETRA[k]}</text>
        <text x="${x - w / 2 + 28}" y="${y + 4.5}" class="nx-pill-t">${t}</text></g>`;
    }).join('');
    const info = c.querySelector('#nx-cinfo');
    if (ciu.etapa === 'casos') return pintarCasos(info);
    const n = Object.keys(ciu.hechos).length;
    if (!ciu.sel) {
      info.innerHTML = `<h2>🏙️ El cuerpo es como una ciudad</h2>
        <p>En una ciudad hay lugares que hacen trabajos distintos, pero todos se necesitan. En el cuerpo pasa lo mismo con los sistemas.</p>
        <p class="nu-ayuda">Tocá cada lugar de la ciudad y descubrí a qué sistema se parece.</p>
        <div class="nx-progreso"><div style="width:${n / 5 * 100}%"></div></div><p class="nu-ayuda">${n} de 5 lugares descubiertos</p>
        ${n === 5 ? `<div class="feedback ok"><p class="fb-titulo">🏆 ¡Descubriste toda la ciudad!</p><p>Ahora, a resolver situaciones: ¿qué pasa en el cuerpo cuando algo falla en la ciudad?</p></div><button class="btn primario" id="nx-casos">Seguir: situaciones en la ciudad →</button>` : ''}`;
      info.querySelector('#nx-casos')?.addEventListener('click', empezarCasos);
      return;
    }
    const L = LUGARES[ciu.sel];
    if (ciu.hechos[ciu.sel]) {
      info.innerHTML = `<h2><span class="nx-letra-h">${LETRA[ciu.sel]}</span> ${L.n}</h2><p>${L.desc}</p>
        <div class="feedback ok"><p class="fb-titulo">✅ ${NOMBRE[ciu.sel]}</p><p>${L.expl}</p></div>
        <button class="btn primario" id="nx-seguir">${n === 5 ? 'Terminar' : 'Elegir otro lugar'}</button>`;
      info.querySelector('#nx-seguir').addEventListener('click', () => { ciu.sel = null; pintarCiudad(); });
      return;
    }
    info.innerHTML = `<h2><span class="nx-letra-h">${LETRA[ciu.sel]}</span> ${L.n}</h2><p>${L.desc}</p>
      <p class="nu-pregunta">¿A qué parte del cuerpo se parece?</p>
      <div class="nu-opciones">${Object.keys(NOMBRE).map(k => `<button class="btn-opcion" data-o="${k}">${NOMBRE[k]}</button>`).join('')}</div>
      ${ciu.error ? `<p class="nu-error">✖ ${ciu.error}</p>` : ''}`;
    info.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
      const o = b.dataset.o;
      if (o === ciu.sel) { ciu.hechos[o] = true; ciu.error = null; }
      else ciu.error = `No es ${o === 'celula' ? 'la célula' : NOMBRE[o].toLowerCase()}. Volvé a leer qué hace este lugar y pensá qué sistema hace un trabajo parecido.`;
      pintarCiudad();
    }));
  }

  function empezarCasos() {
    Object.assign(ciu, { etapa: 'casos', casos: Util.tomar('nu-ciudad', CASOS, RONDA, x => x.id), i: 0, aciertos: 0, resp: null, sel: null });
    pintarCiudad();
  }

  function pintarCasos(info) {
    if (ciu.i >= ciu.casos.length) {
      info.innerHTML = `<h2>🏙️ Situaciones en la ciudad</h2>
        <div class="feedback ${ciu.aciertos >= 4 ? 'ok' : 'mal'}"><p class="fb-titulo">${ciu.aciertos >= 4 ? '🏆' : '💪'} ${ciu.aciertos} de ${ciu.casos.length} correctas</p>
        <p>Recordá: el <b>sistema circulatorio</b> es como las rutas de la ciudad. Si se corta, ningún otro lugar puede recibir ni sacar nada.</p></div>
        <button class="btn primario" id="nx-otra">Otra ronda</button> <button class="btn" id="nx-volver">Volver a la ciudad</button>`;
      info.querySelector('#nx-otra').addEventListener('click', empezarCasos);
      info.querySelector('#nx-volver').addEventListener('click', () => { ciu.etapa = 'unir'; ciu.sel = null; pintarCiudad(); });
      return;
    }
    const caso = ciu.casos[ciu.i];
    info.innerHTML = `<h2>🏙️ Situación ${ciu.i + 1} de ${ciu.casos.length}</h2>
      <p class="nx-caso">${caso.t}</p><p class="nu-pregunta">¿A qué parte del cuerpo se parece lo que pasa?</p>
      <div class="nu-opciones">${Object.keys(NOMBRE).map(k => `<button class="btn-opcion${ciu.resp ? (k === caso.ok ? ' correcta' : k === ciu.resp ? ' incorrecta' : '') : ''}" data-o="${k}" ${ciu.resp ? 'disabled' : ''}>${NOMBRE[k]}</button>`).join('')}</div>
      ${ciu.resp ? `<div class="feedback ${ciu.resp === caso.ok ? 'ok' : 'mal'}"><p class="fb-titulo">${ciu.resp === caso.ok ? '✅ ¡Bien!' : `✖ Era: ${NOMBRE[caso.ok]}`}</p><p>${caso.e}</p></div>
        <button class="btn primario" id="nx-sig">${ciu.i + 1 < ciu.casos.length ? 'Siguiente' : 'Ver resultado'}</button>` : ''}`;
    info.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
      ciu.resp = b.dataset.o;
      if (ciu.resp === caso.ok) ciu.aciertos++;
      pintarCiudad();
    }));
    info.querySelector('#nx-sig')?.addEventListener('click', () => { ciu.i++; ciu.resp = null; pintarCiudad(); });
  }

  return { esquema, ciudad };
})();
