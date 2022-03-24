/* eslint-disable no-undef */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Server } = require('socket.io');
const robot = require('robotjs');

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
              text: '🔈',
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

const sockets = new Map();

/**
 * Socket Stuff
 */
const io = new Server(6942, {
  cors: {
    origin: '*',
  },
});

const emitDeckLayout = () => {
  Array.from(sockets.values()).forEach((s) => {
    s.emit(
      'deckLayout',
      JSON.stringify(layout),
    );
  });
};

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`, err);
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
  const id = Math.random();
  sockets.set(id, socket);

  emitDeckLayout();

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`, err);
    sockets.delete(id);
  });

  socket.on('updateLayout', (data) => {
    console.log('Updatelayout');
    layout = JSON.parse(data);
    emitDeckLayout();
  });

  // Press keys after one other
  socket.on('keys', (data) => {
    const keys = data.split(' ');
    if (keys.length) keys.forEach((k) => robot.keyTap(k));
  });

  // Press keys combo
  socket.on('hotkey', (data) => {
    const keys = data.split(' ');
    if (keys.length) {
      const { length } = keys;

      // Press hot key combo
      keys.forEach((key, index) => {
        if (index === length - 1) {
          robot.keyTap(key);
        } else {
          robot.keyToggle(key, 'down');
        }
      });

      // Release hold down keys
      keys.forEach((key, index) => {
        if (!(index === length - 1)) {
          robot.keyToggle(key, 'up');
        }
      });
    }
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
