<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import Filebrowser from "./components/Filebrowser.vue";
import { readdirSync, statSync } from "fs";
import { sep, join } from "path";
import { TreeNode } from "./components/class/TreeNode";
import { ref } from "vue";

let opened = ref("browser");
let closed = ref("browser-collapsed");
let collapsed = ref(false);
let collapse = () => {
  collapsed.value = !collapsed.value;
};
let path = ref<string | undefined>();
let newPath = (newPathValue: Electron.OpenDialogReturnValue) => {
  path.value = newPathValue.filePaths.at(0);
};

let tree = (rootPath: string | undefined) => {
  if (rootPath == undefined) return undefined;
  else {
    const root = new TreeNode(rootPath);
    const stack = [root];
    while (stack.length) {
      const currentNode = stack.pop();
      if (currentNode != undefined) {
        const children = readdirSync(currentNode.path);
        for (let child of children) {
          const childPath = join(currentNode.path, sep, child);
          const childNode = new TreeNode(childPath);
          currentNode.children.push(childNode);
          if (statSync(childNode.path).isDirectory()) {
            stack.push(childNode);
          }
        }
      } else {
        return undefined;
      }
    }
    return root;
  }
};
</script>

<template>
  <div id="#app">
    <div class="sidenav">
      <Sidebar @collapsed="collapse" @pathSelected="newPath" />
    </div>
    <div class="browser" :class="[collapsed ? closed : '', opened]">
      <Filebrowser :key="path" :node="tree(path)" />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
}

.sidenav {
  height: 100%;
  width: 50px;
  position: fixed;
  z-index: 1;
  top: 0;

  background-color: black;
  overflow-x: hidden;
  padding-top: 40px;
}

.browser {
  color: white;
  background-color: #131315;
}

.browser {
  overflow-y: scroll;
  overflow-x: hidden;
}

.browser {
  width: 200px;
  height: 100vh;
  margin-left: 50px;
  padding-top: 30px;
  padding-left: 20px;
  padding-bottom: 20px;
}

.browser-collapsed {
  display: none;
}

.browser::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
