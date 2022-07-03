/* eslint-disable no-undef */
const {
  app, BrowserWindow, ipcMain, shell,
} = require('electron');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { networkInterfaces } = require('os');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const {
  keyboard, Key, mouse, Point,
} = require('@nut-tree/nut-js');
const {
  execSync, execFile,
} = require('child_process');
const sound = require('sound-play');

const { NODE_ENV } = process.env;
const store = new Store();

let socketPort = 8100;
let password = '';
let appLanguage = 'en';
let connectedDevices = 0;
let mainWindow;
let layout = {};

const getLayoutFromStorage = () => {
  const newLayout = store.get('layout');
  if (newLayout === undefined) {
    layout = {
      deviceName: 'testDevice',
      layouts: [
        {
          name: 'layout1',
          rows: [
            { elements: [] },
          ],
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

  // Log new connection
  log.info('New Socket Connection');

  // Emits the layout to the current socket
  const emitLayout = () => {
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

  socket.on('disconnect', () => {
    changeDeviceCount(-1);
    log.info('A Socket Disconnected');
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
  });

  // win.loadFile('dist/index.html');

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
