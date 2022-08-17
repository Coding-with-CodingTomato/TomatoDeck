<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <!-- Add Modal -->
  <q-dialog v-model="isModalOpen">
    <q-card style="width: 80vw; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">{{ t('twitch_settings.title') }}</div>
      </q-card-section>
      <q-card-section class="q-gutter-sm">
        <q-list padding>
          <q-item-label header>{{
            t('twitch_settings.chatCreds')
          }}</q-item-label>

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
                v-model="channelName"
                :label="t('twitch_settings.channelName')"
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
                v-model="oauthToken"
                :type="oauthVisible ? 'text' : 'password'"
                :label="t('twitch_settings.oauthToken')"
                style="width: 20vw"
              >
                <template v-slot:append>
                  <q-icon
                    :name="oauthVisible ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="oauthVisible = !oauthVisible"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="text-teal">
        <q-btn flat :label="t('cancel')" v-close-popup />
        <q-btn
          flat
          :label="t('save')"
          @click="saveTwitchSettings"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';

const { t } = useI18n();
const store = useStore();
const isModalOpen = ref(false);
const oauthVisible = ref(false);
const TWITCH_OAUTH_SETTINGS_KEY = 'twitchOauth';

const channelName = ref('');
const oauthToken = ref('');

const saveTwitchSettings = () => {
  store.setSetting(TWITCH_OAUTH_SETTINGS_KEY, {
    channelName: channelName.value,
    oauthToken: oauthToken.value,
  });
};

const openModal = () => {
  isModalOpen.value = true;
};

defineExpose({
  openModal,
});

onMounted(async () => {
  const twitchDataRaw = await store.getSetting(TWITCH_OAUTH_SETTINGS_KEY);
  console.log(twitchDataRaw);
  if (twitchDataRaw) {
    const twitchJson = JSON.parse(twitchDataRaw);
    if (twitchJson) {
      channelName.value = twitchJson.channelName;
      oauthToken.value = twitchJson.oauthToken;
    }
  }
});
</script>

<style scoped></style>
