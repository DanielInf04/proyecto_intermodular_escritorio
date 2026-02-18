const { BrowserWindow } = require('electron')
const path = require('path')

function createWindow({ file, options = {} }) {
    const win = new BrowserWindow({
        width: 1360,
        height: 890,
        resizable: false,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, '../../preload.js')
        },
        ...options
    })

    win.loadFile(file)

    win.once('ready-to-show', () => {
        win.show();
    })

    return win
}

module.exports = { createWindow }