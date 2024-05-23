const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 700,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in the renderer process (your Vue.js app)
    },
  });

  mainWindow.loadURL('http://localhost:8080'); // Replace this with the URL of your Vue.js app
  /*mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );*/

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});