import { categoryStore } from "../../store/category.store.js";
import { Alerts } from "../../ui/alerts.ui.js";
import { Modals } from "../../ui/modals.ui.js";

export class CategoriesController {
    
    constructor(panelView) {
        this.view = panelView;
    }

    async init() {
        await this.loadCategories();
        this.bindCategoryEvents();
        this.bindCategoryForm();
    }

    // Carga de categorias
    async loadCategories() {
        try {
            //const categories = await window.api.categories.list();
            const categories = await categoryStore.getAll();
            console.log("Categorias recibidas: ", categories);
            this.view.renderCategoriesTable(categories);
        } catch (err) {
            console.error("[CategoriesController] Error cargando categorías", err);
            Alerts.error("No se pudieron cargar las categorías");
        }
    }

    // Eventos de la tabla (EDIT / DELETE)
    bindCategoryEvents() {
        const tbody = document.querySelector("#pane-categories tbody");
        if (!tbody) return;

        tbody.addEventListener("click", async (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;

            const action = btn.dataset.action;
            const id = Number(btn.dataset.categoryId);

            if (!id || Number.isNaN(id)) return;

            if (action === "delete") {
            const result = await Alerts.confirmDelete({
                title: "¿Eliminar categoría?",
                text: "Esta acción no se puede deshacer",
            });

            if (!result.isConfirmed) return;

            try {
                await window.api.categories.remove(id);
                await categoryStore.refresh();
                await this.loadCategories();
                Alerts.success("Categoría eliminada");
            } catch (err) {
                console.error(err);
                Alerts.error("No se pudo eliminar la categoría");
            }
            }

            if (action === "edit") {
                await this.openEditCategory(id);
                Modals.show("modalCategoryEdit");
            }
        });
    }

    // CRUD
    async createCategory(data) {
        try {
            await window.api.categories.create(data);
            await categoryStore.refresh();
            await this.loadCategories();
            Modals.hide("modalCategoryCreate");
            Alerts.success("Categoría creada");
        } catch (err) {
            console.error("[CategoriesController] Error creando categoría", err);
            Alerts.error("No se pudo crear la categoría");
            throw err;
        }
    }

    async updateCategory(data) {
        try {
            await window.api.categories.update(Number(data.id), data);
            await categoryStore.refresh();
            await this.loadCategories();
            Modals.hide("modalCategoryEdit");
            Alerts.success("Categoría actualizada");
        } catch (err) {
            console.error("[CategoriesController] Error actualizando categoría", err);
            Alerts.error("No se pudo actualizar la categoría");
            throw err;
        }
    }

    // Formularios
    bindCategoryForm() {
        const createForm = document.getElementById("categoryCreateForm");
        const editForm = document.getElementById("categoryEditForm");

        createForm?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(createForm).entries());

            await this.createCategory(data);
            createForm.reset();
        });

        editForm?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(editForm).entries());

            await this.updateCategory(data);
            editForm.reset();
        });
    }

    // Precargar edición
    async openEditCategory(id) {
        const cat = await window.api.categories.getById(id);

        const form = document.getElementById("categoryEditForm");
        if (!form) return;

        form.elements.nombre.value = cat.nombre;
        form.elements.id.value = cat.id;
    }
}