import { Controller } from './src/controller/controller.js';

const controller = new Controller();

window.onload = () => {
         
  // addEventListeners de la aplicacion

  //document.getElementById("logo").addEventListener('click', () => controller.promptWindow());
  
  controller.init();
}