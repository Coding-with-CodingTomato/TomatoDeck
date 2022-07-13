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
        <q-btn
          dense
          flat
          round
          icon="delete"
          @click="deleteDialogOpen = true"
          v-if="store.layout.layouts?.length > 1"
        />

        <!-- <q-btn dense flat round icon="qr_code" @click="emit('clickQR')" />
      <q-btn dense flat round icon="recent_actors" @click="emit('clickAccounts')" /> -->
      </q-toolbar>
    </q-header>

    <q-dialog v-model="deleteDialogOpen" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">{{ t('really_delete_layout') }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="t('cancel')" color="primary" v-close-popup />
          <q-btn
            flat
            :label="t('delete')"
            color="primary"
            @click="store.deleteCurrentLayout"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';

const emit = defineEmits(['clickQR', 'clickAccounts']);
const { t } = useI18n();
const store = useStore();
const currentLayout = ref('');
const deleteDialogOpen = ref(false);

watch(
  () => store.layout,
  (to) => {
    if (to) {
      currentLayout.value =
        store.availableLayouts[store.currentlyVisibleLayout.index];
    }
  },
);

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
