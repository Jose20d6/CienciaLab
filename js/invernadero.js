// Módulo 6: Efecto invernadero.
// Modelo simplificado: la temperatura de equilibrio sube 3 °C cada vez que se duplica el CO₂
// (sensibilidad climática), partiendo de 14 °C con 280 ppm (era preindustrial).
const Invernadero = (function () {
  const T_BASE = 14, CO2_BASE = 280, SENSIBILIDAD = 3, T_SIN_ATMOSFERA = -18;
  const CO2_MIN = 150, CO2_MAX = 1200;
  const ANIO_INICIAL = 1850, MS_POR_ANIO = 150, TAU = 8; // TAU: años que tarda en acercarse al equilibrio
  const VENTANA = 150; // años visibles en el gráfico
  const W = 600, H = 380; // escena
  // El planeta se ve como un gran arco en la parte de abajo; la atmósfera es una franja alrededor.
  const PX = 300, PY = 1060, PR = 760, ATM = 170;
  const SOL = { x: 46, y: 44 };

  const PRESETS = [
    { ppm: 180, texto: '🧊 Glaciación', sub: '180 ppm' },
    { ppm: 280, texto: '🏭 Antes de la industria', sub: '280 ppm' },
    { ppm: 420, texto: '📍 Hoy', sub: '≈ 420 ppm' },
    { ppm: 900, texto: '🔥 Año 2100 (muchas emisiones)', sub: '≈ 900 ppm' },
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
  let ppm = 420, sinAtmosfera = false, T = null, anio = ANIO_INICIAL, historial = [];
  let pausado = false, ultimo = 0, acumulado = 0, fotones = [], moleculas = [];
  let cuenta = { escapan: 0, vuelven: 0 };
  let activo = false;

  const tEquilibrio = () => (sinAtmosfera ? T_SIN_ATMOSFERA : T_BASE + SENSIBILIDAD * Math.log2(ppm / CO2_BASE));
  // Probabilidad de que el calor (infrarrojo) sea absorbido y devuelto por la atmósfera.
  const pAbsorcion = () => (sinAtmosfera ? 0 : 1 - Math.exp(-ppm / 380));

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
          <div class="inv-escena">
            <svg viewBox="0 0 ${W} ${H}" class="inv-fondo" id="inv-fondo" aria-hidden="true"></svg>
            <canvas id="inv-canvas" aria-label="Animación de la radiación solar y el calor"></canvas>
          </div>
          <div class="inv-leyenda">
            <span><i style="background:#ffe08a;box-shadow:0 0 6px #ffd166"></i>Luz del Sol</span>
            <span><i style="background:#ff7a45;box-shadow:0 0 6px #ff5a36"></i>Calor (infrarrojo)</span>
            <span><b class="kz-co2"><i></i><i></i><i></i></b>Molécula de CO₂</span>
          </div>
          <p class="inv-balance" id="inv-balance"></p>
        </div>

        <div class="panel inv-controles">
          <div class="inv-lecturas">
            <div><span class="inv-num" id="inv-temp"></span><span class="inv-lab">Temperatura media</span></div>
            <div><span class="inv-num" id="inv-ppm"></span><span class="inv-lab">CO₂ en el aire</span></div>
            <div><span class="inv-num" id="inv-anio"></span><span class="inv-lab">Año simulado</span></div>
          </div>
          <label class="inv-slider-lab" for="inv-slider">Cantidad de CO₂ (partes por millón)</label>
          <input type="range" id="inv-slider" min="${CO2_MIN}" max="${CO2_MAX}" step="10">
          <div class="inv-escala"><span>${CO2_MIN}</span><span>${CO2_MAX} ppm</span></div>

          <h3>Momentos de la historia</h3>
          <div class="inv-botones">${PRESETS.map(p => `<button class="inv-btn" data-ppm="${p.ppm}">${p.texto}<small>${p.sub}</small></button>`).join('')}</div>
          <h3>¿Qué hacemos los humanos?</h3>
          <div class="inv-botones">${ACCIONES.map(a => `<button class="inv-btn ${a.d > 0 ? 'sube' : 'baja'}" data-d="${a.d}">${a.texto}<small>${a.sub}</small></button>`).join('')}</div>

          <label class="inv-check"><input type="checkbox" id="inv-sin-atm"> Quitar los gases de efecto invernadero</label>
          <div class="inv-consecuencia" id="inv-consecuencia"></div>
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
        <p class="inv-nota">Modelo simplificado: la temperatura se acerca de a poco al valor de equilibrio, que sube unos 3 °C cada vez que se duplica el CO₂. La línea punteada marca los 14 °C de antes de la industria.</p>
      </div>`;

    canvas = raiz.querySelector('#inv-canvas');
    ctx = canvas.getContext('2d');
    grafico = raiz.querySelector('#inv-svg-grafico');
    dibujarFondo();

    const slider = raiz.querySelector('#inv-slider');
    slider.addEventListener('input', () => cambiarCO2(+slider.value));
    raiz.querySelectorAll('.inv-btn[data-ppm]').forEach(b => b.addEventListener('click', () => cambiarCO2(+b.dataset.ppm)));
    raiz.querySelectorAll('.inv-btn[data-d]').forEach(b => b.addEventListener('click', () => cambiarCO2(ppm + +b.dataset.d)));
    raiz.querySelector('#inv-sin-atm').addEventListener('change', e => { sinAtmosfera = e.target.checked; actualizarLecturas(); dibujarFondo(); });
    raiz.querySelector('#inv-pausa').addEventListener('click', () => {
      pausado = !pausado;
      raiz.querySelector('#inv-pausa').textContent = pausado ? '▶ Continuar' : '⏸ Pausar';
    });
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
    anio = ANIO_INICIAL;
    T = tEquilibrio();
    historial = [{ anio, T, ppm }];
    cuenta = { escapan: 0, vuelven: 0 };
    raiz.querySelector('#inv-slider').value = ppm;
    actualizarLecturas();
    dibujarGrafico();
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

  function dibujarFondo() {
    const anomalia = (T ?? tEquilibrio()) - T_BASE;
    const atm = colorAtmosfera(anomalia);
    const hielo = Math.max(0.1, Math.min(1.35, 1 - anomalia * 0.2));
    const sx = x => superficie(x).toFixed(1);
    // Árboles, ciudad e hielo apoyados sobre la curva del planeta.
    const arbolito = (x, h) => `<path d="M${x - 5},${sx(x) - 0} L${x},${superficie(x) - h} L${x + 5},${sx(x)} Z" fill="#1b9e77"/>`;
    const edificio = (x, w, h, c) => `<rect x="${x}" y="${superficie(x + w / 2) - h}" width="${w}" height="${h + 4}" rx="1.5" fill="${c}"/>`;
    const montania = (x, w, h) => `<path d="M${x - w},${sx(x - w)} L${x},${superficie(x) - h} L${x + w},${sx(x + w)} Z" fill="#3d4a8a"/>
      <path d="M${x},${superficie(x) - h} L${x + w},${sx(x + w)} L${x + w * 0.35},${sx(x + w * 0.35)} Z" fill="#2f3a73"/>`;
    const nieve = (x, w, h) => {
      const k = hielo, hy = superficie(x) - h;
      return `<path d="M${x - w * 0.42 * k},${hy + h * 0.42 * k} L${x},${hy} L${x + w * 0.42 * k},${hy + h * 0.42 * k} L${x + w * 0.18 * k},${hy + h * 0.34 * k} L${x},${hy + h * 0.44 * k} L${x - w * 0.2 * k},${hy + h * 0.34 * k} Z" fill="#f1f3ff"/>`;
    };
    raiz.querySelector('#inv-fondo').innerHTML = `
      <defs>
        <linearGradient id="kz-espacio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#090b26"/><stop offset="1" stop-color="#1d1f5a"/></linearGradient>
        <radialGradient id="kz-sol" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6d5"/><stop offset="0.35" stop-color="#ffd166"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
        <radialGradient id="kz-halo" cx="${PX}" cy="${PY}" r="${PR + ATM + 40}" gradientUnits="userSpaceOnUse">
          <stop offset="${(PR - 5) / (PR + ATM + 40)}" stop-color="${atm}" stop-opacity="0.95"/>
          <stop offset="${(PR + 40) / (PR + ATM + 40)}" stop-color="${atm}" stop-opacity="0.45"/>
          <stop offset="${(PR + ATM - 20) / (PR + ATM + 40)}" stop-color="${atm}" stop-opacity="0.12"/>
          <stop offset="1" stop-color="${atm}" stop-opacity="0"/></radialGradient>
        <linearGradient id="kz-mar" x1="0" y1="295" x2="0" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4c8dff"/><stop offset="1" stop-color="#1a2f86"/></linearGradient>
        <linearGradient id="kz-tierra" x1="0" y1="295" x2="0" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#34d27f"/><stop offset="1" stop-color="#116b48"/></linearGradient>
        <clipPath id="kz-planeta"><circle cx="${PX}" cy="${PY}" r="${PR}"/></clipPath>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#kz-espacio)"/>
      <g>${ESTRELLAS.map(e => `<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="${e.r}" fill="#fff" ${e.tit ? 'class="kz-titila"' : 'opacity="0.7"'}/>`).join('')}</g>
      <circle cx="${SOL.x}" cy="${SOL.y}" r="120" fill="url(#kz-sol)" opacity="0.55"/>
      <circle cx="${SOL.x}" cy="${SOL.y}" r="58" fill="url(#kz-sol)"/>
      <circle cx="${SOL.x}" cy="${SOL.y}" r="30" fill="#fff3c4"/>
      ${sinAtmosfera ? '' : `<circle cx="${PX}" cy="${PY}" r="${PR + ATM + 40}" fill="url(#kz-halo)"/>`}
      <circle cx="${PX}" cy="${PY}" r="${PR}" fill="url(#kz-mar)"/>
      <g clip-path="url(#kz-planeta)">
        ${[[150, 312], [200, 330], [170, 352], [225, 360]].map(([x, y]) => `<path d="M${x - 14},${y} q7,-4 14,0 t14,0" stroke="#9ec5ff" stroke-opacity="0.35" stroke-width="2" fill="none"/>`).join('')}
        <path d="M-20,${sx(0) - 20} L112,${sx(112) - 20} L112,${sx(112) + 4} C128,${sx(120) + 28} 94,${sx(110) + 52} 118,${H} L-20,${H} Z" fill="url(#kz-tierra)"/>
        <path d="M248,${sx(248) - 20} L620,${sx(620) - 20} L620,${H} L262,${H} C250,${H - 30} 274,${sx(262) + 48} 244,${sx(248) + 20} Z" fill="url(#kz-tierra)"/>
        <ellipse cx="186" cy="${sx(186) + 30}" rx="16" ry="5" fill="url(#kz-tierra)"/>
        <path d="M-20,${sx(0) + 40} C200,${sx(200) + 30} 400,${sx(400) + 30} 620,${sx(620) + 40} L620,${H} L-20,${H} Z" fill="#0a0d2e" opacity="0.28"/>
      </g>
      <circle cx="${PX}" cy="${PY}" r="${PR}" fill="none" stroke="${sinAtmosfera ? '#6c7ae0' : atm}" stroke-width="2.5" opacity="0.9"/>
      ${[[150, 58, 1], [455, 70, 0.8], [300, 92, 0.6]].map(([x, alto, e], i) => `<g class="kz-nube" style="animation-delay:${-i * 3}s">
        <g transform="translate(${x} ${superficie(x) - alto}) scale(${e})"><rect x="-38" y="-6" width="76" height="16" rx="8" fill="#fff" opacity="0.92"/>
        <circle cx="-12" cy="-8" r="13" fill="#fff" opacity="0.92"/><circle cx="10" cy="-12" r="16" fill="#fff" opacity="0.92"/>
        <rect x="-38" y="6" width="76" height="4" rx="2" fill="#c9d3ff" opacity="0.7"/></g></g>`).join('')}
      ${montania(500, 48, 62)}${nieve(500, 48, 62)}
      ${montania(548, 34, 40)}${nieve(548, 34, 40)}
      ${[270, 282, 296, 440, 452, 466, 590].map((x, i) => arbolito(x, 12 + (i % 3) * 4)).join('')}
      <g>${edificio(330, 14, 26, '#5a67d8')}${edificio(346, 10, 38, '#7f8cff')}${edificio(358, 16, 20, '#5a67d8')}${edificio(376, 12, 30, '#6c7ae0')}
        <rect x="396" y="${superficie(402) - 34}" width="7" height="36" fill="#9aa3ff"/>
        <rect x="390" y="${superficie(400) - 14}" width="26" height="16" fill="#7f8cff"/></g>
      <g class="kz-humo">${[0, 1, 2].map(i => `<circle cx="399" cy="${superficie(402) - 38}" r="${6 + i * 2}" fill="#b8bff5" style="animation-delay:${i * 0.9}s"/>`).join('')}</g>
      ${sinAtmosfera ? '' : `<text x="${W - 14}" y="${superficie(W - 14) - 125}" text-anchor="end" class="kz-rotulo">ATMÓSFERA</text>`}
      <text x="${W - 14}" y="26" text-anchor="end" class="kz-rotulo">ESPACIO</text>`;
  }

  function bucle(t) {
    if (!activo) return;
    const dt = Math.min(0.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    if (!raiz.hidden && raiz.offsetParent !== null) {
      if (!pausado) avanzar(dt);
      animarParticulas(dt);
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
      historial.push({ anio, T, ppm });
      cambio = true;
    }
    if (cambio) {
      while (historial.length > VENTANA + 1) historial.shift();
      actualizarLecturas();
      dibujarGrafico();
      if (anio % 5 === 0) dibujarFondo();
    }
  }

  const distancia = (x, y) => Math.hypot(x - PX, y - PY);

  function animarParticulas(dt) {
    // Moléculas de CO₂: flotan en la franja de la atmósfera, siguiendo la curva del planeta.
    const objetivo = sinAtmosfera ? 0 : Math.round(ppm / 24);
    while (moleculas.length < objetivo) {
      moleculas.push({ ang: -Math.PI / 2 + (Math.random() - 0.5) * 1.0, rad: PR + 28 + Math.random() * (ATM - 55), vel: (Math.random() - 0.5) * 0.012, rot: Math.random() * 6, brillo: 0 });
    }
    if (moleculas.length > objetivo) moleculas.length = objetivo;
    moleculas.forEach(m => {
      m.ang += m.vel * dt;
      if (m.ang < -Math.PI / 2 - 0.5) m.ang += 1.0;
      if (m.ang > -Math.PI / 2 + 0.5) m.ang -= 1.0;
      m.rot += dt * 0.6;
      m.brillo = Math.max(0, m.brillo - dt * 1.4);
      m.x = PX + m.rad * Math.cos(m.ang);
      m.y = PY + m.rad * Math.sin(m.ang);
    });

    // Rayos de sol: salen del Sol hacia un punto al azar de la superficie.
    if (Math.random() < dt * 5) {
      const destinoX = 150 + Math.random() * 450, destinoY = superficie(destinoX);
      const dx = destinoX - SOL.x, dy = destinoY - SOL.y, d = Math.hypot(dx, dy);
      fotones.push({ tipo: 'sol', x: SOL.x + dx / d * 30, y: SOL.y + dy / d * 30, vx: dx / d * 190, vy: dy / d * 190, vida: 0 });
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
    fotones = fotones.filter(f => f.y > -20 && f.x > -20 && f.x < W + 20 && f.vida < 12 && distancia(f.x, f.y) < PR + ATM + 100);
    if (fotones.length > 140) fotones.splice(0, fotones.length - 140);

    // ---- Dibujo ----
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    fotones.forEach(f => {
      if (f.tipo === 'sol') {
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
      : `De cada 100 "rayos" de calor, unos <b>${pct}</b> son atrapados por el CO₂ y <b>${100 - pct}</b> escapan al espacio. Mira cómo <b>brillan</b> las moléculas al absorberlos.`;
  }

  // ---------- Lecturas ----------

  function actualizarLecturas() {
    raiz.querySelector('#inv-temp').textContent = T.toFixed(1).replace('.', ',') + ' °C';
    raiz.querySelector('#inv-ppm').textContent = sinAtmosfera ? '—' : ppm + ' ppm';
    raiz.querySelector('#inv-anio').textContent = anio;
    raiz.querySelectorAll('.inv-btn[data-ppm]').forEach(b => b.classList.toggle('activo', +b.dataset.ppm === ppm));
    const anomalia = T - T_BASE;
    const c = CONSECUENCIAS.find(x => anomalia <= x.hasta);
    const signo = anomalia >= 0 ? '+' : '−';
    raiz.querySelector('#inv-consecuencia').innerHTML = `
      <p class="inv-anomalia">${signo}${Math.abs(anomalia).toFixed(1).replace('.', ',')} °C respecto de antes de la industria</p>
      <p><span class="inv-cons-ico">${c.icono}</span> ${c.texto}</p>
      ${Math.abs(tEquilibrio() - T) > 0.15 ? `<p class="inv-tendencia">${tEquilibrio() > T ? '↗ La temperatura sigue subiendo' : '↘ La temperatura sigue bajando'} hasta ${tEquilibrio().toFixed(1).replace('.', ',')} °C.</p>` : '<p class="inv-tendencia">La temperatura ya casi no cambia: llegó al equilibrio.</p>'}`;
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
    tip.innerHTML = `<b>Año ${h.anio}</b><br>${h.T.toFixed(1).replace('.', ',')} °C · ${h.ppm} ppm de CO₂`;
    const caja = raiz.querySelector('#inv-grafico').getBoundingClientRect();
    const x = (s.x(h.anio) / GW) * caja.width;
    tip.style.left = Math.min(caja.width - 170, Math.max(0, x + 10)) + 'px';
    tip.style.top = (s.y(h.T) / GH) * caja.height - 50 + 'px';
  }

  return { iniciar };
})();
