<template>
  <div :contenteditable="editable"
    @click.left="clicked"
    @click.right="contextMenu"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :style="{ 'margin-left': `${depth * 10}px` }"
    class="node"
    :class="{ 'node-hover': hover }"
  >
    <span v-if="directory && directory != undefined">
      <font-awesome-icon v-if="expanded" icon="fa-solid fa-folder-open" />
      <font-awesome-icon v-else icon="fa-solid fa-folder" />
    </span>
    {{ node?.stem() }}
  </div>
  <Filebrowser
    v-if="expanded"
    v-for="child in node?.children"
    :node="child"
    :depth="depth + 1"
  />
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref, reactive } from "vue";
import { TreeNode } from "./class/TreeNode";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { statSync } from "fs";
import { ipcRenderer } from "electron";

const hover = ref(false);
const expanded = ref(false);

const props = defineProps({
  node: TreeNode,
  depth: {
    type: Number,
    default: 0,
  },
});

const contextMenu = () => {
  ipcRenderer.send("context-menu", props.node?.path);
};

const clicked = () => {
  expanded.value = !expanded.value;
};

const directory = computed<Boolean | undefined>(() => {
  if (props.node?.path == undefined) {
    return undefined;
  } else {
    return statSync(props.node.path).isDirectory();
  }
});
</script>

<style scoped>
.node {
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
  border-right: 20px solid transparent;
  white-space: nowrap;
}

.node-hover {
  cursor: pointer;
  background-color: #3d3b3b;
}
</style>
