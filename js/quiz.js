// Quiz para los alumnos y panel docente.
// Las preguntas están en preguntas.json. Qué preguntas están activas, cuántas tiene cada intento y los
// resultados se guardan en Firebase (Firestore). Sin configuración de Firebase (js/firebase-config.js)
// todo funciona en «modo de prueba» y se guarda solo en este dispositivo.

// ---------- Datos: Firebase o modo de prueba ----------
const QuizDatos = (function () {
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const INICIAL = { cantidad: 10, inactivas: [] };
  let conexion = null, banco = null, fb = null;
  const cfg = () => window.CIENCIALAB_FIREBASE || {};
  const configurado = () => !!(cfg().apiKey && cfg().projectId);

  // 'firebase' | 'local' (sin configurar) | 'error' (configurado, pero no se pudo cargar)
  function conectar() {
    if (!conexion) conexion = (async () => {
      if (!configurado()) return 'local';
      try {
        const [app, fs, au] = await Promise.all(['app', 'firestore', 'auth'].map(m => import(`${SDK}firebase-${m}.js`)));
        const a = app.initializeApp(cfg());
        fb = { fs, au, db: fs.getFirestore(a), auth: au.getAuth(a) };
        return 'firebase';
      } catch (e) {
        console.error('No se pudo conectar con Firebase', e);
        return 'error';
      }
    })();
    return conexion;
  }

  function preguntas() {
    if (!banco) banco = fetch('preguntas.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error('preguntas.json: ' + r.status); return r.json(); })
      .catch(e => { banco = null; throw e; });
    return banco;
  }

  async function exigir() {
    const modo = await conectar();
    if (modo === 'error') throw new Error('No se pudo conectar con Firebase.');
    return modo === 'firebase';
  }

  async function leerConfig() {
    if (await exigir()) {
      const s = await fb.fs.getDoc(fb.fs.doc(fb.db, 'config', 'quiz'));
      return { ...INICIAL, ...(s.exists() ? s.data() : {}) };
    }
    return { ...INICIAL, ...Util.leer('quiz-config', {}) };
  }

  async function guardarConfig(cambios) {
    if (await exigir()) return fb.fs.setDoc(fb.fs.doc(fb.db, 'config', 'quiz'), cambios, { merge: true });
    Util.guardar('quiz-config', { ...Util.leer('quiz-config', {}), ...cambios });
  }

  async function guardarResultado(r) {
    if (await exigir()) {
      const ref = await fb.fs.addDoc(fb.fs.collection(fb.db, 'resultados'), { ...r, fecha: fb.fs.serverTimestamp() });
      return ref.id;
    }
    const lista = Util.leer('quiz-resultados', []), id = 'local-' + Date.now();
    lista.push({ id, ...r, fecha: Date.now() });
    Util.guardar('quiz-resultados', lista);
    return id;
  }

  async function leerResultados() {
    if (await exigir()) {
      const s = await fb.fs.getDocs(fb.fs.query(fb.fs.collection(fb.db, 'resultados'), fb.fs.limit(5000)));
      return s.docs.map(d => {
        const x = d.data();
        return { id: d.id, ...x, escuela: x.escuela || '', fecha: x.fecha && x.fecha.toMillis ? x.fecha.toMillis() : Date.now() };
      });
    }
    return Util.leer('quiz-resultados', []).map(r => ({ escuela: '', ...r }));
  }

  // Borra todos los resultados o solo los de un curso de una escuela ({ escuela, curso }). Devuelve cuántos borró.
  async function borrarResultados(grupo) {
    const delGrupo = r => !grupo || ((r.escuela || '') === grupo.escuela && r.curso === grupo.curso);
    if (await exigir()) {
      const col = fb.fs.collection(fb.db, 'resultados');
      const s = await fb.fs.getDocs(grupo ? fb.fs.query(col, fb.fs.where('curso', '==', grupo.curso)) : col);
      const docs = s.docs.filter(d => delGrupo(d.data()));
      for (let i = 0; i < docs.length; i += 400) {
        const lote = fb.fs.writeBatch(fb.db);
        docs.slice(i, i + 400).forEach(d => lote.delete(d.ref));
        await lote.commit();
      }
      return docs.length;
    }
    const lista = Util.leer('quiz-resultados', []), quedan = lista.filter(r => !delGrupo(r));
    Util.guardar('quiz-resultados', quedan);
    return lista.length - quedan.length;
  }

  // ---------- Cuenta del docente (Google) ----------
  async function alCambiarUsuario(cb) {
    if (await conectar() !== 'firebase') return cb(null);
    fb.au.onAuthStateChanged(fb.auth, cb);
  }
  async function ingresar() {
    await exigir();
    const proveedor = new fb.au.GoogleAuthProvider();
    proveedor.setCustomParameters({ prompt: 'select_account' });
    try {
      await fb.au.signInWithPopup(fb.auth, proveedor);
    } catch (e) {
      // Algunos celulares bloquean las ventanas emergentes: se usa una redirección.
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') await fb.au.signInWithRedirect(fb.auth, proveedor);
      else throw e;
    }
  }
  const salir = async () => { if (await conectar() === 'firebase') await fb.au.signOut(fb.auth); };

  return { conectar, preguntas, leerConfig, guardarConfig, guardarResultado, leerResultados, borrarResultados, alCambiarUsuario, ingresar, salir };
})();

// ---------- Utilidades del quiz ----------
const QuizUtil = {
  esc: t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
  // Año 1 a 6 y división 1 a 4 → «2.º 3.ª».
  curso: (anio, division) => `${anio}.º ${division}.ª`,
  // «escuela  n 12» y «Escuela N 12» quedan iguales, así se agrupan en la tabla.
  escuela: t => String(t).replace(/\s+/g, ' ').trim().toUpperCase().slice(0, 60),
  // Texto para mostrar un grupo: «ESCUELA N.º 12 · 2.º 3.ª».
  grupo: r => (r.escuela ? `${r.escuela} · ` : '') + r.curso,
  tiempo(ms) {
    const s = ms / 1000, m = Math.floor(s / 60);
    return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0').replace('.', ',')}`;
  },
  // Más correctas primero; a igual puntaje, menos tiempo.
  ordenar: lista => lista.slice().sort((a, b) => b.correctas - a.correctas || a.tiempoMs - b.tiempoMs || a.fecha - b.fecha),
  // Preguntas que pueden salir: las que no están apagadas y, si se indica el año, solo de los temas habilitados para ese año.
  // Un año sin configurar ve todos los temas.
  activas(banco, config, anio) {
    const fuera = new Set(config.inactivas || []), lista = anio && (config.temasPorAnio || {})[anio];
    const temas = Array.isArray(lista) ? new Set(lista) : null;
    return banco.preguntas.filter(p => !fuera.has(p.id) && (!temas || temas.has(p.tema)));
  },
  temas: banco => banco.temas || [...new Set(banco.preguntas.map(p => p.tema))],
  avisoModo(modo) {
    if (modo === 'local') return '<p class="qz-aviso">🧪 <b>Modo de prueba:</b> Firebase todavía no está configurado, así que los resultados se guardan solo en este dispositivo.</p>';
    if (modo === 'error') return '<p class="qz-aviso mal">⚠️ No se pudo conectar con la base de datos. Revisá la conexión a internet y recargá la página.</p>';
    return '';
  },
};

// ---------- Quiz para los alumnos ----------
const Quiz = (function () {
  const { esc } = QuizUtil;
  let raiz, banco = null, config = null, modo = 'local', juego = null, reloj = null, ultimoId = null, filtro = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>📝 Quiz de Ciencias</h1>
        <p>Respondé preguntas de los temas que trabajaste en clase. ¡Sumá respuestas correctas lo más rápido que puedas!</p>
      </div>
      <div id="qz-cont"></div>
      <p class="qz-pie"><a href="#docente">🔒 Panel docente</a></p>`;
    pantallaInicio();
    cargar();
  }

  async function cargar() {
    try {
      modo = await QuizDatos.conectar();
      [banco, config] = await Promise.all([QuizDatos.preguntas(), QuizDatos.leerConfig()]);
    } catch (e) {
      console.error(e);
      banco = null;
    }
    if (raiz.querySelector('#qz-form')) pintarInfo();
  }

  // ---------- Inicio ----------
  function pantallaInicio() {
    clearInterval(reloj);
    const alumno = { escuela: '', anio: '', division: '', nombre: '', ...Util.leer('quiz-alumno', {}) };
    const opciones = (n, sel, sufijo) => `<option value="" disabled ${sel ? '' : 'selected'}>Elegí</option>` + Array.from({ length: n }, (_, i) => `<option value="${i + 1}"${String(sel) === String(i + 1) ? ' selected' : ''}>${i + 1}${sufijo}</option>`).join('');
    raiz.querySelector('#qz-cont').innerHTML = `
      <div class="qz-inicio">
        <div class="panel qz-hero">${heroSVG()}</div>
        <form class="panel qz-form" id="qz-form" autocomplete="on">
          <h2>¿Listos para el desafío?</h2>
          <label>Escuela<input name="escuela" maxlength="60" required value="${esc(alumno.escuela)}" placeholder="Ej.: Escuela N.º 12" list="qz-escuelas" autocomplete="off"></label>
          <datalist id="qz-escuelas"></datalist>
          <div class="qz-fila">
            <label>Año<select name="anio" required>${opciones(6, alumno.anio, '.º año')}</select></label>
            <label>División<select name="division" required>${opciones(4, alumno.division, '.ª división')}</select></label>
          </div>
          <label>Nombre<input name="nombre" maxlength="40" required value="${esc(alumno.nombre)}" placeholder="Nombre y apellido" autocomplete="name"></label>
          <div id="qz-info"><p class="qz-info">Cargando preguntas…</p></div>
          <button class="btn primario qz-grande" type="submit" id="qz-empezar" disabled>▶ Empezar</button>
          <button class="btn" type="button" id="qz-ir-tabla">🏆 Ver la tabla de posiciones</button>
        </form>
      </div>`;
    const form = raiz.querySelector('#qz-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const escuela = QuizUtil.escuela(form.escuela.value), anio = form.anio.value, division = form.division.value;
      const nombre = form.nombre.value.trim().replace(/\s+/g, ' ').slice(0, 40);
      if (!escuela || !anio || !division || !nombre) return;
      Util.guardar('quiz-alumno', { escuela, anio, division, nombre });
      if (!QuizUtil.activas(banco, config, anio).length) return pintarInfo();
      empezar(nombre, escuela, QuizUtil.curso(anio, division), anio);
    });
    form.anio.addEventListener('change', () => pintarInfo());
    raiz.querySelector('#qz-ir-tabla').addEventListener('click', () => pantallaTabla());
    if (banco) pintarInfo();
    // Sugerencias de escuelas que ya jugaron (no hace falta esperarlas).
    QuizDatos.leerResultados().then(rs => {
      const dl = raiz.querySelector('#qz-escuelas');
      if (dl) dl.innerHTML = [...new Set(rs.map(r => r.escuela).filter(Boolean))].sort().map(c => `<option value="${esc(c)}">`).join('');
    }).catch(() => {});
  }

  function pintarInfo() {
    const info = raiz.querySelector('#qz-info'), boton = raiz.querySelector('#qz-empezar');
    if (!info) return;
    if (!banco || !config) {
      info.innerHTML = `${QuizUtil.avisoModo(modo === 'firebase' ? 'error' : modo)}<p class="qz-aviso mal">No se pudieron cargar las preguntas. Recargá la página.</p>`;
      return;
    }
    const anio = raiz.querySelector('#qz-form').anio.value;
    const n = Math.min(config.cantidad, QuizUtil.activas(banco, config, anio).length);
    boton.disabled = !n;
    if (!n) { info.innerHTML = `<p class="qz-aviso">${anio ? `Por ahora no hay preguntas habilitadas para ${anio}.º año.` : 'Por ahora no hay preguntas activas.'} Esperá a que el docente habilite el quiz.</p>`; return; }
    info.innerHTML = `${QuizUtil.avisoModo(modo)}
      <ul class="qz-reglas"><li>❓ ${anio ? `Son <b>${n} preguntas</b>` : `Hasta <b>${n} preguntas</b>`} de opción múltiple${anio ? '' : ' (depende de tu año)'}.</li><li>⏱️ El cronómetro arranca cuando empezás y para en la última respuesta.</li><li>🏆 Gana quien tiene más respuestas correctas; si empatan, quien tardó menos.</li></ul>`;
    boton.disabled = false;
  }

  // ---------- Juego ----------
  function empezar(nombre, escuela, curso, anio) {
    const activas = QuizUtil.activas(banco, config, anio);
    const elegidas = Util.mezclar(activas).slice(0, Math.min(config.cantidad, activas.length));
    juego = {
      nombre, escuela, curso, i: 0, inicio: Date.now(), fin: null, guardado: false,
      preguntas: elegidas.map(p => ({ p, opciones: Util.mezclar(p.opciones.map((t, k) => ({ t, ok: k === p.correcta }))), elegida: null })),
    };
    clearInterval(reloj);
    reloj = setInterval(() => { const c = raiz.querySelector('#qz-crono'); if (c && juego && !juego.fin) c.textContent = '⏱ ' + QuizUtil.tiempo(Date.now() - juego.inicio); }, 100);
    pantallaPregunta();
  }

  function pantallaPregunta() {
    const n = juego.preguntas.length, q = juego.preguntas[juego.i];
    raiz.querySelector('#qz-cont').innerHTML = `
      <div class="panel qz-juego">
        <div class="qz-barra"><span class="qz-num">Pregunta <b>${juego.i + 1}</b> de ${n}</span><span class="qz-crono" id="qz-crono">⏱ ${QuizUtil.tiempo(Date.now() - juego.inicio)}</span></div>
        <div class="qz-progreso"><div style="width:${juego.i / n * 100}%"></div></div>
        <div class="qz-dibujo-caja">${QuizDibujos.svg(q.p)}</div>
        <span class="etiqueta">${esc(q.p.tema)}</span>
        <h2 class="qz-enunciado">${esc(q.p.enunciado)}</h2>
        <div class="qz-opciones">${q.opciones.map((o, k) => `<button class="btn-opcion qz-op" data-k="${k}"><span class="qz-letra">${'ABCDEF'[k]}</span><span>${esc(o.t)}</span></button>`).join('')}</div>
      </div>`;
    raiz.querySelectorAll('.qz-op').forEach(b => b.addEventListener('click', () => responder(+b.dataset.k)));
    raiz.querySelector('.qz-juego').scrollIntoView({ block: 'nearest' });
  }

  function responder(k) {
    const q = juego.preguntas[juego.i];
    if (q.elegida !== null) return;
    q.elegida = k;
    raiz.querySelectorAll('.qz-op').forEach(b => { b.disabled = true; b.classList.toggle('elegida', +b.dataset.k === k); });
    const ultima = juego.i === juego.preguntas.length - 1;
    if (ultima) juego.fin = Date.now();
    setTimeout(() => { if (ultima) terminar(); else { juego.i++; pantallaPregunta(); } }, 320);
  }

  // ---------- Final ----------
  async function terminar() {
    clearInterval(reloj);
    const total = juego.preguntas.length;
    const correctas = juego.preguntas.filter(q => q.opciones[q.elegida].ok).length;
    const tiempoMs = Math.max(1, Math.round(juego.fin - juego.inicio));
    const errores = juego.preguntas.filter(q => !q.opciones[q.elegida].ok);
    const pct = correctas / total;
    const frase = pct === 1 ? '🏆 ¡Perfecto!' : pct >= 0.8 ? '🌟 ¡Excelente!' : pct >= 0.6 ? '👍 ¡Muy bien!' : pct >= 0.4 ? '💪 ¡Vas por buen camino!' : '📚 ¡A repasar y volver a intentar!';
    raiz.querySelector('#qz-cont').innerHTML = `
      <div class="qz-final">
        <div class="panel qz-resultado">
          ${anillo(correctas, total)}
          <div class="qz-res-texto">
            <p class="qz-frase">${frase}</p>
            <p><b>${esc(juego.nombre)}</b><br><small>${esc(QuizUtil.grupo(juego))}</small></p>
            <dl class="qz-datos"><div><dt>Correctas</dt><dd>${correctas} <small>de ${total}</small></dd></div><div><dt>Tiempo</dt><dd>${QuizUtil.tiempo(tiempoMs)}</dd></div></dl>
            <p class="qz-estado" id="qz-estado">💾 Guardando tu resultado…</p>
            <div class="qz-botones"><button class="btn primario" id="qz-tabla">🏆 Ver la tabla</button><button class="btn" id="qz-otra">🔁 Jugar de nuevo</button></div>
          </div>
        </div>
        <div class="panel qz-repaso">
          <h2>🔎 Repaso de errores</h2>
          ${errores.length ? errores.map(q => `<article class="qz-error">
              <div class="qz-dibujo-caja chica">${QuizDibujos.svg(q.p)}</div><span class="etiqueta">${esc(q.p.tema)}</span>
              <p class="qz-err-enun">${esc(q.p.enunciado)}</p>
              <p class="qz-tuya">✖ Tu respuesta: ${esc(q.opciones[q.elegida].t)}</p>
              <p class="qz-bien">✔ Respuesta correcta: ${esc(q.p.opciones[q.p.correcta])}</p>
              <p class="qz-expl">💡 ${esc(q.p.explicacion)}</p></article>`).join('')
            : '<p class="qz-perfecto">🎉 ¡No tuviste ningún error!</p>'}
        </div>
      </div>`;
    raiz.querySelector('#qz-tabla').addEventListener('click', () => pantallaTabla({ escuela: juego.escuela, curso: juego.curso }));
    raiz.querySelector('#qz-otra').addEventListener('click', () => pantallaInicio());
    if (juego.guardado) return;
    juego.guardado = true;
    const estado = raiz.querySelector('#qz-estado');
    try {
      ultimoId = await QuizDatos.guardarResultado({ nombre: juego.nombre, escuela: juego.escuela, curso: juego.curso, correctas, total, tiempoMs });
      const curso = QuizUtil.ordenar((await QuizDatos.leerResultados()).filter(r => r.escuela === juego.escuela && r.curso === juego.curso));
      const puesto = curso.findIndex(r => r.id === ultimoId) + 1;
      if (estado) estado.innerHTML = `✅ Resultado guardado.${puesto ? ` Estás en el puesto <b>#${puesto}</b> de ${curso.length} en ${esc(juego.curso)}.` : ''}`;
    } catch (e) {
      console.error(e);
      if (estado) { estado.textContent = '⚠️ No se pudo guardar el resultado. Revisá la conexión.'; estado.classList.add('mal'); }
    }
  }

  function anillo(c, t) {
    const r = 52, L = 2 * Math.PI * r, f = c / t;
    const col = f >= 0.8 ? '#51cf66' : f >= 0.5 ? '#ffd166' : '#ff8787';
    return `<svg class="qz-anillo" viewBox="0 0 140 140" aria-hidden="true">
      <circle cx="70" cy="70" r="64" fill="#12143a"/><circle cx="70" cy="70" r="${r}" fill="none" stroke="#2c3070" stroke-width="12"/>
      <circle cx="70" cy="70" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(L * f).toFixed(1)} ${L.toFixed(1)}" transform="rotate(-90 70 70)" class="qz-anillo-arco" style="--L:${L.toFixed(1)}"/>
      <text x="70" y="78" text-anchor="middle" class="qz-anillo-n">${c}/${t}</text></svg>`;
  }

  // ---------- Tabla de posiciones ----------
  async function pantallaTabla(grupo) {
    clearInterval(reloj);
    if (grupo) filtro = { ...grupo };
    if (!filtro) filtro = { escuela: '', curso: '' };
    raiz.querySelector('#qz-cont').innerHTML = `
      <div class="panel qz-tabla">
        <div class="qz-tabla-cab"><h2>🏆 Tabla de posiciones</h2>
          <div class="qz-filtros">
            <label class="qz-filtro">Escuela <select id="qz-f-escuela"></select></label>
            <label class="qz-filtro">Curso <select id="qz-f-curso"></select></label>
          </div></div>
        ${QuizUtil.avisoModo(modo)}
        <div id="qz-lista"><p class="qz-info">Cargando…</p></div>
        <div class="qz-botones"><button class="btn primario" id="qz-volver">▶ Jugar</button><button class="btn" id="qz-recargar">🔄 Actualizar</button></div>
      </div>`;
    raiz.querySelector('#qz-volver').addEventListener('click', () => pantallaInicio());
    raiz.querySelector('#qz-recargar').addEventListener('click', () => pantallaTabla());
    let todos;
    try { todos = QuizUtil.ordenar(await QuizDatos.leerResultados()); } catch (e) {
      raiz.querySelector('#qz-lista').innerHTML = '<p class="qz-aviso mal">⚠️ No se pudo cargar la tabla. Revisá la conexión.</p>';
      return;
    }
    const selE = raiz.querySelector('#qz-f-escuela'), selC = raiz.querySelector('#qz-f-curso');
    if (!selE) return;
    const opciones = (lista, valor, todas) => `<option value="">${todas}</option>` + lista.map(c => `<option value="${esc(c)}"${c === valor ? ' selected' : ''}>${esc(c)}</option>`).join('');
    const pintar = () => {
      const escuelas = [...new Set(todos.map(r => r.escuela).filter(Boolean))].sort();
      if (filtro.escuela && !escuelas.includes(filtro.escuela)) filtro.escuela = '';
      const deEscuela = filtro.escuela ? todos.filter(r => r.escuela === filtro.escuela) : todos;
      const cursos = [...new Set(deEscuela.map(r => r.curso))].sort();
      if (filtro.curso && !cursos.includes(filtro.curso)) filtro.curso = '';
      selE.innerHTML = opciones(escuelas, filtro.escuela, 'Todas las escuelas');
      selC.innerHTML = opciones(cursos, filtro.curso, 'Todos los cursos');
      const lista = filtro.curso ? deEscuela.filter(r => r.curso === filtro.curso) : deEscuela;
      const medalla = i => ['🥇', '🥈', '🥉'][i] || `${i + 1}`;
      raiz.querySelector('#qz-lista').innerHTML = lista.length ? `<ol class="qz-ranking">${lista.map((r, i) => `
        <li class="${r.id === ultimoId ? 'yo' : ''}${i < 3 ? ' podio' : ''}">
          <span class="qz-puesto">${medalla(i)}</span>
          <span class="qz-quien"><b>${esc(r.nombre)}</b><small>${esc(QuizUtil.grupo(r))}</small></span>
          <span class="qz-pts">${r.correctas}<small>/${r.total}</small></span>
          <span class="qz-t">${QuizUtil.tiempo(r.tiempoMs)}</span></li>`).join('')}</ol>`
        : '<p class="qz-info">Todavía no hay resultados. ¡Sé el primero en jugar!</p>';
    };
    selE.addEventListener('change', () => { filtro = { escuela: selE.value, curso: '' }; pintar(); });
    selC.addEventListener('change', () => { filtro.curso = selC.value; pintar(); });
    pintar();
  }

  // ---------- Ilustración de la portada ----------
  function heroSVG() {
    const { dosTonos, ojo, sombra, estrellas } = Arte;
    const boca = (x, y, r) => `<path d="M${x - r},${y} q${r},${r * 0.9} ${r * 2},0" stroke="#15163d" stroke-width="${r * 0.4}" fill="none" stroke-linecap="round"/>`;
    const pregunta = (x, y, r, c, d) => `<g class="qz-flota" style="animation-delay:${d}s"><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.25}" fill="#fff" opacity="0.35"/><text x="${x}" y="${y + r * 0.42}" text-anchor="middle" class="qz-hero-q" style="font-size:${r * 1.25}px">?</text></g>`;
    return `<svg viewBox="0 0 760 220" class="qz-hero-svg" role="img" aria-label="Un matraz, un cronómetro y un trofeo listos para el quiz">
      <defs><radialGradient id="qz-bg" cx="0.5" cy="0.35" r="0.85"><stop offset="0" stop-color="#2b2f86"/><stop offset="1" stop-color="#0c0e30"/></radialGradient></defs>
      <rect width="760" height="220" rx="16" fill="url(#qz-bg)"/>${estrellas(46, 760, 220)}
      <ellipse cx="380" cy="300" rx="420" ry="120" fill="#1b1f5c"/><ellipse cx="380" cy="300" rx="420" ry="120" fill="none" stroke="#2c3070" stroke-width="3"/>
      ${pregunta(90, 62, 20, '#ff8fab', 0)}${pregunta(660, 50, 16, '#7fd3ff', 0.8)}${pregunta(560, 150, 13, '#ffd166', 1.6)}${pregunta(218, 40, 12, '#b197fc', 2.2)}
      <!-- Trofeo -->
      <g transform="translate(170 150)">${sombra(0, 36, 34)}
        <rect x="-22" y="22" width="44" height="12" rx="3" fill="#7a5a12"/><rect x="-8" y="6" width="16" height="18" fill="#d4a017"/>
        <path d="M-26,-30 C-44,-30 -44,-6 -22,-2 M26,-30 C44,-30 44,-6 22,-2" stroke="#d4a017" stroke-width="6" fill="none" stroke-linecap="round"/>
        ${dosTonos('<path d="M-28,-36 H28 C28,-6 16,10 0,10 C-16,10 -28,-6 -28,-36 Z" fill="FILL"/>', '#ffd43b', '#f0a830', { x: 6 })}
        <path d="M0,-28 l4,8 9,1 -7,6 2,9 -8,-5 -8,5 2,-9 -7,-6 9,-1 Z" fill="#fff3bf"/>
        <path d="M-20,-30 C-20,-16 -14,-6 -8,-2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/></g>
      <!-- Matraz con cara -->
      <g transform="translate(372 132)">${sombra(0, 58, 60)}
        ${dosTonos('<path d="M-14,-74 H14 V-32 L58,38 Q64,54 46,56 H-46 Q-64,54 -58,38 L-14,-32 Z" fill="FILL"/>', '#e7f5ff', '#c5d8f5', { x: 0 })}
        ${dosTonos('<path d="M-34,4 H34 L58,38 Q64,54 46,56 H-46 Q-64,54 -58,38 Z" fill="FILL"/>', '#69db7c', '#2f9e44', { x: 0 })}
        <rect x="-20" y="-84" width="40" height="12" rx="4" fill="#dbe4ff"/>
        <circle cx="-30" cy="40" r="5" fill="#b2f2bb"/><circle cx="22" cy="46" r="3.5" fill="#b2f2bb"/>
        <g class="qz-burbuja"><circle cx="-4" cy="-10" r="5" fill="#ffd166"/><circle cx="6" cy="-34" r="3.5" fill="#ffd166"/><circle cx="-2" cy="-58" r="3" fill="#ffd166"/></g>
        <path d="M-8,-68 V-36" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.75"/>
        ${ojo(-15, 24, 7)}${ojo(15, 24, 7)}${boca(0, 36, 6)}
        <circle cx="-30" cy="34" r="5" fill="#ff8fab" opacity="0.5"/><circle cx="30" cy="34" r="5" fill="#ff8fab" opacity="0.5"/></g>
      <!-- Cronómetro con cara -->
      <g transform="translate(560 128)">${sombra(0, 54, 46)}
        <rect x="-9" y="-62" width="18" height="12" rx="3" fill="#f0a830"/><rect x="-14" y="-68" width="28" height="8" rx="4" fill="#ffd166"/>
        <rect x="30" y="-46" width="12" height="8" rx="3" fill="#f0a830" transform="rotate(40 36 -42)"/>
        ${dosTonos('<circle r="48" fill="FILL"/>', '#ffd166', '#f0a830', { x: 10 })}
        <circle r="37" fill="#fff8e1"/>
        ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-33" x2="0" y2="${i % 3 ? -29 : -26}" stroke="#c98a00" stroke-width="${i % 3 ? 2 : 3}" transform="rotate(${i * 30})"/>`).join('')}
        <g class="qz-aguja"><line x1="0" y1="0" x2="0" y2="-26" stroke="#e8590c" stroke-width="3.5" stroke-linecap="round"/></g>
        <circle r="4" fill="#e8590c"/>
        ${ojo(-12, 12, 5)}${ojo(12, 12, 5)}${boca(0, 21, 4)}
        <path d="M-34,-20 a40,40 0 0 1 22,-22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/></g>
    </svg>`;
  }

  return { iniciar };
})();

// ---------- Panel docente ----------
const QuizDocente = (function () {
  const { esc } = QuizUtil;
  let raiz, banco = null, config = null, modo = 'local', usuario = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🔒 Panel docente</h1>
        <p>Elegí qué preguntas entran en el quiz, cuántas tiene cada intento y administrá los resultados.</p>
      </div>
      <div id="qd-cont"><div class="panel"><p class="qz-info">Cargando…</p></div></div>
      <p class="qz-pie"><a href="#quiz">← Volver al quiz</a></p>`;
    arrancar();
  }

  async function arrancar() {
    modo = await QuizDatos.conectar();
    if (modo === 'error') return mensaje(QuizUtil.avisoModo('error'));
    try { banco = await QuizDatos.preguntas(); } catch (e) { return mensaje('<p class="qz-aviso mal">No se pudo cargar preguntas.json.</p>'); }
    if (modo === 'local') return cargarPanel();
    QuizDatos.alCambiarUsuario(u => {
      usuario = u;
      if (!u) return pantallaIngreso();
      if (u.email !== window.CIENCIALAB_DOCENTE) return pantallaSinPermiso();
      cargarPanel();
    });
  }

  const mensaje = html => { raiz.querySelector('#qd-cont').innerHTML = `<div class="panel">${html}</div>`; };

  function pantallaIngreso() {
    mensaje(`<div class="qd-login"><p class="qd-candado">🔐</p><h2>Ingresá con tu cuenta de Google</h2>
      <p>Solo la cuenta del docente puede modificar el quiz.</p>
      <button class="btn primario qz-grande" id="qd-entrar">Ingresar con Google</button><p class="qz-estado" id="qd-err"></p></div>`);
    raiz.querySelector('#qd-entrar').addEventListener('click', async () => {
      try { await QuizDatos.ingresar(); } catch (e) {
        if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') raiz.querySelector('#qd-err').textContent = '⚠️ No se pudo ingresar: ' + (e.code || e.message);
      }
    });
  }

  function pantallaSinPermiso() {
    mensaje(`<div class="qd-login"><p class="qd-candado">⛔</p><h2>Esta cuenta no tiene permiso</h2>
      <p>Ingresaste como <b>${esc(usuario.email)}</b>. El panel es solo para la cuenta del docente.</p>
      <button class="btn" id="qd-salir">Salir y usar otra cuenta</button></div>`);
    raiz.querySelector('#qd-salir').addEventListener('click', () => QuizDatos.salir());
  }

  async function cargarPanel() {
    try { config = await QuizDatos.leerConfig(); } catch (e) { return mensaje('<p class="qz-aviso mal">⚠️ No se pudo leer la configuración.</p>'); }
    config.inactivas = [...new Set(config.inactivas || [])];
    config.temasPorAnio = config.temasPorAnio || {};
    const temas = QuizUtil.temas(banco), ANIOS = [1, 2, 3, 4, 5, 6];
    raiz.querySelector('#qd-cont').innerHTML = `
      ${QuizUtil.avisoModo(modo)}
      ${usuario ? `<p class="qd-usuario">👤 ${esc(usuario.email)} <button class="btn chico" id="qd-salir">Salir</button></p>` : ''}
      <div class="qd-grid">
        <section class="panel">
          <h2>⚙️ Cada intento</h2>
          <label class="qd-campo">Preguntas por intento <input type="number" id="qd-cant" min="1" max="100" value="${config.cantidad}"></label>
          <p class="qz-info" id="qd-activas"></p>
          <button class="btn primario" id="qd-guardar-cant">Guardar</button> <span class="qd-estado" id="qd-estado-cant"></span>
        </section>
        <section class="panel">
          <h2>🏆 Resultados</h2>
          <div id="qd-resultados"><p class="qz-info">Cargando…</p></div>
        </section>
      </div>
      <section class="panel qd-anios">
        <div class="qd-cab"><h2>📅 Temas por año</h2><span class="qd-estado" id="qd-estado-anios"></span></div>
        <p class="qz-info">Marcá qué temas le aparecen a cada año (los alumnos eligen su año al entrar). Se guarda solo.</p>
        <div class="qd-matriz-caja"><table class="qd-matriz">
          <thead><tr><th>Tema</th>${ANIOS.map(a => `<th>${a}.º</th>`).join('')}</tr></thead>
          <tbody>${temas.map((t, i) => `<tr><th>${esc(t)}</th>${ANIOS.map(a => `<td><input type="checkbox" data-anio="${a}" data-ti="${i}" aria-label="${esc(t)} en ${a}.º año"></td>`).join('')}</tr>`).join('')}
            <tr class="qd-total"><th>Preguntas activas</th>${ANIOS.map(a => `<td data-total="${a}"></td>`).join('')}</tr></tbody>
        </table></div>
      </section>
      <section class="panel qd-preguntas">
        <div class="qd-cab"><h2>📚 Preguntas por tema</h2><span class="qd-estado" id="qd-estado"></span></div>
        <p class="qz-info">Los interruptores se guardan solos. Una pregunta apagada no aparece en el quiz.</p>
        ${temas.map((t, i) => {
          const ps = banco.preguntas.filter(p => p.tema === t);
          return `<div class="qd-tema" data-tema="${i}">
            <div class="qd-tema-cab">
              <label class="qd-switch" title="Activar o desactivar todo el tema"><input type="checkbox" data-tema="${i}"><span></span></label>
              <button class="qd-tema-tit" data-abrir="${i}" aria-expanded="false"><b>${esc(t)}</b><small class="qd-cuenta" data-cuenta="${i}"></small><span class="qd-flecha">▾</span></button>
            </div>
            <ul class="qd-lista" data-lista="${i}" hidden>${ps.map(p => `<li>
              <label class="qd-switch"><input type="checkbox" data-id="${esc(p.id)}"><span></span></label>
              <div><p>${esc(p.enunciado)}</p><small>✔ ${esc(p.opciones[p.correcta])}</small></div></li>`).join('')}</ul></div>`;
        }).join('')}
      </section>`;
    raiz.querySelector('#qd-salir')?.addEventListener('click', () => QuizDatos.salir());
    raiz.querySelectorAll('[data-abrir]').forEach(b => b.addEventListener('click', () => {
      const lista = raiz.querySelector(`[data-lista="${b.dataset.abrir}"]`);
      lista.hidden = !lista.hidden;
      b.setAttribute('aria-expanded', String(!lista.hidden));
      b.closest('.qd-tema').classList.toggle('abierto', !lista.hidden);
    }));
    raiz.querySelectorAll('[data-id]').forEach(c => c.addEventListener('change', () => {
      const fuera = new Set(config.inactivas);
      c.checked ? fuera.delete(c.dataset.id) : fuera.add(c.dataset.id);
      config.inactivas = [...fuera];
      pintarSwitches();
      guardarActivas();
    }));
    raiz.querySelectorAll('input[data-tema]').forEach(c => c.addEventListener('change', () => {
      const fuera = new Set(config.inactivas);
      banco.preguntas.filter(p => p.tema === temas[+c.dataset.tema]).forEach(p => c.checked ? fuera.delete(p.id) : fuera.add(p.id));
      config.inactivas = [...fuera];
      pintarSwitches();
      guardarActivas();
    }));
    raiz.querySelectorAll('input[data-anio]').forEach(c => c.addEventListener('change', () => {
      const a = c.dataset.anio;
      config.temasPorAnio[a] = temas.filter((t, i) => raiz.querySelector(`input[data-anio="${a}"][data-ti="${i}"]`).checked);
      pintarSwitches();
      guardarCambios({ temasPorAnio: config.temasPorAnio }, '#qd-estado-anios');
    }));
    raiz.querySelector('#qd-guardar-cant').addEventListener('click', async () => {
      const n = Math.round(+raiz.querySelector('#qd-cant').value);
      const est = raiz.querySelector('#qd-estado-cant');
      if (!(n >= 1 && n <= 100)) { est.textContent = '⚠️ Elegí un número entre 1 y 100'; return; }
      est.textContent = 'Guardando…';
      try { await QuizDatos.guardarConfig({ cantidad: n }); config.cantidad = n; est.textContent = '✅ Guardado'; pintarSwitches(); } catch (e) { est.textContent = '⚠️ No se pudo guardar'; }
    });
    pintarSwitches();
    pintarResultados();
  }

  function pintarSwitches() {
    const fuera = new Set(config.inactivas), temas = QuizUtil.temas(banco);
    raiz.querySelectorAll('[data-id]').forEach(c => { c.checked = !fuera.has(c.dataset.id); c.closest('li').classList.toggle('apagada', !c.checked); });
    temas.forEach((t, i) => {
      const ps = banco.preguntas.filter(p => p.tema === t), on = ps.filter(p => !fuera.has(p.id)).length;
      const c = raiz.querySelector(`input[data-tema="${i}"]`);
      c.checked = on > 0; c.indeterminate = on > 0 && on < ps.length;
      raiz.querySelector(`[data-cuenta="${i}"]`).textContent = `${on} de ${ps.length} activas`;
    });
    raiz.querySelectorAll('input[data-anio]').forEach(c => {
      const lista = config.temasPorAnio[c.dataset.anio];
      c.checked = !Array.isArray(lista) || lista.includes(temas[+c.dataset.ti]);
    });
    raiz.querySelectorAll('[data-total]').forEach(td => { const n = QuizUtil.activas(banco, config, td.dataset.total).length; td.textContent = n; td.classList.toggle('cero', !n); });
    const activas = QuizUtil.activas(banco, config).length;
    raiz.querySelector('#qd-activas').innerHTML = `Hay <b>${activas}</b> preguntas activas de ${banco.preguntas.length}.${activas < config.cantidad ? ` Como hay menos activas que ${config.cantidad}, cada intento tendrá ${activas}.` : ''}`;
  }

  // Los cambios de los interruptores se juntan y se guardan medio segundo después del último.
  const guardarActivas = () => guardarCambios({ inactivas: config.inactivas }, '#qd-estado');
  const pendientes = {};
  function guardarCambios(cambios, selEstado) {
    const est = raiz.querySelector(selEstado);
    est.textContent = 'Guardando…'; est.className = 'qd-estado';
    clearTimeout(pendientes[selEstado]);
    pendientes[selEstado] = setTimeout(async () => {
      try { await QuizDatos.guardarConfig(cambios); est.textContent = '✅ Guardado'; est.classList.add('ok'); } catch (e) { console.error(e); est.textContent = '⚠️ No se pudo guardar'; est.classList.add('mal'); }
    }, 500);
  }

  async function pintarResultados() {
    const cont = raiz.querySelector('#qd-resultados');
    let rs;
    try { rs = await QuizDatos.leerResultados(); } catch (e) { cont.innerHTML = '<p class="qz-aviso mal">⚠️ No se pudieron leer los resultados.</p>'; return; }
    const grupos = {};
    rs.forEach(r => {
      const k = JSON.stringify([r.escuela || '', r.curso]);
      grupos[k] = (grupos[k] || 0) + 1;
    });
    const claves = Object.keys(grupos).sort();
    cont.innerHTML = `<p>Hay <b>${rs.length}</b> ${rs.length === 1 ? 'resultado guardado' : 'resultados guardados'}.</p>
      ${claves.length ? `<ul class="qd-cursos">${claves.map(k => { const [escuela, curso] = JSON.parse(k); return `<li><span>${esc(curso)}<small class="qd-escuela">${esc(escuela || 'sin escuela')}</small></span><small>${grupos[k]} ${grupos[k] === 1 ? 'intento' : 'intentos'}</small><button class="btn chico qd-borrar" data-grupo="${esc(k)}">🗑 Borrar</button></li>`; }).join('')}</ul>` : ''}
      <div class="qz-botones"><button class="btn qd-peligro" id="qd-borrar-todo" ${rs.length ? '' : 'disabled'}>🗑 Borrar todos</button><button class="btn" id="qd-actualizar">🔄 Actualizar</button></div>
      <p class="qz-estado" id="qd-estado-res"></p>`;
    const est = cont.querySelector('#qd-estado-res');
    const borrar = async k => {
      const g = k ? (([escuela, curso]) => ({ escuela, curso }))(JSON.parse(k)) : null;
      const txt = g ? `¿Borrar los ${grupos[k]} resultados de ${g.curso}${g.escuela ? ' de ' + g.escuela : ''}?` : `¿Borrar TODOS los resultados (${rs.length})?`;
      if (!confirm(txt + ' No se puede deshacer.')) return;
      est.textContent = 'Borrando…';
      try { const n = await QuizDatos.borrarResultados(g); await pintarResultados(); raiz.querySelector('#qd-estado-res').textContent = `✅ Se borraron ${n} resultados.`; } catch (e) { console.error(e); est.textContent = '⚠️ No se pudieron borrar.'; }
    };
    cont.querySelectorAll('[data-grupo]').forEach(b => b.addEventListener('click', () => borrar(b.dataset.grupo)));
    cont.querySelector('#qd-borrar-todo').addEventListener('click', () => borrar(null));
    cont.querySelector('#qd-actualizar').addEventListener('click', () => pintarResultados());
  }

  return { iniciar };
})();
