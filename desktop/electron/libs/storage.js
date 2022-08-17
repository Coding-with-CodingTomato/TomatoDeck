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
  let storedLayout = store.get('layout');
  let storedPort = store.get('socketPort');
  let storedPassword = store.get('password');
  let storedAppLanguage = store.get('appLanguage');
  let storedDiscordAcitivty = store.get('discordActivity');
  let storedTwitchOauth = store.get('twitchOauth');

  if (storedLayout === undefined) storedLayout = defaultLayout;
  if (storedPort === undefined) storedPort = defaultPort;
  if (storedPassword === undefined) storedPassword = '';
  if (storedAppLanguage === undefined) storedAppLanguage = 'en';
  if (storedDiscordAcitivty === undefined) storedDiscordAcitivty = '';
  if (storedTwitchOauth === undefined) storedTwitchOauth = {};

  return {
    layout: JSON.parse(storedLayout),
    port: Number(storedPort),
    password: storedPassword,
    appLanguage: storedAppLanguage,
    discordActivity: storedDiscordAcitivty,
    twitchOauth: storedTwitchOauth,
  };
};

module.exports = { initStorage, saveSetting, getSetting, deleteSetting };
