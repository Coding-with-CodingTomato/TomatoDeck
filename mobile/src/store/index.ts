import { reactive } from "vue";
import { Storage } from "@capacitor/storage";
import { io } from "socket.io-client";
import { toastController } from "@ionic/vue";
import { alertCircle, checkmarkCircle } from 'ionicons/icons';

export const store = reactive({
  serverIp: "",
  serverPort: 0,
  currentSocket: io({ autoConnect: false }),
  connected: false,
  errorMessage: "",
  imageMap: new Map(),
  deckLayout: {
    name: "",
    layouts: [
      {
        name: "",
        rows: [
          {
            elements: [
              {
                type: "",
                text: "",
                image: "",
                icon: "",
                color: "",
                eventName: "",
                data: "",
              },
            ],
          },
        ],
      },
    ],
  },
  init: async () => {
    const { value: ip } = await Storage.get({ key: "tomatoDeckServerIp" });
    const { value: port } = await Storage.get({ key: "tomatoDeckServerPort" });

    if (ip === "" || port === "0") return;

    store.serverIp = ip || "";
    store.serverPort = parseInt(port || "0");
  },
  connect: () => {
    store.currentSocket.disconnect();
    console.log("Init new socket connection");
    const newSocket = io(`ws://${store.serverIp}:${store.serverPort}`);
    store.currentSocket = newSocket;

    newSocket.on("deckLayout", (data) => {
      console.log(data);
      store.deckLayout = JSON.parse(data);
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket!");
      store.connected = true;
      store.errorMessage = "";
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected socket", reason);
      store.connected = false;
      store.errorMessage = reason;
    });

    newSocket.on("imageData", (data) => {
      store.imageMap.set(data.imagePath, data.imageData);
    });

    newSocket.io.on("error", (error) => {
      console.log(error);
      store.connected = false;
      store.errorMessage = JSON.stringify(error);
    });

    newSocket.on("errorEvent", async () => {
      const toast = await toastController
        .create({
          message: 'Event fehlerhaft ausgeführt.',
          icon: alertCircle,
          position: 'top',
          color: 'danger',
          duration: 2000
        })
      toast.present();
    });

    newSocket.on("sucessEvent", async () => {
      const toast = await toastController
        .create({
          message: 'Event erfolgreich ausgeführt.',
          icon: checkmarkCircle,
          position: 'top',
          color: 'success',
          duration: 2000
        })
      toast.present();
    });
  },
  toggleConnection: () => {
    if (store.connected) store.currentSocket.disconnect();
    else store.connect();
  },
  setNewConnData: async (ip: string, port: number) => {
    store.serverIp = ip;
    store.serverPort = port;
    await Storage.set({
      key: "tomatoDeckServerIp",
      value: ip,
    });
    await Storage.set({
      key: "tomatoDeckServerPort",
      value: `${port}`,
    });
  },
  requestImageData: (imagePath: string) => {
    store.currentSocket.emit('requestImage', imagePath);
  },
});

export default store;
