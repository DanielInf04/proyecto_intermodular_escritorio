import { SubCategoriesStore } from "../../model/stores/subcategories.store.js";
import { categoryStore } from "../../model/stores/category.store.js";
import { subcategoriesService } from "../../model/services/subcategories.service.js";

export class SubCategoriesController {
  constructor(view) {
    this.view = view;
    this.subStore = new SubCategoriesStore();
    this.categoryStore = categoryStore;
    this.subService = subcategoriesService;
    this.categories = [];
  }

  async init(){
    this.categories = await this.categoryStore.getAll();
    //console.log("init subcategoriescontroller: ", this.categories)
    this.view.renderSubcategoryCategoryFilter(this.categories);
    this.view.renderSubcategoryCategorySelectOptions(this.categories);

    this.view.bindFilter(async (categoryId) => {
      this.subStore.setCategoryId(categoryId);
      await this.refresh();
    });

    this.view.bindSearch(async (q) => {
      this.subStore.setQuery(q);
      await this.refresh();
    });

    this.view.bindPagination(async (dir) => {
      if (dir === "prev") this.subStore.prevPage();
      if (dir === "next") this.subStore.nextPage();
      await this.refresh();
    });

    // tabla: onEdit/onDelete
    this.view.bindTableActions({
      onEdit: async (id) => {
        const sub = await this.subService.getById(id);
        this.view.openEditModal(sub);
      },
      onDelete: async (id) => {
        const ok = await this.view.confirmDelete();
        if (!ok) return;

        try {
          await this.subService.remove(id);
          await this.refresh();
          this.view.showSuccess("Subcategoría eliminada");
        } catch (e) {
          let msg = e?.data?.message;

          if (!msg) {
            const raw = String(e?.message || "");
            const idx = raw.lastIndexOf("Error:");
            msg = idx >= 0 ? raw.slice(idx + "Error:".length).trim() : raw;
          }

          this.view.showError(msg || "No se pudo eliminar la subcategoría");
        }
      }
    });

    // Form: Create
    this.view.bindSubcategoryCreate(async (data) => {
      await this.create(data);
    });

    // Form: Update
    this.view.bindSubcategoryEdit(async (data) => {
      await this.update(data);
    });

    this.view.bindSubcategoryImageInputs();

    await this.refresh();
  }

  async create(data) {
    try {
      const created = await this.subService.create({
        nombre: data.nombre,
        categoriaId: Number(data.categoria_id),
      });

      // ✅ leer el archivo del input
      const file = document.querySelector("#imagenInputCreate")?.files?.[0];

      if (file) {
        // convertir File -> {bytes,name,type} si tu IPC lo requiere
        const buf = await file.arrayBuffer();
        const payloadFile = {
          name: file.name,
          type: file.type,
          bytes: Array.from(new Uint8Array(buf)),
        };

        await this.uploadSubcategoryImage({ id: created.id, file: payloadFile });
      } else {
        await this.refresh();
        this.view.closeSubcategoryCreateModal?.();
        this.view.showSuccess("Subcategoría creada (sin imagen)");
      }

      return created;
    } catch (e) {
      console.error(e);
      this.view.showError(e?.data?.message || e?.message || "No se pudo crear la subcategoría");
      throw e;
    }
  }

  async update(data) {
    try {
      const id = Number(data.id);

      await this.subService.update(id, {
        nombre: data.nombre,
        categoriaId: Number(data.categoria_id),
      });

      const file = document.querySelector("#imagenInputEdit")?.files?.[0];
      if (file) {
        const buf = await file.arrayBuffer();
        const payloadFile = {
          name: file.name,
          type: file.type,
          bytes: Array.from(new Uint8Array(buf)),
        };

        await window.api.subcategories.uploadImage({ id, file: payloadFile });
      }

      await this.refresh();
      this.view.closeSubcategoryEditModal?.();
      this.view.showSuccess("Subcategoría actualizada");
    } catch (e) {
      console.error(e);
      this.view.showError(e?.data?.message || e?.message || "No se pudo actualizar la subcategoría");
      throw e;
    }
  }

  async refresh(){
    try {
      const result = await this.subStore.load();
      this.view.renderSubCategoriesTable(result.items, this.categories);
      console.log("subcategoriesController", this.categories)
      this.view.renderSubCategoriesPagination({
        page: this.subStore.page,
        totalPages: this.subStore.totalPages,
        totalCount: this.subStore.totalCount,
      });
    } catch (e) {
      console.error(e);
      this.view.showError("No se pudieron cargar las subcategorías");
    }
  }

  async uploadSubcategoryImage({ id, file }) {
    const res = await window.api.subcategories.uploadImage({ id, file });
    await this.refresh();
    this.view.closeSubcategoryCreateModal?.(); // o no lo cierres aquí si lo llamas también desde edit
    this.view.showSuccess("Imagen de subcategoría subida");
    return res;
  }
}