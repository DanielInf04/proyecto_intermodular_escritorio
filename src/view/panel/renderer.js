import { PanelView } from './panelView.js';
//import { PanelController } from "../../controller/panel.controller.js";ç
import { PanelController } from '../../controller/panel/panel.controller.js';

document.addEventListener('DOMContentLoaded', async () => {
  const view = new PanelView();
  const controller = new PanelController(view);

  view.init();
  await controller.init();
});