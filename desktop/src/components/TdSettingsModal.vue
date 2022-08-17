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
                style="width: 20vw"
                mask="####"
                fill-mask="#"
                :hint="`${t('settings.mask')}: ####`"
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
                style="width: 20vw"
              />
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

const { api } = window;
const { t, locale } = useI18n();
const settings = api.getSettings();

const isSettingsModalOpen = ref(false);

const socketPort = ref(settings.port);
const password = ref('');

const openModal = () => {
  isSettingsModalOpen.value = true;
};

defineExpose({
  openModal,
});

watch(locale, (to) => {
  api.setLanguage(to);
});

watch(socketPort, (to) => {
  api.setSetting('socketPort', Number(to));
});

watch(password, (to) => {
  api.setPassword(to);
});
</script>
