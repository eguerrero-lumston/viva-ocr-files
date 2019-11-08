const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const url = require("url");
const path = require("path");
var ipcMain = require('electron').ipcMain;
const globalShortcut = electron.globalShortcut;

let mainWindow
function createWindow() {
    
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    mainWindow.maximize();
    
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.setMenu(null)
    mainWindow.setMenuBarVisibility(false)

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    globalShortcut.register('f5', function () {
        console.log('f5 is pressed')
        mainWindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function () {
        console.log('CommandOrControl+R is pressed')
        mainWindow.reload()
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
