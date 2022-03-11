<template>
  <ion-app>
    <ion-menu side="start" content-id="main-content">
      <ion-content>
        <ion-list id="inbox-list">
          <ion-list-header>TomatoDeck</ion-list-header>
          <ion-note>
            <a
              target="_blank"
              style="text-decoration: none;"
              href="https://twitch.tv/codingtomato"
            >Built with 🍅 by CodingTomato</a>
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
          <ion-item>Test</ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
    <div class="ion-page" id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Inbox</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-router-outlet></ion-router-outlet>
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
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  menuController,
  IonButtons, 
  IonMenuButton,
  IonNote,
  IonApp,
  IonMenuToggle,
  IonLabel,
  IonIcon,
  IonListHeader
} from '@ionic/vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { home, homeSharp, ticket, ticketSharp } from 'ionicons/icons';

const selectedIndex = ref(0);
const appPages = [
  {
    title: 'Home',
    url: '/',
    iosIcon: home,
    mdIcon: homeSharp
  },
  {
    title: 'Test',
    url: '/',
    iosIcon: ticket,
    mdIcon: ticketSharp
  },
];

const openFirst = () => {
  menuController.enable(true, 'first');
  menuController.open('first');
}
const openEnd = () => {
  menuController.open('end');
}
const openCustom = () => {
  menuController.enable(true, 'custom');
  menuController.open('custom');
}

const route = useRoute();
const isSelected = (url: string) => url === route.path ? 'selected' : '';
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
