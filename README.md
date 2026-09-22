# ⚗️ QuímicaLab

Aplicación web interactiva de química para estudiantes de secundaria (14 a 16 años), pensada para usar en clase.

## Módulos

| Módulo | Tema | Qué hacen los estudiantes |
|---|---|---|
| 🔄 **¿Físico o químico?** | Transformaciones de la materia | Clasifican situaciones cotidianas en rondas de 10, con explicación de cada respuesta y un repaso final de los errores. |
| 🧪 **Laboratorio virtual** | Reacciones químicas | Mezclan dos reactivos, observan la reacción animada (burbujas, color, precipitado, espuma, luz y temperatura), deciden si fue un cambio físico o químico y ven la ecuación, el tipo de reacción y las evidencias. Un cuaderno registra los 22 experimentos por descubrir. |
| ⚖️ **Balanceo de ecuaciones** | Ecuaciones químicas / Ley de Lavoisier | Ajustan coeficientes con una balanza visual y una tabla de conteo de átomos. Tiene 3 niveles y pistas. |
| 🧩 **Tabla periódica** | Tabla periódica | Exploran los 118 elementos coloreados por familia, por tipo (metal/no metal) o por estado. Cada ficha muestra protones, neutrones, configuración electrónica y modelo de Bohr (hasta Z = 20). Incluye un **desafío** de 10 preguntas con récord. |

## Cómo usarla

No necesita instalación ni internet: basta con **abrir `index.html`** en cualquier navegador (Chrome, Firefox, Edge).

Para compartirla con los estudiantes por un enlace, se puede publicar gratis con **GitHub Pages**: *Settings → Pages → Deploy from a branch*.

- El botón **📽️ Modo proyector** agranda los textos para proyectar en el aula.
- Cada módulo tiene su propio enlace: `index.html#transformaciones`, `#laboratorio`, `#balanceo` o `#tabla`.
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
js/app.js             Navegación
```

Para **agregar contenido**, edita las listas al principio de cada archivo: `CASOS` en transformaciones, `REACTIVOS` y `REACCIONES` en el laboratorio, y `ECUACIONES` en balanceo.
