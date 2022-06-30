<template>
  <div class="home">
    <div class="tdGrid">
      <template v-for="element of firstRow" :key="element">
        <TdButton
          v-if="element.type === 'Button'"
          :text="element.text"
          :color="element.color"
          :eventName="element.eventName"
          :data="element.data"
          :image-url="element.image"
          @click="sendEvent(element.eventName, element.data)"
        />
        <TdButton
          v-if="element.type === 'Text'"
          :text="element.text"
          :color="element.color"
          :eventName="element.eventName"
          :data="element.data"
        />
        <TdTwitchChat
          v-if="element.type === 'Twitch Chat'"
          :channelName="element.text"
        />
      </template>
    </div>

    <p v-if="store.errorMessage">{{ store.errorMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import store from "../store";

import TdTwitchChat from "@/components/TdTwitchChat.vue";
import TdButton from "@/components/TdButton.vue";

const firstRow = ref(store.deckLayout.layouts[0].rows[0].elements);
console.log(firstRow);

const sendEvent = (eventName: string, data: string) => {
  if(store.clickFeedback) {
    Haptics.impact({ style: ImpactStyle.Medium });
  }

  try {
    store.currentSocket.emit(eventName, data);
  } catch (e) {
    console.log(e);
  }
};

watch(() => store.deckLayout.layouts[0].rows[0].elements, () => {
  firstRow.value = store.deckLayout.layouts[0].rows[0].elements
});
</script>

<style scoped>
.tdGrid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  grid-gap: 1rem;
  justify-content: space-evenly;
  align-content: center;
}

@media screen and (max-width: 1000px) {
  .tdGrid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media screen and (max-width: 900px) {
  .tdGrid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media screen and (max-width: 700px) {
  .tdGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 550px) {
  .tdGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 450px) {
  .tdGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
