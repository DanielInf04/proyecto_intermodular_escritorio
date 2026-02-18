import { ProductsStore } from "../../model/stores/products.store.js"
import { categoryStore } from "../../model/stores/category.store.js";
import { SubCategoriesStore } from "../../model/stores/subcategories.store.js";
import { bindProductForms, bindProductImageInputs  } from "../../features/products/productForm.js";

export class ProductsController {
  constructor(view) {
    this.view = view;

    this.prStore = new ProductsStore();
    this.ctStore = categoryStore; // singleton
    this.scStore = new SubCategoriesStore();

    this.categories = [];
    this.subcategories = [];
  }

  async init() {
    await this.loadCategories();

    this.view.bindProductsPagination(async (dir) => {
      if (dir === "prev") this.prStore.prevPage();
      if (dir === "next") this.prStore.nextPage();
      await this.refresh();
    });

    this.view.bindProductsSearch(async (q) => {
      this.prStore.setQuery(q || "");
      this.prStore.setPage(0);
      await this.refresh();
    });

    this.view.bindProductsFilters({
      onCategoryChange: async (categoryId) => {
        const subSel = document.getElementById("products-subcategory-filter");

        if (categoryId) {
          const subs = await window.api.subcategories.getByCategory(categoryId);
          this.subcategories = subs;

          this.view.renderProductsSubcategoryFilterOptions(this.subcategories);

          if (subSel) subSel.disabled = false; // habilitar
        } else {
          this.subcategories = [];
          this.view.renderProductsSubcategoryFilterOptions([]);

          if (subSel) subSel.disabled = true; // deshabilitar si no hay categoría
        }

        this.prStore.setCategoryId(categoryId);
        this.prStore.setSubcategoryId(null);
        this.prStore.setPage(0);
        await this.refresh();
      },

      onSubcategoryChange: async (subcategoryId) => {
        this.prStore.setSubcategoryId(subcategoryId);
        this.prStore.setPage(0);
        await this.refresh();
      },

      onStockChange: async (stock) => {
        this.prStore.setStockFilter?.(stock);
        this.prStore.setPage?.(0);
        await this.refresh();
      },
    });

    this.view.bindProductModalCategoryToSubcategories(async ({ categoryId, target }) => {
      if (!categoryId) {
        this.view.renderProductSubcategorySelectOptions([], { target });
        return;
      }
      const subs = await window.api.subcategories.getByCategory(categoryId);
      this.view.renderProductSubcategorySelectOptions(subs, { target });
    });

    this.view.bindProductsTableActions({
      onDelete: async (id) => {
        const ok = await this.view.confirmDeleteProduct();
        if (!ok) return;
        await window.api.products.remove(id);
        await this.refresh();
        this.view.showSuccess("Producto eliminado");
      },
      onEdit: async (id) => this.openEditProduct(id),
    });

    bindProductImageInputs();

    bindProductForms({
      onCreate: (data) => this.createProduct(data),
      onUpdate: (data) => this.updateProduct(data),
      onUploadImage: (payload) => this.uploadProductImage(payload),
    });

    await this.refresh();
  }

  async loadCategories() {
    this.categories = await this.ctStore.getAll();

    this.view.renderProductCategorySelectOptions(this.categories);
    this.view.renderProductsCategoryFilterOptions(this.categories);

    this.view.renderProductsSubcategoryFilterOptions([]);
    this.view.renderProductSubcategorySelectOptions([], { target: "create" });
    this.view.renderProductSubcategorySelectOptions([], { target: "edit" });
  }

  async refresh() {
    try {
      const result = await this.prStore.load();

      this.view.renderProductsTable(result.items);
      this.view.renderProductsPagination({
        page: this.prStore.page,
        totalPages: this.prStore.totalPages,
        totalCount: this.prStore.totalCount,
      });
    } catch (e) {
      console.error(e);
      this.view.showError("No se pudieron cargar los productos");
    }
  }

  async openEditProduct(id) {
    const pr = await window.api.products.getById(id);

    const subcatId = pr.subCategoriaId ?? pr.subcategoriaId ?? null;
    if (!subcatId) {
      this.view.showError("El producto no trae subcategoría");
      return;
    }

    const subcat = await window.api.subcategories.getById(subcatId);
    const categoryId =
      subcat.categoriaId ?? subcat.categoria_id ?? subcat?.categoria?.id ?? null;

    if (categoryId) {
      const subs = await window.api.subcategories.getByCategory(categoryId);
      this.view.renderProductSubcategorySelectOptions(subs, { target: "edit" });
    } else {
      this.view.renderProductSubcategorySelectOptions([], { target: "edit" });
    }

    this.view.openProductEditModal({
      product: pr,
      categoryId,
      subcategoryId: subcatId,
    });
  }

  async createProduct(data) {
    const created = await window.api.products.create(data);
    await this.refresh();
    return created;
  }

  async updateProduct(data) {
    await window.api.products.update(Number(data.id), {
      nombre: data.nombre,
      marca: data.marca,
      precio: data.precio,
      stock: data.stock,
      subcategoriaId: data.subcategoriaId,
      descripcion: data.descripcion,
    });

    await this.refresh();
    this.view.closeProductEditModal?.();
    this.view.showSuccess("Producto actualizado");
  }

  async uploadProductImage({ id, file }) {
    const res = await window.api.products.uploadImage({ id, file });
    await this.refresh();
    this.view.closeProductCreateModal?.();
    this.view.showSuccess("Producto creado");
    return res;
  }
}