const path = require('path')
const { createWindow } = require('./createWindow')

const VIEW_BASE = path.join(__dirname, '../../view')

function createLoginWindow() {
    return createWindow({
        file: path.join(VIEW_BASE, 'login', 'login.html')
    })
}

module.exports = { createLoginWindow }