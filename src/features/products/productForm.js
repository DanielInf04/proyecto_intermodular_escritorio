import { $ } from "../../utils/dom.js";

export function bindProductImageInputs() {
  const pairs = [
    { input: "#productImageInputCreate", label: "#productImageNameCreate" },
    { input: "#productImageInputEdit", label: "#productImageNameEdit" },
  ];

  for (const p of pairs) {
    const input = $(p.input);
    const label = $(p.label);
    if (!input || !label) continue;

    input.addEventListener("change", () => {
      const file = input.files?.[0];

      if (!file) {
        label.textContent = "Ninguna imagen seleccionada";
        return;
      }

      if (!file.type.startsWith("image/")) {
        label.textContent = "Archivo no válido";
        input.value = "";
        return;
      }

      label.textContent = file.name;
    });
  }
}

async function fileToIpcPayload(file) {
  const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
  return { name: file.name, type: file.type, bytes };
}

/**
 * Bind de formularios:
 * - onCreate: ({ nombre, marca, precio, stock, subcategoriaId, descripcion }) => { id, ... }
 * - onUpdate: ({ id, nombre, marca, precio, stock, subcategoriaId, descripcion }) => void
 * - onUploadImage: ({ id, file }) => void
 */
export function bindProductForms({ onCreate, onUpdate, onUploadImage }) {
  const createForm = $("#productCreateForm");
  const editForm = $("#productEditForm");

  // CREATE: JSON -> luego imagen
  createForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = createForm.elements.nombre.value?.trim();
    const marca = createForm.elements.marca.value?.trim();
    const precio = Number(createForm.elements.precio.value);
    const stock = Number(createForm.elements.stock.value);
    const subcategoriaId = Number(createForm.elements.subcategoria_id.value);
    const descripcion = createForm.elements.descripcion.value?.trim() ?? "";

    const input = $("#productImageInputCreate");
    const file = input?.files?.[0];

    if (!nombre) throw new Error("El nombre es obligatorio");
    if (!marca) throw new Error("La marca es obligatoria");
    if (!Number.isFinite(precio) || precio < 0) throw new Error("Precio inválido");
    if (!Number.isFinite(stock) || stock < 0) throw new Error("Stock inválido");
    if (!subcategoriaId) throw new Error("La subcategoría es obligatoria");

    // Imagen obligatoria en create (igual que en subcategoryForm.js)
    if (!file) throw new Error("Debes seleccionar una imagen");
    if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen");

    // 1) crear producto (JSON)
    const created = await onCreate({
      nombre,
      marca,
      precio,
      stock,
      subcategoriaId,
      descripcion,
    }); // debe devolver {id,...}

    // 2) subir imagen
    await onUploadImage({
      id: created.id,
      file: await fileToIpcPayload(file),
    });

    createForm.reset();
    const label = $("#productImageNameCreate");
    if (label) label.textContent = "Ninguna imagen seleccionada";
  });

  // EDIT: JSON -> si hay file nuevo, subir imagen
  editForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = Number(editForm.elements.id.value);
    const nombre = editForm.elements.nombre.value?.trim();
    const marca = editForm.elements.marca.value?.trim();
    const precio = Number(editForm.elements.precio.value);
    const stock = Number(editForm.elements.stock.value);
    const subcategoriaId = Number(editForm.elements.subcategoria_id.value);
    const descripcion = editForm.elements.descripcion.value?.trim() ?? "";

    const input = $("#productImageInputEdit");
    const file = input?.files?.[0];

    if (!id) throw new Error("ID inválido");
    if (!nombre) throw new Error("El nombre es obligatorio");
    if (!marca) throw new Error("La marca es obligatoria");
    if (!Number.isFinite(precio) || precio < 0) throw new Error("Precio inválido");
    if (!Number.isFinite(stock) || stock < 0) throw new Error("Stock inválido");
    if (!subcategoriaId) throw new Error("La subcategoría es obligatoria");

    // 1) actualizar datos
    await onUpdate({
      id,
      nombre,
      marca,
      precio,
      stock,
      subcategoriaId,
      descripcion,
    });

    // 2) si hay nueva imagen, subirla
    if (file) {
      if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen");
      await onUploadImage({
        id,
        file: await fileToIpcPayload(file),
      });
    }

    editForm.reset();
    const label = $("#productImageNameEdit");
    if (label) label.textContent = "Ninguna imagen seleccionada";
  });
}

/**
 * Opcional: helper para limpiar labels de imagen cuando abras/cierres modales
 */
export function resetProductImageLabels() {
  const c = $("#productImageNameCreate");
  const e = $("#productImageNameEdit");
  if (c) c.textContent = "Ninguna imagen seleccionada";
  if (e) e.textContent = "Ninguna imagen seleccionada";

  const ic = $("#productImageInputCreate");
  const ie = $("#productImageInputEdit");
  if (ic) ic.value = "";
  if (ie) ie.value = "";
}