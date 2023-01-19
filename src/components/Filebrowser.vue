<template>
  <div
    @click="clicked"
    :style="{ 'margin-left': `${depth * 10}px` }"
    class="node"
  >
    <span v-if="directory && directory != undefined">
      <font-awesome-icon v-if="expanded" icon="fa-solid fa-folder-open" />
      <font-awesome-icon v-else icon="fa-solid fa-folder" />
    </span>
    <span v-if="!directory && directory != undefined">
      <!-- <font-awesome-icon icon="fa-solid fa-file" /> -->
    </span>
    {{ node?.fileName() }}
  </div>
  <Filebrowser
    v-if="expanded"
    v-for="child in node?.children"
    :key="child.path"
    :node="child"
    :depth="depth + 1"
  />
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { TreeNode } from "./class/TreeNode";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { statSync } from "fs";

const expanded = ref(false);
const props = defineProps({
  node: TreeNode,
  depth: {
    type: Number,
    default: 0,
  },
});

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
  font-size: 14px;
  white-space: nowrap;
}
</style>
