<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { store } from './store';

const q = useQuasar();
q.dark.set(true);

const leftDrawerOpen = ref(false);
const isAddElementModalOpen = ref(false);
const isEditElementModalOpen = ref(false);
const elementOptions = ref([
  'Button',
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

const layoutText = ref(JSON.stringify(store.layout, null, 2));

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const addNewElement = () => {
  const id = Math.floor(Math.random() * 99999);
  const tempLayout = JSON.parse(layoutText.value);
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
    data: newData.value,
  };
  tempLayout.layouts[0].rows[rowSize - 1].elements.push(newElement);

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

const editElement = () => {
  const tempLayout = JSON.parse(layoutText.value);

  const newElement = {
    id: editId.value,
    row_index: editRowIndex.value,
    type: editElementType.value,
    text: editText.value,
    color: editColor.value,
    image: '',
    icon: '',
    eventName: editActionType.value,
    data: editData.value,
  };

  // eslint-disable-next-line max-len
  const index = tempLayout.layouts[0].rows[editRowIndex.value].elements.findIndex((e) => e.id === editId.value);
  tempLayout.layouts[0].rows[editRowIndex.value].elements[index] = newElement;

  store.updateLayout(JSON.stringify(tempLayout));
};

const deleteElement = () => {
  const tempLayout = JSON.parse(layoutText.value);
  // eslint-disable-next-line max-len
  const toKeepElements = tempLayout.layouts[0].rows[editRowIndex.value].elements.filter((e) => !(e.id === editId.value));
  tempLayout.layouts[0].rows[editRowIndex.value].elements = toKeepElements;

  store.layout = tempLayout;
  store.updateLayout(JSON.stringify(tempLayout));
};
</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          TomatoDeck
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <!-- drawer content -->
      <h3>Navigation</h3>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md">
        <div class="row" v-for="row of store.layout.layouts[0].rows" :key="row">
          <div
            class="element"
            :style="{backgroundColor: element.color}"
            v-for="element of row.elements"
            :key="element"
            @click="openEditElementDialog(element)">
            {{ element.text }}
          </div>
        </div>
      </div>
      <div class="q-pa-md" style="max-width: 100vw">
        <q-input
          v-model="layoutText"
          filled
          type="textarea"
        />
        <q-btn color="primary" @click="store.updateLayout(layoutText)" label="Speichern" />
      </div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" @click="() => { isAddElementModalOpen = true }" color="accent" />
      </q-page-sticky>

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
            <div class="row">
              <q-input filled class="fullWidth" v-model="newText" label="Text/Emoji" />
            </div>
            <div class="row">
              <q-field filled class="fullWidth" label="Farbe" stack-label>
                <template v-slot:control>
                  <input v-model="newColor" type="color" />
                </template>
              </q-field>
            </div>
            <div class="row">
              <q-select
                filled
                class="fullWidth"
                v-model="newActionType"
                :options="actionOptions"
                label="Aktion" />
            </div>
            <div class="row">
              <q-input filled class="fullWidth" v-model="newData" label="Data" />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn flat label="Hinzufügen" @click="addNewElement" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

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
            <div class="row">
              <q-input filled class="fullWidth" v-model="editText" label="Text/Emoji" />
            </div>
            <div class="row">
              <q-field filled class="fullWidth" label="Farbe" stack-label>
                <template v-slot:control>
                  <input v-model="editColor" type="color" />
                </template>
              </q-field>
            </div>
            <div class="row">
              <q-select
                filled
                class="fullWidth"
                v-model="editActionType"
                :options="actionOptions"
                label="Aktion" />
            </div>
            <div class="row">
              <q-input filled class="fullWidth" v-model="editData" label="Data" />
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
.element {
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
}
.row {
  gap: 1rem;
}
.fullWidth {
  width: 100%;
  margin-bottom: .5rem;
}
</style>
