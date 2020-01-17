'use strict';

const { app, ipcMain } = require('electron');
const pug = require('pug');
const path = require('path');
var server = require('./server')()

var win = null;
var webServer = null;

require('./window');

ipcMain.on('resizeWindow', async function(e, width, height) {
    win.setSize(width, height, true);
    WIN_POSITION = await setWindowPosition(win, WIN_POSITION);
});
ipcMain.on('moveWindow', async function(e, position) {
    WIN_POSITION = await setWindowPosition(win, position);
});

app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      if (webServer) webServer.kill();  
      app.quit();
    }
});

app.on('activate', async () => {
    // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
    // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
    if (win === null && app.requestSingleInstanceLock() && app.hasSingleInstanceLock()) {
        win = await createWindow();
        win.on('closed', () => {
            win = null;
        });
        win.once('ready-to-show', async () => {
            WIN_POSITION = await setWindowPosition(win, WIN_POSITION);
            win.show();
        });
    } else {
      app.quit();
    }
});

app.on('ready', async function() {
    try {
      if (win === null && app.requestSingleInstanceLock() && app.hasSingleInstanceLock()) {
        win = await createWindow();
        win.on('closed', () => {
            win = null;
        });
        win.once('ready-to-show', async () => {
            WIN_POSITION = await setWindowPosition(win, WIN_POSITION);
            win.show();
        });
        win.loadURL('http://localhost:3000/');
      } else {
        app.quit();
      }
    } catch (err) {
      console.error(err);
    }
});