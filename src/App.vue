<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
import Filebrowser from './components/Filebrowser.vue';
import {readdirSync, statSync} from 'fs'
import {sep ,join,} from 'path'
import {TreeNode} from './components/class/TreeNode'
import {ref} from 'vue';

let path = ref<string | undefined>();
let newPath = (newPath:Electron.OpenDialogReturnValue)=> {
  path.value = newPath.filePaths.at(0);
};

let tree = (rootPath:string | undefined) => {
  if(rootPath == undefined)
    return undefined;
  else {
    const root = new TreeNode(rootPath);
    const stack = [root];
    while (stack.length) {
      const currentNode = stack.pop();
      if (currentNode != undefined) {
        const children = readdirSync(currentNode.path);
        for (let child of children) {
          const childPath = join(currentNode.path,sep,child);
          const childNode = new TreeNode(childPath);
          currentNode.children.push(childNode);
          if (statSync(childNode.path).isDirectory()) {
              stack.push(childNode);
          }
        }
      }
      else {
        return undefined
      }
    }
    return root;
  }
};
</script>

<template>
  <div id="#app">
    <div class="sidenav">
      <Sidebar @pathSelected="newPath" class="sidenav" />
    </div>
    <Filebrowser :key="path" :node="tree(path)" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  padding-left: 60px;
  padding-top: 20px;
}

.sidenav {
  height: 100%;
  width: 50px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0);
  overflow-x: hidden;
  padding-top: 20px;
}
</style>
