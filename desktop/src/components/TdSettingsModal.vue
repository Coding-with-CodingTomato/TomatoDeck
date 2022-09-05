<template>
  <q-dialog v-model="isSettingsModalOpen">
    <q-card style="width: 80vw; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">{{ t('settings.settings') }}</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-list padding>
          <q-item-label header>{{ t('settings.general') }}</q-item-label>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ t('settings.app_language') }}</q-item-label>
              <q-item-label caption>
                {{ t('settings.app_language_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-select
                filled
                v-model="locale"
                :options="['en', 'de']"
                :label="t('settings.available_languages')"
                style="width: 20vw"
              />
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header>{{ t('settings.server') }}</q-item-label>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ t('settings.port') }}</q-item-label>
              <q-item-label caption>
                {{ t('settings.port_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-input
                filled
                v-model="socketPort"
                :label="t('settings.port')"
                @change="updateSetting('socketPort', Number($event))"
                style="width: 20vw"
              />
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ t('settings.password') }}</q-item-label>
              <q-item-label caption>
                {{ t('settings.password_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-input
                filled
                v-model="password"
                type="password"
                :label="t('settings.password')"
                @change="store.setNewPassword($event)"
                style="width: 20vw"
              />
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header>{{ t('discord.settings.title') }}</q-item-label>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{
                t('discord.settings.connection')
              }}</q-item-label>
              <q-item-label caption>
                {{ t('discord.settings.connection_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-toggle v-model="DiscordEnabled" />
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header>{{ t('obs_settings.title') }}</q-item-label>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ t('obs_settings.connection') }}</q-item-label>
              <q-item-label caption>
                {{ t('obs_settings.connection_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-toggle v-model="ObsSocketEnabled" />
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ t('settings.port') }}</q-item-label>
              <q-item-label caption>
                {{ t('settings.port_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-input
                filled
                v-model="ObsSocketPort"
                :disable="!ObsSocketEnabled"
                :label="t('settings.port')"
                @change="updateSetting('obs.socket.port', $event)"
                style="width: 20vw"
              />
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{
                `OBS Websocket ${t('settings.password')}`
              }}</q-item-label>
              <q-item-label caption>
                {{ t('settings.password_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-input
                filled
                :type="ObsSocketPasswordVisible ? 'text' : 'password'"
                :disable="!ObsSocketEnabled"
                v-model="ObsSocketPassword"
                :label="`OBS Websocket ${t('settings.password')}`"
                @change="updateSetting('obs.socket.password', $event)"
                style="width: 20vw"
              >
                <template v-slot:append>
                  <q-icon
                    :name="
                      ObsSocketPasswordVisible ? 'visibility' : 'visibility_off'
                    "
                    class="cursor-pointer"
                    @click="
                      ObsSocketPasswordVisible = !ObsSocketPasswordVisible
                    "
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header>{{ t('twitch_settings.title') }}</q-item-label>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ t('twitch_settings.connection') }}</q-item-label>
              <q-item-label caption>
                {{ t('twitch_settings.connection_desc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-toggle v-model="TwitchEnabled" />
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{
                t('twitch_settings.channelName')
              }}</q-item-label>
              <q-item-label caption>
                {{ t('twitch_settings.channelNameDesc') }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-input
                filled
                v-model="TwitchUserName"
                :disable="!TwitchEnabled"
                :label="t('twitch_settings.channelName')"
                @change="updateSetting('twitch.username', $event)"
                style="width: 20vw"
              />
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>{{ t('twitch_settings.oauthToken') }}</q-item-label>
              <q-item-label caption>
                {{ t('twitch_settings.oauthTokenDesc') }} (<a
                  href="https://twitchapps.com/tmi/"
                  target="_blank"
                  >{{ t('twitch_settings.generateHere') }}</a
                >)
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-input
                filled
                v-model="TwitchOauthToken"
                :disable="!TwitchEnabled"
                :type="TwitchOauthTokenVisible ? 'text' : 'password'"
                :label="t('twitch_settings.oauthToken')"
                @change="updateSetting('twitch.oauth', $event)"
                style="width: 20vw"
              >
                <template v-slot:append>
                  <q-icon
                    :name="
                      TwitchOauthTokenVisible ? 'visibility' : 'visibility_off'
                    "
                    class="cursor-pointer"
                    @click="TwitchOauthTokenVisible = !TwitchOauthTokenVisible"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';

const store = useStore();
const { t, locale } = useI18n();

const settings = store.getSettings();
const isSettingsModalOpen = ref(false);

// Websocket Server Settings
const socketPort = ref(settings.socketPort);
const password = ref(settings.password || '');

// Discord Enabled
const DiscordEnabled = ref(settings.discord.enabled === 'true');

// OBS Websocket Settings
const ObsSocketEnabled = ref(settings.obs.socket.enabled === 'true');
const ObsSocketPort = ref(settings.obs.socket.port || '');
const ObsSocketPassword = ref(settings.obs.socket.password || '');
const ObsSocketPasswordVisible = ref(false);

// Twitch Settings
const TwitchEnabled = ref(settings.twitch.enabled === 'true');
const TwitchUserName = ref(settings.twitch.username || '');
const TwitchOauthToken = ref(settings.twitch.oauth || '');
const TwitchOauthTokenVisible = ref(false);

const openModal = () => {
  isSettingsModalOpen.value = true;
};

defineExpose({
  openModal,
});

const updateSetting = (name, data) => {
  store.setSetting(name, data);
};

watch(locale, (to) => {
  store.setSetting('appLanguage', to);
});

watch(DiscordEnabled, (to) => {
  store.setSetting('discord.enabled', to);
});
watch(TwitchEnabled, (to) => {
  store.setSetting('twitch.enabled', to);
});
watch(ObsSocketEnabled, (to) => {
  store.setSetting('obs.socket.enabled', to);
});
</script>
