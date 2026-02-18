const { BrowserWindow } = require('electron')
const { createPanelWindow, createLoginWindow } = require('../windows');

module.exports = (ipcMain) => {

  ipcMain.handle('ui:openPanel', () => {
    createPanelWindow();
    return true;
  });

  ipcMain.handle('ui:logoutToLogin', (e) => {
    const panelWin = BrowserWindow.fromWebContents(e.sender);

    const loginWin = createLoginWindow();
    loginWin.once('ready-to-show', () => loginWin.show());

    panelWin.close();
    return true;
  });

};