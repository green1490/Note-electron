import { createApp } from "vue";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRightArrowLeft,
  faFolder,
  faGear,
  faFolderOpen,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faArrowRightArrowLeft, faFolder, faGear, faFolderOpen,faSync);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
