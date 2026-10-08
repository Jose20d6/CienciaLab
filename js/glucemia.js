// Módulo: Glucemia y diabetes. Regulación de la glucosa por insulina y glucagón, índice glucémico y tipos de diabetes.
const Glucemia = (function () {
  const rad = g => g * Math.PI / 180;
  const puntos = (r, angulos) => angulos.map(a => [r * Math.cos(rad(a)), r * Math.sin(rad(a))]);
  const poligono = p => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');


  // IG de referencia: valores aproximados de tablas internacionales. La fibra enlentece la absorción.
  const COMIDAS = [
    { id: 'glucosa', e: '🧪', n: 'Solución de glucosa', corto: 'Glucosa', ig: 100, fibra: 0, x: 'Es glucosa pura: no necesita digerirse y pasa directo a la sangre. Por eso es la <b>referencia</b> del índice glucémico (IG = 100).' },
    { id: 'blanco', e: '🍞', n: 'Pan blanco', corto: 'Pan blanco', ig: 75, fibra: 0, x: 'La harina refinada perdió el salvado y el germen: su almidón se digiere muy rápido y se comporta casi como glucosa.' },
    { id: 'granos', e: '🥖', n: 'Pan de granos enteros', corto: 'Pan de granos', ig: 53, fibra: 0.6, x: 'Los granos enteros y la fibra forman una barrera física que enlentece la digestión del almidón. Ojo: el pan hecho con harina integral fina tiene un IG parecido al blanco (≈ 74).' },
    { id: 'gaseosa', e: '🥤', n: 'Gaseosa', corto: 'Gaseosa', ig: 59, fibra: 0, x: 'Tiene mucho <b>azúcar libre</b> (sacarosa o jarabe de maíz) y nada de fibra. La mitad de la sacarosa es fructosa, que casi no sube la glucemia: por eso su IG no es tan alto como uno esperaría.' },
    { id: 'manzana', e: '🍎', n: 'Manzana entera', corto: 'Manzana', ig: 36, fibra: 1, x: 'Su azúcar es <b>intrínseco</b> (está dentro de las células de la fruta), tiene fibra (pectina y celulosa) y mucha fructosa: la glucemia sube poco y despacio.' },
    { id: 'jugo', e: '🧃', n: 'Jugo de manzana', corto: 'Jugo', ig: 41, fibra: 0, x: 'Al exprimir la fruta se pierde casi toda la fibra y el azúcar pasa a ser <b>libre</b>: sube más rápido que con la manzana entera.' },
    { id: 'madura', e: '🍌', n: 'Banana madura', corto: 'Banana madura', ig: 51, fibra: 0.3, x: 'Al madurar, las enzimas de la fruta hidrolizan el almidón en azúcares simples: es más dulce y sube más la glucemia.' },
    { id: 'verde', e: '🟢', n: 'Banana poco madura', corto: 'Banana verde', ig: 42, fibra: 0.8, x: 'Todavía conserva <b>almidón resistente</b>, que nuestras enzimas digieren lentamente.' },
  ];
  const PERSONAS = ['Sin diabetes', 'Diabetes tipo 1', 'Diabetes tipo 2'];
  // Paleta categórica validada para fondo oscuro (3 series como máximo cuando las líneas se cruzan).
  const COLORES_CURVA = ['#3987e5', '#d95926', '#199e70'];
  const MIN_POR_SEG = 8;
  const clasificarIG = ig => ig >= 70 ? 'alto' : ig > 55 ? 'medio' : 'bajo';

  function nuevaSimulacion(comida) {
    const s = { comida, t: 0, G: 90, I: 0, X: 0, Gc: 0, iny: 0, ejHasta: -1, glucogeno: 55, pts: [90], ins: [0], Ra: 0, captacion: 0, liberacion: 0, renal: 0, max: 90, eventos: new Set() };
    if (comida) {
      s.tp = 20 + (100 - comida.ig) * 0.4 + comida.fibra * 10;
      s.amp = (80 + 130 * comida.ig / 100) / (s.tp * Math.E);
    }
    return s;
  }

  const absorcion = (amp, tp, t) => t > 0 ? amp * (t / tp) * Math.exp(1 - t / tp) : 0;

  // Modelo compartimental simplificado (inspirado en el "modelo mínimo" de Bergman): absorción intestinal,
  // secreción de insulina y glucagón, captación de glucosa por las células, glucógeno del hígado y pérdida renal.
  function pasoGlucemia(s, dt, tipo) {
    // Absorción intestinal: una comida (s.comida) o varias a lo largo del día (s.comidas, en el desafío).
    s.Ra = s.comidas ? s.comidas.reduce((a, c) => a + absorcion(c.amp, c.tp, s.t - c.t0), 0) : s.comida ? absorcion(s.amp, s.tp, s.t) : 0;
    const secrecion = tipo === 1 ? 0 : 0.035 * Math.max(0, s.G - 92) * (tipo === 2 ? 0.8 : 1) * (s.fSecrecion || 1);
    s.I += (secrecion + s.iny * 0.08 - 0.08 * s.I) * dt;
    s.iny -= 0.08 * s.iny * dt;
    const resistencia = tipo === 2 ? 0.15 : 1;
    s.X += 0.035 * (s.I * resistencia * 0.0035 - s.X) * dt;
    s.Gc += ((s.G < 88 ? 0.05 * (88 - s.G) : 0) - 0.08 * s.Gc) * dt;
    s.liberacion = s.glucogeno > 0 ? 1.5 * (s.fGlucagon ?? 1) * s.Gc : 0;
    const ejercicio = s.t < s.ejHasta && s.t >= (s.ejDesde || 0) ? (s.ejFuerza || 0.9) : 0;
    // En el desafío, la insulina sigue actuando aunque la glucemia baje: así una dosis de más produce hipoglucemia.
    const porInsulina = s.X * (s.lineal ? 0.5 * s.G + 55 : s.G);
    s.captacion = porInsulina + ejercicio;
    s.renal = s.G > 180 ? 0.004 * (s.G - 180) : 0;
    s.G += (s.Ra - 0.006 * (s.G - 90) - porInsulina + s.liberacion + (tipo ? 0 : 0.002 * (90 - s.G)) - s.renal - ejercicio) * dt;
    s.glucogeno = Math.max(0, Math.min(100, s.glucogeno + (porInsulina * 0.3 - s.liberacion * 0.8) * dt * 0.08));
    s.t += dt;
    s.max = Math.max(s.max, s.G);
  }

  // Área incremental bajo la curva en las primeras 2 horas: así se mide el IG en el laboratorio.
  const areaBajoCurva = pts => { let a = 0; for (let i = 1; i <= 120; i++) a += Math.max(0, (pts[i] + pts[i - 1]) / 2 - pts[0]); return a; };
  const referencias = {};
  function areaGlucosa(tipo) {
    if (referencias[tipo] === undefined) {
      const s = nuevaSimulacion(COMIDAS[0]);
      while (s.t < 121) { pasoGlucemia(s, 0.5, tipo); if (Number.isInteger(s.t)) s.pts.push(s.G); }
      referencias[tipo] = areaBajoCurva(s.pts);
    }
    return referencias[tipo];
  }

  let glu = null, animGlu = null, curvaEjemplo = null;

  // Curva de ejemplo (glucosa pura en una persona sin diabetes) que se muestra mientras el gráfico está vacío.
  function ejemplo() {
    if (!curvaEjemplo) {
      const s = nuevaSimulacion(COMIDAS[0]);
      while (s.t < 180) { pasoGlucemia(s, 0.5, 0); if (Number.isInteger(s.t)) { s.pts.push(s.G); s.ins.push(s.I); } }
      const max = Math.max(...s.pts);
      curvaEjemplo = { pts: s.pts, ins: s.ins, max, tMax: s.pts.indexOf(max) };
    }
    return curvaEjemplo;
  }

  const ICONO = {
    glucosa: '<svg viewBox="-8 -8 16 16"><polygon points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3" fill="#ffd166"/></svg>',
    insulina: '<svg viewBox="-8 -8 22 16"><circle r="4.5" fill="none" stroke="#5cc8ff" stroke-width="2.4"/><path d="M4,0 h9 M9,0 v4 M12,0 v3" stroke="#5cc8ff" stroke-width="2.4" stroke-linecap="round"/></svg>',
    glucagon: '<svg viewBox="-8 -8 16 16"><path d="M0,-6 C5,0 4,5 0,5 C-4,5 -5,0 0,-6 Z" fill="#ff9f43"/></svg>',
    globulo: '<svg viewBox="-9 -8 18 16"><ellipse rx="7.5" ry="5" fill="#ff6b6b"/><ellipse rx="3.5" ry="2" fill="#c92a2a"/></svg>',
    glucogeno: '<svg viewBox="-9 -9 18 18"><g fill="#ffe066">' + [[0, 0], [-5, -3], [5, -3], [0, -6], [-5, 3], [5, 3], [0, 6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6"/>`).join('') + '</g></svg>',
  };

  // Fichas teóricas: se ven en la pestaña «Para aprender» y el diario enlaza a ellas en el momento justo.
  const FICHAS = [
    { id: 'hormonas', t: '🔑 Insulina y glucagón', html: `
      <table class="bm-tabla-concepto"><thead><tr><th></th><th>Insulina</th><th>Glucagón</th></tr></thead><tbody>
        <tr><td>Dónde se fabrica</td><td>Células β de los islotes del páncreas</td><td>Células α de los islotes del páncreas</td></tr>
        <tr><td>Cuándo se libera</td><td>Cuando la glucemia sube (después de comer)</td><td>Cuando la glucemia baja (ayuno, ejercicio)</td></tr>
        <tr><td>En las células</td><td>Abre la entrada de glucosa (como una llave)</td><td>—</td></tr>
        <tr><td>En el hígado</td><td>Guarda glucosa como glucógeno</td><td>Rompe glucógeno y libera glucosa</td></tr>
        <tr><td>Resultado</td><td>Baja la glucemia</td><td>Sube la glucemia</td></tr></tbody></table>
      <p>Son hormonas <b>proteicas</b> con efectos opuestos (<b>antagónicas</b>): juntas mantienen la glucemia estable. Es un ejemplo de <b>homeostasis</b>.</p>` },
    { id: 'valores', t: '🎯 Valores de referencia', html: `
      <table class="bm-tabla-concepto"><thead><tr><th></th><th>Normal</th><th>Prediabetes</th><th>Diabetes</th></tr></thead><tbody>
        <tr><td>En ayunas (8 h)</td><td>70–99</td><td>100–125</td><td>126 o más</td></tr>
        <tr><td>2 h después de 75 g de glucosa</td><td>menos de 140</td><td>140–199</td><td>200 o más</td></tr></tbody></table>
      <p>Valores en mg/dl. Por debajo de <b>70</b> hay <b>hipoglucemia</b> (temblores, sudor, mareo, confusión). Por encima de ~<b>180</b> los riñones ya no reabsorben toda la glucosa y aparece en la orina (<b>glucosuria</b>).</p>` },
    { id: 'ig', t: '📊 El índice glucémico', html: `
      <p>El <b>IG</b> compara cuánto sube la glucemia un alimento con cuánto la sube la glucosa pura. Se da a 10 personas sanas una porción con <b>50 g de carbohidratos disponibles</b>, se mide la glucemia durante <b>2 horas</b> y se calcula el <b>área bajo la curva</b>:</p>
      <p class="bm-formula">IG = área del alimento ÷ área de la glucosa × 100</p>
      <p>IG <b>bajo</b>: 55 o menos · <b>medio</b>: 56 a 69 · <b>alto</b>: 70 o más. Lo bajan la fibra, las grasas, las proteínas, la acidez y la cocción breve (fideos al dente); lo suben el refinado, la maduración y la cocción prolongada.</p>` },
    { id: 'palabras', t: '🔤 Tres palabras parecidas', html: `
      <ul>
        <li><b>Glucogénesis</b>: glucosa → glucógeno. Se guarda la glucosa; la estimula la insulina.</li>
        <li><b>Glucogenólisis</b>: glucógeno → glucosa. Se usa la reserva; la estimula el glucagón.</li>
        <li><b>Gluconeogénesis</b>: fabricación de glucosa <i>nueva</i> a partir de aminoácidos, lactato o glicerol, en ayunos largos.</li>
      </ul>
      <p class="bm-suave">⚠️ Algunos textos llaman gluconeogénesis al almacenamiento como glucógeno: el término correcto es <b>glucogénesis</b>.</p>` },
    { id: 'diabetes', t: '🩺 Tipos de diabetes', ancho: true, html: `
      <table class="bm-tabla-concepto"><thead><tr><th></th><th>Tipo 1</th><th>Tipo 2</th><th>Gestacional</th></tr></thead><tbody>
        <tr><td>Qué pasa</td><td>El sistema inmune destruye las células β: no hay insulina</td><td>Resistencia a la insulina y, con el tiempo, menos producción</td><td>Resistencia a la insulina por las hormonas del embarazo</td></tr>
        <tr><td>Aparece</td><td>Generalmente en niños y jóvenes</td><td>Generalmente en adultos (cada vez más en jóvenes)</td><td>Durante el embarazo</td></tr>
        <tr><td>Factores</td><td>Autoinmune; no se puede prevenir</td><td>Sedentarismo, sobrepeso, alimentación, herencia</td><td>Sobrepeso, antecedentes familiares</td></tr>
        <tr><td>Tratamiento</td><td>Insulina de por vida</td><td>Alimentación, actividad física y medicamentos (a veces insulina)</td><td>Alimentación y control; suele desaparecer tras el parto</td></tr>
        <tr><td>Frecuencia</td><td>≈ 5–10 % de los casos</td><td>≈ 90 % de los casos</td><td>Una parte de los embarazos</td></tr></tbody></table>` },
  ];
  const verFicha = id => ` <button class="gl-ficha" data-f="${id}">📚 Ver ficha</button>`;

  const RESUMEN_VACIO = `<p class="bm-suave">Cuando pasen las 3 horas vas a ver acá el pico, el valor a las 2 h y el <b>índice glucémico</b> estimado.</p>
    <p class="bm-suave">💡 Compara <b>glucosa</b>, <b>pan blanco</b> y <b>pan de granos</b>, como en el gráfico del trabajo práctico.</p>`;

  let raiz, pestana = 'sim';

  function iniciar(el) {
    raiz = el;
    glu = { tipo: 0, curvas: [], sim: nuevaSimulacion(null), corriendo: false, rapido: false, ultimo: 0, hover: null, area: true, diario: [] };
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🩸 Glucemia y diabetes</h1>
        <p>La <b>glucemia</b> es la concentración de glucosa en la sangre (en ayunas, entre <b>70 y 99 mg/dl</b>). Elige una persona y un alimento, y mira cómo la <b>insulina</b> y el <b>glucagón</b> la mantienen estable.</p>
      </div>
      <div class="segmentado" id="gl-pestanas">
        <button data-p="sim" class="activo">📈 Simulador</button>
        <button data-p="plato">🍽️ Armar el plato</button>
        <button data-p="desafio">🏆 Desafío del día</button>
        <button data-p="aprender">📚 Para aprender</button>
      </div>
      <div id="gl-sim">
        <div class="panel bm-mesa gl-escena">
          <div class="nx-scroll"><svg id="bm-cuerpo" viewBox="-100 0 960 320" role="img" aria-label="Regulación de la glucosa en el cuerpo"></svg></div>
          <div class="bm-refs gl-refs" aria-label="Referencias de la escena">
            <span>${ICONO.glucosa}Glucosa</span><span>${ICONO.globulo}Glóbulo rojo</span><span>${ICONO.insulina}Insulina</span>
            <span>${ICONO.glucagon}Glucagón</span><span>${ICONO.glucogeno}Glucógeno</span>
          </div>
        </div>
        <div class="gl-controles">
          <div class="panel gl-col">
            <h3><span class="gl-num">1</span> La persona</h3>
            <div class="gl-personas" id="bm-glu-persona">${PERSONAS.map((p, i) => `<button data-p="${i}"><span>${['🙂', '💉', '🍩'][i]}</span>${p}</button>`).join('')}</div>
            <p class="bm-suave" id="gl-persona-txt"></p>
          </div>
          <div class="panel gl-col">
            <h3><span class="gl-num">2</span> Qué come <small class="bm-suave">(50 g de carbohidratos)</small></h3>
            <div class="bm-comidas" id="bm-comidas">${COMIDAS.map(c => `<button data-c="${c.id}"><span>${c.e}</span>${c.corto}</button>`).join('')}</div>
            <div class="gl-acciones">
              <button class="btn chico" id="bm-glu-insulina" hidden>💉 Aplicar insulina</button>
              <button class="btn chico" id="bm-glu-ej">🏃 Ejercicio (30 min)</button>
              <button class="btn chico" id="bm-glu-vel">⏩ Más rápido</button>
            </div>
          </div>
          <div class="panel gl-col">
            <h3><span class="gl-num">3</span> ¿Qué está pasando?</h3>
            <ol class="bm-diario" id="bm-glu-diario"></ol>
          </div>
        </div>
        <div class="gl-graficos">
          <div class="panel bm-mesa">
            <div class="bm-graf-cab">
              <h3>Glucemia después de comer</h3>
              <div class="bm-glu-leyenda" id="bm-glu-leyenda"></div>
            </div>
            <svg id="bm-glu-graf" viewBox="0 0 760 270" role="img" aria-label="Gráfico de glucemia en función del tiempo"></svg>
            <h3 class="bm-graf-sub">Insulina en sangre <small>(cantidad relativa)</small></h3>
            <svg id="bm-ins-graf" viewBox="0 0 760 110" role="img" aria-label="Gráfico de insulina en función del tiempo"></svg>
            <div class="bm-acciones">
              <label class="bm-check claro"><input type="checkbox" id="bm-glu-area" checked> Sombrear el área bajo la curva (2 h)</label>
              <button class="btn chico" id="bm-glu-borrar">🗑 Borrar curvas</button>
            </div>
          </div>
          <aside class="panel gl-res">
            <h3>📋 Resultado</h3>
            <div id="bm-glu-resumen">${RESUMEN_VACIO}</div>
          </aside>
        </div>
      </div>
      <div id="gl-plato" hidden></div>
      <div id="gl-desafio" hidden></div>
      <div id="gl-aprender" hidden>
        <div class="gl-fichas">${FICHAS.map(f => `<article class="panel gl-ficha-card${f.ancho ? ' ancho' : ''}" id="gl-f-${f.id}"><h3>${f.t}</h3>${f.html.replace(/<table/g, '<div class="gl-tabla"><table').replace(/<\/table>/g, '</table></div>')}</article>`).join('')}</div>
        <p class="bm-ayuda">El simulador es un modelo simplificado: las curvas reales cambian según la persona, la porción, la cocción y lo que se come junto.</p>
      </div>`;
    const q = s => raiz.querySelector(s);
    raiz.querySelectorAll('#gl-pestanas button').forEach(b => b.addEventListener('click', () => cambiarPestana(b.dataset.p)));
    raiz.querySelectorAll('#bm-glu-persona button').forEach(b => b.addEventListener('click', () => {
      if (glu.corriendo) return;
      glu.tipo = +b.dataset.p;
      pintarControlesGlu();
      anotar('👤', TEXTO_PERSONA[glu.tipo] + (glu.tipo ? verFicha('diabetes') : verFicha('hormonas')), true);
    }));
    raiz.querySelectorAll('#bm-comidas button').forEach(b => b.addEventListener('click', () => comer(COMIDAS.find(c => c.id === b.dataset.c))));
    q('#bm-glu-insulina').addEventListener('click', () => {
      glu.sim.iny += 16;
      glu.sim.inyectada = true;
      anotar('💉', 'Se inyectó <b>insulina</b>: en unos minutos las células empiezan a captar glucosa.');
    });
    q('#bm-glu-ej').addEventListener('click', () => {
      if (!glu.corriendo) { glu.sim = nuevaSimulacion(null); glu.sim.soloEjercicio = true; glu.corriendo = true; glu.diario = []; pintarControlesGlu(); }
      glu.sim.ejHasta = glu.sim.t + 30;
      anotar('🏃', 'Empieza el <b>ejercicio</b>: los músculos que se contraen captan glucosa aunque haya poca insulina.');
    });
    q('#bm-glu-vel').addEventListener('click', () => { glu.rapido = !glu.rapido; q('#bm-glu-vel').textContent = glu.rapido ? '▶ Velocidad normal' : '⏩ Más rápido'; });
    q('#bm-glu-borrar').addEventListener('click', () => { glu.curvas = []; q('#bm-glu-resumen').innerHTML = RESUMEN_VACIO; dibujarGraficosGlu(); });
    q('#bm-glu-area').addEventListener('change', e => { glu.area = e.target.checked; dibujarGraficosGlu(); });
    // Los enlaces «Ver ficha» del diario llevan a la ficha correspondiente.
    q('#bm-glu-diario').addEventListener('click', e => {
      const b = e.target.closest('.gl-ficha');
      if (!b) return;
      cambiarPestana('aprender');
      const f = q('#gl-f-' + b.dataset.f);
      f.scrollIntoView({ behavior: 'smooth', block: 'center' });
      f.classList.remove('destacada'); void f.offsetWidth; f.classList.add('destacada');
    });
    ['#bm-glu-graf', '#bm-ins-graf'].forEach(sel => {
      const graf = q(sel);
      const mover = ev => {
        const r = graf.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width * (glu.W || 760);
        glu.hover = x >= GX0 && x <= GX1 ? Math.round((x - GX0) / (GX1 - GX0) * 180) : null;
        dibujarGraficosGlu();
      };
      graf.addEventListener('pointermove', mover);
      graf.addEventListener('pointerdown', mover);
      graf.addEventListener('pointerleave', () => { glu.hover = null; dibujarGraficosGlu(); });
    });
    pintarControlesGlu();
    anotar('👆', 'Elige un alimento y mira la escena: la glucosa (⬢) entra a la sangre y las hormonas la regulan. La línea punteada del gráfico es un <b>ejemplo</b>.', true);
    glu.ultimo = performance.now();
    animGlu = requestAnimationFrame(bucleGlucemia);
  }

  const TEXTO_PERSONA = [
    '<b>Persona sin diabetes</b>: el páncreas libera insulina cuando sube la glucemia y glucagón cuando baja.',
    '<b>Diabetes tipo 1</b>: el sistema inmune destruyó las células β del páncreas y no hay insulina. Sin ella la glucosa no puede entrar a las células. Se trata con <b>insulina inyectable</b>.',
    '<b>Diabetes tipo 2</b>: el páncreas fabrica insulina, pero las células casi no le responden (<b>resistencia a la insulina</b>).',
  ];

  function cambiarPestana(p) {
    pestana = p;
    raiz.querySelectorAll('#gl-pestanas button').forEach(b => b.classList.toggle('activo', b.dataset.p === p));
    ['sim', 'plato', 'desafio', 'aprender'].forEach(k => { raiz.querySelector('#gl-' + k).hidden = k !== p; });
    // Las actividades extra se arman la primera vez que se abren.
    const cont = raiz.querySelector('#gl-' + p);
    if ((p === 'plato' || p === 'desafio') && !cont.dataset.listo) { cont.dataset.listo = '1'; GluExtra[p](cont); }
  }

  function pintarControlesGlu() {
    raiz.querySelectorAll('#bm-glu-persona button').forEach(b => { b.classList.toggle('activo', +b.dataset.p === glu.tipo); b.disabled = glu.corriendo; });
    raiz.querySelectorAll('#bm-comidas button').forEach(b => { b.disabled = glu.corriendo; });
    raiz.querySelector('#bm-glu-insulina').hidden = !(glu.tipo === 1 && glu.corriendo);
    raiz.querySelector('#gl-persona-txt').innerHTML = TEXTO_PERSONA[glu.tipo];
  }

  // Diario de la simulación: cada evento queda anotado con el minuto en que ocurrió.
  function anotar(icono, html, reiniciar) {
    if (reiniciar) glu.diario = [];
    const min = glu.corriendo ? Math.floor(glu.sim.t) : null;
    glu.diario.push({ icono, html, min });
    raiz.querySelector('#bm-glu-diario').innerHTML = glu.diario.map((d, i) => `<li class="${i === glu.diario.length - 1 ? 'nuevo' : ''}">
      <span class="bm-diario-min">${d.min === null ? '' : `min ${d.min}`}</span><span>${d.icono}</span><p>${d.html}</p></li>`).join('');
    const lista = raiz.querySelector('#bm-glu-diario');
    lista.scrollTop = lista.scrollHeight;
  }

  function comer(c) {
    if (glu.corriendo) return;
    glu.sim = nuevaSimulacion(c);
    glu.corriendo = true;
    pintarControlesGlu();
    raiz.querySelector('#bm-glu-resumen').innerHTML = '';
    glu.diario = [];
    anotar(c.e, `Come <b>${c.n.toLowerCase()}</b>. En la boca y el intestino, las enzimas (amilasa, maltasa, sacarasa, lactasa) hidrolizan los carbohidratos hasta <b>monosacáridos</b>.`);
  }

  function bucleGlucemia(t) {
    animGlu = requestAnimationFrame(bucleGlucemia);
    const dtReal = Math.min(0.1, (t - glu.ultimo) / 1000);
    glu.ultimo = t;
    // Fuera de pantalla (otra sección u otra pestaña) la simulación queda en pausa.
    if (raiz.hidden || pestana !== 'sim') return;
    const s = glu.sim;
    if (glu.corriendo) {
      let min = dtReal * MIN_POR_SEG * (glu.rapido ? 3 : 1);
      while (min > 0 && s.t < 180) {
        const dt = Math.min(0.5, min);
        pasoGlucemia(s, dt, glu.tipo);
        min -= dt;
        while (s.pts.length <= Math.floor(s.t) && s.pts.length <= 180) { s.pts.push(s.G); s.ins.push(s.I); }
        eventosGlucemia(s);
      }
      if (s.t >= 180) terminarSimulacion();
    }
    dibujarCuerpo(t / 1000);
    dibujarGraficosGlu();
  }

  // Cada evento se anota una sola vez por simulación.
  function eventosGlucemia(s) {
    const una = (clave, cond, icono, html) => { if (cond && !s.eventos.has(clave)) { s.eventos.add(clave); anotar(icono, html); } };
    const t1 = glu.tipo === 1, t2 = glu.tipo === 2;
    una('absorcion', s.Ra > 0.4, '⬢', 'Los monosacáridos atraviesan la pared del intestino y pasan a la sangre (<b>absorción</b>). La glucemia empieza a subir.');
    una('insulina', s.I > 2, '🔑', t2 ? 'El páncreas libera <b>insulina</b>, pero las células casi no responden: tienen <b>resistencia a la insulina</b>.' : 'Las células β del páncreas detectan la subida y liberan <b>insulina</b>.' + verFicha('hormonas'));
    una('sin-insulina', t1 && s.G > 130, '🚫', 'La glucemia sube pero <b>no hay insulina</b>: la glucosa se acumula en la sangre. Prueba con 💉 <b>Aplicar insulina</b>.');
    una('captacion', s.X * s.G > 0.5, '🚪', 'Con la insulina, las células abren sus transportadores (GLUT4) y <b>captan glucosa</b>. El hígado la guarda como <b>glucógeno</b> (glucogénesis).' + verFicha('palabras'));
    una('pico', s.comida && s.t > 5 && s.G < s.max - 3, '⛰️', `Se alcanzó el <b>pico</b>: ${Math.round(s.max)} mg/dl. Desde aquí la glucosa sale de la sangre más rápido de lo que entra.`);
    una('hiper', s.G > 180, '⚠️', '<b>Hiperglucemia</b>: más de 180 mg/dl.' + verFicha('valores'));
    una('renal', s.renal > 0.05, '🫘', 'Los riñones no alcanzan a reabsorber toda la glucosa y parte se elimina por la orina (<b>glucosuria</b>).');
    una('glucagon', s.liberacion > 0.3, '🟠', 'La glucemia bajó del valor normal: las células α liberan <b>glucagón</b> y el hígado rompe glucógeno (<b>glucogenólisis</b>) para devolver glucosa a la sangre.' + verFicha('palabras'));
    una('hipo', s.G < 70, '⚠️', '<b>Hipoglucemia</b>: menos de 70 mg/dl.' + verFicha('valores'));
    una('vuelta', s.comida && s.eventos.has('pico') && s.G < 110, '✅', 'La glucemia volvió cerca del valor de ayunas: la <b>homeostasis</b> funcionó.');
  }

  function terminarSimulacion() {
    const s = glu.sim;
    glu.corriendo = false;
    if (!s.comida && s.soloEjercicio) s.comida = { e: '🏃', n: 'Ejercicio en ayunas', corto: 'Ejercicio', ig: null, x: 'Sin comer, el ejercicio bajó la glucemia y el <b>glucagón</b> hizo que el hígado usara su glucógeno para recuperarla.' };
    if (s.comida) {
      const pts = s.pts.slice(0, 181), ins = s.ins.slice(0, 181);
      const extremo = s.soloEjercicio ? Math.min(...pts) : Math.max(...pts);
      const tExtremo = pts.indexOf(extremo);
      const area = areaBajoCurva(pts);
      const igEst = s.soloEjercicio || glu.tipo !== 0 ? null : Math.round(area / areaGlucosa(0) * 100);
      // El color sigue a la curva: una curva nueva usa el color que quedó libre.
      if (glu.curvas.length >= COLORES_CURVA.length) glu.curvas.shift();
      const libre = COLORES_CURVA.find(c => !glu.curvas.some(k => k.color === c));
      const curva = { nombre: s.comida.n + (glu.tipo ? ` · ${PERSONAS[glu.tipo].toLowerCase()}` : ''), corto: s.comida.corto, comida: s.comida, tipo: glu.tipo, pts, ins, extremo, tExtremo, a2h: pts[120], area, igEst, minimo: !!s.soloEjercicio, inyectada: !!s.inyectada, color: libre };
      glu.curvas.push(curva);
      pintarResumen(curva);
      anotar('📊', 'Pasaron 3 horas. Mira el resultado y pasa el dedo o el mouse por el gráfico para leer los valores.' + (igEst !== null ? verFicha('ig') : ''));
    }
    glu.sim = nuevaSimulacion(null);
    glu.sim.G = s.G;
    glu.sim.glucogeno = s.glucogeno;
    pintarControlesGlu();
  }

  function pintarResumen(c) {
    const ref = glu.curvas.find(k => k !== c && k.comida.id === 'glucosa' && k.tipo === c.tipo);
    const comparacion = ref && c.comida.id !== 'glucosa'
      ? `<p>Comparado con la glucosa, el pico fue <b>${Math.round(ref.extremo - c.extremo)} mg/dl más bajo</b> y llegó <b>${c.tExtremo - ref.tExtremo} min ${c.tExtremo >= ref.tExtremo ? 'más tarde' : 'antes'}</b>.</p>` : '';
    const dx2h = c.a2h < 140 ? 'por debajo de 140 mg/dl' : c.a2h < 200 ? 'entre 140 y 199 mg/dl' : '200 mg/dl o más';
    raiz.querySelector('#bm-glu-resumen').innerHTML = `
      <div class="bm-resultado bm-glu-res" style="--c:${c.color}">
        <span class="bm-res-lab">Resultado · ${c.comida.e} ${c.nombre}</span>
        <dl class="bm-glu-datos">
          <div><dt>${c.minimo ? 'Mínimo' : 'Pico'}</dt><dd>${Math.round(c.extremo)} <small>mg/dl</small></dd></div>
          <div><dt>Minuto</dt><dd>${c.tExtremo}</dd></div>
          <div><dt>A las 2 h</dt><dd>${Math.round(c.a2h)} <small>mg/dl</small></dd></div>
          ${c.igEst !== null ? `<div><dt>IG estimado</dt><dd>${c.igEst}</dd></div>` : ''}
        </dl>
        <p>${c.comida.x}</p>
        ${c.igEst !== null && c.tipo === 0 ? `<p>El área bajo su curva es el <b>${c.igEst} %</b> de la de la glucosa → IG estimado <b>${c.igEst}</b>. En las tablas: <b>${c.comida.ig}</b> (IG ${clasificarIG(c.comida.ig)}).</p>` : ''}
        ${c.tipo !== 0 && !c.minimo ? `<p>A las 2 horas la glucemia quedó <b>${dx2h}</b>. ${c.tipo === 1 ? (c.inyectada ? 'La <b>insulina inyectada</b> reemplazó a la que el páncreas no fabrica y permitió bajarla.' : 'Sin insulina el cuerpo no puede bajarla: por eso las personas con diabetes tipo 1 se aplican insulina.') : 'Con resistencia a la insulina la bajada es muy lenta.'} El IG solo se mide en personas sin diabetes.</p>` : ''}
        ${comparacion}
      </div>`;
  }

  // ---------- Gráficos (glucemia e insulina comparten el eje del tiempo) ----------
  const GX0 = 56;
  let GX1 = 740;
  const gx = m => GX0 + m / 180 * (GX1 - GX0);

  function dibujarGraficosGlu() {
    const grafEl = raiz.querySelector('#bm-glu-graf');
    if (!grafEl) return;
    // En pantallas angostas se usa un lienzo más angosto para que los textos no queden diminutos.
    const W = grafEl.clientWidth && grafEl.clientWidth < 560 ? 440 : 760;
    if (glu.W !== W) {
      glu.W = W;
      grafEl.setAttribute('viewBox', `0 0 ${W} 270`);
      raiz.querySelector('#bm-ins-graf').setAttribute('viewBox', `0 0 ${W} 110`);
    }
    GX1 = W - 20;
    const Y = g => 236 - (Math.max(40, Math.min(300, g)) - 40) / 260 * 222;
    const linea = (pts, y) => pts.map((v, i) => `${gx(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const defsGraf = (h, id) => `<defs><radialGradient id="${id}-bg" cx="0.5" cy="0.3" r="0.9"><stop offset="0" stop-color="#1c1f5e"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
      <filter id="${id}-halo" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="3.5"/></filter>
      ${COLORES_CURVA.map((c, i) => `<linearGradient id="${id}-area${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="${c}" stop-opacity="0.04"/></linearGradient>`).join('')}
      <linearGradient id="${id}-hiper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b6b" stop-opacity="0.16"/><stop offset="1" stop-color="#ff6b6b" stop-opacity="0.02"/></linearGradient>
      <linearGradient id="${id}-hipo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5cc8ff" stop-opacity="0.03"/><stop offset="1" stop-color="#5cc8ff" stop-opacity="0.18"/></linearGradient></defs>`;
    // Línea con halo luminoso debajo (estilo ilustración) y trazo nítido encima.
    const trazo = (pts, col, id) => `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="7" opacity="0.45" filter="url(#${id}-halo)"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    const C = glu.curvas, s = glu.sim, corriendo = glu.corriendo && (s.comida || s.soloEjercicio);
    let svg = `${defsGraf(270, 'gg')}<rect width="${W}" height="270" rx="14" fill="url(#gg-bg)"/>
      <rect x="${GX0}" y="${Y(300)}" width="${GX1 - GX0}" height="${Y(180) - Y(300)}" fill="url(#gg-hiper)"/>
      <rect x="${GX0}" y="${Y(70)}" width="${GX1 - GX0}" height="${Y(40) - Y(70)}" fill="url(#gg-hipo)"/>
      <text x="${GX0 + 8}" y="${Y(290)}" class="bm-gg-zona">HIPERGLUCEMIA</text><text x="${GX0 + 8}" y="${Y(46)}" class="bm-gg-zona">HIPOGLUCEMIA</text>`;
    for (let g = 40; g <= 300; g += 20) if (g % 40 === 0) svg += `<line x1="${GX0}" x2="${GX1}" y1="${Y(g)}" y2="${Y(g)}" class="bm-gg-grilla"/><text x="${GX0 - 8}" y="${Y(g) + 4}" text-anchor="end" class="bm-gg-eje">${g}</text>`;
    for (let m = 0; m <= 180; m += W < 600 ? 60 : 30) svg += `<line x1="${gx(m)}" x2="${gx(m)}" y1="${Y(300)}" y2="${Y(40)}" class="bm-gg-grilla v"/><text x="${gx(m)}" y="254" text-anchor="middle" class="bm-gg-eje">${m}</text>`;
    // Líneas de referencia.
    [[70, 'hipoglucemia'], [100, 'límite en ayunas'], [140, 'límite a las 2 h'], [180, 'umbral renal']].forEach(([g, t]) => {
      svg += `<line x1="${GX0}" x2="${GX1}" y1="${Y(g)}" y2="${Y(g)}" class="bm-gg-ref"/><text x="${GX1 - 4}" y="${Y(g) - 4}" text-anchor="end" class="bm-gg-reftxt">${t} (${g})</text>`;
    });
    svg += `<line x1="${gx(120)}" x2="${gx(120)}" y1="${Y(300)}" y2="${Y(40)}" class="bm-gg-ref"/><text x="${gx(120) + 4}" y="${Y(296)}" class="bm-gg-reftxt">2 h</text>
      <text x="${(GX0 + GX1) / 2}" y="268" text-anchor="middle" class="bm-gg-titulo">Tiempo después de comer (minutos)</text>
      <text x="14" y="${Y(170)}" text-anchor="middle" transform="rotate(-90 14 ${Y(170)})" class="bm-gg-titulo">Glucemia (mg/dl)</text>`;
    // Área bajo la curva (primeras 2 h) de la última curva.
    const ultima = C[C.length - 1];
    if (glu.area && ultima && !ultima.minimo) {
      const base = ultima.pts[0];
      const tope = ultima.pts.slice(0, 121).map((g, i) => `${gx(i).toFixed(1)},${Y(Math.max(g, base)).toFixed(1)}`).join(' ');
      svg += `<polygon points="${gx(0)},${Y(base)} ${tope} ${gx(120)},${Y(base)}" fill="url(#gg-area${COLORES_CURVA.indexOf(ultima.color)})"/>
        <text x="${gx(60)}" y="${Y(base) - 6}" text-anchor="middle" class="bm-gg-area">área (2 h)</text>`;
    }
    C.forEach(c => { svg += trazo(linea(c.pts, Y), c.color, 'gg'); });
    if (corriendo) svg += `<polyline points="${linea(s.pts, Y)}" fill="none" stroke="#e9ebff" stroke-width="2.5" stroke-dasharray="6 4"/><circle cx="${gx(s.pts.length - 1)}" cy="${Y(s.G)}" r="5" fill="#e9ebff" stroke="#0e1033" stroke-width="2"/>`;
    // Etiquetas directas en el pico (o mínimo) de cada curva, sin superponerse.
    const etiquetas = C.map(c => ({ c, x: gx(c.tExtremo), y: Y(c.extremo) })).sort((a, b) => a.y - b.y);
    etiquetas.forEach((e, i) => {
      let ly = e.c.minimo ? e.y + 18 : e.y - 10;
      for (let k = 0; k < i; k++) if (Math.abs(etiquetas[k].ly - ly) < 14 && Math.abs(etiquetas[k].x - e.x) < 130) ly = etiquetas[k].ly + 14;
      e.ly = ly;
      svg += `<circle cx="${e.x}" cy="${e.y}" r="9" fill="${e.c.color}" opacity="0.3"/><circle cx="${e.x}" cy="${e.y}" r="5" fill="${e.c.color}" stroke="#0e1033" stroke-width="2"/>
        <text x="${e.x + 8}" y="${ly}" class="bm-gg-etiq">${e.c.corto} · ${Math.round(e.c.extremo)}</text>`;
    });
    // Sin curvas: una curva de ejemplo, tenue, para que el gráfico se entienda desde el principio.
    const vacio = !C.length && !corriendo;
    if (vacio) {
      const ej = ejemplo();
      svg += `<polyline points="${linea(ej.pts, Y)}" fill="none" stroke="#9aa3ff" stroke-width="2" stroke-dasharray="5 5" opacity="0.6"/>
        <text x="${gx(ej.tMax) + 10}" y="${Y(ej.max) - 4}" class="bm-gg-reftxt">ejemplo: glucosa pura, persona sin diabetes</text>
        <text x="${(GX0 + GX1) / 2}" y="${Y(250)}" text-anchor="middle" class="bm-gg-vacio">Elige un alimento para ver su curva de glucemia</text>`;
    }
    svg += cruceta(Y, C.map(c => [c, c.pts]), 'mg/dl', v => Math.round(v), Y(300), Y(40), 236);
    raiz.querySelector('#bm-glu-graf').innerHTML = svg;

    // Gráfico de insulina (pequeño múltiplo con el mismo eje de tiempo).
    const maxI = Math.max(8, ...C.flatMap(c => c.ins), ...(corriendo ? s.ins : [0]), ...(vacio ? ejemplo().ins : [0]));
    const YI = v => 90 - v / maxI * 76;
    let si = `${defsGraf(110, 'gi')}<rect width="${W}" height="110" rx="14" fill="url(#gi-bg)"/>
      <line x1="${GX0}" x2="${GX1}" y1="${YI(0)}" y2="${YI(0)}" class="bm-gg-ejeline"/>
      <text x="${GX0 - 8}" y="${YI(0) + 4}" text-anchor="end" class="bm-gg-eje">0</text><text x="${GX0 - 8}" y="${YI(maxI) + 8}" text-anchor="end" class="bm-gg-eje">máx.</text>`;
    for (let m = 0; m <= 180; m += W < 600 ? 60 : 30) si += `<line x1="${gx(m)}" x2="${gx(m)}" y1="${YI(maxI)}" y2="${YI(0)}" class="bm-gg-grilla v"/><text x="${gx(m)}" y="106" text-anchor="middle" class="bm-gg-eje">${m}</text>`;
    C.forEach(c => { si += `<polygon points="${gx(0)},${YI(0)} ${linea(c.ins, YI)} ${gx(c.ins.length - 1)},${YI(0)}" fill="url(#gi-area${COLORES_CURVA.indexOf(c.color)})" opacity="0.6"/>` + trazo(linea(c.ins, YI), c.color, 'gi'); });
    if (corriendo) si += `<polyline points="${linea(s.ins, YI)}" fill="none" stroke="#e9ebff" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    if (vacio) si += `<polyline points="${linea(ejemplo().ins, YI)}" fill="none" stroke="#9aa3ff" stroke-width="2" stroke-dasharray="5 5" opacity="0.6"/>`;
    const sinIns = C.find(c => c.tipo === 1) || (corriendo && glu.tipo === 1);
    const inyectada = C.some(c => c.tipo === 1 && c.inyectada) || (corriendo && glu.tipo === 1 && s.inyectada);
    if (sinIns) si += `<text x="${gx(inyectada ? 20 : 90)}" y="${YI(0) - 8}" text-anchor="${inyectada ? 'start' : 'middle'}" class="bm-gg-reftxt">${inyectada ? 'diabetes tipo 1: solo hay la insulina inyectada' : 'diabetes tipo 1: la insulina queda en cero'}</text>`;
    si += cruceta(YI, C.map(c => [c, c.ins]), '', v => v < 0.5 ? 'casi nada' : v < maxI * 0.3 ? 'baja' : v < maxI * 0.65 ? 'media' : 'alta', YI(maxI), YI(0), 90, true);
    raiz.querySelector('#bm-ins-graf').innerHTML = si;
    pintarLeyendaGlu();
  }

  // Línea vertical y recuadro con los valores de cada curva en el minuto señalado.
  function cruceta(Y, series, unidad, fmt, yTop, yBase, _yb, chico) {
    const m = glu.hover;
    if (m === null || !series.length) return '';
    const x = gx(m);
    const filas = series.map(([c, pts]) => [c.color, `${c.corto}: ${fmt(pts[Math.min(m, pts.length - 1)])}${unidad ? ' ' + unidad : ''}`]);
    const ancho = 210, alto = (chico ? 8 : 24) + filas.length * 16;
    const bx = x > (glu.W || 760) - ancho - 30 ? x - ancho - 10 : x + 10, by = chico ? 6 : 14;
    return `<line x1="${x}" x2="${x}" y1="${yTop}" y2="${yBase}" class="bm-gg-cruz"/>
      ${series.map(([c, pts]) => `<circle cx="${x}" cy="${Y(pts[Math.min(m, pts.length - 1)])}" r="4.5" fill="${c.color}" stroke="#0e1033" stroke-width="2"/>`).join('')}
      <rect x="${bx}" y="${by}" width="${ancho}" height="${alto}" rx="8" class="bm-gg-tip"/>
      ${chico ? '' : `<text x="${bx + 10}" y="${by + 17}" class="bm-gg-tiptxt fuerte">Minuto ${m}</text>`}
      ${filas.map(([col, t], i) => `<rect x="${bx + 10}" y="${by + (chico ? 10 : 26) + i * 16}" width="12" height="3" rx="1.5" fill="${col}"/><text x="${bx + 28}" y="${by + (chico ? 15 : 31) + i * 16}" class="bm-gg-tiptxt">${t}</text>`).join('')}`;
  }

  function pintarLeyendaGlu() {
    const cont = raiz.querySelector('#bm-glu-leyenda');
    const html = glu.curvas.map((c, i) => `<span><i style="background:${c.color}"></i>${c.comida.e} ${c.nombre}<button data-i="${i}" aria-label="Quitar ${c.nombre}">×</button></span>`).join('')
      + (glu.corriendo && (glu.sim.comida || glu.sim.soloEjercicio) ? `<span><i class="enCurso"></i>En curso</span>` : '');
    if (cont.dataset.html === html) return;
    cont.dataset.html = html;
    cont.innerHTML = html || '<span class="bm-suave">Hasta 3 curvas para comparar</span>';
    cont.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { glu.curvas.splice(+b.dataset.i, 1); dibujarGraficosGlu(); }));
  }

  // ---------- Escena del cuerpo (estilo ilustración de divulgación) ----------
  // Capa fija (fondo y órganos, se redibuja solo cuando cambia el ánimo de los órganos) y capa animada (partículas).

  // Vaso sanguíneo: curva suave; vasoY(x) da su centro para que las partículas sigan la curva.
  const VASO = 'M-120,172 C-100,171 -71,167 -20,160 C150,138 300,182 450,160 S650,140 780,158 C819,163 850,168 880,168';
  const VASO_PTS = (() => {
    const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return p0 * u * u * u + 3 * p1 * u * u * t + 3 * p2 * u * t * t + p3 * t * t * t; };
    const tramos = [[[-120, 172], [-100, 171], [-71, 167], [-20, 160]], [[-20, 160], [150, 138], [300, 182], [450, 160]], [[450, 160], [600, 138], [650, 140], [780, 158]], [[780, 158], [819, 163], [850, 168], [880, 168]]];
    const pts = [];
    tramos.forEach(([a, b, c, d]) => { for (let i = 0; i <= 100; i++) { const t = i / 100; pts.push([bez(a[0], b[0], c[0], d[0], t), bez(a[1], b[1], c[1], d[1], t)]); } });
    return pts;
  })();
  function vasoY(x) {
    let i = VASO_PTS.findIndex(p => p[0] >= x);
    if (i <= 0) return VASO_PTS[Math.max(0, i)][1];
    const [a, b] = [VASO_PTS[i - 1], VASO_PTS[i]];
    return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0] || 1);
  }

  // Cara de los órganos: ojos grandes y una boca que cambia según lo que les pasa.
  function cara(x, y, r, animo) {
    const boca = {
      feliz: `<path d="M${x - r * 0.9},${y + r * 1.5} q${r * 0.9},${r * 0.9} ${r * 1.8},0" stroke="#15163d" stroke-width="${r * 0.32}" fill="none" stroke-linecap="round"/>`,
      triste: `<path d="M${x - r * 0.8},${y + r * 2} q${r * 0.8},${-r * 0.8} ${r * 1.6},0" stroke="#15163d" stroke-width="${r * 0.32}" fill="none" stroke-linecap="round"/>`,
      preocupado: `<path d="M${x - r * 0.8},${y + r * 1.8} q${r * 0.4},${-r * 0.4} ${r * 0.8},0 t${r * 0.8},0" stroke="#15163d" stroke-width="${r * 0.3}" fill="none" stroke-linecap="round"/>`,
      comiendo: `<ellipse cx="${x}" cy="${y + r * 1.7}" rx="${r * 0.6}" ry="${r * 0.55}" fill="#15163d"/><ellipse cx="${x}" cy="${y + r * 1.95}" rx="${r * 0.35}" ry="${r * 0.2}" fill="#ff8fab"/>`,
      esfuerzo: `<path d="M${x - r * 0.9},${y + r * 1.6} h${r * 1.8}" stroke="#15163d" stroke-width="${r * 0.32}" stroke-linecap="round"/>`,
    }[animo] || '';
    const cejas = animo === 'preocupado' || animo === 'triste'
      ? `<path d="M${x - r * 2.2},${y - r * 1.5} l${r * 1.4},${r * 0.5} M${x + r * 2.2},${y - r * 1.5} l${-r * 1.4},${r * 0.5}" stroke="#15163d" stroke-width="${r * 0.28}" stroke-linecap="round"/>` : '';
    const mejillas = animo === 'feliz' || animo === 'comiendo' ? `<circle cx="${x - r * 2.1}" cy="${y + r * 1.1}" r="${r * 0.55}" fill="#ff6b9d" opacity="0.45"/><circle cx="${x + r * 2.1}" cy="${y + r * 1.1}" r="${r * 0.55}" fill="#ff6b9d" opacity="0.45"/>` : '';
    return `${Arte.ojo(x - r * 1.2, y, r)}${Arte.ojo(x + r * 1.2, y, r)}${cejas}${mejillas}${boca}`;
  }

  // Tejido de fondo: células grandes y lejanas, apenas visibles, que dan profundidad.
  const TEJIDO = [[70, 60, 60], [250, 250, 46], [420, 40, 40], [560, 300, 54], [760, 70, 58], [380, 300, 30], [150, 130, 26], [700, 200, 30], [-60, 262, 44], [-30, 120, 24], [830, 262, 50], [850, 92, 30]]
    .map(([x, y, r], i) => `<g opacity="0.5"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.82}" fill="#1b1f5c"/><ellipse cx="${x + r * 0.15}" cy="${y - r * 0.1}" rx="${r * 0.36}" ry="${r * 0.3}" fill="#232867"/>
      <path d="M${x - r * 0.7},${y - r * 0.35} a${r * 0.8},${r * 0.65} 0 0 1 ${r * 0.55},${-r * 0.35}" stroke="#2b3079" stroke-width="${2 + (i % 2)}" fill="none" stroke-linecap="round"/></g>`).join('');
  function animosOrganos(s) {
    const t1 = glu.tipo === 1, t2 = glu.tipo === 2;
    return {
      estomago: s.comida && glu.corriendo && s.Ra > 0.05 ? 'comiendo' : 'feliz',
      pancreas: t1 ? 'triste' : s.G > 180 ? 'preocupado' : s.I > 2 || s.Gc > 0.15 ? 'esfuerzo' : 'feliz',
      higado: s.liberacion > 0.2 ? 'esfuerzo' : s.X * s.G > 0.3 ? 'comiendo' : 'feliz',
      celulas: s.t < s.ejHasta ? 'esfuerzo' : s.captacion > 0.3 ? 'comiendo' : (t1 || t2) && s.G > 150 ? 'triste' : 'feliz',
      rinon: s.renal > 0.02 ? 'preocupado' : 'feliz',
    };
  }

  function escenaFija(a) {
    const esofago = 'M52,206 C46,180 54,150 70,130';
    return `
      <rect x="-100" width="960" height="320" rx="12" fill="url(#bm-c-fondo)"/>
      ${TEJIDO}
      <!-- Estómago e intestino -->
      <path d="${esofago}" stroke="#c9486b" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${esofago}" stroke="#ff8fab" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M100,262 C130,300 170,250 205,282 S265,300 292,268" stroke="#b83a5e" stroke-width="30" fill="none" stroke-linecap="round"/>
      <path d="M100,262 C130,300 170,250 205,282 S265,300 292,268" stroke="#ff8fab" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M104,256 C132,292 170,244 205,275 S262,292 288,262" stroke="#ffd1dc" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M100,262 C130,300 170,250 205,282 S265,300 292,268" stroke="#ffc2d1" stroke-width="9" fill="none" stroke-dasharray="2 8" stroke-linecap="round" opacity="0.8"/>
      <g transform="translate(66 246) scale(0.9)">
        ${Arte.dosTonos('<path d="M-22,-50 C6,-66 44,-50 44,-14 C44,22 16,46 -16,44 C-44,42 -58,18 -48,-2 C-40,-18 -34,-38 -22,-50 Z" fill="FILL"/>', '#ff8fab', '#e0607f', { x: 14 })}
        <path d="M-30,-30 q10,6 4,18 M-36,4 q12,2 12,14 M-8,-44 q-4,10 4,16" stroke="#ffd1dc" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.55"/>
        <path d="M-12,-54 a50,40 0 0 1 36,2" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4"/>
        ${cara(2, -6, 6, a.estomago)}</g>
      <text x="60" y="310" text-anchor="middle" class="bm-rotulo">ESTÓMAGO</text>
      <text x="306" y="282" class="bm-rotulo">INTESTINO</text>
      <!-- Vaso sanguíneo -->
      <path d="${VASO}" stroke="#4a0d27" stroke-width="66" fill="none" opacity="0.5"/>
      <path d="${VASO}" stroke="#7a1838" stroke-width="60" fill="none"/>
      <path d="${VASO}" stroke="#a51f4c" stroke-width="46" fill="none"/>
      <path d="${VASO}" stroke="#8c1a41" stroke-width="16" fill="none" transform="translate(0 15)" opacity="0.7"/>
      <path d="${VASO}" stroke="#ff8fab" stroke-width="3" fill="none" transform="translate(0 -18)" opacity="0.45"/>
      <path d="${VASO}" stroke="#ff8fab" stroke-width="6" fill="none" transform="translate(0 -12)" opacity="0.18"/>
      <text x="122" y="202" class="bm-rotulo">SANGRE</text>
      <!-- Páncreas -->
      <g transform="translate(330 62)">
        ${Arte.dosTonos(`<path d="M-80,6 C-80,-18 -40,-26 -4,-18 C30,-10 64,-28 84,-12 C98,2 76,24 44,20 C12,16 -22,28 -54,24 C-72,22 -80,14 -80,6 Z" fill="FILL"/>${[[-62, -8, 12], [-38, -18, 13], [-12, -16, 12], [16, -12, 12], [44, -20, 13], [70, -16, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="FILL"/>`).join('')}`, '#ffd166', '#f0a830', { y: 6 })}
        <path d="M-68,-8 a12,10 0 0 1 16,-8 M-44,-18 a12,10 0 0 1 16,-4" stroke="#fff3c4" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.7"/>
        ${cara(-22, 0, 6.5, a.pancreas)}
        <text x="0" y="-40" text-anchor="middle" class="bm-rotulo">PÁNCREAS</text></g>
      <!-- Hígado -->
      <g transform="translate(612 66)">
        ${Arte.dosTonos('<path d="M-92,-10 C-84,-44 10,-50 70,-30 C104,-18 96,18 58,30 C22,42 -24,44 -58,30 C-86,20 -96,6 -92,-10 Z" fill="FILL"/>', '#e0694e', '#b54c38', { y: 8 })}
        <path d="M-6,-44 C-10,-10 -6,20 2,38" stroke="#b54c38" stroke-width="4" fill="none" opacity="0.7"/>
        <path d="M-78,-20 a60,30 0 0 1 50,-22" stroke="#ffb199" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.55"/>
        ${cara(-46, -6, 6.5, a.higado)}
        <text x="0" y="-52" text-anchor="middle" class="bm-rotulo">HÍGADO</text></g>
      <!-- Células musculares -->
      ${[-66, 0, 66].map(dx => `<g transform="translate(${500 + dx} 262)">
        <ellipse rx="31" ry="25" fill="#5a63d8" opacity="0.35"/>
        ${Arte.dosTonos('<ellipse rx="28" ry="22" fill="FILL"/>', '#8c96ff', '#6570e0', { x: 9 })}
        <ellipse cx="9" cy="6" rx="8" ry="6.5" fill="#b197fc" opacity="0.75"/>
        <path d="M-18,-10 a22,16 0 0 1 14,-8" stroke="#dfe3ff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
        ${cara(-8, 0, 3.6, a.celulas)}</g>`).join('')}
      <text x="500" y="308" text-anchor="middle" class="bm-rotulo">CÉLULAS DEL MÚSCULO${glu.tipo === 2 ? ' · RESISTENTES' : ''}</text>
      <!-- Riñón -->
      <g transform="translate(700 256)">
        <path d="M-10,8 C-22,18 -24,30 -26,42" stroke="#e8a0b0" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${Arte.dosTonos('<path d="M-2,-30 C24,-34 36,-8 30,14 C24,34 0,38 -14,26 C-6,16 -4,4 -12,-6 C-20,-18 -16,-28 -2,-30 Z" fill="FILL"/>', '#d0606a', '#a8434e', { x: 12 })}
        <path d="M-10,-24 a24,20 0 0 1 22,0" stroke="#ffb3bd" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
        ${cara(6, -2, 3.8, a.rinon)}</g>
      <text x="712" y="312" text-anchor="middle" class="bm-rotulo">RIÑÓN</text>`;
  }

  function dibujarCuerpo(seg) {
    const svg = raiz.querySelector('#bm-cuerpo');
    const s = glu.sim, G = s.G;
    if (!svg.querySelector('#bm-c-fija')) {
      svg.innerHTML = `<defs>
          <radialGradient id="bm-c-fondo" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
          <radialGradient id="bm-c-vineta" cx="0.5" cy="0.5" r="0.75"><stop offset="0.65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>
          <filter id="bm-c-brillo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs><g id="bm-c-fija"></g><g id="bm-c-din"></g><rect x="-100" width="960" height="320" rx="12" fill="url(#bm-c-vineta)" pointer-events="none"/><g id="bm-c-ui"></g>`;
    }
    const animo = animosOrganos(s);
    const clave = glu.tipo + JSON.stringify(animo);
    if (glu.claveEscena !== clave) {
      glu.claveEscena = clave;
      svg.querySelector('#bm-c-fija').innerHTML = escenaFija(animo);
    }
    const flujo = (n, dur, fn) => Array.from({ length: n }, (_, k) => fn(((seg / dur) + k / n) % 1, k)).join('');
    const hexa = (x, y, r = 5) => `<polygon points="${poligono(puntos(r, [-90, -30, 30, 90, 150, 210]).map(([a, b]) => [a + x, b + y]))}" fill="#ffd166"/>`;
    const llave = (x, y) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="4.8" fill="none" stroke="#7fd3ff" stroke-width="2.6"/><path d="M4.5,0 h9 M9.5,0 v4.5 M12.5,0 v3.2" stroke="#7fd3ff" stroke-width="2.6" stroke-linecap="round"/></g>`;
    const gota = (x, y) => `<path d="M${x.toFixed(1)},${(y - 7).toFixed(1)} c6,7 5,12 0,12 c-5,0 -6,-5 0,-12 Z" fill="#ffa94d"/>`;
    const globulo = (x, y, r, ang, alfa) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang})" opacity="${alfa}"><ellipse rx="${r}" ry="${r * 0.62}" fill="#ff5c7a"/><ellipse rx="${r * 0.5}" ry="${r * 0.28}" fill="#c9184a"/><path d="M${-r * 0.7},${-r * 0.3} a${r},${r * 0.55} 0 0 1 ${r * 0.9},${-r * 0.25}" stroke="#ffb3c1" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`;
    const ejercicio = s.t < s.ejHasta;
    const apertura = Math.min(1, s.captacion / 1.6);
    let d = '';
    // Glóbulos rojos: unos más atrás (chicos y translúcidos) y otros adelante.
    d += flujo(10, 14, (p, k) => { const x = -110 + p * 980; return globulo(x, vasoY(x) - 12 + ((k * 29) % 24), k % 3 ? 7 : 9, (k * 47) % 180, k % 3 ? 0.55 : 0.95); });
    // Glucosa en la sangre: más partículas cuanto mayor la glucemia.
    const n = Math.max(4, Math.min(42, Math.round((G - 30) / 5.6)));
    let brillan = flujo(n, 10, (p, k) => { const x = -110 + p * 980; return hexa(x, vasoY(x) - 13 + ((k * 37) % 26), 4.6); });
    if (s.Ra > 0.08) brillan += flujo(Math.min(7, Math.ceil(s.Ra * 3)), 1.8, (p, k) => { const x = 150 + (k % 4) * 36; return hexa(x, 268 - p * (268 - vasoY(x)), 4.4); });
    if (s.captacion > 0.3) brillan += flujo(Math.min(7, Math.ceil(s.captacion * 2.6)), 1.4, (p, k) => { const x = 434 + (k % 3) * 66; return hexa(x, vasoY(x) + 16 + p * 62, 4); });
    if (s.X * s.G > 0.3) brillan += flujo(3, 1.8, p => hexa(640 - p * 16, vasoY(640) - 18 - p * 52, 4));
    if (s.liberacion > 0.2) brillan += flujo(Math.min(5, Math.ceil(s.liberacion * 2)), 1.6, p => hexa(586 + p * 8, 96 + p * (vasoY(590) - 110), 4.4));
    if (s.renal > 0.02) brillan += flujo(3, 1.4, p => hexa(700, vasoY(700) + 18 + p * 52, 4));
    // Insulina (desde las células β) y glucagón (desde las α).
    const nIns = Math.min(7, Math.round(s.I / 1.2));
    if (nIns > 0) brillan += flujo(nIns, 3.2, p => p < 0.35 ? llave(356 + p * 40, 76 + p / 0.35 * (vasoY(370) - 80)) : p < 0.75 ? llave(370 + (p - 0.35) / 0.4 * 130, vasoY(370 + (p - 0.35) / 0.4 * 130) + 4) : llave(500 + (p - 0.75) * 40, vasoY(500) + 20 + (p - 0.75) / 0.25 * 44));
    if (s.Gc > 0.15) brillan += flujo(Math.min(5, Math.ceil(s.Gc * 2)), 2.4, p => gota(372 + p * 170, 58 - Math.sin(p * Math.PI) * 34));
    d += `<g filter="url(#bm-c-brillo)">${brillan}</g>`;
    // Islotes del páncreas: brillan cuando secretan.
    const bIns = Math.min(1, s.I / 6), bGlc = Math.min(1, s.Gc / 1.5);
    d += `<g filter="url(#bm-c-brillo)">
      ${[[354, 70], [370, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${5 + bIns * 3}" fill="${glu.tipo === 1 ? '#6b6f9e' : '#7fd3ff'}" opacity="${0.55 + bIns * 0.45}"/>`).join('')}
      <circle cx="388" cy="66" r="${5 + bGlc * 3}" fill="#ffa94d" opacity="${0.55 + bGlc * 0.45}"/></g>
      <text x="354" y="73" text-anchor="middle" class="bm-letra mini" fill="#15163d">β</text><text x="370" y="63" text-anchor="middle" class="bm-letra mini" fill="#15163d">β</text><text x="388" y="69" text-anchor="middle" class="bm-letra mini" fill="#15163d">α</text>`;
    // Glucógeno del hígado: gránulos en forma de roseta.
    const nGluc = Math.round(s.glucogeno / 100 * 22);
    d += `<g transform="translate(648 60)" filter="url(#bm-c-brillo)">${Array.from({ length: nGluc }, (_, k) => { const a = k * 2.4, r = 3.8 * Math.sqrt(k); return `<circle cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a) * 0.8).toFixed(1)}" r="2.7" fill="#ffe066"/>`; }).join('')}</g>
      <text x="648" y="96" text-anchor="middle" class="bm-letra chica" fill="#fff">glucógeno ${Math.round(s.glucogeno)} %</text>`;
    // Transportadores de glucosa en las células (se abren con la insulina).
    d += [-66, 0, 66].map(dx => { const x = 500 + dx, c = glu.tipo === 2 ? '#9aa0c8' : '#d0bfff'; return `<rect x="${x - 6 - apertura * 5}" y="236" width="5" height="10" rx="2" fill="${c}"/><rect x="${x + 1 + apertura * 5}" y="236" width="5" height="10" rx="2" fill="${c}"/>`; }).join('');
    if (ejercicio) d += flujo(3, 0.9, (p, k) => `<path d="M${440 + k * 66},${248 - p * 16} q-4,6 0,9 q4,-3 0,-9 Z" fill="#9ec5ff" opacity="${1 - p}"/>`);
    // Alimento en el estómago mientras se digiere.
    if (s.comida && glu.corriendo && s.Ra > 0.05 && s.comida.e) d += `<text x="48" y="${278 + Math.sin(seg * 3) * 2}" font-size="16" text-anchor="middle">${s.comida.e}</text>`;
    svg.querySelector('#bm-c-din').innerHTML = d;
    // Carteles de proceso y marcador de glucemia (arriba de la viñeta).
    const etiqueta = (x, y, texto, activo) => activo ? `<g><rect x="${x - texto.length * 3.3 - 9}" y="${y - 11}" width="${texto.length * 6.6 + 18}" height="18" rx="9" fill="#12143a" stroke="#ffd166" stroke-width="1.3"/><text x="${x}" y="${y + 1.5}" text-anchor="middle" class="bm-proceso">${texto}</text></g>` : '';
    const estado = G > 180 ? ['HIPERGLUCEMIA', '#ff6b6b'] : G < 70 ? ['HIPOGLUCEMIA', '#5cc8ff'] : G > 140 ? ['ELEVADA', '#ffa94d'] : ['NORMAL', '#2fd186'];
    const lleno = Math.max(0, Math.min(1, (G - 40) / 260));
    svg.querySelector('#bm-c-ui').innerHTML = etiqueta(232, 226, 'absorción', s.Ra > 0.1)
      + etiqueta(436, 104, 'insulina', s.I > 1.5)
      + etiqueta(560, 212, 'captación', s.captacion > 0.3)
      + etiqueta(540, 118, s.liberacion > 0.2 ? 'glucogenólisis' : 'glucogénesis', s.liberacion > 0.2 || s.X * s.G > 0.3)
      + etiqueta(470, 24, 'glucagón', s.Gc > 0.15)
      + etiqueta(704, 222, 'glucosuria', s.renal > 0.02)
      + `<g transform="translate(-84 14)"><rect width="182" height="86" rx="14" fill="#12143a" opacity="0.92"/><rect width="182" height="86" rx="14" fill="none" stroke="${estado[1]}" stroke-width="2"/>
        <text x="14" y="22" class="bm-rotulo">GLUCEMIA</text>
        <text x="14" y="58" class="bm-glu-num" fill="${estado[1]}">${Math.round(G)}</text><text x="${Math.round(G) >= 100 ? 92 : 74}" y="58" class="bm-letra" fill="#c9ccf5">mg/dl</text>
        <rect x="14" y="68" width="154" height="6" rx="3" fill="#23266b"/><rect x="14" y="68" width="${(154 * lleno).toFixed(1)}" height="6" rx="3" fill="${estado[1]}"/>
        <text x="168" y="22" text-anchor="end" class="bm-letra chica" fill="${estado[1]}">${estado[0]}</text>
        ${glu.corriendo ? `<text x="168" y="84" text-anchor="end" class="bm-letra mini" fill="#9aa3ff">minuto ${Math.floor(s.t)}</text>` : ''}</g>`;
  }

  return { iniciar, modelo: { COMIDAS, COLORES_CURVA, nuevaSimulacion, pasoGlucemia, areaBajoCurva, cara } };
})();
