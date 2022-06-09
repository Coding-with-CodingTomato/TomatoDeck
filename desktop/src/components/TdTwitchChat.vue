<template>
  <div class="twitchChatBox">
    <h1>Twitchchat</h1>
    <h3>{{ props.channelName }}</h3>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  channelName: String,
});
</script>

<style scoped>
.twitchChatBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5rem 2.5rem 5rem 2.5rem;
  border: 1px solid snow;
  cursor: pointer;
}

h1 {
  font-size: 2rem;
}

h3 {
  font-size: 1rem;
}
</style>
