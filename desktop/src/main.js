import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { Quasar } from 'quasar';
import quasarLang from 'quasar/lang/de';
import App from './App.vue';
import { messages } from './i18n';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

const { api } = window;
const settings = api.getSettings();

const i18n = createI18n({
  locale: settings.appLanguage || 'en',
  fallbackLocale: 'de',
  messages,
});

const myApp = createApp(App);
myApp.use(i18n);

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  lang: quasarLang,
});

myApp.mount('#app');
