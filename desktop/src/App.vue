<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { store } from './store';

import TdHeader from './components/TdHeader.vue';
import TdButton from './components/TdButton.vue';
import TdTwitchChat from './components/TdTwitchChat.vue';

const q = useQuasar();
q.dark.set(true);

const isAddElementModalOpen = ref(false);
const isEditElementModalOpen = ref(false);
const elementOptions = ref([
  'Button', 'Twitch Chat',
]);
const actionOptions = ref([
  'keys', 'hotkey',
]);
const newText = ref('');
const newColor = ref('');
const newElementType = ref();
const newActionType = ref();
const newData = ref('');

const editId = ref(0);
const editRowIndex = ref(0);
const editText = ref('');
const editColor = ref('');
const editElementType = ref();
const editActionType = ref();
const editData = ref('');

const addNewElement = () => {
  const id = Math.floor(Math.random() * 99999);
  const tempLayout = JSON.parse(JSON.stringify(store.layout));
  const rowSize = tempLayout.layouts[0].rows.length;

  const newElement = {
    id,
    row_index: rowSize - 1,
    type: newElementType.value,
    text: newText.value,
    color: newColor.value,
    image: '',
    icon: '',
    eventName: newActionType.value,
    data: newData.value.trim(),
  };

  tempLayout.layouts[0].rows[rowSize - 1].elements.push(newElement);

  store.layout = tempLayout;
  store.updateLayout(JSON.stringify(tempLayout));
};

const editElement = () => {
  const tempLayout = JSON.parse(JSON.stringify(store.layout));

  const newElement = {
    id: editId.value,
    row_index: editRowIndex.value,
    type: editElementType.value,
    text: editText.value,
    color: editColor.value,
    image: '',
    icon: '',
    eventName: editActionType.value,
    data: editData.value.trim(),
  };

  // eslint-disable-next-line max-len
  const index = tempLayout.layouts[0].rows[editRowIndex.value].elements.findIndex((e) => e.id === editId.value);
  tempLayout.layouts[0].rows[editRowIndex.value].elements[index] = newElement;

  store.updateLayout(JSON.stringify(tempLayout));
};

const deleteElement = () => {
  const tempLayout = JSON.parse(JSON.stringify(store.layout));
  // eslint-disable-next-line max-len
  const toKeepElements = tempLayout.layouts[0].rows[editRowIndex.value].elements.filter((e) => !(e.id === editId.value));
  tempLayout.layouts[0].rows[editRowIndex.value].elements = toKeepElements;

  store.layout = tempLayout;
  store.updateLayout(JSON.stringify(tempLayout));
};

const openEditElementDialog = (element) => {
  editId.value = element.id;
  editRowIndex.value = element.row_index;
  editText.value = element.text;
  editColor.value = element.color;
  editElementType.value = element.type;
  editActionType.value = element.eventName;
  editData.value = element.data;

  isEditElementModalOpen.value = true;
};

const openAddDialog = () => {
  isAddElementModalOpen.value = true;
};

onMounted(() => {
  store.getLayout();
  store.getHostData();
});
</script>

<template>
  <q-layout view="hHh lpR fFf">

    <TdHeader />

    <q-page-container>

      <div class="q-pa-md" v-if="store.layout.layouts[0]">
        <div class="row" v-for="row of store.layout.layouts[0].rows" :key="row">
          <div
            v-for="element of row.elements"
            :key="element"
          >
            <TdButton
              v-if="element.type === 'Button'"
              :text="element.text"
              :color="element.color"
              @click="openEditElementDialog(element)"
            />
            <TdTwitchChat
              v-if="element.type === 'Twitch Chat'"
              :channelName="element.text"
              @click="openEditElementDialog(element)"
            />
          </div>
        </div>
      </div>

      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <p><b>Tomatodeck Server: {{ store.hostData.ip }}:{{ store.hostData.socketPort}}</b></p>
      </q-page-sticky>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" @click="openAddDialog" color="accent" />
      </q-page-sticky>

      <!-- Add Modal -->
      <q-dialog
        v-model="isAddElementModalOpen"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Neues Element hinzufügen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row">
              <q-select
                filled
                v-model="newElementType"
                class="fullWidth"
                :options="elementOptions"
                label="Element Art" />
            </div>
            <div class="row" v-if="newElementType === 'Button'">
              <q-input filled class="fullWidth" v-model="newText" label="Text/Emoji" />
            </div>
            <div class="row" v-if="newElementType === 'Button'">
              <q-field filled class="fullWidth" label="Farbe" stack-label>
                <template v-slot:control>
                  <input v-model="newColor" type="color" />
                </template>
              </q-field>
            </div>
            <div class="row" v-if="newElementType === 'Button'">
              <q-select
                filled
                class="fullWidth"
                v-model="newActionType"
                :options="actionOptions"
                label="Aktion" />
            </div>
            <div class="row" v-if="newElementType === 'Button'">
              <q-input filled class="fullWidth" v-model="newData" label="Data" />
            </div>

            <div class="row" v-if="newElementType === 'Twitch Chat'">
              <q-input filled class="fullWidth" v-model="newText" label="Channelname" />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn flat label="Hinzufügen" @click="addNewElement" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit Modal -->
      <q-dialog
        v-model="isEditElementModalOpen"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Element bearbeiten</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row">
              <q-select
                filled
                v-model="editElementType"
                class="fullWidth"
                :options="elementOptions"
                label="Element Art" />
            </div>
            <div class="row" v-if="editElementType === 'Button'">
              <q-input filled class="fullWidth" v-model="editText" label="Text/Emoji" />
            </div>
            <div class="row" v-if="editElementType === 'Button'">
              <q-field filled class="fullWidth" label="Farbe" stack-label>
                <template v-slot:control>
                  <input v-model="editColor" type="color" />
                </template>
              </q-field>
            </div>
            <div class="row" v-if="editElementType === 'Button'">
              <q-select
                filled
                class="fullWidth"
                v-model="editActionType"
                :options="actionOptions"
                label="Aktion" />
            </div>
            <div class="row" v-if="editElementType === 'Button'">
              <q-input filled class="fullWidth" v-model="editData" label="Data" />
            </div>
            <div class="row" v-if="editElementType === 'Twitch Chat'">
              <q-input filled class="fullWidth" v-model="editText" label="Channelname" />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn flat label="Löschen" @click="deleteElement" v-close-popup />
            <q-btn flat label="Speichern" @click="editElement" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-page-container>
  </q-layout>
</template>

<style>
.row {
  gap: 1rem;
}
.fullWidth {
  width: 100%;
  margin-bottom: .5rem;
}
</style>
