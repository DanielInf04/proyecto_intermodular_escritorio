import { Alerts } from "../ui/alerts.ui.js";
import { Modals } from "../ui/modals.ui.js";
import { $, debounce } from "../utils/dom.js";
import { renderCategorySelectOptions, renderSubcategoryFilterOptions } from "../features/subcategories/subcategorySelects.js";

export class SubcategoriesView {
  renderCategories(categories){
    renderSubcategoryFilterOptions(categories);
    renderCategorySelectOptions(categories);
  }

  renderTable(items, categories){ /* pinta tabla */ }
  renderPagination(p){ /* pinta paginación */ }

  bindFilter(handler){
    const select = $("#subcat-category-filter");
    if (!select) return;
    select.addEventListener("change", () => {
      const v = select.value;
      handler(v ? Number(v) : null);
    });
  }

  bindSearch(handler){
    const input = $("#subcat-search");
    if (!input) return;
    const run = debounce(() => handler(input.value || ""), 300);
    input.addEventListener("input", run);
    input.addEventListener("keydown", (e)=> { if (e.key==="Enter") run(); });
  }

  bindPagination(handler){
    const el = $("#subcat-pagination");
    if (!el) return;
    el.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      handler(btn.dataset.action); // "prev" | "next"
    });
  }

  async confirmDelete(){
    const result = await Alerts.confirmDelete({ title:"¿Eliminar subcategoría?", text:"Esta acción no se puede deshacer" });
    return result.isConfirmed;
  }

  openEditModal(sub){ /* rellenar form + Modals.show(...) */ }
  closeEditModal(){ Modals.hide("modalSubcategoryEdit"); }

  showError(msg){ Alerts.error(msg); }
  showSuccess(msg){ Alerts.success(msg); }
}