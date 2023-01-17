<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {ipcRenderer} from 'electron';

const emit = defineEmits(['pathSelected']);

let fileBrowser = ()=> {
  ipcRenderer.send('show dialog');
};

ipcRenderer.on('path selected', (event,path:Electron.OpenDialogReturnValue) => {
  emit("pathSelected",path);
});

</script>

<template>
  <div class="icon container">
    <div class="grid-item">
      <button class="btn btn-outline-dark">
        <font-awesome-icon class="fa" icon="fa-solid fa-arrow-right-arrow-left"/>
      </button>
      <button @click="fileBrowser" class="btn btn-outline-dark">
        <font-awesome-icon class="fa" icon="fa-solid fa-folder"/>
      </button>
    </div>
    <div>
      <button  class="btn btn-outline-dark">
        <font-awesome-icon class="fa" icon="fa-solid fa-gear"/>
      </button>
    </div>
  </div>
</template>

<style scoped>

.icon {
	text-decoration: none;
	text-align: center;
  color: white;
}

.container {
  display: grid;
  grid-template-rows: 1fr 1fr;
  padding: 0%;
  /* against overflow */
  max-width: 50px;
  height: 95%;
}

.grid-item {
  grid-row-start: 1;
  grid-row-end: 2;
}

.fa {
	color: white;
	}
</style>
