import { ProductsStore } from "../../store/products.store.js";
import { CategoryStore } from "../../store/category.store.js";
import { SubCategoriesStore } from "../../store/subcategories.store.js";
import { Alerts } from "../../ui/alerts.ui.js";
import { Modals } from "../../ui/modals.ui.js";
import { $, debounce } from "../../utils/dom.js";

export class ProductsController {

    prStore = new ProductsStore();
    ctStore = new CategoryStore();
    scStore = new SubCategoriesStore();

    categories = [];
    subcategories = [];

    constructor(panelView) {
        this.view = panelView;
    }

    async init() {
        // Cargamos categorias y subcategorias
        await this.loadCategoriesAndSubCategories();

        await this.refresh();

        this.bindPagination();
        this.bindSearch();
        this.bindTableEvents();

        // Suscripciones para obtener categorias y subcategorias
        this.ctStore.subscribe((cats) => {
            
            //this.categories = cats;
        })
    }

    async loadCategoriesAndSubCategories() {
        this.categories = this.ctStore.getAll();
        console.log("Categorias en Products Controller: ", this.categories);
    }

    async refresh() {
        try {

            const result = await this.prStore.load();

            this.view.renderProductsTable(result.items);

            this.view.renderProductsPagination({
                page: this.prStore.page,
                totalPages: this.prStore.totalPages,
                totalCount: this.prStore.totalCount
            });
        } catch (err) {
            console.error(err);
            Alerts.error("No se pudieron cargar los productos");
        }
    }

    bindPagination() {
        const el = $("#products-pagination");
        if (!el) return;

        el.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        console.log("click", { btn, action: btn?.dataset?.action, disabled: btn?.disabled });

        if (!btn || btn.disabled) return;

        console.log("ANTES page:", this.prStore.page);

        if (btn.dataset.action === "prev") this.prStore.prevPage();
        if (btn.dataset.action === "next") this.prStore.nextPage();

        console.log("DESPUÉS page:", this.prStore.page);

        await this.refresh();
        });
    }

    bindSearch() {
        // Necesitas poner id al input en el HTML: id="products-search"
        const input = $("#products-search");
        if (!input) return;

        const run = debounce(async () => {
        // tu store debe tener setQuery. Si no lo tiene, te digo abajo cómo hacerlo.
        this.prStore.setQuery?.(input.value || "");
        // normalmente al buscar reseteas a página 0
        this.prStore.setPage?.(0);
        await this.refresh();
        }, 300);

        input.addEventListener("input", run);
        input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") run();
        });
    }

    bindTableEvents() {
        const tbody = $("#pane-products tbody");
        if (!tbody) return;

        tbody.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const action = btn.dataset.action;
        const id = Number(btn.dataset.productId);
        if (!id || Number.isNaN(id)) return;

        if (action === "delete") {
            const result = await Alerts.confirmDelete({
            title: "¿Eliminar producto?",
            text: "Esta acción no se puede deshacer",
            });
            if (!result.isConfirmed) return;

            await window.api.products.remove(id);
            await this.refresh();
            Alerts.success("Producto eliminado");
        }

        if (action === "edit") {
            const pr = await window.api.products.getById(id);
            console.log("Producto para editar: ", pr);
            console.log(pr.nombre);

            const form = $("#productEditForm");
            if (!form) return;

            // Ajusta nombres de inputs a tu HTML real:
            // ejemplo típico:
            form.elements.id.value = pr.id;
            form.elements.nombre.value = pr.nombre ?? "";
            form.elements.descripcion.value = pr.descripcion ?? "";
            form.elements.marca.value = pr.marca ?? "";
            form.elements.precio.value = pr.precio ?? "";
            form.elements.stock.value = pr.stock ?? "";
            form.elements.subcategoria_id.value = pr.subcategoria?.id ?? pr.subcategoriaId ?? "";

            // Si tienes input de imagen en editar:
            const editInput = $("#productImageInputEdit");
            if (editInput) editInput.value = "";

            const editLabel = $("#productImageNameEdit");
            if (editLabel) editLabel.textContent = "Ninguna imagen seleccionada";

            Modals.show("modalProductEdit"); // o "modalProduct" si usas uno solo
        }
        });
    }
}