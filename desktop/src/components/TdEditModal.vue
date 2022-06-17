<template>
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
        <!-- Button Text -->
        <div class="row" v-if="editElementType === 'Button' || editElementType === 'Text' ">
          <q-input filled class="fullWidth" v-model="editText" label="Text/Emoji" />
        </div>

        <!-- Button Farbe -->
        <div class="row" v-if="editElementType === 'Button' || editElementType === 'Text'">
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
          <q-input filled class="fullWidth" v-model="editData" label="Data (Keys / URL / Pfad)" />
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
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { store } from '../store';

const isEditElementModalOpen = ref(false);
const elementOptions = ref([
  'Button', 'Twitch Chat', 'Text',
]);
const actionOptions = ref([
  'keys', 'hotkey', 'open_website', 'run_exe', 'open_folder',
]);

const editId = ref(0);
const editRowIndex = ref(0);
const editText = ref('');
const editColor = ref('');
const editElementType = ref();
const editActionType = ref();
const editData = ref('');

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

const openModal = (element) => {
  editId.value = element.id;
  editRowIndex.value = element.row_index;
  editText.value = element.text;
  editColor.value = element.color;
  editElementType.value = element.type;
  editActionType.value = element.eventName;
  editData.value = element.data;

  isEditElementModalOpen.value = true;
};

defineExpose({
  openModal,
});
</script>
