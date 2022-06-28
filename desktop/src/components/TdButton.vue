<template>
  <div
    class="button"
    :style="{backgroundColor: props.color}"
    >
    <span v-if="props.imageUrl === ''">{{ props.text }}</span>
    <img v-if="props.imageUrl !== ''" :src="image" />
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';

const { api } = window;
const image = ref(null);

const props = defineProps({
  color: String,
  text: String,
  imageUrl: String,
});

onMounted(async () => {
  if (props.imageUrl) {
    const response = await api.getImageFromPath(props.imageUrl);
    console.log(response);
    image.value = URL.createObjectURL(new Blob([response.buffer], { type: 'image/png' } /* (1) */));
  }
});
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
</style>
