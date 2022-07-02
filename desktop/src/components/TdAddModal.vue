<template>
  <!-- Add Modal -->
  <q-dialog
    v-model="isAddElementModalOpen"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{ t('add_new_element') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">

        <!-- Typen Auswahl -->
        <div class="row">
          <q-select
            filled
            v-model="newElementType"
            class="fullWidth"
            :options="elementOptions"
            :label="t('element_type')" />
        </div>

        <!-- Button Text -->
        <div class="row" v-if="newElementType === 'Button' || newElementType === 'Text' ">
          <q-input filled class="fullWidth" v-model="newText" :label="t('text_emoji')" />
        </div>

        <!-- Button Image -->
        <div class="row" v-if="newElementType === 'Button'">
          <q-file
            filled
            class="fullWidth"
            v-model="newElementImage"
            :label="t('image_animation')"
            accept=".jpg, .gif, .png, image/*"
          />
        </div>

        <!-- Button Farbe -->
        <div class="row" v-if="newElementType === 'Button' || newElementType === 'Text'">
          <q-field filled class="fullWidth" :label="t('color')" stack-label>
            <template v-slot:control>
              <input v-model="newColor" type="color" />
            </template>
          </q-field>
        </div>

        <!-- Button Action -->
        <div class="row" v-if="newElementType === 'Button'">
          <q-select
            filled
            class="fullWidth"
            v-model="newActionType"
            :options="actionOptions"
            :label="t('action')" />
        </div>

        <!-- Button Data -->
        <div class="row" v-if="newElementType === 'Button'">
          <q-input
            filled
            class="fullWidth"
            v-model="newData"
            :label="t('data')"
          />
        </div>

        <!-- Channelname für Twitch Chat -->
        <div class="row" v-if="newElementType === 'Twitch Chat'">
          <q-input filled class="fullWidth" v-model="newText" :label="t('channelname')" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat :label="t('cancel')" v-close-popup />
        <q-btn flat :label="t('add')" @click="addNewElement" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { store } from '../store';

const { t } = useI18n();

const isAddElementModalOpen = ref(false);
const elementOptions = ref([
  'Button', 'Twitch Chat', 'Text',
]);
const actionOptions = ref([
  'keys', 'hotkey', 'open_website', 'run_exe', 'open_folder', 'click_mouse', 'play_sound',
]);
const newText = ref('');
const newColor = ref('#000000');
const newElementType = ref();
const newActionType = ref();
const newData = ref('');
const newElementImage = ref('');

const openModal = () => {
  isAddElementModalOpen.value = true;
};

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
    image: newElementImage.value.path || '',
    icon: '',
    eventName: newActionType.value,
    data: newData.value.trim(),
  };

  tempLayout.layouts[0].rows[rowSize - 1].elements.push(newElement);

  store.layout = tempLayout;
  store.updateLayout(JSON.stringify(tempLayout));
};

defineExpose({
  openModal,
});
</script>
