export const categoriesService = {
    list: () => window.api.categories.list(),
    getById: (id) => window.api.categories.getById(id),
    create: (data) => window.api.categories.create(data),
    update: (id, data) => window.api.categories.update(id, data),
    remove: (id) => window.api.categories.remove(id),
};