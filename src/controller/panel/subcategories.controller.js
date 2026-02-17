import { SubCategoriesStore } from "../../store/subcategories.store.js";
import { categoryStore } from "../../store/category.store.js";
import { Alerts } from "../../ui/alerts.ui.js";
import { Modals } from "../../ui/modals.ui.js";
import { $, debounce, scrollToSubcatTop } from "../../utils/dom.js";
import { bindSubcategoryForms, bindSubcategoryImageInputs  } from "../../features/subcategories/subcategoryForm.js";
import { renderCategorySelectOptions, renderSubcategoryFilterOptions } from "../../features/subcategories/subcategorySelects.js";

export class SubCategoriesController {

  subStore = new SubCategoriesStore();
  categories = [];

  constructor(panelView) {
    this.view = panelView;
  }

  async init() {
    await this.loadCategories();
    renderSubcategoryFilterOptions(this.categories);
    this.bindCategoryFilter();
    renderCategorySelectOptions(this.categories);

    await this.refresh();

    this.bindPagination();
    this.bindSearch();
    this.bindTableEvents();

    bindSubcategoryImageInputs();

    bindSubcategoryForms({
      onCreate: (data) => this.createSubCategory(data),
      onUpdate: (data) => this.updateSubCategory(data),
      onUploadImage: (payload) => this.uploadSubCategoryImage(payload),
    });

    categoryStore.subscribe((cats) => {
      this.categories = cats;
      renderSubcategoryFilterOptions(this.categories);
      renderCategorySelectOptions(this.categories);
    });

  }

  async loadCategories() {
    this.categories = await categoryStore.getAll();
  }

  async refresh() {
    try {
      const result = await this.subStore.load();
      this.view.renderSubCategoriesTable(result.items, this.categories);
      this.view.renderSubCategoriesPagination({
        page: this.subStore.page,
        totalPages: this.subStore.totalPages,
        totalCount: this.subStore.totalCount,
      });
    } catch (err) {
      console.error(err);
      Alerts.error("No se pudieron cargar las subcategorías");
    }
  }

  bindCategoryFilter() {
    const select = $("#subcat-category-filter");
    if (!select) return;

    select.addEventListener("change", async () => {
      const value = select.value;
      this.subStore.setCategoryId(value ? Number(value) : null);
      await this.refresh();
    });
  }

  bindPagination() {
    const el = $("#subcat-pagination");
    if (!el) return;

    el.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.dataset.action === "prev") this.subStore.prevPage();
      if (btn.dataset.action === "next") this.subStore.nextPage();

      await this.refresh();
      scrollToSubcatTop();
    });
  }

  bindSearch() {
    const input = $("#subcat-search");
    if (!input) return;

    const run = debounce(async () => {
      this.subStore.setQuery(input.value || "");
      await this.refresh();
    }, 300);

    input.addEventListener("input", run);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") run();
    });
  }

  bindTableEvents() {
    const tbody = $("#pane-subcategories tbody");
    if (!tbody) return;

    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = Number(btn.dataset.subcategoryId);
      if (!id || Number.isNaN(id)) return;

      if (action === "delete") {
        const result = await Alerts.confirmDelete({
          title: "¿Eliminar subcategoría?",
          text: "Esta acción no se puede deshacer",
        });
        if (!result.isConfirmed) return;

        await window.api.subcategories.remove(id);
        await this.refresh();
        Alerts.success("Subcategoría eliminada");
      }

      if (action === "edit") {
        const sub = await window.api.subcategories.getById(id);

        const form = $("#subcategoryEditForm");
        if (!form) return;

        // cargar datos
        form.elements.nombre.value = sub.nombre ?? "";
        form.elements.categoria_id.value = sub.categoria?.id ?? "";
        form.elements.id.value = sub.id;

        // ✅ IMPORTANTE: resetear input file + label del edit
        const editInput = $("#imagenInputEdit");
        if (editInput) editInput.value = "";

        const editLabel = $("#imageNameEdit");
        if (editLabel) editLabel.textContent = "Ninguna imagen seleccionada";

        Modals.show("modalSubcategoryEdit");
      }
    });
  }

  async createSubCategory(data) {
    try {
      const created = await window.api.subcategories.create(data); // JSON
      await this.refresh();
      // NO cierres el modal aquí si quieres cerrarlo después de subir imagen
      return created;
    } catch (err) {
      console.error(err);
      Alerts.error("No se pudo crear la subcategoría");
      throw err;
    }
  }

  async updateSubCategory(data) {
    try {
      await window.api.subcategories.update(Number(data.id), {
        nombre: data.nombre,
        categoriaId: data.categoriaId,
      });
      await this.refresh();
      Modals.hide("modalSubcategoryEdit");
      Alerts.success("Subcategoría actualizada");
    } catch (err) {
      console.error(err);
      Alerts.error("No se pudo actualizar la subcategoría");
      throw err;
    }
  }

  async uploadSubCategoryImage({ id, file }) {
    try {
      const res = await window.api.subcategories.uploadImage({ id, file });
      await this.refresh();
      Modals.hide("modalSubcategoryCreate");
      Alerts.success("Subcategoría creada");
      return res;
    } catch (e) {
      console.error(e);
      Alerts.error("Se creó la subcategoría pero falló la imagen");
      throw e;
    }
  }
}