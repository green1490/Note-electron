<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ipcRenderer, OpenDialogReturnValue } from 'electron'

const emit = defineEmits(['path-selected', 'collapsed'])

const fileBrowser = async () => {
  const path: OpenDialogReturnValue = await ipcRenderer.invoke(
    'show-dialog'
  )
  emit('path-selected', path)
}
const collapse = () => {
  emit('collapsed')
}
</script>

<template>
  <div class="container icon">
    <div>
      <button @click="fileBrowser" class="btn btn-outline-dark">
        <font-awesome-icon
          class="fa"
          icon="fa-solid fa-folder"/>
      </button>
      <button class="btn btn-outline-dark" @click="collapse">
        <font-awesome-icon
          class="fa"
          icon="fa-solid fa-arrow-right-arrow-left"/>
      </button>
    </div>
    <div>
      <button class="btn btn-outline-dark">
        <font-awesome-icon class="fa" icon="fa-solid fa-gear" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.icon {
  color: white;
}

.container {
  display: grid;
  grid-template-rows: 0.1fr 3fr 0.4fr;
  justify-content: center;
  height: inherit;
  width: inherit;
}

.fa {
  color: white;
}
</style>
