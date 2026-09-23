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
        <div class="balanza" id="bal-balanza">
          <div class="viga">
            <div class="plato izq"><span id="bal-total-r"></span></div>
            <div class="plato der"><span id="bal-total-p"></span></div>
          </div>
          <div class="pie"></div>
        </div>
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
    raiz.querySelector('#bal-total-r').textContent = `Reactivos: ${sumaR} átomos`;
    raiz.querySelector('#bal-total-p').textContent = `Productos: ${sumaP} átomos`;
    const angulo = balanceada ? 0 : Math.max(-14, Math.min(14, (sumaP - sumaR) * 3 || 4));
    const balanza = raiz.querySelector('#bal-balanza');
    balanza.style.setProperty('--angulo', angulo + 'deg');
    balanza.classList.toggle('equilibrada', balanceada);

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
