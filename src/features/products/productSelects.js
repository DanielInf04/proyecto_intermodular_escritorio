import { $ } from "../../utils/dom.js";

// ✅ Filtro de categorías (panel productos)
export function renderProductCategoryFilterOptions(categories, selectedId = null) {
  const sel = $("#products-category-filter");
  if (!sel) return;

  sel.innerHTML = "";

  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = "Filtrar por categoría";
  ph.selected = true;
  sel.appendChild(ph);

  for (const c of categories) {
    const opt = document.createElement("option");
    opt.value = c.getId();
    opt.textContent = c.getName();
    sel.appendChild(opt);
  }

  if (selectedId != null) sel.value = String(selectedId);
}

// ✅ Filtro de subcategorías (panel productos)
export function renderProductSubcategoryFilterOptions(subcategories, selectedId = null) {
  const sel = $("#products-subcategory-filter");
  if (!sel) return;

  sel.innerHTML = "";

  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = "Filtrar por subcategoría";
  ph.selected = true;
  sel.appendChild(ph);

  for (const sc of subcategories) {
    const opt = document.createElement("option");
    opt.value = String(sc.id);
    opt.textContent = sc.nombre;
    sel.appendChild(opt);
  }

  // habilitar/deshabilitar según haya opciones
  sel.disabled = subcategories.length === 0;

  if (selectedId != null) sel.value = String(selectedId);
}

export function renderCategorySelectOptions(categories) {
  const selects = [
    $("#productCategoryCreate"),
    $("#productCategoryEdit"),
  ].filter(Boolean);

  for (const sel of selects) {
    const keep = sel.querySelector("option[value='']") || sel.querySelector("option[disabled]");
    sel.innerHTML = "";
    if (keep) sel.appendChild(keep);

    for (const c of categories) {
      const opt = document.createElement("option");
      opt.value = c.getId();
      opt.textContent = c.getName();
      sel.appendChild(opt);
    }
  }
}

export function renderSubcategorySelectOptions(subcategories, { target } = {}) {
  const sel =
    target === "edit" ? $("#productSubcategoryEdit") : $("#productSubcategoryCreate");

  if (!sel) return;

  const keep = sel.querySelector("option[value='']") || sel.querySelector("option[disabled]");
  sel.innerHTML = "";
  if (keep) sel.appendChild(keep);

  for (const sc of subcategories) {
    const opt = document.createElement("option");
    opt.value = sc.id;
    opt.textContent = sc.nombre;
    sel.appendChild(opt);
  }
}