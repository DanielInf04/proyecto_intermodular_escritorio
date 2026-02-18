const AuthService = require('../../services/auth.service');
const { setToken, clearToken, getToken } = require('../../services/apiClient')

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

//let authToken = null;

module.exports = (ipcMain) => {
  ipcMain.handle('auth:login', async (e, { username, password }) => {
    const data = await AuthService.login(username, password);
    
    await clearToken();

    //authToken = data.token;

    // Guarda el token
    await setToken(data.token);

    return data; // devuelve token/user si quieres
  });

  ipcMain.handle("auth:logout", async () => {
    await clearToken();
    return { ok: true }
  });

  ipcMain.handle("auth:getToken", async () => await getToken());

  ipcMain.handle("auth:getCurrentUser", async () => {
    const token = await getToken();
    if (!token) return null;
    return decodeJwtPayload(token); // { sub, email, role, iat, exp, ... } según tu backend
  });

};