export class ProductsStore {

    page = 0;
    size = 10;
    totalPages = 0;
    totalCount = 0;

    query = "";
    categoryId = null;
    subcategoryId = null;

    stockFilter = null;
    lowStockThreshold = 5;

    async load() {
        const result = await window.api.products.list({
            page: this.page,
            size: this.size,
            q: this.query,
            cId: this.categoryId,
            scId: this.subcategoryId,
            stock: this.stockFilter
        });

        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;

        return result;
    }

    setQuery(q) {
        this.query = q || "";
        this.page = 0;
    }

    setCategoryId(id) {
        this.categoryId = id ?? null;
        this.page = 0;
    }

    setSubcategoryId(id) {
        this.subcategoryId = id ?? null;
        this.page = 0;
    }

    setStockFilter(v) {
        this.stockFilter = v || null;
        this.page = 0;
    }

    setPage(p) {
        this.page = Number(p) || 0;
    }

    nextPage() {
        if (this.page < this.totalPages - 1) this.page++;
    }

    prevPage() {
        if (this.page > 0) this.page--;
    }
    
}