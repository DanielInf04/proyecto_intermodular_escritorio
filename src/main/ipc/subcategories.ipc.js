const { subcategoriesService } = require('../../services/subcategories.service');

module.exports = (ipcMain) => {

    // Retorna la lista de subcategorias
    ipcMain.handle('subcategories:list', async (_e, params) => {
        return await subcategoriesService.list(params); // params: {page,size}
    });

    // Obtiene una subcategoria
    ipcMain.handle('subcategories:getById', async(_e, id) => {
        return await subcategoriesService.getById(id);
    })

    // Crea una subcategoria
    ipcMain.handle('subcategories:create', async(_event, data) => {
        return await subcategoriesService.create(data);
    })

    ipcMain.handle('subcategories:uploadImage', async (_e, payload) => {
        return await subcategoriesService.uploadImage(payload); // {id, file}
    });

    // Actualizar una subcategoria
    ipcMain.handle('subcategories:update', async (_event, id, data) => {
        return await subcategoriesService.update(id, data);
    })

    // Eliminar una subcategoria
    ipcMain.handle('subcategories:delete', async (_event, id) => {
        return await subcategoriesService.remove(id);
    })

}