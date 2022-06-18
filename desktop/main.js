/* eslint-disable no-undef */
const {
  app, BrowserWindow, ipcMain, shell,
} = require('electron');
const { networkInterfaces } = require('os');
const { Server } = require('socket.io');
const Store = require('electron-store');
const path = require('path');
const {
  keyboard, Key, mouse, Point,
} = require('@nut-tree/nut-js');
const {
  exec, spawn, execSync, execFile,
} = require('child_process');
const sound = require('sound-play');

const { NODE_ENV } = process.env;
let socketPort = 8100;
let connectedDevices = 0;
let mainWindow;
let layout = {};
// let layout = {
//   deviceName: 'testDevice',
//   layouts: [
//     {
//       name: 'layout1',
//       rows: [
//         {
//           elements: [
//             {
//               id: '1',
//               row_index: 0,
//               type: 'button',
//               text: '🔈 TEST',
//               color: '#2dd36f',
//               image: '',
//               icon: '',
//               eventName: 'keys',
//               data: 'audio_mute',
//             },
//             {
//               id: '2',
//               row_index: 0,
//               type: 'button',
//               text: 'Next',
//               color: '#2dd36f',
//               image: '',
//               icon: '',
//               eventName: 'keys',
//               data: 'audio_next',
//             },
//             {
//               id: '3',
//               row_index: 0,
//               type: 'button',
//               text: 'Prev',
//               color: '#2dd36f',
//               image: '',
//               icon: '',
//               eventName: 'keys',
//               data: 'audio_prev',
//             },
//             {
//               id: '4',
//               row_index: 0,
//               type: 'button',
//               text: '▶️',
//               color: '#2dd36f',
//               image: '',
//               icon: '',
//               eventName: 'keys',
//               data: 'audio_play',
//             },
//             {
//               id: '5',
//               row_index: 0,
//               type: 'button',
//               text: '🔊',
//               color: '#2dd36f',
//               image: '',
//               icon: '',
//               eventName: 'keys',
//               data: 'audio_vol_up',
//             },
//             {
//               id: '6',
//               row_index: 0,
//               type: 'button',
//               text: '🔉',
//               color: '#2dd36f',
//               image: '',
//               eventName: 'keys',
//               data: 'audio_vol_down',
//             },
//             {
//               id: '7',
//               row_index: 0,
//               type: 'button',
//               text: 'HotKey Alt+F4',
//               color: '#E91E63',
//               image: '',
//               icon: '',
//               eventName: 'hotkey',
//               data: 'alt f4',
//             },
//             {
//               id: '8',
//               row_index: 0,
//               type: 'button',
//               text: 'HotKey Enter Space',
//               color: '#008B02',
//               image: '',
//               icon: '',
//               eventName: 'keys',
//               data: 'enter space',
//             },
//             {
//               id: '9',
//               row_index: 0,
//               type: 'button',
//               text: 'HotKey hallo chat',
//               color: '#F44336',
//               image: '',
//               icon: '',
//               eventName: 'keys',
//               data: 'h a l l o space c h a t',
//             },
//             {
//               id: '10',
//               row_index: 0,
//               type: 'button',
//               text: 'Discord Mic mute',
//               color: '#F44336',
//               image: '',
//               icon: '',
//               eventName: 'hotkey',
//               data: 'control shift m',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
const store = new Store();

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

getLayoutFromStorage();
getPortFromStorage();

/**
 * Socket Stuff
 */
const io = new Server(socketPort, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  // Count new device
  changeDeviceCount(1);

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
    } catch (err) {
      eventError = true;
      console.error(err);
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
      console.error(error);
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

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  console.log(app.getPath('userData'));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
