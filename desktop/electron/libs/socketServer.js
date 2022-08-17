const Store = require('electron-store');
const { Server } = require('socket.io');
const socketActions = require('./socketActions');
const { saveSetting } = require('./storage');

const store = new Store();

let io;
let layout;

let socketDeviceCountChangeCb;
const onSocketDeviceCountChange = (cb) => {
  if (typeof cb === 'number') socketDeviceCountChangeCb(cb);
  else if (typeof cb === 'function') socketDeviceCountChangeCb = cb;
};

const emitLayout = async () => {
  layout = JSON.parse(store.get('layout'));
  io.emit('deckLayout', JSON.stringify(layout));
};

const initSocketServer = (password, port, newLayout) => {
  layout = newLayout;

  io = new Server(port, {
    cors: {
      origin: '*',
    },
  });

  // Middleware for checking if password is present
  io.use((socket, next) => {
    const err = new Error('Wrong Password');
    const { password: sentPassword } = socket.handshake.auth;

    if (password === '') return next(err);
    if (password !== sentPassword) return next(err);

    return next();
  });

  // Defining Socket Events
  io.on('connection', (socket) => {
    // Count new device
    onSocketDeviceCountChange(1);

    // Emit current layout
    emitLayout();

    // Init all actions defined in socketActions.js
    socketActions.forEach((action) => {
      socket.on(action.event, (data) => {
        action.execute(data, socket);
      });
    });

    // Counter Action
    socket.on('counter', async (data) => {
      if (data.id) {
        layout.layouts.forEach((l, i) => {
          l.rows[0].elements.forEach((e, j) => {
            if (e.id === data.id) {
              const oldNumber = Number(
                layout.layouts[i].rows[0].elements[j].data,
              );
              layout.layouts[i].rows[0].elements[j].data = oldNumber + 1;
              saveSetting('layout', JSON.stringify(layout));
              emitLayout();
            }
          });
        });
      }
    });

    socket.on('disconnect', () => {
      onSocketDeviceCountChange(-1);
    });
  });
};

module.exports = { initSocketServer, emitLayout, onSocketDeviceCountChange };
