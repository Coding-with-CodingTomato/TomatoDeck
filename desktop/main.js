/* eslint-disable no-undef */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Server } = require('socket.io');
const robot = require('robotjs');

/**
 * Socket Stuff
 */
const io = new Server(6942, {
  cors: {
    origin: '*',
  },
});

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

  socket.emit(
    'deckLayout',
    JSON.stringify({
      deviceName: 'testDevice',
      layouts: [
        {
          name: 'layout1',
          rows: [{
            elements: [{
              type: 'button',
              text: '🔈',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_mute',
            }, {
              type: 'button',
              text: 'Next',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_next',
            }, {
              type: 'button',
              text: 'Prev',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_prev',
            }, {
              type: 'button',
              text: '▶️',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_play',
            }, {
              type: 'button',
              text: '🔊',
              color: '#2dd36f',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'audio_vol_up',
            }, {
              type: 'button',
              text: '🔉',
              color: '#2dd36f',
              image: '',
              eventName: 'keys',
              data: 'audio_vol_down',
            }, {
              type: 'button',
              text: 'HotKey Alt+F4',
              color: '#E91E63',
              image: '',
              icon: '',
              eventName: 'hotkey',
              data: 'alt f4',
            }, {
              type: 'button',
              text: 'HotKey Enter Space',
              color: '#008B02',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'enter space',
            }, {
              type: 'button',
              text: 'HotKey Vi',
              color: '#F44336',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'v i o l a space i s t space t o l l',
            }, {
              type: 'button',
              text: 'HotKey marco',
              color: '#F44336',
              image: '',
              icon: '',
              eventName: 'keys',
              data: 'm a r c o space i s t space t o l l',
            }, {
              type: 'button',
              text: 'Discord Mic mute',
              color: '#F44336',
              image: '',
              icon: '',
              eventName: 'hotkey',
              data: 'control shift m',
            }],
          }],
        },
      ],
    }),
  );

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`, err);
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
    width: 800,
    height: 600,
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
