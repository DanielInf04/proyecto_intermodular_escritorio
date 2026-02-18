//import { ProductsController } from "./products.controller.js";
//import { CategoriesController } from "./categories.controller.js";
//import { SubCategoriesController } from "./subcategories.controller.js";
import { ProductsController } from "./products.controller.js";
import { CategoriesController } from "./categories.controller.js";
import { SubCategoriesController } from "./subcategories.controller.js";

export class PanelController {
    constructor(view) {
        this.view = view;

        this.products = new ProductsController(view);
        this.categories = new CategoriesController(view);
        this.subcategories = new SubCategoriesController(view);
    }

    async init() {
        try {
             
            const user = await window.api.auth.getCurrentUser();

            if (user) this.view.renderUser(user);

        } catch (err) {
            console.error("Error inicializando panel: ", err);
        }

        await this.products.init();
        await this.categories.init();
        await this.subcategories.init();
    }
}