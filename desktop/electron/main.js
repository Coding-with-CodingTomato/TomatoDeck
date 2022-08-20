/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const electronRemote = require('@electron/remote/main');
const path = require('path');
const {
  initSocketServer,
  onSocketDeviceCountChange,
} = require('./libs/socketServer');
const { initTwitchClient } = require('./libs/twitchChatClient');
const {
  initDiscordIPC,
  discordActions,
  onDiscordConnectionChange,
} = require('./libs/discordIpcClient');
const { initObsSocketConnection } = require('./libs/obsWebsocketClient');
const { initStorage } = require('./libs/storage');
const ipcActions = require('./libs/ipcActions');

const { NODE_ENV } = process.env;

electronRemote.initialize();
autoUpdater.checkForUpdatesAndNotify();

let connectedDevices = 0;
let mainWindow;

/**
 * Handle Storage
 */
const settings = initStorage();

/**
 * Socket Server
 */
initSocketServer(settings.password, settings.socketPort, settings.layout);

onSocketDeviceCountChange((change) => {
  connectedDevices += change;
  mainWindow.webContents.send('deviceCountChange', connectedDevices);
});
/**
 * Discord RPC
 */
const checkForDiscordButtonsAndLogin = (layout) => {
  if (layout && layout.layouts) {
    const discordButtonsPresent = layout.layouts.some((l) =>
      l.rows[0].elements.some((e) => e.eventName === 'discord'),
    );

    if (discordButtonsPresent) {
      initDiscordIPC();
      setTimeout(discordActions.setActivityFromStorage, 2000);
    }
  }
};

onDiscordConnectionChange((connected) => {
  mainWindow.webContents.send('discordConnectionChange', connected);
});

checkForDiscordButtonsAndLogin(settings.layout);

/**
 * OBS Client
 */
// const checkForOBSButtonsAndLogin = (layout) => {
//   if (layout && layout.layouts) {
//     const buttonsPresent = layout.layouts.some((l) =>
//       l.rows[0].elements.some((e) => e.eventName === 'obs_command'),
//     );

//     if (buttonsPresent) {
//       console.log('OBS BUTTONS PRESENT');
//       initObsSocketConnection();
//     }
//   }
// };
if (settings.obs.socket.enabled)
  initObsSocketConnection(
    settings.obs.socket.port,
    settings.obs.socket.password,
  );

/**
 * Twitch Client
 */
if (settings.twitch.enabled) initTwitchClient();

/**
 * Electron Stuff
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
  });

  electronRemote.enable(mainWindow.webContents);
  // win.loadFile('dist/index.html');
  // mainWindow.openDevTools();

  mainWindow.loadURL(
    NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`,
  );
}

// Init all ipc events
ipcActions.forEach((action) => {
  ipcMain.on(action.event, (event, args) => {
    action.execute(event, args);
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
