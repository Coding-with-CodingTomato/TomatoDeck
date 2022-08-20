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
  if (typeof key === 'string' && typeof value === 'string') {
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
  store.delete(key);
};

const initStorage = () => {
  const settings = store.get();
  settings.layout = JSON.parse(settings.layout);

  if (settings.socketPort === undefined) settings.socketPort = defaultPort;
  if (settings.layout === undefined) settings.layout = defaultLayout;

  return settings;
};

module.exports = { initStorage, saveSetting, getSetting, deleteSetting };
