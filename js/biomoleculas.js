// Módulo 9: Biomoléculas (carbohidratos, lípidos, proteínas y ácidos nucleicos). Nivel 5.º año.
const Biomoleculas = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const rad = g => g * Math.PI / 180;

  // ---------- Figuras en dos tonos ----------
  const puntos = (r, angulos) => angulos.map(a => [r * Math.cos(rad(a)), r * Math.sin(rad(a))]);
  const poligono = p => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  function hexagono(r, claro, oscuro) {
    const v = puntos(r, [-90, -30, 30, 90, 150, 210]);
    return `<polygon points="${poligono(v)}" fill="${claro}"/><polygon points="${poligono([v[0], v[1], v[2], v[3]])}" fill="${oscuro}"/>`;
  }
  function pentagono(r, claro, oscuro) {
    const v = puntos(r, [-90, -18, 54, 126, 198]);
    const base = [(v[2][0] + v[3][0]) / 2, (v[2][1] + v[3][1]) / 2];
    return `<polygon points="${poligono(v)}" fill="${claro}"/><polygon points="${poligono([v[0], v[1], v[2], base])}" fill="${oscuro}"/>`;
  }
  const circulo = (r, claro, oscuro) => `<circle r="${r}" fill="${claro}"/><path d="M0,${-r} A${r},${r} 0 0 1 0,${r} Z" fill="${oscuro}"/>`;
  const brillo = r => `<circle cx="${-r * 0.4}" cy="${-r * 0.45}" r="${r * 0.18}" fill="#fff" opacity="0.55"/>`;
  const etiqueta = (t, color = '#15163d', tam = '') => `<text y="4" text-anchor="middle" class="bm-letra ${tam}" fill="${color}">${t}</text>`;
  const agua = '<g class="bm-h2o"><circle r="7" fill="#ff6b6b"/><circle cx="-7" cy="-5" r="4.5" fill="#f4f6ff"/><circle cx="7" cy="-5" r="4.5" fill="#f4f6ff"/></g>';
  // OH del carbono anomérico (C1): abajo en α, arriba en β.
  const oh = arriba => `<circle cx="20.8" cy="${arriba ? -17 : 17}" r="4.2" fill="#ff6b6b"/><circle cx="23" cy="${arriba ? -19.5 : 19.5}" r="2.4" fill="#f4f6ff"/>`;

  // ---------- Tipos de biomoléculas ----------
  const CLASES_AA = {
    apolar: { nombre: 'Apolar (hidrófobo)', c: ['#ffd166', '#f0a830'] },
    polar: { nombre: 'Polar sin carga', c: ['#5cc8ff', '#3aa0d8'] },
    acido: { nombre: 'Ácido (carga −)', c: ['#ff6b6b', '#d94848'] },
    basico: { nombre: 'Básico (carga +)', c: ['#b197fc', '#9775fa'] },
  };
  const aa = (id, nombre, corto, clase, masa, extra = '') => ({
    id, nombre, corto, clase, masa,
    dibujo: () => circulo(20, ...CLASES_AA[clase].c) + extra,
  });

  const TIPOS = {
    carbohidratos: {
      nombre: 'Carbohidratos', icono: '🍞', enlace: 'enlace O-glucosídico', max: 12,
      intro: 'Glúcidos formados por C, H y O. Su unidad es el <b>monosacárido</b>. Fíjate en el <b>OH del carbono 1</b> (en rojo): abajo es <b>α</b>, arriba es <b>β</b>. Ese detalle decide si formas almidón o celulosa.',
      piezas: [
        { id: 'aglc', nombre: 'α-Glucosa', corto: 'α-Glc', dibujo: () => hexagono(24, '#ffd166', '#f0a830') + oh(false) },
        { id: 'bglc', nombre: 'β-Glucosa', corto: 'β-Glc', dibujo: () => hexagono(24, '#8ce99a', '#51cf66') + oh(true) },
        { id: 'fru', nombre: 'Fructosa', corto: 'Fru', dibujo: () => pentagono(24, '#ff9f43', '#e07a1f') },
        { id: 'gal', nombre: 'β-Galactosa', corto: 'β-Gal', dibujo: () => hexagono(24, '#ffe8a3', '#e9c46a') + oh(true) },
      ],
    },
    proteinas: {
      nombre: 'Proteínas', icono: '🥚', enlace: 'enlace peptídico', max: 16,
      intro: 'Polímeros de <b>aminoácidos</b> (C, H, O, N y a veces S). Todos tienen un grupo amino y un carboxilo; se diferencian por su <b>cadena lateral R</b>, que puede ser apolar, polar, ácida o básica.',
      piezas: [
        aa('gly', 'Glicina', 'Gly', 'apolar', 75),
        aa('ala', 'Alanina', 'Ala', 'apolar', 89),
        aa('val', 'Valina', 'Val', 'apolar', 117),
        aa('leu', 'Leucina', 'Leu', 'apolar', 131),
        aa('phe', 'Fenilalanina', 'Phe', 'apolar', 165),
        aa('ser', 'Serina', 'Ser', 'polar', 105),
        aa('cys', 'Cisteína', 'Cys', 'polar', 121, '<circle cx="13" cy="-13" r="5.5" fill="#ffe066"/><text x="13" y="-10.5" text-anchor="middle" class="bm-letra mini" fill="#15163d">S</text>'),
        aa('asp', 'Ácido aspártico', 'Asp', 'acido', 133),
        aa('lys', 'Lisina', 'Lys', 'basico', 146),
      ],
    },
    lipidos: {
      nombre: 'Lípidos', icono: '🧈', enlace: 'enlace éster', max: 4,
      intro: 'Moléculas hidrófobas. Los <b>acilglicéridos</b> se forman al esterificar el glicerol con ácidos grasos. La notación <b>18:1</b> indica 18 carbonos y 1 enlace doble.',
      piezas: [
        { id: 'gli', nombre: 'Glicerol', corto: 'Glicerol' },
        { id: 'pal', nombre: 'Ác. palmítico 16:0', corto: '16:0', C: 16, dobles: [], cis: false, masa: 256, color: '#ffd166' },
        { id: 'est', nombre: 'Ác. esteárico 18:0', corto: '18:0', C: 18, dobles: [], cis: false, masa: 284, color: '#ffe066' },
        { id: 'ole', nombre: 'Ác. oleico 18:1 cis (ω-9)', corto: '18:1 cis ω-9', C: 18, dobles: [9], cis: true, masa: 282, color: '#ff9f43' },
        { id: 'lin', nombre: 'Ác. linoleico 18:2 cis (ω-6)', corto: '18:2 cis ω-6', C: 18, dobles: [9, 12], cis: true, masa: 280, color: '#ff7a45' },
        { id: 'ela', nombre: 'Ác. elaídico 18:1 trans', corto: '18:1 trans', C: 18, dobles: [9], cis: false, masa: 282, color: '#ff8fb1' },
        { id: 'fos', nombre: 'Fosfato + colina', corto: 'P-colina', masa: 184 },
      ],
    },
    adn: {
      nombre: 'Ácidos nucleicos', icono: '🧬', enlace: 'enlace fosfodiéster', max: 12,
      intro: 'Polímeros de <b>nucleótidos</b>: fosfato + desoxirribosa + base nitrogenada. Las bases <b>A y G son purinas</b> (dos anillos) y <b>C y T son pirimidinas</b> (un anillo). La hebra tiene sentido: se lee de <b>5\' a 3\'</b>.',
      piezas: [
        { id: 'A', nombre: 'Adenina', corto: 'A', color: ['#ff6b6b', '#d94848'] },
        { id: 'T', nombre: 'Timina', corto: 'T', color: ['#ffd166', '#f0a830'] },
        { id: 'C', nombre: 'Citosina', corto: 'C', color: ['#5cc8ff', '#3aa0d8'] },
        { id: 'G', nombre: 'Guanina', corto: 'G', color: ['#2fd186', '#1a9a61'] },
      ],
    },
  };
  const PAR = { A: 'T', T: 'A', C: 'G', G: 'C' };
  const pieza = (t, id) => TIPOS[t].piezas.find(p => p.id === id);

  // ---------- Código genético (tabla estándar) ----------
  const BASES = 'UCAG';
  const AA_1 = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const AMINO = {
    A: ['Ala', 'Alanina'], R: ['Arg', 'Arginina'], N: ['Asn', 'Asparagina'], D: ['Asp', 'Ác. aspártico'], C: ['Cys', 'Cisteína'],
    Q: ['Gln', 'Glutamina'], E: ['Glu', 'Ác. glutámico'], G: ['Gly', 'Glicina'], H: ['His', 'Histidina'], I: ['Ile', 'Isoleucina'],
    L: ['Leu', 'Leucina'], K: ['Lys', 'Lisina'], M: ['Met', 'Metionina'], F: ['Phe', 'Fenilalanina'], P: ['Pro', 'Prolina'],
    S: ['Ser', 'Serina'], T: ['Thr', 'Treonina'], W: ['Trp', 'Triptófano'], Y: ['Tyr', 'Tirosina'], V: ['Val', 'Valina'], '*': ['STOP', 'Fin (codón de terminación)'],
  };
  const CODIGO = {};
  for (let i = 0; i < 64; i++) CODIGO[BASES[i >> 4] + BASES[(i >> 2) & 3] + BASES[i & 3]] = AA_1[i];
  const COMP_ARN = { A: 'U', T: 'A', C: 'G', G: 'C' }; // base del ADN molde → base del ARN
  const MOLDE = { A: 'T', U: 'A', C: 'G', G: 'C' };    // base del ARN → base del ADN molde
  const COLOR_BASE = { A: '#ff6b6b', T: '#ffd166', U: '#ffa94d', C: '#5cc8ff', G: '#2fd186' };

  // ---------- Enzimas ----------
  const ENZIMAS = [
    { id: 'catalasa', nombre: 'Catalasa', fuente: 'hígado, papa', reaccion: '2 H₂O₂ → 2 H₂O + O₂', sustrato: 'agua oxigenada', tOpt: 37, pHOpt: 7, cS: '#9ec5ff', cP: '#e7f5ff',
      dato: 'Protege a las células del agua oxigenada, que es tóxica. Es la enzima que hace burbujear el agua oxigenada sobre una herida.' },
    { id: 'amilasa', nombre: 'Amilasa salival', fuente: 'saliva', reaccion: 'almidón → maltosa', sustrato: 'almidón', tOpt: 37, pHOpt: 6.8, cS: '#ffd166', cP: '#ffe8a3',
      dato: 'Empieza la digestión del almidón en la boca. Deja de actuar en el estómago porque allí el pH es muy ácido.' },
    { id: 'pepsina', nombre: 'Pepsina', fuente: 'estómago', reaccion: 'proteínas → péptidos', sustrato: 'proteína', tOpt: 37, pHOpt: 2, cS: '#ff9fb5', cP: '#ffd1dc',
      dato: 'Digiere proteínas en el jugo gástrico, que tiene ácido clorhídrico. Está adaptada a un pH muy ácido.' },
    { id: 'taq', nombre: 'ADN polimerasa Taq', fuente: 'bacteria de aguas termales (Thermus aquaticus)', reaccion: 'nucleótidos → ADN', sustrato: 'nucleótido', tOpt: 72, pHOpt: 8.5, cS: '#2fd186', cP: '#b2f2bb',
      dato: 'Viene de una bacteria que vive en aguas termales. Como resiste el calor se usa en la PCR, la técnica que copia ADN en los laboratorios.' },
  ];
  const VARIABLES = {
    T: { nombre: 'Temperatura', unidad: '°C', min: 0, max: 90 },
    pH: { nombre: 'pH', unidad: '', min: 0, max: 14 },
    S: { nombre: 'Concentración de sustrato', unidad: '%', min: 0, max: 100 },
  };

  // ---------- Laboratorio de reconocimiento ----------
  // Cada muestra se define por su composición; los resultados salen de reglas químicas.
  const MUESTRAS = [
    { id: 'agua', nombre: 'Agua (control)', icono: '💧', color: 'rgba(200, 225, 255, 0.35)', comp: [] },
    { id: 'glucosa', nombre: 'Solución de glucosa', icono: '🧪', color: 'rgba(230, 240, 255, 0.45)', comp: ['reductor'] },
    { id: 'azucar', nombre: 'Azúcar de mesa', icono: '🧂', color: 'rgba(230, 240, 255, 0.45)', comp: ['sacarosa'] },
    { id: 'miel', nombre: 'Miel', icono: '🍯', color: 'rgba(240, 170, 50, 0.8)', comp: ['reductor'] },
    { id: 'jugo', nombre: 'Jugo de naranja', icono: '🍊', color: 'rgba(255, 190, 70, 0.75)', comp: ['reductor', 'sacarosa'] },
    { id: 'papa', nombre: 'Papa rallada', icono: '🥔', color: 'rgba(245, 240, 225, 0.85)', comp: ['almidon'] },
    { id: 'pan', nombre: 'Pan en agua', icono: '🍞', color: 'rgba(235, 215, 180, 0.85)', comp: ['almidon', 'proteina'] },
    { id: 'clara', nombre: 'Clara de huevo', icono: '🥚', color: 'rgba(245, 245, 225, 0.6)', comp: ['proteina'] },
    { id: 'gelatina', nombre: 'Gelatina sin sabor', icono: '🍮', color: 'rgba(250, 235, 200, 0.6)', comp: ['proteina'] },
    { id: 'aceite', nombre: 'Aceite', icono: '🫒', color: 'rgba(240, 200, 60, 0.75)', comp: ['lipido'] },
    { id: 'leche', nombre: 'Leche', icono: '🥛', color: 'rgba(250, 250, 250, 0.95)', comp: ['reductor', 'proteina', 'lipido'] },
    { id: 'mayonesa', nombre: 'Mayonesa', icono: '🥪', color: 'rgba(250, 240, 190, 0.95)', comp: ['lipido', 'proteina'] },
  ];
  const COMPONENTES = {
    almidon: 'Almidón', reductor: 'Azúcares reductores', sacarosa: 'Azúcar no reductor (sacarosa)', proteina: 'Proteínas', lipido: 'Lípidos',
  };
  // Composiciones posibles de la muestra incógnita (todas distinguibles con los ensayos).
  const INCOGNITAS = [['almidon'], ['reductor'], ['sacarosa'], ['proteina'], ['lipido'], ['almidon', 'proteina'], ['reductor', 'proteina'],
    ['sacarosa', 'lipido'], ['proteina', 'lipido'], ['reductor', 'lipido', 'proteina'], ['almidon', 'lipido'], ['sacarosa', 'proteina']];
  const REACTIVOS = [
    { id: 'lugol', nombre: 'Lugol', corto: 'Lugol', busca: 'almidón', color: '#b07a2a', positivo: '#1b1464', negativo: '#c9953a',
      si: 'El lugol se volvió <b>azul oscuro casi negro</b>: hay <b>almidón</b>. El yodo queda atrapado dentro de la hélice de la amilosa.',
      no: 'El lugol quedó <b>amarillo-marrón</b>: no hay almidón.' },
    { id: 'benedict', nombre: 'Benedict + calor', corto: 'Benedict', busca: 'azúcares reductores', color: '#4dabf7', positivo: '#d9480f', negativo: '#4dabf7', calor: true,
      si: 'Apareció un precipitado <b>rojo ladrillo</b> (Cu₂O): hay <b>azúcares reductores</b>. Su grupo carbonilo libre reduce el Cu²⁺ (azul) a Cu⁺.',
      no: 'Siguió <b>azul</b>: no hay azúcares con el carbono anomérico libre.' },
    { id: 'biuret', nombre: 'Biuret', corto: 'Biuret', busca: 'proteínas', color: '#74c0fc', positivo: '#862e9c', negativo: '#74c0fc',
      si: 'Se volvió <b>violeta</b>: hay <b>proteínas</b>. El Cu²⁺ forma un complejo con los enlaces peptídicos.',
      no: 'Quedó <b>celeste</b>: no hay proteínas (o sus enlaces peptídicos se rompieron).' },
    { id: 'sudan', nombre: 'Sudán III', corto: 'Sudán', busca: 'lípidos', color: '#e8590c', positivo: '#e8590c', negativo: '#ffc9c9', capa: true,
      si: 'Se formó una <b>capa roja</b> arriba: hay <b>lípidos</b>. El colorante se disuelve en ellos y, como son menos densos e insolubles en agua, flotan.',
      no: 'El colorante quedó repartido y pálido: no hay lípidos.' },
  ];

  function resultadoEnsayo(comp, reactivo, hidro) {
    const tiene = c => comp.includes(c);
    switch (reactivo) {
      case 'lugol': return tiene('almidon') && !hidro;
      case 'benedict': return tiene('reductor') || (hidro && (tiene('sacarosa') || tiene('almidon')));
      case 'biuret': return tiene('proteina') && !hidro;
      default: return tiene('lipido');
    }
  }
  function notaEnsayo(m, reactivo, hidro, positivo) {
    const tiene = c => m.comp.includes(c);
    if (m.id === 'agua') return 'El agua es el <b>control negativo</b>: muestra cómo se ve un resultado negativo para poder comparar.';
    if (reactivo === 'benedict' && hidro && positivo && !tiene('reductor')) return `La hidrólisis ácida rompió los <b>enlaces glucosídicos</b> ${tiene('sacarosa') ? 'de la sacarosa y liberó glucosa y fructosa' : 'del almidón y liberó glucosas'}, que sí son reductoras.`;
    if (reactivo === 'benedict' && !hidro && tiene('sacarosa') && !tiene('reductor')) return 'La <b>sacarosa</b> no es reductora: la unión glucosa–fructosa usa los dos carbonos anoméricos. Prueba hidrolizarla antes.';
    if (reactivo === 'lugol' && hidro && tiene('almidon')) return 'El almidón se hidrolizó en glucosas: ya no hay hélices de amilosa que retengan el yodo.';
    if (reactivo === 'biuret' && hidro && tiene('proteina')) return 'La hidrólisis rompió los <b>enlaces peptídicos</b>, y el Biuret necesita al menos dos seguidos para dar color.';
    if (reactivo === 'benedict' && m.id === 'leche') return 'La leche tiene <b>lactosa</b>, un disacárido reductor (su glucosa tiene el carbono anomérico libre).';
    if (reactivo === 'biuret' && m.id === 'pan') return 'La harina de trigo tiene <b>gluten</b>, una mezcla de proteínas.';
    if (reactivo === 'biuret' && m.id === 'gelatina') return 'La gelatina es <b>colágeno</b> desnaturalizado: los enlaces peptídicos siguen ahí.';
    if (reactivo === 'biuret' && m.id === 'mayonesa') return 'La yema de huevo aporta proteínas (y lecitina, un fosfolípido emulsionante).';
    if (reactivo === 'sudan' && hidro && positivo) return 'La hidrólisis ácida casi no afecta a los lípidos: siguen tiñéndose.';
    return '';
  }

  // ---------- Clasificar ----------
  const MOLECULAS = [
    { e: '🍖', n: 'Glucógeno', r: 'carbohidratos', x: 'Polisacárido de <b>reserva animal</b> (α-glucosas muy ramificadas) en hígado y músculos.' },
    { e: '🌿', n: 'Celulosa', r: 'carbohidratos', x: 'Polisacárido <b>estructural</b> de la pared vegetal, formado por β-glucosas unidas β(1→4).' },
    { e: '🥔', n: 'Almidón', r: 'carbohidratos', x: 'Polisacárido de <b>reserva vegetal</b>: mezcla de amilosa y amilopectina.' },
    { e: '🦗', n: 'Quitina', r: 'carbohidratos', x: 'Polisacárido del <b>exoesqueleto de los artrópodos</b> y de la pared de los hongos.' },
    { e: '🔗', n: 'Ribosa', r: 'carbohidratos', x: 'Monosacárido de 5 carbonos (<b>pentosa</b>) que forma parte del ARN y del ATP.' },
    { e: '🍬', n: 'Sacarosa', r: 'carbohidratos', x: 'Disacárido (glucosa + fructosa), <b>no reductor</b>: el azúcar de mesa.' },
    { e: '🧫', n: 'Colesterol', r: 'lipidos', x: 'Lípido <b>esteroide</b>: da estabilidad a las membranas animales y es precursor de hormonas.' },
    { e: '🫧', n: 'Fosfolípido', r: 'lipidos', x: 'Lípido <b>anfipático</b>: forma la bicapa de todas las membranas celulares.' },
    { e: '💪', n: 'Testosterona', r: 'lipidos', x: 'Hormona <b>esteroide</b>, derivada del colesterol.' },
    { e: '🐝', n: 'Cera de abeja', r: 'lipidos', x: 'Éster de ácido graso y alcohol de cadena larga: <b>impermeabiliza</b>.' },
    { e: '🧈', n: 'Triglicérido', r: 'lipidos', x: '<b>Reserva de energía</b> en el tejido adiposo (glicerol + 3 ácidos grasos).' },
    { e: '☀️', n: 'Vitamina D', r: 'lipidos', x: 'Lípido esteroide que ayuda a absorber el calcio. La piel la fabrica con la luz del sol.' },
    { e: '🩸', n: 'Hemoglobina', r: 'proteinas', x: 'Proteína <b>transportadora de O₂</b> con estructura cuaternaria (4 cadenas).' },
    { e: '💉', n: 'Insulina', r: 'proteinas', x: 'Hormona proteica que <b>baja la glucosa</b> en sangre.' },
    { e: '💇', n: 'Queratina', r: 'proteinas', x: 'Proteína <b>estructural</b> de pelo y uñas, rica en puentes disulfuro (cisteína).' },
    { e: '🦴', n: 'Colágeno', r: 'proteinas', x: 'La proteína más abundante del cuerpo: resistencia de tendones, huesos y piel.' },
    { e: '🛡️', n: 'Anticuerpo', r: 'proteinas', x: 'Proteína de <b>defensa</b> que reconoce antígenos específicos.' },
    { e: '✂️', n: 'Amilasa', r: 'proteinas', x: 'Una <b>enzima</b>: casi todas las enzimas son proteínas. Hidroliza el almidón.' },
    { e: '🧬', n: 'ADN', r: 'nucleicos', x: 'Guarda la <b>información genética</b>. Doble hélice de desoxirribonucleótidos.' },
    { e: '📨', n: 'ARN mensajero', r: 'nucleicos', x: 'Copia de un gen que lleva la información <b>del núcleo al ribosoma</b>.' },
    { e: '🚚', n: 'ARN de transferencia', r: 'nucleicos', x: 'Lleva cada <b>aminoácido</b> al ribosoma; su anticodón reconoce al codón.' },
    { e: '⚡', n: 'ATP', r: 'nucleicos', x: 'Es un <b>nucleótido</b> (adenina + ribosa + 3 fosfatos): la "moneda de energía" de la célula.' },
  ];
  const ALIMENTOS = [
    { e: '🍞', n: 'Pan', r: 'carbohidratos', x: 'Está hecho de harina, rica en <b>almidón</b>.' },
    { e: '🍚', n: 'Arroz', r: 'carbohidratos', x: 'Casi todo es <b>almidón</b>.' },
    { e: '🥔', n: 'Papa', r: 'carbohidratos', x: 'Guarda su energía como <b>almidón</b>.' },
    { e: '🍝', n: 'Fideos', r: 'carbohidratos', x: 'Se hacen con harina: mucho <b>almidón</b>.' },
    { e: '🍯', n: 'Miel', r: 'carbohidratos', x: 'Es casi pura <b>glucosa y fructosa</b>.' },
    { e: '🍌', n: 'Banana', r: 'carbohidratos', x: 'Tiene azúcares y almidón.' },
    { e: '🫒', n: 'Aceite de oliva', r: 'lipidos', x: 'Rico en ácido oleico, <b>insaturado cis</b>: líquido a temperatura ambiente.' },
    { e: '🧈', n: 'Manteca', r: 'lipidos', x: 'Grasa con muchos ácidos grasos <b>saturados</b>: sólida a temperatura ambiente.' },
    { e: '🥑', n: 'Palta', r: 'lipidos', x: 'Es una fruta muy rica en <b>grasas insaturadas</b>.' },
    { e: '🥜', n: 'Maní', r: 'lipidos', x: 'Tiene mucha grasa (y también bastante proteína).' },
    { e: '🥩', n: 'Carne', r: 'proteinas', x: 'El músculo está formado sobre todo por <b>proteínas</b> (actina y miosina).' },
    { e: '🍗', n: 'Pollo', r: 'proteinas', x: 'Rico en <b>proteínas</b>.' },
    { e: '🐟', n: 'Pescado', r: 'proteinas', x: 'Aporta <b>proteínas</b> y grasas omega 3.' },
    { e: '🥚', n: 'Clara de huevo', r: 'proteinas', x: 'Es casi pura <b>proteína</b> (albúmina) y agua.' },
  ];
  const GRUPOS = {
    moleculas: { carbohidratos: '🍞 Carbohidratos', lipidos: '🧈 Lípidos', proteinas: '🥩 Proteínas', nucleicos: '🧬 Ácidos nucleicos' },
    alimentos: { carbohidratos: '🍞 Carbohidratos', lipidos: '🧈 Lípidos', proteinas: '🥩 Proteínas' },
  };

  // ---------- Estado ----------
  let raiz, modo = 'armar', tipo = 'carbohidratos';
  let cadena = [], ramas = 0, nivel = 'primaria', saponificado = false, complementaria = null, girar = false, fase = 0, animGiro = null;
  let tubo = null, resultados = {}, hidrolizar = false, incognita = null;
  let juego = null, conjunto = 'moleculas';
  let gen = null;
  let enz = null, animEnz = null;

  function iniciar(el) {
    raiz = el;
    raiz.innerHTML = `
      <div class="encabezado-modulo">
        <h1>🧬 Biomoléculas</h1>
        <p>Las moléculas de la vida: <b>carbohidratos, lípidos, proteínas y ácidos nucleicos</b>. Ármalas, sigue el camino del gen a la proteína, experimenta con enzimas y reconócelas en el laboratorio.</p>
      </div>
      <div class="segmentado" id="bm-modos">
        <button data-m="armar">🧩 Armar</button>
        <button data-m="gen">🧬 Del gen a la proteína</button>
        <button data-m="enzimas">⚗️ Enzimas</button>
        <button data-m="reconocer">🧪 Laboratorio</button>
        <button data-m="clasificar">🗂️ Clasificar</button>
      </div>
      <div id="bm-vista"></div>`;
    raiz.querySelectorAll('#bm-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.m)));
    cambiarModo('armar');
  }

  function cambiarModo(m) {
    modo = m;
    cancelAnimationFrame(animGiro);
    cancelAnimationFrame(animEnz);
    girar = false;
    raiz.querySelectorAll('#bm-modos button').forEach(b => b.classList.toggle('activo', b.dataset.m === m));
    ({ armar: vistaArmar, gen: vistaGen, enzimas: vistaEnzimas, reconocer: vistaReconocer, clasificar: vistaClasificar })[m]();
  }

  function avisar(html, error) {
    const a = raiz.querySelector('#bm-aviso');
    if (!a) return;
    a.innerHTML = html;
    a.className = 'bm-aviso' + (error ? ' error' : '');
  }

  // =====================================================================
  // ARMAR
  // =====================================================================

  function vistaArmar() {
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="bm-tipos" id="bm-tipos">
        ${Object.entries(TIPOS).map(([k, t]) => `<button data-t="${k}">${t.icono} ${t.nombre}</button>`).join('')}
      </div>
      <div class="bm-grid">
        <div class="panel bm-mesa">
          <svg id="bm-svg" viewBox="0 0 760 300" role="img" aria-label="Mesa para armar biomoléculas">
            <defs><radialGradient id="bm-fondo" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="#23266b"/><stop offset="1" stop-color="#0e1033"/></radialGradient></defs>
            <rect width="760" height="300" fill="url(#bm-fondo)"/>
            <g id="bm-enlaces"></g><g id="bm-extra"></g><g id="bm-piezas"></g><g id="bm-efectos"></g><g id="bm-helice"></g>
          </svg>
          <div class="bm-leyenda" id="bm-leyenda"></div>
          <div class="bm-botonera" id="bm-botonera"></div>
          <div class="bm-acciones" id="bm-acciones"></div>
        </div>
        <aside class="panel bm-info" id="bm-info"></aside>
      </div>`;
    raiz.querySelectorAll('#bm-tipos button').forEach(b => b.addEventListener('click', () => elegirTipo(b.dataset.t)));
    elegirTipo(tipo);
  }

  function elegirTipo(t) {
    tipo = t;
    cadena = [];
    ramas = 0;
    nivel = 'primaria';
    saponificado = false;
    complementaria = null;
    girar = false;
    cancelAnimationFrame(animGiro);
    raiz.querySelector('#bm-helice').innerHTML = '';
    ['#bm-piezas', '#bm-enlaces', '#bm-efectos', '#bm-extra'].forEach(sel => {
      const capa = raiz.querySelector(sel);
      capa.style.opacity = '';
      capa.innerHTML = '';
    });
    raiz.querySelectorAll('#bm-tipos button').forEach(b => b.classList.toggle('activo', b.dataset.t === t));
    raiz.querySelector('#bm-botonera').innerHTML = TIPOS[t].piezas.map(p => `
      <button class="bm-pieza-btn" data-p="${p.id}">
        <svg viewBox="-30 -30 60 60" width="34" height="34" aria-hidden="true">${miniatura(p)}</svg>
        <span>${p.nombre}</span>
      </button>`).join('');
    raiz.querySelectorAll('.bm-pieza-btn').forEach(b => b.addEventListener('click', () => agregar(b.dataset.p)));
    raiz.querySelector('#bm-leyenda').innerHTML = t === 'proteinas'
      ? Object.values(CLASES_AA).map(c => `<span><i style="background:${c.c[0]}"></i>${c.nombre}</span>`).join('')
      : '';
    actualizarArmar();
  }

  function miniatura(p) {
    if (tipo === 'lipidos') {
      if (p.id === 'gli') return '<rect x="-12" y="-24" width="24" height="48" rx="8" fill="#b197fc"/><rect x="0" y="-24" width="12" height="48" fill="#9775fa"/>';
      if (p.id === 'fos') return '<line x1="-14" y1="0" x2="14" y2="0" stroke="#c9ccf5" stroke-width="4"/><circle cx="-12" r="11" fill="#ff9f43"/><circle cx="13" r="11" fill="#5cc8ff"/>';
      const pts = p.cis
        ? (p.dobles.length > 1 ? '-26,-12 -18,-4 -10,-12 -4,-2 0,8 8,14 12,24' : '-26,-8 -18,0 -10,-8 -2,0 4,10 12,16 18,26')
        : '-26,4 -18,-4 -10,4 -2,-4 6,4 14,-4 22,4';
      return `<polyline points="${pts}" fill="none" stroke="${p.color}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    if (tipo === 'adn') return `<g transform="translate(0 -6) scale(0.8)">${nucleotido(p.id)}</g>`;
    return p.dibujo() + brillo(20) + etiqueta(p.corto, '#15163d', p.corto.length > 3 ? 'chica' : '');
  }

  function nucleotido(base, abajo = false) {
    const pz = pieza('adn', base);
    const s = abajo ? -1 : 1;
    const purina = base === 'A' || base === 'G';
    const alto = purina ? 30 : 22;
    const y0 = abajo ? -6 - alto : 6;
    return `<g>
      <circle cx="-14" cy="${-10 * s}" r="6" fill="#ffe8a3"/><text x="-14" y="${-10 * s + 3}" text-anchor="middle" class="bm-letra mini" fill="#15163d">P</text>
      <g transform="translate(0 ${-6 * s})">${pentagono(11, '#b197fc', '#9775fa')}</g>
      <rect x="-8" y="${y0}" width="16" height="${alto}" rx="5" fill="${pz.color[0]}"/>
      <rect x="0" y="${y0}" width="8" height="${alto}" fill="${pz.color[1]}"/>
      <text y="${y0 + alto / 2 + 4}" text-anchor="middle" class="bm-letra" fill="#15163d">${base}</text></g>`;
  }

  // Posición de cada pieza en la mesa.
  const SLOT_Y = [60, 140, 220];
  function espaciado(n, max) { return n > 1 ? Math.min(max, 640 / (n - 1)) : 0; }
  function posicion(i, n) {
    if (tipo === 'adn') { const d = espaciado(n, 72); return { x: 380 - (n - 1) * d / 2 + i * d, y: 100 }; }
    if (tipo === 'carbohidratos') { const d = espaciado(n, 66); return { x: 380 - (n - 1) * d / 2 + i * d, y: ramas ? 90 : 150 }; }
    if (tipo === 'lipidos') return i === 0 ? { x: 150, y: 140 } : { x: saponificado ? 240 : 150, y: SLOT_Y[i - 1] };
    if (nivel === 'secundaria') {
      const d = espaciado(n, 42);
      return { x: 380 - (n - 1) * d / 2 + i * d, y: 150 - 55 * Math.cos(rad(i * 100)) };
    }
    if (nivel === 'terciaria') {
      const clase = k => pieza('proteinas', cadena[k]).clase;
      const apolares = cadena.map((_, k) => k).filter(k => clase(k) === 'apolar');
      const otros = cadena.map((_, k) => k).filter(k => clase(k) !== 'apolar');
      const a = apolares.indexOf(i);
      if (a >= 0) {
        const r = 17 * Math.sqrt(a + 0.3), ang = a * 2.4;
        return { x: 380 + r * Math.cos(ang) * 1.3, y: 150 + r * Math.sin(ang) };
      }
      const j = otros.indexOf(i), m = otros.length;
      const ang = j / m * Math.PI * 2 + 0.4, R = 92 + (j % 2) * 10;
      return { x: 380 + R * 1.4 * Math.cos(ang), y: 150 + R * Math.sin(ang) };
    }
    const porFila = 9, fila = Math.floor(i / porFila), col = i % porFila;
    const x = fila % 2 === 0 ? 100 + col * 70 : 100 + (porFila - 1 - col) * 70;
    return { x, y: n > porFila ? 95 + fila * 110 : 150 };
  }

  // Unidades de glucosa que forman ramificaciones α(1→6).
  const puntosRama = n => ramas === 0 ? [] : ramas === 1 ? [Math.floor(n / 2)] : [1, 4, 7].filter(k => k < n - 1);
  const unidades = () => cadena.length + (tipo === 'carbohidratos' ? puntosRama(cadena.length).length * 2 : 0);
  function aguasLiberadas() {
    if (tipo === 'lipidos') return saponificado ? 0 : Math.max(0, cadena.length - 1);
    return Math.max(0, unidades() - 1);
  }

  function agregar(id) {
    const T = TIPOS[tipo];
    if (complementaria) return;
    if (tipo === 'lipidos') {
      if (saponificado) return avisar('Ya saponificaste la grasa. Toca <b>Empezar de nuevo</b> para armar otra.');
      if (!cadena.length && id !== 'gli') return avisar('Primero necesitas un <b>glicerol</b> (propanotriol): sus 3 grupos OH son los que se esterifican.');
      if (cadena.length && id === 'gli') return avisar('Cada acilglicérido tiene un solo glicerol.');
      if (cadena.length >= 4) return avisar('El glicerol solo tiene <b>3 grupos OH</b> para esterificar.');
      if (id === 'fos' && cadena.includes('fos')) return avisar('Un fosfolípido tiene un solo grupo fosfato.');
    } else if (cadena.length >= T.max) {
      return avisar(`¡Cadena completa! En la realidad pueden tener ${tipo === 'adn' ? 'millones de nucleótidos' : 'cientos o miles de unidades'}.`);
    }
    if (tipo === 'proteinas' && nivel !== 'primaria') return avisar('Los aminoácidos se agregan a la cadena lineal (en el ribosoma). Desnaturaliza la proteína para seguir.');
    if (tipo === 'carbohidratos' && ramas) return avisar('Primero quita las ramificaciones (con hidrólisis) para seguir alargando la cadena principal.');
    cadena.push(id);
    if (cadena.length > 1) {
      const n = cadena.length, a = posicion(n - 2, n), b = posicion(n - 1, n);
      efectoAgua(tipo === 'lipidos' ? { x: 200, y: b.y } : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, 'sale');
    }
    actualizarArmar(true);
  }

  function hidrolisis() {
    if (!cadena.length || complementaria || saponificado) return;
    if (tipo === 'proteinas' && nivel !== 'primaria') return avisar('Primero desnaturaliza la proteína.');
    if (tipo === 'carbohidratos' && ramas) {
      const p = posicion(puntosRama(cadena.length)[0], cadena.length);
      efectoAgua({ x: p.x, y: p.y + 36 }, 'entra');
      ramas--;
      avisar('💧 La hidrólisis rompió enlaces <b>α(1→6)</b>: se desprendieron ramificaciones.');
      return actualizarArmar();
    }
    if (cadena.length > 1) {
      const n = cadena.length, a = posicion(n - 2, n), b = posicion(n - 1, n);
      efectoAgua(tipo === 'lipidos' ? { x: 200, y: b.y } : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, 'entra');
    }
    const g = raiz.querySelector(`#bm-piezas [data-i="${cadena.length - 1}"]`);
    if (g) g.classList.add('sale');
    cadena.pop();
    setTimeout(() => actualizarArmar(), 350);
  }

  function efectoAgua(p, sentido, texto = 'H₂O') {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${p.x} ${p.y})`);
    g.innerHTML = `<g class="bm-agua ${sentido}">${agua}<text y="24" text-anchor="middle" class="bm-agua-txt">${texto}</text></g>`;
    raiz.querySelector('#bm-efectos').appendChild(g);
    setTimeout(() => g.remove(), 1600);
  }

  function actualizarArmar(nueva) {
    const capa = raiz.querySelector('#bm-piezas');
    const n = cadena.length;
    [...capa.children].forEach(g => { if (+g.dataset.i >= n) g.remove(); });
    cadena.forEach((id, i) => {
      let g = capa.querySelector(`[data-i="${i}"]`);
      const pos = posicion(i, n);
      if (!g) {
        g = document.createElementNS(NS, 'g');
        g.dataset.i = i;
        g.setAttribute('class', 'bm-pieza' + (nueva && i === n - 1 ? ' nueva' : ''));
        g.innerHTML = `<g class="bm-pieza-int">${dibujoPieza(id, i)}</g>`;
        capa.appendChild(g);
      }
      g.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      g.style.opacity = tipo === 'proteinas' && nivel === 'secundaria' && Math.sin(rad(i * 100)) < 0 ? 0.55 : '';
    });
    if (tipo === 'proteinas' && nivel !== 'primaria') {
      raiz.querySelector('#bm-enlaces').innerHTML = '';
      setTimeout(dibujarEnlaces, 720);
    } else dibujarEnlaces();
    dibujarRamas();
    dibujarComplementaria();
    pintarAcciones();
    pintarInfo();
  }

  // Cadena de un ácido graso: zigzag de carbonos; los enlaces dobles cis la doblan.
  function acidoGraso(p, dir) {
    let bx = 30, by = 0, th = 0;
    const pts = [];
    for (let k = 1; k <= p.C; k++) {
      if (k > 1) { bx += 11 * Math.cos(th); by += 11 * Math.sin(th); }
      const z = k % 2 ? -5 : 5;
      pts.push([bx - z * Math.sin(th), by + z * Math.cos(th)]);
      if (p.cis && p.dobles.includes(k)) th += dir * 0.33;
    }
    const dobles = p.dobles.map(k => {
      const [a, b] = [pts[k - 1], pts[k]];
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 4, ny = dx / L * 4;
      return `<line x1="${(a[0] + dx * 0.2 + nx).toFixed(1)}" y1="${(a[1] + dy * 0.2 + ny).toFixed(1)}" x2="${(b[0] - dx * 0.2 + nx).toFixed(1)}" y2="${(b[1] - dy * 0.2 + ny).toFixed(1)}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
    }).join('');
    const fin = pts[pts.length - 1];
    return `<polyline points="${pts.map(q => q.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${p.color}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
      ${dobles}
      <circle cx="${pts[0][0]}" cy="${pts[0][1] - 10}" r="4" fill="#ff6b6b"/>
      <circle cx="22" cy="0" r="6.5" fill="#ff6b6b"/>
      <text x="${(fin[0] + 10).toFixed(1)}" y="${(fin[1] + 4).toFixed(1)}" class="bm-letra chica" fill="#c9ccf5">${p.corto}</text>`;
  }

  function dibujoPieza(id, i) {
    const p = pieza(tipo, id);
    if (tipo === 'adn') return nucleotido(id);
    if (tipo === 'lipidos') {
      if (id === 'gli') return `<rect x="-18" y="-95" width="36" height="190" rx="14" fill="#b197fc"/><rect x="0" y="-95" width="18" height="190" fill="#9775fa"/>
        ${brillo(30)}<text y="4" text-anchor="middle" transform="rotate(-90)" class="bm-letra" fill="#15163d">GLICEROL</text>`;
      if (id === 'fos') return `<line x1="18" y1="0" x2="80" y2="0" stroke="#c9ccf5" stroke-width="4"/>
        <circle cx="22" cy="0" r="6.5" fill="#ff6b6b"/>
        <g transform="translate(46 0)">${circulo(15, '#ff9f43', '#e07a1f')}${etiqueta('P')}</g>
        <g transform="translate(86 0)">${circulo(15, '#5cc8ff', '#3aa0d8')}${etiqueta('N⁺')}</g>
        <text x="110" y="4" class="bm-letra chica" fill="#c9ccf5">cabeza polar (hidrófila)</text>`;
      return acidoGraso(p, i === 3 ? 1 : -1); // la cadena de abajo se dobla hacia abajo y las otras hacia arriba
    }
    return p.dibujo() + brillo(22) + etiqueta(p.corto);
  }

  function enlaceCarb(a, b) {
    if (a === 'fru' || b === 'fru') return (a === 'aglc' || b === 'aglc') ? 'α(1→2)β' : 'β(2→1)';
    return a === 'aglc' ? 'α(1→4)' : 'β(1→4)';
  }

  function dibujarEnlaces() {
    const n = cadena.length;
    let svg = '';
    if (tipo === 'lipidos') {
      if (!saponificado) {
        for (let i = 1; i < n; i++) svg += `<line x1="150" y1="${SLOT_Y[i - 1]}" x2="172" y2="${SLOT_Y[i - 1]}" class="bm-enlace"/>`;
      } else {
        svg += SLOT_Y.map(y => `<text x="172" y="${y + 4}" class="bm-letra" fill="#ff8787">OH</text>
          <text x="248" y="${y - 12}" class="bm-letra chica" fill="#9ec5ff">COO⁻ Na⁺</text>`).join('');
      }
    } else if (tipo === 'proteinas' && nivel !== 'primaria') {
      const pts = cadena.map((_, i) => posicion(i, n));
      svg = `<polyline points="${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" class="bm-enlace plegada"/>`;
      if (nivel === 'secundaria') {
        for (let i = 0; i + 4 < n; i++) svg += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[i + 4].x.toFixed(1)}" y2="${pts[i + 4].y.toFixed(1)}" class="bm-puente"/>`;
      } else {
        const ap = cadena.filter(c => pieza('proteinas', c).clase === 'apolar').length;
        if (ap >= 2) svg = `<ellipse cx="380" cy="150" rx="${30 + ap * 7}" ry="${22 + ap * 5}" fill="#ffd166" opacity="0.13"/>
          <text x="380" y="${150 + 30 + ap * 5}" text-anchor="middle" class="bm-letra chica" fill="#ffe8a3">núcleo hidrofóbico</text>` + svg;
        interacciones().forEach(({ a, b, tipo: t }) => {
          const [p, q] = [pts[a], pts[b]];
          svg += t === 'ss'
            ? `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" class="bm-disulfuro"/><text x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2 - 5}" text-anchor="middle" class="bm-letra chica" fill="#ffe066">S–S</text>`
            : `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" class="bm-salino"/><text x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2 - 5}" text-anchor="middle" class="bm-letra chica" fill="#e599f7">+ −</text>`;
        });
      }
    } else {
      for (let i = 1; i < n; i++) {
        const a = posicion(i - 1, n), b = posicion(i, n);
        const ya = tipo === 'adn' ? a.y - 10 : a.y, yb = tipo === 'adn' ? b.y - 10 : b.y;
        svg += `<line x1="${a.x}" y1="${ya}" x2="${b.x}" y2="${yb}" class="bm-enlace"/>`;
        if (tipo === 'carbohidratos') svg += `<text x="${(a.x + b.x) / 2}" y="${a.y - 30}" text-anchor="middle" class="bm-letra chica" fill="#c9ccf5">${enlaceCarb(cadena[i - 1], cadena[i])}</text>`;
      }
      if (tipo === 'proteinas' && n) {
        const p0 = posicion(0, n), pf = posicion(n - 1, n);
        svg += `<text x="${p0.x - 26}" y="${p0.y + 4}" text-anchor="end" class="bm-letra" fill="#9ec5ff">H₂N–</text>
          <text x="${pf.x + (n > 9 ? -26 : 26)}" y="${pf.y + 4}" text-anchor="${n > 9 ? 'end' : 'start'}" class="bm-letra" fill="#ff8787">–COOH</text>`;
      }
      if (tipo === 'adn' && n) {
        const p0 = posicion(0, n), pf = posicion(n - 1, n);
        svg += `<text x="${p0.x - 30}" y="${p0.y - 6}" text-anchor="end" class="bm-letra" fill="#ffe8a3">5'</text><text x="${pf.x + 26}" y="${pf.y - 6}" class="bm-letra" fill="#ffe8a3">3'</text>`;
        if (complementaria) svg += `<text x="${p0.x - 30}" y="230" text-anchor="end" class="bm-letra" fill="#ffe8a3">3'</text><text x="${pf.x + 26}" y="230" class="bm-letra" fill="#ffe8a3">5'</text>`;
      }
    }
    raiz.querySelector('#bm-enlaces').innerHTML = svg;
  }

  // Puentes disulfuro entre cisteínas y puentes salinos entre Asp (−) y Lys (+).
  function interacciones() {
    const idx = c => cadena.map((x, i) => x === c ? i : -1).filter(i => i >= 0);
    const res = [];
    const cys = idx('cys');
    for (let k = 0; k + 1 < cys.length; k += 2) res.push({ a: cys[k], b: cys[k + 1], tipo: 'ss' });
    const asp = idx('asp'), lys = idx('lys');
    for (let k = 0; k < Math.min(asp.length, lys.length); k++) res.push({ a: asp[k], b: lys[lys.length - 1 - k], tipo: 'salino' });
    return res;
  }

  function dibujarRamas() {
    const capa = raiz.querySelector('#bm-extra');
    if (tipo !== 'carbohidratos' || !ramas) { capa.innerHTML = ''; return; }
    const n = cadena.length, d = espaciado(n, 66);
    const glc = pieza('carbohidratos', 'aglc').dibujo() + brillo(22);
    capa.innerHTML = puntosRama(n).map(k => {
      const p = posicion(k, n), y = p.y + 80;
      return `<line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${y}" class="bm-enlace"/><line x1="${p.x}" y1="${y}" x2="${p.x + d}" y2="${y}" class="bm-enlace"/>
        <text x="${p.x - 6}" y="${p.y + 44}" text-anchor="end" class="bm-letra chica" fill="#ffe066">α(1→6)</text>
        <text x="${p.x + d / 2}" y="${y + 36}" text-anchor="middle" class="bm-letra chica" fill="#c9ccf5">α(1→4)</text>
        <g class="bm-pieza" transform="translate(${p.x} ${y})">${glc}${etiqueta('α-Glc')}</g>
        <g class="bm-pieza" transform="translate(${p.x + d} ${y})">${glc}${etiqueta('α-Glc')}</g>`;
    }).join('');
  }

  // ADN: la hebra complementaria (antiparalela) que completa el estudiante.
  function dibujarComplementaria() {
    const capa = raiz.querySelector('#bm-efectos');
    capa.querySelectorAll('.bm-comp').forEach(e => e.remove());
    if (!complementaria) return;
    const n = cadena.length;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'bm-comp');
    let svg = '';
    cadena.forEach((b, i) => {
      const p = posicion(i, n), yb = 220;
      const c = complementaria[i];
      if (c) {
        const enlacesH = (b === 'A' || b === 'T') ? 2 : 3;
        svg += `<g class="bm-par">
          ${Array.from({ length: enlacesH }, (_, k) => `<line x1="${p.x - 5 + k * 5}" y1="${(b === 'A' || b === 'G') ? 138 : 130}" x2="${p.x - 5 + k * 5}" y2="${(c === 'A' || c === 'G') ? 182 : 190}" class="bm-puente"/>`).join('')}
          <g transform="translate(${p.x} ${yb})">${nucleotido(c, true)}</g></g>`;
      } else {
        svg += `<g transform="translate(${p.x} ${yb})"><rect x="-12" y="-36" width="24" height="32" rx="6" class="bm-hueco ${i === complementaria.length ? 'actual' : ''}"/><text y="-15" text-anchor="middle" class="bm-letra" fill="#9aa3ff">?</text></g>`;
      }
    });
    if (complementaria.filter(Boolean).length > 1) {
      const xs = complementaria.map((c, i) => c ? posicion(i, n).x : null).filter(x => x !== null);
      svg = `<line x1="${xs[0]}" y1="226" x2="${xs[xs.length - 1]}" y2="226" class="bm-enlace"/>` + svg;
    }
    g.innerHTML = svg;
    capa.appendChild(g);
  }

  function pintarAcciones() {
    const n = cadena.length;
    let html = `<button class="btn chico" id="bm-hidro" ${n && !complementaria && !saponificado ? '' : 'disabled'}>💧 Hidrólisis</button>
      <button class="btn chico" id="bm-vaciar" ${n ? '' : 'disabled'}>↺ Empezar de nuevo</button>`;
    const todasAlfa = n >= 8 && cadena.every(c => c === 'aglc');
    if (tipo === 'carbohidratos') html += `<button class="btn chico primario" id="bm-ramificar" ${todasAlfa && ramas < 2 ? '' : 'disabled'}>🌿 Ramificar α(1→6)</button>`;
    if (tipo === 'proteinas') {
      html += `<button class="btn chico ${nivel === 'primaria' ? 'primario' : ''}" id="bm-sec" ${n >= 5 && nivel === 'primaria' ? '' : 'disabled'}>🌀 Hélice α</button>
        <button class="btn chico ${nivel === 'secundaria' ? 'primario' : ''}" id="bm-ter" ${n >= 8 && nivel !== 'terciaria' ? '' : 'disabled'}>🧶 Plegar (terciaria)</button>
        <button class="btn chico" id="bm-desn" ${nivel !== 'primaria' ? '' : 'disabled'}>🔥 Desnaturalizar</button>`;
    }
    if (tipo === 'lipidos') {
      const tri = n === 4 && !cadena.includes('fos');
      html += `<button class="btn chico primario" id="bm-sapo" ${tri && !saponificado ? '' : 'disabled'}>🧼 Saponificar (+3 NaOH)</button>`;
    }
    if (tipo === 'adn') {
      html += complementaria
        ? `<span class="bm-teclas">Base complementaria: ${['A', 'T', 'C', 'G'].map(b => `<button class="bm-tecla" data-b="${b}" style="--c:${pieza('adn', b).color[0]}">${b}</button>`).join('')}</span>
           <button class="btn chico" id="bm-girar" ${complementaria.length === cadena.length ? '' : 'disabled'}>${girar ? '⏸ Detener' : '🔄 Girar la doble hélice'}</button>`
        : `<button class="btn chico primario" id="bm-doble" ${n >= 4 ? '' : 'disabled'}>🧬 Formar la doble hélice</button>`;
    }
    const cont = raiz.querySelector('#bm-acciones');
    cont.innerHTML = html;
    cont.querySelector('#bm-hidro').addEventListener('click', hidrolisis);
    cont.querySelector('#bm-vaciar').addEventListener('click', () => elegirTipo(tipo));
    cont.querySelector('#bm-ramificar')?.addEventListener('click', () => {
      ramas++;
      const k = puntosRama(cadena.length);
      k.forEach(i => { const p = posicion(i, cadena.length); efectoAgua({ x: p.x + 20, y: p.y + 50 }, 'sale'); });
      avisar(ramas === 1
        ? '🌿 Se unió una rama con un enlace <b>α(1→6)</b>: así se forma la <b>amilopectina</b> del almidón.'
        : '🌿 Muchas más ramas: con ramificaciones cada pocas glucosas se obtiene <b>glucógeno</b>, que se degrada rápido porque tiene muchos extremos.');
      actualizarArmar();
    });
    cont.querySelector('#bm-sec')?.addEventListener('click', () => { nivel = 'secundaria'; actualizarArmar(); });
    cont.querySelector('#bm-ter')?.addEventListener('click', () => { nivel = 'terciaria'; actualizarArmar(); });
    cont.querySelector('#bm-desn')?.addEventListener('click', () => {
      nivel = 'primaria';
      actualizarArmar();
      avisar('🔥 El calor rompió los puentes de hidrógeno y las demás interacciones débiles: se perdieron las estructuras secundaria y terciaria. La <b>primaria se conserva</b> porque los enlaces peptídicos son covalentes.');
    });
    cont.querySelector('#bm-sapo')?.addEventListener('click', () => {
      saponificado = true;
      SLOT_Y.forEach(y => efectoAgua({ x: 200, y }, 'entra', 'NaOH'));
      actualizarArmar();
      avisar('🧼 <b>Saponificación</b>: la base (NaOH) rompe los enlaces éster. Se obtiene <b>glicerol y 3 jabones</b> (sales de ácidos grasos). El jabón es anfipático: su cola atrapa la grasa y su cabeza iónica se disuelve en agua.');
    });
    cont.querySelector('#bm-doble')?.addEventListener('click', () => { complementaria = []; actualizarArmar(); });
    cont.querySelectorAll('.bm-tecla').forEach(b => b.addEventListener('click', () => ponerBase(b.dataset.b)));
    cont.querySelector('#bm-girar')?.addEventListener('click', () => { girar = !girar; girar ? animarHelice() : detenerHelice(); pintarAcciones(); });
  }

  function ponerBase(b) {
    const i = complementaria.length;
    if (i >= cadena.length) return;
    if (PAR[cadena[i]] !== b) {
      avisar(`✖ Frente a <b>${cadena[i]}</b> no va <b>${b}</b>. Una purina (A, G) siempre se aparea con una pirimidina (T, C): <b>A=T</b> y <b>C≡G</b>.`, true);
      return;
    }
    complementaria.push(b);
    actualizarArmar();
    if (complementaria.length === cadena.length) avisar('🎉 ¡Doble hélice completa! Las hebras son <b>antiparalelas</b> (una va 5\'→3\' y la otra 3\'→5\') y se unen por <b>puentes de hidrógeno</b>: 2 entre A y T, 3 entre C y G.');
  }

  // Rotación de la doble hélice: las dos hebras se dibujan como curvas que se entrelazan.
  function animarHelice() {
    const n = cadena.length;
    const x0 = posicion(0, n).x, dx = posicion(1, n).x - x0, amp = 62, yc = 160;
    ['#bm-piezas', '#bm-enlaces', '#bm-efectos'].forEach(sel => { raiz.querySelector(sel).style.opacity = 0; });
    const colorDe = b => pieza('adn', b).color[0];
    const paso = () => {
      fase += 0.025;
      const ang = x => fase + ((x - x0) / 72) * 0.8;
      const hebra = sgn => {
        let d = '';
        for (let x = x0 - 30; x <= x0 + (n - 1) * dx + 30; x += 5) d += `${d ? ' L' : 'M'}${x.toFixed(1)},${(yc - sgn * amp * Math.cos(ang(x))).toFixed(1)}`;
        return d;
      };
      let svg = `<path d="${hebra(-1)}" class="bm-hebra atras"/>`;
      cadena.forEach((b, i) => {
        const x = x0 + i * dx, c = Math.cos(ang(x));
        const y1 = yc - amp * c, y2 = yc + amp * c;
        const frente = Math.sin(ang(x)) > 0 ? 1 : 0.55;
        svg += `<g opacity="${frente}">
          <line x1="${x}" y1="${y1.toFixed(1)}" x2="${x}" y2="${yc}" stroke="${colorDe(b)}" stroke-width="9" stroke-linecap="round"/>
          <line x1="${x}" y1="${yc}" x2="${x}" y2="${y2.toFixed(1)}" stroke="${colorDe(complementaria[i])}" stroke-width="9" stroke-linecap="round"/>
          ${Math.abs(c) > 0.35 ? `<text x="${x + 10}" y="${(y1 + (c > 0 ? 16 : -8)).toFixed(1)}" class="bm-letra" fill="#e9ebff">${b}</text>
          <text x="${x + 10}" y="${(y2 + (c > 0 ? -8 : 16)).toFixed(1)}" class="bm-letra" fill="#e9ebff">${complementaria[i]}</text>` : ''}
          <circle cx="${x}" cy="${y1.toFixed(1)}" r="6" fill="#b197fc"/><circle cx="${x}" cy="${y2.toFixed(1)}" r="6" fill="#9775fa"/></g>`;
      });
      svg += `<path d="${hebra(1)}" class="bm-hebra"/>`;
      raiz.querySelector('#bm-helice').innerHTML = svg;
      animGiro = requestAnimationFrame(paso);
    };
    animGiro = requestAnimationFrame(paso);
  }

  function detenerHelice() {
    cancelAnimationFrame(animGiro);
    raiz.querySelector('#bm-helice').innerHTML = '';
    ['#bm-piezas', '#bm-enlaces', '#bm-efectos'].forEach(sel => { raiz.querySelector(sel).style.opacity = ''; });
    actualizarArmar();
  }

  // Fórmula molecular con subíndices.
  const formula = (c, h, o, extra = '') => Util.formula(`C${c}H${h}O${o}${extra}`);

  // Nombre, descripción y datos de lo que se armó.
  function analizar() {
    const n = cadena.length;
    if (!n) return { nombre: 'Nada todavía', desc: 'Toca las piezas de abajo para empezar a armar.', datos: [] };
    if (tipo === 'carbohidratos') {
      const u = unidades(), w = u - 1;
      const datos = [['Unidades', `${u} monosacáridos`], ['Fórmula', formula(6 * u, 12 * u - 2 * w, 6 * u - w)], ['Masa molecular', `${180 * u - 18 * w} g/mol`], ['Agua liberada', `${w} H₂O`]];
      if (n === 1) {
        const p = pieza('carbohidratos', cadena[0]);
        const clase = cadena[0] === 'fru' ? 'una <b>cetohexosa</b> (grupo cetona en el C2)' : 'una <b>aldohexosa</b> (grupo aldehído en el C1)';
        return { nombre: `Monosacárido: ${p.nombre}`, desc: `Es ${clase}, isómero de la glucosa: todas son C₆H₁₂O₆. Es <b>reductor</b>.`, datos };
      }
      if (n === 2) {
        const [a, b] = cadena;
        const glc = x => x === 'aglc' || x === 'bglc';
        let d = null;
        if ((a === 'aglc' && b === 'fru') || (a === 'fru' && b === 'aglc')) d = ['Sacarosa', 'el azúcar de mesa. Es <b>no reductora</b>: el enlace une los carbonos anoméricos de ambas unidades.', false];
        else if (a === 'aglc' && glc(b)) d = ['Maltosa', 'el azúcar de la malta; se forma al digerir el almidón. Es <b>reductora</b>.', true];
        else if (a === 'bglc' && glc(b)) d = ['Celobiosa', 'la unidad que se repite en la celulosa. Es <b>reductora</b>.', true];
        else if (a === 'gal' && glc(b)) d = ['Lactosa', 'el azúcar de la leche. Es <b>reductora</b>. Para digerirla hace falta la enzima lactasa.', true];
        datos.push(['Poder reductor', d ? (d[2] ? 'Sí' : 'No') : '—']);
        return d ? { nombre: `Disacárido: ${d[0]}`, desc: `Es ${d[1]}`, datos } : { nombre: 'Disacárido', desc: 'Dos monosacáridos unidos por un enlace glucosídico.', datos };
      }
      if (n < 8) return { nombre: 'Oligosacárido', desc: 'Una cadena corta de monosacáridos. Con 8 o más unidades ya hablamos de polisacárido.', datos };
      if (cadena.every(c => c === 'aglc')) {
        const t = [
          ['Amilosa (almidón)', 'Cadena <b>sin ramificar</b> de α-glucosas unidas α(1→4). Se enrolla en una <b>hélice</b>: por eso atrapa el yodo del lugol. Prueba <b>ramificarla</b>.'],
          ['Amilopectina (almidón)', 'α-glucosas con <b>ramificaciones α(1→6)</b> cada 24–30 unidades. Con la amilosa forma el almidón, la reserva de las plantas.'],
          ['Glucógeno', 'Muy ramificado (cada 8–12 glucosas). Es la <b>reserva animal</b> en hígado y músculos: sus muchos extremos permiten liberar glucosa rápido.'],
        ][ramas];
        return { nombre: t[0], desc: t[1], datos };
      }
      if (cadena.every(c => c === 'bglc')) return { nombre: 'Celulosa', desc: 'β-glucosas unidas <b>β(1→4)</b>: cada una queda girada 180°, la cadena es <b>recta</b> y se une a otras por puentes de hidrógeno formando fibras resistentes. No podemos digerirla: no tenemos celulasa.', datos };
      if (cadena.every(c => c === 'fru')) return { nombre: 'Inulina', desc: 'Polímero de fructosas (fructano), reserva de algunas plantas como la achicoria.', datos };
      return { nombre: 'Heteropolisacárido', desc: 'Un polisacárido con distintos monosacáridos. Si usas solo α-glucosa o solo β-glucosa obtienes los polisacáridos más importantes.', datos };
    }
    if (tipo === 'proteinas') {
      const ps = cadena.map(c => pieza('proteinas', c));
      const masa = ps.reduce((s, p) => s + p.masa, 0) - 18 * (n - 1);
      const carga = ps.filter(p => p.clase === 'basico').length - ps.filter(p => p.clase === 'acido').length;
      const datos = [['Aminoácidos', n], ['Masa molecular', `${masa} g/mol`], ['Carga a pH 7', carga > 0 ? `+${carga}` : `${carga}`], ['Agua liberada', `${n - 1} H₂O`],
        ['Secuencia (N→C)', `<span class="bm-sec">${ps.map(p => p.corto).join('-')}</span>`]];
      if (n === 1) return { nombre: `Aminoácido: ${ps[0].nombre}`, desc: `Grupo amino (–NH₂) y carboxilo (–COOH) unidos al carbono α. Su cadena R es <b>${CLASES_AA[ps[0].clase].nombre.toLowerCase()}</b>.`, datos };
      if (nivel === 'secundaria') return { nombre: 'Estructura secundaria: hélice α', desc: 'La cadena se enrolla y cada aminoácido forma un <b>puente de hidrógeno</b> (línea punteada) entre su C=O y el N–H del aminoácido que está 4 lugares más adelante. La otra estructura secundaria común es la <b>lámina β</b>.', datos };
      if (nivel === 'terciaria') {
        const it = interacciones();
        const ss = it.filter(x => x.tipo === 'ss').length, sal = it.length - ss;
        const ap = ps.filter(p => p.clase === 'apolar').length;
        return {
          nombre: 'Estructura terciaria: proteína globular',
          desc: `En el agua, los aminoácidos <b>apolares</b> se esconden en el centro (núcleo hidrofóbico) y los polares y con carga quedan afuera. La forma se estabiliza con ${ss} puente${ss === 1 ? '' : 's'} disulfuro (S–S, covalentes) y ${sal} puente${sal === 1 ? '' : 's'} salino${sal === 1 ? '' : 's'}. Si se unen varias cadenas se forma la <b>estructura cuaternaria</b> (como la hemoglobina).`,
          datos: [...datos, ['Aminoácidos apolares', ap]],
        };
      }
      return {
        nombre: n === 2 ? 'Dipéptido' : n < 10 ? 'Oligopéptido' : 'Polipéptido (estructura primaria)',
        desc: `La <b>estructura primaria</b> es la secuencia de aminoácidos, escrita desde el extremo amino (N) al carboxilo (C). ${n >= 5 ? 'Prueba formar una <b>hélice α</b>.' : ''}`,
        datos,
      };
    }
    if (tipo === 'lipidos') {
      const partes = cadena.slice(1).map(c => pieza('lipidos', c));
      const acidos = partes.filter(p => p.id !== 'fos');
      const conFos = partes.some(p => p.id === 'fos');
      const carbonos = 3 + acidos.reduce((s, p) => s + p.C, 0);
      const insat = acidos.reduce((s, p) => s + p.dobles.length, 0);
      const masa = Math.round(92 + partes.reduce((s, p) => s + p.masa, 0) - 18 * partes.length);
      const datos = saponificado
        ? [['Productos', 'glicerol + 3 jabones'], ['NaOH usado', '3 moléculas']]
        : [['Carbonos', carbonos], ['Enlaces dobles', insat], ['Masa molecular', `≈ ${masa} g/mol`], ['Agua liberada', `${partes.length} H₂O`]];
      if (saponificado) return { nombre: 'Glicerol + 3 jabones', desc: 'Triglicérido + 3 NaOH → glicerol + 3 R–COO⁻Na⁺. Es la reacción con la que se fabrica el jabón desde hace siglos.', datos };
      if (!partes.length) return { nombre: 'Glicerol (propanotriol)', desc: `${formula(3, 8, 3)}: un alcohol con 3 grupos OH que pueden formar enlaces éster con ácidos grasos.`, datos: [['Fórmula', formula(3, 8, 3)]] };
      if (conFos) {
        return acidos.length === 2
          ? { nombre: 'Fosfolípido (fosfatidilcolina)', desc: 'Es <b>anfipático</b>: la cabeza con fosfato y colina es polar (hidrófila) y las dos colas son apolares (hidrófobas). En agua forma espontáneamente una <b>bicapa</b>: la base de todas las membranas celulares.', datos }
          : { nombre: 'Fosfolípido incompleto', desc: 'Un fosfolípido tiene glicerol, <b>dos</b> ácidos grasos y un grupo fosfato unido a una molécula polar.', datos };
      }
      const nombres = ['Monoacilglicérido', 'Diacilglicérido', 'Triacilglicérido (triglicérido)'];
      let desc = `${acidos.length} ácido${acidos.length > 1 ? 's' : ''} graso${acidos.length > 1 ? 's' : ''} esterificado${acidos.length > 1 ? 's' : ''} con el glicerol.`;
      if (acidos.length === 3) {
        const cis = acidos.some(p => p.cis), trans = acidos.some(p => p.id === 'ela');
        desc = cis
          ? 'Tiene ácidos grasos <b>insaturados cis</b>: el enlace doble dobla la cadena, las moléculas no se empaquetan bien y el punto de fusión es bajo. Es un <b>aceite</b> (líquido a 25 °C).'
          : 'Sus cadenas son rectas, se empaquetan muy juntas y el punto de fusión es alto: es una <b>grasa sólida</b> a 25 °C.';
        if (trans) desc += ' Ojo: el enlace <b>trans</b> no dobla la cadena, así que se comporta como saturada. Las <b>grasas trans</b> aparecen al hidrogenar aceites parcialmente y aumentan el riesgo cardiovascular.';
        if (acidos.some(p => p.id === 'lin')) desc += ' El ácido linoleico (ω-6) es <b>esencial</b>: no lo fabricamos y debemos comerlo.';
        datos.push(['A 25 °C', cis ? 'líquido (aceite)' : 'sólido (grasa)']);
      }
      return { nombre: nombres[acidos.length - 1], desc, datos };
    }
    const gc = cadena.filter(b => b === 'C' || b === 'G').length;
    const completa = complementaria && complementaria.length === n;
    const datos = [['Nucleótidos', completa ? `${n} pares de bases` : n], ['Contenido de G+C', `${Math.round(gc / n * 100)} %`], ['Enlaces fosfodiéster', `${n - 1} por hebra`]];
    if (completa) {
      datos.push(['Puentes de hidrógeno', 2 * (n - gc) + 3 * gc]);
      datos.push(['T de fusión estimada', `${2 * (n - gc) + 4 * gc} °C`]);
    }
    return {
      nombre: completa ? 'ADN de doble hélice' : 'Hebra simple de ADN',
      desc: completa
        ? `Por la complementariedad se cumple la <b>regla de Chargaff</b>: A = T y C = G. Cuanto más <b>G+C</b>, más puentes de hidrógeno y más calor hace falta para separar las hebras (temperatura de fusión).`
        : `La secuencia <b>5'-${cadena.join('')}-3'</b> es información: cada 3 bases (un codón) indican un aminoácido. Con 4 o más nucleótidos puedes formar la doble hélice.`,
      datos,
    };
  }

  function pintarInfo() {
    const T = TIPOS[tipo];
    const m = analizar();
    raiz.querySelector('#bm-info').innerHTML = `
      <h2>${T.icono} ${T.nombre}</h2>
      <p>${T.intro}</p>
      <div class="bm-resultado">
        <span class="bm-res-lab">Formaste</span>
        <strong class="bm-res-nombre">${m.nombre}</strong>
        <p>${m.desc}</p>
      </div>
      <dl class="bm-datos">
        ${m.datos.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}
        ${cadena.length > 1 ? `<dt>Tipo de enlace</dt><dd>${T.enlace}</dd>` : ''}
      </dl>
      <p class="bm-aviso" id="bm-aviso">💡 Cada enlace se forma por <b>condensación</b> (se libera H₂O). La <b>hidrólisis</b> usa agua para romperlo: así digerimos los alimentos.</p>`;
  }

  // =====================================================================
  // DEL GEN A LA PROTEÍNA (transcripción y traducción)
  // =====================================================================

  function nuevoGen() {
    const codones = Object.keys(CODIGO).filter(c => CODIGO[c] !== '*' && c !== 'AUG');
    const medio = Array.from({ length: 3 }, () => Util.elegir(codones));
    const mrna = 'AUG' + medio.join('') + Util.elegir(['UAA', 'UAG', 'UGA']);
    return { original: mrna, mrna, escrito: '', paso: 'transcripcion', k: 0, proteina: [], mutada: null, verCodigo: false };
  }
  const traducir = mrna => {
    const res = [];
    for (let i = 0; i + 3 <= mrna.length; i += 3) {
      const a = CODIGO[mrna.slice(i, i + 3)];
      res.push(a);
      if (a === '*') break;
    }
    return res;
  };

  function vistaGen() {
    gen = nuevoGen();
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="bm-grid">
        <div class="panel bm-mesa">
          <svg id="bm-gen" viewBox="0 0 760 300" role="img" aria-label="Transcripción y traducción de un gen"></svg>
          <div class="bm-acciones" id="bm-gen-acciones"></div>
          <div id="bm-codigo" class="bm-codigo" hidden></div>
        </div>
        <aside class="panel bm-info" id="bm-gen-info"></aside>
      </div>`;
    pintarGen();
  }

  function pintarGen() {
    const L = gen.mrna.length, d = Math.min(46, 690 / (L - 1)), x0 = 380 - (L - 1) * d / 2;
    const X = i => x0 + i * d;
    const molde = [...gen.mrna].map(b => MOLDE[b]);
    const codif = [...gen.mrna].map(b => b === 'U' ? 'T' : b);
    const mut = gen.mutada ? gen.mutada.pos : -1;
    const caja = (b, x, y, extra = '', marcada = false) => `<g transform="translate(${x} ${y})" ${extra}>
      <rect x="-16" y="-16" width="32" height="32" rx="8" fill="${COLOR_BASE[b]}"/><rect x="0" y="-16" width="16" height="32" rx="0" fill="#000" opacity="0.12"/>
      ${marcada ? '<rect x="-19" y="-19" width="38" height="38" rx="10" fill="none" stroke="#ff4d6d" stroke-width="3"/>' : ''}
      <text y="5" text-anchor="middle" class="bm-letra grande" fill="#15163d">${b}</text></g>`;
    let svg = `<defs><radialGradient id="bm-fondo-gen" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="#23266b"/><stop offset="1" stop-color="#0e1033"/></radialGradient></defs>
      <rect width="760" height="300" fill="url(#bm-fondo-gen)"/>
      <text x="16" y="22" class="bm-rotulo">ADN · HEBRA CODIFICANTE 5'→3'</text>
      <text x="16" y="96" class="bm-rotulo">ADN · HEBRA MOLDE 3'→5'</text>
      <text x="16" y="150" class="bm-rotulo">ARN MENSAJERO 5'→3'</text>
      ${codif.map((b, i) => `<g opacity="0.45">${caja(b, X(i), 44, '', i === mut)}</g>`).join('')}
      ${molde.map((b, i) => caja(b, X(i), 74, '', i === mut)).join('')}`;
    // Codones del ARNm (fondos alternados).
    for (let c = 0; c * 3 < L; c++) {
      const xa = X(c * 3) - 20, xb = X(Math.min(L - 1, c * 3 + 2)) + 20;
      svg += `<rect x="${xa}" y="${156}" width="${xb - xa}" height="44" rx="10" fill="#fff" opacity="${c % 2 ? 0.04 : 0.09}"/>`;
    }
    const escrito = gen.paso === 'transcripcion' ? gen.escrito : gen.mrna;
    // Ribosoma detrás del codón que se lee.
    if (gen.paso === 'traduccion') {
      const cx = X(gen.k * 3 + 1);
      svg += `<g class="bm-ribosoma" style="transform:translateX(${cx}px)">
        <ellipse cx="0" cy="222" rx="88" ry="33" fill="#ff8fb1"/><ellipse cx="22" cy="222" rx="66" ry="33" fill="#f0719a" opacity="0.6"/>
        <ellipse cx="0" cy="176" rx="80" ry="24" fill="#ffb3c7"/>
        <text x="0" y="250" text-anchor="middle" class="bm-letra chica" fill="#5c1a33">RIBOSOMA</text></g>`;
      const codon = gen.mrna.slice(gen.k * 3, gen.k * 3 + 3);
      const anti = [...codon].map(b => ({ A: 'U', U: 'A', C: 'G', G: 'C' })[b]);
      svg += `<g>${anti.map((b, j) => `<g opacity="0.95">${caja(b, X(gen.k * 3 + j), 222)}</g>`).join('')}
        <text x="${X(gen.k * 3 + 2) + 26}" y="227" class="bm-letra chica" fill="#5c1a33">anticodón (ARNt)</text></g>`;
    }
    [...gen.mrna].forEach((b, i) => {
      svg += i < escrito.length ? caja(b, X(i), 178, '', i === mut)
        : `<g transform="translate(${X(i)} 178)"><rect x="-15" y="-15" width="30" height="30" rx="8" class="bm-hueco ${i === escrito.length ? 'actual' : ''}"/></g>`;
    });
    if (gen.paso === 'transcripcion' && gen.escrito.length < L) {
      const x = X(gen.escrito.length);
      svg += `<g><rect x="${x - 26}" y="54" width="52" height="150" rx="22" fill="#2fd186" opacity="0.18"/>
        <text x="${x}" y="222" text-anchor="middle" class="bm-letra chica" fill="#8af0bd">ARN polimerasa</text></g>`;
    }
    // Cadena de aminoácidos.
    const prot = gen.proteina;
    svg += prot.map((a, j) => {
      const x = 40 + j * 44;
      const col = a === '*' ? '#868e96' : ['#ffd166', '#5cc8ff', '#ff6b6b', '#b197fc', '#2fd186'][j % 5];
      return `${j ? `<line x1="${x - 44 + 17}" y1="280" x2="${x - 17}" y2="280" class="bm-enlace"/>` : ''}
        <g transform="translate(${x} 280)">${a === '*' ? '<rect x="-17" y="-12" width="34" height="24" rx="6" fill="#868e96"/>' : circulo(17, col, col)}${etiqueta(AMINO[a][0], '#15163d', 'chica')}</g>`;
    }).join('');
    raiz.querySelector('#bm-gen').innerHTML = svg;
    pintarGenAcciones();
    pintarGenInfo();
  }

  function pintarGenAcciones() {
    const cont = raiz.querySelector('#bm-gen-acciones');
    if (gen.paso === 'transcripcion') {
      cont.innerHTML = `<span class="bm-teclas">Base del ARN: ${['A', 'U', 'C', 'G'].map(b => `<button class="bm-tecla" data-b="${b}" style="--c:${COLOR_BASE[b]}">${b}</button>`).join('')}</span>
        <button class="btn chico" id="bm-gen-nuevo">🎲 Otro gen</button>`;
      cont.querySelectorAll('.bm-tecla').forEach(b => b.addEventListener('click', () => transcribir(b.dataset.b)));
    } else if (gen.paso === 'traduccion') {
      const codon = gen.mrna.slice(gen.k * 3, gen.k * 3 + 3), ok = CODIGO[codon];
      const otros = Util.mezclar(Object.keys(AMINO).filter(a => a !== ok)).slice(0, 3);
      cont.innerHTML = `<span class="bm-pregunta-gen">¿Qué indica el codón <b>${codon}</b>?</span>
        ${Util.mezclar([ok, ...otros]).map(a => `<button class="btn chico bm-aa-op" data-a="${a}">${a === '*' ? '⛔ STOP' : `${AMINO[a][0]} · ${AMINO[a][1]}`}</button>`).join('')}
        <button class="btn chico" id="bm-ver-codigo">📖 Código genético</button>`;
      cont.querySelectorAll('.bm-aa-op').forEach(b => b.addEventListener('click', () => elegirAminoacido(b.dataset.a)));
      cont.querySelector('#bm-ver-codigo').addEventListener('click', () => { gen.verCodigo = !gen.verCodigo; pintarCodigo(); });
    } else {
      cont.innerHTML = `<button class="btn chico primario" id="bm-mut-sust">🎲 Mutación por sustitución</button>
        <button class="btn chico" id="bm-mut-ins">➕ Inserción de una base</button>
        ${gen.mutada ? '<button class="btn chico" id="bm-mut-no">↩ Deshacer mutación</button>' : ''}
        <button class="btn chico" id="bm-gen-nuevo">🧬 Otro gen</button>`;
      cont.querySelector('#bm-mut-sust').addEventListener('click', () => mutar('sustitucion'));
      cont.querySelector('#bm-mut-ins').addEventListener('click', () => mutar('insercion'));
      cont.querySelector('#bm-mut-no')?.addEventListener('click', () => { gen.mrna = gen.original; gen.mutada = null; gen.proteina = traducir(gen.mrna); pintarGen(); });
    }
    cont.querySelector('#bm-gen-nuevo')?.addEventListener('click', () => { gen = nuevoGen(); pintarCodigo(); pintarGen(); });
    pintarCodigo();
  }

  function pintarCodigo() {
    const box = raiz.querySelector('#bm-codigo');
    box.hidden = !(gen.verCodigo && gen.paso === 'traduccion');
    if (box.hidden) return;
    const codon = gen.mrna.slice(gen.k * 3, gen.k * 3 + 3);
    box.innerHTML = `<table><thead><tr><th>1.ª \\ 2.ª</th>${[...BASES].map(b => `<th>${b}</th>`).join('')}</tr></thead><tbody>
      ${[...BASES].map(b1 => `<tr><th>${b1}</th>${[...BASES].map(b2 => `<td>${[...BASES].map(b3 => {
        const c = b1 + b2 + b3;
        return `<span class="${c === codon ? 'actual' : ''}">${c} ${AMINO[CODIGO[c]][0]}</span>`;
      }).join('')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function transcribir(b) {
    const i = gen.escrito.length, esperado = gen.mrna[i], plantilla = MOLDE[esperado];
    if (b !== esperado) {
      const pista = plantilla === 'A' && b === 'T' ? ' En el ARN <b>no hay timina</b>: frente a A va <b>uracilo (U)</b>.' : '';
      return avisar(`✖ Frente a la <b>${plantilla}</b> del molde no va <b>${b}</b>.${pista} Recuerda: A→U, T→A, C→G, G→C.`, true);
    }
    gen.escrito += b;
    if (gen.escrito.length === gen.mrna.length) {
      gen.paso = 'traduccion';
      pintarGen();
      avisar('✅ ¡ARNm listo! Tiene la misma secuencia que la hebra codificante, pero con <b>U en lugar de T</b>. Sale del núcleo y un <b>ribosoma</b> lo lee de a tres bases (codones), empezando por <b>AUG</b>.');
      return;
    }
    pintarGen();
  }

  function elegirAminoacido(a) {
    const codon = gen.mrna.slice(gen.k * 3, gen.k * 3 + 3), ok = CODIGO[codon];
    if (a !== ok) return avisar(`✖ El codón <b>${codon}</b> no codifica ${a === '*' ? 'STOP' : AMINO[a][1]}. Búscalo en el código genético: primera base en la fila, segunda en la columna y tercera dentro de la casilla.`, true);
    gen.proteina.push(a);
    if (a === '*') {
      gen.paso = 'fin';
      pintarGen();
      avisar(`🎉 ¡Proteína terminada! Un <b>codón de terminación</b> (${codon}) no tiene ARNt: libera la cadena. Ahora prueba qué pasa con una <b>mutación</b>.`);
      return;
    }
    gen.k++;
    pintarGen();
    avisar(`✔ ${codon} → <b>${AMINO[a][1]}</b>. ${gen.k === 1 ? 'El AUG es el <b>codón de inicio</b>: por eso todas las proteínas empiezan con metionina. ' : ''}El ribosoma forma un enlace peptídico y avanza al siguiente codón.`);
  }

  function mutar(tipoMut) {
    const base = gen.original;
    const pos = 3 + Math.floor(Math.random() * 9); // dentro de los codones 2 a 4
    let nuevo;
    if (tipoMut === 'sustitucion') {
      const b = Util.elegir([...'AUCG'].filter(x => x !== base[pos]));
      nuevo = base.slice(0, pos) + b + base.slice(pos + 1);
    } else {
      nuevo = base.slice(0, pos) + Util.elegir([...'AUCG']) + base.slice(pos);
    }
    const antes = traducir(base), despues = traducir(nuevo);
    let clase;
    if (tipoMut === 'insercion') clase = ['Corrimiento del marco de lectura', 'Al insertar una base, <b>todos los codones siguientes cambian</b>. La proteína suele quedar completamente alterada o termina antes (o después) de tiempo.'];
    else {
      const c = Math.floor(pos / 3);
      if (antes[c] === despues[c]) clase = ['Mutación silenciosa', 'El codón cambió pero codifica el <b>mismo aminoácido</b>: el código genético es <b>redundante</b> (varios codones por aminoácido). La proteína no cambia.'];
      else if (despues[c] === '*') clase = ['Mutación sin sentido', 'El codón se convirtió en <b>STOP</b>: la proteína queda <b>más corta</b> y casi siempre no funciona.'];
      else clase = ['Mutación de cambio de sentido', `Un aminoácido cambió: <b>${AMINO[antes[c]][1]} → ${AMINO[despues[c]][1]}</b>. Según dónde ocurra, puede afectar mucho o poco a la función (así se origina la anemia falciforme).`];
    }
    gen.mrna = nuevo;
    gen.proteina = despues;
    gen.mutada = { pos, clase, antes, despues };
    pintarGen();
  }

  function pintarGenInfo() {
    const info = raiz.querySelector('#bm-gen-info');
    const pasos = [['transcripcion', '1. Transcripción', 'En el núcleo, la <b>ARN polimerasa</b> lee la hebra molde del ADN y arma un ARN mensajero complementario.'],
      ['traduccion', '2. Traducción', 'En el citoplasma, el <b>ribosoma</b> lee el ARNm de a tres bases (codones). Cada ARN de transferencia trae el aminoácido que corresponde a su anticodón.'],
      ['fin', '3. Proteína y mutaciones', 'Un cambio en el ADN se copia en el ARNm y puede cambiar la proteína.']];
    const m = gen.mutada;
    info.innerHTML = `
      <h2>🧬 Del gen a la proteína</h2>
      <p>El <b>dogma central</b> de la biología: <b>ADN → ARN → proteína</b>.</p>
      ${pasos.map(([k, t, x]) => `<div class="bm-guia-item ${gen.paso === k ? 'activo' : ''}"><b>${t}</b><p>${x}</p></div>`).join('')}
      ${gen.proteina.length ? `<div class="bm-resultado"><span class="bm-res-lab">Proteína</span><strong class="bm-res-nombre">${gen.proteina.map(a => AMINO[a][0]).join('-')}</strong>
        ${m ? `<p><b>${m.clase[0]}</b>. ${m.clase[1]}</p><p class="bm-comparar">Original: ${m.antes.map(a => AMINO[a][0]).join('-')}<br>Mutada: ${m.despues.map((a, i) => a === m.antes[i] ? AMINO[a][0] : `<mark>${AMINO[a][0]}</mark>`).join('-')}</p>` : ''}</div>` : ''}
      <p class="bm-aviso" id="bm-aviso">${gen.paso === 'transcripcion' ? '👆 Toca la base de ARN complementaria a cada base del <b>molde</b>, empezando por la izquierda.' : gen.paso === 'traduccion' ? '👆 Elige el aminoácido de cada codón. Usa el <b>📖 código genético</b> si lo necesitas.' : '🎲 Provoca mutaciones y compara la proteína.'}</p>`;
  }

  // =====================================================================
  // ENZIMAS
  // =====================================================================

  function vistaEnzimas() {
    enz = { e: ENZIMAS[0], T: 37, pH: 7, S: 60, inh: false, variable: 'T', puntos: { T: [], pH: [], S: [] }, desnat: false, teoria: false, particulas: [], acum: 0, t0: 0 };
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="segmentado" id="bm-enz-sel">${ENZIMAS.map(e => `<button data-e="${e.id}">${e.nombre}</button>`).join('')}</div>
      <div class="bm-grid">
        <div class="panel bm-mesa">
          <svg id="bm-enz" viewBox="0 0 760 300" role="img" aria-label="Enzima y sustrato"></svg>
          <div class="bm-medidor"><span>Velocidad de reacción</span><div class="barra"><div id="bm-vbar"></div></div><b id="bm-vnum">0 %</b></div>
          <div class="bm-enz-controles">
            <label>🌡️ Temperatura <b id="bm-lT"></b><input type="range" id="bm-T" min="0" max="90" step="1"></label>
            <label>🧪 pH <b id="bm-lpH"></b><input type="range" id="bm-pH" min="0" max="14" step="0.5"></label>
            <label>🔴 Sustrato <b id="bm-lS"></b><input type="range" id="bm-S" min="0" max="100" step="5"></label>
            <label class="bm-check"><input type="checkbox" id="bm-inh"> Agregar un inhibidor competitivo</label>
          </div>
          <div class="bm-acciones">
            <button class="btn chico primario" id="bm-medir">📏 Medir y anotar</button>
            <button class="btn chico" id="bm-nueva">🧪 Enzima nueva</button>
          </div>
        </div>
        <aside class="panel bm-info" id="bm-enz-info">
          <div id="bm-enz-ficha"></div>
          <h3>📈 Gráfico de mis mediciones</h3>
          <div class="segmentado chico" id="bm-var">${Object.entries(VARIABLES).map(([k, v]) => `<button data-v="${k}">${k === 'S' ? '[Sustrato]' : v.nombre}</button>`).join('')}</div>
          <svg id="bm-graf" viewBox="0 0 320 210" role="img" aria-label="Gráfico de velocidad de reacción"></svg>
          <div class="bm-acciones izq">
            <label class="bm-check"><input type="checkbox" id="bm-teoria"> Curva teórica</label>
            <button class="btn chico" id="bm-borrar">🗑 Borrar</button>
          </div>
          <p class="bm-aviso" id="bm-aviso"></p>
        </aside>
      </div>`;
    const q = s => raiz.querySelector(s);
    q('#bm-T').value = enz.T; q('#bm-pH').value = enz.pH; q('#bm-S').value = enz.S;
    ['T', 'pH', 'S'].forEach(k => q(`#bm-${k}`).addEventListener('input', e => { enz[k] = +e.target.value; actualizarEnzima(); }));
    q('#bm-inh').addEventListener('change', e => { enz.inh = e.target.checked; actualizarEnzima(); });
    q('#bm-teoria').addEventListener('change', e => { enz.teoria = e.target.checked; dibujarGrafico(); });
    q('#bm-medir').addEventListener('click', medir);
    q('#bm-nueva').addEventListener('click', () => { enz.desnat = false; actualizarEnzima(); avisar('🧪 Pusiste enzima nueva, sin desnaturalizar.'); });
    q('#bm-borrar').addEventListener('click', () => { enz.puntos[enz.variable] = []; dibujarGrafico(); });
    raiz.querySelectorAll('#bm-enz-sel button').forEach(b => b.addEventListener('click', () => {
      enz.e = ENZIMAS.find(x => x.id === b.dataset.e);
      enz.puntos = { T: [], pH: [], S: [] };
      enz.desnat = false;
      enz.particulas = [];
      actualizarEnzima();
    }));
    raiz.querySelectorAll('#bm-var button').forEach(b => b.addEventListener('click', () => { enz.variable = b.dataset.v; actualizarEnzima(); }));
    actualizarEnzima();
    enz.t0 = performance.now();
    animEnz = requestAnimationFrame(bucleEnzima);
  }

  // Modelo: temperatura (Q10 = 2 hasta el óptimo, luego desnaturalización), pH (campana) y Michaelis-Menten.
  function factores(T, pH, S, inh, e = enz.e) {
    const fT = T <= e.tOpt ? Math.pow(2, (T - e.tOpt) / 10) : Math.exp(-Math.pow((T - e.tOpt) / 7, 2));
    const fpH = Math.exp(-Math.pow((pH - e.pHOpt) / 1.3, 2));
    const Km = 15 * (inh ? 5 : 1);
    const fS = S / (Km + S) * (Km + 100) / 100;
    return { fT, fpH, fS, v: fT * fpH * fS };
  }
  const velocidad = () => enz.desnat ? 0 : factores(enz.T, enz.pH, enz.S, enz.inh).v;

  function actualizarEnzima() {
    const q = s => raiz.querySelector(s);
    if (enz.T >= enz.e.tOpt + 20) enz.desnat = true;
    q('#bm-lT').textContent = `${enz.T} °C`;
    q('#bm-lpH').textContent = enz.pH.toFixed(1);
    q('#bm-lS').textContent = `${enz.S} %`;
    raiz.querySelectorAll('#bm-enz-sel button').forEach(b => b.classList.toggle('activo', b.dataset.e === enz.e.id));
    raiz.querySelectorAll('#bm-var button').forEach(b => b.classList.toggle('activo', b.dataset.v === enz.variable));
    const v = velocidad();
    q('#bm-vbar').style.width = `${Math.round(v * 100)}%`;
    q('#bm-vnum').textContent = `${Math.round(v * 100)} %`;
    const e = enz.e;
    q('#bm-enz-ficha').innerHTML = `
      <h2>⚗️ ${e.nombre}</h2>
      <p class="bm-reaccion">${e.reaccion}</p>
      <p>${e.dato} <span class="bm-suave">Fuente: ${e.fuente}.</span></p>
      <div class="bm-guia-item"><b>🎯 Desafío</b><p>Averigua la <b>temperatura</b> y el <b>pH óptimos</b> de esta enzima. Cambia <b>una sola variable</b> por vez y anota varias mediciones en el gráfico.</p></div>`;
    dibujarEnzima();
    dibujarGrafico();
    avisar(explicacion());
  }

  function explicacion() {
    const e = enz.e, { fT, fpH, fS } = factores(enz.T, enz.pH, enz.S, enz.inh);
    if (enz.desnat) return `🔥 La enzima se <b>desnaturalizó</b> por el calor (más de ${e.tOpt + 20} °C): perdió su forma y el sitio activo ya no encaja con el sustrato. Es <b>irreversible</b>: aunque bajes la temperatura no vuelve a funcionar. Usa <b>🧪 Enzima nueva</b>.`;
    if (enz.S === 0) return 'Sin sustrato no hay reacción: la enzima no tiene sobre qué actuar.';
    if (fpH < 0.2) return `🧪 Con pH ${enz.pH.toFixed(1)} cambian las <b>cargas</b> de los aminoácidos del sitio activo y la enzima se deforma: el sustrato casi no encaja.`;
    if (enz.T > e.tOpt && fT < 0.8) return `🌡️ Por encima de ${e.tOpt} °C la enzima empieza a <b>desnaturalizarse</b>: se rompen puentes de hidrógeno y cambia la forma del sitio activo.`;
    if (enz.T < e.tOpt - 20) return '❄️ Con frío las moléculas se mueven más lento y hay menos <b>choques</b> entre enzima y sustrato. La enzima no se daña: si la calientas, vuelve a funcionar.';
    if (enz.inh) return fS > 0.8 ? '🔴 Con mucho sustrato, el sustrato le gana al <b>inhibidor competitivo</b> la carrera por el sitio activo: la velocidad casi se recupera.' : '⛔ El <b>inhibidor competitivo</b> se parece al sustrato y ocupa el sitio activo. Prueba aumentar el sustrato.';
    if (fS > 0.93 && enz.S > 60) return '🔴 Con mucho sustrato la enzima está <b>saturada</b>: todos sus sitios activos están ocupados y la velocidad ya no aumenta.';
    return '🔑 El sustrato encaja en el <b>sitio activo</b> como una llave en su cerradura. La enzima no se gasta: sale intacta y vuelve a actuar.';
  }

  function medir() {
    const k = enz.variable;
    const x = enz[k];
    const y = Math.max(0, Math.min(100, velocidad() * 100 + (Math.random() - 0.5) * 4));
    const lista = enz.puntos[k].filter(p => p.x !== x);
    lista.push({ x, y });
    enz.puntos[k] = lista.sort((a, b) => a.x - b.x);
    dibujarGrafico();
    const otras = Object.keys(VARIABLES).filter(v => v !== k).map(v => `${v === 'pH' ? 'pH' : VARIABLES[v].nombre.toLowerCase()} = ${enz[v]}${VARIABLES[v].unidad}`).join(' y ');
    avisar(`📏 Anotaste ${Math.round(y)} % con ${k === 'pH' ? 'pH' : VARIABLES[k].nombre.toLowerCase()} = ${x}${VARIABLES[k].unidad}. Para un buen experimento, deja fijas ${otras}.`);
  }

  function dibujarGrafico() {
    const k = enz.variable, V = VARIABLES[k];
    const g = { x0: 42, x1: 308, y0: 12, y1: 172 };
    const X = x => g.x0 + (x - V.min) / (V.max - V.min) * (g.x1 - g.x0);
    const Y = y => g.y1 - y / 100 * (g.y1 - g.y0);
    const ticksX = k === 'pH' ? [0, 2, 4, 6, 8, 10, 12, 14] : k === 'T' ? [0, 15, 30, 45, 60, 75, 90] : [0, 20, 40, 60, 80, 100];
    let svg = [0, 25, 50, 75, 100].map(y => `<line x1="${g.x0}" x2="${g.x1}" y1="${Y(y)}" y2="${Y(y)}" class="bm-g-grilla"/><text x="${g.x0 - 6}" y="${Y(y) + 4}" text-anchor="end" class="bm-g-txt">${y}</text>`).join('');
    svg += ticksX.map(x => `<text x="${X(x)}" y="${g.y1 + 15}" text-anchor="middle" class="bm-g-txt">${x}</text>`).join('');
    svg += `<line x1="${g.x0}" x2="${g.x1}" y1="${g.y1}" y2="${g.y1}" class="bm-g-eje"/><line x1="${g.x0}" x2="${g.x0}" y1="${g.y0}" y2="${g.y1}" class="bm-g-eje"/>
      <text x="${(g.x0 + g.x1) / 2}" y="206" text-anchor="middle" class="bm-g-lab">${V.nombre}${V.unidad ? ` (${V.unidad})` : ''}</text>
      <text x="12" y="${(g.y0 + g.y1) / 2}" text-anchor="middle" transform="rotate(-90 12 ${(g.y0 + g.y1) / 2})" class="bm-g-lab">Velocidad (%)</text>`;
    if (enz.teoria) {
      const pts = [];
      for (let x = V.min; x <= V.max; x += (V.max - V.min) / 90) {
        const a = { T: enz.T, pH: enz.pH, S: enz.S };
        a[k] = x;
        pts.push(`${X(x).toFixed(1)},${Y(factores(a.T, a.pH, a.S, enz.inh).v * 100).toFixed(1)}`);
      }
      svg += `<polyline points="${pts.join(' ')}" class="bm-g-teoria"/>`;
    }
    const ps = enz.puntos[k];
    if (ps.length > 1) svg += `<polyline points="${ps.map(p => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ')}" class="bm-g-linea"/>`;
    svg += ps.map(p => `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="4.5" class="bm-g-punto"/>`).join('');
    if (!ps.length) svg += `<text x="${(g.x0 + g.x1) / 2}" y="${(g.y0 + g.y1) / 2}" text-anchor="middle" class="bm-g-vacio">Cambia ${k === 'pH' ? 'el pH' : 'la ' + V.nombre.toLowerCase()} y toca 📏 Medir</text>`;
    svg += `<line x1="${X(enz[k])}" x2="${X(enz[k])}" y1="${g.y0}" y2="${g.y1}" class="bm-g-actual"/>`;
    raiz.querySelector('#bm-graf').innerHTML = svg;
  }

  // Forma del sitio activo (y del sustrato que encaja en él).
  const LLAVE = 'M-16,-13 L16,-13 L3,11 Q0,15 -3,11 Z';
  function dibujarEnzima() {
    const { fpH } = factores(enz.T, enz.pH, enz.S, enz.inh);
    const svg = raiz.querySelector('#bm-enz');
    const deformada = !enz.desnat && fpH < 0.2;
    let cuerpo;
    if (enz.desnat) {
      cuerpo = `<path d="M250,190 C280,140 300,230 330,180 S370,130 400,190 S450,240 480,170 S520,150 530,190" fill="none" stroke="#7c86ff" stroke-width="16" stroke-linecap="round"/>
        <path d="M250,190 C280,140 300,230 330,180 S370,130 400,190 S450,240 480,170 S520,150 530,190" fill="none" stroke="#a5b4ff" stroke-width="4" stroke-linecap="round" opacity="0.6" transform="translate(0 -4)"/>
        <text x="390" y="262" text-anchor="middle" class="bm-letra" fill="#ffb3b3">Enzima desnaturalizada: perdió su forma</text>`;
    } else {
      const notch = deformada ? 'M362,98 L398,98 L384,128 Q380,134 376,128 Z' : 'M362,96 L398,96 L383,124 Q380,130 377,124 Z';
      cuerpo = `<mask id="bm-enz-mask"><rect width="760" height="300" fill="#fff"/><path d="${notch}" fill="#000" transform="${deformada ? 'rotate(18 380 110)' : ''}"/></mask>
        <clipPath id="bm-enz-clip"><ellipse cx="380" cy="180" rx="100" ry="74"/></clipPath>
        <g mask="url(#bm-enz-mask)">
          <ellipse cx="380" cy="180" rx="100" ry="74" fill="#7c86ff"/>
          <rect x="410" y="90" width="200" height="200" fill="#5a63d8" clip-path="url(#bm-enz-clip)"/>
          <path d="M310,150 a80,60 0 0 1 40,-34" stroke="#c5ccff" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6"/>
        </g>
        ${Arte.ojo(352, 186, 11)}${Arte.ojo(404, 186, 11)}
        <path d="M366,214 q12,${deformada ? -6 : 9} 24,0" stroke="#15163d" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="336" cy="206" r="6" fill="#ff8fb1" opacity="0.6"/><circle cx="422" cy="206" r="6" fill="#ff8fb1" opacity="0.6"/>
        <text x="380" y="276" text-anchor="middle" class="bm-letra" fill="#c9ccf5">${enz.e.nombre.toUpperCase()}</text>
        <text x="430" y="92" class="bm-letra chica" fill="#ffe8a3">← sitio activo${deformada ? ' (deformado)' : ''}</text>`;
    }
    svg.innerHTML = `<defs><radialGradient id="bm-fondo-enz" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stop-color="#23266b"/><stop offset="1" stop-color="#0e1033"/></radialGradient></defs>
      <rect width="760" height="300" fill="url(#bm-fondo-enz)"/>${cuerpo}<g id="bm-part"></g>
      <text x="16" y="24" class="bm-rotulo">${enz.e.reaccion}</text>`;
  }

  function bucleEnzima(t) {
    if (modo !== 'enzimas' || !raiz.querySelector('#bm-part')) return;
    const dt = Math.min(0.05, (t - enz.t0) / 1000);
    enz.t0 = t;
    const e = enz.e, ps = enz.particulas;
    // Mantiene la cantidad de sustrato según la concentración.
    const objetivo = Math.round(enz.S / 8);
    const libres = ps.filter(p => p.tipo === 's');
    if (libres.length < objetivo) ps.push({ tipo: 's', x: Math.random() < 0.5 ? 30 : 730, y: 40 + Math.random() * 230, vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 60, ang: Math.random() * 360 });
    if (libres.length > objetivo) ps.splice(ps.indexOf(libres[0]), 1);
    // Inhibidor: una molécula parecida al sustrato que a veces ocupa el sitio activo.
    const inhib = ps.find(p => p.tipo === 'i');
    if (enz.inh && !inhib) ps.push({ tipo: 'i', x: 700, y: 60, vx: -30, vy: 20, ang: 0 });
    if (!enz.inh && inhib) ps.splice(ps.indexOf(inhib), 1);
    enz.acum += velocidad() * dt * 2.4;
    if (enz.acum >= 1 && !ps.some(p => p.captura)) {
      enz.acum -= 1;
      const s = ps.filter(p => p.tipo === 's').sort((a, b) => Math.hypot(a.x - 380, a.y - 110) - Math.hypot(b.x - 380, b.y - 110))[0];
      if (s) s.captura = true;
    }
    ps.forEach(p => {
      if (p.captura) {
        const dx = 380 - p.x, dy = 111 - p.y, dist = Math.hypot(dx, dy);
        p.ang += (0 - p.ang) * 0.2;
        if (dist < 4) {
          p.tipo = 'p'; p.captura = false; p.vida = 2.2;
          ps.push({ tipo: 'p', x: p.x, y: p.y, vx: 70, vy: -60, vida: 2.2, ang: 0 });
          p.vx = -70; p.vy = -60;
        } else { p.x += dx / dist * Math.min(dist, 320 * dt); p.y += dy / dist * Math.min(dist, 320 * dt); }
        return;
      }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.ang += p.vx * dt * 0.8;
      if (p.x < 20 || p.x > 740) p.vx *= -1;
      if (p.y < 20 || p.y > 285) p.vy *= -1;
      // Rebota contra el cuerpo de la enzima.
      if (!enz.desnat && Math.pow((p.x - 380) / 108, 2) + Math.pow((p.y - 180) / 82, 2) < 1 && p.tipo !== 'p') { p.vx *= -1; p.vy *= -1; p.x += p.vx * dt * 2; p.y += p.vy * dt * 2; }
      if (p.tipo === 'p') p.vida -= dt;
    });
    enz.particulas = ps.filter(p => p.tipo !== 'p' || p.vida > 0);
    raiz.querySelector('#bm-part').innerHTML = enz.particulas.map(p => {
      const tr = `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.ang.toFixed(0)})`;
      if (p.tipo === 's') return `<path d="${LLAVE}" transform="${tr}" fill="${e.cS}"/>`;
      if (p.tipo === 'i') return `<path d="M-16,-13 L16,-13 L3,11 Q0,15 -3,11 Z M-6,-4 h12 v6 h-12 Z" fill-rule="evenodd" transform="${tr}" fill="#868e96"/>`;
      return `<g transform="${tr}" opacity="${Math.min(1, p.vida).toFixed(2)}"><circle r="6" fill="${e.cP}"/><circle cx="-2" cy="-2" r="2" fill="#fff" opacity="0.7"/></g>`;
    }).join('');
    animEnz = requestAnimationFrame(bucleEnzima);
  }

  // =====================================================================
  // LABORATORIO DE RECONOCIMIENTO
  // =====================================================================

  function vistaReconocer() {
    tubo = null;
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="bm-lab">
        <div class="panel bm-lab-controles">
          <button class="btn chico primario bm-incog-btn" id="bm-incog">🔎 Muestra incógnita</button>
          <h2>1. Elige una muestra</h2>
          <div class="bm-lista" id="bm-muestras"></div>
          <h2>2. Tratamiento previo</h2>
          <label class="bm-check"><input type="checkbox" id="bm-hidro-lab"> Hidrólisis ácida (HCl + calor, luego neutralizar)</label>
          <h2>3. Agrega un reactivo</h2>
          <div class="bm-lista" id="bm-reactivos">${REACTIVOS.map(r => `<button data-r="${r.id}" disabled><b>${r.nombre}</b><small>detecta ${r.busca}</small></button>`).join('')}</div>
        </div>
        <div class="panel bm-lab-mesa">
          <svg id="bm-tubo" viewBox="0 0 260 320" role="img" aria-label="Tubo de ensayo"></svg>
          <p id="bm-lab-texto" class="bm-lab-texto">Elige una muestra para llenar el tubo de ensayo.</p>
        </div>
        <div class="panel bm-lab-tabla">
          <h2>📋 Resultados</h2>
          <div class="tabla-scroll"><table class="bm-tabla" id="bm-tabla"></table></div>
          <p class="bm-ayuda">+ positivo · − negativo · <b>H</b> = con hidrólisis previa.</p>
          <div id="bm-incog-panel"></div>
        </div>
      </div>`;
    raiz.querySelector('#bm-hidro-lab').checked = hidrolizar;
    raiz.querySelector('#bm-hidro-lab').addEventListener('change', e => { hidrolizar = e.target.checked; if (tubo) elegirMuestra(tubo.muestra); });
    raiz.querySelectorAll('#bm-reactivos button').forEach(b => b.addEventListener('click', () => agregarReactivo(b.dataset.r)));
    raiz.querySelector('#bm-incog').addEventListener('click', () => {
      incognita = { comp: Util.elegir(INCOGNITAS), ensayos: 0, resuelta: false };
      Object.keys(resultados).filter(k => k.startsWith('x-')).forEach(k => delete resultados[k]);
      pintarMuestras();
      elegirMuestra('x');
      pintarTabla();
    });
    pintarMuestras();
    dibujarTubo();
    pintarTabla();
  }

  const muestrasActuales = () => incognita
    ? [{ id: 'x', nombre: 'Muestra X', icono: '❓', color: 'rgba(235, 228, 205, 0.75)', comp: incognita.comp }, ...MUESTRAS]
    : MUESTRAS;
  const buscarMuestra = id => muestrasActuales().find(m => m.id === id);

  function pintarMuestras() {
    const cont = raiz.querySelector('#bm-muestras');
    cont.innerHTML = muestrasActuales().map(m => `<button data-m="${m.id}" class="${m.id === 'x' ? 'incog' : ''}"><span>${m.icono}</span>${m.nombre}</button>`).join('');
    cont.querySelectorAll('button').forEach(b => b.addEventListener('click', () => elegirMuestra(b.dataset.m)));
  }

  function dibujarTubo() {
    const m = tubo && buscarMuestra(tubo.muestra);
    const r = tubo && tubo.reactivo && REACTIVOS.find(x => x.id === tubo.reactivo);
    const nivelL = m ? (r ? 150 : 110) : 0;
    raiz.querySelector('#bm-tubo').innerHTML = `
      <defs>
        <clipPath id="bm-clip-tubo"><path d="M100,40 L100,250 A30,30 0 0 0 160,250 L160,40 Z"/></clipPath>
        <linearGradient id="bm-vidrio" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.3" stop-color="#fff" stop-opacity="0.05"/><stop offset="1" stop-color="#fff" stop-opacity="0.2"/></linearGradient>
      </defs>
      <rect width="260" height="320" rx="14" fill="#12143a"/>
      ${r && r.calor ? `<g><rect x="70" y="200" width="120" height="80" rx="10" fill="#4c8dff" opacity="0.35"/><g class="bm-llama"><path d="M130,316 C112,300 120,290 130,280 C140,290 148,300 130,316 Z" fill="#ff9f43"/><path d="M130,314 C122,306 126,300 130,294 C134,300 138,306 130,314 Z" fill="#ffd166"/></g></g>` : ''}
      <g clip-path="url(#bm-clip-tubo)">
        <rect id="bm-liquido" x="100" y="${280 - nivelL}" width="60" height="${nivelL + 10}" fill="${m ? m.color : 'transparent'}"/>
        <rect id="bm-capa" x="100" y="${280 - nivelL}" width="60" height="0" fill="#e8590c"/>
        <rect id="bm-precipitado" x="100" y="280" width="60" height="0" fill="#c92a2a"/>
      </g>
      <path d="M100,40 L100,250 A30,30 0 0 0 160,250 L160,40" fill="url(#bm-vidrio)" stroke="#c9ccf5" stroke-width="3"/>
      <rect x="92" y="32" width="76" height="10" rx="5" fill="#c9ccf5"/>
      ${m && hidrolizar ? '<text x="175" y="70" class="bm-letra" fill="#ffd166">HCl ✓</text>' : ''}
      <g id="bm-gotero"></g>`;
  }

  function elegirMuestra(id) {
    tubo = { muestra: id, reactivo: null };
    raiz.querySelectorAll('#bm-muestras button').forEach(b => b.classList.toggle('activo', b.dataset.m === id));
    raiz.querySelectorAll('#bm-reactivos button').forEach(b => { b.disabled = false; b.classList.remove('activo'); });
    dibujarTubo();
    const m = buscarMuestra(id);
    raiz.querySelector('#bm-lab-texto').innerHTML = `Pusiste <b>${m.nombre.toLowerCase()}</b> en el tubo${hidrolizar ? ' y la <b>hidrolizaste</b> con ácido y calor' : ''}. Ahora agrega un reactivo.`;
  }

  function agregarReactivo(id) {
    if (!tubo || tubo.reactivo) return;
    tubo.reactivo = id;
    const r = REACTIVOS.find(x => x.id === id), m = buscarMuestra(tubo.muestra), hidro = hidrolizar;
    raiz.querySelectorAll('#bm-reactivos button').forEach(b => { b.disabled = true; b.classList.toggle('activo', b.dataset.r === id); });
    dibujarTubo();
    const positivo = resultadoEnsayo(m.comp, id, hidro);
    const liq = raiz.querySelector('#bm-liquido');
    raiz.querySelector('#bm-gotero').innerHTML = `
      <rect x="120" y="-4" width="20" height="26" rx="6" fill="#c9ccf5"/><rect x="126" y="20" width="8" height="14" fill="#c9ccf5"/>
      ${[0, 1, 2].map(i => `<circle cx="130" cy="40" r="4" fill="${r.color}" class="bm-gota" style="animation-delay:${i * 0.3}s"/>`).join('')}`;
    const texto = raiz.querySelector('#bm-lab-texto');
    texto.innerHTML = `Agregando <b>${r.nombre}</b>…`;
    setTimeout(() => { liq.style.fill = mezclarColor(m.color, r.color); }, 500);
    const demora = r.calor ? 2600 : 1400;
    if (r.calor) setTimeout(() => { texto.innerHTML = '🔥 Calentando a baño María…'; }, 900);
    if (m.id === 'x') incognita.ensayos++;
    setTimeout(() => {
      if (!raiz.querySelector('#bm-gotero')) return;
      raiz.querySelector('#bm-gotero').innerHTML = '';
      if (r.capa && positivo) {
        raiz.querySelector('#bm-capa').style.height = '34px';
        liq.style.fill = 'rgba(255, 220, 220, 0.5)';
      } else {
        liq.style.fill = positivo ? r.positivo : r.negativo;
        if (positivo && r.id === 'benedict') raiz.querySelector('#bm-precipitado').style.cssText = 'height:22px; y:258px';
      }
      resultados[`${m.id}-${id}${hidro ? '-h' : ''}`] = positivo;
      const nota = m.id === 'x' ? '' : notaEnsayo(m, id, hidro, positivo);
      texto.innerHTML = `<span class="${positivo ? 'bm-pos' : 'bm-neg'}">${positivo ? '✔ Positivo' : '✖ Negativo'}</span> ${positivo ? r.si : r.no}${nota ? `<br><small>💡 ${nota}</small>` : ''}
        <br><button class="btn chico" id="bm-otro">🧽 Lavar el tubo y probar otra vez</button>`;
      texto.querySelector('#bm-otro').addEventListener('click', () => elegirMuestra(tubo.muestra));
      pintarTabla();
    }, demora);
  }

  function mezclarColor(a, b) {
    const n = c => c.startsWith('#') ? [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)) : c.match(/[\d.]+/g).slice(0, 3).map(Number);
    const [x, y] = [n(a), n(b)];
    return `rgb(${x.map((v, i) => Math.round(v * 0.4 + y[i] * 0.6)).join(',')})`;
  }

  function pintarTabla() {
    const celda = (m, r) => [false, true].map(h => {
      const v = resultados[`${m.id}-${r.id}${h ? '-h' : ''}`];
      if (v === undefined) return '';
      return v ? `<span class="bm-chip${h ? ' h' : ''}" style="background:${r.positivo}">+${h ? '<sub>H</sub>' : ''}</span>` : `<span class="bm-menos">−${h ? '<sub>H</sub>' : ''}</span>`;
    }).join(' ') || '<span class="bm-sin">·</span>';
    raiz.querySelector('#bm-tabla').innerHTML = `
      <thead><tr><th>Muestra</th>${REACTIVOS.map(r => `<th>${r.corto}</th>`).join('')}</tr></thead>
      <tbody>${muestrasActuales().map(m => `<tr class="${m.id === 'x' ? 'incog' : ''}"><td>${m.icono} ${m.nombre}</td>${REACTIVOS.map(r => `<td>${celda(m, r)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    pintarIncognita();
  }

  function pintarIncognita() {
    const panel = raiz.querySelector('#bm-incog-panel');
    if (!incognita) { panel.innerHTML = ''; return; }
    panel.innerHTML = `
      <div class="bm-incog">
        <h3>🔎 ¿Qué contiene la muestra X?</h3>
        <p class="bm-ayuda">Hiciste ${incognita.ensayos} ensayo${incognita.ensayos === 1 ? '' : 's'}. Para distinguir la sacarosa vas a necesitar la hidrólisis.</p>
        ${Object.entries(COMPONENTES).map(([k, t]) => `<label class="bm-check"><input type="checkbox" value="${k}" ${incognita.resuelta ? 'disabled' : ''}> ${t}</label>`).join('')}
        <button class="btn chico primario" id="bm-incog-ok" ${incognita.resuelta ? 'disabled' : ''}>Comprobar</button>
        <div id="bm-incog-fb"></div>
      </div>`;
    panel.querySelector('#bm-incog-ok').addEventListener('click', () => {
      const marcados = [...panel.querySelectorAll('input:checked')].map(i => i.value);
      const ok = marcados.length === incognita.comp.length && marcados.every(c => incognita.comp.includes(c));
      incognita.resuelta = true;
      panel.querySelectorAll('input').forEach(i => { i.disabled = true; });
      panel.querySelector('#bm-incog-ok').disabled = true;
      panel.querySelector('#bm-incog-fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'mal'}"><p class="fb-titulo">${ok ? `✅ ¡Correcto! Lo resolviste con ${incognita.ensayos} ensayos.` : '❌ No es correcto.'}</p>
        <p>La muestra X tenía: <b>${incognita.comp.map(c => COMPONENTES[c]).join(', ')}</b>.</p>
        <button class="btn chico" id="bm-incog-otra">Otra muestra incógnita</button></div>`;
      panel.querySelector('#bm-incog-otra').addEventListener('click', () => raiz.querySelector('#bm-incog').click());
    });
  }

  // =====================================================================
  // CLASIFICAR
  // =====================================================================

  function vistaClasificar() {
    const lista = conjunto === 'moleculas' ? MOLECULAS : ALIMENTOS;
    juego = { lista: Util.mezclar(lista).slice(0, 10), i: 0, puntos: 0, errores: [] };
    raiz.querySelector('#bm-vista').innerHTML = `
      <div class="segmentado" id="bm-conjunto">
        <button data-c="moleculas">🔬 Moléculas y funciones</button>
        <button data-c="alimentos">🍽️ Alimentos</button>
      </div>
      <div class="grid-juego">
        <div class="panel">
          <div class="marcador"><span id="bm-prog"></span><span id="bm-pts"></span></div>
          <div class="barra"><div id="bm-barra"></div></div>
          <div id="bm-juego"></div>
        </div>
        <aside class="panel bm-guia">
          <h2>Las cuatro familias</h2>
          <div class="bm-guia-item"><b>🍞 Carbohidratos · C, H, O</b><p>Energía rápida (glucosa, almidón, glucógeno) y estructura (celulosa, quitina).</p></div>
          <div class="bm-guia-item"><b>🧈 Lípidos · C, H, O (P)</b><p>Insolubles en agua. Reserva de energía (triglicéridos), membranas (fosfolípidos, colesterol) y hormonas esteroides.</p></div>
          <div class="bm-guia-item"><b>🥩 Proteínas · C, H, O, N (S)</b><p>Enzimas, transporte, defensa, hormonas, estructura y movimiento.</p></div>
          <div class="bm-guia-item"><b>🧬 Ácidos nucleicos · C, H, O, N, P</b><p>ADN y ARN: guardan y expresan la información genética. Sus monómeros son los nucleótidos.</p></div>
        </aside>
      </div>`;
    raiz.querySelectorAll('#bm-conjunto button').forEach(b => {
      b.classList.toggle('activo', b.dataset.c === conjunto);
      b.addEventListener('click', () => { conjunto = b.dataset.c; vistaClasificar(); });
    });
    mostrarItem();
  }

  function marcadorJuego() {
    raiz.querySelector('#bm-prog').textContent = `${Math.min(juego.i + 1, juego.lista.length)} de ${juego.lista.length}`;
    raiz.querySelector('#bm-pts').textContent = `⭐ ${juego.puntos}`;
    raiz.querySelector('#bm-barra').style.width = (juego.i / juego.lista.length * 100) + '%';
  }

  function mostrarItem() {
    marcadorJuego();
    const a = juego.lista[juego.i];
    const c = raiz.querySelector('#bm-juego');
    c.innerHTML = `
      <div class="tarjeta-caso"><div class="emoji-grande">${a.e}</div><p class="caso-texto">${a.n}</p></div>
      <p class="bm-pregunta">${conjunto === 'moleculas' ? '¿A qué grupo de biomoléculas pertenece?' : '¿Qué biomolécula tiene en mayor cantidad?'}</p>
      <div class="opciones">${Object.entries(GRUPOS[conjunto]).map(([k, t]) => `<button class="btn-opcion bm-op" data-r="${k}">${t}</button>`).join('')}</div>
      <div id="bm-fb"></div>`;
    c.querySelectorAll('.bm-op').forEach(b => b.addEventListener('click', () => responderItem(b.dataset.r)));
  }

  function responderItem(r) {
    const a = juego.lista[juego.i];
    const ok = r === a.r;
    const nombreGrupo = k => GRUPOS[conjunto][k].split(' ').slice(1).join(' ');
    if (ok) juego.puntos++; else juego.errores.push(a);
    raiz.querySelectorAll('.bm-op').forEach(b => {
      b.disabled = true;
      if (b.dataset.r === a.r) b.classList.add('correcta');
      else if (b.dataset.r === r) b.classList.add('incorrecta');
    });
    const ultimo = juego.i === juego.lista.length - 1;
    raiz.querySelector('#bm-fb').innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'mal'}">
        <p class="fb-titulo">${ok ? '✅ ¡Correcto!' : `❌ Es del grupo de los ${nombreGrupo(a.r).toLowerCase()}.`}</p>
        <p>${a.x}</p>
        <button class="btn primario" id="bm-sig">${ultimo ? 'Ver resultados' : 'Siguiente →'}</button>
      </div>`;
    raiz.querySelector('#bm-pts').textContent = `⭐ ${juego.puntos}`;
    raiz.querySelector('#bm-sig').addEventListener('click', () => {
      juego.i++;
      if (juego.i < juego.lista.length) return mostrarItem();
      marcadorJuego();
      raiz.querySelector('#bm-juego').innerHTML = `
        <div class="resultado-final">
          <div class="emoji-grande">${juego.puntos >= 7 ? '🎉' : '📚'}</div>
          <p class="puntaje-final">${juego.puntos} / ${juego.lista.length}</p>
          ${juego.errores.length ? `<ul class="lista-repaso">${juego.errores.map(e => `<li><b>${e.e} ${e.n}</b> → ${nombreGrupo(e.r)}. ${e.x}</li>`).join('')}</ul>` : '<p>¡Perfecto! 🏆</p>'}
          <button class="btn primario" id="bm-otra">Jugar otra ronda</button>
        </div>`;
      raiz.querySelector('#bm-otra').addEventListener('click', vistaClasificar);
    });
  }

  return { iniciar };
})();
