const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  auth: {
    login: (username, password) =>
      ipcRenderer.invoke('auth:login', { username, password }),
  },
  ui: {
    openPanel: () => ipcRenderer.invoke('ui:openPanel'),
  },

  // Usuarios

  users: {

  },

  // Productos

  products: {
    list: (params) => ipcRenderer.invoke('products:list', params),
    getById: (id) => ipcRenderer.invoke('products:getById', id)
  },

  // Categorias

  categories: {
    list: () => ipcRenderer.invoke('categories:list'),
    getById: (id) => ipcRenderer.invoke('categories:getById', id),
    create: (data) => ipcRenderer.invoke('categories:create', data),
    update: (id, data) => ipcRenderer.invoke('categories:update', id, data),
    remove: (id) => ipcRenderer.invoke('categories:delete', id),
  },

  // Subcategorias

  subcategories: {
    list: (params) => ipcRenderer.invoke('subcategories:list', params),
    getById: (id) => ipcRenderer.invoke('subcategories:getById', id),
    create: (data) => ipcRenderer.invoke('subcategories:create', data),
    update: (id, data) => ipcRenderer.invoke('subcategories:update', id, data),
    uploadImage: (payload) => ipcRenderer.invoke('subcategories:uploadImage', payload),
    remove: (id) => ipcRenderer.invoke('subcategories:delete', id),
  }
});