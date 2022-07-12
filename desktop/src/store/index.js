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
        return state.layout.layouts.map((l) => (l.name));
      }

      return [];
    },
  },
});

export default useStore;
