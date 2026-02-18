import { wireSidebarTabs, wireSidebarViews } from './tabSync.js';
import { $, debounce } from '../../utils/dom.js';
import { Alerts } from '../../ui/alerts.ui.js';
import { Modals } from '../../ui/modals.ui.js';

export class PanelView {
  constructor() {}

  init() {
    wireSidebarTabs();
    wireSidebarViews();
  }

  // =========================
  // CATEGORIES (Render)
  // =========================
  renderCategoriesTable(categories) {
  const tbody = document.querySelector('#pane-categories tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!categories || categories.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center muted">
          No hay categorias
        </td>
      </tr>
    `;
    return;
  }

  categories.forEach((c) => {
    const id = c?.getId ? c.getId() : (c?.id ?? '');
    const name = c?.getName ? c.getName() : (c?.nombre ?? c?.name ?? '');

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><span class="badge-soft">${id}</span></td>
      <td class="fw-bold">${name}</td>
      <td class="text-end">
        <button
          class="btn btn-sm btn-soft"
          data-bs-toggle="modal"
          data-bs-target="#modalCategoryEdit"
          data-action="edit"
          data-category-id="${id}"
        >
          Editar
        </button>
        <button
          class="btn btn-sm btn-outline-danger"
          data-action="delete"
          data-category-id="${id}"
        >
          Eliminar
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

  // =========================
  // PRODUCTS (Render)
  // =========================
  renderProductsTable(products) {
    const tbody = document.querySelector('#pane-products tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!products || products.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center muted">
            No hay productos
          </td>
        </tr>
      `;
      return;
    }

    const euro = (value) => {
      const n = Number(value);
      if (Number.isFinite(n)) {
        return `${n.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} €`;
      }
      return value != null && value !== '' ? `${value} €` : '—';
    };

    products.forEach((p) => {
      const id = p?.getId ? p.getId() : (p?.id ?? '');
      const nombre = p?.getName ? p.getName() : (p?.nombre ?? p?.name ?? '');
      const marca = p?.getBrand ? p.getBrand() : (p?.marca ?? p?.brand ?? '—');
      const precioRaw = p?.getPrice ? p.getPrice() : (p?.precio ?? p?.price);
      const stockRaw = p?.getStock ? p.getStock() : (p?.stock ?? 0);

      const subcatNombre =
        p?.subcategoria?.nombre ??
        p?.subcategoriaNombre ??
        p?.subcategoria?.name ??
        (p?.subcategoria?.id != null ? `ID ${p.subcategoria.id}` : null) ??
        (p?.subcategoriaId != null ? `ID ${p.subcategoriaId}` : '—');

      const imagenUrl = p?.imagenUrl ?? p?.imageUrl ?? p?.imagen ?? p?.image ?? '';

      const stockBadge = Number.isFinite(Number(stockRaw)) ? Number(stockRaw) : (stockRaw ?? '—');

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>
          ${
            imagenUrl
              ? `
                <div class="avatar" title="${imagenUrl}">
                  <img
                    src="${imagenUrl}"
                    alt="Imagen producto ${nombre ?? ''}"
                    class="product-img"
                    onerror="this.closest('.avatar').innerHTML='📦'"
                  />
                </div>
              `
              : `<div class="avatar" title="sin imagen">📦</div>`
          }
        </td>

        <td>
          <div class="fw-bold">${nombre ?? ''}</div>
          <div class="muted small">${marca ?? ''}</div>
        </td>

        <td>${euro(precioRaw)}</td>

        <td><span class="badge-soft">${stockBadge}</span></td>

        <td class="text-end">
          <button
            class="btn btn-sm btn-soft"
            data-bs-toggle="modal"
            data-bs-target="#modalProduct"
            data-action="edit"
            data-product-id="${id}"
          >
            Editar
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            data-action="delete"
            data-product-id="${id}"
          >
            Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  renderProductsPagination({ page, totalPages, totalCount }) {
    const el = document.querySelector('#products-pagination');
    if (!el) return;

    const pageHuman = (page ?? 0) + 1;
    const pages = totalPages || 1;

    const disablePrev = page <= 0 ? 'disabled' : '';
    const disableNext = page >= pages - 1 ? 'disabled' : '';

    el.innerHTML = `
      <div class="muted small">
        Página <b>${pageHuman}</b> de <b>${pages}</b> — Total: <b>${totalCount ?? 0}</b>
      </div>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" data-action="prev" ${disablePrev}>
          Anterior
        </button>
        <button class="btn btn-sm btn-outline-secondary" data-action="next" ${disableNext}>
          Siguiente
        </button>
      </div>
    `;
  }

  // =========================
  // SUBCATEGORIES (Render)
  // =========================
  renderSubCategoriesTable(subcategories, categories) {
    const tbody = document.querySelector('#pane-subcategories tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!subcategories || subcategories.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center muted">
            No hay subcategorías
          </td>
        </tr>
      `;
      return;
    }

    subcategories.forEach((sc) => {
      const tr = document.createElement('tr');

      const catId =
        sc?.categoria_id ??
        sc?.categoriaId ??
        sc?.categoria?.id ??
        sc?.categoria?.getId?.();

      const category = categories.find((c) =>
        c?.getId ? c.getId() === catId : c?.id === catId
      );

      const categoryName =
        category?.getName ? category.getName() : (category?.nombre ?? category?.name ?? '—');

      const imagenUrl = sc?.imagenUrl ?? '';

      tr.innerHTML = `
        <td>
          ${
            imagenUrl
              ? `
                <img
                  src="${imagenUrl}"
                  alt="Subcategoría ${sc.nombre ?? ''}"
                  class="subcat-img"
                  onerror="this.style.display='none'"
                />
              `
              : '<span class="muted small">—</span>'
          }
        </td>
        <td class="fw-bold">${sc.nombre ?? ''}</td>
        <td>${categoryName}</td>
        <td class="text-end">
          <button
            class="btn btn-sm btn-soft"
            data-bs-toggle="modal"
            data-bs-target="#modalSubcategoryEdit"
            data-action="edit"
            data-subcategory-id="${sc.id}"
          >
            Editar
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            data-action="delete"
            data-subcategory-id="${sc.id}"
          >
            Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  renderSubcategoryCategoryFilter(categories) {
    const select = $('#subcat-category-filter');
    if (!select) return;

    select.innerHTML = `
      <option value="">Filtrar por categoría</option>
      ${ (categories ?? []).map(c => {
        const id = c?.getId ? c.getId() : c?.id;
        const name = c?.getName ? c.getName() : (c?.nombre ?? c?.name ?? '');
        return `<option value="${id}">${name}</option>`;
      }).join('') }
    `;
  }

  renderSubcategoryCategorySelectOptions(categories = []) {
    const createSel = $('#subcategoryCategoryCreate'); // id del select en modal create
    const editSel = $('#subcategoryCategoryEdit');     // id del select en modal edit

    const getId = (c) => (c?.getId ? c.getId() : c?.id);
    const getName = (c) => (c?.getName ? c.getName() : (c?.nombre ?? c?.name ?? ''));

    const html = `
      <option value="">Selecciona...</option>
      ${categories.map(c => `<option value="${getId(c)}">${getName(c)}</option>`).join('')}
    `;

    if (createSel) createSel.innerHTML = html;
    if (editSel) editSel.innerHTML = html;
  }

  renderSubCategoriesPagination({ page, totalPages, totalCount }) {
    const el = document.querySelector('#subcat-pagination');
    if (!el) return;

    const pageHuman = (page ?? 0) + 1;
    const pages = totalPages || 1;

    const disablePrev = page <= 0 ? 'disabled' : '';
    const disableNext = page >= pages - 1 ? 'disabled' : '';

    el.innerHTML = `
      <div class="muted small">
        Página <b>${pageHuman}</b> de <b>${pages}</b> — Total: <b>${totalCount ?? 0}</b>
      </div>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" data-action="prev" ${disablePrev}>
          Anterior
        </button>
        <button class="btn btn-sm btn-outline-secondary" data-action="next" ${disableNext}>
          Siguiente
        </button>
      </div>
    `;
  }

  // =========================
  // PRODUCTS (Selects)
  // =========================
  renderProductCategorySelectOptions(categories = []) {
    const createSel = $('#productCategoryCreate');
    const editSel = $('#productCategoryEdit');

    const getId = (c) => (c?.getId ? c.getId() : c?.id);
    const getName = (c) => (c?.getName ? c.getName() : (c?.nombre ?? c?.name ?? ''));

    const html = `
      <option value="">Selecciona categoría</option>
      ${categories.map(c => `<option value="${getId(c)}">${getName(c)}</option>`).join('')}
    `;

    if (createSel) createSel.innerHTML = html;
    if (editSel) editSel.innerHTML = html;
  }

  renderProductSubcategorySelectOptions(subcategories = [], { target } = {}) {
    const sel =
      target === 'edit'
        ? $('#productSubcategoryEdit')
        : $('#productSubcategoryCreate');

    if (!sel) return;

    const getId = (sc) => sc?.id ?? sc?.getId?.();
    const getName = (sc) => sc?.nombre ?? sc?.name ?? sc?.getName?.() ?? '';

    sel.innerHTML = `
      <option value="">Selecciona subcategoría</option>
      ${subcategories.map(sc => `<option value="${getId(sc)}">${getName(sc)}</option>`).join('')}
    `;
  }

  renderProductsCategoryFilterOptions(categories = []) {
    const sel = $('#products-category-filter');
    if (!sel) return;

    const getId = (c) => (c?.getId ? c.getId() : c?.id);
    const getName = (c) => (c?.getName ? c.getName() : (c?.nombre ?? c?.name ?? ''));

    sel.innerHTML = `
      <option value="">Todas las categorías</option>
      ${categories.map(c => `<option value="${getId(c)}">${getName(c)}</option>`).join('')}
    `;
  }

  renderProductsSubcategoryFilterOptions(subcategories = []) {
    const sel = $('#products-subcategory-filter');
    if (!sel) return;

    const getId = (sc) => sc?.id ?? sc?.getId?.();
    const getName = (sc) => sc?.nombre ?? sc?.name ?? sc?.getName?.() ?? '';

    sel.innerHTML = `
      <option value="">Todas las subcategorías</option>
      ${subcategories.map(sc => `<option value="${getId(sc)}">${getName(sc)}</option>`).join('')}
    `;
  }

  // =========================
  // PRODUCTS (Bindings + UI)
  // =========================
  bindProductsPagination(handler) {
    const el = $('#products-pagination');
    if (!el) return;

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;
      handler(btn.dataset.action); // "prev" | "next"
    });
  }

  bindProductsSearch(handler) {
    const input = $('#products-search');
    if (!input) return;

    const run = debounce(() => handler(input.value || ''), 300);

    input.addEventListener('input', run);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') run();
    });
  }

  bindProductsFilters({ onCategoryChange, onSubcategoryChange, onStockChange }) {
    const catSel = $('#products-category-filter');
    const subSel = $('#products-subcategory-filter');
    const stockSel = $('#products-stock-filter');

    catSel?.addEventListener('change', () => {
      const categoryId = catSel.value ? Number(catSel.value) : null;
      onCategoryChange(categoryId);

      // reset visual del subcat al cambiar categoría
      if (subSel) subSel.value = '';
    });

    subSel?.addEventListener('change', () => {
      const subcategoryId = subSel.value ? Number(subSel.value) : null;
      onSubcategoryChange(subcategoryId);
    });

    stockSel?.addEventListener('change', () => {
      const stock = stockSel.value || null;
      onStockChange(stock);
    });
  }

  bindProductsTableActions({ onEdit, onDelete }) {
    const tbody = $('#pane-products tbody');
    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = Number(btn.dataset.productId);
      if (!id || Number.isNaN(id)) return;

      if (action === 'edit') onEdit(id);
      if (action === 'delete') onDelete(id);
    });
  }

  bindProductModalCategoryToSubcategories(handler) {
    const bind = (categorySelectId, target) => {
      const catSel = $(categorySelectId);
      if (!catSel) return;

      catSel.addEventListener('change', () => {
        const categoryId = catSel.value ? Number(catSel.value) : null;
        handler({ categoryId, target }); // target: "create" | "edit"
      });
    };

    bind('#productCategoryCreate', 'create');
    bind('#productCategoryEdit', 'edit');
  }

  async confirmDeleteProduct() {
    const result = await Alerts.confirmDelete({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
    });
    return result.isConfirmed;
  }

  openProductEditModal({ product, categoryId, subcategoryId }) {
    const form = $('#productEditForm');
    if (!form) return;

    form.elements.id.value = product.id;
    form.elements.nombre.value = product.nombre ?? '';
    form.elements.descripcion.value = product.descripcion ?? '';
    form.elements.marca.value = product.marca ?? '';
    form.elements.precio.value = product.precio ?? '';
    form.elements.stock.value = product.stock ?? '';

    // categoría + subcategoría (ids de tus selects)
    if (form.elements.categoria_id) form.elements.categoria_id.value = categoryId ? String(categoryId) : '';
    if (form.elements.subcategoria_id) form.elements.subcategoria_id.value = String(subcategoryId);

    // reset file + label
    const editInput = $('#productImageInputEdit');
    if (editInput) editInput.value = '';

    const editLabel = $('#productImageNameEdit');
    if (editLabel) editLabel.textContent = 'Ninguna imagen seleccionada';

    Modals.show('modalProductEdit');
  }

  closeProductEditModal() {
    Modals.hide('modalProductEdit');
  }

  closeProductCreateModal() {
    Modals.hide('modalProductCreate');
  }

  // =========================
  // CATEGORIES (Bindings + UI)
  // =========================
  bindCategoryTableActions({ onEdit, onDelete }) {
    const tbody = document.querySelector('#pane-categories tbody');
    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = Number(btn.dataset.categoryId);
      if (!id || Number.isNaN(id)) return;

      if (action === 'edit') onEdit(id);
      if (action === 'delete') onDelete(id);
    });
  }

  bindCategoryCreate(handler) {
    const form = document.getElementById('categoryCreateForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      await handler(data);
      form.reset();
    });
  }

  bindCategoryEdit(handler) {
    const form = document.getElementById('categoryEditForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      await handler(data);
      form.reset();
    });
  }

  async confirmDeleteCategory() {
    const result = await Alerts.confirmDelete({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
    });
    return result.isConfirmed;
  }

  openCategoryEditModal(cat) {
    const form = document.getElementById('categoryEditForm');
    if (!form) return;

    form.elements.nombre.value = cat.nombre ?? '';
    form.elements.id.value = cat.id;

    Modals.show('modalCategoryEdit');
  }

  closeCategoryCreateModal() {
    Modals.hide('modalCategoryCreate');
  }

  closeCategoryEditModal() {
    Modals.hide('modalCategoryEdit');
  }

  // =========================
  // SUBCATEGORIES (Bindings + UI)
  // Estos son los que te faltaban
  // =========================

  bindSubcategoryCreate(handler) {
    const form = document.getElementById("subcategoryCreateForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      await handler(data);
      form.reset();
    });
  }

  bindSubcategoryEdit(handler) {
    const form = document.getElementById("subcategoryEditForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      await handler(data);
      form.reset();
    });
  }

  closeSubcategoryCreateModal() {
    Modals.hide("modalSubcategoryCreate");
  }

  closeSubcategoryEditModal() {
    Modals.hide("modalSubcategoryEdit");
  }

  bindSubcategoryImageInputs() {
    const bind = (btnId, inputId, labelId) => {
      const btn = $(btnId);
      const input = $(inputId);
      const label = $(labelId);
      if (!btn || !input || !label) return;

      btn.addEventListener("click", () => input.click());

      input.addEventListener("change", () => {
        const file = input.files?.[0];
        label.textContent = file ? file.name : "Ninguna imagen seleccionada";
      });
    };

    bind("#btnImagenCreate", "#imagenInputCreate", "#imageNameCreate");
    bind("#btnImagenEdit", "#imagenInputEdit", "#imageNameEdit");
  }

  bindFilter(handler) {
    const select = $('#subcat-category-filter');
    if (!select) return;

    select.addEventListener('change', () => {
      const value = select.value;
      handler(value ? Number(value) : null);
    });
  }

  bindSearch(handler) {
    const input = $('#subcat-search');
    if (!input) return;

    const run = debounce(() => handler(input.value || ''), 300);

    input.addEventListener('input', run);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') run();
    });
  }

  bindPagination(handler) {
    const el = $('#subcat-pagination');
    if (!el) return;

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      handler(btn.dataset.action); // "prev" | "next"
    });
  }

  bindTableActions({ onEdit, onDelete }) {
    const tbody = $('#pane-subcategories tbody');
    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = Number(btn.dataset.subcategoryId);
      if (!id || Number.isNaN(id)) return;

      if (action === 'edit') onEdit(id);
      if (action === 'delete') onDelete(id);
    });
  }

  async confirmDelete() {
    const result = await Alerts.confirmDelete({
      title: '¿Eliminar subcategoría?',
      text: 'Esta acción no se puede deshacer',
    });
    return result.isConfirmed;
  }

  openEditModal(sub) {
    const form = $('#subcategoryEditForm');
    if (!form) return;

    form.elements.nombre.value = sub.nombre ?? '';

    const catId =
      sub.categoriaId ??
      sub.categoria_id ??
      sub?.categoria?.id ??
      '';

    form.elements.categoria_id.value = catId ? String(catId) : '';
    form.elements.id.value = sub.id;

    const editInput = $('#imagenInputEdit');
    if (editInput) editInput.value = '';

    const editLabel = $('#imageNameEdit');
    if (editLabel) editLabel.textContent = 'Ninguna imagen seleccionada';

    Modals.show('modalSubcategoryEdit');
  }

  showSuccess(msg) {
    Alerts.success(msg);
  }

  showError(msg) {
    Alerts.error(msg);
  }
}