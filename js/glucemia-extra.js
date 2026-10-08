// Glucemia y diabetes: actividades extra.
// «Armar el plato»: cómo cambia la curva de glucemia al combinar alimentos.
// «Desafío del día»: mantener en rango la glucemia de una persona con diabetes tipo 1 durante un día.
const GluExtra = (function () {
  const M = () => Glucemia.modelo;
  const E = Math.E;
  const AZUL = '#3987e5', NARANJA = '#d95926';

  // ---------- Gráfico compartido (estilo de los demás gráficos de glucemia) ----------
  function ejes({ W, H, x0, x1, xIni, xFin, ticks, fmt, titulo, yMax, id }) {
    const yTop = 16, yBase = H - 34;
    const X = v => x0 + (v - xIni) / (xFin - xIni) * (x1 - x0);
    const Y = g => yBase - (Math.max(40, Math.min(yMax, g)) - 40) / (yMax - 40) * (yBase - yTop);
    let svg = `<defs><radialGradient id="${id}-bg" cx="0.5" cy="0.3" r="0.9"><stop offset="0" stop-color="#1c1f5e"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
      <filter id="${id}-halo" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="3.5"/></filter>
      <linearGradient id="${id}-hiper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b6b" stop-opacity="0.16"/><stop offset="1" stop-color="#ff6b6b" stop-opacity="0.02"/></linearGradient>
      <linearGradient id="${id}-hipo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5cc8ff" stop-opacity="0.03"/><stop offset="1" stop-color="#5cc8ff" stop-opacity="0.2"/></linearGradient></defs>
      <rect width="${W}" height="${H}" rx="14" fill="url(#${id}-bg)"/>
      <rect x="${x0}" y="${Y(yMax)}" width="${x1 - x0}" height="${Y(180) - Y(yMax)}" fill="url(#${id}-hiper)"/>
      <rect x="${x0}" y="${Y(70)}" width="${x1 - x0}" height="${Y(40) - Y(70)}" fill="url(#${id}-hipo)"/>
      <text x="${x1 - 8}" y="${Y(yMax) + 12}" text-anchor="end" class="bm-gg-zona">HIPERGLUCEMIA</text><text x="${x0 + 8}" y="${Y(46)}" class="bm-gg-zona">HIPOGLUCEMIA</text>`;
    for (let g = 40; g <= yMax; g += 40) svg += `<line x1="${x0}" x2="${x1}" y1="${Y(g)}" y2="${Y(g)}" class="bm-gg-grilla"/><text x="${x0 - 8}" y="${Y(g) + 4}" text-anchor="end" class="bm-gg-eje">${g}</text>`;
    ticks.forEach(v => { svg += `<line x1="${X(v)}" x2="${X(v)}" y1="${Y(yMax)}" y2="${Y(40)}" class="bm-gg-grilla v"/><text x="${X(v)}" y="${yBase + 16}" text-anchor="middle" class="bm-gg-eje">${fmt(v)}</text>`; });
    [[70, 'hipoglucemia (70)'], [180, 'umbral renal (180)']].forEach(([g, t]) => { svg += `<line x1="${x0}" x2="${x1}" y1="${Y(g)}" y2="${Y(g)}" class="bm-gg-ref"/><text x="${x1 - 4}" y="${Y(g) - 4}" text-anchor="end" class="bm-gg-reftxt">${t}</text>`; });
    svg += `<text x="${(x0 + x1) / 2}" y="${H - 4}" text-anchor="middle" class="bm-gg-titulo">${titulo}</text>
      <text x="14" y="${(yTop + yBase) / 2}" text-anchor="middle" transform="rotate(-90 14 ${(yTop + yBase) / 2})" class="bm-gg-titulo">Glucemia (mg/dl)</text>`;
    const trazo = (pts, col, extra = '') => `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="7" opacity="0.4" filter="url(#${id}-halo)"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
    return { svg, X, Y, trazo, yTop, yBase };
  }

  // =====================================================================
  // ARMAR EL PLATO
  // =====================================================================

  const BASES = [
    { id: 'blanco', e: '🍞', n: 'Pan blanco', ig: 75 },
    { id: 'arroz', e: '🍚', n: 'Arroz blanco', ig: 73 },
    { id: 'pure', e: '🥔', n: 'Puré de papas', ig: 85 },
    { id: 'fideos', e: '🍝', n: 'Fideos al dente', ig: 49 },
    { id: 'granos', e: '🥖', n: 'Pan de granos', ig: 53, fibra: 0.6 },
  ];
  const EXTRAS = [
    { id: 'ensalada', e: '🥗', n: 'Ensalada', tipo: 'Fibra', retraso: 8, f: 0.93, x: 'La <b>fibra</b> de las verduras forma un gel en el intestino: las enzimas llegan más despacio al almidón y la glucosa entra de a poco.' },
    { id: 'huevo', e: '🍳', n: 'Huevo', tipo: 'Proteína', retraso: 6, f: 0.93, ins: 1.25, x: 'Las <b>proteínas</b> enlentecen el vaciado del estómago y además estimulan un poco la liberación de <b>insulina</b>.' },
    { id: 'palta', e: '🥑', n: 'Palta', tipo: 'Grasa', retraso: 10, f: 0.97, x: 'Las <b>grasas</b> hacen que el estómago se vacíe más despacio: la curva sube más tarde y menos. Aportan mucha energía, así que alcanza con una porción chica.' },
    { id: 'limon', e: '🍋', n: 'Limón o vinagre', tipo: 'Acidez', retraso: 4, f: 0.96, x: 'La <b>acidez</b> (limón, vinagre en la ensalada) enlentece el vaciado del estómago y baja un poco la respuesta glucémica.' },
    { id: 'gaseosa', e: '🥤', n: 'Gaseosa', tipo: 'Azúcar libre', retraso: -6, f: 1.45, x: 'La gaseosa <b>suma azúcar libre</b> (unos 25 g por vaso) que se absorbe enseguida: la curva sube más y más rápido. El agua es la mejor bebida.' },
  ];
  const ORDEN = { retraso: 6, f: 0.92, x: '<b>Comer primero</b> la verdura y la proteína, y al final los carbohidratos, hace que el almidón llegue al intestino más tarde y mezclado con fibra.' };

  let pl = null;

  function simularPlato(base, extras, tipo) {
    const { nuevaSimulacion, pasoGlucemia, areaBajoCurva } = M();
    const s = nuevaSimulacion({ ig: base.ig, fibra: base.fibra || 0 });
    const total = s.amp * s.tp * E;
    s.tp = Math.max(14, s.tp + extras.reduce((a, x) => a + x.retraso, 0));
    s.amp = total * extras.reduce((a, x) => a * x.f, 1) / (s.tp * E);
    s.fSecrecion = extras.reduce((a, x) => a * (x.ins || 1), 1);
    while (s.t < 180) { pasoGlucemia(s, 0.5, tipo); if (Number.isInteger(s.t)) s.pts.push(s.G); }
    const pts = s.pts.slice(0, 181), max = Math.max(...pts);
    return { pts, max, tMax: pts.indexOf(max), area: areaBajoCurva(pts), a2h: pts[120] };
  }

  function plato(el) {
    pl = { el, base: BASES[0], extras: new Set(), orden: false, tipo: 0, dibujados: new Set() };
    el.innerHTML = `
      <div class="gl-plato">
        <div class="panel bm-mesa gl-plato-escena"><svg id="gp-escena" viewBox="0 0 560 330" role="img" aria-label="El plato armado"></svg></div>
        <div class="panel gl-plato-ctrl">
          <h3><span class="gl-num">1</span> La base <small class="bm-suave">(50 g de carbohidratos)</small></h3>
          <div class="gl-chips" id="gp-bases">${BASES.map(b => `<button data-b="${b.id}"><span>${b.e}</span>${b.n}</button>`).join('')}</div>
          <h3><span class="gl-num">2</span> Lo que la acompaña</h3>
          <div class="gl-chips" id="gp-extras">${EXTRAS.map(x => `<button data-x="${x.id}" aria-pressed="false"><span>${x.e}</span>${x.n}<small>${x.tipo}</small></button>`).join('')}</div>
          <label class="bm-check gl-orden"><input type="checkbox" id="gp-orden"> Comer primero la verdura y la proteína</label>
          <h3><span class="gl-num">3</span> Quién come</h3>
          <div class="segmentado chico" id="gp-persona"><button data-p="0" class="activo">Sin diabetes</button><button data-p="2">Diabetes tipo 2</button></div>
        </div>
      </div>
      <div class="gl-graficos">
        <div class="panel bm-mesa">
          <div class="bm-graf-cab"><h3>¿Se aplana la curva?</h3>
            <div class="bm-glu-leyenda"><span><i style="background:${AZUL}"></i><span id="gp-ley-base"></span> sola</span><span><i style="background:${NARANJA}"></i>Tu plato</span></div></div>
          <svg id="gp-graf" viewBox="0 0 760 270" role="img" aria-label="Glucemia con la base sola y con el plato completo"></svg>
        </div>
        <aside class="panel gl-res"><h3>🍽️ Tu plato</h3><div id="gp-res"></div></aside>
      </div>`;
    const q = s => el.querySelector(s);
    el.querySelectorAll('#gp-bases button').forEach(b => b.addEventListener('click', () => { pl.base = BASES.find(x => x.id === b.dataset.b); actualizarPlato(); }));
    el.querySelectorAll('#gp-extras button').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.x;
      pl.extras.has(id) ? pl.extras.delete(id) : pl.extras.add(id);
      actualizarPlato();
    }));
    q('#gp-orden').addEventListener('change', e => { pl.orden = e.target.checked; actualizarPlato(); });
    el.querySelectorAll('#gp-persona button').forEach(b => b.addEventListener('click', () => {
      pl.tipo = +b.dataset.p;
      el.querySelectorAll('#gp-persona button').forEach(k => k.classList.toggle('activo', k === b));
      actualizarPlato();
    }));
    actualizarPlato();
  }

  function actualizarPlato() {
    const el = pl.el;
    const extras = EXTRAS.filter(x => pl.extras.has(x.id));
    // El orden solo cuenta si hay verdura o proteína para comer primero.
    const ordenValido = pl.orden && (pl.extras.has('ensalada') || pl.extras.has('huevo'));
    const efectos = ordenValido ? [...extras, ORDEN] : extras;
    el.querySelectorAll('#gp-bases button').forEach(b => b.classList.toggle('activo', b.dataset.b === pl.base.id));
    el.querySelectorAll('#gp-extras button').forEach(b => { const on = pl.extras.has(b.dataset.x); b.classList.toggle('activo', on); b.setAttribute('aria-pressed', on); });
    const casilla = el.querySelector('#gp-orden');
    casilla.disabled = !(pl.extras.has('ensalada') || pl.extras.has('huevo'));
    if (casilla.disabled) casilla.checked = pl.orden = false;
    el.querySelector('#gp-ley-base').textContent = pl.base.n;
    const sola = simularPlato(pl.base, [], pl.tipo), plato = simularPlato(pl.base, efectos, pl.tipo);
    el.querySelector('#gp-escena').innerHTML = escenaPlato(ordenValido, plato.max < sola.max - 8 ? 'feliz' : plato.max > sola.max + 8 ? 'preocupado' : 'feliz');
    graficoPlato(sola, plato);
    resultadoPlato(sola, plato, efectos);
  }

  function graficoPlato(sola, plato) {
    const W = 760, H = 270;
    const g = ejes({ W, H, x0: 56, x1: 740, xIni: 0, xFin: 180, ticks: [0, 30, 60, 90, 120, 150, 180], fmt: v => v, titulo: 'Tiempo después de comer (minutos)', yMax: Math.max(240, Math.ceil((Math.max(sola.max, plato.max) + 30) / 40) * 40), id: 'gp' });
    const linea = pts => pts.map((v, i) => `${g.X(i).toFixed(1)},${g.Y(v).toFixed(1)}`).join(' ');
    let svg = g.svg;
    // Área entre las dos curvas: lo que el plato «ahorra» (o suma) de glucosa en la sangre.
    svg += `<polygon points="${linea(sola.pts)} ${plato.pts.map((v, i) => `${g.X(i).toFixed(1)},${g.Y(v).toFixed(1)}`).reverse().join(' ')}" fill="${plato.max <= sola.max ? '#199e70' : NARANJA}" opacity="0.18"/>`;
    svg += g.trazo(linea(sola.pts), AZUL, 'stroke-dasharray="7 5"');
    svg += `<g class="gp-curva">${g.trazo(linea(plato.pts), NARANJA)}</g>`;
    const etiq = (c, col, txt, abajo) => `<circle cx="${g.X(c.tMax)}" cy="${g.Y(c.max)}" r="9" fill="${col}" opacity="0.3"/><circle cx="${g.X(c.tMax)}" cy="${g.Y(c.max)}" r="5" fill="${col}" stroke="#0e1033" stroke-width="2"/>
      <text x="${g.X(c.tMax) + 9}" y="${g.Y(c.max) + (abajo ? 16 : -9)}" class="bm-gg-etiq">${txt} · ${Math.round(c.max)}</text>`;
    const plAbajo = plato.max < sola.max;
    svg += etiq(sola, AZUL, 'Sola', !plAbajo && Math.abs(plato.max - sola.max) < 14) + etiq(plato, NARANJA, 'Tu plato', plAbajo && Math.abs(plato.max - sola.max) < 14);
    pl.el.querySelector('#gp-graf').innerHTML = svg;
  }

  function resultadoPlato(sola, plato, efectos) {
    const dPico = Math.round(plato.max - sola.max), dT = plato.tMax - sola.tMax;
    const pct = Math.round(plato.area / sola.area * 100);
    const veredicto = !efectos.length ? 'Agrega acompañamientos y mira cómo cambia la curva naranja.'
      : pct <= 75 ? '🎉 <b>¡La curva se aplanó!</b> La glucosa entra más despacio y el páncreas no tiene que hacer un pico tan grande de insulina.'
        : pct < 95 ? '👍 La curva bajó un poco. Prueba sumar más fibra, proteína o cambiar la base.'
          : pct > 110 ? '⚠️ Tu plato <b>sube más</b> la glucemia que la base sola.' : 'Casi no cambió la curva.';
    pl.el.querySelector('#gp-res').innerHTML = `
      <div class="bm-resultado bm-glu-res" style="--c:${NARANJA}">
        <dl class="bm-glu-datos">
          <div><dt>Pico</dt><dd>${Math.round(plato.max)} <small>${dPico ? `(${dPico > 0 ? '+' : ''}${dPico})` : 'mg/dl'}</small></dd></div>
          <div><dt>Minuto del pico</dt><dd>${plato.tMax} <small>${dT ? `(${dT > 0 ? '+' : ''}${dT})` : ''}</small></dd></div>
          <div><dt>Área 2 h</dt><dd>${pct} <small>%</small></dd></div>
        </dl>
        <p class="gp-veredicto">${veredicto}</p>
      </div>
      <p class="bm-suave">El área se compara con la de la ${pl.base.n.toLowerCase()} sola (100 %). ${pl.tipo === 2 ? 'Con <b>diabetes tipo 2</b> la diferencia se nota más: combinar bien los alimentos es parte del tratamiento.' : ''}</p>
      ${efectos.length ? `<h4>Qué hace cada parte</h4><ul class="gp-efectos">${efectos.map(x => `<li><span>${x.e || '1️⃣'}</span><p>${x.x}</p></li>`).join('')}</ul>` : ''}`;
  }

  // ---------- Dibujo del plato (vista de arriba, en perspectiva) ----------
  const dt = Arte.dosTonos;
  const COMIDA_SVG = {
    blanco: () => rebanadas('#d08a3a', '#b06f28', '#fbe3b4', '#ecc98c', false),
    granos: () => rebanadas('#9c6431', '#7d4d22', '#d9a066', '#c48a4f', true),
    arroz: () => `${dt('<path d="M-62,10 C-64,-14 -40,-34 -10,-34 C24,-36 60,-18 62,8 C58,30 -56,32 -62,10 Z" fill="FILL"/>', '#f8f5ec', '#ddd6c3', { x: 18 })}
      ${Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, r = 6 + (i * 7) % 44; return `<ellipse cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r * 0.45 - 4).toFixed(1)}" rx="4" ry="1.8" transform="rotate(${(i * 37) % 180} ${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r * 0.45 - 4).toFixed(1)})" fill="${i % 3 ? '#fffdf6' : '#e6e0cf'}"/>`; }).join('')}
      <path d="M-40,-24 a50,22 0 0 1 36,-8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>`,
    pure: () => `${dt('<path d="M-58,12 C-66,-6 -48,-30 -24,-28 C-14,-40 12,-40 22,-30 C46,-34 66,-12 58,10 C54,30 -50,32 -58,12 Z" fill="FILL"/>', '#ffe39a', '#f1c75b', { x: 16 })}
      <path d="M-34,-6 q14,-12 28,0 t28,0 M-26,10 q12,-8 24,0 t24,0" stroke="#fff3c4" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.8"/>
      <g transform="translate(6 -22) rotate(-8)">${dt('<rect x="-12" y="-9" width="24" height="16" rx="4" fill="FILL"/>', '#fff6c2', '#f5e08a', { y: 2 })}<rect x="-8" y="-6" width="8" height="3" rx="1.5" fill="#fff" opacity="0.8"/></g>`,
    fideos: () => `${dt('<ellipse rx="60" ry="32" fill="FILL"/>', '#ffd166', '#f0a830', { x: 18 })}
      ${[-22, -10, 2, 14].map((y, i) => `<path d="M-50,${y} q12,-10 24,0 t24,0 t24,0 t24,0" stroke="${i % 2 ? '#ffe08a' : '#e09a1f'}" stroke-width="4" fill="none" stroke-linecap="round" transform="translate(${i % 2 ? 4 : 0} 0)"/>`).join('')}
      <path d="M18,-24 c8,-8 18,-4 16,4 c-8,6 -16,4 -16,-4 Z" fill="#40c057"/><path d="M18,-24 l14,6" stroke="#2b8a3e" stroke-width="1.5"/>`,
    ensalada: () => `${[[-22, -6, -20], [8, -14, 15], [26, 6, 40], [-4, 10, -50], [-30, 12, 10]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${dt('<ellipse rx="22" ry="13" fill="FILL"/>', '#69db7c', '#40c057', { y: 1 })}<path d="M-18,0 H18" stroke="#2f9e44" stroke-width="2" stroke-linecap="round"/></g>`).join('')}
      ${[[-6, -2], [18, -4], [6, 14]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="10" fill="#e03131"/><circle r="7.5" fill="#ff8787"/>${[0, 120, 240].map(a => `<ellipse cx="${(Math.cos(a / 57.3) * 4).toFixed(1)}" cy="${(Math.sin(a / 57.3) * 4).toFixed(1)}" rx="1.6" ry="2.4" fill="#ffe066"/>`).join('')}<path d="M-6,-5 a7,7 0 0 1 6,-3" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.7"/></g>`).join('')}
      <path d="M-30,-4 l10,4 M22,10 l10,-3 M-12,-18 l8,6" stroke="#ff922b" stroke-width="3" stroke-linecap="round"/>`,
    huevo: () => `${dt('<path d="M-34,0 C-40,-20 -14,-30 4,-26 C26,-30 42,-12 34,6 C30,24 6,26 -8,22 C-26,24 -32,14 -34,0 Z" fill="FILL"/>', '#ffffff', '#e3e6f5', { x: 10, extra: '<path d="M-34,0 C-40,-20 -14,-30 4,-26 C26,-30 42,-12 34,6 C30,24 6,26 -8,22 C-26,24 -32,14 -34,0 Z" fill="none" stroke="#c5cae9" stroke-width="3"/>' })}
      <g transform="translate(-2 -3)">${dt('<circle r="13" fill="FILL"/>', '#ffc43d', '#f59f00', { x: 4 })}<circle cx="-5" cy="-5" r="3.5" fill="#fff" opacity="0.75"/></g>`,
    palta: () => `<g transform="rotate(-25)">${dt('<path d="M0,-34 C14,-34 26,-10 26,10 C26,28 14,38 0,38 C-14,38 -26,28 -26,10 C-26,-10 -14,-34 0,-34 Z" fill="FILL"/>', '#3f7d3a', '#2b5f28', { x: 8 })}
      ${dt('<path d="M0,-28 C10,-28 20,-8 20,10 C20,24 10,32 0,32 C-10,32 -20,24 -20,10 C-20,-8 -10,-28 0,-28 Z" fill="FILL"/>', '#d8ec8a', '#b9d65f', { x: 6 })}
      <g transform="translate(0 12)">${dt('<circle r="11" fill="FILL"/>', '#9a6440', '#6b4426', { x: 3 })}<circle cx="-4" cy="-4" r="3" fill="#fff" opacity="0.5"/></g></g>`,
    limon: () => `<g transform="rotate(-15)">${dt('<path d="M-24,0 A24,24 0 0 1 24,0 Z" fill="FILL"/>', '#ffe066', '#fcc419', { x: 8 })}<path d="M-19,-1 A19,19 0 0 1 19,-1 Z" fill="#fff3a8"/>
      ${[-60, -30, 0, 30, 60].map(a => `<line x1="0" y1="-1" x2="${(Math.sin(a / 57.3) * 17).toFixed(1)}" y2="${(-Math.cos(a / 57.3) * 17 - 1).toFixed(1)}" stroke="#ffd43b" stroke-width="1.6"/>`).join('')}</g>`,
    gaseosa: () => `${Arte.sombra(0, 52, 30)}
      <path d="M-26,-50 L-20,48 C-20,54 20,54 20,48 L26,-50 Z" fill="#cfe3ff" opacity="0.22"/>
      ${dt('<path d="M-24,-26 L-20,46 C-20,51 20,51 20,46 L24,-26 Z" fill="FILL"/>', '#6b3418', '#43200e', { x: 8 })}
      <rect x="-14" y="-24" width="16" height="13" rx="3" fill="#e7f5ff" opacity="0.8" transform="rotate(12 -6 -18)"/>
      ${[[-10, 0], [6, 14], [-4, 30], [10, -6], [0, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff" opacity="0.5"/>`).join('')}
      <path d="M8,-26 L22,-74" stroke="#ff6b6b" stroke-width="5" stroke-linecap="round"/><path d="M10,-32 L13,-42 M16,-52 L19,-62" stroke="#fff" stroke-width="5"/>
      <path d="M-22,-46 L-17,40" stroke="#fff" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
      <ellipse cx="0" cy="-50" rx="26" ry="5" fill="none" stroke="#e7f5ff" stroke-width="2" opacity="0.6"/>`,
  };
  function rebanadas(c1, c2, m1, m2, semillas) {
    const una = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">
      ${dt('<path d="M-30,22 L-30,-8 C-42,-14 -40,-34 -22,-34 C-14,-44 14,-44 22,-34 C40,-34 42,-14 30,-8 L30,22 Q30,26 26,26 L-26,26 Q-30,26 -30,22 Z" fill="FILL"/>', c1, c2, { x: 10 })}
      ${dt('<path d="M-24,18 L-24,-10 C-33,-15 -32,-28 -19,-28 C-12,-36 12,-36 19,-28 C32,-28 33,-15 24,-10 L24,18 Z" fill="FILL"/>', m1, m2, { x: 10 })}
      ${semillas ? [[-12, -14], [6, -20], [12, 4], [-8, 8], [-16, -2], [2, -4], [14, -10]].map(([a, b], i) => `<ellipse cx="${a}" cy="${b}" rx="2.6" ry="1.5" fill="${i % 2 ? '#f4e3c1' : '#5a3b1e'}" transform="rotate(${i * 40} ${a} ${b})"/>`).join('') : ''}
      <path d="M-20,-24 a20,10 0 0 1 14,-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.45"/></g>`;
    return una(-18, 4, -12) + una(16, -2, 8);
  }

  // Posición de cada alimento sobre el plato.
  const LUGAR = { base: [205, 192, 1], ensalada: [312, 122, 0.95], huevo: [335, 215, 1], palta: [165, 118, 0.85], limon: [402, 168, 0.85], gaseosa: [490, 150, 1] };

  function escenaPlato(orden, animo) {
    const nuevos = [];
    const pieza = (id, dibujo) => {
      const [x, y, k] = LUGAR[id];
      const clase = pl.dibujados.has(id) ? '' : ' gp-nuevo';
      nuevos.push(id);
      return `<g transform="translate(${x} ${y}) scale(${k})"><g class="gp-pieza${clase}">${dibujo}</g></g>`;
    };
    let s = `<defs><radialGradient id="gp-fondo" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="gp-plato" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3f5"/></radialGradient></defs>
      <rect width="560" height="330" rx="12" fill="url(#gp-fondo)"/>
      ${Arte.estrellas(30, 560, 120)}
      <!-- Mantel -->
      <path d="M0,250 C120,236 440,236 560,250 L560,318 Q560,330 548,330 L12,330 Q0,330 0,318 Z" fill="#1b1f5c"/>
      ${[40, 120, 200, 280, 360, 440, 520].map(x => `<path d="M${x},242 L${x - 20},330" stroke="#23286e" stroke-width="18"/>`).join('')}
      <!-- Plato -->
      <ellipse cx="262" cy="186" rx="212" ry="122" fill="#0a0c2a" opacity="0.4" transform="translate(8 14)"/>
      ${dt('<ellipse cx="262" cy="180" rx="210" ry="120" fill="FILL"/>', '#e9ecff', '#c5cae9', { x: 330 })}
      <ellipse cx="262" cy="180" rx="160" ry="88" fill="url(#gp-plato)"/>
      <ellipse cx="262" cy="180" rx="160" ry="88" fill="none" stroke="#c5cae9" stroke-width="3"/>
      <path d="M90,140 A210,120 0 0 1 220,64" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    ['palta', 'ensalada', 'huevo', 'limon'].forEach(id => { if (pl.extras.has(id) && id !== 'huevo') s += pieza(id, COMIDA_SVG[id]()); });
    s += pieza('base', COMIDA_SVG[pl.base.id]() + M().cara(0, -6, 4.4, animo));
    if (pl.extras.has('huevo')) s += pieza('huevo', COMIDA_SVG.huevo());
    if (pl.extras.has('gaseosa')) s += pieza('gaseosa', COMIDA_SVG.gaseosa());
    // Orden de los alimentos: número sobre cada parte.
    if (orden) {
      const badge = (id, n) => { const [x, y] = LUGAR[id]; return `<g transform="translate(${x + 30} ${y - 34})"><circle r="12" fill="#ffd166" stroke="#12143a" stroke-width="2.5"/><text y="5" text-anchor="middle" class="gp-orden-num">${n}</text></g>`; };
      ['ensalada', 'huevo'].forEach(id => { if (pl.extras.has(id)) s += badge(id, 1); });
      s += badge('base', 2);
    }
    if (!pl.extras.size) s += `<text x="280" y="34" text-anchor="middle" class="gp-pista">Agrega acompañamientos al plato →</text>`;
    pl.dibujados = new Set(nuevos);
    return s;
  }

  // =====================================================================
  // DESAFÍO DEL DÍA (diabetes tipo 1)
  // =====================================================================

  const INICIO = 7, FIN = 23, MIN_DIA = (FIN - INICIO) * 60;
  const U = 16;                    // efecto de cada unidad de insulina rápida en el modelo
  const RAZON = 15;                // 1 unidad cada 15 g de carbohidratos
  const DIAS = [
    { id: 'escuela', n: '🎒 Día de escuela', eventos: [
      { h: 7.5, tipo: 'comida', e: '🍞', n: 'Desayuno', d: 'Tostadas con mermelada y café con leche', g: 45, ig: 70 },
      { h: 13, tipo: 'comida', e: '🍝', n: 'Almuerzo', d: 'Fideos con tuco y una manzana', g: 75, ig: 55 },
      { h: 17, tipo: 'comida', e: '🍪', n: 'Merienda', d: 'Galletitas y un jugo', g: 30, ig: 65 },
      { h: 18.5, tipo: 'ejercicio', e: '⚽', n: 'Fútbol', d: 'Entrenamiento de fútbol durante una hora' },
      { h: 21, tipo: 'comida', e: '🍽️', n: 'Cena', d: 'Milanesa con puré', g: 60, ig: 80 },
    ] },
    { id: 'cumple', n: '🎂 Sábado de cumpleaños', eventos: [
      { h: 9, tipo: 'comida', e: '🥐', n: 'Desayuno', d: 'Medialunas y chocolatada', g: 60, ig: 70 },
      { h: 13.5, tipo: 'comida', e: '🥩', n: 'Almuerzo', d: 'Asado con ensalada y un pancito', g: 30, ig: 65 },
      { h: 17.5, tipo: 'comida', e: '🎂', n: 'Cumpleaños', d: 'Torta y un vaso de gaseosa', g: 90, ig: 75 },
      { h: 18.5, tipo: 'ejercicio', e: '💃', n: 'Baile', d: 'Una hora bailando en el cumpleaños' },
      { h: 21.5, tipo: 'comida', e: '🍕', n: 'Cena', d: 'Pizza', g: 75, ig: 60, lenta: 40, nota: 'La grasa del queso hace que la glucosa de la pizza entre <b>más tarde</b>. Se puede aplicar una parte ahora y el resto una hora después con 💉 Corrección.' },
    ] },
  ];
  const hora = t => { const m = Math.round(INICIO * 60 + t), h = Math.floor(m / 60); return `${h}:${String(m % 60).padStart(2, '0')}`; };
  const minDe = h => (h - INICIO) * 60;

  let de = null, animDe = null;

  function desafio(el) {
    de = { el, dia: DIAS[0], estado: 'inicio' };
    el.innerHTML = `
      <div class="panel bm-mesa gl-escena"><div class="nx-scroll"><svg id="gd-escena" viewBox="0 0 1000 230" role="img" aria-label="El día de Sofi"></svg></div></div>
      <div class="gl-graficos">
        <div class="panel bm-mesa">
          <div class="bm-graf-cab"><h3>Glucemia durante el día</h3>
            <div class="bm-glu-leyenda"><span><i style="background:#2fd186"></i>Rango objetivo (70–180)</span><span>💉 insulina</span><span>🧃 jugo</span></div></div>
          <div class="nx-scroll"><svg id="gd-graf" viewBox="0 0 1000 280" role="img" aria-label="Gráfico de glucemia a lo largo del día"></svg></div>
        </div>
        <aside class="panel gl-res" id="gd-panel"></aside>
      </div>`;
    panelInicio();
    nuevoDia();
    cancelAnimationFrame(animDe);
    de.ultimo = performance.now();
    animDe = requestAnimationFrame(bucleDia);
  }

  function nuevoDia() {
    const { nuevaSimulacion } = M();
    const s = nuevaSimulacion(null);
    Object.assign(s, { G: 100, comidas: [], lineal: true, fGlucagon: 0.3, ejFuerza: 3.1, ejDesde: 0, ejHasta: -1 });
    s.pts = [s.G];
    de.sim = s;
    de.marcas = [];
    de.dosis = {};
    de.proximo = 0;
    de.corriendo = false;
    de.rapido = false;
    de.alertas = {};
    de.diario = [];
    de.estado = 'inicio';
  }

  function panelInicio() {
    const mejor = Util.leer('glu-desafio-' + de.dia.id, 0);
    de.el.querySelector('#gd-panel').innerHTML = `
      <h3>🏆 Desafío del día</h3>
      <p><b>Sofi</b> tiene 14 años y <b>diabetes tipo 1</b>: su páncreas no fabrica insulina. A la mañana ya se aplicó la insulina lenta; antes de cada comida necesita <b>insulina rápida</b>.</p>
      <p class="gd-regla">💉 Su médica le indicó <b>1 unidad cada ${RAZON} g de carbohidratos</b>.</p>
      <p>Tu misión: mantener la glucemia <b>entre 70 y 180 mg/dl</b> la mayor parte del día, sin hipoglucemias.</p>
      <div class="segmentado chico" id="gd-dias">${DIAS.map(d => `<button data-d="${d.id}" class="${d === de.dia ? 'activo' : ''}">${d.n}</button>`).join('')}</div>
      <p class="bm-suave">${mejor ? `Tu mejor resultado en este día: ${'⭐'.repeat(mejor)}` : 'Todavía no jugaste este día.'}</p>
      <button class="btn primario" id="gd-empezar">▶ Empezar el día</button>`;
    de.el.querySelectorAll('#gd-dias button').forEach(b => b.addEventListener('click', () => { de.dia = DIAS.find(d => d.id === b.dataset.d); nuevoDia(); panelInicio(); }));
    de.el.querySelector('#gd-empezar').addEventListener('click', () => { nuevoDia(); de.estado = 'jugando'; de.corriendo = true; panelJuego(); });
  }

  function panelJuego() {
    de.el.querySelector('#gd-panel').innerHTML = `
      <div class="gd-reloj"><span id="gd-hora">7:00</span><span id="gd-estado"></span></div>
      <div id="gd-decision"></div>
      <div class="gd-botones" id="gd-botones">
        <button class="btn chico" id="gd-pausa">⏸ Pausa</button>
        <button class="btn chico" id="gd-vel">⏩ Más rápido</button>
        <button class="btn chico" id="gd-jugo">🧃 Jugo (15 g)</button>
        <button class="btn chico" id="gd-corr">💉 Corrección (1 u)</button>
      </div>
      <ol class="bm-diario" id="gd-diario"></ol>`;
    const q = s => de.el.querySelector(s);
    q('#gd-pausa').addEventListener('click', () => { de.corriendo = !de.corriendo; q('#gd-pausa').textContent = de.corriendo ? '⏸ Pausa' : '▶ Seguir'; });
    q('#gd-vel').addEventListener('click', () => { de.rapido = !de.rapido; q('#gd-vel').textContent = de.rapido ? '▶ Velocidad normal' : '⏩ Más rápido'; });
    q('#gd-jugo').addEventListener('click', () => {
      comerEn(de.sim.t, 15, 100);
      de.marcas.push({ t: de.sim.t, tipo: 'jugo' });
      q('#gd-jugo').classList.remove('gd-alerta');
      anotar('🧃', 'Toma un jugo: 15 g de azúcar que se absorben rápido.');
    });
    q('#gd-corr').addEventListener('click', () => {
      de.sim.iny += U;
      de.marcas.push({ t: de.sim.t, tipo: 'insulina', u: 1, corr: true });
      anotar('💉', 'Se aplica <b>1 unidad de corrección</b>.');
    });
    anotar('☀️', `Empieza el día: ${de.dia.n.replace(/^\S+\s/, '').toLowerCase()}. Glucemia en ayunas: <b>100 mg/dl</b>.`);
  }

  function anotar(icono, html) {
    de.diario.push({ icono, html, min: de.sim.t });
    const ol = de.el.querySelector('#gd-diario');
    if (!ol) return;
    ol.innerHTML = de.diario.map((d, i) => `<li class="${i === de.diario.length - 1 ? 'nuevo' : ''}"><span class="bm-diario-min">${hora(d.min)}</span><span>${d.icono}</span><p>${d.html}</p></li>`).join('');
    ol.scrollTop = ol.scrollHeight;
  }

  function comerEn(t0, g, ig, lenta = 0) {
    const tp = 20 + (100 - ig) * 0.4 + lenta;
    de.sim.comidas.push({ t0, tp, amp: 1.6 * g * (1.6 + 2.6 * ig / 100) / (tp * E) });
  }

  // Pausa en cada evento del día para que el estudiante decida.
  function decidir(ev) {
    de.corriendo = false;
    de.decision = ev;
    const caja = de.el.querySelector('#gd-decision');
    de.el.querySelector('#gd-botones').hidden = true;
    if (ev.tipo === 'comida') {
      caja.innerHTML = `<div class="gd-decision">
        <span class="bm-res-lab">${hora(minDe(ev.h))} · ${ev.n}</span>
        <h4>${ev.e} ${ev.d}</h4>
        <p>Carbohidratos: <b>${ev.g} g</b>${ev.nota ? `<br><span class="bm-suave">${ev.nota}</span>` : ''}</p>
        <p>¿Cuántas unidades de insulina rápida se aplica? <small class="bm-suave">(1 u cada ${RAZON} g)</small></p>
        <div class="gd-unidades">${Array.from({ length: 11 }, (_, u) => `<button data-u="${u}">${u}</button>`).join('')}</div></div>`;
      caja.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => {
        const u = +b.dataset.u, t = minDe(ev.h);
        de.sim.iny += u * U;
        comerEn(t, ev.g, ev.ig, ev.lenta);
        de.dosis[ev.n] = { u, ok: ev.g / RAZON, e: ev.e };
        if (u) de.marcas.push({ t, tipo: 'insulina', u });
        de.marcas.push({ t, tipo: 'comida', e: ev.e });
        anotar(ev.e, `<b>${ev.n}</b>: ${ev.d.toLowerCase()} (${ev.g} g). Se aplica <b>${u} u</b> de insulina.`);
        seguir();
      }));
    } else {
      caja.innerHTML = `<div class="gd-decision">
        <span class="bm-res-lab">${hora(minDe(ev.h))} · ${ev.n}</span>
        <h4>${ev.e} ${ev.d}</h4>
        <p>Glucemia ahora: <b>${Math.round(de.sim.G)} mg/dl</b>. Mientras se mueven, los músculos captan glucosa <b>aunque no haya insulina nueva</b>.</p>
        <div class="gd-opciones"><button data-o="colacion">🍌 Comer una banana antes (20 g)</button><button data-o="nada">🙅 Nada, ir así</button></div></div>`;
      caja.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
        const t = minDe(ev.h);
        if (b.dataset.o === 'colacion') { comerEn(t, 20, 70); de.marcas.push({ t, tipo: 'comida', e: '🍌' }); }
        de.sim.ejDesde = t; de.sim.ejHasta = t + 60;
        de.ejercicio = { ev, colacion: b.dataset.o === 'colacion' };
        de.marcas.push({ t, tipo: 'ejercicio', e: ev.e });
        anotar(ev.e, `<b>${ev.n}</b> durante una hora${b.dataset.o === 'colacion' ? ', después de una colación' : ''}.`);
        seguir();
      }));
    }
  }

  function seguir() {
    de.decision = null;
    de.el.querySelector('#gd-decision').innerHTML = '';
    de.el.querySelector('#gd-botones').hidden = false;
    de.el.querySelector('#gd-pausa').textContent = '⏸ Pausa';
    de.proximo++;
    de.corriendo = true;
  }

  function bucleDia(t) {
    animDe = requestAnimationFrame(bucleDia);
    const dtReal = Math.min(0.1, (t - de.ultimo) / 1000);
    de.ultimo = t;
    if (de.el.closest('.view').hidden || de.el.hidden) return;
    const s = de.sim;
    if (de.estado === 'jugando' && de.corriendo) {
      let min = dtReal * (de.rapido ? 90 : 36);
      while (min > 0 && s.t < MIN_DIA && de.corriendo) {
        const ev = de.dia.eventos[de.proximo];
        if (ev && s.t >= minDe(ev.h)) { decidir(ev); break; }
        const paso = Math.min(0.5, min, ev ? Math.max(0.01, minDe(ev.h) - s.t) : 0.5);
        M().pasoGlucemia(s, paso, 1);
        min -= paso;
        while (s.pts.length <= Math.floor(s.t) && s.pts.length <= MIN_DIA) s.pts.push(s.G);
        alertas();
      }
      if (s.t >= MIN_DIA) terminarDia();
    }
    dibujarEscenaDia(t / 1000);
    dibujarGraficoDia();
    const h = de.el.querySelector('#gd-hora');
    if (h) {
      h.textContent = hora(s.t);
      const [txt, col] = estadoG(s.G);
      const e = de.el.querySelector('#gd-estado');
      e.textContent = `${Math.round(s.G)} mg/dl · ${txt}`;
      e.style.color = col;
    }
  }

  const estadoG = G => G < 70 ? ['HIPOGLUCEMIA', '#5cc8ff'] : G > 180 ? ['ALTA', '#ff6b6b'] : ['EN RANGO', '#2fd186'];

  function alertas() {
    const s = de.sim, a = de.alertas;
    if (s.G < 70 && !a.hipo) {
      a.hipo = true;
      de.el.querySelector('#gd-jugo').classList.add('gd-alerta');
      anotar('⚠️', '<b>Hipoglucemia</b>: Sofi se siente mareada, transpira y tiembla. Hay que darle <b>🧃 un jugo</b> con azúcar ya.');
    }
    if (s.G > 85) a.hipo = false;
    if (s.G > 250 && !a.alta) {
      a.alta = true;
      anotar('🔺', '<b>Glucemia muy alta</b>: sin suficiente insulina la glucosa no entra a las células. Podría aplicarse una <b>💉 corrección</b>.');
    }
    if (s.G < 200) a.alta = false;
  }

  function terminarDia() {
    de.estado = 'fin';
    de.corriendo = false;
    const pts = de.sim.pts;
    const n = pts.length;
    const enRango = pts.filter(g => g >= 70 && g <= 180).length;
    const tir = Math.round(enRango / n * 100);
    const hipo = pts.filter(g => g < 70).length, alta = pts.filter(g => g > 180).length;
    const estrellas = tir >= 85 && hipo < 5 ? 3 : tir >= 70 && hipo < 20 ? 2 : 1;
    const clave = 'glu-desafio-' + de.dia.id;
    const mejor = Util.leer(clave, 0);
    if (estrellas > mejor) Util.guardar(clave, estrellas);
    const filas = Object.entries(de.dosis).map(([n, d]) => `<tr><td>${d.e} ${n}</td><td>${d.u} u</td><td>${d.ok} u</td><td>${d.u === d.ok ? '✅' : d.u < d.ok ? '🔺 poca' : '🔻 mucha'}</td></tr>`).join('');
    const consejos = [];
    if (Object.values(de.dosis).some(d => d.u < d.ok)) consejos.push('Con <b>menos insulina</b> de la necesaria, la glucosa se queda en la sangre (hiperglucemia).');
    if (Object.values(de.dosis).some(d => d.u > d.ok)) consejos.push('Con <b>insulina de más</b>, las células captan demasiada glucosa y puede haber hipoglucemia.');
    if (de.ejercicio && !de.ejercicio.colacion) consejos.push('Antes de hacer ejercicio conviene comer una <b>colación</b> o bajar la dosis anterior: los músculos gastan glucosa.');
    if (de.dia.id === 'cumple' && hipo >= 5) consejos.push('En la pizza la glucosa entra más tarde: si toda la insulina se aplica al principio, actúa antes que la glucosa. Por eso se puede <b>dividir la dosis</b>.');
    de.el.querySelector('#gd-panel').innerHTML = `
      <h3>🌙 Fin del día ${'⭐'.repeat(estrellas)}</h3>
      <div class="bm-resultado bm-glu-res" style="--c:${tir >= 85 ? '#2fd186' : tir >= 70 ? '#ffa94d' : '#ff6b6b'}">
        <dl class="bm-glu-datos">
          <div><dt>En rango</dt><dd>${tir} <small>%</small></dd></div>
          <div><dt>Hipo</dt><dd>${Math.round(hipo / 60 * 10) / 10} <small>h</small></dd></div>
          <div><dt>Alta</dt><dd>${Math.round(alta / 60 * 10) / 10} <small>h</small></dd></div>
        </dl>
        <p>${estrellas === 3 ? '¡Excelente! Sofi pasó el día con la glucemia en rango.' : hipo >= 5 ? `Sofi tuvo <b>hipoglucemia</b> durante ${hipo} minutos: es la complicación más peligrosa, porque el cerebro se queda sin glucosa.` : estrellas === 2 ? 'Bien, aunque hubo momentos fuera de rango.' : 'Sofi pasó mucho tiempo con la glucemia alta. Mira la tabla y vuelve a intentarlo.'}</p>
      </div>
      <table class="bm-tabla-concepto gd-tabla"><thead><tr><th></th><th>Aplicaste</th><th>Indicado</th><th></th></tr></thead><tbody>${filas}</tbody></table>
      ${consejos.length ? `<ul class="gd-consejos">${consejos.map(c => `<li>${c}</li>`).join('')}</ul>` : ''}
      <button class="btn primario" id="gd-otra">↺ Jugar de nuevo</button>`;
    de.el.querySelector('#gd-otra').addEventListener('click', () => { nuevoDia(); panelInicio(); });
  }

  // ---------- Escena del día: cielo según la hora, camino con los eventos y Sofi ----------
  const mezclar = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - k) + parseInt(b.slice(1 + i, 3 + i), 16) * k).toString(16).padStart(2, '0')).join('');
  const CIELO = [[7, '#3b2f7a', '#ff9e7a'], [9, '#2f6fd0', '#8fd0ff'], [16, '#2f6fd0', '#8fd0ff'], [19, '#3b2f7a', '#ff8c69'], [20.5, '#14164a', '#3b2f7a'], [23, '#0c0e30', '#1b1f5c']];
  function cielo(h) {
    let i = CIELO.findIndex(c => c[0] > h);
    if (i <= 0) i = i === 0 ? 1 : CIELO.length - 1;
    const [h0, a0, b0] = CIELO[i - 1], [h1, a1, b1] = CIELO[i];
    const k = Math.max(0, Math.min(1, (h - h0) / (h1 - h0)));
    return [mezclar(a0, a1, k), mezclar(b0, b1, k)];
  }
  const XD = t => 60 + t / MIN_DIA * 880;
  const sueloY = x => 182 + Math.sin(x / 140) * 6;

  function dibujarEscenaDia(seg) {
    const svg = de.el.querySelector('#gd-escena');
    const s = de.sim, h = INICIO + s.t / 60;
    const [arriba, abajo] = cielo(h);
    const noche = Math.max(0, Math.min(1, (h - 19.5) / 1.5));
    // Sol (de 6 a 20 h) y luna.
    const sol = (h - 6) / 14, sx = 60 + sol * 880, sy = 150 - Math.sin(sol * Math.PI) * 120;
    const ev = de.dia.eventos;
    const ejerciendo = s.t >= s.ejDesde && s.t < s.ejHasta;
    const comiendo = de.sim.comidas.some(c => s.t - c.t0 >= 0 && s.t - c.t0 < 25);
    const animo = ejerciendo ? 'esfuerzo' : s.G < 70 ? 'preocupado' : s.G > 180 ? 'triste' : comiendo ? 'comiendo' : 'feliz';
    const x = XD(s.t), y = sueloY(x), paso = de.corriendo ? Math.sin(seg * 12) : 0;
    const [txt, col] = estadoG(s.G);
    const lleno = Math.max(0, Math.min(1, (s.G - 40) / 260));
    svg.innerHTML = `<defs><linearGradient id="gd-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${arriba}"/><stop offset="1" stop-color="${abajo}"/></linearGradient>
        <radialGradient id="gd-sol"><stop offset="0" stop-color="#fff3bf"/><stop offset="0.5" stop-color="#ffd43b" stop-opacity="0.6"/><stop offset="1" stop-color="#ffd43b" stop-opacity="0"/></radialGradient></defs>
      <rect width="1000" height="230" rx="12" fill="url(#gd-cielo)"/>
      <g opacity="${noche}">${Arte.estrellas(50, 1000, 130)}</g>
      ${h < 20 ? `<circle cx="${sx}" cy="${sy}" r="46" fill="url(#gd-sol)"/><circle cx="${sx}" cy="${sy}" r="18" fill="#ffe066"/>` : ''}
      ${noche > 0 ? `<g opacity="${noche}"><circle cx="820" cy="52" r="18" fill="#f1f3ff"/><circle cx="828" cy="46" r="16" fill="${arriba}"/></g>` : ''}
      <path d="M0,170 C140,120 260,150 380,132 C520,112 640,150 760,128 C860,112 940,134 1000,126 L1000,230 L0,230 Z" fill="${mezclar('#2b8a3e', '#0f2a2a', noche)}" opacity="0.7"/>
      <path d="M0,190 ${Array.from({ length: 21 }, (_, i) => `L${i * 50},${sueloY(i * 50)}`).join(' ')} L1000,230 L0,230 Z" fill="${mezclar('#37b24d', '#13363a', noche)}"/>
      <path d="M0,200 ${Array.from({ length: 21 }, (_, i) => `L${i * 50},${sueloY(i * 50) + 14}`).join(' ')} L1000,230 L0,230 Z" fill="${mezclar('#2f9e44', '#0f2c30', noche)}"/>
      <path d="M60,${sueloY(60) + 6} ${Array.from({ length: 45 }, (_, i) => { const xx = 60 + i * 20; return `L${xx},${sueloY(xx) + 6}`; }).join(' ')}" stroke="#f1e3c0" stroke-width="5" opacity="0.55" fill="none" stroke-linecap="round"/>
      ${Array.from({ length: FIN - INICIO + 1 }, (_, i) => { const xx = XD(i * 60); return `<text x="${xx}" y="${sueloY(xx) + 30}" text-anchor="middle" class="gd-hora-eje">${INICIO + i}</text>`; }).join('')}
      ${ev.map((e, i) => { const xx = XD(minDe(e.h)), yy = sueloY(xx) - 4, hecho = i < de.proximo; return `<g opacity="${hecho ? 0.55 : 1}"><line x1="${xx}" x2="${xx}" y1="${yy}" y2="${yy - 34}" stroke="#fff" stroke-width="2" opacity="0.5"/><circle cx="${xx}" cy="${yy - 48}" r="15" fill="#12143a" stroke="${hecho ? '#9aa3ff' : '#ffd166'}" stroke-width="2"/><text x="${xx}" y="${yy - 42}" text-anchor="middle" font-size="16">${e.e}</text></g>`; }).join('')}
      <g transform="translate(${x} ${y - 4 + Math.abs(paso) * -3})">
        ${Arte.sombra(0, 8, 18)}
        <path d="M-7,0 l${-3 + paso * 4},10 M7,0 l${3 - paso * 4},10" stroke="#5a3b8c" stroke-width="5" stroke-linecap="round"/>
        ${dt('<rect x="-17" y="-40" width="34" height="42" rx="16" fill="FILL"/>', '#ff8fab', '#e0607f', { x: 6 })}
        <path d="M-17,-22 l${-8 - paso * 3},10 M17,-22 l${8 + paso * 3},10" stroke="#e0607f" stroke-width="5" stroke-linecap="round"/>
        <path d="M-15,-34 C-12,-48 12,-50 16,-36 C8,-42 -4,-42 -15,-34 Z" fill="#5a3b1e"/>
        ${M().cara(0, -24, 3.4, animo)}
        ${ejerciendo ? `<path d="M18,-38 q-3,5 0,8 q3,-3 0,-8 Z" fill="#9ec5ff" opacity="${0.5 + Math.abs(paso) * 0.5}"/>` : ''}
        <text x="0" y="-52" text-anchor="middle" class="gd-nombre">SOFI</text></g>
      <g transform="translate(14 12)"><rect width="236" height="74" rx="14" fill="#12143a" opacity="0.92"/><rect width="236" height="74" rx="14" fill="none" stroke="${col}" stroke-width="2"/>
        <text x="12" y="20" class="bm-rotulo">GLUCEMIA</text><text x="224" y="20" text-anchor="end" class="bm-letra chica" fill="${col}">${txt}</text>
        <text x="12" y="52" class="bm-glu-num" fill="${col}">${Math.round(s.G)}</text><text x="${Math.round(s.G) >= 100 ? 90 : 70}" y="52" class="bm-letra" fill="#c9ccf5">mg/dl</text>
        <text x="224" y="52" text-anchor="end" class="gd-reloj-svg">🕒 ${hora(s.t)}</text>
        <rect x="12" y="60" width="212" height="5" rx="2.5" fill="#23266b"/><rect x="12" y="60" width="${(212 * lleno).toFixed(1)}" height="5" rx="2.5" fill="${col}"/></g>
      ${de.estado === 'inicio' ? `<g><rect x="330" y="16" width="340" height="44" rx="22" fill="#12143a" opacity="0.85"/><text x="500" y="44" text-anchor="middle" class="gd-cartel">Elige el día y toca ▶ Empezar</text></g>` : ''}
      ${de.decision ? `<g><rect x="330" y="16" width="340" height="44" rx="22" fill="#12143a" opacity="0.88" stroke="#ffd166" stroke-width="2"/><text x="500" y="44" text-anchor="middle" class="gd-cartel">${de.decision.e} ¡Hay que decidir! Mira el panel →</text></g>` : ''}`;
  }

  function dibujarGraficoDia() {
    const W = 1000, H = 280;
    const g = ejes({ W, H, x0: 56, x1: 980, xIni: 0, xFin: MIN_DIA, ticks: Array.from({ length: FIN - INICIO + 1 }, (_, i) => i * 60), fmt: v => `${INICIO + v / 60}h`, titulo: 'Hora del día', yMax: Math.max(240, Math.ceil((Math.max(...de.sim.pts) + 30) / 40) * 40), id: 'gd' });
    let svg = g.svg + `<rect x="56" y="${g.Y(180)}" width="924" height="${g.Y(70) - g.Y(180)}" fill="#2fd186" opacity="0.1"/>
      <text x="64" y="${g.Y(180) + 14}" class="bm-gg-zona" style="fill:#2fd186;opacity:0.9">RANGO OBJETIVO</text>`;
    const pts = de.sim.pts;
    if (pts.length > 1) {
      const linea = pts.map((v, i) => `${g.X(i).toFixed(1)},${g.Y(v).toFixed(1)}`).join(' ');
      svg += g.trazo(linea, '#e9ebff');
      // Tramos fuera de rango pintados encima.
      const tramo = (cond, col) => {
        let out = '', cur = [];
        pts.forEach((v, i) => { if (cond(v)) cur.push(`${g.X(i).toFixed(1)},${g.Y(v).toFixed(1)}`); else if (cur.length) { out += `<polyline points="${cur.join(' ')}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; cur = []; } });
        if (cur.length) out += `<polyline points="${cur.join(' ')}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
        return out;
      };
      svg += tramo(v => v > 180, '#ff6b6b') + tramo(v => v < 70, '#5cc8ff');
      const last = pts.length - 1;
      if (de.estado === 'jugando') svg += `<circle cx="${g.X(last)}" cy="${g.Y(pts[last])}" r="5" fill="#e9ebff" stroke="#0e1033" stroke-width="2"/>`;
    }
    de.marcas.forEach(m => {
      const x = g.X(m.t);
      if (m.tipo === 'comida' || m.tipo === 'ejercicio') svg += `<text x="${x}" y="${g.yTop + 14}" text-anchor="middle" font-size="15">${m.e}</text>`;
      if (m.tipo === 'insulina') svg += `<text x="${x + (m.corr ? 0 : 14)}" y="${g.yTop + (m.corr ? 14 : 32)}" text-anchor="middle" class="gd-dosis">💉${m.u}</text>`;
      if (m.tipo === 'jugo') svg += `<text x="${x}" y="${g.Y(40) - 6}" text-anchor="middle" font-size="13">🧃</text>`;
      if (m.tipo === 'ejercicio') svg += `<rect x="${x}" y="${g.Y(360)}" width="${g.X(m.t + 60) - x}" height="${g.Y(40) - g.Y(360)}" fill="#9ec5ff" opacity="0.08"/>`;
    });
    de.el.querySelector('#gd-graf').innerHTML = svg;
  }

  return { plato, desafio };
})();
