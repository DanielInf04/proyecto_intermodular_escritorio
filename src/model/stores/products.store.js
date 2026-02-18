export class ProductsStore {
  constructor() {
    this.items = [];

    this.page = 0;
    this.size = 10;
    this.totalPages = 0;
    this.totalCount = 0;

    this.query = "";
    this.categoryId = null;
    this.subcategoryId = null;
    this.stockFilter = null; // "in" | "out" | "low" | null
  }

  // =========================
  // SETTERS
  // =========================
  setPage(page) {
    this.page = page ?? 0;
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
    }
  }

  setQuery(q) {
    this.query = q ?? "";
  }

  setCategoryId(id) {
    this.categoryId = id ?? null;
  }

  setSubcategoryId(id) {
    this.subcategoryId = id ?? null;
  }

  setStockFilter(stock) {
    this.stockFilter = stock ?? null;
  }

  // =========================
  // LOAD (principal)
  // =========================
  async load() {
    const params = {
      page: this.page,
      size: this.size,
      q: this.query || undefined,
      cId: this.categoryId || undefined,
      scId: this.subcategoryId || undefined,
      stock: this.stockFilter || undefined,
    };

    // limpia undefined para no enviar basura
    Object.keys(params).forEach(
      (k) => params[k] === undefined && delete params[k]
    );

    const result = await window.api.products.list(params);

    /**
     * Esperamos algo así:
     * {
     *   items: [],
     *   totalPages: number,
     *   totalCount: number
     * }
     */

    this.items = result.items ?? [];
    this.totalPages = result.totalPages ?? 1;
    this.totalCount = result.totalCount ?? this.items.length;

    return {
      items: this.items,
      totalPages: this.totalPages,
      totalCount: this.totalCount,
    };
  }
}
