// init core
import { createApp } from "vue";
import App from "@/app/App.vue";

const app = createApp(App);

// init plugins
import store from "@/app/store/index.js";

app.use(store);

// init styles
import "@/app/assets/styles/tailwind.css";

// init middlewares
app.mount("#app");
