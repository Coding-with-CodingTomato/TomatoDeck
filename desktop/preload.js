const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveLayout: (layout) => ipcRenderer.send('saveLayout', layout),
  getLayout: () => ipcRenderer.sendSync('getLayout'),
  getHostData: () => ipcRenderer.sendSync('getHostData'),
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