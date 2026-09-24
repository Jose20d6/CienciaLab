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

  // Toma n elementos distintos de la lista, prefiriendo los que no salieron en rondas anteriores.
  // Recién cuando se agotan todos vuelve a empezar, así las preguntas no se repiten entre rondas.
  tomar(clave, lista, n, id = x => (x && (x.id || x.n || x.t)) || String(x)) {
    n = Math.min(n, lista.length);
    const vistos = new Set(Util.leer('vistos:' + clave, []));
    let nuevos = Util.mezclar(lista.filter(x => !vistos.has(id(x))));
    if (nuevos.length < n) {
      const elegidos = new Set(nuevos.map(id));
      const resto = Util.mezclar(lista.filter(x => !elegidos.has(id(x))));
      nuevos = nuevos.concat(resto).slice(0, n);
      vistos.clear();
    } else nuevos = nuevos.slice(0, n);
    nuevos.forEach(x => vistos.add(id(x)));
    Util.guardar('vistos:' + clave, [...vistos]);
    return nuevos;
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
