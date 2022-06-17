import { reactive } from 'vue';

const { api } = window;

export const accountStore = reactive({
  twitch: '',
  saveTwitchOAuth: async (OAuth) => {
    api.saveTwitchOAuth(OAuth);
    accountStore.twitch = OAuth;
  },
  getTwitchOAuth: () => {
    const token = api.getTwitchOAuth();
    accountStore.twitch = token || '';
  },
});

export default accountStore;
