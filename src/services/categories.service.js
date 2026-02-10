const { request } = require('./apiClient');

const categoriesService = {
  list: async () => {
    return await request('/api/categories');
  },
  getById: (id) => request(`/api/categories/${id}`),
  create: (data) => request('/api/categories', { method: 'POST', body: data }),
  update: (id, data) => request(`/api/categories/${id}`, { method: 'PUT', body: data }),
  remove: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),
};

module.exports = { categoriesService };