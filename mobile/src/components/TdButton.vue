<template>
  <div
  class="button"
  :style="{backgroundColor: props.color}"
  >
    <span
      v-if="props.imageUrl === ''"
      :class="{ bigIcon: emojiRegex.test(props.text), }"
    >{{ props.text }}</span>
    <img v-if="props.imageUrl !== ''" :src="image" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from "vue";
import store from "../store";

const image = ref();

const props = defineProps({
  color: {type: String, required: true, default: '#000000'},
  eventName: {type: String, required: true, default: ''},
  data: {type: String, required: true, default: 'Blank'},
  text: {type: String, required: true, default: 'Blank'},
  imageUrl: {type: String, required: false, default: ''},
});

const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,2}/

onMounted(() => {
  if(props.imageUrl !== '') {
    if(store.imageMap.has(props.imageUrl)) {
      const imageData = store.imageMap.get(props.imageUrl);
      image.value = URL.createObjectURL(new Blob([imageData.buffer], { type: 'image/png' } /* (1) */));
    } else {
      store.requestImageData(props.imageUrl);
    }
  }
});

watch(store.imageMap, () => {
  if(store.imageMap.has(props.imageUrl)) {
    const imageArrayBuffer = store.imageMap.get(props.imageUrl);
    const imageUInt8Buffer = new Uint8Array(imageArrayBuffer);
    image.value = URL.createObjectURL(new Blob([imageUInt8Buffer.buffer], { type: 'image/png' } /* (1) */));
  }
})
</script>

<style scoped>
.button {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 15pt;
  font-weight: bold;
  padding: 0.75rem;
  text-align: center;
}

.button::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.button img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
}

.bigIcon {
  font-size: 5rem;
}

@media screen and (max-width: 950px) {
  .bigIcon {
    font-size: 3rem;
  }
}

@media screen and (max-width: 500px) {
  .bigIcon {
    font-size: 2rem;
  }
}
</style>