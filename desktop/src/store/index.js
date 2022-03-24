import { reactive } from 'vue';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:6942');

export const store = reactive({
  layout: {
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
  },
  updateLayout: (newLayout) => {
    socket.emit('updateLayout', newLayout);
  },
});

socket.on('deckLayout', (data) => {
  store.layout = JSON.parse(data);
});

export default store;
