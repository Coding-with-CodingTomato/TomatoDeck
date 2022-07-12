<template>
  <div
    class="button"
    :class="{ counter: props.actionType === 'counter' }"
    :style="{ backgroundColor: props.color }"
  >
    <img v-if="props.imageUrl !== ''" :src="image" />
    <span class="text" v-if="props.imageUrl === ''">{{ props.text }}</span>
    <span class="value" v-if="props.actionType === 'counter'">
      {{ props.value || 999999 }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from 'vue';

const { api } = window;
const image = ref(null);

const props = defineProps({
  actionType: String,
  value: String,
  color: String,
  text: String,
  imageUrl: String,
});

onMounted(async () => {
  if (props.imageUrl) {
    const response = await api.getImageFromPath(props.imageUrl);
    image.value = URL.createObjectURL(
      new Blob([response.buffer], { type: 'image/png' } /* (1) */),
    );
  }
});

watch(
  () => props.imageUrl,
  async (to) => {
    if (to) {
      const response = await api.getImageFromPath(to);
      image.value = URL.createObjectURL(
        new Blob([response.buffer], { type: 'image/png' } /* (1) */),
      );
    }
  },
);
</script>

<style lang="scss" scoped>
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

// .button::after {
//   content: '';
//   display: block;
//   padding-bottom: 100%;
// }

.button img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
}

.button.counter {
  flex-direction: column;
  .value {
    font-size: 30pt;
  }
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
}
</style>
