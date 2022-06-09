<template>
  <div
    class="button"
    :style="{backgroundColor: props.color}"
    >
    {{ props.text }}
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  color: String,
  text: String,
});
</script>

<style scoped>
.button {
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
}
</style>
