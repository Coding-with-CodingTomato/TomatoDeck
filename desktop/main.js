/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require('electron');
const { networkInterfaces } = require('os');
const { Server } = require('socket.io');
const Store = require('electron-store');
const path = require('path');
const {keyboard, Key} = require("@nut-tree/nut-js");

let socketPort = 8100;
let layout = {
  deviceName: 'testDevice',
  layouts: [
    {
      name: 'layout1',
      rows: [
        {
          elements: [
            {
              id: '1',
              row_index: 0,
              type: 'button',
              text: '🔈 TEST',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_mute',
            },
            {
              id: '2',
              row_index: 0,
              type: 'button',
              text: 'Next',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_next',
            },
            {
              id: '3',
              row_index: 0,
              type: 'button',
              text: 'Prev',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_prev',
            },
            {
              id: '4',
              row_index: 0,
              type: 'button',
              text: '▶️',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_play',
            },
            {
              id: '5',
              row_index: 0,
              type: 'button',
              text: '🔊',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_vol_up',
            },
            {
              id: '6',
              row_index: 0,
              type: 'button',
              text: '🔉',
              color: '#2dd36f',
              image: '',
              eventName: 'keys',
              data: 'audio_vol_down',
            },
            {
              id: '7',
              row_index: 0,
              type: 'button',
              text: 'HotKey Alt+F4',
              color: '#E91E63',
              image: '',
              icon: '',
              eventName: 'hotkey',
              data: 'alt f4',
            },
            {
              id: '8',
              row_index: 0,
              type: 'button',
              text: 'HotKey Enter Space',
              color: '#008B02',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'enter space',
            },
            {
              id: '9',
              row_index: 0,
              type: 'button',
              text: 'HotKey hallo chat',
              color: '#F44336',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'h a l l o space c h a t',
            },
            {
              id: '10',
              row_index: 0,
              type: 'button',
              text: 'Discord Mic mute',
              color: '#F44336',
              image: '',
              icon: '',
              eventName: 'hotkey',
              data: 'control shift m',
            },
          ],
        },
      ],
    },
  ],
};
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

const getPortFromStorage = () => {
  const newPort = store.get('socketPort');
  console.log(newPort);

  if (newPort === null) {
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
  /**
   * Layout
   *  - Rows
   *    - Col
   *      - Element
   *        - Button (text, farbe, image, eventName)
   *        (- Slider (text))
   *        (- Sonstiges)
   */

  // Emits the layout to the current socket
  const emitLayout = () => {
    socket.emit('deckLayout', JSON.stringify(layout));
  };

  emitLayout();

  store.onDidChange('layout', () => {
    emitLayout();
  });

  // Press keys after one other
  socket.on('keys', async (data) => {
    const keys = data.split(' ');
    if (keys.length) keys.forEach((k) => keyboard.type(k));
  });

  // Press keys combo
  socket.on('hotkey', async (data) => {
    const modifiers = data.split(' ');
    const key = modifiers.pop();

    const keyArray = modifiers.map((mod) => Key[mod]);
    keyArray.push(Key[key]);

    await keyboard.type(...keyArray);
  });
});

/**
 * Electron Stuff
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('dist/index.html');
}

// Send current layout back to render process
ipcMain.on('getLayout', (event) => {
  event.returnValue = layout;
});

// Send current host data
ipcMain.on('getHostData', (event) => {
  // Lookup IP Adress
  const allNetworkInterfaces = networkInterfaces();

  if (allNetworkInterfaces.Ethernet) {
    const networkInterface = allNetworkInterfaces.Ethernet.find((e) => {
      if (e.family === 'IPv4') {
        return true;
      }

      return false;
    });

    const hostData = {
      ip: networkInterface.address,
      socketPort,
    };

    event.returnValue = hostData;
  } else {
    console.error('Ethernet not found!', allNetworkInterfaces);
  }

  // Lookup CPU Load
  // Lookup RAM Load
});

// Saves new layout from render process
ipcMain.on('saveLayout', (event, args) => {
  const newLayout = JSON.parse(args);
  layout = newLayout;
  store.set('layout', args);
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
