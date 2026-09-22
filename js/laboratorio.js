// Módulo 2: Laboratorio virtual de reacciones.
const Laboratorio = (function () {
  const CLARO = 'rgba(165, 216, 255, 0.45)';

  const REACTIVOS = [
    { id: 'agua', nombre: 'Agua', formula: 'H2O', icono: '💧', tipo: 'liquido', color: CLARO },
    { id: 'hielo', nombre: 'Hielo', formula: 'H2O (s)', icono: '🧊', tipo: 'solido', color: '#e7f5ff' },
    { id: 'sal', nombre: 'Sal de mesa', formula: 'NaCl', icono: '🧂', tipo: 'solido', color: '#ffffff' },
    { id: 'azucar', nombre: 'Azúcar', formula: 'C12H22O11', icono: '🍬', tipo: 'solido', color: '#fffdf5' },
    { id: 'vinagre', nombre: 'Vinagre', formula: 'CH3COOH', icono: '🫙', tipo: 'liquido', color: 'rgba(255, 236, 153, 0.6)' },
    { id: 'bicarbonato', nombre: 'Bicarbonato de sodio', formula: 'NaHCO3', icono: '🥄', tipo: 'solido', color: '#ffffff' },
    { id: 'hcl', nombre: 'Ácido clorhídrico (diluido)', formula: 'HCl', icono: '🧪', tipo: 'liquido', color: CLARO },
    { id: 'naoh', nombre: 'Hidróxido de sodio (diluido)', formula: 'NaOH', icono: '🧴', tipo: 'liquido', color: CLARO },
    { id: 'fenolftaleina', nombre: 'Fenolftaleína (indicador)', formula: 'C20H14O4', icono: '🎨', tipo: 'liquido', color: CLARO },
    { id: 'agno3', nombre: 'Nitrato de plata (solución)', formula: 'AgNO3', icono: '🥈', tipo: 'liquido', color: CLARO },
    { id: 'pbno3', nombre: 'Nitrato de plomo (solución)', formula: 'Pb(NO3)2', icono: '⚗️', tipo: 'liquido', color: CLARO },
    { id: 'ki', nombre: 'Yoduro de potasio (solución)', formula: 'KI', icono: '🧫', tipo: 'liquido', color: CLARO },
    { id: 'cuso4', nombre: 'Sulfato de cobre (solución)', formula: 'CuSO4', icono: '💙', tipo: 'liquido', color: '#4dabf7' },
    { id: 'h2o2', nombre: 'Agua oxigenada', formula: 'H2O2', icono: '🫧', tipo: 'liquido', color: CLARO },
    { id: 'zn', nombre: 'Zinc (granallas)', formula: 'Zn', icono: '🔘', tipo: 'solido', color: '#adb5bd' },
    { id: 'fe', nombre: 'Clavo de hierro', formula: 'Fe', icono: '🔩', tipo: 'solido', color: '#868e96' },
    { id: 'mg', nombre: 'Cinta de magnesio', formula: 'Mg', icono: '🎗️', tipo: 'solido', color: '#ced4da' },
    { id: 'calor', nombre: 'Mechero (calor)', formula: '', icono: '🔥', tipo: 'energia', color: null },
  ];
  const POR_ID = Object.fromEntries(REACTIVOS.map(r => [r.id, r]));

  // anim: cómo se ve la reacción en el vaso.
  //   burbujas 0-3 · espuma (color) · precipitado (color) · liquidoFin (color) · nivelFin (%)
  //   solidoFin (color, o null si desaparece) · solidoTam (0-1) · luz · humo · temp (variación en °C)
  const REACCIONES = [
    {
      r: ['vinagre', 'bicarbonato'], titulo: 'Vinagre + bicarbonato', cambio: 'quimico',
      tipoReaccion: 'Ácido–base, con desprendimiento de gas',
      palabras: 'ácido acético + bicarbonato de sodio → acetato de sodio + agua + dióxido de carbono',
      ecuacion: 'CH3COOH + NaHCO3 → CH3COONa + H2O + CO2↑',
      observaciones: ['Aparecen muchísimas burbujas (efervescencia).', 'El polvo blanco desaparece.', 'El vaso se enfría un poco.'],
      evidencias: ['Desprendimiento de gas', 'Absorción de energía (se enfría)'],
      explicacion: 'Las burbujas son dióxido de carbono (CO₂), una sustancia que no estaba al principio. Por eso es un cambio químico.',
      dato: 'Es la misma reacción de los "volcanes" de las ferias de ciencias.',
      anim: { burbujas: 3, espuma: '#fffaf0', solidoFin: null, temp: -3 },
    },
    {
      r: ['hcl', 'naoh'], titulo: 'Ácido + base: neutralización', cambio: 'quimico',
      tipoReaccion: 'Neutralización (ácido–base)',
      palabras: 'ácido clorhídrico + hidróxido de sodio → cloruro de sodio + agua',
      ecuacion: 'HCl + NaOH → NaCl + H2O',
      observaciones: ['A simple vista no cambia nada: la mezcla sigue incolora.', 'Pero el termómetro sube: se libera calor.'],
      evidencias: ['Liberación de energía (calor)'],
      explicacion: 'Un ácido y una base se neutralizan y forman una sal y agua. Aunque no se ve, el aumento de temperatura revela que ocurrió una reacción.',
      dato: '¿Cómo "ver" una neutralización? Usando un indicador como la fenolftaleína.',
      anim: { temp: 8 },
    },
    {
      r: ['vinagre', 'naoh'], titulo: 'Vinagre + base: neutralización', cambio: 'quimico',
      tipoReaccion: 'Neutralización (ácido–base)',
      palabras: 'ácido acético + hidróxido de sodio → acetato de sodio + agua',
      ecuacion: 'CH3COOH + NaOH → CH3COONa + H2O',
      observaciones: ['No se ven cambios de color ni burbujas.', 'La temperatura sube un poco.'],
      evidencias: ['Liberación de energía (calor)'],
      explicacion: 'El ácido del vinagre se neutraliza con la base. Se forman sustancias nuevas aunque la mezcla parezca igual.',
      dato: 'Así se mide cuánto ácido tiene un vinagre en los laboratorios de control de calidad (titulación).',
      anim: { temp: 5 },
    },
    {
      r: ['naoh', 'fenolftaleina'], titulo: 'Base + fenolftaleína', cambio: 'quimico',
      tipoReaccion: 'Indicador ácido–base',
      palabras: 'fenolftaleína (incolora) + medio básico → fenolftaleína (forma fucsia)',
      ecuacion: 'HIn (incolora) + OH⁻ → In⁻ (fucsia) + H2O',
      observaciones: ['La mezcla incolora se vuelve fucsia al instante.'],
      evidencias: ['Cambio de color'],
      explicacion: 'La fenolftaleína es un indicador: su molécula cambia de estructura en medio básico y por eso cambia de color. Sirve para saber si una sustancia es básica.',
      dato: 'En medio ácido o neutro la fenolftaleína es incolora. ¡Pruébala con el ácido!',
      anim: { liquidoFin: '#e64980' },
    },
    {
      r: ['hcl', 'fenolftaleina'], titulo: 'Ácido + fenolftaleína', cambio: 'fisico',
      tipoReaccion: 'Sin reacción visible (solo mezcla)',
      palabras: 'ácido clorhídrico + fenolftaleína → mezcla incolora',
      ecuacion: '',
      observaciones: ['La mezcla sigue incolora.', 'No hay burbujas ni cambio de temperatura.'],
      evidencias: [],
      explicacion: 'En medio ácido la fenolftaleína permanece incolora: no hay evidencias de sustancias nuevas. Solo se formó una mezcla.',
      dato: 'Así funciona un indicador: el color (o su ausencia) te dice si el medio es ácido o básico.',
      anim: {},
    },
    {
      r: ['vinagre', 'fenolftaleina'], titulo: 'Vinagre + fenolftaleína', cambio: 'fisico',
      tipoReaccion: 'Sin reacción visible (solo mezcla)',
      palabras: 'vinagre + fenolftaleína → mezcla',
      ecuacion: '',
      observaciones: ['La mezcla no cambia de color.'],
      evidencias: [],
      explicacion: 'El vinagre es ácido, y en medio ácido la fenolftaleína no cambia de color. No hay evidencias de reacción.',
      dato: 'El vinagre de la cocina es una solución de ácido acético en agua (alrededor del 5 %).',
      anim: {},
    },
    {
      r: ['agno3', 'sal'], titulo: 'Nitrato de plata + sal', cambio: 'quimico',
      tipoReaccion: 'Doble desplazamiento (precipitación)',
      palabras: 'nitrato de plata + cloruro de sodio → cloruro de plata + nitrato de sodio',
      ecuacion: 'AgNO3 + NaCl → AgCl↓ + NaNO3',
      observaciones: ['Aparece una nube blanca en el líquido.', 'Un sólido blanco se deposita en el fondo.'],
      evidencias: ['Formación de un precipitado'],
      explicacion: 'El cloruro de plata (AgCl) no se disuelve en agua: aparece como un sólido blanco nuevo llamado precipitado.',
      dato: 'El cloruro de plata se oscurece con la luz. Esa propiedad se usaba en la fotografía antigua.',
      anim: { precipitado: '#ffffff', liquidoFin: 'rgba(241, 243, 245, 0.9)', solidoFin: null },
    },
    {
      r: ['pbno3', 'ki'], titulo: 'La "lluvia de oro"', cambio: 'quimico',
      tipoReaccion: 'Doble desplazamiento (precipitación)',
      palabras: 'nitrato de plomo + yoduro de potasio → yoduro de plomo + nitrato de potasio',
      ecuacion: 'Pb(NO3)2 + 2KI → PbI2↓ + 2KNO3',
      observaciones: ['Dos líquidos incoloros forman al instante un sólido amarillo intenso.', 'El sólido se deposita en el fondo.'],
      evidencias: ['Cambio de color', 'Formación de un precipitado'],
      explicacion: 'Se forma yoduro de plomo (PbI₂), una sustancia nueva, amarilla e insoluble.',
      dato: '⚠️ Los compuestos de plomo son tóxicos: en un laboratorio real se usan en cantidades mínimas, con guantes, y se desechan en recipientes especiales.',
      anim: { liquidoFin: '#ffe066', precipitado: '#fcc419' },
    },
    {
      r: ['zn', 'hcl'], titulo: 'Zinc + ácido', cambio: 'quimico',
      tipoReaccion: 'Desplazamiento simple',
      palabras: 'zinc + ácido clorhídrico → cloruro de zinc + hidrógeno',
      ecuacion: 'Zn + 2HCl → ZnCl2 + H2↑',
      observaciones: ['Se forman burbujas sobre el zinc.', 'El metal se va gastando.', 'El vaso se calienta.'],
      evidencias: ['Desprendimiento de gas', 'Liberación de calor'],
      explicacion: 'El zinc reemplaza al hidrógeno del ácido. El gas que burbujea es hidrógeno (H₂).',
      dato: 'El hidrógeno es muy inflamable: si acercas una llama a un tubo con este gas se oye un pequeño "¡pop!".',
      anim: { burbujas: 2, temp: 6, solidoTam: 0.55 },
    },
    {
      r: ['mg', 'hcl'], titulo: 'Magnesio + ácido', cambio: 'quimico',
      tipoReaccion: 'Desplazamiento simple',
      palabras: 'magnesio + ácido clorhídrico → cloruro de magnesio + hidrógeno',
      ecuacion: 'Mg + 2HCl → MgCl2 + H2↑',
      observaciones: ['Burbujeo muy intenso.', 'La cinta de magnesio desaparece en segundos.', 'El vaso se calienta bastante.'],
      evidencias: ['Desprendimiento de gas', 'Liberación de calor'],
      explicacion: 'El magnesio desplaza al hidrógeno del ácido y se libera hidrógeno gaseoso (H₂).',
      dato: 'El magnesio reacciona más rápido que el zinc porque es un metal más activo.',
      anim: { burbujas: 3, temp: 15, solidoFin: null },
    },
    {
      r: ['fe', 'hcl'], titulo: 'Hierro + ácido', cambio: 'quimico',
      tipoReaccion: 'Desplazamiento simple',
      palabras: 'hierro + ácido clorhídrico → cloruro de hierro (II) + hidrógeno',
      ecuacion: 'Fe + 2HCl → FeCl2 + H2↑',
      observaciones: ['Aparecen burbujas lentamente sobre el clavo.', 'El líquido toma un tono verde pálido.'],
      evidencias: ['Desprendimiento de gas', 'Cambio de color'],
      explicacion: 'El hierro reacciona con el ácido, pero más despacio que el magnesio o el zinc.',
      dato: 'Por eso los alimentos ácidos no se guardan en latas de hierro sin recubrir.',
      anim: { burbujas: 1, liquidoFin: 'rgba(178, 242, 187, 0.7)', temp: 3 },
    },
    {
      r: ['fe', 'cuso4'], titulo: 'Clavo de hierro + sulfato de cobre', cambio: 'quimico',
      tipoReaccion: 'Desplazamiento simple',
      palabras: 'hierro + sulfato de cobre → sulfato de hierro (II) + cobre',
      ecuacion: 'Fe + CuSO4 → FeSO4 + Cu',
      observaciones: ['El clavo se cubre de una capa rojiza (cobre).', 'La solución azul se vuelve verdosa.'],
      evidencias: ['Cambio de color', 'Aparece un sólido nuevo'],
      explicacion: 'El hierro es más activo que el cobre y lo desplaza del compuesto: el cobre metálico se deposita sobre el clavo y el hierro pasa a la solución.',
      dato: 'Esta reacción permite ordenar los metales según su actividad (serie de actividad).',
      anim: { liquidoFin: '#8fc9a9', solidoFin: '#c8553d' },
    },
    {
      r: ['zn', 'cuso4'], titulo: 'Zinc + sulfato de cobre', cambio: 'quimico',
      tipoReaccion: 'Desplazamiento simple',
      palabras: 'zinc + sulfato de cobre → sulfato de zinc + cobre',
      ecuacion: 'Zn + CuSO4 → ZnSO4 + Cu',
      observaciones: ['El zinc se cubre de un depósito rojizo-oscuro.', 'La solución pierde su color azul.', 'El vaso se calienta un poco.'],
      evidencias: ['Cambio de color', 'Aparece un sólido nuevo', 'Liberación de calor'],
      explicacion: 'El zinc desplaza al cobre. Como el sulfato de zinc es incoloro, el azul (que se debía al cobre) desaparece.',
      dato: 'Este par de metales se usa en la pila de Daniell, una de las primeras pilas.',
      anim: { liquidoFin: CLARO, solidoFin: '#8b3a2b', temp: 5 },
    },
    {
      r: ['naoh', 'cuso4'], titulo: 'Sulfato de cobre + base', cambio: 'quimico',
      tipoReaccion: 'Doble desplazamiento (precipitación)',
      palabras: 'sulfato de cobre + hidróxido de sodio → hidróxido de cobre (II) + sulfato de sodio',
      ecuacion: 'CuSO4 + 2NaOH → Cu(OH)2↓ + Na2SO4',
      observaciones: ['Se forma un sólido celeste gelatinoso.', 'El sólido se deposita en el fondo.'],
      evidencias: ['Formación de un precipitado', 'Cambio de color'],
      explicacion: 'El hidróxido de cobre (II) es insoluble y aparece como un precipitado celeste.',
      dato: 'Si se calienta, el precipitado celeste se vuelve negro: se transforma en óxido de cobre.',
      anim: { precipitado: '#74c0fc', liquidoFin: 'rgba(208, 235, 255, 0.8)' },
    },
    {
      r: ['h2o2', 'ki'], titulo: 'Pasta de dientes de elefante', cambio: 'quimico',
      tipoReaccion: 'Descomposición (con catalizador)',
      palabras: 'agua oxigenada → agua + oxígeno (el yoduro de potasio acelera la reacción)',
      ecuacion: '2H2O2 → 2H2O + O2↑',
      observaciones: ['Se forma muchísima espuma que sale del vaso.', 'El vaso se calienta.'],
      evidencias: ['Desprendimiento de gas', 'Liberación de calor'],
      explicacion: 'El agua oxigenada se descompone en agua y oxígeno. El yoduro de potasio es un catalizador: acelera la reacción sin gastarse.',
      dato: 'Con detergente y colorante, este experimento se conoce como "pasta de dientes de elefante".',
      anim: { espuma: '#fff3bf', burbujas: 3, temp: 12, liquidoFin: 'rgba(255, 232, 161, 0.8)' },
    },
    {
      r: ['mg', 'calor'], titulo: 'Combustión del magnesio', cambio: 'quimico',
      tipoReaccion: 'Síntesis (combustión)',
      palabras: 'magnesio + oxígeno → óxido de magnesio',
      ecuacion: '2Mg + O2 → 2MgO',
      observaciones: ['La cinta arde con una luz blanca intensísima.', 'Queda un polvo blanco.'],
      evidencias: ['Emisión de luz', 'Liberación de calor', 'Aparece una sustancia nueva (polvo blanco)'],
      explicacion: 'El magnesio se combina con el oxígeno del aire y forma óxido de magnesio, una sustancia totalmente distinta.',
      dato: '⚠️ No hay que mirar esa luz directamente. Antiguamente se usaba en los flashes de las cámaras.',
      anim: { luz: true, humo: true, solidoFin: '#ffffff', temp: 40 },
    },
    {
      r: ['azucar', 'calor'], titulo: 'Azúcar al fuego', cambio: 'quimico',
      tipoReaccion: 'Descomposición térmica',
      palabras: 'azúcar → carbono + agua',
      ecuacion: 'C12H22O11 → 12C + 11H2O',
      observaciones: ['El azúcar se funde, se pone dorado (caramelo) y luego negro.', 'Aparecen humo y olor a quemado.'],
      evidencias: ['Cambio de color', 'Aparición de olor', 'Desprendimiento de gases'],
      explicacion: 'Con el calor el azúcar se descompone: queda carbono (negro) y se libera vapor de agua. No se puede revertir.',
      dato: 'La primera etapa, la caramelización, da color y sabor al caramelo y al dulce de leche.',
      anim: { humo: true, solidoFin: '#212529', temp: 60 },
    },
    {
      r: ['bicarbonato', 'calor'], titulo: 'Bicarbonato al fuego', cambio: 'quimico',
      tipoReaccion: 'Descomposición térmica',
      palabras: 'bicarbonato de sodio → carbonato de sodio + agua + dióxido de carbono',
      ecuacion: '2NaHCO3 → Na2CO3 + H2O + CO2↑',
      observaciones: ['El polvo blanco casi no cambia de aspecto…', '…pero se desprenden gas y gotitas de agua en las paredes.'],
      evidencias: ['Desprendimiento de gas'],
      explicacion: 'Se forman carbonato de sodio, agua y dióxido de carbono: sustancias nuevas. ¡No siempre un cambio químico cambia el aspecto!',
      dato: 'Por eso el bicarbonato sirve para hornear: el CO₂ infla la masa.',
      anim: { humo: true, temp: 30 },
    },
    {
      r: ['hielo', 'calor'], titulo: 'Hielo + calor: fusión', cambio: 'fisico',
      tipoReaccion: 'Cambio de estado (fusión)',
      palabras: 'agua sólida → agua líquida',
      ecuacion: 'H2O (s) → H2O (l)',
      observaciones: ['El hielo se derrite y se forma agua líquida.', 'Mientras hay hielo, la temperatura se queda en 0 °C.'],
      evidencias: [],
      explicacion: 'Es un cambio de estado: las moléculas siguen siendo H₂O. Si lo enfrías, vuelve a ser hielo.',
      dato: 'La temperatura no sube durante la fusión porque el calor se usa para desarmar la estructura del sólido.',
      anim: { solidoFin: null, liquidoFin: CLARO, nivelFin: 30, temp: 5 },
    },
    {
      r: ['agua', 'calor'], titulo: 'Agua + calor: ebullición', cambio: 'fisico',
      tipoReaccion: 'Cambio de estado (vaporización)',
      palabras: 'agua líquida → vapor de agua',
      ecuacion: 'H2O (l) → H2O (g)',
      observaciones: ['Se forman burbujas grandes en todo el líquido.', 'Sale vapor y el nivel del agua baja.'],
      evidencias: [],
      explicacion: 'Las burbujas son vapor de agua, no una sustancia nueva: sigue siendo H₂O. Si el vapor toca algo frío, se condensa y vuelve a ser líquido.',
      dato: '¡Ojo! No todas las burbujas indican un cambio químico. Aquí son del agua cambiando de estado.',
      anim: { burbujas: 2, humo: true, nivelFin: 15, temp: 80 },
    },
    {
      r: ['sal', 'agua'], titulo: 'Sal + agua: disolución', cambio: 'fisico',
      tipoReaccion: 'Disolución (mezcla homogénea)',
      palabras: 'sal + agua → agua salada',
      ecuacion: 'NaCl (s) → NaCl (ac)',
      observaciones: ['La sal "desaparece" al revolver.', 'El líquido queda transparente.'],
      evidencias: [],
      explicacion: 'La sal se disolvió, pero sigue ahí: el agua tiene gusto salado. Si evaporas el agua, recuperas la sal. No se formaron sustancias nuevas.',
      dato: 'Así se obtiene la sal marina: evaporando agua de mar en salinas.',
      anim: { solidoFin: null },
    },
    {
      r: ['azucar', 'agua'], titulo: 'Azúcar + agua: disolución', cambio: 'fisico',
      tipoReaccion: 'Disolución (mezcla homogénea)',
      palabras: 'azúcar + agua → agua azucarada',
      ecuacion: 'C12H22O11 (s) → C12H22O11 (ac)',
      observaciones: ['El azúcar se disuelve al revolver.', 'El líquido queda transparente y dulce.'],
      evidencias: [],
      explicacion: 'El azúcar se reparte entre las moléculas de agua, pero sigue siendo azúcar.',
      dato: 'Disolver no es lo mismo que derretir: el azúcar no se fundió, se mezcló con el agua.',
      anim: { solidoFin: null },
    },
  ];

  const clave = (a, b) => [a, b].sort().join('+');
  const MAPA = Object.fromEntries(REACCIONES.map(x => [clave(...x.r), x]));

  function reaccionPorDefecto(a, b) {
    const conCalor = a.tipo === 'energia' || b.tipo === 'energia';
    return {
      titulo: 'No se observa reacción', cambio: 'fisico', tipoReaccion: 'Sin reacción visible',
      palabras: '', ecuacion: '',
      observaciones: conCalor
        ? ['La sustancia solo se calienta.', 'No aparecen colores nuevos, gases ni otros cambios.']
        : ['No aparecen burbujas, colores nuevos, sólidos ni cambios de temperatura.'],
      evidencias: [],
      explicacion: 'No hay evidencias de sustancias nuevas, así que no hubo un cambio químico: a lo sumo se formó una mezcla o la sustancia se calentó.',
      dato: 'No todas las sustancias reaccionan entre sí. ¡Prueba otra combinación!',
      anim: conCalor ? { temp: 30 } : {},
      sinRegistro: true,
    };
  }

  let raiz, vaso, seleccion = [null, null], ocupado = false;
  let descubiertos = new Set(Util.leer('lab-descubiertos', []));

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🧪 Laboratorio virtual</h1>
        <p>Elige dos elementos del estante, mézclalos y observa. Luego decide: ¿fue un cambio físico o químico?</p>
      </div>
      <div class="lab-grid">
        <aside class="panel estante">
          <h2>Estante</h2>
          <div class="reactivos" id="lab-reactivos">
            ${REACTIVOS.map(r => `
              <button class="reactivo" data-id="${r.id}">
                <span class="ico">${r.icono}</span>
                <span class="txt"><b>${r.nombre}</b>${r.formula ? `<small>${Util.formula(r.formula)}</small>` : ''}</span>
              </button>`).join('')}
          </div>
        </aside>

        <section class="panel mesa-panel">
          <div class="ranuras">
            <button class="ranura" data-slot="0"></button>
            <span class="mas">+</span>
            <button class="ranura" data-slot="1"></button>
          </div>
          <div class="mesa" id="lab-mesa">
            <div class="soporte">
              <div class="vaso" id="lab-vaso">
                <div class="humo"><span></span><span></span><span></span></div>
                <div class="espuma"></div>
                <div class="vaso-interior">
                  <div class="liquido"><div class="burbujas"></div></div>
                  <div class="precipitado"></div>
                  <div class="solido"></div>
                </div>
                <div class="flash"></div>
              </div>
              <div class="llama">🔥</div>
            </div>
            <div class="termometro">
              <div class="tubo"><div class="mercurio"></div></div>
              <span class="temp-valor">20 °C</span>
            </div>
          </div>
          <div class="lab-botones">
            <button id="lab-mezclar" class="btn primario" disabled>Mezclar ⚗️</button>
            <button id="lab-limpiar" class="btn">🧽 Limpiar mesa</button>
          </div>
          <div id="lab-resultado"></div>
        </section>

        <aside class="panel cuaderno">
          <h2>📓 Cuaderno</h2>
          <p id="lab-progreso" class="progreso"></p>
          <ul id="lab-cuaderno"></ul>
          <button id="lab-reiniciar" class="btn chico">Borrar cuaderno</button>
        </aside>
      </div>`;

    vaso = raiz.querySelector('#lab-vaso');
    raiz.querySelectorAll('.reactivo').forEach(b => b.addEventListener('click', () => elegir(b.dataset.id)));
    raiz.querySelectorAll('.ranura').forEach(b => b.addEventListener('click', () => quitar(+b.dataset.slot)));
    raiz.querySelector('#lab-mezclar').addEventListener('click', mezclar);
    raiz.querySelector('#lab-limpiar').addEventListener('click', limpiar);
    // Confirmación en dos toques (los diálogos del navegador no están disponibles en todos los visores).
    const borrar = raiz.querySelector('#lab-reiniciar');
    let confirmando = null;
    borrar.addEventListener('click', () => {
      if (!confirmando) {
        borrar.textContent = '¿Seguro? Toca otra vez';
        confirmando = setTimeout(() => { confirmando = null; borrar.textContent = 'Borrar cuaderno'; }, 3000);
        return;
      }
      clearTimeout(confirmando);
      confirmando = null;
      borrar.textContent = 'Borrar cuaderno';
      descubiertos = new Set();
      Util.guardar('lab-descubiertos', []);
      pintarCuaderno();
    });
    actualizar();
    pintarCuaderno();
  }

  function elegir(id) {
    if (ocupado) return;
    if (seleccion.includes(id)) return;
    const libre = seleccion.indexOf(null);
    if (libre === -1) return;
    seleccion[libre] = id;
    raiz.querySelector('#lab-resultado').innerHTML = '';
    actualizar();
  }

  function quitar(i) {
    if (ocupado || !seleccion[i]) return;
    seleccion[i] = null;
    raiz.querySelector('#lab-resultado').innerHTML = '';
    actualizar();
  }

  function limpiar() {
    if (ocupado) return;
    seleccion = [null, null];
    raiz.querySelector('#lab-resultado').innerHTML = '';
    actualizar();
  }

  function actualizar() {
    raiz.querySelectorAll('.ranura').forEach((b, i) => {
      const r = POR_ID[seleccion[i]];
      b.classList.toggle('llena', !!r);
      b.innerHTML = r
        ? `<span class="ico">${r.icono}</span><span>${r.nombre}</span><span class="quitar" title="Quitar">✕</span>`
        : `<span class="vacia">${i === 0 ? 'Reactivo A' : 'Reactivo B'}</span>`;
    });
    raiz.querySelectorAll('.reactivo').forEach(b => b.classList.toggle('elegido', seleccion.includes(b.dataset.id)));
    raiz.querySelector('#lab-mezclar').disabled = ocupado || seleccion.includes(null);
    dibujarEstado(estadoInicial(seleccion.filter(Boolean).map(id => POR_ID[id])), false);
  }

  function estadoInicial(rs) {
    const liquidos = rs.filter(r => r.tipo === 'liquido');
    const solido = rs.find(r => r.tipo === 'solido');
    const coloreado = liquidos.find(l => l.color !== CLARO);
    return {
      liquido: liquidos.length ? (coloreado || liquidos[0]).color : null,
      nivel: liquidos.length * 30,
      solido: solido ? solido.color : null,
      solidoTam: 1,
      calor: rs.some(r => r.tipo === 'energia'),
      temp: rs.some(r => r.id === 'hielo') ? -5 : 20,
    };
  }

  function dibujarEstado(e, animado) {
    vaso.classList.toggle('sin-transicion', !animado);
    const liq = vaso.querySelector('.liquido');
    liq.style.height = (e.liquido ? e.nivel : 0) + '%';
    if (e.liquido) liq.style.background = e.liquido;
    const sol = vaso.querySelector('.solido');
    sol.style.opacity = e.solido ? 1 : 0;
    if (e.solido) sol.style.background = e.solido;
    sol.style.transform = `translateX(-50%) scale(${e.solido ? e.solidoTam : 0.2})`;
    raiz.querySelector('#lab-mesa').classList.toggle('con-calor', e.calor);
    if (!animado) {
      vaso.querySelector('.burbujas').innerHTML = '';
      vaso.querySelector('.precipitado').style.height = '0';
      vaso.querySelector('.espuma').style.height = '0';
      vaso.querySelector('.flash').classList.remove('activo');
      vaso.querySelector('.humo').classList.remove('activo');
      ponerTemperatura(e.temp);
      void vaso.offsetHeight; // aplica los estilos antes de reactivar las transiciones
      vaso.classList.remove('sin-transicion');
    }
  }

  function ponerTemperatura(t) {
    const pct = Math.max(0, Math.min(100, (t + 10) / 110 * 100));
    raiz.querySelector('.mercurio').style.height = pct + '%';
    raiz.querySelector('.temp-valor').textContent = Math.round(t) + ' °C';
  }

  function animarTemperatura(desde, hasta, ms) {
    const t0 = performance.now();
    function paso(ahora) {
      const p = Math.min(1, (ahora - t0) / ms);
      ponerTemperatura(desde + (hasta - desde) * p);
      if (p < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  function mezclar() {
    const [a, b] = seleccion.map(id => POR_ID[id]);
    const reac = MAPA[clave(a.id, b.id)] || reaccionPorDefecto(a, b);
    const an = reac.anim || {};
    const ini = estadoInicial([a, b]);
    ocupado = true;
    actualizarBotones();

    const fin = { ...ini };
    if ('liquidoFin' in an) fin.liquido = an.liquidoFin;
    if ('nivelFin' in an) fin.nivel = an.nivelFin;
    if ('solidoFin' in an) fin.solido = an.solidoFin;
    if ('solidoTam' in an) fin.solidoTam = an.solidoTam;
    dibujarEstado(fin, true);

    if (an.burbujas) {
      const cont = vaso.querySelector('.burbujas');
      const n = [0, 8, 16, 30][an.burbujas];
      cont.innerHTML = Array.from({ length: n }, () => {
        const tam = 4 + Math.random() * 8;
        return `<span class="burbuja" style="left:${5 + Math.random() * 88}%;width:${tam}px;height:${tam}px;animation-delay:${(Math.random() * 1.6).toFixed(2)}s;animation-duration:${(1 + Math.random()).toFixed(2)}s"></span>`;
      }).join('');
    }
    if (an.precipitado) {
      const p = vaso.querySelector('.precipitado');
      p.style.background = an.precipitado;
      p.style.height = '16%';
    }
    if (an.espuma) {
      const e = vaso.querySelector('.espuma');
      e.style.setProperty('--espuma', an.espuma);
      e.style.height = '135%';
    }
    if (an.luz) vaso.querySelector('.flash').classList.add('activo');
    if (an.humo) vaso.querySelector('.humo').classList.add('activo');
    if (an.temp) animarTemperatura(ini.temp, ini.temp + an.temp, 2200);

    setTimeout(() => {
      ocupado = false;
      actualizarBotones();
      preguntar(reac);
    }, 2400);
  }

  function actualizarBotones() {
    raiz.querySelector('#lab-mezclar').disabled = ocupado || seleccion.includes(null);
  }

  function preguntar(reac) {
    const cont = raiz.querySelector('#lab-resultado');
    cont.innerHTML = `
      <div class="resultado">
        <h3>👀 Observaciones</h3>
        <ul>${reac.observaciones.map(o => `<li>${o}</li>`).join('')}</ul>
        <h3>¿Qué tipo de cambio ocurrió?</h3>
        <div class="opciones">
          <button class="btn-opcion fisico" data-r="fisico">🔵 Físico (o solo mezcla)</button>
          <button class="btn-opcion quimico" data-r="quimico">🔴 Químico</button>
        </div>
        <div id="lab-explicacion"></div>
      </div>`;
    cont.querySelectorAll('.btn-opcion').forEach(b => b.addEventListener('click', () => revelar(reac, b.dataset.r)));
    cont.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function revelar(reac, respuesta) {
    const ok = respuesta === reac.cambio;
    raiz.querySelectorAll('#lab-resultado .btn-opcion').forEach(b => {
      b.disabled = true;
      if (b.dataset.r === reac.cambio) b.classList.add('correcta');
      else if (b.dataset.r === respuesta) b.classList.add('incorrecta');
    });
    const esQuimico = reac.cambio === 'quimico';
    raiz.querySelector('#lab-explicacion').innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'mal'}">
        <p class="fb-titulo">${ok ? '✅ ¡Bien observado!' : `❌ En realidad fue un cambio ${esQuimico ? 'químico' : 'físico'}.`}</p>
        <p class="lab-titulo-reaccion"><b>${reac.titulo}</b> · <span class="etiqueta ${reac.cambio}">${reac.tipoReaccion}</span></p>
        ${reac.palabras ? `<p class="palabras">${reac.palabras}</p>` : ''}
        ${reac.ecuacion ? `<p class="ecuacion">${Util.formula(reac.ecuacion)}</p>` : ''}
        ${reac.evidencias.length ? `<p class="evidencias">${reac.evidencias.map(e => `<span class="chip">${e}</span>`).join('')}</p>` : ''}
        <p>${reac.explicacion}</p>
        <p class="dato">💡 ${reac.dato}</p>
      </div>`;
    if (!reac.sinRegistro) {
      descubiertos.add(reac.titulo);
      Util.guardar('lab-descubiertos', [...descubiertos]);
      pintarCuaderno();
    }
  }

  function pintarCuaderno() {
    const hechos = REACCIONES.filter(r => descubiertos.has(r.titulo)).length;
    raiz.querySelector('#lab-progreso').innerHTML =
      `Descubriste <b>${hechos}</b> de <b>${REACCIONES.length}</b> experimentos.
       <span class="barra"><span style="width:${hechos / REACCIONES.length * 100}%"></span></span>`;
    raiz.querySelector('#lab-cuaderno').innerHTML = REACCIONES.map(r => descubiertos.has(r.titulo)
      ? `<li class="hecho"><span class="punto ${r.cambio}"></span>${r.titulo}</li>`
      : `<li class="oculto">🔒 ???</li>`).join('');
  }

  return { iniciar };
})();
