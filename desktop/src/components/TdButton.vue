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
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 15pt;
  font-weight: bold;
  padding: 0.5rem;
  text-align: center;
}

.button::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
</style>
