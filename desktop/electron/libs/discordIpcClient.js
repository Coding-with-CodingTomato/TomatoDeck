const log = require('electron-log');
const RPC = require('discord-rpc');
const { initStorage } = require('./storage');
const config = require('../../config');

const settings = initStorage();

let discordClient;
let discordClientReady;

const clientId = config.discord_app_client_id;
const clientSecret = config.discord_app_client_secret;
const scopes = ['identify', 'rpc'];
const redirectUri = 'http://localhost';
const prompt = 'none';
let accessToken;

/**
 * Custom Discord Events
 */
let discordConnectionChangeCallback;
const onDiscordConnectionChange = (cb) => {
  if (typeof cb === 'boolean') {
    discordConnectionChangeCallback(cb);
  } else if (typeof cb === 'function') {
    discordConnectionChangeCallback = cb;
  }
};

/**
 * Discord Client Functions
 */
const connectToDiscordIPC = () =>
  new Promise((resolve, reject) => {
    if (discordClient !== null) {
      discordClient = null;
    }

    discordClient = new RPC.Client({ transport: 'ipc' });

    discordClient.on('ready', async () => {
      const isAccessTokenSet =
        !accessToken ||
        (discordClient.accessToken !== undefined &&
          accessToken !== discordClient.accessToken);
      if (isAccessTokenSet) {
        accessToken = discordClient.accessToken;
      }
      discordClientReady = true;
      onDiscordConnectionChange(true);
      resolve('connected');
    });

    discordClient.on('disconnected', () => {
      discordClient = null;
      discordClientReady = false;
      onDiscordConnectionChange(false);
    });

    discordClient.on('error', (error) => {
      discordClient = null;
      accessToken = null;
      discordClientReady = false;

      log.error('Error while trying to login into discord rpc');
      log.error(JSON.stringify(error));

      onDiscordConnectionChange(false);
      reject(error);
    });

    discordClient
      .login({
        clientId,
        clientSecret,
        accessToken,
        scopes,
        redirectUri,
        prompt,
      })
      .catch((error) => {
        discordClient = null;
        accessToken = null;
        discordClientReady = false;

        log.error('Error while trying to login into discord rpc');
        log.error(JSON.stringify(error));

        onDiscordConnectionChange(false);
        reject(error);
      });
  });
const setDiscordActivity = () => {
  if (settings.discord.activity) {
    discordClient.setActivity(settings.discord.activity);
  }
};

/**
 * Init Discord Client
 */
const initDiscordIPC = async () => {
  await connectToDiscordIPC();
  setDiscordActivity();
};

const isDiscordClientReady = () => discordClientReady;

const discordActions = {
  checkClient: async () => {
    if (discordClient === null || discordClientReady === false) {
      await connectToDiscordIPC();
    }
  },
  muteMicrophone: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ mute: true });
    }
  },
  unmuteMicrophone: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ mute: false });
    }
  },
  toggleMicrophone: async () => {
    discordActions.checkClient();
    if (discordClientReady) {
      const voiceState = await discordClient.getVoiceSettings();
      if (voiceState.mute) {
        discordActions.unmuteMicrophone();
      } else {
        discordActions.muteMicrophone();
      }
    }
  },
  deafHeadphones: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ deaf: true });
    }
  },
  undeafHeadphones: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setVoiceSettings({ deaf: false });
    }
  },
  toggleHeadphones: async () => {
    discordActions.checkClient();
    if (discordClientReady) {
      const voiceState = await discordClient.getVoiceSettings();
      if (voiceState.deaf) {
        discordActions.undeafHeadphones();
      } else {
        discordActions.deafHeadphones();
      }
    }
  },
  leaveVoiceChannel: async () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.selectVoiceChannel(null);
    }
  },
  setActivity: (newActivity) => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.setActivity(newActivity);
    }
  },
  clearActivity: () => {
    discordActions.checkClient();
    if (discordClientReady) {
      discordClient.clearActivity();
    }
  },
};

module.exports = {
  initDiscordIPC,
  discordActions,
  isDiscordClientReady,
  onDiscordConnectionChange,
};
