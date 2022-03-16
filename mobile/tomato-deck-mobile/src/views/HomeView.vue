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

const socket = io('ws://192.168.198.21:6942');

socket.on('hello', (args) => {
  console.log(args);
});

socket.on('connection', () => {
  console.log("Connected!");
});

socket.io.on("error", (error) => {
  console.log(error);
});

const sendEvent = (eventName: string) => {
  try {
    socket.emit(eventName);
  } catch (e) {
    console.log(e);
  }
};
</script>