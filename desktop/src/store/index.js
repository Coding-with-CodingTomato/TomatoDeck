import { defineStore } from 'pinia';

const { api } = window;

export const useStore = defineStore('main', {
  state: () => ({
    layout: {},
    currentlyVisibleLayout: { index: 0 },
    hostData: {},
    connectedDevices: 0,
    discordClientConnected: false,
  }),
  actions: {
    getLayout() {
      this.layout = api.getLayout();
    },
    getHostData() {
      this.hostData = api.getHostData();
    },
    getConnectedDevicesCount() {
      api.onDeviceCountChange((_event, value) => {
        this.connectedDevices = value;
      });
    },
    getDiscordConnectionState() {
      this.discordClientConnected = api.getDiscordConnectionStatus();
      api.onDiscordConnectionChange((_event, value) => {
        this.discordClientConnected = value;
      });
    },
    updateLayout(newLayout) {
      api.saveLayout(newLayout);
      this.getLayout();
    },
    sendLayout() {
      api.saveLayout(JSON.stringify(this.layout));
    },
    sendNewDiscordActivity(activity) {
      api.sendNewDiscordActivity(JSON.stringify(activity));
    },
    clearDiscordActivity() {
      api.clearDiscordActivity();
    },
    setNewPassword(newPassword) {
      api.setPassword(newPassword);
    },
    async getSetting(setting) {
      const response = await api.getSetting(setting);
      return response;
    },
    getSettings() {
      return api.getSettings();
    },
    setSetting(setting, data) {
      if (typeof data === 'string' || typeof data === 'number') {
        api.setSetting(setting, data);
      } else {
        api.setSetting(setting, JSON.stringify(data));
      }
    },
    deleteCurrentLayout() {
      if (this.layout.layouts.length > 1) {
        const tempLayouts = this.layout.layouts.filter((l, i) => {
          if (i === this.currentlyVisibleLayout.index) {
            return false;
          }
          return true;
        });

        this.currentlyVisibleLayout = { index: 0 };

        this.layout.layouts = tempLayouts;

        this.updateLayout(JSON.stringify(this.layout));
      }
    },
  },
  getters: {
    availableLayouts: (state) => {
      if (state.layout.layouts) {
        return state.layout.layouts.map((l, i) => ({
          label: l.name,
          value: i,
          index: i,
        }));
      }

      return [];
    },
    availableLayoutsNames: (state) => {
      if (state.layout.layouts) {
        return state.layout.layouts.map((l) => l.name);
      }

      return [];
    },
  },
});

export default useStore;
