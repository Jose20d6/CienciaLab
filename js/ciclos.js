// Módulo 8: Ciclos de la naturaleza (agua, carbono y nitrógeno).
// Cada ciclo tiene un paisaje ilustrado en SVG. Los procesos ocurren sobre el paisaje: partículas
// (gotas, vapor, copos, moléculas) recorren una "ruta" dibujada a mano para cada proceso.
const Ciclos = (function () {
  // ---------- Partículas ----------
  // Cada estilo es una figura centrada en (0,0). Se usan para la animación y para el viajero.
  const ESTILOS = {
    gota: { nombre: 'Gota de agua', svg: '<path d="M0,-9 C6,-2 7,4 0,8 C-7,4 -6,-2 0,-9 Z" fill="#1c7ed6" stroke="#fff" stroke-width="1.5"/>' },
    vapor: { nombre: 'Vapor de agua', svg: '<path d="M-3,8 q5,-4 0,-8 t0,-8" fill="none" stroke="#74c0fc" stroke-width="5" stroke-linecap="round"/><path d="M-3,8 q5,-4 0,-8 t0,-8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>' },
    copo: { nombre: 'Nieve', svg: [0, 60, 120].map(a => `<g transform="rotate(${a})"><line x1="0" y1="-8" x2="0" y2="8" stroke="#74c0fc" stroke-width="4.5" stroke-linecap="round"/><line x1="0" y1="-8" x2="0" y2="8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>`).join('') },
    co2: { nombre: 'CO₂ (dióxido de carbono)', svg: '<circle cx="-7.5" r="4.2" fill="#e03131" stroke="#fff" stroke-width="1"/><circle cx="7.5" r="4.2" fill="#e03131" stroke="#fff" stroke-width="1"/><circle r="5.2" fill="#343a40" stroke="#fff" stroke-width="1"/>' },
    c: { nombre: 'Carbono dentro de seres vivos o fósiles', svg: '<circle r="7" fill="#343a40" stroke="#fff" stroke-width="1.5"/><text y="3.2" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">C</text>' },
    n2: { nombre: 'N₂ (nitrógeno del aire)', svg: '<circle cx="-4.5" r="5" fill="#4263eb" stroke="#fff" stroke-width="1"/><circle cx="4.5" r="5" fill="#4263eb" stroke="#fff" stroke-width="1"/>' },
    nh4: { nombre: 'Amonio (NH₄⁺)', svg: '<circle r="6" fill="#9c36b5" stroke="#fff" stroke-width="1"/>' + [[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#f8f9fa" stroke="#9c36b5" stroke-width="1"/>`).join('') },
    no3: { nombre: 'Nitrato (NO₃⁻)', svg: [0, 120, 240].map(a => `<circle cx="${(8 * Math.sin(a * Math.PI / 180)).toFixed(1)}" cy="${(-8 * Math.cos(a * Math.PI / 180)).toFixed(1)}" r="3.4" fill="#e03131" stroke="#fff" stroke-width="1"/>`).join('') + '<circle r="5.5" fill="#4263eb" stroke="#fff" stroke-width="1"/>' },
    n: { nombre: 'Nitrógeno dentro de seres vivos', svg: '<circle r="7" fill="#4263eb" stroke="#fff" stroke-width="1.5"/><text y="3.2" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">N</text>' },
  };
  const figura = (estilo, x, y, s = 1) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">${ESTILOS[estilo].svg}</g>`;

  // ---------- Paisajes ----------

  const DEFS = `
    <linearGradient id="cc-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#74c0fc"/><stop offset="0.7" stop-color="#e7f5ff"/></linearGradient>
    <linearGradient id="cc-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4dabf7"/><stop offset="1" stop-color="#1864ab"/></linearGradient>
    <linearGradient id="cc-suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c49a6c"/><stop offset="1" stop-color="#8b5e3c"/></linearGradient>
    <linearGradient id="cc-roca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#868e96"/><stop offset="1" stop-color="#495057"/></linearGradient>
    <pattern id="cc-poros" width="16" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.8" fill="#1971c2" opacity="0.45"/><circle cx="12" cy="10" r="1.4" fill="#1971c2" opacity="0.45"/></pattern>
    <pattern id="cc-granos" width="18" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r="1.2" fill="#6f4518" opacity="0.35"/><circle cx="12" cy="12" r="1.5" fill="#6f4518" opacity="0.3"/></pattern>
    <marker id="cc-flecha" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#343a40"/></marker>`;

  const sol = (x, y) => `<g transform="translate(${x} ${y})"><g class="cc-rayos">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-38" x2="0" y2="-50" transform="rotate(${i * 30})" stroke="#fcc419" stroke-width="4" stroke-linecap="round"/>`).join('')}</g><circle r="30" fill="#fcc419"/><circle r="22" fill="#ffe066"/></g>`;
  const nube = (x, y, s = 1, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})" class="cc-nube ${extra}">
    <ellipse cx="0" cy="18" rx="62" ry="12" fill="#dee2e6"/>
    <circle cx="-38" cy="8" r="22" fill="#fff"/><circle cx="-8" cy="-6" r="30" fill="#fff"/><circle cx="26" cy="4" r="25" fill="#fff"/><circle cx="50" cy="12" r="16" fill="#fff"/>
    <rect x="-56" y="8" width="112" height="20" rx="10" fill="#fff"/></g>`;
  const arbol = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0,0 C-2,18 -12,32 -22,48 M0,0 C4,22 18,36 32,46 M0,0 L0,44 M-10,26 L-26,30 M12,24 L26,22" stroke="#8d6e63" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M-8,0 L-6,-58 L6,-58 L8,0 Z" fill="#8d6e63"/>
    <circle cx="-20" cy="-68" r="28" fill="#2f9e44"/><circle cx="20" cy="-70" r="30" fill="#37b24d"/><circle cx="0" cy="-94" r="30" fill="#40c057"/>
    <circle cx="10" cy="-100" r="10" fill="#69db7c" opacity="0.7"/></g>`;

  const ESCENAS = {
    agua: `
      <rect width="800" height="460" fill="url(#cc-cielo)"/>
      ${sol(80, 70)}
      <path d="M560,305 L700,122 L840,305 Z" fill="#868e96"/><path d="M700,122 L760,305 L840,305 Z" fill="#6c757d"/>
      <path d="M652,185 L700,122 L748,185 C734,197 722,186 708,200 C694,190 682,202 668,191 Z" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1.5"/>
      ${nube(640, 55, 0.6, 'lenta')}
      <rect x="0" y="330" width="270" height="130" fill="url(#cc-mar)"/>
      <path class="cc-olas" d="M-40,334 q10,-7 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke="#d0ebff" stroke-width="3"/>
      <path d="M230,336 C262,318 300,300 350,298 L800,296 L800,460 L230,460 Z" fill="url(#cc-suelo)"/>
      <path d="M230,336 C262,318 300,300 350,298 L800,296 L800,460 L230,460 Z" fill="url(#cc-granos)"/>
      <path d="M240,382 C400,372 600,380 800,372 L800,432 C600,440 400,436 240,442 Z" fill="#a5d8ff"/>
      <path d="M240,382 C400,372 600,380 800,372 L800,432 C600,440 400,436 240,442 Z" fill="url(#cc-poros)"/>
      <path d="M232,442 C400,436 600,440 800,432 L800,460 L232,460 Z" fill="url(#cc-roca)"/>
      <path d="M230,336 C262,318 300,300 350,298 L800,296" fill="none" stroke="#51cf66" stroke-width="7" stroke-linecap="round"/>
      <path d="M650,302 C600,310 560,300 520,312 S420,320 380,318 S300,330 246,337" fill="none" stroke="#4dabf7" stroke-width="10" stroke-linecap="round"/>
      <path class="cc-corriente" d="M650,302 C600,310 560,300 520,312 S420,320 380,318 S300,330 246,337" fill="none" stroke="#e7f5ff" stroke-width="2.5" stroke-dasharray="6 16" stroke-linecap="round"/>
      ${arbol(352, 300)}
      <g class="cc-vaho" opacity="0.8">${[[165, 230], [195, 215], [220, 232]].map(([x, y]) => `<path d="M${x},${y} q6,-6 0,-12 t0,-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>
      ${nube(440, 88, 1)}`,
    carbono: `
      <rect width="800" height="460" fill="url(#cc-cielo)"/>
      ${sol(730, 62)}
      <rect x="0" y="340" width="200" height="120" fill="url(#cc-mar)"/>
      <path class="cc-olas" d="M-40,344 q10,-7 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke="#d0ebff" stroke-width="3"/>
      <path d="M170,348 C200,332 240,326 280,326 L800,326 L800,460 L170,460 Z" fill="url(#cc-suelo)"/>
      <path d="M170,348 C200,332 240,326 280,326 L800,326 L800,460 L170,460 Z" fill="url(#cc-granos)"/>
      <path d="M180,388 C400,382 600,390 800,384 L800,460 L180,460 Z" fill="url(#cc-roca)"/>
      <path d="M560,420 C570,400 640,394 700,402 C752,408 772,426 742,441 C690,453 600,452 570,441 Z" fill="#212529"/>
      <path d="M600,412 C630,404 670,404 700,410" fill="none" stroke="#495057" stroke-width="3" stroke-linecap="round"/>
      <path d="M170,348 C200,332 240,326 280,326 L800,326" fill="none" stroke="#51cf66" stroke-width="7" stroke-linecap="round"/>
      <line x1="690" y1="402" x2="690" y2="326" stroke="#495057" stroke-width="6"/>
      <g><rect x="652" y="276" width="100" height="52" rx="3" fill="#adb5bd"/><path d="M652,276 L672,258 L672,276 L692,258 L692,276 L712,258 L712,276 Z" fill="#868e96"/>
        <rect x="720" y="214" width="18" height="64" fill="#868e96"/><rect x="664" y="292" width="14" height="14" fill="#fff3bf"/><rect x="688" y="292" width="14" height="14" fill="#fff3bf"/></g>
      <g class="cc-humo">${[0, 1, 2, 3].map(i => `<circle cx="729" cy="210" r="${9 + i * 2}" fill="#868e96" style="animation-delay:${i * 0.8}s"/>`).join('')}</g>
      ${arbol(240, 330, 1.05)}
      <g transform="translate(440 300)">
        <rect x="-36" y="-18" width="74" height="34" rx="15" fill="#fff" stroke="#495057" stroke-width="2"/>
        <path d="M-12,-18 C-4,-8 6,-10 10,-18 Z M16,0 C22,-8 32,-4 30,8 C24,12 18,8 16,0 Z" fill="#343a40"/>
        <line x1="-26" y1="14" x2="-26" y2="30" stroke="#495057" stroke-width="5" stroke-linecap="round"/><line x1="-12" y1="14" x2="-12" y2="30" stroke="#495057" stroke-width="5" stroke-linecap="round"/>
        <line x1="18" y1="14" x2="18" y2="30" stroke="#495057" stroke-width="5" stroke-linecap="round"/><line x1="30" y1="14" x2="30" y2="30" stroke="#495057" stroke-width="5" stroke-linecap="round"/>
        <circle cx="-42" cy="-12" r="13" fill="#fff" stroke="#495057" stroke-width="2"/><ellipse cx="-50" cy="-6" rx="7" ry="5" fill="#fcc2d7"/>
        <path d="M-44,-24 l-6,-6 M-36,-23 l4,-7" stroke="#495057" stroke-width="3" stroke-linecap="round"/><circle cx="-42" cy="-15" r="1.8" fill="#212529"/></g>
      <g transform="translate(330 350)">
        ${[[-26, 4, 20], [-8, 8, -30], [14, 2, 40], [28, 8, -10]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4" transform="rotate(${a} ${x} ${y})" fill="#e8590c" opacity="0.85"/>`).join('')}
        <rect x="-4" y="-10" width="4" height="12" fill="#f8f9fa"/><path d="M-11,-10 C-10,-20 6,-20 7,-10 Z" fill="#c92a2a"/>
        <rect x="16" y="-6" width="3" height="9" fill="#f8f9fa"/><path d="M11,-6 C12,-13 23,-13 24,-6 Z" fill="#c92a2a"/></g>
      <g class="cc-deco">${[[330, 45], [505, 60], [560, 120], [290, 125]].map(([x, y]) => figura('co2', x, y, 1)).join('')}</g>`,
    nitrogeno: `
      <rect width="800" height="460" fill="url(#cc-cielo)"/>
      <g transform="translate(662 60)"><ellipse cx="0" cy="18" rx="66" ry="14" fill="#868e96"/><circle cx="-36" cy="8" r="24" fill="#adb5bd"/><circle cx="-4" cy="-6" r="30" fill="#ced4da"/><circle cx="30" cy="6" r="24" fill="#adb5bd"/></g>
      <path class="cc-rayo" d="M654,86 L638,130 L656,130 L640,178 L680,120 L662,120 L676,86 Z" fill="#fcc419" stroke="#f08c00" stroke-width="2"/>
      <path d="M0,304 C200,294 500,300 800,294 L800,460 L0,460 Z" fill="url(#cc-suelo)"/>
      <path d="M0,304 C200,294 500,300 800,294 L800,460 L0,460 Z" fill="url(#cc-granos)"/>
      <path d="M0,304 C200,294 500,300 800,294" fill="none" stroke="#51cf66" stroke-width="7" stroke-linecap="round"/>
      <g opacity="0.9">${[[250, 390], [280, 410], [335, 395], [360, 418], [300, 425]].map(([x, y]) => figura('nh4', x, y, 0.7)).join('')}
        ${[[545, 392], [585, 420], [640, 395], [660, 425], [610, 410]].map(([x, y]) => figura('no3', x, y, 0.7)).join('')}</g>
      <g transform="translate(300 300)">
        <path d="M0,0 C-2,20 -14,34 -24,50 M0,0 C4,22 16,36 30,48 M0,0 L0,52" stroke="#a9794c" stroke-width="3" fill="none" stroke-linecap="round"/>
        ${[[-14, 28], [-22, 44], [10, 30], [22, 42], [0, 40], [-6, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f783ac" stroke="#c2255c" stroke-width="1.2"/>`).join('')}
        <path d="M0,0 C-2,-30 2,-60 0,-92" stroke="#2f9e44" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${[[-22, -30, -30], [22, -46, 30], [-20, -66, -25], [18, -82, 20]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="8" transform="rotate(${a} ${x} ${y})" fill="#51cf66" stroke="#2f9e44" stroke-width="1.5"/>`).join('')}
        <path d="M6,-58 C18,-52 22,-40 16,-30" stroke="#94d82d" stroke-width="7" fill="none" stroke-linecap="round"/></g>
      <g transform="translate(570 270)">
        <ellipse cx="0" cy="0" rx="30" ry="20" fill="#e9ecef" stroke="#868e96" stroke-width="2"/>
        <circle cx="-28" cy="-12" r="13" fill="#e9ecef" stroke="#868e96" stroke-width="2"/>
        <ellipse cx="-34" cy="-38" rx="5" ry="16" fill="#e9ecef" stroke="#868e96" stroke-width="2"/><ellipse cx="-24" cy="-40" rx="5" ry="16" fill="#e9ecef" stroke="#868e96" stroke-width="2"/>
        <circle cx="30" cy="-2" r="7" fill="#fff" stroke="#868e96" stroke-width="2"/><circle cx="-32" cy="-14" r="2" fill="#212529"/><circle cx="-40" cy="-9" r="2" fill="#f783ac"/></g>
      <g transform="translate(130 312)">
        ${[[-30, 4, 20], [-12, 8, -30], [10, 2, 40], [26, 8, -10], [0, -2, 70]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" transform="rotate(${a} ${x} ${y})" fill="#d9480f" opacity="0.85"/>`).join('')}
        <ellipse cx="40" cy="6" rx="8" ry="5" fill="#6f4518"/></g>`,
  };

  // ---------- Datos de cada ciclo ----------
  // nodos: x,y = zona que se puede tocar; etq = posición del rótulo; forma = cómo se ve el viajero ahí.
  // procesos: ruta = camino dibujado sobre el paisaje; estilo = partícula que lo recorre.
  const CICLOS = {
    agua: {
      nombre: 'Ciclo del agua', icono: '💧', viajeroNombre: 'una gota de agua', inicio: 'oceano',
      nodos: {
        oceano: { nombre: 'Océano', x: 120, y: 395, etq: [120, 440], forma: 'gota', desc: 'Guarda el 97 % del agua del planeta. Es salada.' },
        vapor: { nombre: 'Vapor de agua', x: 192, y: 215, etq: [192, 252], forma: 'vapor', desc: 'El agua en estado gaseoso: es invisible y forma parte del aire.' },
        nube: { nombre: 'Nubes', x: 440, y: 92, etq: [440, 140], forma: 'gota', desc: 'Millones de gotitas de agua o cristales de hielo suspendidos en el aire.' },
        glaciar: { nombre: 'Glaciar', x: 700, y: 165, etq: [700, 212], forma: 'copo', desc: 'Agua dulce congelada. Guarda agua durante años o siglos.' },
        rio: { nombre: 'Río', x: 560, y: 306, etq: [600, 336], forma: 'gota', desc: 'Agua dulce que corre por la superficie hacia el mar.' },
        planta: { nombre: 'Plantas', x: 352, y: 215, etq: [285, 262], forma: 'gota', desc: 'Absorben agua por las raíces y la liberan por las hojas.' },
        subterranea: { nombre: 'Agua subterránea', x: 520, y: 405, etq: [520, 407], forma: 'gota', desc: 'Agua que se filtró y llena los poros de las rocas bajo tierra (acuíferos).' },
      },
      procesos: [
        { de: 'oceano', a: 'vapor', nombre: 'Evaporación', estilo: 'vapor', ruta: 'M110,330 C112,290 150,255 180,228', desc: 'El Sol calienta el agua del mar y la transforma en vapor.' },
        { de: 'vapor', a: 'nube', nombre: 'Condensación', estilo: 'vapor', ruta: 'M205,196 C260,140 330,105 390,96', desc: 'El vapor sube, se enfría y se convierte en gotitas que forman las nubes.' },
        { de: 'nube', a: 'oceano', nombre: 'Precipitación (lluvia sobre el mar)', estilo: 'gota', t: 0.62, ruta: 'M405,118 C340,170 260,240 200,325', desc: 'Las gotitas se juntan, pesan más y caen como lluvia.' },
        { de: 'nube', a: 'rio', nombre: 'Precipitación (lluvia)', estilo: 'gota', ruta: 'M470,118 C495,190 525,250 548,298', desc: 'La lluvia cae sobre la tierra y llena ríos y lagos.' },
        { de: 'nube', a: 'glaciar', nombre: 'Precipitación (nieve)', estilo: 'copo', ruta: 'M492,84 C570,70 640,100 680,140', desc: 'En lugares fríos o altos el agua cae como nieve y forma glaciares.' },
        { de: 'glaciar', a: 'rio', nombre: 'Fusión (deshielo)', estilo: 'gota', ruta: 'M700,195 C690,240 665,285 640,300 C615,305 595,303 575,304', desc: 'Cuando hace más calor, el hielo se derrite y alimenta a los ríos.' },
        { de: 'glaciar', a: 'vapor', nombre: 'Sublimación', estilo: 'vapor', ruta: 'M672,140 C560,30 320,90 212,192', desc: 'Con viento y sol, el hielo pasa directamente a vapor, sin derretirse.' },
        { de: 'rio', a: 'oceano', nombre: 'Escorrentía', estilo: 'gota', ruta: 'M548,306 C500,315 450,318 400,318 C340,320 290,330 240,337', desc: 'El agua corre por la superficie, en ríos y arroyos, hasta el mar.' },
        { de: 'rio', a: 'subterranea', nombre: 'Infiltración', estilo: 'gota', ruta: 'M530,312 C532,340 528,365 522,390', desc: 'Parte del agua se filtra por el suelo y llega a las capas subterráneas.' },
        { de: 'rio', a: 'vapor', nombre: 'Evaporación', estilo: 'vapor', t: 0.3, ruta: 'M585,298 C540,230 380,160 218,208', desc: 'El agua de ríos y lagos también se evapora con el calor del Sol.' },
        { de: 'subterranea', a: 'planta', nombre: 'Absorción por las raíces', estilo: 'gota', ruta: 'M500,398 C440,392 380,375 362,345 C355,325 352,290 352,258', desc: 'Las raíces de las plantas toman el agua del suelo y la llevan hacia las hojas.' },
        { de: 'subterranea', a: 'oceano', nombre: 'Flujo subterráneo', estilo: 'gota', ruta: 'M505,422 C420,430 320,432 240,420 C200,412 170,404 145,398', desc: 'El agua subterránea se mueve lentamente hasta desembocar en el mar.' },
        { de: 'planta', a: 'vapor', nombre: 'Transpiración', estilo: 'vapor', t: 0.3, ruta: 'M322,212 C290,196 252,196 222,208', desc: 'Las plantas liberan vapor de agua por pequeños poros de las hojas.' },
      ],
      orden: [
        { nombre: 'Evaporación', desc: 'El Sol calienta el agua de mares y ríos y se vuelve vapor.' },
        { nombre: 'Condensación', desc: 'El vapor se enfría en la altura y forma nubes.' },
        { nombre: 'Precipitación', desc: 'El agua cae como lluvia, nieve o granizo.' },
        { nombre: 'Escorrentía e infiltración', desc: 'El agua corre por ríos o se filtra en el suelo.' },
        { nombre: 'Acumulación', desc: 'El agua se junta en océanos, lagos y acuíferos… y todo vuelve a empezar.' },
      ],
    },
    carbono: {
      nombre: 'Ciclo del carbono', icono: '🌿', viajeroNombre: 'un átomo de carbono', inicio: 'aire',
      nodos: {
        aire: { nombre: 'CO₂ en el aire', x: 420, y: 70, etq: [420, 108], forma: 'co2', desc: 'El carbono está en la atmósfera formando dióxido de carbono (CO₂).' },
        plantas: { nombre: 'Plantas', x: 240, y: 240, etq: [168, 262], forma: 'c', desc: 'Guardan el carbono en su cuerpo: en la glucosa, la madera y las hojas.' },
        animales: { nombre: 'Animales', x: 440, y: 298, etq: [440, 352], forma: 'c', desc: 'Obtienen el carbono al comer plantas u otros animales.' },
        suelo: { nombre: 'Restos y descomponedores', x: 330, y: 352, etq: [330, 400], forma: 'c', desc: 'Hojas caídas, restos y desechos que hongos y bacterias descomponen.' },
        fosiles: { nombre: 'Combustibles fósiles', x: 660, y: 422, etq: [660, 424], forma: 'c', desc: 'Petróleo, carbón y gas: restos de seres vivos enterrados hace millones de años.' },
        oceano: { nombre: 'Océano', x: 95, y: 395, etq: [95, 440], forma: 'co2', desc: 'El mar disuelve mucho CO₂. Es uno de los grandes depósitos de carbono.' },
      },
      procesos: [
        { de: 'aire', a: 'plantas', nombre: 'Fotosíntesis', estilo: 'co2', t: 0.78, ruta: 'M388,82 C330,120 285,165 262,205', desc: 'Las plantas toman CO₂ del aire y, con la luz del Sol, fabrican glucosa.' },
        { de: 'plantas', a: 'aire', nombre: 'Respiración de las plantas', estilo: 'co2', t: 0.3, ruta: 'M222,205 C228,140 300,92 380,72', desc: 'Las plantas también respiran y devuelven algo de CO₂ al aire.' },
        { de: 'plantas', a: 'animales', nombre: 'Alimentación', estilo: 'c', ruta: 'M275,262 C320,270 360,282 395,290', desc: 'Los animales comen plantas y el carbono pasa a formar parte de su cuerpo.' },
        { de: 'animales', a: 'aire', nombre: 'Respiración de los animales', estilo: 'co2', ruta: 'M452,276 C462,200 455,130 432,92', desc: 'Al respirar, los animales liberan CO₂.' },
        { de: 'plantas', a: 'suelo', nombre: 'Muerte y caída de hojas', estilo: 'c', t: 0.25, ruta: 'M248,300 C262,325 290,342 314,348', desc: 'Las hojas y las plantas muertas quedan en el suelo.' },
        { de: 'animales', a: 'suelo', nombre: 'Muerte y desechos', estilo: 'c', t: 0.2, ruta: 'M425,320 C400,338 372,350 350,352', desc: 'Los restos y excrementos de los animales llegan al suelo.' },
        { de: 'suelo', a: 'aire', nombre: 'Descomposición', estilo: 'co2', ruta: 'M338,340 C352,260 382,160 408,92', desc: 'Hongos y bacterias descomponen los restos y liberan CO₂.' },
        { de: 'suelo', a: 'fosiles', nombre: 'Fosilización', estilo: 'c', ruta: 'M345,370 C420,398 520,415 600,420', desc: 'Algunos restos quedan enterrados y, durante millones de años, se transforman en petróleo o carbón.' },
        { de: 'fosiles', a: 'aire', nombre: 'Combustión', estilo: 'co2', ruta: 'M690,402 L690,330 L729,300 L729,212 C700,150 560,95 462,75', desc: 'Al quemar combustibles fósiles (autos, fábricas) se libera CO₂ muy rápido.' },
        { de: 'aire', a: 'oceano', nombre: 'Disolución', estilo: 'co2', t: 0.86, ruta: 'M385,78 C260,110 150,240 118,340', desc: 'El CO₂ del aire se disuelve en el agua del mar.' },
        { de: 'oceano', a: 'aire', nombre: 'Liberación del océano', estilo: 'co2', t: 0.3, ruta: 'M72,342 C80,220 240,100 380,66', desc: 'Cuando el agua se calienta, parte del CO₂ disuelto vuelve al aire.' },
      ],
      orden: [
        { nombre: 'Fotosíntesis', desc: 'Las plantas toman CO₂ del aire.' },
        { nombre: 'Alimentación', desc: 'Los animales comen plantas y el carbono pasa a ellos.' },
        { nombre: 'Muerte y descomposición', desc: 'Los restos llegan al suelo y los descomponedores actúan.' },
        { nombre: 'Formación de combustibles fósiles', desc: 'En millones de años algunos restos se vuelven petróleo o carbón.' },
        { nombre: 'Combustión', desc: 'Al quemarlos, el CO₂ vuelve al aire.' },
      ],
    },
    nitrogeno: {
      nombre: 'Ciclo del nitrógeno', icono: '🫘', viajeroNombre: 'un átomo de nitrógeno', inicio: 'aire',
      nodos: {
        aire: { nombre: 'N₂ en el aire', x: 400, y: 65, etq: [400, 102], forma: 'n2', desc: 'El 78 % del aire es nitrógeno (N₂), pero plantas y animales no pueden usarlo así.' },
        plantas: { nombre: 'Plantas (legumbres)', x: 300, y: 235, etq: [215, 250], forma: 'n', desc: 'Usan el nitrógeno para fabricar proteínas y ADN. Las legumbres tienen nódulos con bacterias en las raíces.' },
        animales: { nombre: 'Animales', x: 570, y: 262, etq: [575, 312], forma: 'n', desc: 'Obtienen el nitrógeno al comer plantas.' },
        restos: { nombre: 'Restos y desechos', x: 130, y: 312, etq: [130, 350], forma: 'n', desc: 'Restos de seres vivos, orina y excrementos.' },
        amonio: { nombre: 'Amonio en el suelo', x: 305, y: 405, etq: [305, 442], forma: 'nh4', desc: 'Nitrógeno en forma de amonio (NH₄⁺), producido por bacterias.' },
        nitratos: { nombre: 'Nitratos en el suelo', x: 600, y: 405, etq: [600, 442], forma: 'no3', desc: 'Nitrógeno en forma de nitratos (NO₃⁻): la forma que las plantas pueden absorber.' },
      },
      procesos: [
        { de: 'aire', a: 'amonio', nombre: 'Fijación por bacterias', estilo: 'n2', t: 0.22, ruta: 'M372,80 C330,150 312,240 305,300 C302,340 304,368 306,388', desc: 'Bacterias del suelo y de los nódulos de las raíces de las legumbres (porotos, soja) transforman el N₂ en amonio.' },
        { de: 'aire', a: 'nitratos', nombre: 'Fijación por rayos', estilo: 'n2', ruta: 'M620,80 L640,130 L656,130 L640,178 C640,250 625,330 606,388', desc: 'La energía de los rayos une el nitrógeno con el oxígeno; la lluvia lleva esos compuestos al suelo.' },
        { de: 'amonio', a: 'nitratos', nombre: 'Nitrificación', estilo: 'no3', ruta: 'M335,410 C420,428 500,428 572,410', desc: 'Otras bacterias del suelo transforman el amonio en nitratos.' },
        { de: 'nitratos', a: 'plantas', nombre: 'Asimilación', estilo: 'no3', ruta: 'M578,398 C480,375 380,352 326,338 C308,330 302,300 300,262', desc: 'Las raíces absorben los nitratos y la planta los usa para fabricar proteínas.' },
        { de: 'plantas', a: 'animales', nombre: 'Alimentación', estilo: 'n', ruta: 'M328,232 C420,222 500,232 536,252', desc: 'Los animales obtienen el nitrógeno comiendo plantas.' },
        { de: 'plantas', a: 'restos', nombre: 'Muerte', estilo: 'n', ruta: 'M280,250 C235,270 195,290 162,302', desc: 'Las plantas muertas quedan en el suelo.' },
        { de: 'animales', a: 'restos', nombre: 'Muerte y excreción', estilo: 'n', t: 0.3, ruta: 'M548,290 C430,306 260,310 170,316', desc: 'Los restos, la orina y los excrementos de los animales llegan al suelo.' },
        { de: 'restos', a: 'amonio', nombre: 'Amonificación', estilo: 'nh4', ruta: 'M140,332 C170,375 230,398 278,404', desc: 'Los descomponedores transforman los restos en amonio.' },
        { de: 'nitratos', a: 'aire', nombre: 'Desnitrificación', estilo: 'n2', ruta: 'M625,398 C770,330 760,150 440,62', desc: 'Algunas bacterias transforman los nitratos en N₂, que vuelve al aire.' },
      ],
      orden: [
        { nombre: 'Fijación', desc: 'Bacterias transforman el N₂ del aire en amonio.' },
        { nombre: 'Nitrificación', desc: 'El amonio se transforma en nitratos.' },
        { nombre: 'Asimilación', desc: 'Las plantas absorben los nitratos.' },
        { nombre: 'Amonificación', desc: 'Los descomponedores devuelven los restos al suelo como amonio.' },
        { nombre: 'Desnitrificación', desc: 'Bacterias devuelven el nitrógeno al aire como N₂.' },
      ],
    },
  };

  const VELOCIDAD = 55; // px por segundo de las partículas

  let raiz, svg, ciclo = 'agua', modo = 'explorar', verRotulos = false;
  let particulas = [], rutas = [], ultimo = 0, procSel = null;
  let seguir = null; // { nodo, pasos, moviendo, errores }
  let ordenar = null; // { elegidos, mezcla, revisado }

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
          <div class="cic-pie">
            <div class="cic-leyenda" id="cic-leyenda"></div>
            <label class="cic-toggle"><input type="checkbox" id="cic-rotulos"> Mostrar flechas y nombres de los procesos</label>
          </div>
        </div>
        <aside class="panel cic-panel" id="cic-panel"></aside>
      </div>`;
    svg = raiz.querySelector('#cic-svg');
    raiz.querySelectorAll('#cic-ciclos button').forEach(b => b.addEventListener('click', () => { ciclo = b.dataset.c; preparar(); }));
    raiz.querySelectorAll('#cic-modos button').forEach(b => b.addEventListener('click', () => { modo = b.dataset.m; preparar(); }));
    raiz.querySelector('#cic-rotulos').addEventListener('change', e => {
      verRotulos = e.target.checked;
      svg.classList.toggle('ver-rotulos', verRotulos);
    });
    svg.addEventListener('click', e => {
      if (modo !== 'explorar') return;
      const n = e.target.closest('[data-nodo]');
      const p = e.target.closest('[data-proc]');
      if (n) mostrarNodo(n.dataset.nodo);
      else if (p) mostrarProceso(+p.dataset.proc);
      else { procSel = null; marcarProceso(null); marcarNodo(null); panelExplorar(); }
    });
    preparar();
    requestAnimationFrame(bucle);
  }

  // ---------- Armado de la escena ----------

  function preparar() {
    const c = CICLOS[ciclo];
    raiz.querySelectorAll('#cic-ciclos button').forEach(b => b.classList.toggle('activo', b.dataset.c === ciclo));
    raiz.querySelectorAll('#cic-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === modo));
    raiz.querySelector('.cic-toggle').hidden = modo !== 'explorar';
    svg.setAttribute('aria-label', `Paisaje del ${c.nombre.toLowerCase()}`);
    svg.classList.toggle('ver-rotulos', verRotulos && modo === 'explorar');
    svg.classList.toggle('modo-explorar', modo === 'explorar');
    procSel = null;

    svg.innerHTML = `
      <defs>${DEFS}</defs>
      <g class="cic-escena">${ESCENAS[ciclo]}</g>
      <g id="cic-procesos">${c.procesos.map((p, i) => `
        <g class="cic-proc" data-proc="${i}">
          <path d="${p.ruta}" class="cic-guia" marker-end="url(#cc-flecha)"/>
          <path d="${p.ruta}" class="cic-toque"/>
        </g>`).join('')}</g>
      <g id="cic-particulas"></g>
      <g id="cic-nodos">${Object.entries(c.nodos).map(([k, n]) => {
        const ancho = n.nombre.length * 7.4 + 22;
        return `<g class="cic-nodo" data-nodo="${k}">
          <circle cx="${n.x}" cy="${n.y}" r="40" class="cic-zona"/>
          <g transform="translate(${n.etq[0]} ${n.etq[1]})">
            <rect x="${-ancho / 2}" y="-13" width="${ancho}" height="26" rx="13" class="cic-pastilla"/>
            <text y="5" text-anchor="middle" class="cic-pastilla-txt">${n.nombre}</text>
          </g></g>`;
      }).join('')}</g>
      <g id="cic-etiquetas"></g>
      <g id="cic-viajero"></g>`;

    // Rótulos de los procesos a mitad de cada ruta.
    rutas = [...svg.querySelectorAll('#cic-procesos .cic-guia')];
    raiz.querySelector('#cic-etiquetas').innerHTML = c.procesos.map((p, i) => {
      const largo = rutas[i].getTotalLength();
      const m = rutas[i].getPointAtLength(largo * (p.t || 0.5));
      const texto = p.nombre.replace(/ \(.*\)/, '');
      const ancho = texto.length * 6.6 + 16;
      return `<g class="cic-etq" data-etq="${i}" transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)})">
        <rect x="${-ancho / 2}" y="-11" width="${ancho}" height="22" rx="6"/><text y="4" text-anchor="middle">${texto}</text></g>`;
    }).join('');

    // Partículas de ambiente: dos por proceso, repartidas a lo largo de la ruta.
    const capa = raiz.querySelector('#cic-particulas');
    particulas = [];
    capa.innerHTML = '';
    if (modo !== 'seguir') {
      c.procesos.forEach((p, i) => {
        const largo = rutas[i].getTotalLength();
        [0, 0.5].forEach(desfase => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', 'cic-part');
          g.dataset.proc = i;
          g.innerHTML = ESTILOS[p.estilo].svg;
          capa.appendChild(g);
          particulas.push({ g, proc: i, largo, t: (desfase + Math.random() * 0.2) % 1 });
        });
      });
    }

    const usados = [...new Set(c.procesos.map(p => p.estilo).concat(Object.values(c.nodos).map(n => n.forma)))];
    raiz.querySelector('#cic-leyenda').innerHTML = usados.map(e =>
      `<span><svg viewBox="-12 -12 24 24" width="22" height="22" aria-hidden="true">${ESTILOS[e].svg}</svg>${ESTILOS[e].nombre}</span>`).join('');

    marcarProceso(null);
    marcarNodo(null);
    seguir = null;
    ordenar = null;
    if (modo === 'explorar') panelExplorar();
    else if (modo === 'seguir') empezarSeguir();
    else empezarOrdenar();
  }

  function bucle(t) {
    const dt = Math.min(0.05, (t - (ultimo || t)) / 1000);
    ultimo = t;
    if (!raiz.hidden && raiz.offsetParent !== null) {
      particulas.forEach(p => {
        p.t = (p.t + VELOCIDAD * dt / p.largo) % 1;
        const pt = rutas[p.proc].getPointAtLength(p.largo * p.t);
        // Aparecen y desaparecen suavemente en los extremos de la ruta.
        const alfa = Math.min(1, p.t * 6, (1 - p.t) * 6);
        p.g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        p.g.setAttribute('opacity', alfa.toFixed(2));
      });
    }
    requestAnimationFrame(bucle);
  }

  // ---------- Explorar ----------

  function panelExplorar() {
    const c = CICLOS[ciclo];
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${c.icono} ${c.nombre}</h2>
      <p>Las partículas que se mueven por el paisaje muestran los <b>procesos</b> que llevan ${c.viajeroNombre} de un lugar a otro.</p>
      <p class="cic-ayuda">👆 Toca un lugar (los rótulos blancos) o el camino de una partícula para saber más.</p>`;
  }

  function mostrarNodo(k) {
    const c = CICLOS[ciclo], n = c.nodos[k];
    const sale = c.procesos.filter(p => p.de === k), entra = c.procesos.filter(p => p.a === k);
    procSel = null;
    marcarProceso(null);
    marcarNodo(k);
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${n.nombre}</h2>
      <p>${n.desc}</p>
      <h3>Llega por…</h3><ul>${entra.map(p => `<li><button class="cic-link" data-p="${c.procesos.indexOf(p)}">${p.nombre}</button> desde ${c.nodos[p.de].nombre.toLowerCase()}</li>`).join('')}</ul>
      <h3>Sale por…</h3><ul>${sale.map(p => `<li><button class="cic-link" data-p="${c.procesos.indexOf(p)}">${p.nombre}</button> hacia ${c.nodos[p.a].nombre.toLowerCase()}</li>`).join('')}</ul>`;
    raiz.querySelectorAll('.cic-link').forEach(b => b.addEventListener('click', () => mostrarProceso(+b.dataset.p)));
  }

  function mostrarProceso(i) {
    const c = CICLOS[ciclo], p = c.procesos[i];
    procSel = i;
    marcarNodo(null);
    marcarProceso(i);
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>${p.nombre}</h2>
      <p class="cic-ruta">${c.nodos[p.de].nombre} → ${c.nodos[p.a].nombre}</p>
      <p>${p.desc}</p>
      <p class="cic-asi"><svg viewBox="-12 -12 24 24" width="28" height="28" aria-hidden="true">${ESTILOS[p.estilo].svg}</svg> Viaja como: <b>${ESTILOS[p.estilo].nombre.toLowerCase()}</b></p>`;
  }

  function marcarProceso(i) {
    svg.classList.toggle('con-sel', i !== null);
    svg.querySelectorAll('.cic-proc').forEach(g => g.classList.toggle('activo', +g.dataset.proc === i));
    svg.querySelectorAll('.cic-etq').forEach(g => g.classList.toggle('activo', +g.dataset.etq === i));
    particulas.forEach(p => p.g.classList.toggle('activa', p.proc === i));
  }

  function marcarNodo(k) {
    svg.querySelectorAll('.cic-nodo').forEach(g => g.classList.toggle('marcado', g.dataset.nodo === k));
  }

  // ---------- Seguir el viaje ----------

  function empezarSeguir() {
    const c = CICLOS[ciclo];
    seguir = { nodo: c.inicio, pasos: [], moviendo: false, errores: 0 };
    ponerViajero(c.inicio);
    marcarNodo(c.inicio);
    panelSeguir();
  }

  function ponerViajero(k) {
    const n = CICLOS[ciclo].nodos[k];
    raiz.querySelector('#cic-viajero').innerHTML = `<g class="cic-viajero reposo">${figura(n.forma, n.x, n.y, 2)}</g>`;
  }

  function panelSeguir(aviso) {
    const c = CICLOS[ciclo], n = c.nodos[seguir.nodo];
    const validas = c.procesos.map((p, i) => ({ p, i })).filter(o => o.p.de === seguir.nodo);
    // Distractores: procesos del ciclo que no pueden ocurrir desde este lugar.
    const nombresValidos = new Set(validas.map(o => o.p.nombre));
    const falsas = Util.mezclar(c.procesos.map((p, i) => ({ p, i })).filter(o => o.p.de !== seguir.nodo && !nombresValidos.has(o.p.nombre))).slice(0, 2);
    const opciones = Util.mezclar(validas.concat(falsas));
    const completo = seguir.pasos.length >= 3 && seguir.nodo === c.inicio;
    raiz.querySelector('#cic-panel').innerHTML = `
      <h2>🧭 El viaje de ${c.viajeroNombre}</h2>
      ${completo ? `<div class="cic-logro">🎉 ¡Volviste al punto de partida! Completaste un ciclo en <b>${seguir.pasos.length} pasos</b>${seguir.errores ? ` (con ${seguir.errores} intento${seguir.errores > 1 ? 's' : ''} fallido${seguir.errores > 1 ? 's' : ''})` : ''}.</div>` : ''}
      <p class="cic-ahora"><svg viewBox="-12 -12 24 24" width="30" height="30" aria-hidden="true">${ESTILOS[n.forma].svg}</svg><span>Ahora está en: <b>${n.nombre}</b><small>${ESTILOS[n.forma].nombre}</small></span></p>
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
    marcarNodo(null);
    marcarProceso(i);
    const ruta = rutas[i], largo = ruta.getTotalLength(), t0 = performance.now();
    const dur = Math.max(1400, largo / 0.22);
    const capa = raiz.querySelector('#cic-viajero');
    // El viajero cambia de forma: en el camino toma la forma del proceso (vapor, copo, CO₂…).
    const paso = t => {
      const f = Math.min(1, (t - t0) / dur);
      const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      const pt = ruta.getPointAtLength(largo * e);
      capa.innerHTML = `<g class="cic-viajero">${figura(p.estilo, pt.x, pt.y, 2)}</g>`;
      if (f < 1) return requestAnimationFrame(paso);
      marcarProceso(null);
      seguir.pasos.push(i);
      seguir.nodo = p.a;
      seguir.moviendo = false;
      ponerViajero(p.a);
      marcarNodo(p.a);
      panelSeguir(`<p class="cic-ok">✔ <b>${p.nombre}:</b> ${p.desc}</p>`);
    };
    requestAnimationFrame(paso);
  }

  // ---------- Ordenar etapas ----------

  function empezarOrdenar() {
    const c = CICLOS[ciclo];
    ordenar = { elegidos: [], mezcla: Util.mezclar(c.orden.map((_, i) => i)), revisado: false };
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
