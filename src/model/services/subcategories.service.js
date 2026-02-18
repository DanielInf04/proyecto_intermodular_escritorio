export const subcategoriesService = {
    list: (params) => window.api.subcategories.list(params),
    getById: (id) => window.api.subcategories.getById(id),
    create: (data) => window.api.subcategories.create(data),
    update: (id, data) => window.api.subcategories.update(id, data),
    remove: (id) => window.api.subcategories.remove(id),
    //uploadImage: (payload) => window.api.subcategories.uploadImage(payload),

    uploadImage: ({ id, file }) => window.api.subcategories.uploadImage({ id, file }),
};