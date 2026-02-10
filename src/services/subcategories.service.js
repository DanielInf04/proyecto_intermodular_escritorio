const { request, requestWithMeta } = require('./apiClient');

const subcategoriesService = {
    list: async({ page = 0, size = 10, q = "" } = {}) => {
        const params = new URLSearchParams({ page, size });
        if (q && q.trim()) params.set("q", q.trim());

        const { data, meta } = await requestWithMeta(`/api/subcategories?${params.toString()}`);

        return {
            items: data,
            totalPages: meta.totalPages,
            totalCount: meta.totalCount,
            page,
            size,
            q
        };
    },
    getById: (id) => request(`/api/subcategories/${id}`),
    //create: (data) => request(`/api/subcategories`, { method: 'POST', body: data }),

    create: ({ nombre, categoriaId }) =>
        request("/api/subcategories", {
            method: "POST",
            body: {
            nombre: String(nombre).trim(),
            categoriaId: Number(categoriaId),
            },
    }),

    update: (id, { nombre, categoriaId }) =>
        request(`/api/subcategories/${id}`, {
            method: "PUT",
            body: {
            nombre: String(nombre).trim(),
            categoriaId: Number(categoriaId),
            },
    }),

    uploadImage: ({ id, file }) => {
        const form = new FormData();

        const uint8 = Uint8Array.from(file.bytes);
        const blob = new Blob([uint8], { type: file.type || "image/png" });

        form.append("file", blob, file.name || "upload.png");

        return request(`/api/subcategories/${id}/image`, {
            method: "PUT", // recomendado
            body: form,
        });
    },

    

    /*create: async ({ nombre, categoriaId, file }) => {
        const form = new FormData();

        // Campos simples
        form.append("nombre", String(nombre).trim());
        form.append("categoriaId", String(categoriaId));

        // bytes -> Uint8Array -> Blob
        const uint8 = Uint8Array.from(file.bytes);
        const blob = new Blob([uint8], {
            type: file.type || "image/png",
        });

        // Archivo (nombre de parte = "file", como espera Spring)
        form.append("file", blob, file.name || "upload.png");

        // Enviar (fetch/undici gestiona headers y boundary)
        return request("/api/subcategories", {
            method: "POST",
            body: form,
        });
    },*/

    //update: (id, data) => request(`/api/subcategories/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/api/subcategories/${id}`, { method: 'DELETE' }),
}

module.exports = { subcategoriesService }