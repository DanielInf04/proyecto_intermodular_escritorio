const { request, requestWithMeta } = require('./apiClient');

const productsService = {
    list: async({ page = 0, size = 10, q = "" } ={}) => {
        const params = new URLSearchParams({ page, size });
        if (q && q.trim()) params.set("q", q.trim());

        const { data, meta } = await requestWithMeta(`/api/products?${params.toString()}`);

        return {
            items: data,
            totalPages: meta.totalPages,
            totalCount: meta.totalCount,
            page,
            size,
            q
        }
    },
    getById: (id) => request(`/api/products/${id}`),
    create: ({ nombre, marca, precio, stock, descripcion, subcategoriaId }) =>
        request("/api/products", {
            method: "POST",
            body: {
                nombre: String(nombre).trim(),
                marca: String(marca).trim(),
                precio: Number(precio),
                stock: Number(stock),
                descripcion: String(descripcion || "").trim(),
                subcategoriaId: Number(subcategoriaId),
            },
        }),
    
    update: (id, { nombre, marca, precio, stock, descripcion = "", subcategoriaId }) =>
        request(`/api/products/${id}`, {
        method: "PUT",
        body: {
            nombre: String(nombre).trim(),
            marca: String(marca).trim(),
            precio: Number(precio),
            stock: Number(stock),
            descripcion: String(descripcion || "").trim(),
            subcategoriaId: Number(subcategoriaId),
        },
    }),

    uploadImage: ({ id, file }) => {
        const form = new FormData();

        const uint8 = Uint8Array.from(file.bytes);
        const blob = new Blob([uint8], { type: file.type || "image/png" });

        // "file" debe coincidir con lo que espera tu Spring Controller (@RequestParam("file"))
        form.append("file", blob, file.name || "upload.png");

        return request(`/api/products/${id}/image`, {
        method: "PUT",
        body: form,
        });
    },

    remove: (id) => request(`/api/products/${id}`, { method: 'DELETE' })
}

module.exports = { productsService }