import { ProductsStore } from "../../store/products.store.js";
import { CategoryStore } from "../../store/category.store.js";
import { SubCategoriesStore } from "../../store/subcategories.store.js";
import { Alerts } from "../../ui/alerts.ui.js";
import { Modals } from "../../ui/modals.ui.js";
import { $, debounce } from "../../utils/dom.js";
import { bindProductForms, bindProductImageInputs } from "../../features/products/productForm.js";
import { 
    renderCategorySelectOptions, 
    renderSubcategorySelectOptions,
    renderProductCategoryFilterOptions,
    renderProductSubcategoryFilterOptions
} from "../../features/products/productSelects.js";

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
        console.log("ProductsController init iniciado...")
        // Cargamos categorias y subcategorias
        await this.loadCategoriesAndSubCategories();

        await this.refresh();

        this.bindModalCategoryToSubcategories();

        this.bindFilters();
        this.bindPagination();
        this.bindSearch();
        this.bindTableEvents();

        bindProductImageInputs();

        bindProductForms({
            onCreate: (data) => this.createProduct(data),
            onUpdate: (data) => this.updateProduct(data),
            onUploadImage: (payload) => this.uploadProductImage(payload),
        });
        

        // Suscripciones para obtener categorias y subcategorias
        

        /*this.scStore.subscribe((subs) => {
            this.subcategories = subs;
            console.log("Subcategorias recibidas: ", this.subcategories)
        })*/
    }

    async loadCategoriesAndSubCategories() {
        this.categories = await this.ctStore.getAll();

        console.log("CATEGORIES:", this.categories);
        console.log("DOM select filter:", $("#products-category-filter"));
        console.log("DOM select create:", $("#productCategoryCreate"));
        console.log("DOM select edit:", $("#productCategoryEdit"));

        renderCategorySelectOptions(this.categories);
        renderProductCategoryFilterOptions(this.categories);
        renderProductSubcategoryFilterOptions([]); // vacío al inicio

        // subcategorías inicialmente vacías
        renderSubcategorySelectOptions([], { target: "create" });
        renderSubcategorySelectOptions([], { target: "edit" });
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

    bindFilters() {
        const catSel = $("#products-category-filter");
        const subSel = $("#products-subcategory-filter");
        const stockSel = $("#products-stock-filter");

        if (catSel) {
            catSel.addEventListener("change", async () => {
            const categoryId = catSel.value ? Number(catSel.value) : null;

            // si eliges categoría, carga subcategorías de esa categoría
            if (categoryId) {
                //const subs = await window.api.subcategories.getAll({ categoryId }); 
                const subs = await window.api.subcategories.getByCategory(categoryId);
                console.log("Subcategorias recibidas de la categoria seleccionada: ", subs)
                // ↑ ajusta a tu API real. Si no tienes este endpoint, dime cuál tienes y lo adapto.
                this.subcategories = subs;
                renderProductSubcategoryFilterOptions(this.subcategories);

                // opcional: reset subcategoria al cambiar de categoría
                if (subSel) subSel.value = "";
            } else {
                this.subcategories = [];
                renderProductSubcategoryFilterOptions([]);
                if (subSel) subSel.value = "";
            }

            // aquí aplicarías filtros al store
            this.prStore.setCategoryId?.(categoryId);
            this.prStore.setSubcategoryId?.(null);
            this.prStore.setPage?.(0);
            await this.refresh();
            });
        }

        if (subSel) {
            subSel.addEventListener("change", async () => {
            const subcategoryId = subSel.value ? Number(subSel.value) : null;

            this.prStore.setSubcategoryId?.(subcategoryId);
            this.prStore.setPage?.(0);
            await this.refresh();
            });
        }

        if (stockSel) {
            stockSel.addEventListener("change", async () => {
            const stock = stockSel.value || null; // "in" | "out" | "low" | null

            this.prStore.setStockFilter?.(stock);
            this.prStore.setPage?.(0);
            await this.refresh();
            });
        }
    }

    bindModalCategoryToSubcategories() {
        const bind = (categorySelectId, subSelectTarget) => {
            const catSel = $(categorySelectId);
            if (!catSel) return;

            catSel.addEventListener("change", async () => {
            const categoryId = catSel.value ? Number(catSel.value) : null;

            if (!categoryId) {
                renderSubcategorySelectOptions([], { target: subSelectTarget });
                return;
            }

            const subs = await window.api.subcategories.getByCategory(categoryId);
            renderSubcategorySelectOptions(subs, { target: subSelectTarget });
            });
        };

        bind("#productCategoryCreate", "create");
        bind("#productCategoryEdit", "edit");
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
            console.log("Producto para editar:", pr);

            const form = $("#productEditForm");
            if (!form) return;

            // 1) subcategoría del producto (TU CASO)
            const subcatId = pr.subCategoriaId ?? null;
            if (!subcatId) {
                Alerts.error("El producto no trae subcategoría");
                return;
            }

            // 2) pedir subcategoría para obtener categoriaId
            const subcat = await window.api.subcategories.getById(subcatId);
            const categoryId = subcat.categoriaId ?? null;

            // 3) cargar campos normales
            form.elements.id.value = pr.id;
            form.elements.nombre.value = pr.nombre ?? "";
            form.elements.descripcion.value = pr.descripcion ?? "";
            form.elements.marca.value = pr.marca ?? "";
            form.elements.precio.value = pr.precio ?? "";
            form.elements.stock.value = pr.stock ?? "";

            // 4) setear categoría en el select del modal edit
            if (form.elements.categoria_id) {
                form.elements.categoria_id.value = categoryId ? String(categoryId) : "";
            }

            // 5) cargar subcategorías de esa categoría y seleccionar la actual
            if (categoryId) {
                const subs = await window.api.subcategories.getByCategory(categoryId);
                renderSubcategorySelectOptions(subs, { target: "edit" });
            } else {
                renderSubcategorySelectOptions([], { target: "edit" });
            }

            form.elements.subcategoria_id.value = String(subcatId);

            // reset file + label
            const editInput = $("#productImageInputEdit");
            if (editInput) editInput.value = "";

            const editLabel = $("#productImageNameEdit");
            if (editLabel) editLabel.textContent = "Ninguna imagen seleccionada";

            Modals.show("modalProductEdit");
        }
        });
    }

    async createProduct(data) {
        try {
            const created = await window.api.products.create(data);
            await this.refresh();

            return created;
        } catch (err) {
            console.error(err);
            Alerts.error("No se pudo crear el producto");
            throw err;
        }
    }

    async updateProduct(data) {
        try {
            await window.api.products.update(Number(data.id), {
            nombre: data.nombre,
            marca: data.marca,
            precio: data.precio,
            stock: data.stock,
            subcategoriaId: data.subcategoriaId,
            descripcion: data.descripcion,
        });
            await this.refresh();
            Modals.hide("modalProductEdit");
            Alerts.success("Producto actualizado");
        } catch (err) {
            console.error(err);
            Alerts.error("No se pudo actualizar el producto");
            throw err;
        }
    }

    async uploadProductImage({ id, file }) {
        try {
            const res = await window.api.products.uploadImage({ id, file });

            await this.refresh();
            Modals.hide("modalProductCreate");
            Alerts.success("Producto creado");
            return res;
        } catch (err) {
            console.error(err);
            Alerts.error("Se creó el producto pero falló la imagen");
            throw err;
        }
    }

}