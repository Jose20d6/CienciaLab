// Navegación entre módulos (usa el # de la URL para poder compartir un enlace directo, p. ej. index.html#tabla).
(function () {
  const vistas = ['inicio', 'transformaciones', 'laboratorio', 'balanceo', 'tabla', 'atomos', 'invernadero', 'celula', 'ciclos', 'biomoleculas', 'alimentacion', 'nutricion'];
  const modulos = {
    transformaciones: Transformaciones,
    laboratorio: Laboratorio,
    balanceo: Balanceo,
    tabla: TablaPeriodica,
    atomos: Atomos,
    invernadero: Invernadero,
    celula: Celula,
    ciclos: Ciclos,
    biomoleculas: Biomoleculas, alimentacion: Alimentacion, nutricion: Nutricion,
  };
  const iniciados = {};

  function mostrar(id) {
    if (!vistas.includes(id)) id = 'inicio';
    vistas.forEach(v => { document.getElementById(v).hidden = v !== id; });
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('activo', b.dataset.go === id));
    if (modulos[id] && !iniciados[id]) {
      modulos[id].iniciar(document.getElementById(id));
      iniciados[id] = true;
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (b) location.hash = b.dataset.go;
  });
  window.addEventListener('hashchange', () => mostrar(location.hash.slice(1)));

  const raiz = document.documentElement;
  if (Util.leer('proyector', false)) raiz.classList.add('proyector');
  document.getElementById('btn-proyector').addEventListener('click', () => {
    Util.guardar('proyector', raiz.classList.toggle('proyector'));
  });

  // Modo oscuro: por defecto sigue al sistema; el botón lo fija a mano y se recuerda.
  const botonTema = document.getElementById('btn-tema');
  const sistemaOscuro = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const esOscuro = () => raiz.dataset.theme ? raiz.dataset.theme === 'dark' : !!(sistemaOscuro && sistemaOscuro.matches);
  const pintarBotonTema = () => {
    botonTema.textContent = esOscuro() ? '☀️' : '🌙';
    botonTema.title = esOscuro() ? 'Pasar a modo claro' : 'Pasar a modo oscuro';
  };
  const temaGuardado = Util.leer('tema', null);
  if (temaGuardado) raiz.dataset.theme = temaGuardado;
  pintarBotonTema();
  botonTema.addEventListener('click', () => {
    raiz.dataset.theme = esOscuro() ? 'light' : 'dark';
    Util.guardar('tema', raiz.dataset.theme);
    pintarBotonTema();
  });
  if (sistemaOscuro && sistemaOscuro.addEventListener) sistemaOscuro.addEventListener('change', pintarBotonTema);

  mostrar(location.hash.slice(1));
})();
