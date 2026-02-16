const { productsService } = require('../../services/products.service');

module.exports = (ipcMain) => {

    // Retorna la lista de productos paginados
    ipcMain.handle('products:list', async (_e, params) => {
        return await productsService.list(params);
    });

    // Obtiene un producto
    ipcMain.handle('products:getById', async(_e, id) => {
        return await productsService.getById(id);
    });

    // Crea un producto
    ipcMain.handle('products:create', async(_event, data) => {
        return await productsService.create(data);
    })

    ipcMain.handle("products:uploadImage", async (e, payload) => {
        return productsService.uploadImage(payload);
    });

    // Actualiza un producto
    ipcMain.handle("products:update", async (_event, id, data) => {
        return productsService.update(id, data)
    })

    // Eliminar un producto
    ipcMain.handle('products:delete', async (_event, id) => {
        return await productsService.remove(id)
    })

}