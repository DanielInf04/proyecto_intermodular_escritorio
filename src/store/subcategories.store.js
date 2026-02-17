export class SubCategoriesStore {

    page = 0;
    size = 10;
    totalPages = 0;
    totalCount = 0;

    query = "";
    categoryId = null;

    async load() {
        const result = await window.api.subcategories.list({
            page: this.page,
            size: this.size,
            q: this.query,
            cId: this.categoryId
        });

        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;

        return result;
    }

    setQuery(q) {
        this.query = q || "";
        this.page = 0;
    }

    setCategoryId(cId) {
        this.categoryId = cId ?? null;
        this.page = 0;
    }

    nextPage() {
        if (this.page < this.totalPages - 1) this.page++;
    }

    prevPage() {
        if (this.page > 0) this.page--;
    }

}