const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 220,
    height: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
    },
  });  
  mainWindow.loadURL('http://localhost:3000/widget'); // or use local `index.html` if bundled
  mainWindow.setBounds({ x: 10, y: 10, width: 220, height: 100 });
  mainWindow.setAlwaysOnTop(true, "floating");
});