export function wireSidebarTabs({
  sidebarSelectors = ['#sidebarCatalog', '.side-nav:not(#sidebarCatalog)'],
  tabsSelector = '#catalogTabs',
  linkAttr = 'data-open-tab'
} = {}) {

  const BS = window.bootstrap;
  if (!BS?.Tab) {
    console.warn('Bootstrap no está disponible');
    return;
  }

  const getAllLinks = () => {
    return sidebarSelectors.flatMap(selector =>
      Array.from(document.querySelectorAll(`${selector} a[${linkAttr}]`))
    );
  };

  const setActive = (activeLink) => {
    getAllLinks().forEach(a => a.classList.remove('active'));
    activeLink.classList.add('active');
  };

  // Sidebar → Tabs
  getAllLinks().forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const paneSelector = link.getAttribute(linkAttr);

      const tabBtn = document.querySelector(
        `${tabsSelector} button[data-bs-target="${paneSelector}"]`
      );

      if (!tabBtn) return;

      BS.Tab.getOrCreateInstance(tabBtn).show();
      setActive(link);
    });
  });

  // Tabs → Sidebar
  document
    .querySelectorAll(`${tabsSelector} button[data-bs-toggle="pill"]`)
    .forEach(btn => {
      btn.addEventListener('shown.bs.tab', (e) => {
        const pane = e.target.getAttribute('data-bs-target');

        const link = getAllLinks().find(l =>
          l.getAttribute(linkAttr) === pane
        );

        if (link) setActive(link);
      });
    });
}

export function wireSidebarViews({
  viewCatalogId = 'view-catalog',
  viewUsersId = 'view-users',
  sidebarSelector = 'aside.sidebar'
} = {}) {
  const viewCatalog = document.getElementById(viewCatalogId);
  const viewUsers = document.getElementById(viewUsersId);

  if (!viewCatalog || !viewUsers) {
    console.warn('[views] faltan #view-catalog o #view-users');
    return;
  }

  const setSidebarActive = (activeLink) => {
    document.querySelectorAll(`${sidebarSelector} .side-nav a`).forEach(a => a.classList.remove('active'));
    activeLink?.classList.add('active');
  };

  const showView = (view) => {
    viewCatalog.classList.toggle('d-none', view !== 'catalog');
    viewUsers.classList.toggle('d-none', view !== 'users');
  };

  // Usuarios
  document.querySelectorAll(`${sidebarSelector} a[data-view="users"]`).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showView('users');
      setSidebarActive(link);
    });
  });

  // Si haces click en el catálogo (cualquier tab), vuelves a catálogo
  document.querySelectorAll(`${sidebarSelector} #sidebarCatalog a[data-open-tab]`).forEach(link => {
    link.addEventListener('click', () => {
      showView('catalog');
      // el active del catálogo lo gestiona wireSidebarTabs, pero no molesta reforzarlo
      setSidebarActive(link);
    });
  });

  // vista inicial
  showView('catalog');
}