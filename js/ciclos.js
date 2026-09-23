// Módulo 8: Ciclos de la naturaleza (agua, carbono y nitrógeno).
const Ciclos = (function () {
  // Cada ciclo: lugares (nodos), procesos (flechas), la secuencia para ordenar y el fondo del paisaje.
  const CICLOS = {
    agua: {
      nombre: 'Ciclo del agua', icono: '💧', viajero: '💧', viajeroNombre: 'una gota de agua', inicio: 'oceano',
      nodos: {
        oceano: { nombre: 'Océano', icono: '🌊', x: 120, y: 385, desc: 'Guarda el 97 % del agua del planeta. Es salada.' },
        vapor: { nombre: 'Vapor en el aire', icono: '♨️', x: 170, y: 195, desc: 'El agua en estado gaseoso, invisible, forma parte del aire.' },
        nube: { nombre: 'Nubes', icono: '☁️', x: 420, y: 80, desc: 'Millones de gotitas de agua o cristales de hielo suspendidos en el aire.' },
        glaciar: { nombre: 'Glaciares y nieve', icono: '🏔️', x: 690, y: 175, desc: 'Agua dulce congelada. Guardan agua durante años o siglos.' },
        rio: { nombre: 'Ríos y lagos', icono: '🏞️', x: 580, y: 325, desc: 'Agua dulce en la superficie que corre hacia el mar.' },
        planta: { nombre: 'Plantas', icono: '🌳', x: 380, y: 290, desc: 'Absorben agua por las raíces y la liberan por las hojas.' },
        subterranea: { nombre: 'Agua subterránea', icono: '🕳️', x: 470, y: 392, desc: 'Agua que se filtró y se acumula bajo tierra, en los acuíferos.' },
      },
      procesos: [
        { de: 'oceano', a: 'vapor', nombre: 'Evaporación', desc: 'El Sol calienta el agua del mar y la transforma en vapor.' },
        { de: 'vapor', a: 'nube', nombre: 'Condensación', desc: 'El vapor sube, se enfría y se convierte en gotitas que forman las nubes.' },
        { de: 'nube', a: 'oceano', nombre: 'Precipitación (lluvia sobre el mar)', desc: 'Las gotitas se juntan, pesan más y caen como lluvia.' },
        { de: 'nube', a: 'rio', nombre: 'Precipitación (lluvia)', desc: 'La lluvia cae sobre la tierra y llena ríos y lagos.' },
        { de: 'nube', a: 'glaciar', nombre: 'Precipitación (nieve)', desc: 'En lugares fríos o altos el agua cae como nieve y forma glaciares.' },
        { de: 'glaciar', a: 'rio', nombre: 'Fusión (deshielo)', desc: 'Cuando hace más calor, el hielo se derrite y alimenta a los ríos.' },
        { de: 'glaciar', a: 'vapor', nombre: 'Sublimación', desc: 'Con viento y sol, el hielo pasa directamente a vapor, sin derretirse.' },
        { de: 'rio', a: 'oceano', nombre: 'Escorrentía', desc: 'El agua corre por la superficie, en ríos y arroyos, hasta el mar.' },
        { de: 'rio', a: 'subterranea', nombre: 'Infiltración', desc: 'Parte del agua se filtra por el suelo y llega a las capas subterráneas.' },
        { de: 'rio', a: 'vapor', nombre: 'Evaporación', desc: 'El agua de ríos y lagos también se evapora con el calor del Sol.' },
        { de: 'subterranea', a: 'planta', nombre: 'Absorción por las raíces', desc: 'Las raíces de las plantas toman el agua del suelo.' },
        { de: 'subterranea', a: 'oceano', nombre: 'Flujo subterráneo', desc: 'El agua subterránea se mueve lentamente hasta desembocar en el mar.' },
        { de: 'planta', a: 'vapor', nombre: 'Transpiración', desc: 'Las plantas liberan vapor de agua por pequeños poros de las hojas.' },
      ],
      orden: [
        { nombre: 'Evaporación', desc: 'El Sol calienta el agua de mares y ríos y se vuelve vapor.' },
        { nombre: 'Condensación', desc: 'El vapor se enfría en la altura y forma nubes.' },
        { nombre: 'Precipitación', desc: 'El agua cae como lluvia, nieve o granizo.' },
        { nombre: 'Escorrentía e infiltración', desc: 'El agua corre por ríos o se filtra en el suelo.' },
        { nombre: 'Acumulación', desc: 'El agua se junta en océanos, lagos y acuíferos… y todo vuelve a empezar.' },
      ],
      fondo: `
        <rect width="800" height="460" fill="#e7f5ff"/>
        <circle cx="70" cy="60" r="34" fill="#ffd43b"/>
        <path d="M0,340 L250,340 L250,460 L0,460 Z" fill="#74c0fc"/>
        <path d="M240,340 C300,330 330,300 380,300 L800,300 L800,460 L240,460 Z" fill="#b2f2bb"/>
        <path d="M600,300 L690,140 L780,300 Z" fill="#adb5bd"/><path d="M660,195 L690,140 L720,195 L700,185 L690,200 L678,186 Z" fill="#fff"/>
        <path d="M240,400 L800,400 L800,460 L240,460 Z" fill="#d9c8a9" opacity="0.8"/>
        <path d="M520,318 C560,316 600,322 640,318" stroke="#4dabf7" stroke-width="10" fill="none" stroke-linecap="round"/>`,
    },
    carbono: {
      nombre: 'Ciclo del carbono', icono: '🌿', viajero: 'C', viajeroNombre: 'un átomo de carbono', inicio: 'aire',
      nodos: {
        aire: { nombre: 'CO₂ en el aire', icono: '💨', x: 400, y: 70, desc: 'El carbono está en la atmósfera formando dióxido de carbono (CO₂).' },
        plantas: { nombre: 'Plantas', icono: '🌳', x: 210, y: 270, desc: 'Guardan el carbono en su cuerpo: en la glucosa, la madera y las hojas.' },
        animales: { nombre: 'Animales', icono: '🐄', x: 430, y: 280, desc: 'Obtienen el carbono al comer plantas u otros animales.' },
        suelo: { nombre: 'Restos y descomponedores', icono: '🍄', x: 320, y: 392, desc: 'Hojas caídas, restos y desechos que hongos y bacterias descomponen.' },
        fosiles: { nombre: 'Combustibles fósiles', icono: '🛢️', x: 640, y: 392, desc: 'Petróleo, carbón y gas: restos de seres vivos enterrados hace millones de años.' },
        oceano: { nombre: 'Océano', icono: '🌊', x: 95, y: 395, desc: 'El mar disuelve mucho CO₂. Es uno de los grandes depósitos de carbono.' },
      },
      procesos: [
        { de: 'aire', a: 'plantas', nombre: 'Fotosíntesis', desc: 'Las plantas toman CO₂ del aire y, con la luz del Sol, fabrican glucosa.' },
        { de: 'plantas', a: 'aire', nombre: 'Respiración de las plantas', desc: 'Las plantas también respiran y devuelven algo de CO₂ al aire.' },
        { de: 'plantas', a: 'animales', nombre: 'Alimentación', desc: 'Los animales comen plantas y el carbono pasa a formar parte de su cuerpo.' },
        { de: 'animales', a: 'aire', nombre: 'Respiración de los animales', desc: 'Al respirar, los animales liberan CO₂.' },
        { de: 'plantas', a: 'suelo', nombre: 'Muerte y caída de hojas', desc: 'Las hojas y plantas muertas quedan en el suelo.' },
        { de: 'animales', a: 'suelo', nombre: 'Muerte y desechos', desc: 'Los restos y excrementos de los animales llegan al suelo.' },
        { de: 'suelo', a: 'aire', nombre: 'Descomposición', desc: 'Hongos y bacterias descomponen los restos y liberan CO₂.' },
        { de: 'suelo', a: 'fosiles', nombre: 'Fosilización', desc: 'Algunos restos quedan enterrados y, durante millones de años, se transforman en petróleo o carbón.' },
        { de: 'fosiles', a: 'aire', nombre: 'Combustión', desc: 'Al quemar combustibles fósiles (autos, fábricas) se libera CO₂ muy rápido.' },
        { de: 'aire', a: 'oceano', nombre: 'Disolución', desc: 'El CO₂ del aire se disuelve en el agua del mar.' },
        { de: 'oceano', a: 'aire', nombre: 'Liberación del océano', desc: 'Cuando el agua se calienta, parte del CO₂ disuelto vuelve al aire.' },
      ],
      orden: [
        { nombre: 'Fotosíntesis', desc: 'Las plantas toman CO₂ del aire.' },
        { nombre: 'Alimentación', desc: 'Los animales comen plantas y el carbono pasa a ellos.' },
        { nombre: 'Muerte y descomposición', desc: 'Los restos llegan al suelo y los descomponedores actúan.' },
        { nombre: 'Formación de combustibles fósiles', desc: 'En millones de años algunos restos se vuelven petróleo o carbón.' },
        { nombre: 'Combustión', desc: 'Al quemarlos, el CO₂ vuelve al aire.' },
      ],
      fondo: `
        <rect width="800" height="460" fill="#e7f5ff"/>
        <circle cx="720" cy="60" r="30" fill="#ffd43b"/>
        <path d="M0,340 L180,340 L180,460 L0,460 Z" fill="#74c0fc"/>
        <path d="M170,340 C220,320 260,330 300,330 L800,330 L800,460 L170,460 Z" fill="#b2f2bb"/>
        <path d="M170,380 L800,380 L800,460 L170,460 Z" fill="#c8a97e"/>
        <path d="M520,420 C560,410 700,414 760,430 L760,450 L520,450 Z" fill="#495057" opacity="0.55"/>
        <rect x="690" y="250" width="40" height="80" fill="#868e96"/><rect x="705" y="220" width="12" height="40" fill="#495057"/>`,
    },
    nitrogeno: {
      nombre: 'Ciclo del nitrógeno', icono: '🫘', viajero: 'N', viajeroNombre: 'un átomo de nitrógeno', inicio: 'aire',
      nodos: {
        aire: { nombre: 'N₂ en el aire', icono: '💨', x: 420, y: 65, desc: 'El 78 % del aire es nitrógeno (N₂), pero plantas y animales no pueden usarlo así.' },
        amonio: { nombre: 'Amonio en el suelo', icono: '🧫', x: 320, y: 392, desc: 'Nitrógeno en forma de amonio (NH₄⁺), producido por bacterias.' },
        nitratos: { nombre: 'Nitratos en el suelo', icono: '🧂', x: 600, y: 392, desc: 'Nitrógeno en forma de nitratos (NO₃⁻): la forma que las plantas pueden absorber.' },
        plantas: { nombre: 'Plantas', icono: '🌱', x: 290, y: 235, desc: 'Usan el nitrógeno para fabricar proteínas y ADN.' },
        animales: { nombre: 'Animales', icono: '🐇', x: 580, y: 235, desc: 'Obtienen el nitrógeno al comer plantas.' },
        restos: { nombre: 'Restos y desechos', icono: '🍂', x: 120, y: 335, desc: 'Restos de seres vivos, orina y excrementos.' },
      },
      procesos: [
        { de: 'aire', a: 'amonio', nombre: 'Fijación por bacterias', desc: 'Bacterias del suelo y de las raíces de las legumbres (porotos, soja) transforman el N₂ en amonio.' },
        { de: 'aire', a: 'nitratos', nombre: 'Fijación por rayos', desc: 'La energía de los rayos une el nitrógeno con el oxígeno; la lluvia lleva esos compuestos al suelo.' },
        { de: 'amonio', a: 'nitratos', nombre: 'Nitrificación', desc: 'Otras bacterias transforman el amonio en nitratos.' },
        { de: 'nitratos', a: 'plantas', nombre: 'Asimilación', desc: 'Las raíces absorben los nitratos y la planta los usa para fabricar proteínas.' },
        { de: 'plantas', a: 'animales', nombre: 'Alimentación', desc: 'Los animales obtienen el nitrógeno comiendo plantas.' },
        { de: 'plantas', a: 'restos', nombre: 'Muerte', desc: 'Las plantas muertas quedan en el suelo.' },
        { de: 'animales', a: 'restos', nombre: 'Muerte y excreción', desc: 'Los restos, la orina y los excrementos de los animales llegan al suelo.' },
        { de: 'restos', a: 'amonio', nombre: 'Amonificación', desc: 'Los descomponedores transforman los restos en amonio.' },
        { de: 'nitratos', a: 'aire', nombre: 'Desnitrificación', desc: 'Algunas bacterias transforman los nitratos en N₂, que vuelve al aire.' },
      ],
      orden: [
        { nombre: 'Fijación', desc: 'Bacterias transforman el N₂ del aire en amonio.' },
        { nombre: 'Nitrificación', desc: 'El amonio se transforma en nitratos.' },
        { nombre: 'Asimilación', desc: 'Las plantas absorben los nitratos.' },
        { nombre: 'Amonificación', desc: 'Los descomponedores devuelven los restos al suelo como amonio.' },
        { nombre: 'Desnitrificación', desc: 'Bacterias devuelven el nitrógeno al aire como N₂.' },
      ],
      fondo: `
        <rect width="800" height="460" fill="#e7f5ff"/>
        <path d="M140,40 l-14,30 h12 l-10,28 l26,-36 h-12 l12,-22 z" fill="#fab005"/>
        <path d="M0,300 L800,300 L800,460 L0,460 Z" fill="#b2f2bb"/>
        <path d="M0,360 L800,360 L800,460 L0,460 Z" fill="#c8a97e"/>
        ${[260, 300, 330].map(x => `<circle cx="${x}" cy="378" r="5" fill="#f783ac"/>`).join('')}`,
    },
  };

  let raiz, svg, ciclo = 'agua', modo = 'explorar';
  let viajeros = [], animacion = null, ultimo = 0;
  let seguir = null; // { nodo, pasos: [], moviendo }
  let ordenar = null; // { elegidos: [], mezcla: [] }

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>♻️ Ciclos de la naturaleza</h1>
        <p>La materia no se pierde: el agua, el carbono y el nitrógeno se mueven una y otra vez entre el aire, el agua, el suelo y los seres vivos.</p>
      </div>
      <div class="cic-controles">
        <div class="segmentado" id="cic-ciclos">
          ${Object.entries(CICLOS).map(([k, c]) => `<button data-c="${k}">${c.icono} ${c.nombre.replace('Ciclo del ', '').replace(/^./, m => m.toUpperCase())}</button>`).join('')}
        </div>
        <div class="segmentado" id="cic-modos">
          <button data-m="explorar">👀 Explorar</button>
          <button data-m="seguir">🧭 Seguir el viaje</button>
          <button data-m="ordenar">🔢 Ordenar etapas</button>
        </div>
      </div>
      <div class="cic-grid">
        <div class="panel cic-visor">
          <svg id="cic-svg" viewBox="0 0 800 460" role="img"></svg>
        </div>
        <aside class="panel cic-panel" id="cic-panel"></aside>
      </div>`;
    svg = raiz.querySelector('#cic-svg');
    raiz.querySelectorAll('#cic-ciclos button').forEach(b => b.addEventListener('click', () => { ciclo = b.dataset.c; preparar(); }));
    raiz.querySelectorAll('#cic-modos button').forEach(b => b.addEventListener('click', () => { modo = b.dataset.m; preparar(); }));
    svg.addEventListener('click', e => {
      const n = e.target.closest('[data-nodo]');
      const p = e.target.closest('[data-proc]');
      if (modo === 'explorar' && n) mostrarNodo(n.dataset.nodo);
      else if (modo === 'explorar' && p) mostrarProceso(+p.dataset.proc);
    });
    preparar();
    requestAnimationFrame(bucle);
  }

  // Curva entre dos nodos; las flechas de ida y vuelta se curvan hacia lados opuestos.
  function curva(p) {
    const c = CICLOS[ciclo], A = c.nodos[p.de], B = c.nodos[p.a];
    const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const recorte = 44;
    const x1 = A.x + ux * recorte, y1 = A.y + uy * recorte, x2 = B.x - ux * recorte, y2 = B.y - uy * recorte;
    const k = 0.18 * len;
    const cx = (x1 + x2) / 2 - uy * k, cy = (y1 + y2) / 2 + ux * k;
    return { d: `M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, mx: (x1 + 2 * cx + x2) / 4, my: (y1 + 2 * cy + y2) / 4 };
  }

  function preparar() {
    const c = CICLOS[ciclo];
    raiz.querySelectorAll('#cic-ciclos button').forEach(b => b.classList.toggle('activo', b.dataset.c === ciclo));
    raiz.querySelectorAll('#cic-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === modo));
    svg.setAttribute('aria-label', `Esquema del ${c.nombre.toLowerCase()}`);
    const conEtiquetas = modo === 'explorar';
    svg.innerHTML = `
      <defs><marker id="cic-flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#495057"/></marker></defs>
      <g class="cic-fondo">${c.fondo}</g>
      <g>${c.procesos.map((p, i) => {
        const cv = curva(p);
        return `<g class="cic-proceso" data-proc="${i}">
          <path d="${cv.d}" class="cic-trazo-ancho"/>
          <path d="${cv.d}" id="cic-p-${i}" class="cic-trazo" marker-end="url(#cic-flecha)"/>
          ${conEtiquetas ? `<text x="${cv.mx.toFixed(1)}" y="${(cv.my + 4).toFixed(1)}" text-anchor="middle" class="cic-etq-proc">${p.nombre.replace(/ \(.*\)/, '')}</text>` : ''}
        </g>`;
      }).join('')}</g>
      <g>${Object.entries(c.nodos).map(([k, n]) => `
        <g class="cic-nodo" data-nodo="${k}" transform="translate(${n.x} ${n.y})">
          <circle r="34" class="cic-nodo-fondo"/>
          <text y="9" text-anchor="middle" class="cic-nodo-icono">${n.icono}</text>
          <text y="52" text-anchor="middle" class="cic-nodo-nombre">${n.nombre}</text>
        </g>`).join('')}</g>
      <g id="cic-viajeros"></g>`;
    viajeros = [];
    seguir = null;
    ordenar = null;
    if (modo === 'explorar') {
      // Varias partículas recorren el ciclo al azar.
      Object.keys(c.nodos).forEach(k => viajeros.push(nuevoViajero(k)));
      panelExplorar();
    } else if (modo === 'seguir') {
      empezarSeguir();
    } else {
      empezarOrdenar();
    }
  }

  // ---------- Explorar ----------

  function nuevoViajero(nodo) {
    const c = CICLOS[ciclo];
    const salidas = c.procesos.map((p, i) => [p, i]).filter(([p]) => p.de === nodo);
    const [, i] = Util.elegir(salidas);
    return { proc: i, t: Math.random(), vel: 0.25 + Math.random() * 0.15 };
  }

  function bucle(t) {
    const dt = Math.min(0.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    if (!raiz.hidden && modo === 'explorar' && viajeros.length) {
      const c = CICLOS[ciclo];
      const capa = raiz.querySelector('#cic-viajeros');
      if (capa) {
        let html = '';
        viajeros.forEach((v, idx) => {
          v.t += v.vel * dt;
          if (v.t >= 1) viajeros[idx] = v = { ...nuevoViajero(c.procesos[v.proc].a), t: 0 };
          const path = svg.querySelector('#cic-p-' + v.proc);
          if (!path) return;
          const pt = path.getPointAtLength(path.getTotalLength() * v.t);
          html += marcaViajero(pt.x, pt.y, 11);
        });
        capa.innerHTML = html;
      }
    }
    requestAnimationFrame(bucle);
  }

  function marcaViajero(x, y, r) {
    const c = CICLOS[ciclo];
    if (ciclo === 'agua') return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path d="M0,${-r * 1.3} C${r * 0.9},${-r * 0.2} ${r},${r * 0.9} 0,${r} C${-r},${r * 0.9} ${-r * 0.9},${-r * 0.2} 0,${-r * 1.3} Z" class="cic-gota"/></g>`;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${r}" class="cic-atomo ${ciclo}"/><text y="${r * 0.38}" text-anchor="middle" class="cic-atomo-txt" style="font-size:${r * 1.1}px">${c.viajero}</text></g>`;
  }

  function panelExplorar() {
    const c = CICLOS[ciclo];
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${c.icono} ${c.nombre}</h2>
      <p>Las flechas muestran los <b>procesos</b> que mueven ${c.viajeroNombre} de un lugar a otro.</p>
      <p class="cic-ayuda">👆 Toca un lugar (círculo) o un proceso (flecha) para saber más.</p>`;
  }

  function mostrarNodo(k) {
    const c = CICLOS[ciclo], n = c.nodos[k];
    const sale = c.procesos.filter(p => p.de === k), entra = c.procesos.filter(p => p.a === k);
    marcarNodo(k);
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${n.icono} ${n.nombre}</h2>
      <p>${n.desc}</p>
      <h3>Llega por…</h3><ul>${entra.map(p => `<li><b>${p.nombre}</b> desde ${c.nodos[p.de].nombre.toLowerCase()}</li>`).join('')}</ul>
      <h3>Sale por…</h3><ul>${sale.map(p => `<li><b>${p.nombre}</b> hacia ${c.nodos[p.a].nombre.toLowerCase()}</li>`).join('')}</ul>`;
  }

  function mostrarProceso(i) {
    const c = CICLOS[ciclo], p = c.procesos[i];
    svg.querySelectorAll('.cic-proceso').forEach(g => g.classList.toggle('marcado', +g.dataset.proc === i));
    marcarNodo(null);
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>➡️ ${p.nombre}</h2>
      <p class="cic-ruta">${c.nodos[p.de].icono} ${c.nodos[p.de].nombre} → ${c.nodos[p.a].icono} ${c.nodos[p.a].nombre}</p>
      <p>${p.desc}</p>`;
  }

  function marcarNodo(k) {
    svg.querySelectorAll('.cic-nodo').forEach(g => g.classList.toggle('marcado', g.dataset.nodo === k));
    if (k) svg.querySelectorAll('.cic-proceso').forEach(g => g.classList.remove('marcado'));
  }

  // ---------- Seguir el viaje ----------

  function empezarSeguir() {
    const c = CICLOS[ciclo];
    seguir = { nodo: c.inicio, pasos: [], moviendo: false, errores: 0 };
    ponerViajero(c.nodos[c.inicio].x, c.nodos[c.inicio].y);
    marcarNodo(c.inicio);
    panelSeguir();
  }

  function ponerViajero(x, y) {
    raiz.querySelector('#cic-viajeros').innerHTML = `<g class="cic-viajero-grande">${marcaViajero(x, y - 40, 16)}</g>`;
  }

  function panelSeguir(aviso) {
    const c = CICLOS[ciclo], n = c.nodos[seguir.nodo];
    const validas = c.procesos.map((p, i) => ({ p, i })).filter(o => o.p.de === seguir.nodo);
    // Distractores: procesos que existen en el ciclo pero no salen de este lugar.
    const nombresValidos = new Set(validas.map(o => o.p.nombre));
    const falsas = Util.mezclar(c.procesos.map((p, i) => ({ p, i })).filter(o => o.p.de !== seguir.nodo && !nombresValidos.has(o.p.nombre))).slice(0, 2);
    const opciones = Util.mezclar(validas.concat(falsas));
    const completo = seguir.pasos.length >= 3 && seguir.nodo === c.inicio;
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>🧭 El viaje de ${c.viajeroNombre}</h2>
      ${completo ? `<div class="cic-logro">🎉 ¡Volviste al punto de partida! Completaste un ciclo en <b>${seguir.pasos.length} pasos</b>${seguir.errores ? ` (con ${seguir.errores} intento${seguir.errores > 1 ? 's' : ''} fallido${seguir.errores > 1 ? 's' : ''})` : ''}.</div>` : ''}
      <p>Ahora está en: <b>${n.icono} ${n.nombre}</b></p>
      <p class="cic-pregunta">¿Qué puede pasarle ahora?</p>
      <div class="cic-opciones">${opciones.map(o => `<button class="cic-opcion" data-proc="${o.i}">${o.p.nombre} <small>→ ${c.nodos[o.p.a].nombre}</small></button>`).join('')}</div>
      <div id="cic-aviso">${aviso || ''}</div>
      ${seguir.pasos.length ? `<h3>Recorrido</h3><ol class="cic-diario">${seguir.pasos.map(i => `<li>${c.procesos[i].nombre} → ${c.nodos[c.procesos[i].a].nombre}</li>`).join('')}</ol>` : `<p class="cic-ayuda">Elige un proceso posible desde este lugar. ¡Cuidado, algunas opciones no pueden ocurrir aquí!</p>`}
      <button class="btn chico" id="cic-reiniciar-viaje">↺ Empezar de nuevo</button>`;
    raiz.querySelectorAll('.cic-opcion').forEach(b => b.addEventListener('click', () => elegirPaso(+b.dataset.proc, b)));
    raiz.querySelector('#cic-reiniciar-viaje').addEventListener('click', empezarSeguir);
  }

  function elegirPaso(i, boton) {
    if (seguir.moviendo) return;
    const c = CICLOS[ciclo], p = c.procesos[i];
    if (p.de !== seguir.nodo) {
      seguir.errores++;
      boton.classList.add('incorrecta');
      boton.disabled = true;
      raiz.querySelector('#cic-aviso').innerHTML = `<p class="cic-error">✖ No puede ser: <b>${p.nombre}</b> ocurre desde ${c.nodos[p.de].nombre.toLowerCase()}, no desde aquí. ${p.desc}</p>`;
      return;
    }
    seguir.moviendo = true;
    raiz.querySelectorAll('.cic-opcion').forEach(b => { b.disabled = true; });
    boton.classList.add('correcta');
    const path = svg.querySelector('#cic-p-' + i);
    path.closest('.cic-proceso').classList.add('marcado');
    const largo = path.getTotalLength(), t0 = performance.now(), dur = 1400;
    const paso = t => {
      const f = Math.min(1, (t - t0) / dur);
      const pt = path.getPointAtLength(largo * f);
      raiz.querySelector('#cic-viajeros').innerHTML = `<g class="cic-viajero-grande">${marcaViajero(pt.x, pt.y, 16)}</g>`;
      if (f < 1) return requestAnimationFrame(paso);
      path.closest('.cic-proceso').classList.remove('marcado');
      seguir.pasos.push(i);
      seguir.nodo = p.a;
      seguir.moviendo = false;
      const n = c.nodos[p.a];
      ponerViajero(n.x, n.y);
      marcarNodo(p.a);
      panelSeguir(`<p class="cic-ok">✔ <b>${p.nombre}:</b> ${p.desc}</p>`);
    };
    requestAnimationFrame(paso);
  }

  // ---------- Ordenar etapas ----------

  function empezarOrdenar() {
    const c = CICLOS[ciclo];
    ordenar = { elegidos: [], mezcla: Util.mezclar(c.orden.map((_, i) => i)), revisado: false };
    raiz.querySelector('#cic-viajeros').innerHTML = '';
    panelOrdenar();
  }

  function panelOrdenar() {
    const c = CICLOS[ciclo];
    const quedan = ordenar.mezcla.filter(i => !ordenar.elegidos.includes(i));
    const lleno = ordenar.elegidos.length === c.orden.length;
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>🔢 Ordena las etapas</h2>
      <p>Toca las etapas del ${c.nombre.toLowerCase()} en el orden en que ocurren.</p>
      <ol class="cic-orden">${c.orden.map((_, pos) => {
        const i = ordenar.elegidos[pos];
        const estado = ordenar.revisado && i !== undefined ? (i === pos ? 'bien' : 'mal') : '';
        return `<li class="${i === undefined ? 'vacio' : 'lleno'} ${estado}">${i === undefined ? '…' : `<b>${c.orden[i].nombre}</b>${ordenar.revisado ? `<small>${c.orden[i].desc}</small>` : ''}`}</li>`;
      }).join('')}</ol>
      <div class="cic-fichas">${quedan.map(i => `<button class="cic-ficha" data-i="${i}">${c.orden[i].nombre}</button>`).join('')}</div>
      <div class="cic-orden-botones">
        <button class="btn chico" id="cic-deshacer" ${ordenar.elegidos.length && !ordenar.revisado ? '' : 'disabled'}>↩ Deshacer</button>
        <button class="btn chico primario" id="cic-revisar" ${lleno && !ordenar.revisado ? '' : 'disabled'}>Revisar</button>
        <button class="btn chico" id="cic-otra">↺ Empezar de nuevo</button>
      </div>
      <div id="cic-resultado">${ordenar.revisado ? resultadoOrden() : ''}</div>`;
    raiz.querySelectorAll('.cic-ficha').forEach(b => b.addEventListener('click', () => {
      if (ordenar.revisado) return;
      ordenar.elegidos.push(+b.dataset.i);
      panelOrdenar();
    }));
    raiz.querySelector('#cic-deshacer').addEventListener('click', () => { ordenar.elegidos.pop(); panelOrdenar(); });
    raiz.querySelector('#cic-revisar').addEventListener('click', () => { ordenar.revisado = true; panelOrdenar(); });
    raiz.querySelector('#cic-otra').addEventListener('click', empezarOrdenar);
  }

  function resultadoOrden() {
    const bien = ordenar.elegidos.filter((i, pos) => i === pos).length;
    const total = CICLOS[ciclo].orden.length;
    return bien === total
      ? `<p class="cic-ok">🎉 ¡Perfecto! Ordenaste las ${total} etapas correctamente. Recuerda que es un <b>ciclo</b>: después de la última etapa, todo vuelve a empezar.</p>`
      : `<p class="cic-error">Acertaste ${bien} de ${total}. Las etapas en rojo están fuera de lugar. Lee las descripciones y vuelve a intentarlo.</p>`;
  }

  return { iniciar };
})();
