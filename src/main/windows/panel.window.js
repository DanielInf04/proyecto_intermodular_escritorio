const path = require('path')
const { createWindow } = require('./createWindow')

const VIEW_BASE = path.join(__dirname, '../../view')

function createPanelWindow() {
  return createWindow({
    file: path.join(VIEW_BASE, 'panel', 'panel.html')
  })
}

module.exports = { createPanelWindow }