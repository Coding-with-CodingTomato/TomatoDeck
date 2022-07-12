<template>
  <ion-list class="chat">
    <ion-list-header class="titleWrapper"
      ><div class="title">
        <ion-icon class="icon" :icon="logoTwitch"></ion-icon>
        <h3>{{ props.channelName }} Chat</h3>
      </div></ion-list-header
    >
    <div class="messages">
      <ion-item
        class="message"
        v-for="message in messages"
        :key="message.message + Math.random()"
      >
        <div class="messageContent">
          <h2>
            {{ message.username }} -
            {{ new Date(message.time).toLocaleTimeString() }}
          </h2>
          <p>{{ message.message }}</p>
        </div>
      </ion-item>
      <ion-item class="message" v-if="messages.length === 0">
        <div class="messageContent">
          <p>Noch keine Nachrichten vorhanden... 💭</p>
        </div>
      </ion-item>
    </div>
  </ion-list>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import { IonList, IonItem, IonListHeader, IonIcon } from '@ionic/vue';
import { logoTwitch } from 'ionicons/icons';

const props = defineProps({
  channelName: { type: String, required: true, default: '' },
});

interface chatMessage {
  username: string;
  time: number;
  message: string;
}

const messages = ref<Array<chatMessage>>([]);

onMounted(() => {
  const chatBox = document.querySelector('.chat');

  // eslint-disable-next-line no-undef
  const client = new tmi.Client({
    connection: {
      reconnect: true,
      secure: true,
    },
    channels: [props.channelName],
  });

  client.connect().catch(console.error);
  client.on(
    'message',
    (channel: any, tags: { username: string }, message: string, self: any) => {
      messages.value.push({
        username: tags.username,
        time: Date.now(),
        message,
      });

      if (chatBox !== null) {
        chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
      }
    }
  );
});
</script>

<style scoped>
.titleWrapper {
  padding-left: 0;
}
.title {
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;

  width: 100%;
}
.title h3 {
  padding: 0;
  margin: 0;
}

.chat {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  border-radius: 5px;

  grid-column: span 2;
  grid-row: span 3;
  box-shadow: 0px 0px 0px rgba(0, 0, 4px, 0.25);
}

.messages {
  height: 50vh;
  width: 100%;
  overflow-y: scroll;
  overflow-x: none;
  padding-bottom: 1rem;
}

.message {
  width: 100%;
  word-wrap: break-word;
  font-size: large;
}

.messageContent {
  display: flex;
  flex-direction: column;
}

.messageContent h2 {
  margin: 1rem 0 0 0;
  font-size: 13pt;
}

.messageContent p {
  margin: 0.25rem 0 0.25rem 0;
  font-size: 12pt;
  color: rgb(150, 150, 150);
}
</style>
