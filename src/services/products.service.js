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
}

module.exports = { productsService }