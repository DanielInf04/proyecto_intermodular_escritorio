const { usersService } = require('../../services/users.service');

module.exports = (ipcMain) => {

    ipcMain.handle('users:list', async (_e, params) => {
        return await usersService.list(params);
    });

    ipcMain.handle('users:getById', async (_e, id) => {
        return await usersService.getById(id);
    });

    ipcMain.handle('users:create', async (_e, data) => {
        return await usersService.create(data);
    });

    ipcMain.handle('users:update', async (_e, id, data) => {
        return await usersService.update(id, data);
    });

    ipcMain.handle('users:delete', async (_e, id) => {
        return await usersService.remove(id);
    });

}
