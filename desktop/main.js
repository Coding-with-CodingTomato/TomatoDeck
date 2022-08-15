/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const electronRemote = require('@electron/remote/main');
const { networkInterfaces } = require('os');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { keyboard, Key, mouse, Point } = require('@nut-tree/nut-js');
const { execSync, execFile } = require('child_process');
const sound = require('sound-play');
const axios = require('axios').default;
const RPC = require('discord-rpc');

const { NODE_ENV } = process.env;
const store = new Store();
const config = require('./config');

electronRemote.initialize();

let socketPort = 8100;
let password = '';
let appLanguage = 'en';
let connectedDevices = 0;
let discordClient = null;
let discordClientReady = false;
let discordActivity = null;
let mainWindow;
let layout = {};

/**
 * Discord RPC
 */
const clientId = config.discord_app_client_id;
const clientSecret = config.discord_app_client_secret;
const scopes = ['identify', 'rpc'];
const redirectUri = 'http://localhost';
const prompt = 'none';
let accessToken;

const changeDiscordConnection = (connected) => {
  console.log('change discord connection', connected);
  mainWindow.webContents.send('discordConnectionChange', connected);
};

const initDiscordClient = () => {
  if (discordClient !== null) {
    discordClient = null;
  }

  discordClient = new RPC.Client({ transport: 'ipc' });

  discordClient.on('ready', async () => {
    const isAccessTokenSet =
      !accessToken || (discordClient.accessToken != undefined && accessToken != discordClient.accessToken);
    if (isAccessTokenSet) {
      accessToken = discordClient.accessToken;
    }
    discordClientReady = true;
    changeDiscordConnection(true);
  });

  discordClient.on('disconnected', () => {
    discordClient = null;
    discordClientReady = false;
    changeDiscordConnection(false);
  });

  discordClient.on('error', (error) => {
    discordClient = null;
    accessToken = null;
    discordClientReady = false;

    log.error('Error while trying to login into discord rpc');
    log.error(JSON.stringify(error));

    changeDiscordConnection(false);
  });

  discordClient
    .login({
      clientId,
      clientSecret,
      accessToken,
      scopes,
      redirectUri,
      prompt,
    })
    .catch((error) => {
      discordClient = null;
      accessToken = null;
      discordClientReady = false;

      log.error('Error while trying to login into discord rpc');
      log.error(JSON.stringify(error));

      changeDiscordConnection(false);
    });
};

const discordActions = {
  checkClient: () => {
    if (discordClient === null || discordClientReady === false) {
      initDiscordClient();
    }
  },
  muteMicrophone: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ mute: true });
    }
  },
  unmuteMicrophone: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ mute: false });
    }
  },
  toggleMicrophone: async () => {
    discordActions.checkClient();
    if (discordClientReady) {
      const voiceState = await discordClient.getVoiceSettings();
      if (voiceState.mute) {
        discordActions.unmuteMicrophone();
      } else {
        discordActions.muteMicrophone();
      }
    }
  },
  deafHeadphones: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ deaf: true });
    }
  },
  undeafHeadphones: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ deaf: false });
    }
  },
  toggleHeadphones: async () => {
    discordActions.checkClient();
    if (discordClientReady) {
      const voiceState = await discordClient.getVoiceSettings();
      if (voiceState.deaf) {
        discordActions.undeafHeadphones();
      } else {
        discordActions.deafHeadphones();
      }
    }
  },
  leaveVoiceChannel: async () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.selectVoiceChannel(null);
    }
  },
  setActivity: (newActivity) => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setActivity(newActivity);
    }
  },
};

/**
 * Handle Storage
 */

const getLayoutFromStorage = () => {
  const newLayout = store.get('layout');
  if (newLayout === undefined) {
    layout = {
      deviceName: 'testDevice',
      layouts: [
        {
          name: 'layout1',
          rows: [{ elements: [] }],
        },
      ],
    };
  } else {
    layout = JSON.parse(newLayout);
  }
};
const changeDeviceCount = (change) => {
  connectedDevices += change;
  mainWindow.webContents.send('deviceCountChange', connectedDevices);
};
const getPortFromStorage = () => {
  const newPort = store.get('socketPort');

  if (!newPort) {
    socketPort = 8100;
    store.set('socketPort', 8100);
  } else {
    socketPort = newPort;
  }
};
const getPasswordFromStorage = () => {
  const storagePassword = store.get('password');

  if (storagePassword) {
    password = storagePassword;
  }
};
const getAppLanguageFromStorage = () => {
  const storageAppLanguage = store.get('appLanguage');

  if (storageAppLanguage) {
    appLanguage = storageAppLanguage;
  }
};
const getDiscordActivityFromStorage = () => {
  const newDiscordAcitivty = store.get('discordActivity');

  if (newDiscordAcitivty) {
    discordActions.setActivity(newDiscordAcitivty);
    discordActivity = newDiscordAcitivty;
  }
};

