// Hacer los import de las clases del modelo
//import { Stock } from '../model/stock.js';

// Hacer los imports de las clases de la vista
//import { View } from '../view/view.js';

export class Controller {

    // Access to view and model classes as private fields
    #model
    #view

    // Instantiating classes
    constructor() {
        this.#model = new Model();
        this.#view = new View();
    }

    // Initializing classes
    init() {
    }

    // Controller methods

}