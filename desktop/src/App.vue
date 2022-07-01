<script setup>
import { ref, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import draggable from 'vuedraggable';

import { accountStore } from './store/account';
import { store } from './store';

import TwitchLogo from './assets/twitch.svg';
// import TwitterLogo from './assets/twitter.svg';

import TdHeader from './components/TdHeader.vue';
import TdButton from './components/TdButton.vue';
import TdTwitchChat from './components/TdTwitchChat.vue';
import TdAddModal from './components/TdAddModal.vue';
import TdEditModal from './components/TdEditModal.vue';

const q = useQuasar();
q.dark.set(true);

const isAccountsModalOpen = ref(false);
const isPasswordModalOpen = ref(false);

const newPasswordField = ref('');
const setNewPassword = () => {
  store.setNewPassword(newPasswordField.value);
};

const addModal = ref(null);
const editModal = ref(null);
const drag = ref(false);

onMounted(() => {
  store.getLayout();
  store.getHostData();
  store.getConnectedDevicesCount();
});

watch(drag, (to) => {
  if (to === false) {
    store.sendLayout();
  }
});
</script>

<template>
  <q-layout view="hHh lpR fFf">

    <TdHeader @click-accounts="isAccountsModalOpen = true" />

    <q-page-container>

      <div class="q-pa-md" v-if="store.layout !== {} && store.layout.layouts !== undefined">
        <draggable
          v-for="(row, i) of store.layout.layouts[0].rows"
          :key="i"
          v-model="store.layout.layouts[0].rows[0].elements"
          class="grid"
          group="people"
          @start="drag=true"
          @end="drag=false"
          item-key="id">
          <template #item="{element}">
              <TdButton
                v-if="element.type === 'Button' || element.type === 'Text'"
                :text="element.text"
                :color="element.color"
                :image-url="element.image"
                :key="element.id"
                @click="editModal.openModal(element)"
              />
              <TdTwitchChat
                v-else-if="element.type === 'Twitch Chat'"
                :channelName="element.text"
                @click="editModal.openModal(element)"
              />
          </template>
        </draggable>
      </div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" @click="addModal.openModal()" color="accent" />
      </q-page-sticky>

      <!-- Add Modal -->
      <TdAddModal ref="addModal" />

      <!-- Edit Modal -->
      <TdEditModal ref="editModal" />

      <!-- Accounts Modal -->
      <q-dialog
        v-model="isAccountsModalOpen"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Verbundene Accounts</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list>
              <q-item @click="accountStore.loginTwitch">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="TwitchLogo">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div v-if="accountStore.twitch === ''" class="twitchInput">
                    <q-input
                      filled
                      bottom-slots
                      v-model="text"
                      label="OAuth Token"
                      class="fullWidth"
                    >
                      <template v-slot:append>
                        <q-btn round dense flat icon="save" />
                      </template>
                    </q-input>
                  </div>
                  <a href="https://twitchapps.com/tokengen/" style="color: aqua" target="_blank">Get token here</a>
                  <span>Scope: <b>chat:edit</b> and Client-ID: <b>m5syllcgh47ytm8jbhbhwcjmaqcya6</b></span>
                </q-item-section>
              </q-item>
              <!-- <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="TwitterLogo">
                  </q-avatar>
                </q-item-section>

                <q-item-section>Twitter: Nicht verbunden</q-item-section>
              </q-item> -->
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Password Modal -->
      <q-dialog
        v-model="isPasswordModalOpen"
      >
        <q-card>
          <q-card-section>
            <!-- <div class="text-h6">Passwort neu setzen</div> -->
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input type="password" filled v-model="newPasswordField" label="Neues Passwort" />
          </q-card-section>
          <q-card-actions align="right" class="text-teal">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn flat label="Setzen" @click="setNewPassword" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-page-container>

    <q-footer elevated class="bg-grey-10 text-white">
      <q-toolbar class="myToolbar">
         <div class="footerWrapper">
            <div class="item">
              <q-icon name="public" style="font-size: medium;" />
              <b>IP:</b> {{ store.hostData.ip || '0.0.0.0' }} (Wahrscheinlich falsch)
            </div>
            <div class="item">
              <q-icon name="tag" style="font-size: medium;" />
              <b>Port:</b> {{ store.hostData.socketPort || '8100'}}
            </div>
            <div class="item">
              <q-icon name="change_circle" style="font-size: medium;" />
              <b>Version:</b> 0.1.7
            </div>
            <div class="item">
              <q-icon name="tablet_mac" style="font-size: medium;" />
              {{ store.connectedDevices }} verbunden
            </div>
          </div>
          <div class="footerWrapper">
            <q-btn flat round dense icon="lock" @click="isPasswordModalOpen = true"></q-btn>
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
  margin-bottom: .5rem;
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
</style>