getLayoutFromStorage();
getPortFromStorage();
getPasswordFromStorage();
getAppLanguageFromStorage();
autoUpdater.checkForUpdatesAndNotify();

/**
 * Socket Stuff
 */
const io = new Server(socketPort, {
  cors: {
    origin: '*',
  },
});

// Check Password
io.use((socket, next) => {
  const err = new Error('Wrong Password');
  const { password: sentPassword } = socket.handshake.auth;

  console.log('Verbindungsversuch', password, sentPassword);

  if (password !== '') {
    if (sentPassword === password) {
      next();
    } else {
      next(err);
    }
  } else {
    next();
  }
});

io.on('connection', (socket) => {
  // Count new device
  changeDeviceCount(1);

  // Emits the layout to the current socket
  const emitLayout = () => {
    const discordButtonsPresent = layout.layouts.some((l) =>
      l.rows[0].elements.some((e) => {
        if (e.eventName === 'discord') {
          return true;
        }
        return false;
      }),
    );

    if (discordButtonsPresent && discordClient === null) {
      initDiscordClient();
      setTimeout(getDiscordActivityFromStorage, 2000);
    }

    socket.emit('deckLayout', JSON.stringify(layout));
  };
  const emitSucess = () => {
    socket.emit('sucessEvent');
  };
  const emitError = () => {
    socket.emit('errorEvent');
  };

  emitLayout();

  store.onDidChange('layout', () => {
    emitLayout();
  });

  // Send back image if requested
  socket.on('requestImage', async (data) => {
    const imagePath = data;
    fs.readFile(imagePath, (err, imageData) => {
      socket.emit('imageData', { imagePath, imageData });
    });
  });

  // Press keys after one other
  socket.on('keys', async (data) => {
    const keys = data.split(' ');
    if (keys.length) keys.forEach((k) => keyboard.type(k));
    emitSucess();
  });

  // Press keys combo
  socket.on('hotkey', async (data) => {
    const modifiers = data.split(' ');
    const key = modifiers.pop();

    const keyArray = modifiers.map((mod) => Key[mod]);
    keyArray.push(Key[key]);

    await keyboard.type(...keyArray);
    emitSucess();
  });

  // Open website
  socket.on('open_website', async (data) => {
    await shell.openExternal(data);
    emitSucess();
  });

  // Run exe
  socket.on('run_exe', async (data) => {
    let eventError = false;

    try {
      execFile(data);
    } catch (error) {
      console.error(error);
      log.error(`Error while trying to execute file with data: ${data}`);
      log.error(JSON.stringify(error));

      eventError = true;
      emitError();
    } finally {
      if (!eventError) {
        emitSucess();
      }
    }
  });

  // Run exe
  socket.on('open_folder', async (data) => {
    let eventError = false;
    let command = '';
    switch (process.platform) {
      case 'darwin':
        command = 'open';
        break;
      case 'win32':
        command = 'explorer';
        break;
      default:
        command = 'xdg-open';
        break;
    }

    try {
      execSync(`${command} "${data}"`);
    } catch (error) {
      console.error(error);
      log.error(`Error while trying to open folder with data: ${data}`);
      log.error(JSON.stringify(error));

      eventError = true;
      emitError();
    } finally {
      if (!eventError) {
        emitSucess();
      }
    }
  });

  // Click mouse at coord
  socket.on('click_mouse', async (data) => {
    const [x, y] = data.split(',');
    const point = new Point(Number(x), Number(y));
    await mouse.setPosition(point);
    await mouse.leftClick();
    emitSucess();
  });

  // Click mouse at coord
  socket.on('play_sound', async (data) => {
    let errorEvent = false;

    try {
      await sound.play(data);
    } catch (error) {
      console.log(error);
      log.error(`Error while trying to play audio with data: ${data}`);
      log.error(JSON.stringify(error));

      errorEvent = true;
      emitError();
    } finally {
      if (!errorEvent) {
        emitSucess();
      }
    }
  });

  // Counter Action
  socket.on('counter', async (data) => {
    if (data.id) {
      layout.layouts.forEach((l, i) => {
        l.rows[0].elements.forEach((e, j) => {
          if (e.id === data.id) {
            const oldNumber = Number(layout.layouts[i].rows[0].elements[j].data);
            layout.layouts[i].rows[0].elements[j].data = oldNumber + 1;
            emitLayout();
          }
        });
      });
    }
  });

  // HTTP GET REQUEST
  socket.on('http_get_request', async (data) => {
    if (data) {
      let errorEvent = false;

      try {
        await axios.get(data);
      } catch (error) {
        errorEvent = true;
        emitError();
      } finally {
        if (!errorEvent) {
          emitSucess();
        }
      }
    }
  });

  // Discord Interaction
  socket.on('discord', async (data) => {
    try {
      switch (data) {
        case 'mute_microphone':
          discordActions.muteMicrophone();
          break;
        case 'unmute_microphone':
          discordActions.unmuteMicrophone();
          break;
        case 'toggle_microphone':
          discordActions.toggleMicrophone();
          break;
        case 'deaf_headphones':
          discordActions.deafHeadphones();
          break;
        case 'undeaf_headphones':
          discordActions.undeafHeadphones();
          break;
        case 'toggle_headphones':
          discordActions.toggleHeadphones();
          break;
        case 'leave_voice_channel':
          discordActions.leaveVoiceChannel();
          break;
        default:
          break;
      }
      emitSucess();
    } catch (error) {
      emitError();
    }
  });

  socket.on('disconnect', () => {
    changeDeviceCount(-1);
  });
});

