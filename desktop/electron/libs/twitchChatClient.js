const tmi = require('tmi.js');
const Store = require('electron-store');

const store = new Store();
const TWITCH_OAUTH_STORAGE_KEY = 'twitchOauth';
let twitchClient;

const initTwitchClient = async () => {
  const twitchOauthRaw = await store.get(TWITCH_OAUTH_STORAGE_KEY);
  if (twitchOauthRaw) {
    const twitchOauth = JSON.parse(twitchOauthRaw);

    if (twitchOauth.channelName !== '' && twitchOauth.oauthToken !== '') {
      const newClient = new tmi.Client({
        options: { debug: false },
        identity: {
          username: twitchOauth.channelName,
          password: twitchOauth.oauthToken,
        },
      });

      newClient.connect().catch(console.error);

      twitchClient = newClient;
    }
  }
};

const sendTwitchMessage = async (channel, message) => {
  if (!twitchClient) await initTwitchClient();
  twitchClient.say(channel, message);
};

module.exports = { initTwitchClient, sendTwitchMessage };
