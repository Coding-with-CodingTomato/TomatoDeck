const fs = require('fs');
const log = require('electron-log');
const player = require('play-sound')({});
const axios = require('axios').default;
const { execSync, execFile } = require('child_process');
const { shell } = require('electron');
const { keyboard, Key, mouse, Point } = require('@nut-tree/nut-js');
const { discordActions } = require('./discordIpcClient');
const { sendTwitchMessage } = require('./twitchChatClient');
const { emitObsCommand } = require('./obsWebsocketClient');
const { initStorage } = require('./storage');

const settings = initStorage();

const emitSucess = (socket) => {
  socket.emit('sucessEvent');
};
const emitError = (socket) => {
  socket.emit('errorEvent');
};

const socketActions = [
  {
    event: 'requestImage',
    execute: async (data, socket) => {
      const imagePath = data;
      fs.readFile(imagePath, (err, imageData) => {
        socket.emit('imageData', { imagePath, imageData });
      });
    },
  },
  {
    event: 'twitch_chat_message',
    execute: async (data, socket) => {
      const json = JSON.parse(data);
      if (settings.twitch.enabled) {
        json.channelNames.split(',').forEach(async (c) => {
          try {
            await sendTwitchMessage(c, json.message);
            emitSucess(socket);
          } catch (error) {
            console.error(error);
            emitError(socket);
          }
        });
      } else {
        emitError(socket);
      }
    },
  },
  {
    event: 'discord',
    execute: async (data, socket) => {
      try {
        switch (data) {
          case 'mute_microphone':
            discordActions.muteMicrophone();
            break;
          case 'unmute_microphone':
            discordActions.unmuteMicrophone();
            break;
          case 'toggle_microphone':
            discordActions.toggleMicrophone();
            break;
          case 'deaf_headphones':
            discordActions.deafHeadphones();
            break;
          case 'undeaf_headphones':
            discordActions.undeafHeadphones();
            break;
          case 'toggle_headphones':
            discordActions.toggleHeadphones();
            break;
          case 'leave_voice_channel':
            discordActions.leaveVoiceChannel();
            break;
          default:
            break;
        }
        emitSucess(socket);
      } catch (error) {
        emitError(socket);
      }
    },
  },
  {
    event: 'keys',
    execute: async (data, socket) => {
      const keys = data.split(' ');
      if (keys.length) keys.forEach((k) => keyboard.type(k));
      emitSucess(socket);
    },
  },
  {
    event: 'hotkey',
    execute: async (data, socket) => {
      const modifiers = data.split(' ');
      const key = modifiers.pop();

      const keyArray = modifiers.map((mod) => Key[mod]);
      keyArray.push(Key[key]);

      await keyboard.type(...keyArray);
      emitSucess(socket);
    },
  },
  {
    event: 'open_website',
    execute: async (data, socket) => {
      await shell.openExternal(data);
      emitSucess(socket);
    },
  },
  {
    event: 'run_exe',
    execute: async (data, socket) => {
      let eventError = false;

      try {
        execFile(data);
      } catch (error) {
        log.error(`Error while trying to execute file with data: ${data}`);
        log.error(JSON.stringify(error));

        eventError = true;
        emitError(socket);
      } finally {
        if (!eventError) {
          emitSucess(socket);
        }
      }
    },
  },
  {
    event: 'open_folder',
    execute: async (data, socket) => {
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
      } catch (error) {
        log.error(`Error while trying to open folder with data: ${data}`);
        log.error(JSON.stringify(error));

        eventError = true;
        emitError(socket);
      } finally {
        if (!eventError) {
          emitSucess(socket);
        }
      }
    },
  },
  {
    event: 'click_mouse',
    execute: async (data, socket) => {
      const [x, y] = data.split(',');
      const point = new Point(Number(x), Number(y));
      await mouse.setPosition(point);
      await mouse.leftClick();
      emitSucess(socket);
    },
  },
  {
    event: 'play_sound',
    execute: async (data, socket) => {
      let errorEvent = false;

      try {
        player.play(data, (err) => {
          if (err) throw err;
        });
      } catch (error) {
        log.error(`Error while trying to play audio with data: ${data}`);
        log.error(JSON.stringify(error));

        errorEvent = true;
        emitError(socket);
      } finally {
        if (!errorEvent) {
          emitSucess(socket);
        }
      }
    },
  },
  {
    event: 'http_get_request',
    execute: async (data, socket) => {
      if (data) {
        let errorEvent = false;

        try {
          await axios.get(data);
        } catch (error) {
          errorEvent = true;
          emitError(socket);
        } finally {
          if (!errorEvent) {
            emitSucess(socket);
          }
        }
      }
    },
  },
  {
    event: 'obs_command',
    execute: async (data, socket) => {
      const dataJSON = JSON.parse(data);
      if (data && settings.obs.socket.enabled) {
        try {
          await emitObsCommand(dataJSON.command, dataJSON.data);
          emitSucess(socket);
        } catch (error) {
          emitError(socket);
        }
      } else {
        emitError(socket);
      }
    },
  },
  {
    event: 'wled',
    execute: async (data, socket) => {
      if (data) {
        let errorEvent = false;
        const wledUrl = `http://${data.ip}/win&R=${data.red}&B=${data.blue}&G=${data.green}&W=${data.white}&FX=${data.effectId}&SX=${data.effectSpeed}&IX=${data.effectIntensity}`;

        try {
          await axios.get(wledUrl);
        } catch (error) {
          errorEvent = true;
          emitError(socket);
        } finally {
          if (!errorEvent) {
            emitSucess(socket);
          }
        }
      }
    },
  },
];

module.exports = socketActions;
