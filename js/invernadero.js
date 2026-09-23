// Módulo 6: Efecto invernadero.
// Modelo simplificado: la temperatura de equilibrio sube 3 °C cada vez que se duplica el CO₂
// (sensibilidad climática), partiendo de 14 °C con 280 ppm (era preindustrial).
const Invernadero = (function () {
  const T_BASE = 14, CO2_BASE = 280, SENSIBILIDAD = 3, T_SIN_ATMOSFERA = -18;
  const CO2_MIN = 150, CO2_MAX = 1200;
  const ANIO_INICIAL = 1850, MS_POR_ANIO = 150, TAU = 8; // TAU: años que tarda en acercarse al equilibrio
  const VENTANA = 150; // años visibles en el gráfico
  const W = 600, H = 380; // escena
  const ATM_ARRIBA = 95, ATM_ABAJO = 255, SUELO = 300;

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
            <span><i style="background:#fcc419"></i>Luz del Sol</span>
            <span><i style="background:#e03131"></i>Calor (infrarrojo)</span>
            <span><i style="background:#868e96"></i>Molécula de CO₂</span>
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

  function dibujarFondo() {
    const anomalia = (T ?? tEquilibrio()) - T_BASE;
    const hielo = Math.max(0.15, Math.min(1.4, 1 - anomalia * 0.18)); // el hielo se achica con el calor
    const mar = SUELO + 8 - Math.max(0, anomalia) * 3;
    raiz.querySelector('#inv-fondo').innerHTML = `
      <defs>
        <linearGradient id="inv-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0b1d3a"/><stop offset="0.22" stop-color="#1c3d6e"/>
          <stop offset="0.3" stop-color="#a5d8ff"/><stop offset="1" stop-color="#e7f5ff"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#inv-cielo)"/>
      <text x="${W - 12}" y="24" text-anchor="end" class="inv-rotulo claro">Espacio</text>
      ${sinAtmosfera ? '' : `<rect x="0" y="${ATM_ARRIBA}" width="${W}" height="${ATM_ABAJO - ATM_ARRIBA}" fill="#ffffff" opacity="0.18"/>
      <text x="${W - 12}" y="${ATM_ARRIBA + 18}" text-anchor="end" class="inv-rotulo">Atmósfera</text>`}
      <circle cx="58" cy="44" r="30" fill="#ffd43b"/><circle cx="58" cy="44" r="40" fill="#ffd43b" opacity="0.25"/>
      <rect x="0" y="${mar}" width="230" height="${H - mar}" fill="#339af0"/>
      <path d="M200,${SUELO} L${W},${SUELO} L${W},${H} L230,${H} Z" fill="#8ce99a"/>
      <path d="M230,${SUELO + 2} L${W},${SUELO + 2} L${W},${H} L230,${H} Z" fill="#69db7c"/>
      <path d="M380,${SUELO} L440,215 L500,${SUELO} Z" fill="#868e96"/>
      <path d="M${440 - 26 * hielo},${215 + 38 * hielo} L440,215 L${440 + 26 * hielo},${215 + 38 * hielo} Z" fill="#fff"/>
      <ellipse cx="560" cy="${SUELO + 4}" rx="${38 * hielo}" ry="${7 * hielo}" fill="#f8f9fa" stroke="#dee2e6"/>
      <text x="115" y="${H - 12}" text-anchor="middle" class="inv-rotulo claro">Océano</text>
      <text x="560" y="${H - 12}" text-anchor="middle" class="inv-rotulo">Hielo</text>`;
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

  function animarParticulas(dt) {
    // Moléculas de CO₂ proporcionales a la concentración.
    const objetivo = sinAtmosfera ? 0 : Math.round(ppm / 22);
    while (moleculas.length < objetivo) moleculas.push({ x: Math.random() * W, y: ATM_ARRIBA + 10 + Math.random() * (ATM_ABAJO - ATM_ARRIBA - 20), v: (Math.random() - 0.5) * 20 });
    if (moleculas.length > objetivo) moleculas.length = objetivo;

    // Nuevos rayos de sol.
    if (Math.random() < dt * 9) fotones.push({ tipo: 'sol', x: 70 + Math.random() * 40, y: 60, vx: 40 + Math.random() * 140, vy: 150 });

    const p = pAbsorcion();
    fotones.forEach(f => {
      const yAntes = f.y;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      if (f.tipo === 'sol' && f.y >= SUELO) {
        // La superficie absorbe la luz y emite calor hacia arriba.
        f.tipo = 'ir'; f.y = SUELO; f.vy = -110; f.vx = (Math.random() - 0.5) * 60; f.ondas = Math.random() * 6;
      } else if (f.tipo === 'ir' && f.vy < 0 && yAntes > ATM_ABAJO && f.y <= ATM_ABAJO) {
        // Entra a la atmósfera: se decide si escapa o si lo atrapa el CO₂.
        f.rebote = Math.random() < p ? ATM_ARRIBA + 15 + Math.random() * (ATM_ABAJO - ATM_ARRIBA - 30) : null;
      } else if (f.tipo === 'ir' && f.vy < 0 && f.rebote && f.y <= f.rebote) {
        f.vy = 110; f.vx = (Math.random() - 0.5) * 80; f.rebote = null;
        cuenta.vuelven++;
      } else if (f.tipo === 'ir' && f.vy > 0 && f.y >= SUELO) {
        f.vy = -110; f.vx = (Math.random() - 0.5) * 60;
      } else if (f.tipo === 'ir' && f.vy < 0 && f.y < ATM_ARRIBA && !f.contado) {
        f.contado = true;
        cuenta.escapan++;
      }
    });
    fotones = fotones.filter(f => f.y > -10 && f.x > -10 && f.x < W + 10 && !(f.tipo === 'ir' && (f.vueltas = (f.vueltas || 0) + dt) > 9));
    if (fotones.length > 160) fotones.splice(0, fotones.length - 160);

    ctx.clearRect(0, 0, W, H);
    moleculas.forEach(m => {
      m.x += m.v * dt;
      if (m.x < -10) m.x = W + 10;
      if (m.x > W + 10) m.x = -10;
      ctx.fillStyle = '#e03131';
      ctx.beginPath(); ctx.arc(m.x - 5, m.y, 3, 0, 7); ctx.arc(m.x + 5, m.y, 3, 0, 7); ctx.fill();
      ctx.fillStyle = '#495057';
      ctx.beginPath(); ctx.arc(m.x, m.y, 3.4, 0, 7); ctx.fill();
    });
    fotones.forEach(f => {
      if (f.tipo === 'sol') {
        ctx.strokeStyle = '#fcc419';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - f.vx * 0.06, f.y - f.vy * 0.06); ctx.stroke();
      } else {
        // El calor se dibuja como una onda roja.
        ctx.strokeStyle = '#e03131';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        const dir = Math.sign(f.vy);
        for (let i = 0; i <= 14; i++) {
          const yy = f.y - dir * i * 1.4;
          const xx = f.x + Math.sin(i * 0.9 + f.ondas) * 3;
          i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
        }
        ctx.stroke();
      }
    });

    // Balance de calor de los últimos segundos.
    const total = cuenta.escapan + cuenta.vuelven;
    if (total > 40) { cuenta.escapan *= 0.5; cuenta.vuelven *= 0.5; }
    const pct = Math.round(p * 100);
    raiz.querySelector('#inv-balance').innerHTML = sinAtmosfera
      ? 'Sin gases de efecto invernadero, <b>todo el calor escapa al espacio</b> y la Tierra se congela.'
      : `De cada 100 "rayos" de calor, unos <b>${pct}</b> vuelven hacia la superficie y <b>${100 - pct}</b> escapan al espacio.`;
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
