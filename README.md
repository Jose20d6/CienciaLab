# ⚗️ QuímicaLab

Aplicación web interactiva de química para estudiantes de secundaria (14 a 16 años), pensada para usar en clase.

## Módulos

| Módulo | Tema | Qué hacen los estudiantes |
|---|---|---|
| 🔄 **¿Físico o químico?** | Transformaciones de la materia | Clasifican situaciones cotidianas en rondas de 10, con explicación de cada respuesta y un repaso final de los errores. |
| 🧪 **Laboratorio virtual** | Reacciones químicas | Mezclan dos reactivos, observan la reacción animada (burbujas, color, precipitado, espuma, luz y temperatura), deciden si fue un cambio físico o químico y ven la ecuación, el tipo de reacción y las evidencias. Un cuaderno registra los 22 experimentos por descubrir. |
| ⚖️ **Balanceo de ecuaciones** | Ecuaciones químicas / Ley de Lavoisier | Ajustan coeficientes con una balanza visual y una tabla de conteo de átomos. Tiene 3 niveles y pistas. |
| 🧩 **Tabla periódica** | Tabla periódica | Exploran los 118 elementos coloreados por familia, por tipo (metal/no metal) o por estado. Cada ficha muestra protones, neutrones, configuración electrónica y modelo de Bohr (hasta Z = 20). Incluye un **desafío** de 10 preguntas con récord. |
| ⚛️ **Átomos y moléculas** | Estructura de la materia | Arman átomos con protones, neutrones y electrones (hasta Z = 20) y ven qué elemento, isótopo o ion formaron, si el núcleo es estable y su notación con número másico y atómico. Luego unen átomos (H, C, N, O, S, Cl) con enlaces simples, dobles o triples respetando cuántos enlaces forma cada uno. Ambos modos tienen misiones. |
| 🌍 **Efecto invernadero** | Cambio climático | Suben o bajan el CO₂ (con un deslizador, momentos históricos o acciones humanas) y ven la radiación solar y el calor en la atmósfera, la temperatura media año a año en un gráfico y sus consecuencias. Modelo simplificado: +3 °C por cada duplicación del CO₂. |
| 🔬 **Explorador de la célula** | La célula | Tocan los orgánulos de una célula animal o vegetal para acercarse y ver su función y una analogía; comparan ambas con una tabla, juegan a "¿Dónde está?" y siguen **rutas en la célula** (la insulina desde el núcleo hasta afuera, la glucosa hasta la mitocondria, una bacteria hasta el lisosoma, la energía del Sol y el agua hasta la vacuola). |
| ♻️ **Ciclos de la naturaleza** | Ciclos del agua, carbono y nitrógeno | Exploran un paisaje ilustrado donde gotas, vapor, copos y moléculas recorren cada proceso, siguen el viaje de una gota o un átomo eligiendo qué proceso ocurre en cada lugar, y ordenan las etapas. |
| 🧬 **Biomoléculas** | Química de la vida (5.º año) | **Armar:** polisacáridos con α/β-glucosa y ramificaciones α(1→6) (amilosa, amilopectina, glucógeno, celulosa), proteínas con estructura primaria, hélice α y terciaria (núcleo hidrofóbico, puentes disulfuro y salinos), triglicéridos con ácidos grasos reales (16:0, 18:1 cis/trans, 18:2), fosfolípidos y saponificación, y ADN antiparalelo con %GC y temperatura de fusión. **Del gen a la proteína:** transcripción, traducción con el código genético y mutaciones. **Enzimas:** efecto de la temperatura, el pH, el sustrato y un inhibidor, con gráfico de mediciones. **Glucemia:** simulador de la respuesta a distintos alimentos (índice glucémico), con insulina, glucagón, glucógeno, ejercicio y diabetes tipo 1 y 2. **Laboratorio:** Lugol, Benedict, Biuret y Sudán, con hidrólisis previa y muestra incógnita. **Clasificar** moléculas por función o alimentos, y unir cada función de las proteínas con su descripción y un ejemplo. |
| 🥗 **Alimentación saludable** | Nutrición | Exploran la **pirámide nutricional** (EE. UU., 1992), el **óvalo nutricional** (Argentina, 2000) y el **plato** de la Gráfica de la Alimentación Diaria (Guías Alimentarias para la Población Argentina, 2016): nutrientes y función de cada grupo y los 10 mensajes de las Guías. Comparan los tres modelos, arman un día de comidas y reciben una devolución, y clasifican alimentos en los grupos del plato. |
| 🫀 **Sistemas de la nutrición** | Cuerpo humano (2.º año) | **Explorar el cuerpo:** tocan cada sistema (digestivo, respiratorio, circulatorio y excretor) y la célula para ver sus órganos, qué recibe, qué entrega y una analogía. **Seguí el viaje:** acompañan a la glucosa, el oxígeno, el dióxido de carbono, la urea y la fibra eligiendo por qué sistema pasa cada una. **¿Qué pasa si…?:** desconectan un sistema y miran cómo cambian los nutrientes, el oxígeno, los desechos y la energía de las células. |

## Cómo usarla

No necesita instalación ni internet: basta con **abrir `index.html`** en cualquier navegador (Chrome, Firefox, Edge).

Para compartirla con los estudiantes por un enlace, se puede publicar gratis con **GitHub Pages**: *Settings → Pages → Deploy from a branch*.

- El botón **📽️** (modo proyector) agranda los textos para proyectar en el aula.
- El botón **🌙/☀️** cambia entre modo claro y oscuro (por defecto sigue la configuración del dispositivo).
- En las actividades con preguntas, cada ronda trae preguntas distintas y no se repiten las de la ronda anterior.
- Cada módulo tiene su propio enlace: `index.html#transformaciones`, `#laboratorio`, `#balanceo`, `#tabla`, `#atomos`, `#invernadero`, `#celula`, `#ciclos`, `#biomoleculas`, `#alimentacion` o `#nutricion`.
- El progreso (cuaderno del laboratorio, ecuaciones resueltas, récord del desafío) se guarda en el navegador de cada dispositivo.

## Estructura

```
index.html            Página principal e inicio
css/styles.css        Estilos
js/util.js            Utilidades compartidas
js/arte.js            Piezas de ilustración compartidas (animales, árboles, fábrica)
js/datos/elementos.js Datos de los 118 elementos
js/transformaciones.js
js/laboratorio.js     Reactivos y reacciones (fáciles de ampliar)
js/balanceo.js        Lista de ecuaciones por nivel
js/tabla.js
js/atomos.js          Átomos y moléculas (misiones y moléculas conocidas)
js/invernadero.js     Simulación del efecto invernadero
js/celula.js          Orgánulos de las células animal y vegetal
js/ciclos.js          Lugares, procesos y etapas de cada ciclo
js/biomoleculas.js    Monómeros, reactivos de laboratorio y alimentos
js/alimentacion.js    Guías alimentarias, alimentos ilustrados y actividades
js/nutricion.js      Sistemas de la nutrición: cuerpo, viajes y sistemas desconectados
js/app.js             Navegación
```

Para **agregar contenido**, edita las listas al principio de cada archivo: `CASOS` en transformaciones, `REACTIVOS` y `REACCIONES` en el laboratorio, y `ECUACIONES` en balanceo.
