<template>
  <!-- Add Modal -->
  <q-dialog v-model="isKnowledgeModalOpen">
    <q-card style="width: 80vw; max-width: 80vw">
      <q-splitter v-model="splitterModel" style="height: 600px">
        <template v-slot:before>
          <div class="q-pa-md">
            <q-tree
              :nodes="simple"
              node-key="label"
              selected-color="primary"
              v-model:selected="selected"
              v-model:expanded="expanded"
            />
          </div>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="selected"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="Configuration">
              <div class="text-h4 q-mb-md">Configuration</div>
              <p>
                If you installed TomatoDeck correctly you should be able to
                create new on your current layout. All the available element
                types are described below.

                <br />
                <br />

                An extended version of the configuration can be found
                <a
                  href="https://github.com/Coding-with-CodingTomato/TomatoDeck/blob/main/docs/configuration.md"
                  target="_blank"
                  >here</a
                >.
              </p>
            </q-tab-panel>
            <q-tab-panel name="Button">
              <div class="text-h4 q-mb-md">Button</div>
              A button triggers an action when clicked. You can find all
              available keys under the
              <b>Available Keys</b> entry.<br /><br />Available Settings:
              <ul>
                <li>
                  <b>Text/Emoji:</b> Set a text or emoji which will be displayed
                  in the button
                </li>
                <li>
                  <b>Image/Animation:</b> You can choose an image or GIF which
                  will get displayed inside the button. (The text wont be
                  visible if you choose to set an image)
                </li>
                <li><b>Color:</b> The background color of the button</li>
                <li>
                  <b>Action:</b> This is the type of action which will get
                  executed when the button is clicked
                  <ul>
                    <li>
                      <b>keys:</b> Types the keys specified in the Data setting
                    </li>
                    <li>
                      <b>hotkey:</b> Holds the all keys but the last one and
                      clicks the last one to execute a hotkey
                    </li>
                    <li>
                      <b>open_website:</b> Opens url specified in the Data
                      setting in your default browser
                    </li>
                    <li>
                      <b>run_exe:</b> Runs the EXE file specified in the Data
                      setting (Format: Path)
                    </li>
                    <li>
                      <b>open_folder:</b> Opens a folder specified in the Data
                      setting (Format: Path)
                    </li>
                    <li>
                      <b>click_mouse:</b> Clicks the mouse on a specific point
                      on your screen (Format for Data setting: x,y)
                    </li>
                    <li>
                      <b>play_sound:</b> Plays an audio file specified in the
                      Data setting (Format: Path)
                    </li>
                    <li><b>counter:</b> Converts a button to a counter</li>
                    <li>
                      <b>switch_layout:</b> Allows you to switch between your
                      layouts
                    </li>
                  </ul>
                </li>
              </ul>
            </q-tab-panel>
            <q-tab-panel name="Twitch Chat">
              <div class="text-h4 q-mb-md">Twitch Chat</div>
              <p>
                Displays the chat messages sent in the specified Twitch Chat.
              </p>
            </q-tab-panel>
            <q-tab-panel name="Text">
              <div class="text-h4 q-mb-md">Text</div>
              <p>
                Looks like a button but triggers no action and just displays
                text.
              </p>
            </q-tab-panel>
            <q-tab-panel name="Layout">
              <div class="text-h4 q-mb-md">Layout</div>
              <p>Creates a new layout with the specified name.</p>
            </q-tab-panel>
            <q-tab-panel name="Available Keys">
              <div class="text-h4 q-mb-md">Available Keys</div>
              <p>
                You can find all available keys
                <a
                  href="https://nut-tree.github.io/apidoc/enums/key_enum.Key.html"
                  target="_blank"
                  >here</a
                >.
              </p>
            </q-tab-panel>
            <q-tab-panel name="Tips">
              <div class="text-h4 q-mb-md">Tips</div>
              <p>
                You can find all available tips sorted by OS in the
                subcategories below.
              </p>
            </q-tab-panel>
            <q-tab-panel name="Windows">
              <div class="text-h4 q-mb-md">Windows Tips</div>
              <p>
                <b>Open the emoji picker</b><br />
                You can open the emoji picker by pressing:
                <q-chip color="primary" text-color="white"> Windows </q-chip> +
                <q-chip color="primary" text-color="white"> . </q-chip>
                <br /><br />
                <b>Available shortcuts</b><br />
                You can find available shortcuts
                <a
                  href="https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec"
                  target="_blank"
                  >here</a
                >.
              </p>
            </q-tab-panel>
            <q-tab-panel name="macOS">
              <div class="text-h4 q-mb-md">macOS Tips</div>
              <p>
                <b>Open the emoji picker</b><br />
                You can open the emoji picker by pressing:
                <q-chip color="primary" text-color="white"> Control </q-chip> +
                <q-chip color="primary" text-color="white"> Command </q-chip> +
                <q-chip color="primary" text-color="white"> Space </q-chip>
                <br /><br />
                <b>Available shortcuts</b><br />
                You can find available shortcuts
                <a
                  href="https://support.apple.com/en-us/HT201236"
                  target="_blank"
                  >here</a
                >.
              </p>
            </q-tab-panel>
            <q-tab-panel name="Linux">
              <div class="text-h4 q-mb-md">Linux Tips</div>
              <p>
                <b>Open the emoji picker</b><br />
                You can open the emoji picker by pressing (often depends on the
                distro):
                <q-chip color="primary" text-color="white"> Control </q-chip> +
                <q-chip color="primary" text-color="white"> . </q-chip>
                <br /><br />
                <b>Available shortcuts</b><br />
                You can find available shortcuts
                <a
                  href="https://linuxhint.com/100_keyboard_shortcuts_linux/"
                  target="_blank"
                  >here</a
                >.
              </p>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';

const { t } = useI18n();
const store = useStore();

const splitterModel = ref(30);
const selected = ref('Configuration');
const expanded = ref(['Knowledgebase', 'Configuration']);
const simple = [
  {
    label: 'Knowledgebase',
    open: true,
    children: [
      {
        label: 'Configuration',
        icon: 'settings',
        children: [
          {
            label: 'Button',
            icon: 'check_box_outline_blank',
          },
          {
            label: 'Text',
            icon: 'text_fields',
          },
          {
            label: 'Twitch Chat',
            icon: 'chat',
          },
          {
            label: 'Layout',
            icon: 'dashboard',
          },
        ],
      },
      {
        label: 'Available Keys',
        icon: 'keyboard',
      },
      {
        label: 'Tips',
        icon: 'tips_and_updates',
        children: [
          {
            label: 'Windows',
            icon: 'desktop_windows',
          },
          {
            label: 'macOS',
            icon: 'desktop_mac',
          },
          {
            label: 'Linux',
            icon: 'desktop_windows',
          },
        ],
      },
    ],
  },
];

const isKnowledgeModalOpen = ref(true);

const openModal = () => {
  isKnowledgeModalOpen.value = true;
};

defineExpose({
  openModal,
});
</script>
