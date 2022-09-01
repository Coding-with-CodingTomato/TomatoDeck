<template>
  <div class="home" v-if="store.currentlyVisibleLayout !== null">
    <div class="tdGrid">
      <template
        v-for="element of store.currentlyVisibleLayout.rows[0].elements"
        :key="element"
      >
        <TdButton
          v-if="element.type === 'Button'"
          :text="element.text"
          :color="element.color"
          :eventName="element.eventName"
          :data="String(element.data)"
          :image-url="element.image"
          @click="sendEvent(element)"
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
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useStore } from '../store';

import TdTwitchChat from '@/components/TdTwitchChat.vue';
import TdButton from '@/components/TdButton.vue';

const store = useStore();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sendEvent = async (element: any) => {
  if (store.clickFeedback) {
    Haptics.impact({ style: ImpactStyle.Medium });
  }

  if (element.actions) {
    // NEW Buttons
    try {
      for (let action of element.actions) {
        if (action.type === 'counter') {
          store.currentSocket.emit(action.type, element);
        } else if (action.type === 'switch_layout') {
          store.switchLayout(action.data);
        } else {
          store.currentSocket.emit(action.type, action.data);
        }

        await wait(200);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    // OLD Buttons
    try {
      if (element.eventName === 'counter') {
        store.currentSocket.emit(element.eventName, element);
      } else if (element.eventName === 'switch_layout') {
        store.switchLayout(element.data);
      } else {
        store.currentSocket.emit(element.eventName, element.data);
      }
    } catch (e) {
      console.log(e);
    }
  }
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
}
.tdGrid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  grid-gap: 1rem;
  justify-content: space-evenly;
  align-content: center;
}

@media screen and (max-width: 1200px) {
  .tdGrid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media screen and (max-width: 900px) {
  .tdGrid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media screen and (max-width: 800px) {
  .tdGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 600px) {
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
