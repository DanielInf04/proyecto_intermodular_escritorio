import { categoryStore } from "../../model/stores/category.store.js";
import { categoriesService } from "../../model/services/categories.service.js";

export class CategoriesController {
  constructor(view) {
    this.view = view;
    this.store = categoryStore;
    this.service = categoriesService;
  }

  async init() {
    // Tabla: Edit/Delete (delegado al view)
    this.view.bindCategoryTableActions({
      onEdit: async (id) => {
        const cat = await this.service.getById(id);
        this.view.openCategoryEditModal(cat);
      },
      onDelete: async (id) => {
        const ok = await this.view.confirmDeleteCategory();
        if (!ok) return;

        try {
          await this.service.remove(id);

          await this.store.refresh?.();
          await this.refresh();

          this.view.showSuccess("Categoría eliminada");
        } catch (err) {
          console.error("Delete error:", err);

          let message = err?.data?.message;

          if (!message) {
            const raw = String(err?.message || "");
            const idx = raw.lastIndexOf("Error:");
            message = idx >= 0 ? raw.slice(idx + "Error:".length).trim() : raw;
          }

          this.view.showError(message || "No se pudo eliminar la categoría");
        }
      }
    });

    // Form: Create
    this.view.bindCategoryCreate(async (data) => {
      await this.create(data);
    });

    // Form: Update
    this.view.bindCategoryEdit(async (data) => {
      await this.update(data);
    });

    await this.refresh();
  }

  async refresh() {
    try {
      const categories = await this.store.getAll();
      this.view.renderCategoriesTable(categories);
    } catch (e) {
      console.error(e);
      this.view.showError("No se pudieron cargar las categorías");
    }
  }

  async create(data) {
    try {
      await this.service.create(data);
      await this.store.refresh?.();
      await this.refresh();
      this.view.closeCategoryCreateModal?.();
      this.view.showSuccess("Categoría creada");
    } catch (e) {
      console.error(e);
      this.view.showError("No se pudo crear la categoría");
      throw e;
    }
  }

  async update(data) {
    try {
      await this.service.update(Number(data.id), data);
      await this.store.refresh?.();
      await this.refresh();
      this.view.closeCategoryEditModal?.();
      this.view.showSuccess("Categoría actualizada");
    } catch (e) {
      console.error(e);
      this.view.showError("No se pudo actualizar la categoría");
      throw e;
    }
  }
}