// Configuración de Firebase para el Quiz.
// Pegá acá los datos de tu proyecto: Consola de Firebase → ⚙️ Configuración del proyecto → Tus apps → «Configuración del SDK».
// Estos datos NO son contraseñas: identifican el proyecto y es normal que estén en una página pública.
// Lo que protege los datos son las reglas de Firestore (archivo firestore.rules).
// Mientras estén vacíos, el quiz funciona en «modo de prueba» y guarda los resultados solo en este dispositivo.
window.CIENCIALAB_FIREBASE = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

// Única cuenta que puede entrar al panel docente. Tiene que ser la misma que figura en firestore.rules.
window.CIENCIALAB_DOCENTE = 'linkin.lp2001@gmail.com';
