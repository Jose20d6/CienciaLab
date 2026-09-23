// Módulo 4: Tabla periódica interactiva + desafío.
const TablaPeriodica = (function () {
  const ESTADOS = {
    solido: { nombre: 'Sólido', color: '#dee2e6' },
    liquido: { nombre: 'Líquido', color: '#74c0fc' },
    gas: { nombre: 'Gas', color: '#ffe066' },
    desconocido: { nombre: 'Desconocido', color: '#f8f9fa' },
  };
  const TIPOS = {
    metal: { nombre: 'Metales', color: '#ffd8a8' },
    metaloide: { nombre: 'Metaloides', color: '#b2f2bb' },
    nometal: { nombre: 'No metales', color: '#a5d8ff' },
  };
  const MODOS = {
    categoria: { nombre: 'Familias', clave: e => e.categoria, leyenda: CATEGORIAS },
    tipo: { nombre: 'Metales y no metales', clave: e => CATEGORIAS[e.categoria].tipo, leyenda: TIPOS },
    estado: { nombre: 'Estado a 25 °C', clave: e => e.estado, leyenda: ESTADOS },
  };
  const SUPER = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const POR_Z = Object.fromEntries(ELEMENTOS.map(e => [e.z, e]));

  // Numeración de grupos: IUPAC (1-18) y la tradicional (A/B), muy usada en los libros de texto.
  const GRUPOS_AB = ['IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 'VIIIB', 'VIIIB', 'VIIIB', 'IB', 'IIB', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA'];

  let raiz, modo = 'categoria', filtro = null, seleccionado = null;
  let linea = null; // grupo o período resaltado: { g: 3 } o { p: 4 }
  let desafio = null; // { preguntas, i, puntos, inicio, esperando }

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🧩 Tabla periódica</h1>
        <p>Toca un elemento para ver su información. Toca el número de un grupo o de un período para resaltarlo, y cambia la forma de colorear para descubrir patrones.</p>
      </div>
      <div class="tp-controles">
        <div class="segmentado" id="tp-modos">
          ${Object.entries(MODOS).map(([k, m]) => `<button data-modo="${k}">${m.nombre}</button>`).join('')}
        </div>
        <button class="btn primario" id="tp-desafio">🎯 Desafío</button>
      </div>
      <div id="tp-barra-desafio" class="barra-desafio" hidden></div>
      <div class="tp-scroll">
        <div class="tp-grid" id="tp-grid">
          <div class="tp-esquina" style="grid-row:1;grid-column:1"><span>Grupo →</span><span>Período ↓</span></div>
          ${GRUPOS_AB.map((ab, i) => `<button class="tp-grupo" data-g="${i + 1}" style="grid-row:1;grid-column:${i + 2}" title="Resaltar el grupo ${i + 1}"><b>${i + 1}</b><small>${ab}</small></button>`).join('')}
          ${[1, 2, 3, 4, 5, 6, 7].map(p => `<button class="tp-periodo" data-p="${p}" style="grid-row:${p + 1};grid-column:1" title="Resaltar el período ${p}">${p}</button>`).join('')}
          <div class="tp-detalle" id="tp-detalle"></div>
          ${ELEMENTOS.map(celda).join('')}
          <div class="tp-celda marcador-f" style="grid-row:7;grid-column:4">57–71</div>
          <div class="tp-celda marcador-f" style="grid-row:8;grid-column:4">89–103</div>
          <div class="tp-serie" style="grid-row:10;grid-column:2 / 4">Lantánidos<small>período 6</small></div>
          <div class="tp-serie" style="grid-row:11;grid-column:2 / 4">Actínidos<small>período 7</small></div>
        </div>
      </div>
      <div class="leyenda" id="tp-leyenda"></div>`;

    raiz.querySelectorAll('#tp-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.modo)));
    raiz.querySelector('#tp-grid').addEventListener('click', e => {
      const c = e.target.closest('.tp-celda[data-z]');
      if (c) return tocar(+c.dataset.z);
      const g = e.target.closest('.tp-grupo'), p = e.target.closest('.tp-periodo');
      if (g) linea = linea && linea.g === +g.dataset.g ? null : { g: +g.dataset.g };
      else if (p) linea = linea && linea.p === +p.dataset.p ? null : { p: +p.dataset.p };
      else return;
      pintar();
    });
    raiz.querySelector('#tp-desafio').addEventListener('click', () => (desafio ? terminarDesafio(true) : empezarDesafio()));
    cambiarModo('categoria');
    mostrarDetalle(null);
  }

  function celda(e) {
    return `
      <button class="tp-celda" data-z="${e.z}" style="grid-row:${e.fila + 1};grid-column:${e.col + 1}" title="${e.nombre}">
        <span class="z">${e.z}</span>
        <span class="sim">${e.simbolo}</span>
        <span class="nom">${e.nombre}</span>
      </button>`;
  }

  function cambiarModo(m) {
    modo = m;
    filtro = null;
    linea = null;
    raiz.querySelectorAll('#tp-modos button').forEach(b => b.classList.toggle('activo', b.dataset.modo === m));
    pintar();
  }

  function pintar() {
    const M = MODOS[modo];
    raiz.querySelectorAll('.tp-celda[data-z]').forEach(c => {
      const e = POR_Z[+c.dataset.z];
      const k = M.clave(e);
      c.style.background = M.leyenda[k].color;
      const fueraDeLinea = linea && (linea.g ? e.grupo !== linea.g : e.periodo !== linea.p);
      c.classList.toggle('atenuado', (filtro !== null && filtro !== k) || !!fueraDeLinea);
      c.classList.toggle('seleccionado', seleccionado === e.z);
    });
    // Encabezados: resalta el grupo y el período del elemento elegido (o la fila/columna resaltada).
    const sel = seleccionado ? POR_Z[seleccionado] : null;
    raiz.querySelectorAll('.tp-grupo').forEach(b => {
      const g = +b.dataset.g;
      b.classList.toggle('activo', (sel && sel.grupo === g) || (linea && linea.g === g));
    });
    raiz.querySelectorAll('.tp-periodo').forEach(b => {
      const p = +b.dataset.p;
      b.classList.toggle('activo', (sel && sel.periodo === p) || (linea && linea.p === p));
    });
    const ley = raiz.querySelector('#tp-leyenda');
    ley.innerHTML = Object.entries(M.leyenda).map(([k, v]) =>
      `<button class="ley-item ${filtro === k ? 'activo' : ''}" data-k="${k}"><span class="muestra" style="background:${v.color}"></span>${v.nombre}</button>`).join('')
      + `<span class="ley-ayuda">Toca una categoría para resaltarla.</span>`;
    ley.querySelectorAll('.ley-item').forEach(b => b.addEventListener('click', () => {
      filtro = filtro === b.dataset.k ? null : b.dataset.k;
      pintar();
    }));
  }

  // ---------- Ficha del elemento ----------

  function configuracion(z) {
    const orden = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
    const cap = { s: 2, p: 6, d: 10, f: 14 };
    const sub = [];
    let resto = z;
    for (const o of orden) {
      if (resto <= 0) break;
      const n = Math.min(cap[o[1]], resto);
      sub.push([o, n]);
      resto -= n;
    }
    // Excepciones más conocidas (semillenado / lleno del subnivel d).
    if (z === 24 || z === 29) {
      sub.find(s => s[0] === '4s')[1] = 1;
      sub.find(s => s[0] === '3d')[1] += 1;
    }
    return sub;
  }

  function textoConfiguracion(sub) {
    return sub.map(([o, n]) => o + String(n).split('').map(d => SUPER[d]).join('')).join(' ');
  }

  function niveles(sub) {
    const porNivel = [];
    sub.forEach(([o, n]) => { const k = +o[0] - 1; porNivel[k] = (porNivel[k] || 0) + n; });
    return porNivel.filter(Boolean);
  }

  function bohr(e, capas) {
    const tam = 150, c = tam / 2;
    let svg = `<svg class="bohr" viewBox="0 0 ${tam} ${tam}" role="img" aria-label="Modelo de Bohr de ${e.nombre}">`;
    capas.forEach((n, i) => {
      const r = 24 + i * 14;
      svg += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".3"/>`;
      for (let j = 0; j < n; j++) {
        const a = (j / n) * Math.PI * 2 - Math.PI / 2;
        svg += `<circle cx="${(c + r * Math.cos(a)).toFixed(1)}" cy="${(c + r * Math.sin(a)).toFixed(1)}" r="3.5" fill="#1c7ed6"/>`;
      }
    });
    svg += `<circle cx="${c}" cy="${c}" r="15" fill="#e8590c"/><text x="${c}" y="${c + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${e.z}p⁺</text></svg>`;
    return svg;
  }

  function mostrarDetalle(e) {
    const det = raiz.querySelector('#tp-detalle');
    if (!e) {
      det.innerHTML = `<div class="tp-detalle-vacio">👆 Toca un elemento para ver su ficha</div>`;
      return;
    }
    const cat = CATEGORIAS[e.categoria];
    const neutrones = Math.round(e.masa) - e.z;
    const sub = e.z <= 36 ? configuracion(e.z) : null;
    const capas = sub ? niveles(sub) : null;
    const principal = e.grupo && (e.grupo <= 2 || e.grupo >= 13);
    const valencia = principal ? (e.z === 2 ? 2 : e.grupo <= 2 ? e.grupo : e.grupo - 10) : null;
    det.innerHTML = `
      <div class="ficha" style="background:${cat.color}">
        <span class="z">${e.z}</span>
        <span class="sim">${e.simbolo}</span>
        <span class="masa">${String(e.masa).replace('.', ',')}</span>
      </div>
      <div class="det-info">
        <h3>${e.nombre}</h3>
        <p class="det-cat">${cat.singular[0].toUpperCase() + cat.singular.slice(1)} · ${ESTADOS[e.estado].nombre}</p>
        <p>${e.grupo ? `Grupo ${e.grupo}` : (e.categoria === 'lantanido' ? 'Serie de los lantánidos' : 'Serie de los actínidos')} · Período ${e.periodo}</p>
        <p>Protones: <b>${e.z}</b> · Electrones: <b>${e.z}</b> · Neutrones: <b>≈ ${neutrones}</b></p>
        ${sub ? `<p>Configuración: <b>${textoConfiguracion(sub)}</b></p>` : ''}
        ${capas ? `<p>Electrones por nivel: <b>${capas.join(' – ')}</b>${valencia ? ` · De valencia: <b>${valencia}</b>` : ''}</p>` : ''}
        ${e.uso ? `<p class="uso">💡 ${e.uso}</p>` : ''}
      </div>
      ${capas && e.z <= 20 ? bohr(e, capas) : ''}`;
  }

  // ---------- Desafío ----------

  const COMUNES = [...Array(38).keys()].map(i => i + 1).concat([47, 50, 53, 54, 55, 56, 78, 79, 80, 82, 86, 92]);
  const GRUPOS_PRINCIPALES = [1, 2, 13, 14, 15, 16, 17, 18];
  const FAMILIAS = ['alcalino', 'alcalinoterreo', 'halogeno', 'noble', 'metaloide', 'transicion'];

  const GENERADORES = [
    () => { const e = POR_Z[Util.elegir(COMUNES)]; return { texto: `Toca el elemento <b>${e.nombre}</b>`, ok: z => z === e.z }; },
    () => { const e = POR_Z[Util.elegir(COMUNES)]; return { texto: `Toca el elemento de símbolo <b>${e.simbolo}</b> y descubre su nombre`, ok: z => z === e.z }; },
    () => { const e = POR_Z[Util.elegir(COMUNES)]; return { texto: `Toca el elemento de número atómico <b>${e.z}</b>`, ok: z => z === e.z }; },
    () => {
      const g = Util.elegir(GRUPOS_PRINCIPALES), p = 2 + Math.floor(Math.random() * 4);
      const e = ELEMENTOS.find(x => x.grupo === g && x.periodo === p);
      return { texto: `Toca el elemento del <b>grupo ${g}</b> y el <b>período ${p}</b>`, ok: z => z === e.z };
    },
    () => {
      const f = Util.elegir(FAMILIAS);
      return { texto: `Toca cualquier <b>${CATEGORIAS[f].singular}</b>`, ok: z => POR_Z[z].categoria === f, familia: f };
    },
    () => {
      const est = Util.elegir(['gas', 'liquido']);
      return { texto: `Toca un elemento que sea <b>${est === 'gas' ? 'gaseoso' : 'líquido'}</b> a temperatura ambiente`, ok: z => POR_Z[z].estado === est };
    },
  ];
  const TOTAL = 10;

  function empezarDesafio() {
    desafio = { preguntas: Array.from({ length: TOTAL }, () => Util.elegir(GENERADORES)()), i: 0, puntos: 0, inicio: Date.now(), esperando: false };
    seleccionado = null;
    filtro = null;
    linea = null;
    raiz.querySelector('#tp-grid').classList.add('modo-desafio');
    raiz.querySelector('#tp-desafio').textContent = '✕ Salir del desafío';
    raiz.querySelector('#tp-barra-desafio').hidden = false;
    raiz.querySelector('#tp-detalle').innerHTML = `<div class="tp-detalle-vacio">🎯 En el desafío los nombres están ocultos.<br>¡Guíate por los símbolos y la posición!</div>`;
    pintar();
    mostrarPregunta();
  }

  function mostrarPregunta() {
    const q = desafio.preguntas[desafio.i];
    raiz.querySelector('#tp-barra-desafio').innerHTML = `
      <span class="bd-num">${desafio.i + 1}/${TOTAL}</span>
      <span class="bd-texto">${q.texto}</span>
      <span class="bd-puntos">⭐ ${desafio.puntos}</span>`;
  }

  function tocar(z) {
    if (!desafio) {
      seleccionado = z;
      mostrarDetalle(POR_Z[z]);
      pintar();
      return;
    }
    if (desafio.esperando) return;
    desafio.esperando = true;
    const q = desafio.preguntas[desafio.i];
    const ok = q.ok(z);
    if (ok) desafio.puntos++;
    const celdaTocada = raiz.querySelector(`.tp-celda[data-z="${z}"]`);
    celdaTocada.classList.add(ok ? 'acierto' : 'error');
    let correctas = [];
    if (!ok) {
      correctas = ELEMENTOS.filter(e => q.ok(e.z)).map(e => raiz.querySelector(`.tp-celda[data-z="${e.z}"]`));
      correctas.forEach(c => c.classList.add('correcta'));
    }
    const barra = raiz.querySelector('#tp-barra-desafio');
    barra.querySelector('.bd-puntos').textContent = `⭐ ${desafio.puntos}`;
    barra.querySelector('.bd-texto').innerHTML += ok
      ? ` <span class="bd-fb ok">¡Sí! Es ${POR_Z[z].nombre}.</span>`
      : ` <span class="bd-fb mal">No, ese es ${POR_Z[z].nombre}.</span>`;
    setTimeout(() => {
      celdaTocada.classList.remove('acierto', 'error');
      correctas.forEach(c => c.classList.remove('correcta'));
      if (!desafio) return;
      desafio.esperando = false;
      desafio.i++;
      if (desafio.i < TOTAL) mostrarPregunta(); else terminarDesafio(false);
    }, ok ? 1100 : 2200);
  }

  function terminarDesafio(cancelado) {
    const d = desafio;
    desafio = null;
    raiz.querySelector('#tp-grid').classList.remove('modo-desafio');
    raiz.querySelector('#tp-desafio').textContent = '🎯 Desafío';
    const barra = raiz.querySelector('#tp-barra-desafio');
    if (cancelado) {
      barra.hidden = true;
    } else {
      const seg = Math.round((Date.now() - d.inicio) / 1000);
      const record = Util.leer('tp-record', null);
      const nuevo = !record || d.puntos > record.puntos || (d.puntos === record.puntos && seg < record.seg);
      if (nuevo) Util.guardar('tp-record', { puntos: d.puntos, seg });
      barra.innerHTML = `
        <span class="bd-texto">🏁 Terminaste: <b>${d.puntos} / ${TOTAL}</b> en ${seg} s.
        ${nuevo ? '🏆 ¡Nuevo récord en este dispositivo!' : `Récord: ${record.puntos}/${TOTAL} en ${record.seg} s.`}</span>
        <button class="btn primario chico" id="tp-otra">Jugar otra vez</button>`;
      barra.querySelector('#tp-otra').addEventListener('click', empezarDesafio);
    }
    mostrarDetalle(null);
    pintar();
  }

  return { iniciar };
})();
