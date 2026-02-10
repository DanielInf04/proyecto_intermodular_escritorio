// Dependencies
require('dotenv').config()
const { app, BrowserWindow, ipcMain } = require('electron');
const { createLoginWindow } = require('./src/main/windows')
const registerIpc = require('./src/main/ipc/index');

// Windows for app
let loginWindow
let panelWindow

// When app is ready
app.whenReady().then(() => {
  registerIpc(ipcMain);

  loginWindow = createLoginWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      loginWindow = createLoginWindow()
    }
  })
})