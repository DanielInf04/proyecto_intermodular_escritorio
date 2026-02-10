const { createPanelWindow } = require('../windows');

module.exports = (ipcMain) => {
  ipcMain.handle('ui:openPanel', () => {
    createPanelWindow();
    return true;
  });
};