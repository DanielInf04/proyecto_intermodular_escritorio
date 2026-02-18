export class UsersStore {

    page = 0;
    size = 10;
    totalPages = 0;
    totalCount = 0;
    query = "";

    async load() {
        const result = await window.api.users.list({
            page: this.page,
            size: this.size,
            q: this.query
        });

        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;

        return result;
    }

    setQuery(q) {
        this.query = q || "";
        this.page = 0;
    }

    nextPage() {
        if (this.page < this.totalPages - 1) this.page++;
    }

    prevPage() {
        if (this.page > 0) this.page--;
    }

}