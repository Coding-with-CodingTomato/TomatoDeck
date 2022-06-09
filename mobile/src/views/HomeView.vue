<template>
  <div class="home">
    <ion-grid>
      <ion-row style="justify-content: center;" v-for="row of store.deckLayout.layouts[0].rows" :key="row">
        <ion-col size="auto" v-for="element of row.elements" :key="element">
          <!-- <ion-button
            v-if="element.type === 'button'"
            :style="`--background: ${element.color}; width:12vw; height: 12vw;`"
            @click="sendEvent(element.eventName)"
            >{{ element.text }}</ion-button
          > -->
          <div
            v-if="element.type === 'Button'"
            class="button ion-activatable ripple-parent"
            :style="`background-color: ${element.color}`"
            @click="sendEvent(element.eventName, element.data)"
          >
            <div class="content" :class="{ bigIcon: emojiRegex.test(element.text), }">{{ element.text.toUpperCase() }}</div>
            <ion-ripple-effect></ion-ripple-effect>
          </div>

          <TdTwitchChat
            v-if="element.type === 'Twitch Chat'"
            :channelName="element.text"
          />

        </ion-col>
      </ion-row>
    </ion-grid>

    <p v-if="store.errorMessage">{{ store.errorMessage }}</p>

    <!-- <ion-button @click="sendEvent('mediaMute')">Un-/mute</ion-button> -->
    <!--<ion-button @click="sendEvent('mediaVolUp')">Volume up</ion-button>
    <ion-button @click="sendEvent('mediaVolDown')">Volume down</ion-button>
    <ion-button @click="sendEvent('mediaPlay')">Play/Pause</ion-button>
    <ion-button @click="sendEvent('mediaStop')">Stop</ion-button>
    <ion-button @click="sendEvent('mediaNextTrack')">Next</ion-button>
    <ion-button @click="sendEvent('mediaPrevTrack')">Previous</ion-button> -->
  </div>
</template>

<script lang="ts" setup>
import { IonGrid, IonRow, IonCol, IonRippleEffect } from "@ionic/vue";
import store from "../store";

import TdTwitchChat from "@/components/TdTwitchChat.vue";

const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,2}/

const sendEvent = (eventName: string, data: string) => {
  try {
    store.currentSocket.emit(eventName, data);
  } catch (e) {
    console.log(e);
  }
};
</script>

<style scoped>
.button {
  cursor: pointer;
  width: 12vw;
  height: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}

.button .content {
  max-width: 95%;
  word-wrap: break-word;
  font-weight: bold;
}

.bigIcon {
  font-size: 5rem;
}
</style>
