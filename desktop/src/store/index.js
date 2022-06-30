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
  sendLayout: () => {
    api.saveLayout(JSON.stringify(store.layout));
  },
  setNewPassword: (newPassword) => {
    api.setPassword(newPassword);
  },
});

export default store;
