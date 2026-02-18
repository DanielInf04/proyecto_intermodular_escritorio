const { request, requestWithMeta } = require('./apiClient');

const usersService = {

    list: async ({ page = 0, size = 10, q = "" } = {}) => {
        const params = new URLSearchParams({ page, size });
        if (q && q.trim()) params.set("q", q.trim());

        const { data, meta } = await requestWithMeta(`/api/users?${params.toString()}`);

        return {
            items: data,
            totalPages: meta.totalPages,
            totalCount: meta.totalCount,
            page,
            size,
            q
        };
    },

    getById: (id) =>
        request(`/api/users/${id}`),

    create: ({ nombre, email, password }) =>
        request("/api/users", {
            method: "POST",
            body: {
                nombre: String(nombre).trim(),
                email: String(email).trim(),
                password: String(password).trim(),
            },
        }),

    update: (id, { nombre, email }) =>
        request(`/api/users/${id}`, {
            method: "PUT",
            body: {
                nombre: String(nombre).trim(),
                email: String(email).trim(),
            },
        }),

    remove: (id) =>
        request(`/api/users/${id}`, { method: "DELETE" }),
};

module.exports = { usersService };
