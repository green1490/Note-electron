<template>
  <!-- Event modifier prevents the -->
  <!-- textarea default behaviour  -->
  <textarea class="textarea"
  @keydown.tab.prevent = "insertTab($event)"
  spellcheck="false"
  v-model="text"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const insertTab = (event:any) => {
  const start = event.target.selectionStart
  const end = event.target.selectionEnd
  event.target.value = event.target.value.substring(0, start) + '\t' + event.target.value.substring(end)
  event.target.selectionStart = event.target.selectionEnd = start + 1
}
</script>
<style scoped>
.textarea {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none;
}

.textarea {
  width: 100%;
  height: 100%;
}

.textarea {
  background-color: #1a1a1c;
  color: white;
}
</style>
