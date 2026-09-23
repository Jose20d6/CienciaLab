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
| 🔬 **Explorador de la célula** | La célula | Tocan los orgánulos de una célula animal o vegetal para acercarse y ver su función y una analogía; comparan ambas con una tabla y juegan a "¿Dónde está?". |
| ♻️ **Ciclos de la naturaleza** | Ciclos del agua, carbono y nitrógeno | Exploran un paisaje ilustrado donde gotas, vapor, copos y moléculas recorren cada proceso, siguen el viaje de una gota o un átomo eligiendo qué proceso ocurre en cada lugar, y ordenan las etapas. |
| 🧬 **Biomoléculas** | Química de la vida | Arman carbohidratos, proteínas, lípidos y ADN uniendo monómeros (cada enlace libera una molécula de agua; la hidrólisis la devuelve), pliegan proteínas y completan la hebra complementaria del ADN. En el laboratorio identifican biomoléculas en alimentos con Lugol, Benedict, Biuret y Sudán, y luego clasifican alimentos según su biomolécula principal. |

## Cómo usarla

No necesita instalación ni internet: basta con **abrir `index.html`** en cualquier navegador (Chrome, Firefox, Edge).

Para compartirla con los estudiantes por un enlace, se puede publicar gratis con **GitHub Pages**: *Settings → Pages → Deploy from a branch*.

- El botón **📽️** (modo proyector) agranda los textos para proyectar en el aula.
- Cada módulo tiene su propio enlace: `index.html#transformaciones`, `#laboratorio`, `#balanceo`, `#tabla`, `#atomos`, `#invernadero`, `#celula`, `#ciclos` o `#biomoleculas`.
- El progreso (cuaderno del laboratorio, ecuaciones resueltas, récord del desafío) se guarda en el navegador de cada dispositivo.

## Estructura

```
index.html            Página principal e inicio
css/styles.css        Estilos
js/util.js            Utilidades compartidas
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
js/app.js             Navegación
```

Para **agregar contenido**, edita las listas al principio de cada archivo: `CASOS` en transformaciones, `REACTIVOS` y `REACCIONES` en el laboratorio, y `ECUACIONES` en balanceo.
