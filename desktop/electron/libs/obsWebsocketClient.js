const OBSWebSocket = require('obs-websocket-js').default;

const obs = new OBSWebSocket();
let obsConnected = false;

const initObsSocketConnection = async (
  port = 4455,
  password = '8DNxWhmrMCk7RxXy',
) => {
  try {
    await obs.connect(`ws://localhost:${port}`, password);
  } catch (error) {
    console.error(error);
  }

  obs.on('ConnectionClosed', () => {
    obsConnected = false;
  });
  obs.on('ConnectionError', () => {
    obsConnected = false;
  });
  obs.on('ConnectionOpened', () => {
    obsConnected = true;
  });
};

const emitObsCommand = async (command, data) => {
  let commandData = data;
  if (typeof data === 'string') commandData = JSON.parse(data);

  if (!obsConnected) await initObsSocketConnection();
  if (obsConnected) await obs.call(command, commandData);
};

module.exports = { initObsSocketConnection, emitObsCommand };
