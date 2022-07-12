import { defineStore } from "pinia";
import { Storage } from "@capacitor/storage";
import { io } from "socket.io-client";
import { toastController } from "@ionic/vue";
import { alertCircle, checkmarkCircle } from "ionicons/icons";
import crypto from "crypto-js";

interface element {
  id: number;
  row_index: number;
  type: string;
  text: string;
  color: string;
  image: string;
  icon: string;
  eventName: string;
  data: string;
}
interface row {
  elements: Array<element>;
}
interface layout {
  name: string;
  rows: Array<row>;
}
interface deckLayouts {
  deviceName: string;
  layouts: Array<layout>;
}

export const useStore = defineStore("main", {
  state: () => ({
    serverIp: "",
    serverPort: 0,
    serverPassword: "",
    clickFeedback: false,
    currentSocket: io({ autoConnect: false }),
    connected: false,
    errorMessage: "",
    imageMap: new Map(),
    deckLayout: {} as deckLayouts,
    currentlyVisibleLayoutId: 0,
  }),
  actions: {
    async init() {
      const { value: ip } = await Storage.get({ key: "tomatoDeckServerIp" });
      const { value: port } = await Storage.get({
        key: "tomatoDeckServerPort",
      });
      const { value: password } = await Storage.get({
        key: "tomatoDeckServerPassword",
      });
      const { value: storeClickFeedback } = await Storage.get({
        key: "tomatoDeckClickFeedback",
      });

      this.serverIp = ip || "";
      this.serverPort = parseInt(port || "0");
      this.serverPassword = password || "";
      this.clickFeedback = storeClickFeedback === "true" ? true : false;
    },
    connect() {
      this.currentSocket.disconnect();
      console.log("Init new socket connection");
      const newSocket = io(`ws://${this.serverIp}:${this.serverPort}`, {
        auth: {
          password: this.serverPassword,
        },
      });
      this.currentSocket = newSocket;

      newSocket.on("deckLayout", (data) => {
        this.deckLayout = JSON.parse(data);
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket!");
        this.connected = true;
        this.errorMessage = "";
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected socket", reason);
        this.connected = false;
        this.errorMessage = reason;
      });

      newSocket.on("imageData", (data) => {
        this.imageMap.set(data.imagePath, data.imageData);
      });

      newSocket.io.on("error", (error) => {
        console.log(error);
        this.connected = false;
        this.errorMessage = JSON.stringify(error);
      });

      newSocket.on("errorEvent", async () => {
        const toast = await toastController.create({
          message: "Event fehlerhaft ausgeführt.",
          icon: alertCircle,
          position: "top",
          color: "danger",
          duration: 2000,
        });
        toast.present();
      });

      newSocket.on("sucessEvent", async () => {
        const toast = await toastController.create({
          message: "Event erfolgreich ausgeführt.",
          icon: checkmarkCircle,
          position: "top",
          color: "success",
          duration: 2000,
        });
        toast.present();
      });
    },
    toggleConnection() {
      if (this.connected) this.currentSocket.disconnect();
      else this.connect();
    },
    async setNewConnData(ip: string, port: number) {
      this.serverIp = ip;
      this.serverPort = port;
      await Storage.set({
        key: "tomatoDeckServerIp",
        value: ip,
      });
      await Storage.set({
        key: "tomatoDeckServerPort",
        value: `${port}`,
      });
    },
    async setNewPasssword(password: string) {
      const hash = crypto.SHA256(password).toString(crypto.enc.Hex);
      this.serverPassword = hash;
      await Storage.set({
        key: "tomatoDeckServerPassword",
        value: hash,
      });
    },
    async setSonstiges(newClickFeedback: string) {
      await Storage.set({
        key: "tomatoDeckClickFeedback",
        value: newClickFeedback.toString(),
      });
      this.clickFeedback = newClickFeedback === "on" ? true : false;
    },
    requestImageData(imagePath: string) {
      this.currentSocket.emit("requestImage", imagePath);
    },
    switchLayout(data: string) {
      if (data === "next") {
        if (this.currentlyVisibleLayoutId < this.availableLayouts.length) {
          this.currentlyVisibleLayoutId += 1;
        } else {
          this.currentlyVisibleLayoutId = 0;
        }
      } else if (data === "last") {
        if (this.currentlyVisibleLayoutId > 0) {
          this.currentlyVisibleLayoutId -= 1;
        } else {
          this.currentlyVisibleLayoutId = this.availableLayouts.length - 1;
        }
      } else {
        this.currentlyVisibleLayoutId =
          this.availableLayouts.findIndex((l) => l.label === data) || 0;
      }
    },
  },
  getters: {
    availableLayouts: (state) => {
      if (state.deckLayout.layouts) {
        return state.deckLayout.layouts.map((l, i) => ({
          label: l.name,
          value: i,
          index: i,
        }));
      }

      return [];
    },
    currentlyVisibleLayout: (state) => {
      if (state.deckLayout.layouts) {
        return state.deckLayout.layouts[state.currentlyVisibleLayoutId];
      } else {
        return null;
      }
    },
  },
});

export default useStore;
