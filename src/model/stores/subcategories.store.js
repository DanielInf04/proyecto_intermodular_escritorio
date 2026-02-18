import { subcategoriesService } from "../services/subcategories.service.js";

export class SubCategoriesStore {
  page = 0;
  size = 10;
  totalPages = 0;
  totalCount = 0;

  query = "";
  categoryId = null;

  items = [];

  async load() {
    const result = await subcategoriesService.list({
      page: this.page,
      query: this.query,
      q: this.query,
      cId: this.categoryId
    });
    console.log("nuevo subcategories.store: ", result);

    this.items = result.items;
    this.totalPages = result.totalPages;
    this.totalCount = result.totalCount;

    return result;
  }

  setQuery(q){ this.query = q; this.page = 0; }
  setCategoryId(id){ this.categoryId = id; this.page = 0; }
  nextPage(){ if (this.page < this.totalPages - 1) this.page++; }
  prevPage(){ if (this.page > 0) this.page--; }
}