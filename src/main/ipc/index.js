module.exports = (ipcMain) => {
    require('./auth.ipc')(ipcMain)
    require('./ui.ipc')(ipcMain)
    require('./products.ipc')(ipcMain)
    require('./categories.ipc')(ipcMain)
    require('./subcategories.ipc')(ipcMain)
}