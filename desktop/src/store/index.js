import { reactive } from 'vue';

const { api } = window;

export const store = reactive({
  layout: {},
  hostData: {},
  connectedDevices: 0,
  getLayout: () => {
    store.layout = api.getLayout();
  },
  getHostData: () => {
    store.hostData = api.getHostData();
  },
  getConnectedDevicesCount: () => {
    api.onDeviceCountChange((_event, value) => {
      store.connectedDevices = value;
    });
  },
  updateLayout: (newLayout) => {
    api.saveLayout(newLayout);
    store.getLayout();
  },
});

export default store;
