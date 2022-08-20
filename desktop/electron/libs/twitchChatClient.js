const tmi = require('tmi.js');
const { initStorage } = require('./storage');

let twitchClient;
const settings = initStorage();

const initTwitchClient = async () => {
  if (settings.twitch.enabled) {
    const newClient = new tmi.Client({
      options: { debug: false },
      identity: {
        username: settings.twitch.username,
        password: settings.twitch.oauth,
      },
    });
    newClient.connect().catch(console.error);

    twitchClient = newClient;
  }
};

const sendTwitchMessage = async (channel, message) => {
  if (!twitchClient) await initTwitchClient();
  twitchClient.say(channel, message);
};

module.exports = { initTwitchClient, sendTwitchMessage };
