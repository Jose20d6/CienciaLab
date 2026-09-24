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

  let raiz, casos, indice, puntos, errores;

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
      <div class="tarjeta-caso">
        <div class="emoji-grande">${c.e}</div>
        <p class="caso-texto">${c.t}</p>
      </div>
      <div class="opciones">
        <button class="btn-opcion fisico" data-r="fisico">🔵 Cambio físico</button>
        <button class="btn-opcion quimico" data-r="quimico">🔴 Cambio químico</button>
      </div>
      <div id="tr-feedback"></div>`;
    cont.querySelectorAll('.btn-opcion').forEach(b => b.addEventListener('click', () => responder(b.dataset.r)));
  }

  function responder(r) {
    const c = casos[indice];
    const ok = r === c.r;
    if (ok) puntos++; else errores.push(c);
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
