const AuthService = require('../../services/auth.service');

module.exports = (ipcMain) => {
  ipcMain.handle('auth:login', async (e, { username, password }) => {
    const data = await AuthService.login(username, password);
    return data; // devuelve token/user si quieres
  });
};