const AuthService = require('../../services/auth.service');

let authToken = null;

module.exports = (ipcMain) => {
  ipcMain.handle('auth:login', async (e, { username, password }) => {
    const data = await AuthService.login(username, password);
    authToken = data.token;
    return data; // devuelve token/user si quieres
  });

  ipcMain.handle("auth:logout", async () => {
    authToken = null;
    return { ok: true }
  });

  ipcMain.handle("auth:getToken", async () => authToken);

};