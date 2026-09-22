// Utilidades compartidas por todos los módulos.
const Util = {
  // Convierte "H2SO4" en "H<sub>2</sub>SO<sub>4</sub>". Los coeficientes iniciales ("2H2O") no se tocan.
  formula(texto) {
    return String(texto).replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');
  },

  mezclar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  elegir(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  },

  // localStorage puede no estar disponible (modo privado, archivos locales, etc.).
  leer(clave, porDefecto) {
    try {
      const v = localStorage.getItem('quimicalab:' + clave);
      return v ? JSON.parse(v) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  },

  guardar(clave, valor) {
    try {
      localStorage.setItem('quimicalab:' + clave, JSON.stringify(valor));
    } catch (e) { /* sin almacenamiento: la app sigue funcionando */ }
  },
};
