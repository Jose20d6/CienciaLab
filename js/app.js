// Navegación entre módulos (usa el # de la URL para poder compartir un enlace directo, p. ej. index.html#tabla).
(function () {
  const vistas = ['inicio', 'transformaciones', 'laboratorio', 'balanceo', 'tabla', 'atomos', 'mezclas', 'estados', 'niveles', 'invernadero', 'celula', 'ciclos', 'biomoleculas', 'alimentacion', 'nutricion', 'mediciones', 'mru', 'electricidad'];
  const modulos = {
    transformaciones: Transformaciones,
    laboratorio: Laboratorio,
    balanceo: Balanceo,
    tabla: TablaPeriodica,
    atomos: Atomos,
    mezclas: Mezclas,
    estados: Estados,
    niveles: Niveles,
    invernadero: Invernadero,
    celula: Celula,
    ciclos: Ciclos,
    biomoleculas: Biomoleculas, alimentacion: Alimentacion, nutricion: Nutricion, mediciones: Mediciones, mru: MRU, electricidad: Electricidad,
  };
  const iniciados = {};

  function mostrar(id) {
    if (!vistas.includes(id)) id = 'inicio';
    vistas.forEach(v => { document.getElementById(v).hidden = v !== id; });
    document.querySelectorAll('.grupo').forEach(g => {
      const actual = g.querySelector(`.grupo-menu [data-go="${id}"]`);
      g.querySelectorAll('.grupo-menu button').forEach(b => b.classList.toggle('activo', b === actual));
      g.querySelector('.grupo-btn').classList.toggle('activo', !!actual);
      g.querySelector('.grupo-actual').textContent = actual ? '· ' + actual.textContent.replace(/^\S+\s/, '') : '';
    });
    cerrarMenus();
    if (modulos[id] && !iniciados[id]) {
      modulos[id].iniciar(document.getElementById(id));
      iniciados[id] = true;
    }
    window.scrollTo(0, 0);
  }

  // Menús desplegables de la barra: Química y Ciencias naturales.
  function cerrarMenus(excepto) {
    document.querySelectorAll('.grupo').forEach(g => {
      if (g === excepto) return;
      g.querySelector('.grupo-menu').hidden = true;
      g.querySelector('.grupo-btn').setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.grupo-btn').forEach(btn => btn.addEventListener('click', () => {
    const g = btn.parentElement, menu = g.querySelector('.grupo-menu');
    cerrarMenus(g);
    menu.hidden = !menu.hidden;
    btn.setAttribute('aria-expanded', String(!menu.hidden));
    if (!menu.hidden) (menu.querySelector('.activo') || menu.querySelector('button')).focus();
  }));
  document.addEventListener('keydown', e => {
    const abierto = document.querySelector('.grupo-menu:not([hidden])');
    if (!abierto) return;
    if (e.key === 'Escape') { cerrarMenus(); abierto.parentElement.querySelector('.grupo-btn').focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = [...abierto.querySelectorAll('button')], i = items.indexOf(document.activeElement);
      items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.grupo')) cerrarMenus();
    const b = e.target.closest('[data-go]');
    if (b) { location.hash = b.dataset.go; cerrarMenus(); }
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
