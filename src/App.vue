<script setup lang="ts">
import { readdirSync, statSync } from 'fs'
import { sep, join } from 'path'
import { TreeNode } from './components/class/TreeNode'
import { ref } from 'vue'
import { ipcRenderer, OpenDialogReturnValue } from 'electron'
import Sidebar from './components/Sidebar.vue'
import FileBrowser from './components/Filebrowser.vue'
import Editor from './components/Editor.vue'
import Dock from './components/Dock.vue'
import Menu from './components/Menu.vue'

const fileData = ref<string>()
const current = ref('"side browser menu"\n"side browser area"\n"dock dock dock"')
const opened = ref(true)
const node = ref<TreeNode | undefined>(undefined)
const path = ref<string | undefined>(undefined)

const change = () => {
  opened.value = !opened.value
  if (opened.value === true) {
    const openedSide = '"side browser menu"\n"side browser area"\n"dock dock dock"'
    current.value = openedSide
  } else {
    const collapsedSide = '"side menu menu"\n"side area area"\n"dock dock dock"'
    current.value = collapsedSide
  }
}

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

const updateEditor = (text:string) => {
  fileData.value = text
  ipcRenderer.send('text-change', text)
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

ipcRenderer.on('read-file', (_, data:string | null) => {
  if (data != null) {
    fileData.value = data
  }
})

</script>

<template>
  <div id="#app"/>
  <div class="cont">
    <div class="sidebar">
      <Sidebar @toggle="change" @path-selected="newPath" />
    </div>
    <div v-show="opened" class="browser" >
      <FileBrowser v-if="node != undefined" :node="node"/>
    </div>
    <div class="editor">
      <Editor @update="updateEditor" :file="fileData"/>
    </div>
    <div class="menu">
      <Menu/>
    </div>
    <div class="dock">
      <Dock/>
    </div>
  </div>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
}

.cont {
  display: grid;
  grid-template-columns: 50px 200px 1fr;
  grid-template-rows: 0.1fr 3fr 0.1fr;
  grid-template-areas: v-bind('current');
}

.cont {
  width: 100%;
  height: 100%;
}

.menu {
  grid-area: menu;
}

.dock {
  grid-area: dock;
}

.area {
  grid-area: area;
}

.editor{
  grid-area: area;
}

.sidebar {
  background-color: black;
  grid-area: side;
}

.browser {
  color: white;
  background-color: #131315;
}

.browser {
  padding-top: 3rem;
  padding-left: 1rem;
}

.browser {
  overflow-y: scroll;
  overflow-x: hidden;
  grid-area: browser;
}

.browser::-webkit-scrollbar {
  display: none;
}
</style>
