import { $ } from "../../utils/dom.js";

export function bindSubcategoryImageInputs() {
  const pairs = [
    { input: "#imagenInput", label: "#imageName" },         // CREATE
    { input: "#imagenInputEdit", label: "#imageNameEdit" }, // EDIT
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

export function bindSubcategoryForms({ onCreate, onUpdate, onUploadImage }) {
  const createForm = $("#subcategoryCreateForm");
  const editForm = $("#subcategoryEditForm");

  // CREATE: JSON -> luego imagen
  createForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = createForm.elements.nombre.value?.trim();
    const categoriaId = Number(createForm.elements.categoria_id.value);

    const input = $("#imagenInput");
    const file = input?.files?.[0];

    if (!nombre) throw new Error("El nombre es obligatorio");
    if (!categoriaId) throw new Error("La categoría es obligatoria");

    // Si quieres imagen obligatoria en create:
    if (!file) throw new Error("Debes seleccionar una imagen");
    if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen");

    // 1) crear subcategoría (JSON)
    const created = await onCreate({ nombre, categoriaId }); // debe devolver {id,...}

    // 2) subir imagen (multipart)
    await onUploadImage({
      id: created.id,
      file: await fileToIpcPayload(file),
    });

    createForm.reset();
    const label = $("#imageName");
    if (label) label.textContent = "Ninguna imagen seleccionada";
  });

  // EDIT: JSON -> si hay file nuevo, subir imagen
  editForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = Number(editForm.elements.id.value);
    const nombre = editForm.elements.nombre.value?.trim();
    const categoriaId = Number(editForm.elements.categoria_id.value);

    // input de imagen en el modal de editar (ponle este id en tu HTML)
    const editFileInput = $("#imagenInputEdit"); // 👈 crea este input en el modal edit
    const file = editFileInput?.files?.[0];

    if (!id) throw new Error("ID inválido");
    if (!nombre) throw new Error("El nombre es obligatorio");
    if (!categoriaId) throw new Error("La categoría es obligatoria");

    // 1) actualizar datos
    await onUpdate({ id, nombre, categoriaId });

    // 2) si hay nueva imagen, subirla
    if (file) {
      if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen");
      await onUploadImage({
        id,
        file: await fileToIpcPayload(file),
      });
    }

    editForm.reset();
  });
}

export function updateSubcategoryImagePreview(url) {
  const img = $("#subcategoryImagePreview");
  const ph = $("#subcategoryImagePlaceholder");
  const input = $("#subcategoryImageUrl");
  if (!img || !ph || !input) return;

  input.value = url ?? "";

  if (!url) {
    img.style.display = "none";
    ph.style.display = "block";
    img.src = "";
    return;
  }

  img.src = url;
  img.onload = () => {
    img.style.display = "block";
    ph.style.display = "none";
  };
  img.onerror = () => {
    img.style.display = "none";
    ph.style.display = "block";
  };
}