<script setup>
import { ref, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import draggable from 'vuedraggable';

import { useStore } from './store';

import DiscordLogo from './assets/discord.svg';

import TdHeader from './components/TdHeader.vue';
import TdButton from './components/TdButton.vue';
import TdSlider from './components/TdSlider.vue';
import TdTwitchChat from './components/TdTwitchChat.vue';
import TdModifyModal from './components/TdModifyModal.vue';
import TdSettingsModal from './components/TdSettingsModal.vue';
import TdKnowledgeModal from './components/TdKnowledgeModal.vue';
import TdDiscordRichPresenceModal from './components/TdDiscordRichPresenceModal.vue';

const q = useQuasar();
q.dark.set(true);
const { t } = useI18n();
const store = useStore();

const modifyModal = ref(null);

const settingsModal = ref(null);
const knowledgeModal = ref(null);
const discordModal = ref(null);
const drag = ref(false);

onMounted(async () => {
  store.getLayout();
  store.getHostData();
  store.getConnectedDevicesCount();
  store.getDiscordConnectionState();
});

watch(drag, (to) => {
  if (to === false) {
    store.sendLayout();
  }
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <TdHeader />

    <q-page-container>
      <div
        class="q-pa-md fit row wrap justify-center items-center content-start"
        v-if="
          store.layout !== {} &&
          store.layout.layouts !== undefined &&
          store.layout.layouts[store.currentlyVisibleLayout.index || 0].rows[0]
            .elements.length === 0
        "
      >
        <h5>
          {{ t('empty_layout') }}
        </h5>
      </div>

      <div
        class="q-pa-md"
        v-if="store.layout !== {} && store.layout.layouts !== undefined"
      >
        <draggable
          v-for="(row, i) of store.layout.layouts[
            store.currentlyVisibleLayout.index || 0
          ].rows"
          :key="i"
          v-model="
            store.layout.layouts[store.currentlyVisibleLayout.index || 0]
              .rows[0].elements
          "
          class="grid"
          group="people"
          @start="drag = true"
          @end="drag = false"
          item-key="id"
        >
          <template #item="{ element }">
            <TdButton
              v-if="element.type === 'Button' || element.type === 'Text'"
              :text="element.text"
              :color="element.color"
              :image-url="element.image"
              :action-type="element.eventName"
              :value="element.data"
              :key="element.id"
              @click="modifyModal.openModal(element)"
            />
            <TdTwitchChat
              v-else-if="element.type === 'Twitch Chat'"
              :channelName="element.text"
              @click="modifyModal.openModal(element)"
            />
            <TdSlider
              v-else-if="element.type === 'Slider'"
              @click="modifyModal.openModal(element)"
            />
          </template>
        </draggable>
      </div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" @click="modifyModal.openModal()" color="accent" />
      </q-page-sticky>

      <!-- Modify Modal -->
      <TdModifyModal ref="modifyModal" />

      <!-- Settings Modal -->
      <TdSettingsModal ref="settingsModal" />

      <!-- Knowledge Modal -->
      <TdKnowledgeModal ref="knowledgeModal" />

      <!-- Discord RP Modal -->
      <TdDiscordRichPresenceModal ref="discordModal" />
    </q-page-container>

    <q-footer elevated class="bg-grey-10 text-white">
      <q-toolbar class="myToolbar">
        <div class="footerWrapper">
          <div class="item">
            <q-icon name="public" style="font-size: medium" />
            <b>IP:</b> {{ store.hostData.ip || '0.0.0.0' }}
          </div>
          <div class="item">
            <q-icon name="tag" style="font-size: medium" />
            <b>Port:</b> {{ store.hostData.socketPort || '8100' }}
          </div>
          <div class="item">
            <q-icon name="change_circle" style="font-size: medium" />
            <b>Version:</b> 0.2.1
          </div>
          <div class="item">
            <q-icon name="tablet_mac" style="font-size: medium" />
            {{ store.connectedDevices }} {{ t('connected') }}
          </div>
        </div>
        <div class="footerWrapper">
          <q-btn flat round dense @click="discordModal.openModal()">
            <q-avatar size="24px">
              <img :src="DiscordLogo" />
              <q-badge
                floating
                rounded
                :color="store.discordClientConnected ? 'teal' : 'red'"
              ></q-badge>
            </q-avatar>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="menu_book"
            @click="knowledgeModal.openModal()"
          ></q-btn>
          <q-btn
            flat
            round
            dense
            icon="settings"
            @click="settingsModal.openModal()"
          ></q-btn>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  grid-gap: 1rem;
  justify-content: space-evenly;
  align-content: center;
}

.fullWidth {
  width: 100%;
  margin-bottom: 0.5rem;
}

.myToolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.footerWrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  font-size: small;
}

.item {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.twitchInput {
  display: flex;
  flex-direction: row;
}

@media screen and (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media screen and (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media screen and (max-width: 800px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 450px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
