import { Alerts } from "../../ui/alerts.ui.js";
import { Modals } from "../../ui/modals.ui.js";

export class SubCategoriesController {

  constructor(panelView) {
    this.view = panelView;
  }

  async init() {
    /*await this.loadCategories();
    renderCategorySelectOptions(this.categories);

    await this.refresh();

    this.bindPagination();
    this.bindSearch();
    this.bindTableEvents();*/

  }

  async refresh() {
    try {
      const result = await this.subStore.load();
      console.log(result);
      /*this.view.renderSubCategoriesTable(result.items);
      this.view.renderSubCategoriesPagination({
        page: this.subStore.page,
        totalPages: this.subStore.totalPages,
        totalCount: this.subStore.totalCount,
      });*/
    } catch (err) {
      console.error(err);
      Alerts.error("No se pudieron cargar las subcategorías");
    }
  }

  /*bindPagination() {
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
  }*/

}