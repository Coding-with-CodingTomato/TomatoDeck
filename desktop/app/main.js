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
    origin: 'capacitor://localhost',
  },
});

io.on('connection', (socket) => {
  socket.emit('hello', 'world');

  socket.on('mediaMute', () => {
    robot.keyTap('audio_mute');
  });

  socket.on('mediaNextTrack', () => {
    robot.keyTap('audio_next');
  });

  socket.on('mediaPrevTrack', () => {
    robot.keyTap('audio_prev');
  });

  socket.on('mediaPlay', () => {
    robot.keyTap('audio_play');
  });

  socket.on('mediaStop', () => {
    robot.keyTap('audio_stop');
  });

  socket.on('mediaVolUp', () => {
    robot.keyTap('audio_vol_up');
  });

  socket.on('mediaVolDown', () => {
    robot.keyTap('audio_vol_down');
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
