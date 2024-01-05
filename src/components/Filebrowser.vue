<template>
  <div
    @click.left="clicked"
    @click.right="contextMenu"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :style="{ 'margin-left': `${depth * 10}px` }"
    class="node"
    :class="{ 'node-hover': hover }"
  >
    <span v-if="directory && directory != undefined">
      <font-awesome-icon v-if="expanded" icon="fa-solid fa-folder-open fa-lg" />
      <font-awesome-icon v-else icon="fa-solid fa-folder fa-lg" />
    </span>
    {{ node?.stem() }}
  </div>
  <div v-if="expanded">
    <Filebrowser
    v-for="(child, index) in node?.children"
    :key="index"
    :node="child"
    :depth="depth + 1"
  />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TreeNode } from './class/TreeNode'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { stat, statSync } from 'fs'
import { ipcRenderer } from 'electron'
import { theme } from '../theme'

const hover = ref(false)
const expanded = ref(false)

const props = defineProps({
  node: TreeNode,
  root: String,
  depth: {
    type: Number,
    default: 0
  }
})

const contextMenu = () => {
  ipcRenderer.send('context-menu', props.node?.path, props.root)
}

const clicked = () => {
  expanded.value = !expanded.value
  if (props.node?.path) {
    stat(props.node.path, (error, stats) => {
      if (error == null && stats.isFile() && props.node?.path) {
        if (props.node.content === undefined) {
          ipcRenderer.send(
            'read-file',
            props.node.path,
            props.node.fileName()
          )
        } else {
          ipcRenderer.send(
            'change-file',
            props.node.path,
            props.node.fileName(),
            props.node.content
          )
        }
      }
    })
  }
}

const directory = computed < Boolean | undefined >(() => {
  if (props.node?.path === undefined) {
    return undefined
  } else {
    return statSync(props.node.path).isDirectory()
  }
})
</script>

<style scoped>
.node {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.node-hover {
  cursor: v-bind('theme.fileBrowser.hover.cursor');
  background-color: v-bind('theme.fileBrowser.hover.backgroundColor');
}
</style>
