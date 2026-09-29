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
  const ELEM = {
    H: ['#f1f3f5', 4.6], O: ['#ff6b6b', 7], C: ['#5c636a', 7], Na: ['#b197fc', 5.5], Cl: ['#51cf66', 8.5], Fe: ['#adb5bd', 7.5],
    Ar: ['#e9c46a', 7], A: ['#5b8def', 7], X: ['#ffa94d', 7], Zn: ['#8f96b8', 7.5], Cu: ['#e8590c', 7.5],
  };

  // Plantillas de moléculas: cada átomo con su elemento, posición y molécula (g).
  function mol(f, g, x, y, ang = 0, col) {
    const rot = (dx, dy) => [x + dx * Math.cos(ang) - dy * Math.sin(ang), y + dx * Math.sin(ang) + dy * Math.cos(ang)];
    const at = (e, dx, dy) => { const [px, py] = rot(dx, dy); return { e, x: px, y: py, g, col }; };
    switch (f) {
      case 'H2O': return [at('O', 0, 0), at('H', -7, 6), at('H', 7, 6)];
      case 'CO2': return [at('C', 0, 0), at('O', -12, 0), at('O', 12, 0)];
      case 'O2': return [at('O', -6, 0), at('O', 6, 0)];
      case 'CH4': return [at('C', 0, 0), at('H', 0, -10), at('H', 0, 10), at('H', -10, 0), at('H', 10, 0)];
      case 'M': return [at('X', -6, 0), at('X', 6, 0)];
      case 'A2': return [at('A', -6, 0), at('A', 6, 0)];
      case 'X2': return [at('X', -6, 0), at('X', 6, 0)];
      case 'AX': return [at('A', -6, 0), at('X', 6, 0)];
      case 'CO3': return [at('C', 0, 0), at('O', 0, -11), at('O', -10, 7), at('O', 10, 7)];
      case 'HA': return [at('H', -7, 0), at('A', 5, 0)];
      case 'HOA': return [at('O', 0, 0), at('H', -9, -4), at('A', 11, 2)];
    }
  }
  // Posiciones típicas de cada estado (coordenadas relativas al centro de la lupa).
  const RED = Array.from({ length: 12 }, (_, i) => [-48 + (i % 4) * 32 + (Math.floor(i / 4) % 2) * 12, -30 + Math.floor(i / 4) * 30]);
  const LIQ = [[-60, 20], [-30, 14], [0, 22], [30, 12], [60, 24], [-48, 44], [-16, 46], [16, 42], [48, 48], [-30, 66], [4, 70], [36, 68]];
  const GAS = [[-60, -50], [10, -66], [58, -30], [-20, -20], [36, 18], [-66, 10], [-10, 34], [60, 50], [-44, 58], [22, 70], [70, -2], [-36, -70]];
  const ang = i => (i * 67) % 360 * Math.PI / 180;
  const muchas = (f, pos, g, col, giro = true) => pos.flatMap((p, i) => mol(f, g + i, p[0], p[1], giro ? ang(i) : 0, col));

  // Cada tipo de transformación: cómo están las partículas antes (ini) y después (fin).
  const TIPOS = {
    fusion: col => ({ ini: muchas(col ? 'M' : 'H2O', RED, 'a', col, false), fin: muchas(col ? 'M' : 'H2O', LIQ, 'a', col), amp: [0.6, 2.4],
      texto: 'Las moléculas se desordenan y se mueven más: el sólido pasa a líquido, pero siguen siendo las mismas.' }),
    solidificacion: col => ({ ini: muchas('M', LIQ, 'a', col), fin: muchas('M', RED, 'a', col, false), amp: [2.4, 0.6],
      texto: 'Las moléculas se ordenan y casi no se mueven: el líquido se vuelve sólido, pero son las mismas.' }),
    evaporacion: col => ({ ini: muchas(col ? 'M' : 'H2O', LIQ.slice(0, 9), 'a', col), fin: muchas(col ? 'M' : 'H2O', GAS.slice(0, 9), 'a', col), amp: [2.4, 5],
      texto: 'Las moléculas se separan mucho y se mueven rápido: pasan a gas, pero siguen siendo las mismas.' }),
    sublimacion: () => ({ ini: muchas('CO2', RED.slice(0, 9), 'a', null, false), fin: muchas('CO2', GAS.slice(0, 9), 'a'), amp: [0.6, 5],
      texto: 'Las moléculas de CO₂ pasan directamente de sólido a gas: siguen siendo CO₂.' }),
    condensacion: () => ({ ini: muchas('H2O', GAS.slice(0, 9), 'a'), fin: muchas('H2O', LIQ.slice(0, 9), 'a'), amp: [5, 2.4],
      texto: 'Las moléculas de vapor se enfrían, se juntan y forman gotitas: siguen siendo agua.' }),
    disolucion: () => {
      const iones = [[-56, 40], [-40, 40], [-24, 40], [-8, 40], [-56, 56], [-40, 56], [-24, 56], [-8, 56]].map(([x, y], i) => ({ e: (i + Math.floor(i / 4)) % 2 ? 'Cl' : 'Na', x, y, g: 'sal' }));
      const agua = [[30, -40], [60, -10], [20, 0], [50, 30], [-30, -30], [0, -60], [-60, -10], [40, 64]];
      const libres = [[-40, -54], [4, -32], [44, -50], [-64, 14], [-14, 10], [28, 20], [-40, 64], [10, 56]];
      return { ini: [...iones, ...muchas('H2O', agua, 'w')], fin: [...iones.map((a, i) => ({ ...a, x: libres[i][0], y: libres[i][1], g: 'i' + i })), ...muchas('H2O', [[62, -30], [-18, -58], [66, 20], [-66, -34], [30, 70], [-10, 30], [-50, 36], [60, 60]], 'w')],
        amp: [1.2, 2.4], texto: 'Los iones de la sal se separan y quedan rodeados de agua. No cambian: si se evapora el agua, la sal vuelve a aparecer.' };
    },
    cortar: col => {
      const bloque = Array.from({ length: 16 }, (_, i) => ({ e: 'X', col, x: -36 + (i % 4) * 24, y: -36 + Math.floor(i / 4) * 24, g: 'b' }));
      return { ini: bloque, fin: bloque.map((a, i) => ({ ...a, x: a.x + (i % 4 < 2 ? -22 : 22) + (i < 8 ? 0 : 6), y: a.y + (i < 8 ? -14 : 16), g: (i % 4 < 2 ? 'L' : 'R') + (i < 8 ? 'a' : 'b') })),
        amp: [0.6, 0.6], unir: false, texto: 'Los pedazos son más chicos, pero las partículas son exactamente las mismas.' };
    },
    deformar: col => {
      const bloque = Array.from({ length: 16 }, (_, i) => ({ e: 'X', col, x: -36 + (i % 4) * 24, y: -36 + Math.floor(i / 4) * 24, g: 'b' }));
      return { ini: bloque, fin: bloque.map((a, i) => ({ ...a, x: -84 + (i % 8) * 24, y: 10 + Math.floor(i / 8) * 22 - (i % 8 > 3 ? (i % 8 - 3) * 12 : 0) })),
        amp: [0.6, 0.6], unir: false, texto: 'Las partículas se acomodan distinto y cambia la forma, pero siguen siendo las mismas.' };
    },
    separacion: () => {
      const mez = [[-50, -30], [-20, -44], [10, -20], [40, -40], [-60, 10], [-30, 0], [0, 12], [30, 4], [60, 14], [-44, 44], [-14, 36], [16, 48], [46, 40], [-20, 66], [12, 74], [58, -10]];
      const fe = [[34, -62], [52, -52], [70, -40], [30, -44], [48, -34], [66, -22], [40, -24], [58, -8]];
      const ar = [[-60, 30], [-40, 40], [-20, 50], [0, 60], [-50, 58], [-30, 70], [-10, 76], [-66, 50]];
      return { ini: mez.map(([x, y], i) => ({ e: i % 2 ? 'Fe' : 'Ar', x, y, g: 'm' + i })), fin: mez.map((_, i) => { const [x, y] = i % 2 ? fe[i >> 1] : ar[i >> 1]; return { e: i % 2 ? 'Fe' : 'Ar', x, y, g: 'm' + i }; }),
        amp: [1, 1], unir: false, efecto: 'iman', texto: 'El imán atrae solo las partículas de hierro; la arena queda. Nada se transforma: es una mezcla que se separa.' };
    },
    combustion: () => ({
      ini: [...mol('CH4', 'c1', -44, -20), ...mol('CH4', 'c2', -44, 34), ...mol('O2', 'o1', 16, -50, 0.4), ...mol('O2', 'o2', 44, -14, -0.3), ...mol('O2', 'o3', 20, 26, 0.9), ...mol('O2', 'o4', 50, 52, 0.2)],
      fin: [...mol('CO2', 'n1', -30, -50, 0.3), ...mol('CO2', 'n2', 34, -54, -0.2), ...mol('H2O', 'n3', -54, 16), ...mol('H2O', 'n4', -6, 6), ...mol('H2O', 'n5', 44, 16), ...mol('H2O', 'n6', 0, 54)],
      amp: [1.2, 2.6], efecto: 'llama', texto: 'El combustible reacciona con el oxígeno: se forman dióxido de carbono y agua, sustancias nuevas. Se libera luz y calor.' }),
    oxidacion: () => ({
      ini: [...[-36, -12, 12, 36].map((x, i) => ({ e: 'Fe', x, y: 50, g: 'fe' })), ...mol('O2', 'o1', -40, -40, 0.3), ...mol('O2', 'o2', 0, -60), ...mol('O2', 'o3', 40, -36, -0.4)],
      fin: [{ e: 'Fe', x: -44, y: 20, g: 'r1' }, { e: 'Fe', x: -20, y: 20, g: 'r1' }, { e: 'Fe', x: 20, y: 20, g: 'r2' }, { e: 'Fe', x: 44, y: 20, g: 'r2' },
        { e: 'O', x: -32, y: 2, g: 'r1' }, { e: 'O', x: -56, y: 36, g: 'r1' }, { e: 'O', x: -8, y: 36, g: 'r1' }, { e: 'O', x: 32, y: 2, g: 'r2' }, { e: 'O', x: 8, y: 36, g: 'r2' }, { e: 'O', x: 56, y: 36, g: 'r2' }],
      amp: [0.8, 0.8], efecto: 'oxido', texto: 'El hierro se une con el oxígeno del aire: se forma óxido de hierro, una sustancia nueva de color rojizo.' }),
    efervescencia: texto => ({
      ini: [...mol('CO3', 'b1', -54, 40), ...mol('CO3', 'b2', -24, 58), ...mol('CO3', 'b3', -52, 70), ...mol('HA', 'h1', 30, 40), ...mol('HA', 'h2', 54, 60), ...mol('HA', 'h3', 20, 68)],
      fin: [...mol('CO2', 'g1', -40, -54, 0.2), ...mol('CO2', 'g2', 10, -40, -0.3), ...mol('CO2', 'g3', 50, -60, 0.5), ...mol('HOA', 'p1', -40, 50), ...mol('HOA', 'p2', 0, 64), ...mol('HOA', 'p3', 40, 50)],
      amp: [1, 2.4], efecto: 'burbujas', texto: texto || 'Se forma dióxido de carbono (CO₂), un gas que no estaba: son las burbujas. También se forman otras sustancias.' }),
    reaccion: (col, texto) => ({
      ini: [...muchas('A2', [[-50, -30], [-10, -46], [-50, 20], [-14, 8]], 'a'), ...muchas('X2', [[30, -30], [60, 0], [30, 30], [60, 50]], 'x', col)],
      fin: muchas('AX', [[-52, -40], [4, -62], [52, -30], [-66, 14], [-12, -8], [40, 22], [-34, 44], [18, 54]], 'n', col),
      amp: [1.2, 1.6], texto: texto || 'Los átomos se separan y se vuelven a unir de otra manera: se forman sustancias nuevas.' }),
    proteinas: () => {
      const bolas = (k, cx, cy) => Array.from({ length: 8 }, (_, i) => ({ e: i % 3 ? 'X' : 'A', x: cx + 16 * Math.cos(i * Math.PI / 4), y: cy + 16 * Math.sin(i * Math.PI / 4), g: 'k' + k }));
      const ini = [...bolas(1, -34, -10), ...bolas(2, 34, 20)];
      const fin = ini.map((a, i) => { const j = i % 8, fila = i < 8 ? -18 : 18; return { ...a, x: -70 + j * 20, y: fila + (j % 2 ? 8 : -8) * (i < 8 ? 1 : -1) }; });
      return { ini, fin, amp: [1.2, 0.8], cadena: true, puentes: [[3, 11], [6, 14]],
        texto: 'Las proteínas de la clara se despliegan y se unen entre sí: cambian su estructura y ya no vuelven atrás.' };
    },
    descomposicion: texto => {
      const cad = (k, y) => Array.from({ length: 6 }, (_, i) => ({ e: ['C', 'O', 'C', 'C', 'O', 'C'][i], x: -50 + i * 20, y, g: 'k' + k }));
      const ini = [...cad(1, -20), ...cad(2, 24)];
      const lugares = [[-60, -50], [-20, -66], [30, -54], [62, -20], [-66, 10], [-24, 4], [20, 12], [64, 30], [-50, 56], [-10, 60], [30, 64], [60, 60]];
      const fin = ini.map((a, i) => ({ ...a, x: lugares[i][0] + (i % 2 ? 8 : -8), y: lugares[i][1], g: 'p' + (i >> 1) }));
      fin.forEach((a, i) => { a.x = lugares[i & ~1][0] + (i % 2 ? 8 : -8); a.y = lugares[i & ~1][1]; });
      return { ini, fin, amp: [0.8, 2], cadena: true, cadenaFin: false,
        texto: texto || 'Las moléculas grandes se rompen en moléculas más pequeñas y distintas: se forman sustancias nuevas.' };
    },
    fotosintesis: () => ({
      ini: [...mol('CO2', 'c1', -50, -40, 0.3), ...mol('CO2', 'c2', 0, -60), ...mol('CO2', 'c3', 50, -40, -0.3), ...mol('H2O', 'w1', -50, 40), ...mol('H2O', 'w2', 0, 58), ...mol('H2O', 'w3', 50, 40)],
      fin: [{ e: 'C', x: -22, y: 0, g: 'k' }, { e: 'C', x: 0, y: 0, g: 'k' }, { e: 'C', x: 22, y: 0, g: 'k' },
        { e: 'O', x: -22, y: -20, g: 'k' }, { e: 'O', x: 0, y: 20, g: 'k' }, { e: 'O', x: 22, y: -20, g: 'k' },
        { e: 'H', x: -40, y: 6, g: 'k' }, { e: 'H', x: -32, y: -32, g: 'k' }, { e: 'H', x: 0, y: -17, g: 'k' }, { e: 'H', x: 12, y: 33, g: 'k' }, { e: 'H', x: 40, y: 6, g: 'k' }, { e: 'H', x: 32, y: -32, g: 'k' },
        ...mol('O2', 'n1', -50, 56), ...mol('O2', 'n2', 0, 70), ...mol('O2', 'n3', 50, 56)].map(a => a),
      amp: [1.4, 1.4], efecto: 'luz', enlacesFin: [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [0, 6], [3, 7], [1, 8], [4, 9], [2, 10], [5, 11]], texto: 'Con la energía de la luz, el CO₂ y el agua se transforman en glucosa (azúcar) y oxígeno: sustancias nuevas.' }),
    pila: () => ({ ...TIPOS.reaccion(null, 'Dentro de la pila unas sustancias se transforman en otras y en ese cambio se mueven electrones: la corriente eléctrica.'), efecto: 'electrones' }),
  };

  // Qué se ve (antes → después) y qué pasa con las partículas en cada situación.
  const ESCENAS = {
    'Un cubo de hielo se derrite en un vaso.': [['🧊', '→', '💧'], 'fusion'],
    'Recortar una hoja de papel en pedacitos.': [['📄', '→', '✂️'], 'cortar', '#f1f3f5'],
    'Disolver sal en un vaso de agua.': [['🧂', '+', '💧'], 'disolucion'],
    'El agua de una pava hierve y sale vapor.': [['🫖', '→', '♨️'], 'evaporacion'],
    'El espejo del baño se empaña después de una ducha caliente.': [['♨️', '→', '🪞'], 'condensacion'],
    'Un chocolate se derrite al sol.': [['🍫', '+', '☀️'], 'fusion', '#a0714f'],
    'Separar limaduras de hierro mezcladas con arena usando un imán.': [['🧲', '+', '⏳'], 'separacion'],
    'Un trozo de hielo seco (CO₂ sólido) desprende "humo" sin derretirse.': [['🧊', '→', '🌫️'], 'sublimacion'],
    'Aplastar una lata de aluminio.': [['🥫', '→', '👟'], 'deformar', '#ced4da'],
    'La cera de una vela se derrite y gotea.': [['🕯️', '→', '💧'], 'fusion', '#fff3bf'],
    'Un perfume se evapora y su aroma llena la habitación.': [['🌸', '→', '💨'], 'evaporacion', '#f783ac'],
    'Congelar jugo para hacer un helado de agua.': [['🧃', '→', '🍧'], 'solidificacion', '#ffa94d'],
    'Doblar un clip metálico.': [['📎'], 'deformar', '#adb5bd'],
    'Quemar una hoja de papel.': [['📄', '+', '🔥'], 'combustion'],
    'Una manzana cortada se pone marrón.': [['🍎', '→', '🟤'], 'reaccion', '#a0714f', 'Sustancias de la manzana se unen con el oxígeno del aire y forman sustancias nuevas, de color marrón.'],
    'Un clavo se oxida al dejarlo a la intemperie.': [['🔩', '+', '💧'], 'oxidacion'],
    'Freír un huevo.': [['🥚', '→', '🍳'], 'proteinas'],
    'Tostar una rebanada de pan.': [['🍞', '+', '🔥'], 'reaccion', '#8d5a3b', 'El calor rompe y reordena las moléculas del pan: se forman sustancias nuevas, marrones y con olor a tostado.'],
    'La leche se corta y huele agria.': [['🥛', '+', '🦠'], 'descomposicion', null, 'Las bacterias transforman el azúcar de la leche en ácido láctico, una sustancia nueva.'],
    'Una pastilla efervescente burbujea en agua.': [['💊', '+', '💧'], 'efervescencia'],
    'Estallan fuegos artificiales.': [['🎆'], 'combustion'],
    'Las hojas caídas se descomponen y se convierten en abono.': [['🍂', '→', '🪴'], 'descomposicion', null, 'Hongos y bacterias rompen las moléculas grandes de las hojas en sustancias más simples.'],
    'Una planta realiza la fotosíntesis.': [['☀️', '+', '🌿'], 'fotosintesis'],
    'La masa del pan crece gracias a la levadura.': [['🥣', '→', '🍞'], 'efervescencia', null, 'Las levaduras transforman el azúcar en CO₂ y alcohol. El gas CO₂ forma burbujas que inflan la masa.'],
    'Una pila hace funcionar una linterna.': [['🔋', '→', '🔦'], 'pila'],
    'La mecha de una vela encendida produce una llama.': [['🕯️', '→', '🔥'], 'combustion'],
    'Mezclar vinagre con bicarbonato de sodio.': [['🫙', '+', '🥄'], 'efervescencia'],
  };

  function escenario(c) {
    const [, tipo, col, texto] = ESCENAS[c.t] || [null, c.r === 'fisico' ? 'fusion' : 'reaccion'];
    const E = tipo === 'efervescencia' || tipo === 'descomposicion' ? TIPOS[tipo](texto) : TIPOS[tipo](col, texto);
    if (texto) E.texto = texto;
    // Empareja cada átomo de "antes" con un lugar de "después" del mismo elemento.
    const usados = new Set();
    E.atomos = E.ini.map(a => {
      const j = E.fin.findIndex((b, k) => !usados.has(k) && b.e === a.e);
      usados.add(j);
      const b = E.fin[j] || a;
      return { e: a.e, col: a.col, p0: [a.x, a.y], p1: [b.x, b.y], g0: a.g, g1: b.g, i: j };
    });
    return E;
  }

  function escenaFija(c) {
    const [lx, ly] = LUPA, [ox, oy] = ORBE, v = (ESCENAS[c.t] || [[c.e]])[0];
    const macro = v.length === 1 ? `<text x="${ox}" y="${oy + 26}" text-anchor="middle" class="tr-emoji">${v[0]}</text>`
      : `<text x="${ox - 30}" y="${oy + 16}" text-anchor="middle" class="tr-emoji chico">${v[0]}</text><text x="${ox}" y="${oy + 8}" text-anchor="middle" class="tr-op">${v[1]}</text><text x="${ox + 30}" y="${oy + 16}" text-anchor="middle" class="tr-emoji chico">${v[2]}</text>`;
    return `<defs>
        <radialGradient id="tr-fondo" cx="0.4" cy="0.4" r="0.9"><stop offset="0" stop-color="#262a74"/><stop offset="1" stop-color="#0c0e30"/></radialGradient>
        <radialGradient id="tr-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="#ffd166" stop-opacity="0.28"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
        <radialGradient id="tr-lupa" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stop-color="#2c2468"/><stop offset="1" stop-color="#17153f"/></radialGradient>
        <radialGradient id="tr-llama" cx="0.5" cy="0.9" r="0.8"><stop offset="0" stop-color="#ff922b" stop-opacity="0.75"/><stop offset="0.5" stop-color="#ff6b6b" stop-opacity="0.25"/><stop offset="1" stop-color="#ff6b6b" stop-opacity="0"/></radialGradient>
        <radialGradient id="tr-luz" cx="0.5" cy="0" r="0.9"><stop offset="0" stop-color="#ffe066" stop-opacity="0.6"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
        <clipPath id="tr-clip"><circle cx="${lx}" cy="${ly}" r="${RL - 3}"/></clipPath>
      </defs>
      <rect width="640" height="286" rx="14" fill="url(#tr-fondo)"/>${estrellas(26, 640, 286)}
      <path d="M${ox},${oy - 72} L${lx},${ly - RL} L${lx},${ly + RL} L${ox},${oy + 72} Z" fill="#b197fc" opacity="0.07"/>
      <path d="M${ox},${oy - 72} L${lx},${ly - RL} M${ox},${oy + 72} L${lx},${ly + RL}" stroke="#c9b8ff" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.5"/>
      <circle cx="${ox}" cy="${oy}" r="104" fill="url(#tr-halo)"/>
      <circle cx="${ox + 5}" cy="${oy + 7}" r="72" fill="#05061a" opacity="0.45"/>
      <circle cx="${ox}" cy="${oy}" r="72" fill="#2a2f76"/><circle cx="${ox}" cy="${oy}" r="72" fill="none" stroke="#ffd166" stroke-width="4"/>
      <path d="M${ox - 50},${oy - 34} a60,60 0 0 1 36,-30" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.45"/>
      ${macro}
      <text x="${ox}" y="22" text-anchor="middle" class="tr-rotulo">LO QUE VEMOS</text>
      <circle cx="${lx + 6}" cy="${ly + 8}" r="${RL}" fill="#05061a" opacity="0.45"/>
      <circle cx="${lx}" cy="${ly}" r="${RL}" fill="url(#tr-lupa)"/>
      <text x="${lx}" y="18" text-anchor="middle" class="tr-rotulo">🔍 LAS PARTÍCULAS</text>`;
  }

  // Efectos que acompañan a la transformación dentro de la lupa.
  function efecto(E, e, t) {
    const [lx, ly] = LUPA;
    switch (E.efecto) {
      case 'llama': return `<ellipse cx="${lx}" cy="${ly + 40}" rx="${110 * e}" ry="${120 * e}" fill="url(#tr-llama)"/>`;
      case 'luz': return `<rect x="${lx - RL}" y="${ly - RL}" width="${RL * 2}" height="${RL * 2}" fill="url(#tr-luz)" opacity="${0.4 + 0.6 * e}"/>` +
        [-40, -10, 20, 50].map((x, i) => `<path d="M${lx + x},${ly - RL} l${-10},60" stroke="#ffe066" stroke-width="3" opacity="${0.25 + 0.2 * Math.sin(t * 3 + i)}"/>`).join('');
      case 'iman': return `<g transform="translate(${lx + 50} ${ly - 82})"><path d="M-22,0 v14 a22,22 0 0 0 44,0 v-14 h-12 v14 a10,10 0 0 1 -20,0 v-14 Z" fill="#e03131"/><rect x="-22" y="-6" width="12" height="8" fill="#dee2e6"/><rect x="10" y="-6" width="12" height="8" fill="#dee2e6"/></g>`;
      case 'oxido': return e > 0.5 ? [[-32, 22], [32, 22]].map(([x, y]) => `<ellipse cx="${lx + x}" cy="${ly + y}" rx="34" ry="26" fill="#c2410c" opacity="${(e - 0.5) * 0.7}"/>`).join('') : '';
      case 'electrones': return e > 0.3 ? Array.from({ length: 6 }, (_, i) => { const u = (t * 0.5 + i / 6) % 1; return `<circle cx="${lx - 80 + u * 160}" cy="${ly - 80 + Math.sin(u * Math.PI) * 10}" r="4" fill="#ffe066"/>`; }).join('') : '';
      default: return '';
    }
  }

  function dibujarParticulas(ahora) {
    const svg = raiz.querySelector('#tr-part');
    if (!svg) return;
    const [lx, ly] = LUPA, t = ahora / 1000;
    const marco = `<circle cx="${lx}" cy="${ly}" r="${RL}" fill="none" stroke="#e5dbff" stroke-width="5"/>
      <path d="M${lx - 74},${ly - 50} a${RL - 12},${RL - 12} 0 0 1 48,-38" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.45"/>`;
    // Antes de responder, las partículas son una incógnita.
    if (!anim) {
      svg.innerHTML = `<g clip-path="url(#tr-clip)">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${lx + Math.cos(t * 0.6 + i) * 60}" cy="${ly + Math.sin(t * 0.8 + i * 2) * 50}" r="${14 + i * 2}" fill="#b197fc" opacity="0.08"/>`).join('')}
        <text x="${lx}" y="${ly + 30}" text-anchor="middle" class="tr-incognita">?</text></g>${marco}
        <g transform="translate(${lx} ${ly + RL + 22})"><rect x="-96" y="-13" width="192" height="24" rx="12" fill="#12143a" stroke="#ffd166" stroke-opacity="0.6"/><text y="4" text-anchor="middle" class="tr-nota">Respondé para descubrirlo</text></g>`;
      return;
    }
    const E = anim.E, trans = Math.min(1, Math.max(0, (ahora - anim.t0 - 900) / 1900));
    const e = trans < 0.5 ? 2 * trans * trans : 1 - Math.pow(-2 * trans + 2, 2) / 2;
    const amp = E.amp[0] + (E.amp[1] - E.amp[0]) * e, fase0 = ahora - anim.t0 < 900;
    const pos = E.atomos.map(a => {
      const g = e < 0.5 ? a.g0 : a.g1, h = [...String(g)].reduce((s, ch) => s + ch.charCodeAt(0), 0);
      const x = lx + a.p0[0] + (a.p1[0] - a.p0[0]) * e + Math.sin(t * (2 + amp * 0.3) + h) * amp;
      const y = ly + a.p0[1] + (a.p1[1] - a.p0[1]) * e + Math.cos(t * (1.8 + amp * 0.3) + h * 1.3) * amp;
      return { x, y, g };
    });
    // Enlaces: dentro de cada molécula, del primer átomo a los demás (o en cadena).
    let enl = '';
    if (E.unir !== false && (e < 0.2 || e > 0.8)) {
      const grupos = {};
      pos.forEach((p, i) => (grupos[p.g] = grupos[p.g] || []).push(i));
      const cadena = e < 0.5 ? E.cadena : E.cadena && E.cadenaFin !== false;
      // Enlaces dibujados a mano (por ejemplo, la glucosa de la fotosíntesis).
      if (E.enlacesFin && e > 0.5) {
        const porFin = {};
        E.atomos.forEach((a, i) => { porFin[a.i] = i; });
        E.enlacesFin.forEach(([a, b]) => { const p = pos[porFin[a]], q = pos[porFin[b]]; enl += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="#e9ebff" stroke-width="3.5" stroke-linecap="round" opacity="0.75"/>`; });
        E.enlacesFin.flat().forEach(k => { pos[porFin[k]].manual = true; });
      }
      Object.values(grupos).forEach(ix => {
        if (ix.length < 2 || (e > 0.5 && ix.some(i => pos[i].manual))) return;
        const orden = e < 0.5 ? ix : [...ix].sort((a, b) => E.atomos[a].i - E.atomos[b].i);
        orden.slice(1).forEach((j, k) => {
          const a = pos[cadena ? orden[k] : orden[0]], b = pos[j];
          if (Math.hypot(a.x - b.x, a.y - b.y) < 40) enl += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="#e9ebff" stroke-width="3.5" stroke-linecap="round" opacity="0.75"/>`;
        });
      });
      if (E.puentes && e > 0.8) E.puentes.forEach(([a, b]) => { enl += `<line x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}" stroke="#ffd166" stroke-width="3" stroke-dasharray="3 3"/>`; });
    }
    let burb = '';
    if (E.efecto === 'burbujas' && e > 0.6) {
      const grupos = {};
      pos.forEach((p, i) => { if (/^g/.test(p.g)) (grupos[p.g] = grupos[p.g] || []).push(p); });
      Object.values(grupos).forEach(ps => { const cx = ps.reduce((s, p) => s + p.x, 0) / ps.length, cy = ps.reduce((s, p) => s + p.y, 0) / ps.length; burb += `<circle cx="${cx}" cy="${cy}" r="22" fill="#a5d8ff" fill-opacity="0.12" stroke="#d0ebff" stroke-width="2" opacity="${(e - 0.6) * 2.5}"/>`; });
    }
    const atomos = E.atomos.map((a, i) => { const [c, r] = ELEM[a.e]; return esfera(pos[i].x, pos[i].y, r, a.col && a.e === 'X' ? a.col : c); }).join('');
    const fis = anim.tipo === 'fisico', fin = trans >= 1;
    const etiqueta = fase0 ? 'ANTES' : fin ? 'DESPUÉS' : '…';
    svg.innerHTML = `<g clip-path="url(#tr-clip)">${efecto(E, e, t)}${enl}${burb}${atomos}</g>${marco}
      <g transform="translate(${lx} ${ly - RL + 16})"><rect x="-34" y="-10" width="68" height="20" rx="10" fill="#12143a" opacity="0.9"/><text y="4" text-anchor="middle" class="tr-nota">${etiqueta}</text></g>
      ${fin ? `<g transform="translate(${lx} ${ly + RL + 22})"><rect x="-112" y="-13" width="224" height="24" rx="12" fill="${fis ? '#1c7ed6' : '#e8590c'}"/><text y="4" text-anchor="middle" class="tr-nota blanca">${fis ? 'Siguen siendo las mismas partículas' : '¡Se formaron sustancias nuevas!'}</text></g>` : ''}`;
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
      <div class="tr-escena"><svg viewBox="0 0 640 286" role="img" aria-label="${c.t}"><g id="tr-fijo">${escenaFija(c)}</g><g id="tr-part"></g></svg></div>
      <p class="caso-texto">${c.t}</p>
      <div class="opciones">
        <button class="btn-opcion fisico" data-r="fisico">🔵 Cambio físico</button>
        <button class="btn-opcion quimico" data-r="quimico">🔴 Cambio químico</button>
      </div>
      <div id="tr-feedback"></div>`;
    cont.querySelectorAll('.btn-opcion').forEach(b => b.addEventListener('click', () => responder(b.dataset.r)));
    anim = null;
    // Tocar la lupa repite la animación.
    cont.querySelector('.tr-escena svg').addEventListener('click', () => { if (anim) anim.t0 = performance.now(); });
    if (!bucle) bucle = requestAnimationFrame(animar);
  }

  function responder(r) {
    const c = casos[indice];
    const ok = r === c.r;
    if (ok) puntos++; else errores.push(c);
    anim = { tipo: c.r, t0: performance.now(), E: escenario(c) };
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
