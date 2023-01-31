<script setup lang="ts">
import { readdirSync, statSync } from 'fs'
import { sep, join } from 'path'
import { TreeNode } from './components/class/TreeNode'
import { ref } from 'vue'
import { ipcRenderer, OpenDialogReturnValue } from 'electron'
import Sidebar from './components/Sidebar.vue'
import FileBrowser from './components/Filebrowser.vue'

const collapse = () => {
  collapsed.value = !collapsed.value
}

const collapsed = ref(true)
const node = ref<TreeNode | undefined>(undefined)
const path = ref<string | undefined>(undefined)

const tree = (rootPath: string | undefined) => {
  if (rootPath === undefined) return undefined
  else {
    const root = new TreeNode(rootPath)
    const stack = [root]

    while (stack.length) {
      const currentNode = stack.pop()
      if (currentNode !== undefined) {
        try {
          const children = readdirSync(currentNode.path)
          for (const child of children) {
            const childPath = join(currentNode.path, sep, child)
            const childNode = new TreeNode(childPath)
            currentNode.children.push(childNode)

            try {
              if (statSync(childNode.path).isDirectory()) {
                stack.push(childNode)
              }
            } catch (error) {
              console.warn(`Wrong path: ${error}`)
            }
          }
        } catch (error) {
          console.warn(`Cant acces the directory: ${error}`)
        }
      } else {
        return currentNode
      }
    }
    return root
  }
}

const insertNode = (tree: TreeNode, path: string, nodeName: string) => {
  if (tree.path === path) {
    tree.children.push(new TreeNode(join(path, sep, nodeName)))
  } else {
    const children = tree.children
    children.forEach((node) => {
      insertNode(node, path, nodeName)
    })
  }
}

const removeNode = (tree: TreeNode, path: string) => {
  const child = tree.children
  const fileIndex = child.findIndex((node, index): boolean => {
    if (node.path === path) {
      return true
    }
    return false
  })

  if (fileIndex !== -1) {
    child.splice(fileIndex, 1)
  } else {
    child.forEach((node) => {
      removeNode(node, path)
    })
  }
}

const newPath = (newPathValue: OpenDialogReturnValue) => {
  path.value = newPathValue.filePaths.at(0)
  node.value = tree(path.value)
}

ipcRenderer.on('new-node', (_, path: string, nodeName: string) => {
  if (node.value !== undefined) {
    insertNode(node.value, path, nodeName)
  }
})

ipcRenderer.on('delete', (_, path) => {
  if (node.value !== undefined) {
    removeNode(node.value, path)
  }
})
</script>

<template>
  <div id="#app">
    <div class="sidenav">
      <Sidebar @collapsed="collapse" @path-selected="newPath" />
    </div>
    <Transition>
      <div v-show="collapsed" class="browser">
        <FileBrowser v-if="node != undefined" :node="node"/>
      </div>
    </Transition>
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.browser::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
