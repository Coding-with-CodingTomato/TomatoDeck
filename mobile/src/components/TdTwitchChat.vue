<template>
  <div class="twitchChat">
    <h3><b>Twitch Chat</b></h3>
    <div class="chat">
      <p class="message" v-for="message in messages" :key="message.message + Math.random()">
        <b>{{ message.username }}:</b> {{message.message}}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';

const props = defineProps({
  channelName: { type: String, required: true, default: ''},
});

interface chatMessage {
  username: string;
  message: string;
}

const messages = ref<Array<chatMessage>>([]);

onMounted(() => {
  const chatBox = document.querySelector('.chat');
  console.log(props.channelName);
  // eslint-disable-next-line no-undef
  const client = new tmi.Client({
    connection: {
      reconnect: true,
      secure: true
    },
    channels: [ props.channelName ]
  });

  client.connect().catch(console.error);
  client.on('message', (channel: any, tags: { username: any; }, message: string, self: any) => {
    messages.value.push({
      username: tags.username,
      message,
    });

    if(chatBox !== null) {
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    }
  });
});
</script>

<style scoped>
.twitchChat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0.5rem 0.5rem 0.5rem;
  width: 35vw;
  height: 50vh;
  background-color: black;
  box-shadow: 0px 0px 0px rgba(0, 0, 4px, 0.25);
  border-radius: 5px;
}

.chat {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-height: 90%;
  overflow-y: scroll;
  width: 100%;
}

.message {
  width: 100%;
  word-wrap: break-word;
  font-size: large;
}
</style>
