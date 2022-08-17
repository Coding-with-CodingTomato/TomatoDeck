const fs = require('fs');
const { networkInterfaces } = require('os');
const {
  initStorage,
  saveSetting,
  getSetting,
  deleteSetting,
} = require('./storage');
const { emitLayout } = require('./socketServer');
const { discordActions, isDiscordClientReady } = require('./discordIpcClient');

const settings = initStorage();

const ipcActions = [
  {
    event: 'getLayout',
    execute: (event) => {
      event.returnValue = settings.layout;
    },
  },
  {
    event: 'getHostData',
    execute: (event) => {
      // Lookup IP Adress
      const nets = networkInterfaces();
      const ips = new Set();

      Object.keys(nets).forEach((name) => {
        nets[name].forEach((net) => {
          const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
          if (net.family === familyV4Value && !net.internal) {
            ips.add(net.address);
          }
        });
      });
      const [firstIPResult] = ips;

      const hostData = {
        ip: firstIPResult || '0.0.0.0',
        socketPort: settings.port,
        discordActivity: settings.discordActivity,
      };

      event.returnValue = hostData;
      // Lookup CPU Load
      // Lookup RAM Load
    },
  },
  {
    event: 'saveLayout',
    execute: (event, args) => {
      const newLayout = JSON.parse(args);
      settings.layout = newLayout;
      saveSetting('layout', args);
      emitLayout();
    },
  },
  {
    event: 'saveTwitchOAuth',
    execute: (event, args) => {
      saveSetting('twitchOAuth', args);
    },
  },
  {
    event: 'getTwitchOAuth',
    execute: (event, args) => {
      const res = getSetting('twitchOAuth', args);
      event.returnValue = res;
    },
  },
  {
    event: 'getImageFromPath',
    execute: (event, args) => {
      const imagePath = args;

      fs.readFile(imagePath, (err, data) => {
        event.returnValue = data;
      });
    },
  },
  {
    event: 'getSetting',
    execute: (event, args) => {
      const setting = getSetting(args);
      event.returnValue = setting;
    },
  },
  {
    event: 'getSettings',
    execute: (event) => {
      const setting = initStorage();
      event.returnValue = setting;
    },
  },
  {
    event: 'setPassword',
    execute: (event, args) => {
      const newPassword = args;
      if (newPassword === '') {
        saveSetting('password', '');
      } else {
        const hash = crypto
          .createHash('sha256')
          .update(newPassword)
          .digest('hex');
        settings.password = hash;
        saveSetting('password', hash);
      }
    },
  },
  {
    event: 'setLanguage',
    execute: (event, args) => {
      const newLanguage = args;
      saveSetting('appLanguage', newLanguage);
    },
  },
  {
    event: 'setSetting',
    execute: (event, args) => {
      const { setting, value } = args;
      if (setting && value) {
        saveSetting(setting, value);
      }
    },
  },
  {
    event: 'sendNewDiscordActivity',
    execute: (event, args) => {
      const newActivity = JSON.parse(args);
      discordActions.setActivity(newActivity);
      saveSetting('discordActivity', newActivity);
    },
  },
  {
    event: 'clearDiscordActivity',
    execute: () => {
      discordActions.clearActivity();
      deleteSetting('discordActivity');
    },
  },
  {
    event: 'getDiscordConnectionStatus',
    execute: (event) => {
      event.returnValue = isDiscordClientReady();
    },
  },
];

module.exports = ipcActions;
