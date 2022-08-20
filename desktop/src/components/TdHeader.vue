<template>
  <div class="drawer">
    <q-header class="bg-primary text-white">
      <q-toolbar class="toolbar q-electron-drag">
        <q-toolbar-title class="toolbartitle">
          <span
            class="q-electron-drag--exception"
            v-if="burningTomatoVisible < 10"
            @click="burningTomatoVisible++"
            >🍅</span
          >
          <span
            class="q-electron-drag--exception"
            v-if="burningTomatoVisible >= 10"
          >
            <img class="burningTomato" :src="BurningTomato" />
          </span>
          <h1>TomatoDeck</h1>
        </q-toolbar-title>

        <!-- Multiple Profiles / Decks -->
        <q-select
          borderless
          v-model="currentLayout"
          :options="store.availableLayouts"
          :dense="true"
          label="Layout"
          class="q-electron-drag--exception"
        />
        <q-btn
          dense
          flat
          round
          icon="delete"
          @click="deleteDialogOpen = true"
          v-if="store.layout.layouts?.length > 1"
        />

        <q-separator style="margin-left: 1rem" vertical inset />

        <q-btn
          dense
          flat
          icon="minimize"
          style="margin-left: 1rem"
          @click="minimize"
        />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
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
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';
import BurningTomato from '../assets/burning_tomato.gif';

const { t } = useI18n();
const store = useStore();
const currentLayout = ref('');
const deleteDialogOpen = ref(false);

const burningTomatoVisible = ref(0);

const { windowAPI } = window;

const minimize = () => {
  windowAPI.minimize();
};

const toggleMaximize = () => {
  windowAPI.toggleMaximize();
};

const closeApp = () => {
  windowAPI.close();
};

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

.burningTomato {
  width: 2rem;
  height: 3rem;
  padding-top: 1rem;
  margin-right: 0.5rem;
}

.toolbartitle {
  display: flex;
  flex-direction: row;
  align-items: center;
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
