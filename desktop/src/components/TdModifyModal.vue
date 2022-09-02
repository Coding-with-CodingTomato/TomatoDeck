<template>
  <q-dialog v-model="isModalOpen">
    <q-card style="width: 80vw; max-width: 80vw; overflow-x: hidden" flat>
      <q-item>
        <q-item-section>
          <q-item-label>
            <h6 style="margin: 0">
              {{ editMode ? t('edit_element') : t('add_new_element') }}
            </h6></q-item-label
          >
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section :horizontal="elementType === 'Button'">
        <q-card-section class="col-5">
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

        <q-separator vertical v-if="elementType === 'Button'" />

        <q-card-section class="col-7" v-if="elementType === 'Button'">
          <div class="row" v-if="elementType === 'Button'">
            <q-select
              filled
              class="col-10"
              v-model="elementAction"
              :options="actionOptions"
              :label="t('action')"
            />
            <q-btn
              square
              color="primary"
              class="col-2"
              icon="add"
              @click="addAction"
            />
          </div>

          <q-timeline
            color="secondary"
            layout="dense"
            v-if="elementType === 'Button'"
            style="max-height: 30vh; overflow-y: auto"
          >
            <draggable
              v-model="elementActions"
              group="actions"
              @start="drag = true"
              @end="drag = false"
              item-key="id"
            >
              <template #item="{ element }">
                <q-timeline-entry :subtitle="`${element.type}`">
                  <template v-slot:title>
                    <!-- Data Only-->
                    <template
                      v-if="
                        element.type !== 'switch_layout' &&
                        element.type !== 'discord' &&
                        element.type !== 'twitch_chat_message' &&
                        element.type !== 'wled'
                      "
                    >
                      <div class="row" style="margin: 0; padding: 0">
                        <q-input
                          filled
                          bottom-slots
                          dense
                          class="fullWidth"
                          v-model.trim="element.data"
                          style="margin: 0; padding: 0"
                          :label="`${element.type} Data`"
                        >
                          <template v-slot:after>
                            <q-btn
                              round
                              dense
                              flat
                              icon="delete"
                              @click="removeAction(i)"
                            />
                          </template>
                        </q-input>
                      </div>
                    </template>

                    <!-- Twitch Chat message channel names -->
                    <template v-if="element.type === 'twitch_chat_message'">
                      <div class="row">
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.channels"
                          label="Twitch Kanalnamen (Kommasepariert)"
                        />
                      </div>

                      <!-- Twitch Chat message -->
                      <div class="row">
                        <q-input
                          filled
                          bottom-slots
                          dense
                          class="fullWidth"
                          v-model="element.data.message"
                          label="Nachricht"
                        >
                          <template v-slot:after>
                            <q-btn
                              round
                              dense
                              flat
                              icon="delete"
                              @click="removeAction(i)"
                            />
                          </template>
                        </q-input>
                      </div>
                    </template>

                    <!-- Discord Action selector -->
                    <template v-if="element.type === 'discord'">
                      <div class="row">
                        <q-select
                          filled
                          bottom-slots
                          dense
                          class="fullWidth"
                          v-model="element.data"
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
                        >
                          <template v-slot:after>
                            <q-btn
                              round
                              dense
                              flat
                              icon="delete"
                              @click="removeAction(i)"
                            />
                          </template>
                        </q-select>
                      </div>
                    </template>

                    <!-- Switch Action selector -->
                    <template v-if="element.type === 'switch_layout'">
                      <div class="row">
                        <q-select
                          filled
                          bottom-slots
                          dense
                          class="fullWidth"
                          v-model="element.data"
                          :options="[
                            'next',
                            'last',
                            ...store.availableLayoutsNames,
                          ]"
                          :label="t('layout')"
                        >
                          <template v-slot:after>
                            <q-btn
                              round
                              dense
                              flat
                              icon="delete"
                              @click="removeAction(i)"
                            />
                          </template>
                        </q-select>
                      </div>
                    </template>

                    <!-- WLED Action selector -->
                    <template v-if="element.type === 'wled'">
                      <!-- WLED DATA -->
                      <div class="row">
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.ip"
                          :label="t('wled.ip')"
                        >
                          <template v-slot:after>
                            <q-btn
                              round
                              dense
                              flat
                              icon="delete"
                              @click="removeAction(i)"
                            />
                          </template>
                        </q-input>
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.red"
                          :label="`${t('wled.red')} (0-255)`"
                        />
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.green"
                          :label="`${t('wled.green')} (0-255)`"
                        />
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.blue"
                          :label="`${t('wled.blue')} (0-255)`"
                        />
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.white"
                          :label="`${t('wled.white')} (0-255)`"
                        />
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.effectId"
                          :label="`${t('wled.effectId')} (Solid: 0)`"
                        />
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.effectSpeed"
                          :label="`${t('wled.effectSpeed')} (0-255)`"
                        />
                        <q-input
                          filled
                          dense
                          class="fullWidth"
                          v-model="element.data.effectIntensity"
                          :label="`${t('wled.effectIntensity')} (0-255)`"
                        />
                      </div>
                    </template>
                  </template>
                </q-timeline-entry>
              </template>
            </draggable>
          </q-timeline>
        </q-card-section>
      </q-card-section>
      <q-separator />

      <q-card-actions>
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
import draggable from 'vuedraggable';
import { ref, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';

const { t } = useI18n();
const store = useStore();

const isModalOpen = ref(false);
const editMode = ref(false);
const drag = ref(false);

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
  'wait',
  'wled',
]);

const elementId = ref(0);
const elementRowIndex = ref(0);
const elementText = ref('');
const elementColor = ref('');
const elementType = ref('Button');
const elementAction = ref();
const elementData = ref('');
const elementImage = ref('');

const elementActions = ref([]);

const addAction = () => {
  if (elementAction.value === '') return;

  let dataElement = '';

  if (elementAction.value === 'twitch_chat_message') {
    dataElement = {
      channels: '',
      message: '',
    };
  } else if (elementAction.value === 'wled') {
    dataElement = {
      ip: '',
      red: 0,
      green: 0,
      blue: 0,
      white: 0,
      effectId: 0,
      effectSpeed: 0,
      effectIntensity: 0,
    };
  }

  elementActions.value.push({
    id: Math.random(),
    type: elementAction.value,
    data: dataElement,
  });
};
const removeAction = (index) => {
  elementActions.value.splice(index, 1);
};

const editElement = () => {
  const tempLayout = JSON.parse(JSON.stringify(store.layout));

  const newElement = {
    id: elementId.value,
    row_index: elementRowIndex.value,
    type: elementType.value,
    text: elementText.value,
    color: elementColor.value,
    image: elementImage.value?.path || '',
    icon: '',
    actions: elementActions.value,
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
  if (elementType.value === 'Button' && elementActions.value.length === 0)
    return;

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

    const newElement = {
      id,
      row_index: rowSize - 1,
      type: elementType.value,
      text: elementText.value,
      color: elementColor.value,
      image: elementImage.value.path || '',
      icon: '',
      actions: elementActions.value,
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
    elementActions.value = element.actions;
    elementImage.value = element.image;

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
    elementActions.value = [];

    editMode.value = false;
    elementOptions.value = ['Button', 'Twitch Chat', 'Text', 'Layout'];
  }
  isModalOpen.value = true;
};

defineExpose({
  openModal,
});
</script>
