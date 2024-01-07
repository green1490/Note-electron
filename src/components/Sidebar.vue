<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ipcRenderer, OpenDialogReturnValue } from 'electron'
import { theme } from '../theme'

const emit = defineEmits(['path-selected', 'toggle', 'setting'])

const fileBrowser = async () => {
  const path: OpenDialogReturnValue = await ipcRenderer.invoke(
    'show-dialog'
  )
  emit('path-selected', path)
}

const collapse = () => {
  emit('toggle')
}

// const setting = () => {
//   emit('setting')
// }
</script>

<template>
  <div class="container icon">
    <div>
      <button class="btn btn-outline-dark" @click="collapse">
        <font-awesome-icon
          class="fa fa-lg"
          icon="fa-solid fa-arrow-right-arrow-left"/>
      </button>
      <button @click="fileBrowser" class="btn btn-outline-dark">
        <font-awesome-icon
          class="fa fa-lg"
          icon="fa-solid fa-folder"/>
      </button>
      <!-- <button @click="setting" class="btn btn-outline-dark">
        <font-awesome-icon class="fa fa-lg" :icon="['fas', 'gear']" />
      </button> -->
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: 0.1fr 3fr 0.4fr;
  justify-content: center;
}

.container {
  height: 100%;
  width: 100%;
}

.fa {
  color: v-bind('theme.sideBar.iconColor');
}
</style>
