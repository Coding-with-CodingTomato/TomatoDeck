<template>
  <div class="settings">
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Server Verbindung</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating"
                        >IP-Adresse des PCs</ion-label
                      >
                      <ion-input v-model="ip" required></ion-input>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating"
                        >Port der Applikation</ion-label
                      >
                      <ion-input
                        v-model="port"
                        type="number"
                        min="0"
                        required
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-button @click="saveConnData">Speichern</ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Server Passwort</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Neues Passwort</ion-label>
                      <ion-input
                        v-model="password"
                        type="password"
                        min="0"
                        required
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-button @click="saveNewPassword"
                      >Aktualisieren</ion-button
                    >
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Sonstige Einstellungen</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label>Vibrationfeedback bei Klick</ion-label>
                      <ion-toggle
                        @ionChange="updateClickFeedback"
                        :checked="store.clickFeedback"
                      >
                      </ion-toggle>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-button @click="saveSonstiges">Speichern</ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script setup lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonToggle,
  alertController,
} from '@ionic/vue';
import { ref, watch } from 'vue';
import { useStore } from '../store';

const store = useStore();
const ip = ref(store.serverIp);
const port = ref(store.serverPort);
const password = ref('');
const clickFeedback = ref(store.clickFeedback);

const updateClickFeedback = (event: any) => {
  console.log(event);
  clickFeedback.value = event.detail.checked;
};

const saveConnData = async () => {
  await store.setNewConnData(ip.value, port.value);
  presentAlert();
};

const saveNewPassword = async () => {
  await store.setNewPasssword(password.value);
  presentAlert();
};

const saveSonstiges = async () => {
  await store.setSonstiges(clickFeedback.value.toString());
  presentAlert();
};

const presentAlert = async () => {
  const alert = await alertController.create({
    header: 'Daten gespeichert.',
    buttons: ['OK'],
  });
  await alert.present();
};

watch(
  () => store.serverIp,
  () => {
    ip.value = store.serverIp;
    port.value = store.serverPort;
  }
);
</script>
