<template>
<div class="home">
  <ion-button @click="sendEvent('mediaMute')">Un-/mute</ion-button>
  <ion-button @click="sendEvent('mediaVolUp')">Volume up</ion-button>
  <ion-button @click="sendEvent('mediaVolDown')">Volume down</ion-button>
  <ion-button @click="sendEvent('mediaPlay')">Play/Pause</ion-button>
  <ion-button @click="sendEvent('mediaStop')">Stop</ion-button>
  <ion-button @click="sendEvent('mediaNextTrack')">Next</ion-button>
  <ion-button @click="sendEvent('mediaPrevTrack')">Previous</ion-button>
</div>
</template>

<script lang="ts" setup>
import { IonButton } from "@ionic/vue";
import { io } from "socket.io-client";

const socket = io('localhost:6942');

socket.on('hello', (args) => {
  console.log(args);
});

const sendEvent = (eventName: string) => {
  socket.emit(eventName);
};
</script>