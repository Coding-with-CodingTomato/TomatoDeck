<template>
  <div
    class="button"
    :class="{ bigger: bigger, counter: eventName === 'counter' }"
    :style="{ backgroundColor: props.color }"
    @touchstart="bigger = true"
    @touchcancel="bigger = false"
    @touchend="bigger = false"
    @mousedown="bigger = true"
    @mouseup="bigger = false"
    @mouseleave="bigger = false"
  >
    <span
      v-if="props.imageUrl === ''"
      :class="{ bigIcon: emojiRegex.test(props.text) }"
      >{{ props.text }}</span
    >
    <img v-if="props.imageUrl !== ''" :src="image" />
    <span class="value" v-if="props.eventName === 'counter'">
      {{ props.data || 0 }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from '../store';

const store = useStore();
const image = ref();
const bigger = ref(false);

const props = defineProps({
  color: { type: String, required: true, default: '#000000' },
  eventName: { type: String, required: true, default: '' },
  data: { type: String, required: true, default: 'Blank' },
  text: { type: String, required: true, default: 'Blank' },
  imageUrl: { type: String, required: false, default: '' },
});

const emojiRegex =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,2}/;

onMounted(() => {
  if (props.imageUrl !== '') {
    if (store.imageMap.has(props.imageUrl)) {
      const imageData = store.imageMap.get(props.imageUrl);
      image.value = URL.createObjectURL(
        new Blob([imageData.buffer], { type: 'image/png' } /* (1) */)
      );
    } else {
      store.requestImageData(props.imageUrl);
    }
  }
});

onUnmounted(() => {
  if (props.imageUrl !== '') {
    store.imageMap.delete(props.imageUrl);
  }
});

watch(store.imageMap, () => {
  if (store.imageMap.has(props.imageUrl)) {
    const imageArrayBuffer = store.imageMap.get(props.imageUrl);
    const imageUInt8Buffer = new Uint8Array(imageArrayBuffer);
    image.value = URL.createObjectURL(
      new Blob([imageUInt8Buffer.buffer], { type: 'image/png' } /* (1) */)
    );
  }
});
</script>

<style scoped>
.button {
  cursor: pointer;
  width: 13vw;
  height: 13vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 15pt;
  font-weight: bold;
  padding: 0.75rem;
  text-align: center;
  overflow: hidden;
}

.bigger {
  transform: scale(110%);
}

/* .button::after {
  content: '';
  display: block;
  padding-bottom: 100%;
} */

.button img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
}

.bigIcon {
  font-size: 5rem;
}

.button.counter {
  flex-direction: column;
}
.button.counter .value {
  font-size: 40pt;
}

@media screen and (max-width: 1200px) {
  .button {
    width: 15vw;
    height: 15vw;
  }
}

@media screen and (max-width: 900px) {
  .button {
    width: 18vw;
    height: 18vw;
  }
  .bigIcon {
    font-size: 3rem;
  }
}

@media screen and (max-width: 800px) {
  .button {
    width: 22vw;
    height: 22vw;
  }
}

@media screen and (max-width: 600px) {
  .button {
    width: 28vw;
    height: 28vw;
  }
}

@media screen and (max-width: 450px) {
  .button {
    width: 42vw;
    height: 42vw;
  }
  .bigIcon {
    font-size: 2rem;
  }
}
</style>
