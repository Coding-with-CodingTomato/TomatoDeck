const Store = require('electron-store');

const store = new Store();
const defaultPort = 8100;
const defaultLayout = {
  deviceName: 'testDevice',
  layouts: [
    {
      name: 'layout1',
      rows: [{ elements: [] }],
    },
  ],
};

const saveSetting = (key, value) => {
  if (typeof key === 'string') {
    store.set(key, value);
  }
};

const getSetting = (key) => {
  if (typeof key === 'string') {
    return store.get(key);
  }

  return undefined;
};

const deleteSetting = (key) => {
  if (typeof key === 'string') {
    store.delete(key);
  }
};

const initStorage = () => {
  let settings = store.get();

  if (store.size === 0) {
    store.set('layout', JSON.stringify(defaultLayout));
    store.set('socketPort', defaultPort);
    store.set('obs.socket.enabled', 'false');
    store.set('twitch.enabled', 'false');
    store.set('discord.enabled', 'false');
    settings = store.get();
  }

  settings.layout = JSON.parse(settings.layout);
  if (settings.socketPort === undefined) settings.socketPort = defaultPort;
  if (settings.layout === undefined) settings.layout = defaultLayout;

  return settings;
};

module.exports = { initStorage, saveSetting, getSetting, deleteSetting };
