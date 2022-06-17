<template>
<div class="drawer">
  <q-header class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title>
        <h1><span>🍅</span> TomatoDeck</h1>
      </q-toolbar-title>

      <!-- Multiple Profiles / Decks -->
      <!-- <q-btn-dropdown :flat="true" label="Profil Auswahl">
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Profil 1</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Profil 2</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Profil 3</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown> -->
      <!-- <q-btn dense flat round icon="qr_code" @click="emit('clickQR')" />
      <q-btn dense flat round icon="recent_actors" @click="emit('clickAccounts')" /> -->
    </q-toolbar>
  </q-header>
</div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['clickQR', 'clickAccounts']);
</script>

<style scoped>
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
