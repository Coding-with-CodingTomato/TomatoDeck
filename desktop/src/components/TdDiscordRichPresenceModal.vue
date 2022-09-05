<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <!-- Add Modal -->
  <q-dialog v-model="isModalOpen">
    <q-card style="width: 80vw; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">{{ t('discord.activity.title') }}</div>
      </q-card-section>
      <q-card-section class="q-gutter-sm">
        <q-input
          filled
          v-model="details"
          :label="t('discord.activity.details')"
        />
        <q-input filled v-model="state" :label="t('discord.activity.state')" />
        <q-input
          filled
          v-model="largeImageKey"
          :label="t('discord.activity.largeImageKey')"
        />
        <q-input
          filled
          v-model="largeImageText"
          :label="t('discord.activity.largeImageText')"
        />
        <q-input
          filled
          v-model="smallImageKey"
          :label="t('discord.activity.smallImageKey')"
        />
        <q-input
          filled
          v-model="smallImageText"
          :label="t('discord.activity.smallImageText')"
        />
        <q-input
          filled
          v-model="instance"
          :label="t('discord.activity.instance')"
        />
        <q-input
          filled
          v-model="startTimestamp"
          :label="t('discord.activity.starttime')"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="startTimestamp" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="startTimestamp"
                  mask="YYYY-MM-DD HH:mm"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right" class="text-teal">
        <q-btn flat :label="t('cancel')" v-close-popup />
        <q-btn flat :label="t('save')" @click="setDiscordRP" v-close-popup />
        <q-btn
          flat
          :label="t('clear')"
          @click="store.clearDiscordActivity"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';

const { t } = useI18n();
const store = useStore();
const isModalOpen = ref(false);

const details = ref('');
const state = ref('');
const largeImageKey = ref('');
const largeImageText = ref('');
const smallImageKey = ref('');
const smallImageText = ref('');
const startTimestamp = ref('');
const instance = ref('');

const setDiscordRP = () => {
  const setDate = new Date(startTimestamp.value);

  const newAcitivty = {
    details: details.value || 'Details not set',
    state: state.value || 'State not set',
    largeImageKey: largeImageKey.value || 'testKey1',
    largeImageText: largeImageText.value || 'test',
    smallImageKey: smallImageKey.value || 'testKey2',
    smallImageText: startTimestamp.value || 'test2',
    startTimestamp: setDate.getTime() || 0,
    instance: instance.value || true,
  };

  store.sendNewDiscordActivity(newAcitivty);
};

const openModal = () => {
  isModalOpen.value = true;
};

defineExpose({
  openModal,
});

watch(
  () => store.hostData,
  (to) => {
    if (to.discord.activity) {
      details.value = to.discord.activity.details || '';
      state.value = to.discord.activity.state || '';
      largeImageKey.value = to.discord.activity.largeImageKey || '';
      largeImageText.value = to.discord.activity.largeImageText || '';
      smallImageKey.value = to.discord.activity.smallImageKey || '';
      smallImageText.value = to.discord.activity.smallImageText || '';
      startTimestamp.value = to.discord.activity.startTimestamp || '';
      instance.value = to.discord.activity.instance || '';
    }
  },
);
</script>

<style scoped></style>
