const { ipcRenderer, contextBridge } = require('electron');
const { BrowserWindow } = require('@electron/remote');

contextBridge.exposeInMainWorld('windowAPI', {
  minimize() {
    BrowserWindow.getFocusedWindow().minimize();
  },

  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow();

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },

  close() {
    BrowserWindow.getFocusedWindow().close();
  },
});

contextBridge.exposeInMainWorld('api', {
  saveLayout: (layout) => ipcRenderer.send('saveLayout', layout),
  getLayout: () => ipcRenderer.sendSync('getLayout'),
  getDiscordConnectionStatus: () => ipcRenderer.sendSync('getDiscordConnectionStatus'),
  getHostData: () => ipcRenderer.sendSync('getHostData'),
  saveTwitchOAuth: () => ipcRenderer.send('saveTwitchOAuth'),
  getTwitchOAuth: () => ipcRenderer.sendSync('getTwitchOAuth'),
  onDeviceCountChange: (callback) => ipcRenderer.on('deviceCountChange', callback),
  getImageFromPath: (imgPath) => ipcRenderer.sendSync('getImageFromPath', imgPath),
  setPassword: (newPassword) => ipcRenderer.send('setPassword', newPassword),
  setLanguage: (language) => ipcRenderer.send('setLanguage', language),
  getSettings: () => ipcRenderer.sendSync('getSettings'),
  getSetting: (setting) => ipcRenderer.sendSync('getSetting', setting),
  setSetting: (setting, value) => ipcRenderer.send('setSetting', { setting, value }),
  sendNewDiscordActivity: (newActivity) => ipcRenderer.send('sendNewDiscordActivity', newActivity),
  clearDiscordActivity: () => ipcRenderer.send('clearDiscordActivity'),
  onDiscordConnectionChange: (callback) => ipcRenderer.on('discordConnectionChange', callback),
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
