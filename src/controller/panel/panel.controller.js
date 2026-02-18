//import { ProductsController } from "./products.controller.js";
//import { CategoriesController } from "./categories.controller.js";
//import { SubCategoriesController } from "./subcategories.controller.js";
import { ProductsController } from "./products.controller.js";
import { CategoriesController } from "./categories.controller.js";
import { SubCategoriesController } from "./subcategories.controller.js";

export class PanelController {
    constructor(view) {
        this.products = new ProductsController(view);
        this.categories = new CategoriesController(view);
        this.subcategories = new SubCategoriesController(view);
    }

    async init() {
        await this.products.init();
        await this.categories.init();
        await this.subcategories.init();
    }
}