/*import { wireSidebarTabs } from './tabSync.js';
import { wireSidebarViews } from './tabSync.js';

export class PanelView {

  constructor() {}

  init() {
    wireSidebarTabs();
    wireSidebarViews();
  }

  renderCategoriesTable(categories) {
    const tbody = document.querySelector('#pane-categories tbody');

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

    categories.forEach((category) => {
      const tr = document.createElement('tr');

      //console.log(category.id)

      tr.innerHTML = `
        <td><span class="badge-soft">${category.getId()}</span></td>
        <td class="fw-bold">${category.getName()}</td>
        <td class="text-end">
          <button
            class="btn btn-sm btn-soft"
            data-bs-toggle="modal"
            data-bs-target="#modalCategoryEdit"
            data-action="edit"
            data-category-id="${category.getId()}"
          >
            Editar
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            data-action="delete"
            data-category-id="${category.getId()}"
          >
            Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

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
          // formato ES (29,99 €)
          return `${n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
        }
        return value != null && value !== '' ? `${value} €` : '—';
      };

      products.forEach((p) => {
        // Soporta entidades con getters o objetos simples
        const id = p?.getId ? p.getId() : (p?.id ?? '');
        const nombre = p?.getName ? p.getName() : (p?.nombre ?? p?.name ?? '');
        const marca = p?.getBrand ? p.getBrand() : (p?.marca ?? p?.brand ?? '—');
        const precioRaw = p?.getPrice ? p.getPrice() : (p?.precio ?? p?.price);
        const stockRaw = p?.getStock ? p.getStock() : (p?.stock ?? 0);

        // Subcategoría: intenta varias formas comunes
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

    const disablePrev = page <= 0 ? "disabled" : "";
    const disableNext = page >= pages - 1 ? "disabled" : "";

    el.innerHTML = `
      <div class="muted small">
        Página <b>${pageHuman}</b> de <b>${pages}</b> — Total: <b>${totalCount ?? 0}</b>
      </div>
      <div class="btn-group">
        <button
          class="btn btn-sm btn-outline-secondary"
          data-action="prev"
          ${disablePrev}
        >
          Anterior
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          data-action="next"
          ${disableNext}
        >
          Siguiente
        </button>
      </div>
    `;
  }

  renderSubCategoriesTable(subcategories, categories) {
    const tbody = document.querySelector('#pane-subcategories tbody');

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

    subcategories.forEach((sc, index) => {
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
        category?.getName ? category.getName() : (category?.nombre ?? category?.name ?? "—");

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

  renderSubCategoriesPagination({ page, totalPages, totalCount }) {
    const el = document.querySelector("#subcat-pagination");
    if (!el) return;

    const pageHuman = (page ?? 0) + 1;
    const pages = totalPages || 1;

    const disablePrev = page <= 0 ? "disabled" : "";
    const disableNext = page >= pages - 1 ? "disabled" : "";

    el.innerHTML = `
      <div class="muted small">
        Página <b>${pageHuman}</b> de <b>${pages}</b> — Total: <b>${totalCount ?? 0}</b>
      </div>
      <div class="btn-group">
        <button
          class="btn btn-sm btn-outline-secondary"
          data-action="prev"
          ${disablePrev}
        >
          Anterior
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          data-action="next"
          ${disableNext}
        >
          Siguiente
        </button>
      </div>
    `;
  }

}*/