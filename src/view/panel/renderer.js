//import { PanelView } from './panelView.js';
import { PanelView } from './panelView2.js';
import { PanelController } from '../../controller/panel/panel.controller.js';

document.addEventListener('DOMContentLoaded', async () => {
  const view = new PanelView();
  const controller = new PanelController(view);

  view.init();

  document.getElementById('btnLogout')?.addEventListener('click', async () => {
    await window.api.auth.logout();
    await window.api.ui.logoutToLogin();
  });

  await controller.init();
});