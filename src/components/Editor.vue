<template>
  <!-- Event modifier prevents the -->
  <!-- textarea default behaviour  -->
  <div class="con" v-show="mode === false && !closed" >
    <textarea ref="text" class="textarea" v-if="props.file != undefined"
    @keydown.tab.prevent = "insertTab($event)"
    @input = "emit('update', ($event.target as HTMLInputElement).value)"
    spellcheck="false"
    :value="props.file.toString()"
    />
  </div>
  <div class="con" v-show="mode === true && !closed" v-html="file" />
  <div class="h-100 container-fluid text-center" style="color: white;" v-show="closed">
    <div class="h-100 row align-items-center">
      <div class="col display-1">No file is opened!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { theme } from '../theme'

const props = defineProps<{
  file?: string | undefined,
  mode?: boolean
  closed:boolean
}>()

const emit = defineEmits(['update'])
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
  background-color: v-bind('theme.editor.backgroundColor');
}

.con {
  width: 100%;
  height: 100%;
  color: v-bind('theme.editor.fontColor');
}
</style>
