// Física · Electricidad: armar circuitos (serie y paralelo), desafíos y conductores/aislantes.
const Electricidad = (function () {
  const { dosTonos, ojo, esfera, estrellas, tono } = Arte;
  const W = 760, H = 440;
  // Tablero: 8 nodos (2 filas × 4 columnas) y 10 lugares (aristas) donde se ponen componentes.
  const NX = [140, 313, 486, 660], NY = [110, 330];
  const NODOS = [0, 1].flatMap(f => NX.map(x => [x, NY[f]]));
  const LUGARES = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const V_PILA = 1.5, R_PILA = 0.05, R_CABLE = 0.01, R_LAMP = 10, R_TIMBRE = 10;
  const P0 = (V_PILA / (R_LAMP + R_PILA)) ** 2 * R_LAMP; // potencia de una lamparita con una pila
  const HERR = [
    { id: 'mano', n: 'Tocar', e: '👆', d: 'Abre o cierra interruptores y da vuelta las pilas.' },
    { id: 'cable', n: 'Cable', e: '〰️' }, { id: 'lampara', n: 'Lamparita', e: '💡' }, { id: 'interruptor', n: 'Interruptor', e: '🔘' },
    { id: 'pila', n: 'Pila', e: '🔋' }, { id: 'timbre', n: 'Timbre', e: '🔔' }, { id: 'borrar', n: 'Borrar', e: '🧽' },
  ];

  // ---------- Resolución del circuito (análisis nodal) ----------
  // Cada pila es una fuente con una pequeña resistencia interna (equivalente de Norton).
  function resolver(comp) {
    const n = NODOS.length, Gm = Array.from({ length: n }, () => new Array(n).fill(0)), I = new Array(n).fill(0);
    const con = (a, b, g) => { Gm[a][a] += g; Gm[b][b] += g; Gm[a][b] -= g; Gm[b][a] -= g; };
    comp.forEach((c, k) => {
      if (!c) return;
      const [a, b] = LUGARES[k];
      if (c.t === 'cable') con(a, b, 1 / R_CABLE);
      else if (c.t === 'lampara') con(a, b, 1 / R_LAMP);
      else if (c.t === 'timbre') con(a, b, 1 / R_TIMBRE);
      else if (c.t === 'interruptor' && c.on) con(a, b, 1 / R_CABLE);
      else if (c.t === 'pila') {
        const [neg, pos] = c.inv ? [b, a] : [a, b];
        con(a, b, 1 / R_PILA); I[pos] += V_PILA / R_PILA; I[neg] -= V_PILA / R_PILA;
      }
    });
    for (let i = 0; i < n; i++) Gm[i][i] += 1e-9; // nodos sueltos
    Gm[0] = Gm[0].map((_, j) => (j === 0 ? 1 : 0)); I[0] = 0; // nodo 0 como referencia
    // Eliminación de Gauss.
    const M = Gm.map((r, i) => [...r, I[i]]);
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
    }
    const V = M.map((r, i) => r[n] / r[i]);
    // Corriente convencional de a hacia b en cada lugar.
    const corr = comp.map((c, k) => {
      if (!c) return 0;
      const [a, b] = LUGARES[k], dv = V[a] - V[b];
      if (c.t === 'cable' || (c.t === 'interruptor' && c.on)) return dv / R_CABLE;
      if (c.t === 'lampara') return dv / R_LAMP;
      if (c.t === 'timbre') return dv / R_TIMBRE;
      if (c.t === 'pila') return dv / R_PILA + (c.inv ? -1 : 1) * V_PILA / R_PILA;
      return 0;
    });
    const brillo = comp.map((c, k) => c && (c.t === 'lampara' || c.t === 'timbre') ? corr[k] ** 2 * R_LAMP / P0 : 0);
    const corto = comp.some((c, k) => c && c.t === 'pila' && Math.abs(corr[k]) > 2);
    return { corr: corr.map(x => (Math.abs(x) < 1e-6 ? 0 : x)), brillo, corto };
  }

  // ---------- Dibujo ----------
  function componente(c, k, r) {
    const [a, b] = LUGARES[k], [x1, y1] = NODOS[a], [x2, y2] = NODOS[b];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, vert = x1 === x2, rot = vert ? 90 : 0;
    const L = vert ? y2 - y1 : x2 - x1;
    const vivo = Math.abs(r.corr[k]) > 1e-3;
    const cable = (l, col = vivo ? '#ffb86b' : '#b8bfdc') => `<path d="M${-L / 2},0 H${-l} M${l},0 H${L / 2}" stroke="#05061a" stroke-width="10" stroke-linecap="round" opacity="0.3"/><path d="M${-L / 2},0 H${-l} M${l},0 H${L / 2}" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`;
    let s = '';
    if (!c) s = `<path d="M${-L / 2 + 14},0 H${L / 2 - 14}" stroke="#3a3e85" stroke-width="3" stroke-dasharray="6 7"/><circle r="15" fill="#1f2256" stroke="#3a3e85" stroke-width="2" stroke-dasharray="4 3"/><text y="5" text-anchor="middle" class="el-mas">+</text>`;
    else if (c.t === 'cable') s = cable(0);
    else if (c.t === 'lampara') {
      const b2 = Math.min(1.6, r.brillo[k]);
      s = cable(20) + `<g transform="rotate(${-rot})">
        ${b2 > 0.02 ? `<circle r="${30 + b2 * 30}" fill="url(#el-luz)" opacity="${Math.min(1, 0.3 + b2 * 0.6)}"/>` : ''}
        ${dosTonos('<rect x="-11" y="4" width="22" height="16" rx="3" fill="FILL"/>', '#adb5bd', '#868e96', { x: 3 })}
        ${[8, 12, 16].map(y => `<path d="M-11,${y} H11" stroke="#6c757d" stroke-width="1.5"/>`).join('')}
        <circle cy="-10" r="20" fill="${b2 > 0.02 ? tono('#ffe066', -0.1 + Math.min(0.9, b2) * 0.4) : '#e9ecef'}" opacity="${b2 > 0.02 ? 1 : 0.55}" stroke="#fff" stroke-width="2"/>
        <path d="M-6,4 L-4,-12 L0,-6 L4,-12 L6,4" stroke="${b2 > 0.02 ? '#e8590c' : '#868e96'}" stroke-width="2" fill="none"/>
        <ellipse cx="-8" cy="-18" rx="5" ry="3" fill="#fff" opacity="0.7" transform="rotate(-35 -8 -18)"/>
        ${ojo(-6, -11, 3)}${ojo(6, -11, 3)}<path d="M-4,-3 ${b2 > 0.02 ? 'q4,4 8,0' : 'h8'}" stroke="#15163d" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
    } else if (c.t === 'interruptor') {
      s = cable(22) + `<circle cx="-22" r="6" fill="#ffd166"/><circle cx="22" r="6" fill="#ffd166"/>
        <path d="M-22,0 L${c.on ? '22,0' : '14,-24'}" stroke="#e9ebff" stroke-width="6" stroke-linecap="round"/>
        <circle cx="-22" r="3" fill="#15163d"/>`;
    } else if (c.t === 'pila') {
      const inv = c.inv ? -1 : 1;
      s = cable(34) + `<g transform="scale(${inv} 1)">
        ${dosTonos('<rect x="-34" y="-15" width="62" height="30" rx="7" fill="FILL"/>', '#51cf66', '#2f9e44', { y: 3 })}
        <rect x="-34" y="-15" width="20" height="30" rx="7" fill="#343a40"/><rect x="28" y="-7" width="7" height="14" rx="2" fill="#adb5bd"/>
        <rect x="-26" y="-11" width="48" height="4" rx="2" fill="#fff" opacity="0.35"/></g>
        <g transform="rotate(${-rot})">${[['+', 1], ['−', -1]].map(([t, k]) => vert
          ? `<text x="-30" y="${22 * inv * k + 6}" text-anchor="middle" class="el-polo">${t}</text>`
          : `<text x="${22 * inv * k}" y="-22" text-anchor="middle" class="el-polo">${t}</text>`).join('')}
        ${r.corto ? `<text y="42" text-anchor="middle" font-size="18">🔥</text>` : ''}</g>`;
    } else if (c.t === 'timbre') {
      const suena = r.brillo[k] > 0.05;
      s = cable(20) + `<g transform="rotate(${-rot})"><g class="${suena ? 'el-suena' : ''}">${dosTonos('<path d="M-18,8 C-18,-20 18,-20 18,8 L22,14 H-22 Z" fill="FILL"/>', '#ffd43b', '#f0b400', { x: 3 })}<circle cy="18" r="4" fill="#f0b400"/></g>
        ${suena ? '<path d="M-28,-14 q-6,8 0,16 M28,-14 q6,8 0,16 M-34,-20 q-9,14 0,28 M34,-20 q9,14 0,28" stroke="#ffe066" stroke-width="2.5" fill="none" stroke-linecap="round"/>' : ''}</g>`;
    }
    return `<g class="el-lugar" data-k="${k}" transform="translate(${mx} ${my}) rotate(${rot})"><rect x="${-L / 2 + 16}" y="-30" width="${L - 32}" height="60" fill="transparent"/>${s}</g>`;
  }

  function tablero(comp, r) {
    return `<defs>
        <radialGradient id="el-fondo" cx="0.5" cy="0.4" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="el-luz" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe066" stop-opacity="0.9"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#el-fondo)"/>${estrellas(26, W, H)}
      <rect x="84" y="56" width="632" height="330" rx="20" fill="#2d3276"/><rect x="84" y="56" width="632" height="330" rx="20" fill="none" stroke="#3f4596" stroke-width="3"/>
      ${Array.from({ length: 11 }, (_, i) => Array.from({ length: 6 }, (_, j) => `<circle cx="${110 + i * 58}" cy="${80 + j * 57}" r="2" fill="#3f4596"/>`).join('')).join('')}
      ${comp.map((c, k) => componente(c, k, r)).join('')}
      ${NODOS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#ffd166"/><circle cx="${x - 2}" cy="${y - 2}" r="3" fill="#fff" opacity="0.6"/>`).join('')}
      ${r.corto ? `<g transform="translate(${W / 2} 36)"><rect x="-150" y="-16" width="300" height="30" rx="15" fill="#ff6b6b"/><text y="5" text-anchor="middle" class="el-alerta">⚠️ ¡Cortocircuito! La pila se calienta</text></g>` : ''}`;
  }

  // Electrones: puntitos que viajan en sentido contrario a la corriente convencional.
  function electrones(comp, r, t) {
    let s = '';
    comp.forEach((c, k) => {
      const i = r.corr[k];
      if (!c || Math.abs(i) < 1e-3) return;
      const [a, b] = LUGARES[k], [x1, y1] = NODOS[a], [x2, y2] = NODOS[b];
      const vel = Math.min(1.2, Math.abs(i) / 0.15) * 0.45 * (r.corto ? 3 : 1), dir = i > 0 ? -1 : 1;
      for (let j = 0; j < 5; j++) {
        let u = ((t * vel + j / 5) % 1);
        if (dir < 0) u = 1 - u;
        s += `<circle cx="${x1 + (x2 - x1) * u}" cy="${y1 + (y2 - y1) * u}" r="4" fill="#74c0fc" stroke="#e7f5ff" stroke-width="1.2"/>`;
      }
    });
    return s;
  }

  // ---------- Estado ----------
  let raiz, modo = 'armar', herr = 'mano', comp = [], res = null, bucleId = null;
  const INICIAL = () => {
    const c = new Array(10).fill(null);
    c[0] = { t: 'cable' }; c[1] = { t: 'lampara' }; c[2] = { t: 'cable' };
    c[3] = { t: 'pila' }; c[4] = { t: 'interruptor', on: false }; c[5] = { t: 'cable' };
    c[6] = { t: 'cable' }; c[9] = { t: 'cable' };
    c[3].inv = true;
    return c;
  };

  const MISIONES = [
    { id: 'prender', n: 'Encendé la lamparita', d: 'Cerrá el interruptor tocándolo con 👆.', ok: (c, r) => lamparasPrendidas(c, r) >= 1 },
    { id: 'dos-serie', n: 'Dos lamparitas en serie', d: 'Con una pila, poné dos lamparitas una detrás de la otra, en el mismo camino. ¿Brillan más o menos?', ok: (c, r) => serie(c, r) },
    { id: 'dos-paralelo', n: 'Dos lamparitas en paralelo', d: 'Con una pila, poné dos lamparitas en caminos distintos (ramas). Tienen que brillar igual que una sola.', ok: (c, r) => paralelo(c, r) },
    { id: 'brillar', n: 'Que brille el doble… ¡o más!', d: 'Usá dos pilas en serie (una detrás de la otra, con + y − alineados).', ok: (c, r) => r.brillo.some(b => b > 3) && !r.corto },
    { id: 'uno-solo', n: 'Un interruptor para una sola lamparita', d: 'Armá dos lamparitas en paralelo y un interruptor que apague solo una.', ok: (c, r) => interruptorSolo(c) },
    { id: 'timbre', n: 'Un timbre con botón', d: 'Armá un circuito donde el timbre suene solo cuando el interruptor está cerrado.', ok: (c, r) => timbreConBoton(c) },
    { id: 'corto', n: 'Descubrí un cortocircuito', d: 'Uní los dos polos de una pila con un cable, sin lamparita. ¡Mirá qué pasa! (En la vida real, no lo hagas).', ok: (c, r) => r.corto },
  ];
  const lamparasPrendidas = (c, r) => c.filter((x, k) => x && x.t === 'lampara' && r.brillo[k] > 0.05).length;
  const pilas = c => c.filter(x => x && x.t === 'pila').length;
  const corrLamp = (c, r) => c.map((x, k) => (x && x.t === 'lampara' && r.brillo[k] > 0.05 ? Math.abs(r.corr[k]) : null)).filter(x => x !== null);
  const corrPila = (c, r) => Math.abs(r.corr[c.findIndex(x => x && x.t === 'pila')]);
  function serie(c, r) {
    if (pilas(c) !== 1 || r.corto) return false;
    const l = corrLamp(c, r);
    return l.length === 2 && Math.abs(l[0] - l[1]) < 1e-3 && Math.abs(corrPila(c, r) - l[0]) < 1e-3;
  }
  function paralelo(c, r) {
    if (pilas(c) !== 1 || r.corto) return false;
    const l = corrLamp(c, r);
    return l.length === 2 && Math.abs(l[0] - l[1]) < 2e-3 && Math.abs(corrPila(c, r) - l[0] - l[1]) < 2e-3 && r.brillo.filter(b => b > 0.8).length === 2;
  }
  function interruptorSolo(c) {
    const ks = c.map((x, k) => (x && x.t === 'interruptor' ? k : -1)).filter(k => k >= 0);
    return ks.some(k => {
      const on = c.map((x, j) => (j === k ? { ...x, on: true } : x)), off = c.map((x, j) => (j === k ? { ...x, on: false } : x));
      const r1 = resolver(on), r0 = resolver(off);
      return !r1.corto && !r0.corto && lamparasPrendidas(on, r1) === 2 && lamparasPrendidas(off, r0) === 1;
    });
  }
  function timbreConBoton(c) {
    const kt = c.findIndex(x => x && x.t === 'timbre');
    if (kt < 0) return false;
    return c.some((x, k) => {
      if (!x || x.t !== 'interruptor') return false;
      const on = c.map((y, j) => (j === k ? { ...y, on: true } : y)), off = c.map((y, j) => (j === k ? { ...y, on: false } : y));
      const r1 = resolver(on), r0 = resolver(off);
      return !r1.corto && r1.brillo[kt] > 0.05 && r0.brillo[kt] < 0.01;
    });
  }
  let hechas = new Set();

  function iniciar(el) {
    raiz = el;
    hechas = new Set(Util.leer('el-misiones', []));
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>⚡ Electricidad: circuitos</h1>
        <p>Para que circule corriente eléctrica hace falta un <b>circuito cerrado</b>: una <b>pila</b> (la fuente), <b>cables</b> (conductores) y algo que use la energía, como una <b>lamparita</b>.</p>
      </div>
      <div class="segmentado" id="el-modos">
        <button data-m="armar">🔧 Armar circuitos</button>
        <button data-m="conduce">🧪 ¿Conduce o no?</button>
      </div>
      <div class="nu-grid">
        <div class="panel nu-escena"><div class="nx-scroll"><svg id="el-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tablero para armar circuitos"><g id="el-fijo"></g><g id="el-e"></g></svg></div>
          <div id="el-controles"></div></div>
        <aside class="panel nu-info" id="el-info"></aside>
      </div>`;
    raiz.querySelectorAll('#el-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    raiz.querySelector('#el-svg').addEventListener('click', e => {
      if (modo === 'armar') { const g = e.target.closest('[data-k]'); if (g) tocar(+g.dataset.k); }
    });
    cambiarModo('armar');
    const loop = t => { if (!raiz.hidden) animar(t / 1000); bucleId = requestAnimationFrame(loop); };
    bucleId = requestAnimationFrame(loop);
  }

  function cambiarModo(m) {
    modo = m;
    raiz.querySelectorAll('#el-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    if (m === 'armar') vistaArmar(); else vistaConduce();
  }

  // ---------- 1. Armar circuitos ----------
  function vistaArmar() {
    if (!comp.length) comp = INICIAL();
    raiz.querySelector('#el-controles').innerHTML = `<div class="el-herr">${HERR.map(h => `<button data-h="${h.id}" title="${h.d || h.n}"><span>${h.e}</span>${h.n}</button>`).join('')}</div>
      <div class="nv-botones"><button class="btn" id="el-vaciar">🗑️ Vaciar tablero</button><button class="btn" id="el-ejemplo">↺ Circuito de ejemplo</button></div>`;
    const c = raiz.querySelector('#el-controles');
    c.querySelectorAll('[data-h]').forEach(b => b.addEventListener('click', () => { herr = b.dataset.h; pintarHerr(); }));
    c.querySelector('#el-vaciar').addEventListener('click', () => { comp = new Array(10).fill(null); actualizar(); });
    c.querySelector('#el-ejemplo').addEventListener('click', () => { comp = INICIAL(); actualizar(); });
    pintarHerr();
    actualizar();
  }

  function pintarHerr() {
    raiz.querySelectorAll('.el-herr button').forEach(b => b.classList.toggle('activo', b.dataset.h === herr));
  }

  function tocar(k) {
    const c = comp[k];
    if (herr === 'mano') {
      if (c && c.t === 'interruptor') c.on = !c.on;
      else if (c && c.t === 'pila') c.inv = !c.inv;
      else return;
    } else if (herr === 'borrar') comp[k] = null;
    else comp[k] = herr === 'interruptor' ? { t: herr, on: false } : { t: herr };
    actualizar();
  }

  function actualizar() {
    res = resolver(comp);
    raiz.querySelector('#el-fijo').innerHTML = tablero(comp, res);
    MISIONES.forEach(m => { if (!hechas.has(m.id) && m.ok(comp, res)) { hechas.add(m.id); m.recien = true; } });
    Util.guardar('el-misiones', [...hechas]);
    pintarInfo();
  }

  function pintarInfo() {
    const n = lamparasPrendidas(comp, res), p = pilas(comp);
    let estado;
    if (res.corto) estado = '<p class="nu-error">⚠️ <b>Cortocircuito:</b> la corriente vuelve a la pila por un camino sin resistencia. La pila se calienta y se gasta muy rápido. ¡Es peligroso!</p>';
    else if (!p) estado = '<p class="nv-clave">🔋 Falta la <b>pila</b>: sin fuente no hay corriente.</p>';
    else if (res.corr.every(x => x === 0)) estado = '<p class="nv-clave">🔌 El circuito está <b>abierto</b>: hay un corte en el camino (un interruptor abierto o un lugar vacío). La corriente no circula.</p>';
    else estado = `<p class="nv-clave">✅ Circuito <b>cerrado</b>: circula corriente${n ? ` y ${n === 1 ? 'la lamparita se enciende' : `${n} lamparitas se encienden`}` : ''}.</p>`;
    const listo = MISIONES.filter(m => hechas.has(m.id)).length;
    raiz.querySelector('#el-info').innerHTML = `<h2>🔧 Armar circuitos</h2>
      <p class="nu-ayuda">Elegí un componente abajo y tocá un lugar del tablero para ponerlo. Con 👆 abrís y cerrás interruptores o das vuelta una pila.</p>
      ${estado}
      <p class="nu-ayuda">🔵 Los puntitos celestes son <b>electrones</b>: salen del polo <b>−</b> de la pila y vuelven por el polo <b>+</b>.</p>
      <h3>🎯 Desafíos (${listo} de ${MISIONES.length})</h3>
      <ul class="el-misiones">${MISIONES.map(m => `<li class="${hechas.has(m.id) ? 'hecha' : ''} ${m.recien ? 'recien' : ''}"><b>${hechas.has(m.id) ? '✅' : '⬜'} ${m.n}</b><span>${m.d}</span></li>`).join('')}</ul>
      <details class="md-ayudas"><summary>📚 Serie y paralelo</summary>
        <p><b>En serie:</b> los componentes están en un único camino. Si una lamparita se quema, se apagan todas. Con una pila, cada una brilla menos.</p>
        <p><b>En paralelo:</b> cada lamparita está en su propia rama. Si una se apaga, las otras siguen encendidas y brillan igual que una sola. Así están conectadas las luces de tu casa.</p></details>`;
    MISIONES.forEach(m => { delete m.recien; });
  }

  function animar(t) {
    const g = raiz.querySelector('#el-e');
    if (!g) return;
    if (modo === 'armar' && res) g.innerHTML = electrones(comp, res, t);
    else if (modo === 'conduce' && cond && cond.probado) g.innerHTML = cond.conduce ? electronesPrueba(t) : '';
    else g.innerHTML = '';
  }

  // ---------- 2. ¿Conduce o no? ----------
  const OBJETOS = [
    { id: 'clavo', n: 'Clavo de hierro', e: '🔩', si: true, x: 'Los metales, como el hierro, son buenos <b>conductores</b>: tienen electrones que se mueven con facilidad.' },
    { id: 'moneda', n: 'Moneda', e: '🪙', si: true, x: 'Las monedas son de metal: <b>conducen</b> la corriente.' },
    { id: 'cuchara', n: 'Cuchara de metal', e: '🥄', si: true, x: 'El acero de la cuchara es un metal: <b>conduce</b>.' },
    { id: 'aluminio', n: 'Papel de aluminio', e: '🌯', si: true, x: 'Aunque es finito, el aluminio es un metal: <b>conduce</b>.' },
    { id: 'grafito', n: 'Mina de lápiz (grafito)', e: '✏️', si: true, x: '¡Sorpresa! El grafito no es un metal, pero <b>conduce</b> (un poco menos que un cable).' },
    { id: 'salada', n: 'Agua con sal', e: '🧂', si: true, x: 'La sal disuelta forma iones que se mueven: el agua salada <b>conduce</b>. Por eso es peligroso usar aparatos eléctricos con las manos mojadas.' },
    { id: 'goma', n: 'Goma de borrar', e: '🩹', si: false, x: 'La goma es un <b>aislante</b>: no deja pasar la corriente. Por eso se usa para cubrir cables.' },
    { id: 'plastico', n: 'Regla de plástico', e: '📏', si: false, x: 'El plástico es <b>aislante</b>. Los cables tienen metal adentro y plástico afuera.' },
    { id: 'madera', n: 'Palito de madera', e: '🪵', si: false, x: 'La madera seca es <b>aislante</b>.' },
    { id: 'vidrio', n: 'Vaso de vidrio', e: '🥛', si: false, x: 'El vidrio es un muy buen <b>aislante</b>.' },
    { id: 'papel', n: 'Hoja de papel', e: '📄', si: false, x: 'El papel es <b>aislante</b>: la lamparita queda apagada.' },
    { id: 'tela', n: 'Pedazo de tela', e: '🧣', si: false, x: 'La tela seca es <b>aislante</b>.' },
  ];
  let cond = null;

  function vistaConduce() {
    raiz.querySelector('#el-controles').innerHTML = '';
    cond = { lista: Util.tomar('el-conduce', OBJETOS, 6, o => o.id), i: 0, aciertos: 0, pred: null, probado: false };
    pintarConduce();
  }

  // Circuito de prueba: pila, lamparita y dos pinzas con un hueco donde va el objeto.
  function escenaPrueba() {
    const o = cond.lista[cond.i], luz = cond.probado && cond.conduce;
    const r = { corr: [], brillo: [], corto: false };
    const lamp = `<g transform="translate(380 110)">
      ${luz ? '<circle r="60" fill="url(#el-luz)"/>' : ''}
      ${dosTonos('<rect x="-14" y="6" width="28" height="22" rx="4" fill="FILL"/>', '#adb5bd', '#868e96', { x: 4 })}
      <circle cy="-14" r="28" fill="${luz ? '#ffe066' : '#e9ecef'}" opacity="${luz ? 1 : 0.55}" stroke="#fff" stroke-width="2"/>
      <path d="M-8,6 L-5,-16 L0,-8 L5,-16 L8,6" stroke="${luz ? '#e8590c' : '#868e96'}" stroke-width="2.5" fill="none"/>
      ${ojo(-8, -16, 4)}${ojo(8, -16, 4)}<path d="M-5,-5 ${luz ? 'q5,5 10,0' : 'h10'}" stroke="#15163d" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
    const cablePath = 'M160,330 V110 H352 M408,110 H600 V250 M160,330 H300 M460,330 H600 V250';
    return `<defs>
        <radialGradient id="el-fondo" cx="0.5" cy="0.4" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="el-luz" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe066" stop-opacity="0.9"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#el-fondo)"/>${estrellas(26, W, H)}
      <path d="${cablePath}" stroke="#05061a" stroke-width="12" fill="none" opacity="0.3" stroke-linejoin="round"/>
      <path d="${cablePath}" stroke="${luz ? '#ffb86b' : '#b8bfdc'}" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <g transform="translate(600 250) rotate(90)">${dosTonos('<rect x="-40" y="-18" width="80" height="36" rx="8" fill="FILL"/>', '#51cf66', '#2f9e44', { y: 4 })}<rect x="-40" y="-18" width="24" height="36" rx="8" fill="#343a40"/><rect x="40" y="-8" width="8" height="16" rx="2" fill="#adb5bd"/></g>
      ${lamp}
      ${[300, 460].map((x, i) => `<g transform="translate(${x} 330) scale(${i ? -1 : 1} 1)"><path d="M0,-10 L34,-4 L34,4 L0,10 Z" fill="#e03131"/><path d="M26,-6 l14,-4 M26,6 l14,4" stroke="#adb5bd" stroke-width="3" stroke-linecap="round"/></g>`).join('')}
      ${cond.probado || cond.pred !== null ? `<g transform="translate(380 330)"><circle r="44" fill="#fff" opacity="0.08"/><text y="16" text-anchor="middle" font-size="48">${o.e}</text></g>` : `<g transform="translate(380 330)"><circle r="40" fill="none" stroke="#ffd166" stroke-width="2.5" stroke-dasharray="6 5"/><text y="8" text-anchor="middle" class="el-mas">?</text></g>`}
      <text x="380" y="410" text-anchor="middle" class="nu-rotulo">${o.n.toUpperCase()}</text>`;
  }
  function electronesPrueba(t) {
    const pts = [[160, 330], [160, 110], [352, 110], [408, 110], [600, 110], [600, 250], [600, 330], [460, 330], [300, 330], [160, 330]];
    const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = lens.reduce((a, b) => a + b, 0);
    let s = '';
    for (let j = 0; j < 16; j++) {
      let d = ((t * 0.12 + j / 16) % 1) * tot, i = 0;
      while (d > lens[i]) { d -= lens[i]; i++; }
      const f = d / lens[i], [a, b] = [pts[i], pts[i + 1]];
      s += `<circle cx="${a[0] + (b[0] - a[0]) * f}" cy="${a[1] + (b[1] - a[1]) * f}" r="4" fill="#74c0fc" stroke="#e7f5ff" stroke-width="1.2"/>`;
    }
    return s;
  }

  function pintarConduce() {
    const info = raiz.querySelector('#el-info');
    if (cond.i >= cond.lista.length) {
      raiz.querySelector('#el-fijo').innerHTML = '';
      raiz.querySelector('#el-e').innerHTML = '';
      info.innerHTML = `<h2>🧪 Resultado</h2><div class="feedback ${cond.aciertos >= 5 ? 'ok' : 'mal'}"><p class="fb-titulo">${cond.aciertos >= 5 ? '🏆' : '💪'} ${cond.aciertos} de ${cond.lista.length} predicciones correctas</p>
        <p><b>Conductores:</b> dejan pasar la corriente (los metales, el grafito, el agua salada). <b>Aislantes:</b> no la dejan pasar (plástico, goma, madera, vidrio).</p></div>
        <button class="btn primario" id="el-otra">Probar otros objetos</button>`;
      info.querySelector('#el-otra').addEventListener('click', vistaConduce);
      raiz.querySelector('#el-fijo').innerHTML = `<rect width="${W}" height="${H}" rx="14" fill="#12143a"/><text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-size="80">💡</text>`;
      return;
    }
    const o = cond.lista[cond.i];
    cond.conduce = o.si;
    raiz.querySelector('#el-fijo').innerHTML = escenaPrueba();
    info.innerHTML = `<div class="md-cab"><span>Objeto ${cond.i + 1} de ${cond.lista.length}</span><span>⭐ ${cond.aciertos}</span></div>
      <div class="barra"><div style="width:${cond.i / cond.lista.length * 100}%"></div></div>
      <h2>${o.e} ${o.n}</h2>
      <p>Ponemos el objeto entre las dos pinzas. <b>¿Se va a encender la lamparita?</b></p>
      <div class="nu-opciones">
        <button class="btn-opcion ${cond.probado ? (o.si ? 'correcta' : cond.pred === true ? 'incorrecta' : '') : ''}" data-p="1" ${cond.probado ? 'disabled' : ''}>💡 Sí, conduce la corriente</button>
        <button class="btn-opcion ${cond.probado ? (!o.si ? 'correcta' : cond.pred === false ? 'incorrecta' : '') : ''}" data-p="0" ${cond.probado ? 'disabled' : ''}>🚫 No, es aislante</button>
      </div>
      ${cond.probado ? `<div class="feedback ${cond.pred === o.si ? 'ok' : 'mal'}"><p class="fb-titulo">${cond.pred === o.si ? '✅ ¡Bien predicho!' : '✖ ¡Mirá lo que pasó!'} ${o.si ? 'La lamparita se enciende.' : 'La lamparita no se enciende.'}</p><p>${o.x}</p></div>
        <button class="btn primario" id="el-sig">${cond.i + 1 < cond.lista.length ? 'Siguiente objeto →' : 'Ver resultado'}</button>` : ''}`;
    info.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => {
      cond.pred = b.dataset.p === '1';
      raiz.querySelector('#el-fijo').innerHTML = escenaPrueba();
      setTimeout(() => { cond.probado = true; if (cond.pred === o.si) cond.aciertos++; pintarConduce(); }, 700);
      info.querySelectorAll('[data-p]').forEach(x => { x.disabled = true; });
    }));
    info.querySelector('#el-sig')?.addEventListener('click', () => { cond.i++; cond.pred = null; cond.probado = false; pintarConduce(); });
  }

  return { iniciar, resolver };
})();
