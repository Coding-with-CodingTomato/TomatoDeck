<template>
<div class="drawer">
  <q-header class="bg-primary text-white">
    <q-toolbar class="toolbar">
      <q-toolbar-title>
        <h1><span>🍅</span> TomatoDeck</h1>
      </q-toolbar-title>

      <!-- Multiple Profiles / Decks -->
      <q-select
        borderless
        v-model="currentLayout"
        :options="store.availableLayouts"
        :dense="true"
        label="Layout"
      />

      <!-- <q-btn dense flat round icon="qr_code" @click="emit('clickQR')" />
      <q-btn dense flat round icon="recent_actors" @click="emit('clickAccounts')" /> -->
    </q-toolbar>
  </q-header>
</div>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue';
import { useStore } from '../store';

const emit = defineEmits(['clickQR', 'clickAccounts']);
const store = useStore();
const currentLayout = ref('');

watch(() => store.layout, (to) => {
  if (to) {
    currentLayout.value = store.availableLayouts[store.currentlyVisibleLayout.index];
  }
});

watch(currentLayout, (to) => {
  if (to) {
    store.currentlyVisibleLayout = to;
  }
});
</script>

<style scoped>

.toolbar {
  display: flex;
}

h1 {
  font-size: 1.5rem;
  line-height: 1.5rem;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
}
span {
  font-size: 2rem;
}
</style>
