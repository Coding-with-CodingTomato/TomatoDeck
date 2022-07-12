<template>
  <ion-app>
    <ion-menu side="start" content-id="main-content">
      <ion-content>
        <ion-list id="inbox-list">
          <ion-list-header>TomatoDeck</ion-list-header>
          <ion-note>
            <a
              target="_blank"
              style="text-decoration: none"
              href="https://twitch.tv/codingtomato"
              >Built with 🍅 by CodingTomato</a
            >
          </ion-note>

          <ion-menu-toggle auto-hide="true" v-for="(p, i) in appPages" :key="i">
            <ion-item
              @click="selectedIndex = i"
              router-direction="root"
              :router-link="p.url"
              lines="none"
              detail="false"
              class="hydrated"
              :class="{ selected: selectedIndex === i }"
            >
              <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
              <ion-label>{{ p.title }}</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>

        <ion-list class="bottom-info">
          <ion-item v-if="store.currentlyVisibleLayout">
            <ion-select
              placeholder="Layout"
              :value="store.currentlyVisibleLayoutId"
              @ionChange="setNewLayout"
            >
              <template
                v-for="layout in store.availableLayouts"
                :key="layout.index"
              >
                <ion-select-option :value="layout.index">{{
                  layout.label
                }}</ion-select-option>
              </template>
            </ion-select>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
    <div class="ion-page" id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button @click="store.toggleConnection">
              <ion-icon
                v-if="store.connected"
                slot="icon-only"
                :icon="cloudDone"
              ></ion-icon>
              <ion-icon v-else slot="icon-only" :icon="cloudOffline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title
            >TomatoDeck - {{ store.currentlyVisibleLayout?.name }}</ion-title
          >
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <router-view></router-view>
      </ion-content>
    </div>
  </ion-app>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonNote,
  IonApp,
  IonMenuToggle,
  IonLabel,
  IonIcon,
  IonListHeader,
  IonButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useStore } from './store';
import {
  home,
  homeSharp,
  mic,
  micSharp,
  cloudOffline,
  cloudDone,
  cog,
  cogSharp,
} from 'ionicons/icons';

const store = useStore();

const setNewLayout = (event: any) => {
  store.currentlyVisibleLayoutId = event.detail.value;
};

onMounted(async () => {
  await store.init();
  store.connect();
});

const selectedIndex = ref(0);
const appPages = [
  {
    title: 'Home',
    url: '/',
    iosIcon: home,
    mdIcon: homeSharp,
  },
  {
    title: 'Audio',
    url: '/',
    iosIcon: mic,
    mdIcon: micSharp,
  },
  {
    title: 'Einstellungen',
    url: '/settings',
    iosIcon: cog,
    mdIcon: cogSharp,
  },
];
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
