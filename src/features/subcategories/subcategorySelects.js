import { $ } from "../../utils/dom.js";

export function renderCategorySelectOptions(categories, selectedId = null) {
  const createSelect = $('#subcategoryCreateForm select[name="categoria_id"]');
  const editSelect   = $('#subcategoryEditForm select[name="categoria_id"]');

  const fill = (select) => {
    if (!select) return;

    const placeholder = select.querySelector('option[value=""]');

    select.innerHTML = "";
    if (placeholder) {
      select.appendChild(placeholder);
      placeholder.disabled = true;
    } else {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Selecciona…";
      opt.disabled = true;
      select.appendChild(opt);
    }

    for (const cat of categories) {
      const opt = document.createElement("option");
      opt.value = cat.getId();
      opt.textContent = cat.getName();
      select.appendChild(opt);
    }
  };

  fill(createSelect);
  fill(editSelect);

  if (selectedId != null && editSelect) editSelect.value = String(selectedId);
}