// Módulo 3: Balanceo de ecuaciones químicas.
const Balanceo = (function () {
  const ECUACIONES = [
    { nivel: 1, r: ['H2', 'O2'], p: ['H2O'], sol: [2, 1, 2], nombre: 'Formación del agua' },
    { nivel: 1, r: ['N2', 'H2'], p: ['NH3'], sol: [1, 3, 2], nombre: 'Síntesis del amoníaco' },
    { nivel: 1, r: ['Na', 'Cl2'], p: ['NaCl'], sol: [2, 1, 2], nombre: 'Formación de la sal de mesa' },
    { nivel: 1, r: ['Mg', 'O2'], p: ['MgO'], sol: [2, 1, 2], nombre: 'Combustión del magnesio' },
    { nivel: 1, r: ['H2O2'], p: ['H2O', 'O2'], sol: [2, 2, 1], nombre: 'Descomposición del agua oxigenada' },
    { nivel: 2, r: ['Fe', 'O2'], p: ['Fe2O3'], sol: [4, 3, 2], nombre: 'Oxidación del hierro' },
    { nivel: 2, r: ['Al', 'O2'], p: ['Al2O3'], sol: [4, 3, 2], nombre: 'Oxidación del aluminio' },
    { nivel: 2, r: ['CH4', 'O2'], p: ['CO2', 'H2O'], sol: [1, 2, 1, 2], nombre: 'Combustión del gas natural (metano)' },
    { nivel: 2, r: ['Zn', 'HCl'], p: ['ZnCl2', 'H2'], sol: [1, 2, 1, 1], nombre: 'Zinc + ácido clorhídrico' },
    { nivel: 2, r: ['KClO3'], p: ['KCl', 'O2'], sol: [2, 2, 3], nombre: 'Descomposición del clorato de potasio' },
    { nivel: 3, r: ['C3H8', 'O2'], p: ['CO2', 'H2O'], sol: [1, 5, 3, 4], nombre: 'Combustión del propano (garrafa)' },
    { nivel: 3, r: ['Al', 'HCl'], p: ['AlCl3', 'H2'], sol: [2, 6, 2, 3], nombre: 'Aluminio + ácido clorhídrico' },
    { nivel: 3, r: ['Ca(OH)2', 'HCl'], p: ['CaCl2', 'H2O'], sol: [1, 2, 1, 2], nombre: 'Neutralización' },
    { nivel: 3, r: ['Pb(NO3)2', 'KI'], p: ['PbI2', 'KNO3'], sol: [1, 2, 1, 2], nombre: 'La "lluvia de oro"' },
    { nivel: 3, r: ['NaHCO3'], p: ['Na2CO3', 'H2O', 'CO2'], sol: [2, 1, 1, 1], nombre: 'Bicarbonato al fuego' },
    { nivel: 3, r: ['C2H6', 'O2'], p: ['CO2', 'H2O'], sol: [2, 7, 4, 6], nombre: 'Combustión del etano' },
  ];
  const MAX = 12;

  // Cuenta los átomos de una fórmula: "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }
  function parsear(f) {
    let i = 0;
    const numero = () => {
      let s = '';
      while (i < f.length && /\d/.test(f[i])) s += f[i++];
      return s ? parseInt(s, 10) : 1;
    };
    const grupo = () => {
      const c = {};
      while (i < f.length) {
        const ch = f[i];
        if (ch === '(') {
          i++;
          const sub = grupo();
          i++; // ')'
          const n = numero();
          for (const k in sub) c[k] = (c[k] || 0) + sub[k] * n;
        } else if (ch === ')') {
          return c;
        } else if (/[A-Z]/.test(ch)) {
          let s = f[i++];
          while (i < f.length && /[a-z]/.test(f[i])) s += f[i++];
          const n = numero();
          c[s] = (c[s] || 0) + n;
        } else {
          i++;
        }
      }
      return c;
    };
    return grupo();
  }

  const mcd = (a, b) => (b ? mcd(b, a % b) : a);

  const NIVELES = [1, 2, 3];
  const ESPERA = 6; // segundos antes de pasar solo al nivel siguiente

  let raiz, nivel = 1, lista, indice = 0, coef = [], cuentaAtras = null;
  let resueltas = new Set(Util.leer('bal-resueltas', []));

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>⚖️ Balanceo de ecuaciones</h1>
        <p><b>Ley de conservación de la masa (Lavoisier):</b> en una reacción los átomos no se crean ni se destruyen, solo se reorganizan.
        Usa las flechas para cambiar los <b>coeficientes</b> hasta que haya la misma cantidad de cada átomo a ambos lados.
        Recuerda: los subíndices de las fórmulas <b>no se pueden cambiar</b>.</p>
      </div>
      <div class="niveles" id="bal-niveles">
        <button data-n="1">Nivel 1 · Inicial</button>
        <button data-n="2">Nivel 2 · Intermedio</button>
        <button data-n="3">Nivel 3 · Avanzado</button>
      </div>
      <div class="panel bal-panel">
        <div class="bal-festejo" id="bal-festejo" hidden></div>
        <div class="bal-cabecera">
          <span id="bal-titulo"></span>
          <span id="bal-puntos"></span>
        </div>
        <div class="bal-ecuacion" id="bal-ecuacion"></div>
        <div class="bal-escena"><svg id="bal-svg" viewBox="0 0 760 340" role="img" aria-label="Balanza con los átomos de reactivos y productos">${escenaBalanza()}</svg></div>
        <table class="tabla-atomos">
          <thead><tr><th>Átomo</th><th>Reactivos</th><th>Productos</th><th></th></tr></thead>
          <tbody id="bal-atomos"></tbody>
        </table>
        <div id="bal-mensaje" class="bal-mensaje"></div>
        <div class="bal-botones">
          <button class="btn" id="bal-anterior">← Anterior</button>
          <button class="btn" id="bal-reiniciar">↺ Reiniciar</button>
          <button class="btn" id="bal-pista">💡 Pista</button>
          <button class="btn primario" id="bal-siguiente">Siguiente →</button>
        </div>
      </div>`;
    raiz.querySelectorAll('#bal-niveles button').forEach(b => b.addEventListener('click', () => elegirNivel(+b.dataset.n)));
    raiz.querySelector('#bal-anterior').addEventListener('click', () => ir(indice - 1));
    raiz.querySelector('#bal-siguiente').addEventListener('click', () => ir(indice + 1));
    raiz.querySelector('#bal-reiniciar').addEventListener('click', () => ir(indice));
    raiz.querySelector('#bal-pista').addEventListener('click', pista);
    elegirNivel(1);
  }

  function elegirNivel(n) {
    cerrarFestejo();
    nivel = n;
    lista = ECUACIONES.filter(e => e.nivel === n);
    pintarNiveles();
    // Empieza por la primera ecuación que falta resolver.
    const pendiente = lista.findIndex(e => !resueltas.has(e.nombre));
    ir(pendiente === -1 ? 0 : pendiente);
  }

  function pintarNiveles() {
    raiz.querySelectorAll('#bal-niveles button').forEach(b => {
      const n = +b.dataset.n;
      const completo = ECUACIONES.filter(e => e.nivel === n).every(e => resueltas.has(e.nombre));
      b.classList.toggle('activo', n === nivel);
      b.classList.toggle('completo', completo);
    });
  }

  function festejar() {
    const siguiente = NIVELES.find(n => n > nivel);
    const f = raiz.querySelector('#bal-festejo');
    const confeti = Array.from({ length: 24 }, (_, i) =>
      `<span style="left:${(i * 4.2 + Math.random() * 3).toFixed(1)}%;background:${['#3b5bdb', '#e8590c', '#2b8a3e', '#fab005', '#e64980'][i % 5]};` +
      `animation-delay:${(Math.random() * 0.6).toFixed(2)}s"></span>`).join('');
    f.innerHTML = `
      <div class="confeti">${confeti}</div>
      <div class="festejo-caja">
        <div class="festejo-emoji">🏆</div>
        <h2>¡Felicitaciones! Completaste el Nivel ${nivel}</h2>
        <p>Balanceaste las ${lista.length} ecuaciones. Los átomos quedaron iguales de ambos lados, tal como dice la ley de Lavoisier.</p>
        ${siguiente
          ? `<p class="festejo-cuenta">Pasando al Nivel ${siguiente} en <b id="bal-cuenta">${ESPERA}</b> s…</p>
             <div class="festejo-botones">
               <button class="btn primario" id="bal-ir">Ir al Nivel ${siguiente} ahora →</button>
               <button class="btn" id="bal-quedarse">Quedarme aquí</button>
             </div>`
          : `<p><b>¡Terminaste todos los niveles!</b> Ya eres un experto en balanceo de ecuaciones.</p>
             <div class="festejo-botones">
               <button class="btn primario" id="bal-reempezar">Empezar de nuevo desde el Nivel 1</button>
               <button class="btn" id="bal-quedarse">Cerrar</button>
             </div>`}
      </div>`;
    f.hidden = false;
    f.querySelector('#bal-quedarse').addEventListener('click', cerrarFestejo);
    if (siguiente) {
      f.querySelector('#bal-ir').addEventListener('click', () => elegirNivel(siguiente));
      let quedan = ESPERA;
      cuentaAtras = setInterval(() => {
        quedan--;
        const c = f.querySelector('#bal-cuenta');
        if (c) c.textContent = quedan;
        if (quedan <= 0) elegirNivel(siguiente);
      }, 1000);
    } else {
      f.querySelector('#bal-reempezar').addEventListener('click', () => {
        resueltas = new Set();
        Util.guardar('bal-resueltas', []);
        elegirNivel(1);
      });
    }
  }

  function cerrarFestejo() {
    clearInterval(cuentaAtras);
    cuentaAtras = null;
    const f = raiz.querySelector('#bal-festejo');
    f.hidden = true;
    f.innerHTML = '';
  }

  function ir(i) {
    indice = (i + lista.length) % lista.length;
    const eq = lista[indice];
    coef = eq.sol.map(() => 1);
    raiz.querySelector('#bal-titulo').innerHTML = `Ecuación ${indice + 1} de ${lista.length} · <b>${eq.nombre}</b>`;
    dibujarEcuacion();
    evaluar();
  }

  function especies() {
    const eq = lista[indice];
    return [...eq.r.map(f => ({ f, lado: 'r' })), ...eq.p.map(f => ({ f, lado: 'p' }))];
  }

  function dibujarEcuacion() {
    const eq = lista[indice];
    const partes = [];
    especies().forEach((s, k) => {
      if (k === eq.r.length) partes.push('<span class="flecha">→</span>');
      else if (k > 0) partes.push('<span class="signo">+</span>');
      partes.push(`
        <span class="especie">
          <button class="paso" data-k="${k}" data-d="1" aria-label="Aumentar">▲</button>
          <span class="coef" id="bal-coef-${k}"></span>
          <button class="paso" data-k="${k}" data-d="-1" aria-label="Disminuir">▼</button>
          <span class="formula">${Util.formula(s.f)}</span>
        </span>`);
    });
    const cont = raiz.querySelector('#bal-ecuacion');
    cont.innerHTML = partes.join('');
    cont.querySelectorAll('.paso').forEach(b => b.addEventListener('click', () => {
      const k = +b.dataset.k;
      coef[k] = Math.max(1, Math.min(MAX, coef[k] + +b.dataset.d));
      evaluar();
    }));
  }

  function contar() {
    const tot = { r: {}, p: {} };
    especies().forEach((s, k) => {
      const at = parsear(s.f);
      for (const el in at) tot[s.lado][el] = (tot[s.lado][el] || 0) + at[el] * coef[k];
    });
    return tot;
  }

  function evaluar() {
    const eq = lista[indice];
    coef.forEach((c, k) => {
      const span = raiz.querySelector('#bal-coef-' + k);
      span.textContent = c;
      span.classList.toggle('uno', c === 1);
    });

    const tot = contar();
    const elementos = [...new Set([...Object.keys(tot.r), ...Object.keys(tot.p)])];
    let balanceada = true;
    raiz.querySelector('#bal-atomos').innerHTML = elementos.map(el => {
      const a = tot.r[el] || 0, b = tot.p[el] || 0;
      if (a !== b) balanceada = false;
      return `<tr class="${a === b ? 'ok' : 'mal'}"><td><b>${el}</b></td><td>${a}</td><td>${b}</td><td>${a === b ? '✔' : '✖'}</td></tr>`;
    }).join('');

    const sumaR = Object.values(tot.r).reduce((x, y) => x + y, 0);
    const sumaP = Object.values(tot.p).reduce((x, y) => x + y, 0);
    const angulo = balanceada ? 0 : Math.max(-12, Math.min(12, (sumaP - sumaR) * 2.5 || 4));
    moverBalanza(angulo, balanceada, sumaR, sumaP);

    const msg = raiz.querySelector('#bal-mensaje');
    const divisor = coef.reduce(mcd);
    if (balanceada && divisor > 1) {
      msg.className = 'bal-mensaje aviso';
      msg.innerHTML = `Está balanceada, pero los coeficientes se pueden <b>simplificar</b>: divídelos todos por ${divisor}.`;
    } else if (balanceada) {
      msg.className = 'bal-mensaje ok';
      msg.innerHTML = '🎉 ¡Ecuación balanceada! Hay la misma cantidad de cada átomo en ambos lados.';
      const nueva = !resueltas.has(eq.nombre);
      resueltas.add(eq.nombre);
      Util.guardar('bal-resueltas', [...resueltas]);
      if (nueva) {
        pintarNiveles();
        if (lista.every(e => resueltas.has(e.nombre))) setTimeout(festejar, 900);
        else msg.innerHTML += ' Toca <b>Siguiente →</b> para continuar.';
      }
    } else {
      msg.className = 'bal-mensaje';
      msg.textContent = 'Revisa la tabla: las filas en rojo muestran los átomos que todavía no coinciden.';
    }
    const hechas = lista.filter(e => resueltas.has(e.nombre)).length;
    raiz.querySelector('#bal-puntos').textContent = `✔ ${hechas} / ${lista.length} resueltas en este nivel`;
  }

  // ---------- Balanza ilustrada: cada platillo muestra las moléculas, átomo por átomo ----------
  const { esfera, estrellas, dosTonos, ojo } = Arte;
  const PIV = [380, 70], BRAZO = 250, CAIDA = 118;
  const COLOR = { H: '#f1f3f5', O: '#ff6b6b', N: '#5b8def', C: '#5c636a', Cl: '#51cf66', Na: '#b197fc', Mg: '#94d82d', Fe: '#e8590c', Al: '#adb5bd',
    Zn: '#8f96b8', K: '#cc5de8', Ca: '#63e6be', Pb: '#868e96', I: '#9c36b5', S: '#ffd43b' };
  const radio = el => el === 'H' ? 6.5 : 9;

  function escenaBalanza() {
    const [px, py] = PIV;
    return `<defs><radialGradient id="bal-fondo" cx="0.5" cy="0.35" r="0.85"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient></defs>
      <rect width="760" height="340" rx="14" fill="url(#bal-fondo)"/>${estrellas(30, 760, 340)}
      <ellipse cx="${px}" cy="326" rx="120" ry="9" fill="#05061a" opacity="0.5"/>
      ${dosTonos(`<rect x="${px - 9}" y="${py}" width="18" height="230" rx="6" fill="FILL"/><path d="M${px - 70},326 L${px - 44},284 H${px + 44} L${px + 70},326 Z" fill="FILL"/>`, '#8f96b8', '#5c6391', { x: px + 2 })}
      <g id="bal-cara"></g>
      <g id="bal-viga" class="bal-mov">
        ${dosTonos(`<rect x="${px - BRAZO - 6}" y="${py - 6}" width="${BRAZO * 2 + 12}" height="12" rx="6" fill="FILL"/>`, '#c3c8e8', '#8f96b8', { y: py + 1 })}
        ${[-1, 1].map(k => `<circle cx="${px + k * BRAZO}" cy="${py}" r="7" fill="#ffd166"/>`).join('')}
      </g>
      ${dosTonos(`<circle cx="${px}" cy="${py}" r="14" fill="FILL"/>`, '#ffd166', '#f0a830', { x: px + 3 })}
      ${[['r', -1, 'REACTIVOS'], ['p', 1, 'PRODUCTOS']].map(([id, k, t]) => `<g id="bal-plato-${id}" class="bal-mov">
        <path d="M${px + k * BRAZO},${py} L${px + k * BRAZO - 104},${py + CAIDA} M${px + k * BRAZO},${py} L${px + k * BRAZO + 104},${py + CAIDA}" stroke="#8f96b8" stroke-width="2"/>
        <g class="bal-cont"></g>
        ${dosTonos(`<path d="M${px + k * BRAZO - 116},${py + CAIDA} H${px + k * BRAZO + 116} C${px + k * BRAZO + 104},${py + CAIDA + 34} ${px + k * BRAZO - 104},${py + CAIDA + 34} ${px + k * BRAZO - 116},${py + CAIDA} Z" fill="FILL"/>`, '#ff9f6b', '#e0703a', { y: py + CAIDA + 12 })}
        <path class="bal-borde" d="M${px + k * BRAZO - 116},${py + CAIDA} H${px + k * BRAZO + 116}" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/>
        <text x="${px + k * BRAZO}" y="${py + CAIDA + 54}" text-anchor="middle" class="bal-rotulo">${t}</text>
        <text x="${px + k * BRAZO}" y="${py + CAIDA + 70}" text-anchor="middle" class="bal-total" id="bal-total-${id}"></text>
      </g>`).join('')}`;
  }

  // Dibuja una molécula a partir de su fórmula: un átomo central y los demás alrededor.
  function molecula(f) {
    const at = parsear(f), lista = [];
    Object.entries(at).forEach(([el, n]) => { for (let i = 0; i < n; i++) lista.push(el); });
    const centro = Object.keys(at).find(el => at[el] === 1 && el !== 'H') || lista[0];
    const resto = [...lista];
    resto.splice(resto.indexOf(centro), 1);
    const piezas = [{ el: centro, x: 0, y: 0 }];
    if (lista.length === 2) { piezas[0].x = -8; piezas.push({ el: resto[0], x: 8, y: 0 }); }
    else resto.forEach((el, i) => {
      // Tres átomos: el CO₂ es lineal; el agua y similares, angulares.
      const a = resto.length === 2 ? (centro === 'C' ? Math.PI * i : Math.PI / 2 + (i ? 0.9 : -0.9)) : -Math.PI / 2 + i * 2 * Math.PI / resto.length;
      const d = radio(centro) + radio(el) - 3;
      piezas.push({ el, x: Math.cos(a) * d, y: Math.sin(a) * d });
    });
    const xs = piezas.map(p => p.x), ys = piezas.map(p => p.y);
    const w = Math.max(...xs) - Math.min(...xs) + 20, h = Math.max(...ys) - Math.min(...ys) + 20;
    return { piezas, w, h, cx: (Math.max(...xs) + Math.min(...xs)) / 2, cy: (Math.max(...ys) + Math.min(...ys)) / 2 };
  }

  function contenidoPlato(lado, x0) {
    const mols = [];
    especies().forEach((s, k) => { if (s.lado === lado) for (let i = 0; i < coef[k]; i++) mols.push(molecula(s.f)); });
    // Acomoda las moléculas en filas dentro del platillo, achicando si no entran.
    const ancho = 216, alto = 104;
    let esc = 1, filas;
    for (; esc > 0.3; esc -= 0.05) {
      filas = [[]];
      let x = 0;
      mols.forEach(m => { if (x + m.w * esc > ancho && filas[filas.length - 1].length) { filas.push([]); x = 0; } filas[filas.length - 1].push(m); x += m.w * esc + 4; });
      const altoTotal = filas.reduce((a, f) => a + Math.max(...f.map(m => m.h)) * esc + 2, 0);
      if (altoTotal <= alto) break;
    }
    let s = '', y = PIV[1] + CAIDA - 2;
    filas.forEach(f => {
      const hf = Math.max(...f.map(m => m.h)) * esc, wf = f.reduce((a, m) => a + m.w * esc + 4, -4);
      let x = x0 - wf / 2;
      f.forEach(m => {
        const cx = x + m.w * esc / 2, cy = y - hf / 2;
        s += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${esc.toFixed(2)}) translate(${-m.cx} ${-m.cy})">${m.piezas.map(p => esfera(p.x, p.y, radio(p.el), COLOR[p.el] || '#ffa94d')).join('')}</g>`;
        x += m.w * esc + 4;
      });
      y -= hf + 2;
    });
    return s;
  }

  function moverBalanza(angulo, balanceada, sumaR, sumaP) {
    const svg = raiz.querySelector('#bal-svg'), [px, py] = PIV, rad = angulo * Math.PI / 180;
    svg.querySelector('#bal-viga').style.transform = `rotate(${angulo}deg)`;
    [['r', -1], ['p', 1]].forEach(([id, k]) => {
      const dx = k * BRAZO * (Math.cos(rad) - 1), dy = k * BRAZO * Math.sin(rad);
      const g = svg.querySelector('#bal-plato-' + id);
      g.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      g.querySelector('.bal-cont').innerHTML = contenidoPlato(id, px + k * BRAZO);
      g.classList.toggle('ok', balanceada);
    });
    svg.querySelector('#bal-total-r').textContent = `${sumaR} átomos`;
    svg.querySelector('#bal-total-p').textContent = `${sumaP} átomos`;
    const x = px, y = 302;
    svg.querySelector('#bal-cara').innerHTML = `${ojo(x - 10, y - 2, 5)}${ojo(x + 10, y - 2, 5)}` + (balanceada
      ? `<path d="M${x - 8},${y + 8} q8,8 16,0" stroke="#15163d" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="${x - 20}" cy="${y + 6}" r="3.5" fill="#ff6b9d" opacity="0.5"/><circle cx="${x + 20}" cy="${y + 6}" r="3.5" fill="#ff6b9d" opacity="0.5"/>`
      : `<path d="M${x - 7},${y + 11} q7,-5 14,0" stroke="#15163d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`);
  }

  function pista() {
    const eq = lista[indice];
    const k = eq.sol.findIndex((s, j) => coef[j] !== s);
    const msg = raiz.querySelector('#bal-mensaje');
    if (k === -1) return;
    coef[k] = eq.sol[k];
    evaluar();
    if (!msg.classList.contains('ok')) {
      msg.className = 'bal-mensaje aviso';
      msg.innerHTML = `💡 Pista: el coeficiente de ${Util.formula(especies()[k].f)} es <b>${eq.sol[k]}</b>. ¡Sigue con los demás!`;
    }
  }

  return { iniciar, parsear };
})();