/**
 * Electron Stuff
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1200,
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
      : `file://${path.join(__dirname, 'dist/index.html')}`,
  );
}

// Send current layout back to render process
ipcMain.on('getLayout', (event) => {
  event.returnValue = layout;
});

// Send current host data
ipcMain.on('getHostData', (event) => {
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
    socketPort,
    discordActivity,
  };

  event.returnValue = hostData;
  // Lookup CPU Load
  // Lookup RAM Load
});

// Saves new layout from render process
ipcMain.on('saveLayout', (event, args) => {
  const newLayout = JSON.parse(args);
  layout = newLayout;
  store.set('layout', args);
});

// Save OAuth Key to config
ipcMain.on('saveTwitchOAuth', (event, args) => {
  store.set('twitchOAuth', args);
});

// Get OAuth Key to config
ipcMain.on('getTwitchOAuth', (event) => {
  const res = store.get('twitchOAuth');
  event.returnValue = res;
});

// Get image from path
ipcMain.on('getImageFromPath', (event, args) => {
  const imagePath = args;

  fs.readFile(imagePath, (err, data) => {
    event.returnValue = data;
  });
});

// Get all settings
ipcMain.on('getSettings', (event) => {
  const settings = {
    appLanguage,
    socketPort,
    discordActivity,
  };

  event.returnValue = settings;
});

// Set new password
ipcMain.on('setPassword', (event, args) => {
  const newPassword = args;
  if (newPassword === '') {
    store.set('password', '');
  } else {
    const hash = crypto.createHash('sha256').update(newPassword).digest('hex');
    password = hash;
    store.set('password', hash);
  }
});

// Set app language
ipcMain.on('setLanguage', (event, args) => {
  const newLanguage = args;
  store.set('appLanguage', newLanguage);
});

// Set setting
ipcMain.on('setSetting', (event, args) => {
  const { setting, value } = args;
  if (setting && value) {
    store.set(setting, value);
  }
});

// Set discord rp activity
ipcMain.on('sendNewDiscordActivity', (event, args) => {
  const newActivity = JSON.parse(args);
  discordActions.setActivity(newActivity);

  store.set('discordActivity', newActivity);
});

// Clear discord rp activity
ipcMain.on('clearDiscordActivity', (event, args) => {
  discordClient.clearActivity();
  store.delete('discordActivity');
});

// Get current discord status
ipcMain.on('getDiscordConnectionStatus', (event) => {
  event.returnValue = discordClientReady;
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
