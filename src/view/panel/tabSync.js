export function wireSidebarTabs({
  sidebarSelector = '#sidebarCatalog',
  tabsSelector = '#catalogTabs',
  linkAttr = 'data-open-tab'
} = {}) {
  const setActive = (activeLink) => {
    document
      .querySelectorAll(`${sidebarSelector} a`)
      .forEach((a) => a.classList.remove('active'));
    activeLink.classList.add('active');
  };

  // Sidebar -> Tabs
  document.querySelectorAll(`[${linkAttr}]`).forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const paneSelector = link.getAttribute(linkAttr);
      const tabBtn = document.querySelector(
        `${tabsSelector} button[data-bs-target="${paneSelector}"]`
      );
      if (!tabBtn) return console.warn('[tabSync] No tab for', paneSelector);

      bootstrap.Tab.getOrCreateInstance(tabBtn).show();
      setActive(link);
    });
  });

  // Tabs -> Sidebar
  document
    .querySelectorAll(`${tabsSelector} button[data-bs-toggle="pill"]`)
    .forEach((btn) => {
      btn.addEventListener('shown.bs.tab', (e) => {
        const pane = e.target.getAttribute('data-bs-target');
        const link = document.querySelector(
          `${sidebarSelector} [${linkAttr}="${pane}"]`
        );
        if (link) setActive(link);
      });
    });
}