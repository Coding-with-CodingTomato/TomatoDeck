import { defineStore } from 'pinia';

const { api } = window;

export const useStore = defineStore('main', {
  state: () => ({
    layout: {},
    currentlyVisibleLayout: { index: 0 },
    hostData: {},
    connectedDevices: 0,
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
    updateLayout(newLayout) {
      api.saveLayout(newLayout);
      this.getLayout();
    },
    sendLayout() {
      api.saveLayout(JSON.stringify(this.layout));
    },
    setNewPassword(newPassword) {
      api.setPassword(newPassword);
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
  },
});

export default useStore;
