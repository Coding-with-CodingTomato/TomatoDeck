<template>
  <q-dialog v-model="isModalOpen">
    <q-card style="width: 80vw; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">
          {{ editMode ? t('edit_element') : t('add_new_element') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <q-select
            filled
            v-model="elementType"
            class="fullWidth"
            :options="elementOptions"
            :label="t('element_type')"
          />
        </div>

        <!-- Layout Name -->
        <div class="row" v-if="elementType === 'Layout'">
          <q-input
            filled
            class="fullWidth"
            v-model="elementText"
            label="Layout Name"
          />
        </div>

        <!-- Button Text -->
        <div
          class="row"
          v-if="elementType === 'Button' || elementType === 'Text'"
        >
          <q-input
            filled
            class="fullWidth"
            v-model="elementText"
            :label="t('text_emoji')"
          />
        </div>

        <!-- Button Image -->
        <div class="row" v-if="elementType === 'Button'">
          <q-file
            filled
            class="fullWidth"
            v-model="elementImage"
            :label="t('image_animation')"
            accept=".jpg, .gif, .png, image/*"
          />
        </div>

        <!-- Button Farbe -->
        <div
          class="row"
          v-if="elementType === 'Button' || elementType === 'Text'"
        >
          <q-field filled class="fullWidth" :label="t('color')" stack-label>
            <template v-slot:control>
              <input v-model="elementColor" type="color" />
            </template>
          </q-field>
        </div>
        <div class="row" v-if="elementType === 'Button'">
          <q-select
            filled
            class="fullWidth"
            v-model="elementAction"
            :options="actionOptions"
            :label="t('action')"
          />
        </div>
        <div
          class="row"
          v-if="
            elementType === 'Button' &&
            elementAction !== 'switch_layout' &&
            elementAction !== 'discord' &&
            elementAction !== 'twitch_chat_message'
          "
        >
          <q-input
            filled
            class="fullWidth"
            v-model="elementData"
            :label="t('data')"
          />
        </div>

        <!-- Twitch Chat message channel names -->
        <div
          class="row"
          v-if="
            elementType === 'Button' && elementAction === 'twitch_chat_message'
          "
        >
          <q-input
            filled
            class="fullWidth"
            v-model="elementTwitchChatChannels"
            label="Twitch Kanalnamen (Kommasepariert)"
          />
        </div>

        <!-- Twitch Chat message -->
        <div
          class="row"
          v-if="
            elementType === 'Button' && elementAction === 'twitch_chat_message'
          "
        >
          <q-input
            filled
            class="fullWidth"
            v-model="elementTwitchChatMessage"
            label="Nachricht"
          />
        </div>

        <!-- Discord Action selector -->
        <div
          class="row"
          v-if="elementType === 'Button' && elementAction === 'discord'"
        >
          <q-select
            filled
            class="fullWidth"
            v-model="elementData"
            :options="[
              'mute_microphone',
              'unmute_microphone',
              'toggle_microphone',
              'deaf_headphones',
              'undeaf_headphones',
              'toggle_headphones',
              'leave_voice_channel',
            ]"
            :label="t('discord')"
          />
        </div>

        <!-- Switch layout selector -->
        <div
          class="row"
          v-if="elementType === 'Button' && elementAction === 'switch_layout'"
        >
          <q-select
            filled
            class="fullWidth"
            v-model="elementData"
            :options="['next', 'last', ...store.availableLayoutsNames]"
            :label="t('layout')"
          />
        </div>

        <!-- Twitch Chat Channel Selector -->
        <div class="row" v-if="elementType === 'Twitch Chat'">
          <q-input
            filled
            class="fullWidth"
            v-model="elementText"
            :label="t('channelname')"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-teal">
        <q-btn flat :label="t('cancel')" v-close-popup />
        <q-btn
          flat
          :label="t('delete')"
          v-if="editMode"
          @click="deleteElement"
          v-close-popup
        />
        <q-btn
          flat
          :label="t('save')"
          v-if="editMode"
          @click="editElement"
          v-close-popup
        />
        <q-btn
          flat
          :label="t('add')"
          v-if="!editMode"
          @click="addNewElement"
          v-close-popup
        />
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

const isModalOpen = ref(false);
const editMode = ref(false);

const elementOptions = ref(['Button', 'Twitch Chat', 'Text', 'Layout']);
const actionOptions = ref([
  'keys',
  'hotkey',
  'open_website',
  'run_exe',
  'open_folder',
  'click_mouse',
  'play_sound',
  'counter',
  'http_get_request',
  'switch_layout',
  'discord',
  'twitch_chat_message',
  'obs_command',
]);

const elementId = ref(0);
const elementRowIndex = ref(0);
const elementText = ref('');
const elementColor = ref('');
const elementType = ref();
const elementAction = ref();
const elementData = ref('');
const elementImage = ref('');

const elementTwitchChatChannels = ref('');
const elementTwitchChatMessage = ref('');

const editElement = () => {
  const tempLayout = JSON.parse(JSON.stringify(store.layout));

  let newelementData = elementData.value.trim();
  if (elementAction.value === 'twitch_chat_message') {
    newelementData = JSON.stringify({
      channelNames: elementTwitchChatChannels.value,
      message: elementTwitchChatMessage.value,
    });
  }

  const newElement = {
    id: elementId.value,
    row_index: elementRowIndex.value,
    type: elementType.value,
    text: elementText.value,
    color: elementColor.value,
    image: elementImage.value?.path || '',
    icon: '',
    eventName: elementAction.value,
    data: newelementData,
  };

  // eslint-disable-next-line max-len
  const index = tempLayout.layouts[store.currentlyVisibleLayout.index].rows[
    elementRowIndex.value
  ].elements.findIndex((e) => e.id === elementId.value);
  tempLayout.layouts[store.currentlyVisibleLayout.index].rows[
    elementRowIndex.value
  ].elements[index] = newElement;

  store.updateLayout(JSON.stringify(tempLayout));
};

const deleteElement = () => {
  const tempLayout = JSON.parse(JSON.stringify(store.layout));
  // eslint-disable-next-line max-len
  const toKeepElements = tempLayout.layouts[
    store.currentlyVisibleLayout.index
  ].rows[elementRowIndex.value].elements.filter(
    (e) => !(e.id === elementId.value),
  );
  tempLayout.layouts[store.currentlyVisibleLayout.index].rows[
    elementRowIndex.value
  ].elements = toKeepElements;

  store.layout = tempLayout;
  store.updateLayout(JSON.stringify(tempLayout));
};

const addNewElement = () => {
  const id = Math.floor(Math.random() * 99999);
  const tempLayout = JSON.parse(JSON.stringify(store.layout));

  if (elementType.value === 'Layout') {
    const newLayout = {
      name: elementText.value,
      rows: [{ elements: [] }],
    };

    tempLayout.layouts.push(newLayout);
  } else {
    const rowSize = tempLayout.layouts[0].rows.length;

    if (elementAction.value === 'twitch_chat_message') {
      elementData.value = JSON.stringify({
        channelNames: elementTwitchChatChannels.value,
        message: elementTwitchChatMessage.value,
      });
    }

    const newElement = {
      id,
      row_index: rowSize - 1,
      type: elementType.value,
      text: elementText.value,
      color: elementColor.value,
      image: elementImage.value.path || '',
      icon: '',
      eventName: elementAction.value,
      data: elementData.value.trim(),
    };

    tempLayout.layouts[store.currentlyVisibleLayout.index].rows[
      rowSize - 1
    ].elements.push(newElement);
  }

  store.layout = tempLayout;
  store.updateLayout(JSON.stringify(tempLayout));
};

const openModal = (element) => {
  if (element) {
    elementId.value = element.id;
    elementRowIndex.value = element.row_index;
    elementText.value = element.text;
    elementColor.value = element.color;
    elementType.value = element.type;
    elementAction.value = element.eventName;
    elementData.value = element.data;
    elementImage.value = element.image;

    if (elementAction.value === 'twitch_chat_message') {
      elementTwitchChatChannels.value = JSON.parse(
        elementData.value,
      ).channelNames;
      elementTwitchChatMessage.value = JSON.parse(elementData.value).message;
    }

    editMode.value = true;
    elementOptions.value = ['Button', 'Twitch Chat', 'Text'];
  } else {
    elementId.value = '';
    elementRowIndex.value = '';
    elementText.value = '';
    elementColor.value = '';
    elementType.value = '';
    elementAction.value = '';
    elementData.value = '';
    elementImage.value = '';
    elementTwitchChatChannels.value = '';
    elementTwitchChatMessage.value = '';

    editMode.value = false;
    elementOptions.value = ['Button', 'Twitch Chat', 'Text', 'Layout'];
  }
  isModalOpen.value = true;
};

defineExpose({
  openModal,
});
</script>
