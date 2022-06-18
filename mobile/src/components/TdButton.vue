<template>
  <div
    class="button ion-activatable ripple-parent"
    :style="`background-color: ${props.color}`"
  >
    <div class="content" :class="{ bigIcon: emojiRegex.test(props.text), }">{{ props.text.toUpperCase() }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  color: {type: String, required: true, default: '#000000'},
  eventName: {type: String, required: true, default: ''},
  data: {type: String, required: true, default: 'Blank'},
  text: {type: String, required: true, default: 'Blank'},
})

const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,2}/

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
}

.button::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.button .content {
  max-width: 95%;
  word-wrap: break-word;
  font-weight: bold;
  text-align: center;
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