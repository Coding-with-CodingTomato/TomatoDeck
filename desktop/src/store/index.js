import { reactive } from 'vue';

const { api } = window;

export const store = reactive({
  layout: {},
  hostData: {},
  getLayout: () => {
    store.layout = api.getLayout();
  },
  getHostData: () => {
    store.hostData = api.getHostData();
  },
  updateLayout: (newLayout) => {
    api.saveLayout(newLayout);
    store.getLayout();
  },
});

export default store;
