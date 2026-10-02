// Módulo 6: Efecto invernadero.
// Modelo simplificado: la temperatura de equilibrio sube 3 °C cada vez que se duplica el CO₂
// (sensibilidad climática), partiendo de 14 °C con 280 ppm (era preindustrial).
const Invernadero = (function () {
  const T_BASE = 14, CO2_BASE = 280, SENSIBILIDAD = 3, T_SIN_ATMOSFERA = -18;
  const CO2_MIN = 150, CO2_MAX = 1200;
  const CH4_BASE = 700, CH4_MIN = 350, CH4_MAX = 4000; // metano en partes por mil millones (ppb)
  // Forzamiento radiativo (W/m²) → temperatura: con λ, duplicar el CO₂ da +3 °C.
  const LAMBDA = 3 / (5.35 * Math.LN2);
  const ANIO_INICIAL = 1850, MS_POR_ANIO = 350, TAU = 8; // TAU: años que tarda en acercarse al equilibrio
  const VENTANA = 150; // años visibles en el gráfico
  const W = 1000, H = 400; // escena (ancha, para aprovechar toda la pantalla)
  const DX = 200; // el paisaje se dibujó para 600 px de ancho: se corre al centro
  // El planeta se ve como un gran arco en la parte de abajo; la atmósfera es una franja alrededor.
  const PX = 300 + DX, PY = 1060, PR = 760, ATM = 170;
  const SOL = { x: 46, y: 44 };

  const PRESETS = [
    { ppm: 180, ch4: 380, texto: '🧊 Glaciación', sub: '180 ppm · 380 ppb' },
    { ppm: 280, ch4: 700, texto: '🏭 Antes de la industria', sub: '280 ppm · 700 ppb' },
    { ppm: 420, ch4: 1900, texto: '📍 Hoy', sub: '≈ 420 ppm · 1900 ppb' },
    { ppm: 900, ch4: 3500, texto: '🔥 Año 2100 (muchas emisiones)', sub: '≈ 900 ppm · 3500 ppb' },
  ];
  const ACCIONES_CH4 = [
    { d: 300, texto: '🐄 Más ganado', sub: '+300 ppb de metano' },
    { d: 150, texto: '🌾 Arrozales y basurales', sub: '+150 ppb' },
    { d: 200, texto: '⛽ Pérdidas de gas natural', sub: '+200 ppb' },
    { d: -300, texto: '♻️ Aprovechar el biogás', sub: '−300 ppb' },
  ];
  const ACCIONES = [
    { d: 40, texto: '🚗 Quemar combustibles fósiles', sub: '+40 ppm' },
    { d: 15, texto: '🪓 Talar bosques', sub: '+15 ppm' },
    { d: -15, texto: '🌳 Plantar bosques', sub: '−15 ppm' },
    { d: -25, texto: '🏭 Capturar carbono', sub: '−25 ppm' },
  ];
  const CONSECUENCIAS = [
    { hasta: -1, icono: '🧊', texto: 'Clima más frío: los glaciares avanzan, como en las glaciaciones.' },
    { hasta: 0.5, icono: '🌤️', texto: 'Clima estable, parecido al de antes de la Revolución Industrial.' },
    { hasta: 1.5, icono: '🌡️', texto: 'Más olas de calor y lluvias intensas. Los glaciares de montaña retroceden.' },
    { hasta: 2, icono: '🪸', texto: 'Blanqueamiento de corales y sequías más fuertes.' },
    { hasta: 3, icono: '🌊', texto: 'Deshielo de Groenlandia y la Antártida: sube el nivel del mar.' },
    { hasta: Infinity, icono: '⚠️', texto: 'Cambios muy graves: costas inundadas y muchas especies no llegan a adaptarse.' },
  ];

  let raiz, canvas, ctx, grafico;
  let ppm = 420, ch4 = 1900, aerosol = 0, conAlbedo = true, sinAtmosfera = false, T = null, anio = ANIO_INICIAL, historial = [];
  let pausado = false, ultimo = 0, acumulado = 0, fotones = [], moleculas = [], ceniza = [];
  let cuenta = { escapan: 0, vuelven: 0, solar: 0, reflejados: 0 };
  let activo = false, velocidad = 1;
  const VELOCIDADES = [{ f: 0.4, texto: '🐢 Lenta' }, { f: 1, texto: 'Normal' }, { f: 2.5, texto: '🐇 Rápida' }];

  // Cada efecto empuja la temperatura: CO₂ y metano calientan; el hielo que se derrite refleja menos luz
  // (calienta más, retroalimentación del albedo) y la ceniza de un volcán tapa el sol (enfría).
  // El albedo depende de cuánto hielo queda, que a su vez depende de la temperatura:
  // se busca la temperatura de equilibrio que es coherente consigo misma (retroalimentación).
  const forzantes = () => {
    const f = { co2: 5.35 * Math.log(ppm / CO2_BASE), ch4: 0.036 * (Math.sqrt(ch4) - Math.sqrt(CH4_BASE)), volcan: -2.5 * aerosol, albedo: 0 };
    if (conAlbedo) {
      let a = LAMBDA * (f.co2 + f.ch4 + f.volcan);
      for (let i = 0; i < 30; i++) { f.albedo = 1.2 * (1 - estadoHielo(a).hielo); a = LAMBDA * (f.co2 + f.ch4 + f.volcan + f.albedo); }
    }
    return f;
  };
  const tEquilibrio = () => {
    if (sinAtmosfera) return T_SIN_ATMOSFERA;
    const f = forzantes();
    return T_BASE + LAMBDA * (f.co2 + f.ch4 + f.albedo + f.volcan);
  };
  // Probabilidad de que el calor (infrarrojo) sea absorbido y devuelto por los gases.
  const pAbsorcion = () => (sinAtmosfera ? 0 : 1 - Math.exp(-(ppm / 380 + ch4 / 6000)));
  // Fracción de la luz del sol que se refleja: nubes (fija) + hielo (cambia con la temperatura).
  const pHielo = () => 0.2 * Math.min(1.3, estadoHielo((T ?? T_BASE) - T_BASE).hielo);

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🌍 Efecto invernadero</h1>
        <p>El Sol calienta la Tierra y la Tierra devuelve ese calor como <b>radiación infrarroja</b>. Gases como el <b>CO₂</b> atrapan parte de ese calor.
        Cambia la cantidad de CO₂ y observa qué pasa con la temperatura.</p>
      </div>
      <div class="inv-grid">
        <div class="panel inv-escena-panel">
          <div class="inv-escena-scroll"><div class="inv-escena">
            <svg viewBox="0 0 ${W} ${H}" class="inv-fondo" id="inv-fondo" aria-hidden="true"></svg>
            <canvas id="inv-canvas" aria-label="Animación de la radiación solar y el calor"></canvas>
          </div></div>
          <div class="inv-leyenda">
            <span><i style="background:#ffe08a;box-shadow:0 0 6px #ffd166"></i>Luz del Sol</span>
            <span><i style="background:#ff7a45;box-shadow:0 0 6px #ff5a36"></i>Calor (infrarrojo)</span>
            <span><b class="kz-co2"><i></i><i></i><i></i></b>Molécula de CO₂</span>
            <span><b class="kz-ch4"><i></i><i></i><i></i><i></i><i></i></b>Molécula de metano</span>
            <span><i style="background:#f8f9ff;box-shadow:0 0 6px #fff"></i>Luz reflejada</span>
          </div>
          <p class="inv-balance" id="inv-balance"></p>
          <div class="inv-velocidad">
            <span>Velocidad:</span>
            <div class="segmentado oscuro" id="inv-vel">${VELOCIDADES.map(v => `<button data-f="${v.f}">${v.texto}</button>`).join('')}</div>
            <button class="inv-pausa-escena" id="inv-pausa2">⏸ Pausar</button>
          </div>
        </div>

        <div class="panel inv-controles">
          <div class="inv-col">
          <div class="inv-lecturas">
            <div><span class="inv-num" id="inv-temp"></span><span class="inv-lab">Temperatura media</span></div>
            <div><span class="inv-num" id="inv-ppm"></span><span class="inv-lab">CO₂ en el aire</span></div>
            <div><span class="inv-num" id="inv-anio"></span><span class="inv-lab">Año simulado</span></div>
            <div><span class="inv-num" id="inv-hielo"></span><span class="inv-lab">Hielo en las montañas</span></div>
            <div><span class="inv-num" id="inv-ch4"></span><span class="inv-lab">Metano en el aire</span></div>
            <div><span class="inv-num" id="inv-refleja"></span><span class="inv-lab">Luz del sol reflejada</span></div>
          </div>
          <label class="inv-slider-lab" for="inv-slider">Cantidad de CO₂ (partes por millón)</label>
          <input type="range" id="inv-slider" min="${CO2_MIN}" max="${CO2_MAX}" step="10">
          <div class="inv-escala"><span>${CO2_MIN}</span><span>${CO2_MAX} ppm</span></div>
          <label class="inv-slider-lab" for="inv-slider-ch4">Cantidad de metano, CH₄ (partes por mil millones)</label>
          <input type="range" id="inv-slider-ch4" min="${CH4_MIN}" max="${CH4_MAX}" step="50">
          <div class="inv-escala"><span>${CH4_MIN}</span><span>${CH4_MAX} ppb</span></div>
          </div>
          <div class="inv-col">

          <h3>Momentos de la historia</h3>
          <div class="inv-botones">${PRESETS.map(p => `<button class="inv-btn" data-ppm="${p.ppm}" data-ch4="${p.ch4}">${p.texto}<small>${p.sub}</small></button>`).join('')}</div>
          <h3>Metano: ¿de dónde sale?</h3>
          <div class="inv-botones">${ACCIONES_CH4.map(a => `<button class="inv-btn ${a.d > 0 ? 'sube' : 'baja'}" data-d4="${a.d}">${a.texto}<small>${a.sub}</small></button>`).join('')}</div>
          </div>
          <div class="inv-col">
          <h3>¿Qué hacemos los humanos?</h3>
          <div class="inv-botones">${ACCIONES.map(a => `<button class="inv-btn ${a.d > 0 ? 'sube' : 'baja'}" data-d="${a.d}">${a.texto}<small>${a.sub}</small></button>`).join('')}</div>

          <h3>La naturaleza también influye</h3>
          <button class="inv-btn inv-volcan" id="inv-volcan">🌋 Erupción volcánica<small>La ceniza tapa parte del sol durante unos años</small></button>
          <label class="inv-check"><input type="checkbox" id="inv-albedo" checked> Efecto albedo: el hielo refleja la luz del sol</label>
          <label class="inv-check"><input type="checkbox" id="inv-sin-atm"> Quitar los gases de efecto invernadero</label>
          <div class="inv-consecuencia" id="inv-consecuencia"></div>
          </div>
        </div>
      </div>

      <div class="panel inv-grafico-panel">
        <div class="inv-grafico-cab">
          <h2>Temperatura media de la Tierra</h2>
          <div class="inv-grafico-botones">
            <button class="btn chico" id="inv-pausa">⏸ Pausar</button>
            <button class="btn chico" id="inv-reiniciar">↺ Reiniciar desde 1850</button>
          </div>
        </div>
        <div class="inv-grafico" id="inv-grafico">
          <svg id="inv-svg-grafico" viewBox="0 0 1000 250" role="img" aria-label="Gráfico de la temperatura media a lo largo de los años"></svg>
          <div class="inv-tooltip" id="inv-tooltip" hidden></div>
        </div>
        <p class="inv-nota">Modelo simplificado: la temperatura se acerca de a poco al valor de equilibrio, que sube unos 3 °C cada vez que se duplica el CO₂. El metano atrapa mucho más calor por molécula, pero hay mucho menos. Con el efecto albedo, al derretirse el hielo se refleja menos luz y la Tierra se calienta todavía más. La ceniza de un volcán enfría la Tierra durante algunos años. La línea punteada marca los 14 °C de antes de la industria; 🌋 marca las erupciones.</p>
      </div>`;

    canvas = raiz.querySelector('#inv-canvas');
    ctx = canvas.getContext('2d');
    grafico = raiz.querySelector('#inv-svg-grafico');
    dibujarFondo();

    const slider = raiz.querySelector('#inv-slider');
    slider.addEventListener('input', () => cambiarCO2(+slider.value));
    raiz.querySelectorAll('.inv-btn[data-ppm]').forEach(b => b.addEventListener('click', () => { cambiarCH4(+b.dataset.ch4); cambiarCO2(+b.dataset.ppm); }));
    const sliderCH4 = raiz.querySelector('#inv-slider-ch4');
    sliderCH4.addEventListener('input', () => cambiarCH4(+sliderCH4.value));
    raiz.querySelectorAll('.inv-btn[data-d4]').forEach(b => b.addEventListener('click', () => cambiarCH4(ch4 + +b.dataset.d4)));
    raiz.querySelector('#inv-volcan').addEventListener('click', erupcion);
    raiz.querySelector('#inv-albedo').addEventListener('change', e => { conAlbedo = e.target.checked; actualizarLecturas(); });
    raiz.querySelectorAll('.inv-btn[data-d]').forEach(b => b.addEventListener('click', () => cambiarCO2(ppm + +b.dataset.d)));
    raiz.querySelector('#inv-sin-atm').addEventListener('change', e => { sinAtmosfera = e.target.checked; actualizarLecturas(); dibujarFondo(); });
    const alternarPausa = () => {
      pausado = !pausado;
      ['#inv-pausa', '#inv-pausa2'].forEach(id => { raiz.querySelector(id).textContent = pausado ? '▶ Continuar' : '⏸ Pausar'; });
    };
    raiz.querySelector('#inv-pausa').addEventListener('click', alternarPausa);
    raiz.querySelector('#inv-pausa2').addEventListener('click', alternarPausa);
    const marcarVelocidad = () => raiz.querySelectorAll('#inv-vel button').forEach(b => b.classList.toggle('activo', +b.dataset.f === velocidad));
    raiz.querySelectorAll('#inv-vel button').forEach(b => b.addEventListener('click', () => { velocidad = +b.dataset.f; marcarVelocidad(); }));
    marcarVelocidad();
    raiz.querySelector('#inv-reiniciar').addEventListener('click', reiniciar);
    grafico.addEventListener('pointermove', mostrarTooltip);
    grafico.addEventListener('pointerleave', () => { raiz.querySelector('#inv-tooltip').hidden = true; dibujarGrafico(); });

    reiniciar();
    window.addEventListener('resize', ajustarCanvas);
    ajustarCanvas();
    activo = true;
    requestAnimationFrame(bucle);
  }

  function reiniciar() {
    ppm = 280;
    ch4 = CH4_BASE;
    aerosol = 0;
    anio = ANIO_INICIAL;
    T = tEquilibrio();
    historial = [{ anio, T, ppm, ch4 }];
    cuenta = { escapan: 0, vuelven: 0, solar: 0, reflejados: 0 };
    raiz.querySelector('#inv-slider').value = ppm;
    raiz.querySelector('#inv-slider-ch4').value = ch4;
    dibujarFondo();
    actualizarLecturas();
    dibujarGrafico();
  }

  function cambiarCH4(v) {
    ch4 = Math.max(CH4_MIN, Math.min(CH4_MAX, Math.round(v)));
    raiz.querySelector('#inv-slider-ch4').value = ch4;
    actualizarLecturas();
  }

  function erupcion() {
    aerosol = Math.min(1.5, aerosol + 1);
    dibujarFondo();
    actualizarLecturas();
  }

  function cambiarCO2(v) {
    ppm = Math.max(CO2_MIN, Math.min(CO2_MAX, Math.round(v)));
    raiz.querySelector('#inv-slider').value = ppm;
    actualizarLecturas();
  }

  function ajustarCanvas() {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, r.width * dpr);
    canvas.height = Math.max(1, r.height * dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  }

  // ---------- Escena ----------

  const superficie = x => PY - Math.sqrt(PR * PR - (x - PX) * (x - PX));
  // Color de la atmósfera según la temperatura: celeste frío → turquesa → naranja → rojo.
  function colorAtmosfera(anomalia) {
    const paradas = [[-4, [120, 190, 255]], [0, [64, 224, 208]], [2, [255, 170, 80]], [5, [255, 80, 70]]];
    let i = 0;
    while (i < paradas.length - 2 && anomalia > paradas[i + 1][0]) i++;
    const [a0, c0] = paradas[i], [a1, c1] = paradas[i + 1];
    const f = Math.max(0, Math.min(1, (anomalia - a0) / (a1 - a0)));
    return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * f)).join(',')})`;
  }

  // Estrellas fijas (misma posición en cada dibujo).
  const ESTRELLAS = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 97.13) % W, y = (i * 53.71) % 230;
    return { x, y, r: 0.6 + ((i * 7) % 5) * 0.25, tit: i % 4 === 0 };
  });

  // Cuánto hielo queda y cuánto sube (o baja) el mar según la temperatura.
  function estadoHielo(anomalia) {
    const hielo = Math.max(0.1, Math.min(1.35, 1 - anomalia * 0.2));
    const derretido = Math.max(0, Math.min(1, (1 - hielo) / 0.9));
    const glaciacion = Math.max(0, Math.min(1, (hielo - 1) / 0.35));
    return { hielo, derretido, glaciacion, subida: 14 * derretido - 5 * glaciacion, avance: 75 * derretido - 22 * glaciacion };
  }

  function dibujarFondo() {
    // El paisaje usa sus coordenadas originales (0 a 600) dentro de un grupo corrido DX.
    const PX = 300, superficie = x => PY - Math.sqrt(PR * PR - (x - PX) * (x - PX));
    const anomalia = (T ?? tEquilibrio()) - T_BASE;
    const atm = colorAtmosfera(anomalia);
    const { hielo, derretido, subida, avance } = estadoHielo(anomalia);
    const sx = x => superficie(x).toFixed(1);
    // Borde de la tierra siguiendo la curva del planeta (un poco por encima de la superficie).
    const curva = (a, b) => { const p = []; for (let x = a; x < b; x += 16) p.push(`${x.toFixed(1)},${(superficie(x) - 20).toFixed(1)}`); p.push(`${b.toFixed(1)},${(superficie(b) - 20).toFixed(1)}`); return p.join(' L'); };
    const costaI = 112 - avance * 0.6, costaD = 248 + avance; // las costas avanzan tierra adentro cuando sube el mar

    const { sombra, dosTonos, ojo, pino, pajaro, vaca, fabrica } = Arte;
    // Con mucho calor el pasto y los árboles se secan.
    const seco = anomalia > 3.2 ? 2 : anomalia > 2 ? 1 : 0;
    const [hojaC, hojaO, hojaB] = [['#2fd186', '#1a9a61', '#9df5c8'], ['#a8d65a', '#7fae3a', '#e4f7a8'], ['#e0b44f', '#b98a30', '#fbe3a0']][seco];
    const arbol = (x, h) => {
      if (x < costaD + 6) return '';
      const y = superficie(x), r = h * 0.36;
      return `<g>${sombra(x + 2, y + 1, r * 1.2)}
        ${dosTonos(`<path d="M${x - 1.6},${y + 1} L${x - 1},${y - h * 0.5} L${x + 1},${y - h * 0.5} L${x + 1.6},${y + 1} Z" fill="FILL"/>`, '#7a543f', '#5a3c30', { x })}
        ${dosTonos(`<rect x="${x - r}" y="${y - h}" width="${r * 2}" height="${h * 0.62}" rx="${r}" fill="FILL"/><circle cx="${x - r * 0.75}" cy="${y - h * 0.45}" r="${r * 0.5}" fill="FILL"/><circle cx="${x + r * 0.7}" cy="${y - h * 0.46}" r="${r * 0.55}" fill="FILL"/>`, hojaC, hojaO, { x: x + r * 0.15 })}
        <path d="M${x - r * 0.62},${y - h * 0.72} a${r * 0.75},${r * 0.75} 0 0 1 ${r * 0.5},${-r * 0.42}" stroke="${hojaB}" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.7"/></g>`;
    };
    const edificio = (x, w, h, c) => {
      const yb = superficie(x + w / 2) + 3, y0 = yb - h - 3;
      let ventanas = '';
      for (let yy = y0 + 4; yy < yb - 6; yy += 6) for (let xx = x + 2.5; xx < x + w - 4; xx += 4.5) {
        if ((xx * 7 + yy * 3) % 5 > 1) ventanas += `<rect x="${xx.toFixed(1)}" y="${yy.toFixed(1)}" width="2" height="2.6" rx="0.6" fill="#ffe8a3" opacity="0.9"/>`;
      }
      return `${sombra(x + w / 2 + 2, yb - 2, w * 0.7)}<rect x="${x}" y="${y0}" width="${w}" height="${h + 3}" rx="1.5" fill="${c}"/>
        <rect x="${x + w - 3.5}" y="${y0}" width="3.5" height="${h + 3}" fill="#000" opacity="0.18"/>
        <rect x="${x - 0.8}" y="${y0 - 1.6}" width="${w + 1.6}" height="2.4" rx="1.2" fill="#9aa6ff"/>${ventanas}`;
    };
    // Oso polar sobre un témpano que se achica al derretirse (o nadando si ya no queda hielo).
    const tx = 158, ty = superficie(tx) - Math.max(0, subida) * 0.2;
    const tw = 22 * Math.min(1.25, Math.max(0, 1 - derretido * 1.15) + 0.25 * estadoHielo(anomalia).glaciacion);
    const oso = (x, y, s, nadando) => `<g transform="translate(${x} ${y}) scale(${s})">
      ${nadando ? `<path d="M-26,4 q6,-4 12,0 t12,0 M4,5 q6,-4 12,0" stroke="#bcd6ff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.8"/>` : `
      ${[-14, -5, 7, 15].map(lx => `<rect x="${lx - 3.5}" y="2" width="7" height="12" rx="3.5" fill="${lx < 0 ? '#e3e7ff' : '#cfd5f7'}"/>`).join('')}
      ${dosTonos('<rect x="-20" y="-14" width="44" height="22" rx="11" fill="FILL"/>', '#f4f6ff', '#cfd4f5', { y: 0 })}
      <circle cx="24" cy="-6" r="3.5" fill="#f4f6ff"/>`}
      <g transform="translate(-20 ${nadando ? 0 : -12})">
        <circle cx="-5" cy="-9" r="3.6" fill="#f4f6ff"/><circle cx="-5" cy="-9" r="1.8" fill="#cfd4f5"/>
        <circle cx="5" cy="-9.5" r="3.6" fill="#f4f6ff"/><circle cx="5" cy="-9.5" r="1.8" fill="#cfd4f5"/>
        ${dosTonos('<circle cx="0" cy="0" r="10" fill="FILL"/>', '#f4f6ff', '#d8ddf8', { x: 4 })}
        <ellipse cx="-7" cy="3.5" rx="6" ry="4.4" fill="#fff"/><ellipse cx="-11.2" cy="2" rx="2.3" ry="1.7" fill="#2b2d42"/>
        ${ojo(-3, -2.5, 2.8)}
        ${nadando ? '<path d="M-10,-7 l4,1.5 M-1,-7.5 l-3,2" stroke="#2b2d42" stroke-width="1" stroke-linecap="round"/>' : ''}</g>
      ${nadando ? `<rect x="-40" y="2" width="60" height="16" fill="url(#kz-mar)"/><path d="M-40,2 q5,-2.5 10,0 t10,0 t10,0 t10,0 t10,0 t10,0" stroke="#dbe9ff" stroke-width="1.4" fill="none"/>` : ''}</g>`;
    const tempano = tw < 4 ? oso(tx, ty, 0.42, true) : `<g>
      <path d="M${tx - tw * 0.9},${ty + 1} L${tx + tw * 0.9},${ty + 1} L${tx + tw * 0.6},${ty + 7} L${tx - tw * 0.55},${ty + 6} Z" fill="#bcd6ff" opacity="0.35"/>
      ${dosTonos(`<path d="M${tx - tw},${ty + 1} L${tx - tw + 3},${ty - 4} L${tx + tw - 5},${ty - 5} L${tx + tw},${ty + 1} Z" fill="FILL"/>`, '#f4f6ff', '#b9c6ff', { y: ty - 1 })}
      ${oso(tx + 2, ty - 10, 0.42, false)}</g>`;
    const molino = (x, e) => {
      const y = superficie(x);
      return `<g transform="translate(${x} ${y}) scale(${e})">${sombra(4, 2, 16)}
        ${dosTonos('<path d="M-3,0 L-1.6,-110 H1.6 L3,0 Z" fill="FILL"/>', '#f1f3ff', '#c9d1ff', { x: 0.5 })}
        <g transform="translate(0 -112)"><g class="kz-aspas">${[0, 120, 240].map(a => `<path d="M0,0 C4,-12 3,-40 0,-52 C-2,-40 -3,-12 0,0 Z" fill="#f1f3ff" transform="rotate(${a})"/>`).join('')}</g>
        <circle r="4.5" fill="#9aa6ff"/></g></g>`;
    };
    // Volcán: dormido, o en erupción con lava y una columna de ceniza.
    // Volcán: girado según la curva del planeta para que toda la base apoye en el suelo.
    // Dormido, o en erupción con lava y una columna de ceniza (que sale siempre hacia arriba).
    const volcan = () => {
      const x = 16, y = superficie(x), h = 44, w = 38, act = aerosol > 0.05;
      const giro = Math.atan((x - PX) / Math.sqrt(PR * PR - (x - PX) * (x - PX)));
      const cx = x + h * Math.sin(giro), cy = y - h * Math.cos(giro);
      const columna = act ? Array.from({ length: 7 }, (_, i) => `<circle cx="${(cx + Math.sin(i * 1.7) * (4 + i * 3)).toFixed(1)}" cy="${(cy - 10 - i * 17 * Math.min(1, aerosol)).toFixed(1)}" r="${(7 + i * 3.4 * Math.min(1.2, aerosol)).toFixed(1)}" fill="${i < 2 ? '#7a6f78' : '#9a929e'}" opacity="${0.95 - i * 0.08}"/>`).join('') : '';
      return `<g>${sombra(x + 4, y + 3, w)}
        <g transform="translate(${x} ${y}) rotate(${(giro * 180 / Math.PI).toFixed(1)})">
        <path d="M${-w - 4},10 L${-w},4 L-8,${-h} H8 L${w},4 L${w + 4},10 Z" fill="#7b5c5c"/>
        <path d="M2,${-h} H8 L${w},4 L${w + 4},10 H10 Z" fill="#5a4040"/>
        <path d="M${-w},4 L-8,${-h}" stroke="#a88a8a" stroke-width="1.6" opacity="0.7"/>
        <ellipse cx="0" cy="${-h}" rx="9" ry="3" fill="${act ? '#ff8a3d' : '#3e2b2b'}"/>
        ${act ? `<path d="M-3,${-h + 1} q-6,14 -14,${h - 6} M4,${-h + 1} q4,16 12,${h - 4}" stroke="#ff6b2d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <circle cx="0" cy="${-h}" r="16" fill="#ff922b" opacity="0.35"/>` : ''}</g>
        ${columna}</g>`;
    };
    const montania = (x, w, h) => `
      <path d="M${x - w},${sx(x - w)} L${x},${superficie(x) - h} L${x + w},${sx(x + w)} Z" fill="#3d4a8a"/>
      <path d="M${x},${superficie(x) - h} L${x + w},${sx(x + w)} L${x + w * 0.3},${sx(x + w * 0.3)} Z" fill="#2a3468"/>
      <path d="M${x - w},${sx(x - w)} L${x},${superficie(x) - h}" stroke="#9fb0ff" stroke-width="1.6" opacity="0.7"/>`;
    const nieve = (x, w, h) => {
      const k = hielo, hy = superficie(x) - h;
      return `<path d="M${x - w * 0.42 * k},${hy + h * 0.42 * k} L${x},${hy} L${x + w * 0.42 * k},${hy + h * 0.42 * k} L${x + w * 0.18 * k},${hy + h * 0.34 * k} L${x},${hy + h * 0.44 * k} L${x - w * 0.2 * k},${hy + h * 0.34 * k} Z" fill="#f1f3ff"/>
        <path d="M${x},${hy} L${x + w * 0.42 * k},${hy + h * 0.42 * k} L${x + w * 0.18 * k},${hy + h * 0.34 * k} L${x},${hy + h * 0.44 * k} Z" fill="#c9d1ff"/>`;
    };
    // Agua que cubre las zonas bajas cuando sube el nivel del mar.
    // Suba del mar: la costa avanza tierra adentro. Lo que antes era tierra queda bajo agua clara y poco
    // profunda; hay arena en la orilla actual y una marca punteada donde estaba la costa en 1850.
    const C0I = 112, C0D = 248;
    const banda = (a, b, prof) => {
      if (b - a < 1) return '';
      const arriba = [], abajo = [];
      for (let x = a; x <= b + 0.01; x += Math.max(2, (b - a) / 12)) { arriba.push(`${x.toFixed(1)},${sx(x)}`); abajo.unshift(`${x.toFixed(1)},${(superficie(x) + prof).toFixed(1)}`); }
      return `M${arriba.join(' L')} L${abajo.join(' L')} Z`;
    };
    let inundacion = '';
    if (avance > 1) {
      const zonas = banda(costaI, C0I, 22) + banda(C0D, costaD, 22);
      inundacion += `<path d="${zonas}" fill="#74c0fc" opacity="0.55"/>
        ${[C0I, C0D].map(x => `<path d="M${x},${(superficie(x) - 14).toFixed(1)} V${(superficie(x) + 16).toFixed(1)}" stroke="#ffd166" stroke-width="1.6" stroke-dasharray="3 3"/>`).join('')}
        ${costaD - C0D > 45 ? `<text x="${((C0D + costaD) / 2).toFixed(1)}" y="${(superficie((C0D + costaD) / 2) + 34).toFixed(1)}" text-anchor="middle" class="kz-rotulo chico">ZONA INUNDADA</text>` : ''}
        ${Array.from({ length: Math.floor((costaD - C0D) / 18) }, (_, k) => { const x = C0D + 9 + k * 18; return `<g opacity="0.55"><rect x="${x - 1.2}" y="${(superficie(x) - 1).toFixed(1)}" width="2.4" height="8" fill="#6e4529"/><circle cx="${x}" cy="${(superficie(x) + 1).toFixed(1)}" r="4" fill="#2f9e44"/></g>`; }).join('')}`;
    }
    // Arena en la orilla actual de cada lado.
    inundacion += `<path d="${banda(costaI - 12, costaI, 5)}${banda(costaD, costaD + 12, 5)}" fill="#f1d9a6"/>`;
    // Olas suaves sobre todo el mar.
    const olas = [];
    for (let x = costaI + 2; x <= costaD - 2; x += 6) olas.push(`${x.toFixed(1)},${(superficie(x) - 1.2 + Math.sin(x * 0.45) * 1.2).toFixed(1)}`);
    inundacion += `<path d="M${olas.join(' L')}" stroke="#d0ebff" stroke-width="1.6" fill="none" opacity="0.85" stroke-linejoin="round"/>`;

    // Regla de marea en el mar: muestra hasta dónde llega el agua.
    const rx = 196, base = superficie(rx);
    const regla = `<g>
      <rect x="${rx - 2}" y="${base - 34}" width="4" height="44" rx="1.5" fill="#f1f3ff"/>
      ${Array.from({ length: 8 }, (_, i) => `<line x1="${rx + 2}" x2="${rx + (i % 2 ? 5 : 8)}" y1="${base + 6 - i * 5}" y2="${base + 6 - i * 5}" stroke="#f1f3ff" stroke-width="1.2"/>`).join('')}
      <path d="M${rx - 9},${(base - subida).toFixed(1)} l6,-3.5 v7 Z" fill="#ffd166"/>
      <text x="${rx + 9}" y="${base - 27}" class="kz-rotulo chico">NIVEL DEL MAR</text></g>`;

    raiz.querySelector('#inv-fondo').innerHTML = `
      <defs>
        <linearGradient id="kz-espacio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070921"/><stop offset="1" stop-color="#1d1f5a"/></linearGradient>
        <radialGradient id="kz-sol" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6d5"/><stop offset="0.35" stop-color="#ffd166"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
        <radialGradient id="kz-halo" cx="${PX}" cy="${PY}" r="${PR + ATM + 40}" gradientUnits="userSpaceOnUse">
          <stop offset="${(PR - 5) / (PR + ATM + 40)}" stop-color="${atm}" stop-opacity="0.95"/>
          <stop offset="${(PR + 40) / (PR + ATM + 40)}" stop-color="${atm}" stop-opacity="0.45"/>
          <stop offset="${(PR + ATM - 20) / (PR + ATM + 40)}" stop-color="${atm}" stop-opacity="0.12"/>
          <stop offset="1" stop-color="${atm}" stop-opacity="0"/></radialGradient>
        <radialGradient id="kz-vineta" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>
        <radialGradient id="kz-brillo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <linearGradient id="kz-mar" x1="0" y1="280" x2="0" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4c8dff"/><stop offset="1" stop-color="#1a2f86"/></linearGradient>
        <linearGradient id="kz-tierra" x1="0" y1="295" x2="0" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#34d27f"/><stop offset="1" stop-color="#116b48"/></linearGradient>
        <clipPath id="kz-planeta"><circle cx="${PX}" cy="${PY}" r="${PR}"/></clipPath>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#kz-espacio)"/>
      <g>${ESTRELLAS.map((e, i) => `<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="${e.r}" fill="${['#fff', '#cfe3ff', '#ffd9f0'][i % 3]}" ${e.tit ? 'class="kz-titila"' : 'opacity="0.7"'}/>`).join('')}</g>
      <g class="kz-sol-latido"><circle cx="${SOL.x}" cy="${SOL.y}" r="130" fill="url(#kz-sol)" opacity="0.5"/></g>
      <circle cx="${SOL.x}" cy="${SOL.y}" r="58" fill="url(#kz-sol)"/>
      <circle cx="${SOL.x}" cy="${SOL.y}" r="30" fill="#fff3c4"/>
      <g transform="translate(${DX} 0)">
      ${sinAtmosfera ? '' : `<circle cx="${PX}" cy="${PY}" r="${PR + ATM + 40}" fill="url(#kz-halo)"/>
        ${[60, 110].map(d => `<circle cx="${PX}" cy="${PY}" r="${PR + d}" fill="none" stroke="${atm}" stroke-opacity="0.12" stroke-width="1.5"/>`).join('')}`}
      <circle cx="${PX}" cy="${PY}" r="${PR}" fill="url(#kz-mar)"/>
      <g clip-path="url(#kz-planeta)">
        <ellipse cx="150" cy="${superficie(150) + 8}" rx="60" ry="9" fill="url(#kz-brillo)"/>
        ${[[150, 330], [205, 345], [170, 362], [235, 368]].map(([x, y]) => `<path d="M${x - 14},${y} q7,-4 14,0 t14,0" stroke="#9ec5ff" stroke-opacity="0.35" stroke-width="2" fill="none"/>`).join('')}
        <path d="M${curva(-220, costaI)} L${costaI},${sx(costaI) + 4} C${costaI + 16},${sx(costaI) + 28} ${costaI - 18},${sx(costaI) + 52} ${costaI + 6},${H} L-220,${H} Z" fill="url(#kz-tierra)"/>
        <path d="M${curva(costaD, 820)} L820,${H} L${costaD + 14},${H} C${costaD + 2},${H - 30} ${costaD + 26},${sx(costaD) + 48} ${costaD - 4},${sx(costaD) + 20} Z" fill="url(#kz-tierra)"/>
        <path d="M-220,${sx(-220) + 40} C200,${sx(200) + 30} 400,${sx(400) + 30} 820,${sx(820) + 40} L820,${H} L-220,${H} Z" fill="#0a0d2e" opacity="0.28"/>
      </g>
      <circle cx="${PX}" cy="${PY}" r="${PR}" fill="none" stroke="${sinAtmosfera ? '#6c7ae0' : atm}" stroke-width="2.5" opacity="0.9"/>
      ${[[150, 58, 1], [455, 70, 0.8], [300, 92, 0.6], [-40, 60, 0.7], [620, 66, 0.75]].map(([x, alto, e], i) => `<g class="kz-nube" style="animation-delay:${-i * 3}s">
        <g transform="translate(${x} ${superficie(x) - alto}) scale(${e})"><rect x="-38" y="-6" width="76" height="16" rx="8" fill="#fff" opacity="0.92"/>
        <circle cx="-12" cy="-8" r="13" fill="#fff" opacity="0.92"/><circle cx="10" cy="-12" r="16" fill="#fff" opacity="0.92"/>
        <rect x="-38" y="6" width="76" height="4" rx="2" fill="#c9d3ff" opacity="0.7"/></g></g>`).join('')}
      ${montania(500, 48, 62)}${nieve(500, 48, 62)}
      ${montania(548, 34, 40)}${nieve(548, 34, 40)}
      ${[262, 292, 306, 454, 590, 612, 634].map((x, i) => arbol(x, 17 + (i % 3) * 4)).join('')}
      ${[[-56, 0.3], [600, 0.32]].map(([x, e]) => molino(x, e)).join('')}
      ${volcan()}
      ${seco < 2 ? [[276, 20], [440, 22], [468, 18]].map(([x, h]) => pino(x, superficie(x) + 1, h)).join('') : [276, 440, 468].map(x => arbol(x, 16)).join('')}
      <g>${edificio(330, 14, 26, '#5a67d8')}${edificio(346, 11, 38, '#7382f5')}${edificio(360, 16, 20, '#5a67d8')}${edificio(378, 12, 30, '#6c7ae0')}</g>
      <g transform="translate(386 ${superficie(404) + 1}) scale(0.3)">${fabrica(0, 0)}</g>
      <g class="kz-humo">${[0, 1, 2].map(i => `<circle cx="410" cy="${superficie(404) - 36}" r="${5 + i * 2}" fill="${anomalia > 2 ? '#8d86b5' : '#b8bff5'}" style="animation-delay:${i * 0.9}s"/>`).join('')}</g>
      <g transform="translate(424 ${superficie(424) - 6}) scale(0.19)">${vaca(0, 0)}</g>
      ${pajaro(250, superficie(250) - 58, 0.55, 0)}${pajaro(270, superficie(270) - 70, 0.45, -1.5)}
      ${inundacion}
      ${tempano}
      ${regla}
      </g>
      ${sinAtmosfera ? '' : `<text x="${W - 120}" y="${superficie(W - 320) - 140}" text-anchor="end" class="kz-rotulo">ATMÓSFERA</text>`}
      <text x="${W - 14}" y="26" text-anchor="end" class="kz-rotulo">ESPACIO</text>
      <rect width="${W}" height="${H}" fill="url(#kz-vineta)" pointer-events="none"/>`;
  }

  function bucle(t) {
    if (!activo) return;
    const dt = Math.min(0.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    if (!raiz.hidden && raiz.offsetParent !== null) {
      if (!pausado) avanzar(dt * velocidad);
      animarParticulas(dt * velocidad * 0.65);
    }
    requestAnimationFrame(bucle);
  }

  function avanzar(dt) {
    acumulado += dt * 1000;
    let cambio = false;
    while (acumulado >= MS_POR_ANIO) {
      acumulado -= MS_POR_ANIO;
      anio++;
      T += (tEquilibrio() - T) / TAU;
      aerosol = aerosol < 0.03 ? 0 : aerosol * Math.exp(-1 / 3); // la ceniza va cayendo en pocos años
      historial.push({ anio, T, ppm, ch4, volcan: aerosol > 0.45 });
      cambio = true;
    }
    if (cambio) {
      while (historial.length > VENTANA + 1) historial.shift();
      actualizarLecturas();
      dibujarGrafico();
      dibujarFondo();
    }
  }

  const distancia = (x, y) => Math.hypot(x - PX, y - PY);

  function animarParticulas(dt) {
    // Moléculas de CO₂: flotan en la franja de la atmósfera, siguiendo la curva del planeta.
    const objetivos = { co2: sinAtmosfera ? 0 : Math.round(ppm / 17), ch4: sinAtmosfera ? 0 : Math.round(ch4 / 130) };
    Object.entries(objetivos).forEach(([tipo, objetivo]) => {
      let n = moleculas.filter(m => m.tipo === tipo).length;
      for (; n > objetivo; n--) moleculas.splice(moleculas.findIndex(m => m.tipo === tipo), 1);
      for (; n < objetivo; n++) moleculas.push({ tipo, ang: -Math.PI / 2 + (Math.random() - 0.5) * 1.1, rad: PR + 28 + Math.random() * (ATM - 55), vel: (Math.random() - 0.5) * 0.012, rot: Math.random() * 6, brillo: 0 });
    });
    // Ceniza volcánica: partículas grises en la atmósfera mientras dure la erupción.
    const nCeniza = Math.round(aerosol * 70);
    while (ceniza.length < nCeniza) ceniza.push({ ang: -Math.PI / 2 + (Math.random() - 0.5) * 1.1, rad: PR + 40 + Math.random() * (ATM - 50), vel: (Math.random() - 0.5) * 0.02 });
    if (ceniza.length > nCeniza) ceniza.length = nCeniza;
    ceniza.forEach(c => { c.ang += c.vel * dt; c.x = PX + c.rad * Math.cos(c.ang); c.y = PY + c.rad * Math.sin(c.ang); });
    moleculas.forEach(m => {
      m.ang += m.vel * dt;
      if (m.ang < -Math.PI / 2 - 0.55) m.ang += 1.1;
      if (m.ang > -Math.PI / 2 + 0.55) m.ang -= 1.1;
      m.rot += dt * 0.6;
      m.brillo = Math.max(0, m.brillo - dt * 1.4);
      m.x = PX + m.rad * Math.cos(m.ang);
      m.y = PY + m.rad * Math.sin(m.ang);
    });

    // Rayos de sol: salen del Sol hacia un punto al azar de la superficie.
    if (Math.random() < dt * 5) {
      // Algunos rayos van a parar al hielo o a una nube, y se reflejan (albedo).
      let destinoX = 230 + Math.random() * 600, destinoY = superficie(destinoX), refleja = null;
      const r = Math.random(), hielo = Math.min(1.3, estadoHielo(T - T_BASE).hielo);
      if (r < pHielo()) {
        const blancos = [[500, 62 - 18 * hielo], [548, 40 - 12 * hielo], [158, 3]];
        const [bx, alto] = blancos[Math.floor(Math.random() * blancos.length)];
        refleja = { x: bx + DX + (Math.random() - 0.5) * 10 * hielo, y: superficie(bx + DX) - alto };
      } else if (r < pHielo() + 0.12) {
        const [bx, alto] = [[150, 56], [455, 68], [300, 90]][Math.floor(Math.random() * 3)];
        refleja = { x: bx + DX + (Math.random() - 0.5) * 40, y: superficie(bx + DX) - alto };
      }
      if (refleja) { destinoX = refleja.x; destinoY = refleja.y; }
      const dx = destinoX - SOL.x, dy = destinoY - SOL.y, d = Math.hypot(dx, dy);
      fotones.push({ tipo: 'sol', x: SOL.x + dx / d * 30, y: SOL.y + dy / d * 30, vx: dx / d * 190, vy: dy / d * 190, vida: 0, refleja });
    }

    const p = pAbsorcion();
    const emitirHaciaArriba = f => {
      const n = [(f.x - PX) / distancia(f.x, f.y), (f.y - PY) / distancia(f.x, f.y)];
      const giro = (Math.random() - 0.5) * 0.9;
      f.vx = (n[0] * Math.cos(giro) - n[1] * Math.sin(giro)) * 95;
      f.vy = (n[0] * Math.sin(giro) + n[1] * Math.cos(giro)) * 95;
      f.sube = true;
      f.decidido = false;
    };

    fotones.forEach(f => {
      f.vida += dt;
      f.fase = (f.fase || Math.random() * 6) + dt * 10;
      if (f.objetivo) {
        // Va hacia la molécula que lo va a absorber.
        const m = f.objetivo, dx = m.x - f.x, dy = m.y - f.y, d = Math.hypot(dx, dy);
        if (d < 6) {
          m.brillo = 1;
          f.objetivo = null;
          // La molécula reemite el calor en cualquier dirección: muchas veces hacia abajo.
          const ang = Math.random() * Math.PI * 2;
          f.vx = Math.cos(ang) * 95;
          f.vy = Math.abs(Math.sin(ang)) * 95 * (Math.random() < 0.7 ? 1 : -1);
          f.sube = f.vy < 0;
          f.decidido = true;
          if (!f.sube) cuenta.vuelven++;
        } else {
          f.vx = dx / d * 95;
          f.vy = dy / d * 95;
        }
      }
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      const d = distancia(f.x, f.y);
      const rebotar = () => { f.tipo = 'refl'; f.vx = f.vx * 0.8 + (Math.random() - 0.5) * 60; f.vy = -Math.abs(f.vy); f.refleja = null; };
      if (f.tipo === 'sol' && aerosol > 0.02 && !f.vioCeniza && d < PR + ATM - 10) {
        // La ceniza del volcán refleja parte de la luz antes de que llegue al suelo.
        f.vioCeniza = true;
        if (Math.random() < aerosol * 0.35) { rebotar(); return; }
      }
      if (f.tipo === 'sol' && f.refleja && (f.y >= f.refleja.y || Math.hypot(f.x - f.refleja.x, f.y - f.refleja.y) < 6)) { rebotar(); return; }
      if (f.tipo === 'refl') return;
      if (d <= PR) {
        // Llega a la superficie: la luz (o el calor que vuelve) calienta el suelo, que emite infrarrojo.
        f.tipo = 'ir';
        f.y = superficie(f.x) - 1;
        emitirHaciaArriba(f);
      } else if (f.tipo === 'ir' && f.sube && !f.decidido && d > PR + 25) {
        f.decidido = true;
        if (Math.random() < p && moleculas.length) {
          // Elige una molécula cercana y por delante en su camino.
          let mejor = null, dm = Infinity;
          moleculas.forEach(m => {
            const dd = Math.hypot(m.x - f.x, m.y - f.y);
            if (m.rad > d && dd < dm) { dm = dd; mejor = m; }
          });
          if (mejor && dm < 160) f.objetivo = mejor;
        }
      } else if (f.tipo === 'ir' && f.sube && d > PR + ATM && !f.contado) {
        f.contado = true;
        cuenta.escapan++;
      }
    });
    fotones = fotones.filter(f => f.y > -20 && f.x > -20 && f.x < W + 20 && f.vida < 12 && (f.tipo !== 'ir' || distancia(f.x, f.y) < PR + ATM + 100));
    if (fotones.length > 140) fotones.splice(0, fotones.length - 140);

    // ---- Dibujo ----
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    fotones.forEach(f => {
      if (f.tipo === 'refl') {
        const v = Math.hypot(f.vx, f.vy);
        ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (distancia(f.x, f.y) - PR - ATM) / 140));
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#f8f9ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(f.x - f.vx / v * 16, f.y - f.vy / v * 16);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (f.tipo === 'sol') {
        const v = Math.hypot(f.vx, f.vy);
        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#ffe08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(f.x - f.vx / v * 18, f.y - f.vy / v * 18);
        ctx.stroke();
      } else {
        // Calor: una onda naranja brillante que se mueve en su dirección.
        const v = Math.hypot(f.vx, f.vy) || 1, ux = f.vx / v, uy = f.vy / v;
        // Se desvanece al alejarse en el espacio.
        ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (distancia(f.x, f.y) - PR - ATM) / 90));
        ctx.shadowColor = '#ff5a36';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#ff7a45';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= 16; i++) {
          const a = Math.sin(i * 0.55 + f.fase) * 2.6;
          const xx = f.x - ux * i * 1.5 - uy * a, yy = f.y - uy * i * 1.5 + ux * a;
          i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
    if (aerosol > 0.02) {
      // Velo de ceniza alrededor del planeta.
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(150, 140, 135, ${Math.min(0.45, aerosol * 0.35)})`;
      ctx.lineWidth = ATM - 40;
      ctx.beginPath(); ctx.arc(PX, PY, PR + 20 + ATM / 2, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ceniza.forEach(c => { ctx.fillStyle = 'rgba(110, 100, 100, 0.85)'; ctx.beginPath(); ctx.arc(c.x, c.y, 2.6, 0, 7); ctx.fill(); });
    }
    moleculas.forEach(m => {
      const ox = Math.cos(m.rot) * 8, oy = Math.sin(m.rot) * 8;
      if (m.brillo > 0) {
        // Al absorber calor, la molécula brilla y vibra.
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 22);
        g.addColorStop(0, `rgba(255, 150, 90, ${0.8 * m.brillo})`);
        g.addColorStop(1, 'rgba(255, 150, 90, 0)');
        ctx.shadowBlur = 0;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(m.x, m.y, 22, 0, 7); ctx.fill();
      }
      const vib = m.brillo * 2 * Math.sin(performance.now() / 25);
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 4;
      if (m.tipo === 'ch4') {
        // Metano: un carbono con cuatro hidrógenos blancos.
        for (let k = 0; k < 4; k++) {
          const a = m.rot + k * Math.PI / 2;
          ctx.fillStyle = '#f1f3f5';
          ctx.beginPath(); ctx.arc(m.x + Math.cos(a) * (7 + vib), m.y + Math.sin(a) * 7, 3.1, 0, 7); ctx.fill();
        }
        ctx.fillStyle = '#5c636a';
        ctx.beginPath(); ctx.arc(m.x, m.y, 4.6, 0, 7); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath(); ctx.arc(m.x - 1.4, m.y - 1.6, 1.4, 0, 7); ctx.fill();
        return;
      }
      [[-1, '#ff6b6b'], [1, '#ff6b6b']].forEach(([s, c]) => {
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(m.x + s * (ox + vib), m.y + s * oy, 4.2, 0, 7); ctx.fill();
      });
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath(); ctx.arc(m.x, m.y, 5, 0, 7); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.arc(m.x - 1.6, m.y - 1.8, 1.5, 0, 7); ctx.fill();
    });
    ctx.shadowBlur = 0;

    const total = cuenta.escapan + cuenta.vuelven;
    if (total > 40) { cuenta.escapan *= 0.5; cuenta.vuelven *= 0.5; }
    const pct = Math.round(p * 100);
    raiz.querySelector('#inv-balance').innerHTML = sinAtmosfera
      ? 'Sin gases de efecto invernadero, <b>todo el calor escapa al espacio</b> y la Tierra se congela.'
      : `☀️ De cada 100 rayos de sol, unos <b>${Math.round((0.12 + pHielo() + aerosol * 0.25) * 100)}</b> se reflejan en las nubes y el hielo${aerosol > 0.05 ? ' y la ceniza' : ''}. 🔥 De cada 100 "rayos" de calor, <b>${pct}</b> son atrapados por el CO₂ y el metano y <b>${100 - pct}</b> escapan al espacio.`;
  }

  // ---------- Lecturas ----------

  function actualizarLecturas() {
    raiz.querySelector('#inv-temp').textContent = T.toFixed(1).replace('.', ',') + ' °C';
    raiz.querySelector('#inv-ppm').textContent = sinAtmosfera ? '—' : ppm + ' ppm';
    raiz.querySelector('#inv-anio').textContent = anio;
    const eh = estadoHielo(T - T_BASE);
    raiz.querySelector('#inv-hielo').textContent = Math.round(Math.min(1, eh.hielo) * 100) + ' %';
    raiz.querySelector('#inv-ch4').textContent = sinAtmosfera ? '—' : ch4 + ' ppb';
    raiz.querySelector('#inv-refleja').textContent = Math.round((0.12 + pHielo() + aerosol * 0.25) * 100) + ' %';
    raiz.querySelectorAll('.inv-btn[data-ppm]').forEach(b => b.classList.toggle('activo', +b.dataset.ppm === ppm && +b.dataset.ch4 === ch4));
    raiz.querySelector('#inv-volcan').classList.toggle('activo', aerosol > 0.05);
    const anomalia = T - T_BASE;
    const c = CONSECUENCIAS.find(x => anomalia <= x.hasta);
    const signo = anomalia >= 0 ? '+' : '−';
    raiz.querySelector('#inv-consecuencia').innerHTML = `
      <p class="inv-anomalia">${signo}${Math.abs(anomalia).toFixed(1).replace('.', ',')} °C respecto de antes de la industria</p>
      <p><span class="inv-cons-ico">${c.icono}</span> ${c.texto}</p>
      ${sinAtmosfera ? '' : desglose()}
      ${aerosol > 0.05 ? '<p class="inv-tendencia">🌋 La ceniza del volcán refleja la luz del sol: la Tierra se enfría un poco hasta que la ceniza cae (como pasó con el Pinatubo en 1991).</p>' : ''}
      ${Math.abs(tEquilibrio() - T) > 0.15 ? `<p class="inv-tendencia">${tEquilibrio() > T ? '↗ La temperatura sigue subiendo' : '↘ La temperatura sigue bajando'} hasta ${tEquilibrio().toFixed(1).replace('.', ',')} °C.</p>` : '<p class="inv-tendencia">La temperatura ya casi no cambia: llegó al equilibrio.</p>'}`;
  }

  // Cuánto aporta cada efecto a la temperatura de equilibrio.
  function desglose() {
    const f = forzantes(), fila = (n, v) => {
      const t = LAMBDA * v, ancho = Math.min(100, Math.abs(t) / 4 * 100);
      return `<div class="inv-aporte"><span>${n}</span><div class="inv-aporte-barra ${t >= 0 ? 'mas' : 'menos'}"><i style="width:${ancho}%"></i></div><b>${t >= 0 ? '+' : '−'}${Math.abs(t).toFixed(1).replace('.', ',')} °C</b></div>`;
    };
    return `<div class="inv-aportes"><p class="inv-tendencia">Cuánto aporta cada efecto (en equilibrio):</p>
      ${fila('🏭 CO₂', f.co2)}${fila('🐄 Metano', f.ch4)}${conAlbedo ? fila('🧊 Albedo (hielo)', f.albedo) : ''}${aerosol > 0.02 ? fila('🌋 Volcán', f.volcan) : ''}</div>`;
  }

  // ---------- Gráfico ----------

  const GW = 1000, GH = 250;
  const G = { x0: 50, x1: 984, y0: 14, y1: 220 };

  function escalas() {
    const valores = historial.map(h => h.T).concat([T_BASE]);
    let min = Math.floor(Math.min(...valores) - 1), max = Math.ceil(Math.max(...valores) + 1);
    if (max - min < 6) { const m = (max + min) / 2; min = Math.floor(m - 3); max = Math.ceil(m + 3); }
    const a0 = Math.max(ANIO_INICIAL, anio - VENTANA), a1 = Math.max(a0 + VENTANA, anio);
    return {
      min, max, a0, a1,
      x: a => G.x0 + (a - a0) / (a1 - a0) * (G.x1 - G.x0),
      y: v => G.y1 - (v - min) / (max - min) * (G.y1 - G.y0),
    };
  }

  function dibujarGrafico(marcado) {
    const s = escalas();
    const paso = s.max - s.min > 16 ? 5 : s.max - s.min > 8 ? 2 : 1;
    let svg = '';
    for (let v = Math.ceil(s.min / paso) * paso; v <= s.max; v += paso) {
      svg += `<line x1="${G.x0}" x2="${G.x1}" y1="${s.y(v)}" y2="${s.y(v)}" class="g-grilla"/>
        <text x="${G.x0 - 8}" y="${s.y(v) + 4}" text-anchor="end" class="g-eje">${v} °</text>`;
    }
    for (let a = Math.ceil(s.a0 / 25) * 25; a <= s.a1; a += 25) {
      svg += `<text x="${s.x(a)}" y="${G.y1 + 20}" text-anchor="middle" class="g-eje">${a}</text>`;
    }
    svg += `<line x1="${G.x0}" x2="${G.x1}" y1="${s.y(T_BASE)}" y2="${s.y(T_BASE)}" class="g-referencia"/>`;
    const pts = historial.map(h => `${s.x(h.anio).toFixed(1)},${s.y(h.T).toFixed(1)}`);
    if (pts.length > 1) {
      svg += `<path d="M${G.x0 + (s.x(historial[0].anio) - G.x0)},${G.y1} L${pts.join(' L')} L${s.x(historial[historial.length - 1].anio)},${G.y1} Z" class="g-area"/>`;
      svg += `<polyline points="${pts.join(' ')}" class="g-linea"/>`;
    }
    historial.forEach((h, k) => { if (h.volcan && !(historial[k - 1] || {}).volcan) svg += `<text x="${s.x(h.anio)}" y="${G.y0 + 12}" text-anchor="middle" font-size="14">🌋</text>`; });
    const ult = historial[historial.length - 1];
    svg += `<circle cx="${s.x(ult.anio)}" cy="${s.y(ult.T)}" r="4.5" class="g-punto"/>`;
    if (marcado) {
      svg += `<line x1="${s.x(marcado.anio)}" x2="${s.x(marcado.anio)}" y1="${G.y0}" y2="${G.y1}" class="g-cruz"/>
        <circle cx="${s.x(marcado.anio)}" cy="${s.y(marcado.T)}" r="5" class="g-punto"/>`;
    }
    grafico.innerHTML = svg;
  }

  function mostrarTooltip(ev) {
    if (historial.length < 2) return;
    const pt = grafico.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    const p = pt.matrixTransform(grafico.getScreenCTM().inverse());
    const s = escalas();
    const aObj = s.a0 + (p.x - G.x0) / (G.x1 - G.x0) * (s.a1 - s.a0);
    const h = historial.reduce((m, x) => (Math.abs(x.anio - aObj) < Math.abs(m.anio - aObj) ? x : m));
    dibujarGrafico(h);
    const tip = raiz.querySelector('#inv-tooltip');
    tip.hidden = false;
    tip.innerHTML = `<b>Año ${h.anio}</b><br>${h.T.toFixed(1).replace('.', ',')} °C · ${h.ppm} ppm de CO₂ · ${h.ch4} ppb de metano${h.volcan ? '<br>🌋 Erupción volcánica' : ''}`;
    const caja = raiz.querySelector('#inv-grafico').getBoundingClientRect();
    const x = (s.x(h.anio) / GW) * caja.width;
    tip.style.left = Math.min(caja.width - 170, Math.max(0, x + 10)) + 'px';
    tip.style.top = (s.y(h.T) / GH) * caja.height - 50 + 'px';
  }

  return { iniciar };
})();
