<template>
  <q-dialog
    v-model="isEditElementModalOpen"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{ t('edit_element') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <q-select
            filled
            v-model="editElementType"
            class="fullWidth"
            :options="elementOptions"
            :label="t('element_type')" />
        </div>
        <!-- Button Text -->
        <div class="row" v-if="editElementType === 'Button' || editElementType === 'Text' ">
          <q-input filled class="fullWidth" v-model="editText" :label="t('text_emoji')" />
        </div>

        <!-- Button Image -->
        <div class="row" v-if="editElementType === 'Button'">
          <q-file
            filled
            class="fullWidth"
            v-model="editImage"
            :label="t('image_animation')"
            accept=".jpg, .gif, .png, image/*"
          />
        </div>

        <!-- Button Farbe -->
        <div class="row" v-if="editElementType === 'Button' || editElementType === 'Text'">
          <q-field filled class="fullWidth" :label="t('color')" stack-label>
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
            :label="t('action')" />
        </div>
        <div class="row" v-if="editElementType === 'Button'">
          <q-input
            filled
            class="fullWidth"
            v-model="editData"
            :label="t('data')"
          />
        </div>
        <div class="row" v-if="editElementType === 'Twitch Chat'">
          <q-input filled class="fullWidth" v-model="editText" :label="t('channelname')" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat :label="t('cancel')" v-close-popup />
        <q-btn flat :label="t('delete')" @click="deleteElement" v-close-popup />
        <q-btn flat :label="t('save')" @click="editElement" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';

const { t } = useI18n();
const store = useStore();

const isEditElementModalOpen = ref(false);
const elementOptions = ref([
  'Button', 'Twitch Chat', 'Text',
]);
const actionOptions = ref([
  'keys', 'hotkey', 'open_website', 'run_exe', 'open_folder', 'click_mouse', 'play_sound',
]);

const editId = ref(0);
const editRowIndex = ref(0);
const editText = ref('');
const editColor = ref('');
const editElementType = ref();
const editActionType = ref();
const editData = ref('');
const editImage = ref('');

const editElement = () => {
  const tempLayout = JSON.parse(JSON.stringify(store.layout));

  const newElement = {
    id: editId.value,
    row_index: editRowIndex.value,
    type: editElementType.value,
    text: editText.value,
    color: editColor.value,
    image: editImage.value?.path || '',
    icon: '',
    eventName: editActionType.value,
    data: editData.value.trim(),
  };

  // eslint-disable-next-line max-len
  const index = tempLayout.layouts[store.currentlyVisibleLayout.index].rows[editRowIndex.value].elements.findIndex((e) => e.id === editId.value);
  tempLayout.layouts[store.currentlyVisibleLayout.index].rows[editRowIndex.value].elements[index] = newElement;

  store.updateLayout(JSON.stringify(tempLayout));
};

const deleteElement = () => {
  const tempLayout = JSON.parse(JSON.stringify(store.layout));
  // eslint-disable-next-line max-len
  const toKeepElements = tempLayout.layouts[store.currentlyVisibleLayout.index].rows[editRowIndex.value].elements.filter((e) => !(e.id === editId.value));
  tempLayout.layouts[store.currentlyVisibleLayout.index].rows[editRowIndex.value].elements = toKeepElements;

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
  editImage.value = element.image;

  isEditElementModalOpen.value = true;
};

defineExpose({
  openModal,
});
</script>
