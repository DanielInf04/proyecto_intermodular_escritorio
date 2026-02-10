const { categoriesService } = require('../../services/categories.service');

module.exports = (ipcMain) => {

    // Retorna la lista de categorias
    ipcMain.handle('categories:list', async () => {
        return await categoriesService.list();
    });

    ipcMain.handle('categories:getById', async (_e, id) => {
        return await categoriesService.getById(id);
    });

    // Crear una categoria
    ipcMain.handle('categories:create', async (_event, data) => {
        return await categoriesService.create(data);
    })

    // Actualizar una categoría
    ipcMain.handle('categories:update', async (_event, id, data) => {
        return await categoriesService.update(id, data);
    });

    // Eliminar una categoria
    ipcMain.handle('categories:delete', async (_event, id) => {
        return await categoriesService.remove(id);
    });

};