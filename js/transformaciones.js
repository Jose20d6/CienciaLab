// Módulo 1: ¿Cambio físico o químico?
const Transformaciones = (function () {
  const CASOS = [
    // Cambios físicos
    { e: '🧊', t: 'Un cubo de hielo se derrite en un vaso.', r: 'fisico',
      x: 'Es un cambio de estado (fusión). Sigue siendo agua (H₂O): solo pasó de sólido a líquido.' },
    { e: '✂️', t: 'Recortar una hoja de papel en pedacitos.', r: 'fisico',
      x: 'Cambian la forma y el tamaño, pero cada pedacito sigue siendo papel.' },
    { e: '🧂', t: 'Disolver sal en un vaso de agua.', r: 'fisico',
      x: 'La sal no desaparece: sigue ahí (el agua queda salada). Si evaporas el agua, recuperas la sal.' },
    { e: '♨️', t: 'El agua de una pava hierve y sale vapor.', r: 'fisico',
      x: 'Es un cambio de estado (ebullición). El vapor sigue siendo H₂O. ¡No todas las burbujas indican un cambio químico!' },
    { e: '🪞', t: 'El espejo del baño se empaña después de una ducha caliente.', r: 'fisico',
      x: 'El vapor de agua se condensa (pasa de gas a líquido) al tocar el vidrio frío.' },
    { e: '🍫', t: 'Un chocolate se derrite al sol.', r: 'fisico',
      x: 'Es una fusión. Si lo pones en la heladera vuelve a solidificarse y sigue siendo chocolate.' },
    { e: '🧲', t: 'Separar limaduras de hierro mezcladas con arena usando un imán.', r: 'fisico',
      x: 'Es la separación de una mezcla. No se forma ninguna sustancia nueva.' },
    { e: '🌫️', t: 'Un trozo de hielo seco (CO₂ sólido) desprende "humo" sin derretirse.', r: 'fisico',
      x: 'Es una sublimación: el CO₂ pasa directamente de sólido a gas. Sigue siendo CO₂.' },
    { e: '🥫', t: 'Aplastar una lata de aluminio.', r: 'fisico',
      x: 'Solo cambia la forma. El aluminio sigue siendo aluminio.' },
    { e: '🕯️', t: 'La cera de una vela se derrite y gotea.', r: 'fisico',
      x: 'La cera derretida vuelve a solidificarse al enfriarse: es un cambio de estado. (¡Ojo! La llama de la vela sí es un cambio químico).' },
    { e: '🌸', t: 'Un perfume se evapora y su aroma llena la habitación.', r: 'fisico',
      x: 'El perfume pasa de líquido a gas y se dispersa en el aire. Su composición no cambia.' },
    { e: '🍧', t: 'Congelar jugo para hacer un helado de agua.', r: 'fisico',
      x: 'Es una solidificación. Al descongelarlo vuelve a ser jugo líquido.' },
    { e: '📎', t: 'Doblar un clip metálico.', r: 'fisico',
      x: 'Cambia la forma, pero el metal sigue siendo el mismo.' },

    // Cambios químicos
    { e: '🔥', t: 'Quemar una hoja de papel.', r: 'quimico',
      x: 'Es una combustión: el papel reacciona con el oxígeno y se forman cenizas, CO₂ y vapor de agua. Libera luz y calor, y no se puede revertir.' },
    { e: '🍎', t: 'Una manzana cortada se pone marrón.', r: 'quimico',
      x: 'Sustancias de la manzana reaccionan con el oxígeno del aire (oxidación). El cambio de color es una evidencia.' },
    { e: '🔩', t: 'Un clavo se oxida al dejarlo a la intemperie.', r: 'quimico',
      x: 'El hierro reacciona con el oxígeno y el agua y forma óxido de hierro, una sustancia nueva de color rojizo.' },
    { e: '🍳', t: 'Freír un huevo.', r: 'quimico',
      x: 'El calor transforma las proteínas de la clara. No hay forma de "desfreírlo": es irreversible.' },
    { e: '🍞', t: 'Tostar una rebanada de pan.', r: 'quimico',
      x: 'El calor genera sustancias nuevas: cambian el color y el sabor, y aparece olor a tostado.' },
    { e: '🥛', t: 'La leche se corta y huele agria.', r: 'quimico',
      x: 'Las bacterias transforman el azúcar de la leche en ácido láctico: aparecen grumos y un olor nuevo.' },
    { e: '💊', t: 'Una pastilla efervescente burbujea en agua.', r: 'quimico',
      x: 'Un ácido y un bicarbonato de la pastilla reaccionan y forman dióxido de carbono (CO₂): las burbujas son un gas nuevo.' },
    { e: '🎆', t: 'Estallan fuegos artificiales.', r: 'quimico',
      x: 'Es una combustión que libera luz, calor, sonido y humo. Los colores provienen de distintos elementos metálicos.' },
    { e: '🍂', t: 'Las hojas caídas se descomponen y se convierten en abono.', r: 'quimico',
      x: 'Hongos y bacterias transforman la materia orgánica en sustancias nuevas.' },
    { e: '🌿', t: 'Una planta realiza la fotosíntesis.', r: 'quimico',
      x: 'Con la energía de la luz, la planta transforma CO₂ y agua en glucosa y oxígeno.' },
    { e: '🥖', t: 'La masa del pan crece gracias a la levadura.', r: 'quimico',
      x: 'Las levaduras fermentan los azúcares y producen CO₂, que infla la masa.' },
    { e: '🔋', t: 'Una pila hace funcionar una linterna.', r: 'quimico',
      x: 'Dentro de la pila ocurre una reacción química que genera corriente eléctrica.' },
    { e: '🕯️', t: 'La mecha de una vela encendida produce una llama.', r: 'quimico',
      x: 'Es una combustión: la cera en estado gaseoso reacciona con el oxígeno y libera luz, calor, CO₂ y agua.' },
    { e: '🫧', t: 'Mezclar vinagre con bicarbonato de sodio.', r: 'quimico',
      x: 'Se forma dióxido de carbono (las burbujas) y otras sustancias nuevas.' },
  ];
  const RONDA = 10;
  const NOMBRE = { fisico: 'cambio físico', quimico: 'cambio químico' };

  let raiz, casos, indice, puntos, errores, anim = null, bucle = null;

  // ---------- Escena: lo que vemos y lo que pasa con las partículas ----------
  const { esfera, estrellas } = Arte;
  const LUPA = [470, 128], RL = 98, ORBE = [150, 128];
  const ROJO = '#ff6b6b', AZUL = '#5b8def';
  // Ocho moléculas de dos átomos: cuatro "rojas" y cuatro "azules", ordenadas antes del cambio.
  const INICIO = Array.from({ length: 8 }, (_, i) => [LUPA[0] - 66 + (i % 4) * 44, LUPA[1] - 24 + Math.floor(i / 4) * 48 + (i % 2) * 6]);
  const DESPUES = [[-52, -40], [4, -62], [52, -30], [-66, 14], [-12, -8], [40, 22], [-34, 44], [18, 50]].map(([x, y]) => [LUPA[0] + x, LUPA[1] + y]);
  const ANG = [20, -40, 70, 10, -65, 35, -15, 80].map(a => a * Math.PI / 180);
  function atomos(tipo) {
    const lista = [];
    for (let i = 0; i < 8; i++) {
      const color = i < 4 ? ROJO : AZUL, [x, y] = INICIO[i];
      [-1, 1].forEach(k => lista.push({ color, m: i, p0: [x + k * 8, y] }));
    }
    lista.forEach((a, j) => {
      if (tipo === 'quimico') {
        // Cada átomo rojo se junta con uno azul: se forman moléculas nuevas.
        const k = a.color === ROJO ? j : j - 8, lado = a.color === ROJO ? -1 : 1;
        const [cx, cy] = DESPUES[k], ang = ANG[k];
        a.p1 = [cx + lado * 8 * Math.cos(ang), cy + lado * 8 * Math.sin(ang)];
        a.m1 = 100 + k;
      } else {
        const [cx, cy] = DESPUES[a.m], ang = ANG[a.m], lado = j % 2 ? 1 : -1;
        a.p1 = [cx + lado * 8 * Math.cos(ang), cy + lado * 8 * Math.sin(ang)];
        a.m1 = a.m;
      }
    });
    return lista;
  }

  function escenaFija(c) {
    const [lx, ly] = LUPA, [ox, oy] = ORBE;
    return `<defs>
        <radialGradient id="tr-fondo" cx="0.4" cy="0.4" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="tr-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="#ffd166" stop-opacity="0.28"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
        <radialGradient id="tr-lupa" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stop-color="#2c2468"/><stop offset="1" stop-color="#17153f"/></radialGradient>
        <clipPath id="tr-clip"><circle cx="${lx}" cy="${ly}" r="${RL - 3}"/></clipPath>
      </defs>
      <rect width="640" height="256" rx="14" fill="url(#tr-fondo)"/>${estrellas(26, 640, 256)}
      <path d="M${ox},${oy - 72} L${lx},${ly - RL} L${lx},${ly + RL} L${ox},${oy + 72} Z" fill="#b197fc" opacity="0.07"/>
      <path d="M${ox},${oy - 72} L${lx},${ly - RL} M${ox},${oy + 72} L${lx},${ly + RL}" stroke="#c9b8ff" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.5"/>
      <circle cx="${ox}" cy="${oy}" r="104" fill="url(#tr-halo)"/>
      <circle cx="${ox + 5}" cy="${oy + 7}" r="72" fill="#05061a" opacity="0.45"/>
      <circle cx="${ox}" cy="${oy}" r="72" fill="#2a2f76"/><circle cx="${ox}" cy="${oy}" r="72" fill="none" stroke="#ffd166" stroke-width="4"/>
      <path d="M${ox - 50},${oy - 34} a60,60 0 0 1 36,-30" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.45"/>
      <text x="${ox}" y="${oy + 26}" text-anchor="middle" class="tr-emoji">${c.e}</text>
      <text x="${ox}" y="22" text-anchor="middle" class="tr-rotulo">LO QUE VEMOS</text>
      <circle cx="${lx + 6}" cy="${ly + 8}" r="${RL}" fill="#05061a" opacity="0.45"/>
      <circle cx="${lx}" cy="${ly}" r="${RL}" fill="url(#tr-lupa)"/>
      <text x="${lx}" y="18" text-anchor="middle" class="tr-rotulo">🔍 LAS PARTÍCULAS</text>`;
  }

  function dibujarParticulas(ahora) {
    const svg = raiz.querySelector('#tr-part');
    if (!svg) return;
    const [lx, ly] = LUPA, t = ahora / 1000;
    let k = 0, lista = anim ? anim.atomos : atomos('fisico');
    if (anim) k = Math.min(1, (ahora - anim.t0) / 1800);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const amp = 1.2 + (anim && anim.tipo === 'fisico' ? 3 * e : 0);
    let s = '';
    // Enlaces (antes y después) y átomos con volumen.
    const pos = lista.map(a => {
      const m = e < 0.5 ? a.m : a.m1, fase = m * 1.7;
      const x = a.p0[0] + (a.p1 ? (a.p1[0] - a.p0[0]) * e : 0) + Math.sin(t * 3 + fase) * amp;
      const y = a.p0[1] + (a.p1 ? (a.p1[1] - a.p0[1]) * e : 0) + Math.cos(t * 2.6 + fase) * amp;
      return [x, y, m];
    });
    const grupos = {};
    pos.forEach((p, i) => { (grupos[p[2]] = grupos[p[2]] || []).push(i); });
    if (!anim || e > 0.85 || e < 0.15) Object.values(grupos).forEach(g => {
      if (g.length === 2) s += `<line x1="${pos[g[0]][0].toFixed(1)}" y1="${pos[g[0]][1].toFixed(1)}" x2="${pos[g[1]][0].toFixed(1)}" y2="${pos[g[1]][1].toFixed(1)}" stroke="#e9ebff" stroke-width="5" stroke-linecap="round" opacity="0.8"/>`;
    });
    pos.forEach(([x, y], i) => { s += esfera(x, y, 9, lista[i].color); });
    let rotulo = '';
    if (!anim) rotulo = `<g transform="translate(${lx} ${ly + 76})"><rect x="-86" y="-13" width="172" height="24" rx="12" fill="#12143a" stroke="#ffd166" stroke-opacity="0.6"/><text y="4" text-anchor="middle" class="tr-nota">Respondé y mirá qué pasa</text></g>`;
    else if (k >= 1) rotulo = `<g transform="translate(${lx} ${ly + 82})"><rect x="-112" y="-13" width="224" height="24" rx="12" fill="${anim.tipo === 'fisico' ? '#1c7ed6' : '#e8590c'}"/><text y="4" text-anchor="middle" class="tr-nota blanca">${anim.tipo === 'fisico' ? 'Siguen siendo las mismas' : '¡Se formaron sustancias nuevas!'}</text></g>`;
    svg.innerHTML = `<g clip-path="url(#tr-clip)">${s}</g><circle cx="${lx}" cy="${ly}" r="${RL}" fill="none" stroke="#e5dbff" stroke-width="5"/>
      <path d="M${lx - 74},${ly - 50} a${RL - 12},${RL - 12} 0 0 1 48,-38" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.45"/>${rotulo}`;
  }

  function animar(ahora) {
    if (!raiz.hidden) dibujarParticulas(ahora);
    bucle = requestAnimationFrame(animar);
  }

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🔄 ¿Cambio físico o químico?</h1>
        <p>Lee cada situación y decide qué tipo de transformación ocurre. Usa las pistas si lo necesitas.</p>
      </div>
      <div class="grid-juego">
        <div class="panel">
          <div class="marcador">
            <span id="tr-progreso"></span>
            <span id="tr-puntos"></span>
          </div>
          <div class="barra"><div id="tr-barra"></div></div>
          <div id="tr-contenido"></div>
        </div>
        <aside class="panel pistas">
          <h2>¿Cómo los distingo?</h2>
          <div class="pista fisico">
            <h3>🔵 Cambio físico</h3>
            <ul>
              <li>La sustancia <b>sigue siendo la misma</b>.</li>
              <li>Cambia la forma, el tamaño o el estado (sólido, líquido, gaseoso).</li>
              <li>En general es reversible.</li>
            </ul>
          </div>
          <div class="pista quimico">
            <h3>🔴 Cambio químico</h3>
            <p>Se forman <b>sustancias nuevas</b>. Evidencias:</p>
            <ul>
              <li>🎨 Cambio de color</li>
              <li>🫧 Desprendimiento de gas (burbujas)</li>
              <li>⬇️ Aparición de un sólido (precipitado)</li>
              <li>🔥 Liberación o absorción de energía (calor, luz)</li>
              <li>👃 Aparición de un olor</li>
              <li>↩️ En general es irreversible</li>
            </ul>
          </div>
        </aside>
      </div>`;
    nuevaRonda();
  }

  function nuevaRonda() {
    casos = Util.tomar('transformaciones', CASOS, RONDA, c => c.t);
    indice = 0;
    puntos = 0;
    errores = [];
    mostrarCaso();
  }

  function actualizarMarcador() {
    raiz.querySelector('#tr-progreso').textContent = `Situación ${Math.min(indice + 1, RONDA)} de ${RONDA}`;
    raiz.querySelector('#tr-puntos').textContent = `⭐ ${puntos}`;
    raiz.querySelector('#tr-barra').style.width = (indice / RONDA * 100) + '%';
  }

  function mostrarCaso() {
    actualizarMarcador();
    const c = casos[indice];
    const cont = raiz.querySelector('#tr-contenido');
    cont.innerHTML = `
      <div class="tr-escena"><svg viewBox="0 0 640 256" role="img" aria-label="${c.t}"><g id="tr-fijo">${escenaFija(c)}</g><g id="tr-part"></g></svg></div>
      <p class="caso-texto">${c.t}</p>
      <div class="opciones">
        <button class="btn-opcion fisico" data-r="fisico">🔵 Cambio físico</button>
        <button class="btn-opcion quimico" data-r="quimico">🔴 Cambio químico</button>
      </div>
      <div id="tr-feedback"></div>`;
    cont.querySelectorAll('.btn-opcion').forEach(b => b.addEventListener('click', () => responder(b.dataset.r)));
    anim = null;
    if (!bucle) bucle = requestAnimationFrame(animar);
  }

  function responder(r) {
    const c = casos[indice];
    const ok = r === c.r;
    if (ok) puntos++; else errores.push(c);
    anim = { tipo: c.r, t0: performance.now(), atomos: atomos(c.r) };
    raiz.querySelectorAll('.btn-opcion').forEach(b => {
      b.disabled = true;
      if (b.dataset.r === c.r) b.classList.add('correcta');
      else if (b.dataset.r === r) b.classList.add('incorrecta');
    });
    const ultimo = indice === RONDA - 1;
    const fb = raiz.querySelector('#tr-feedback');
    fb.innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'mal'}">
        <p class="fb-titulo">${ok ? '✅ ¡Correcto!' : `❌ No es así: es un ${NOMBRE[c.r]}.`}</p>
        <p>${c.x}</p>
        <button class="btn primario" id="tr-siguiente">${ultimo ? 'Ver resultados' : 'Siguiente →'}</button>
      </div>`;
    actualizarMarcador();
    raiz.querySelector('#tr-puntos').textContent = `⭐ ${puntos}`;
    const sig = fb.querySelector('#tr-siguiente');
    sig.focus();
    sig.addEventListener('click', () => {
      indice++;
      if (indice < RONDA) mostrarCaso(); else mostrarResultado();
    });
  }

  function mostrarResultado() {
    actualizarMarcador();
    const mensaje = puntos === RONDA ? '¡Perfecto! Eres un experto en transformaciones. 🏆'
      : puntos >= 7 ? '¡Muy bien! Repasa los que fallaste.'
      : 'Sigue practicando: revisa las pistas del costado.';
    const repaso = errores.length ? `
      <h3>Para repasar</h3>
      <ul class="lista-repaso">
        ${errores.map(c => `<li><b>${c.e} ${c.t}</b> → ${NOMBRE[c.r]}. ${c.x}</li>`).join('')}
      </ul>` : '';
    raiz.querySelector('#tr-contenido').innerHTML = `
      <div class="resultado-final">
        <div class="emoji-grande">${puntos >= 7 ? '🎉' : '📚'}</div>
        <p class="puntaje-final">${puntos} / ${RONDA}</p>
        <p>${mensaje}</p>
        ${repaso}
        <button class="btn primario" id="tr-otra">Jugar otra ronda</button>
      </div>`;
    raiz.querySelector('#tr-otra').addEventListener('click', nuevaRonda);
  }

  return { iniciar };
})();
