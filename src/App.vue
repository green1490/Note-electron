<script setup lang="ts">
import { readdirSync, statSync } from 'fs'
import { sep, join, extname } from 'path'
import { TreeNode } from './components/class/TreeNode'
import { ref } from 'vue'
import { ipcRenderer, OpenDialogReturnValue } from 'electron'
import Sidebar from './components/Sidebar.vue'
import FileBrowser from './components/Filebrowser.vue'
import Editor from './components/Editor.vue'
import Dock from './components/Dock.vue'
import Menu from './components/Menu.vue'

const currentNode = ref<TreeNode>()
const currentLayout = ref('"side browser menu"\n"side browser area"\n"dock dock dock"')
const sidepanelOpened = ref(true)
// root dir's content and sub contents
const node = ref<TreeNode | undefined>(undefined)
// root path of the dir
const path = ref<string | undefined>(undefined)

const change = () => {
  sidepanelOpened.value = !sidepanelOpened.value
  if (sidepanelOpened.value === true) {
    const openedSide = '"side browser menu"\n"side browser area"\n"dock dock dock"'
    currentLayout.value = openedSide
  } else {
    const collapsedSide = '"side menu menu"\n"side area area"\n"dock dock dock"'
    currentLayout.value = collapsedSide
  }
}

const tree = (rootPath: string | undefined) => {
  if (rootPath === undefined) return undefined
  else {
    const root = new TreeNode(rootPath)
    const stack = [root]

    while (stack.length) {
      const node = stack.pop()
      if (node !== undefined) {
        try {
          const children = readdirSync(node.path)
          const filteredFile = children.filter((element, index, array) => {
            return ((extname(element) === '.md' || extname(element) === '') && element.charAt(0) !== '.')
          })

          for (const child of filteredFile) {
            const childPath = join(node.path, sep, child)
            const childNode = new TreeNode(childPath)
            node.children.push(childNode)

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
        return node
      }
    }
    return root
  }
}
const getNode = (tree: TreeNode, path:string) => {
  const queue:TreeNode[] = []
  tree.children.forEach((node) => {
    queue.push(node)
  })

  for (const node of queue) {
    if (node.path === path) {
      return node
    }
    node.children.forEach((node) => {
      queue.push(node)
    })
  }

  return undefined
}

const instertConent = (tree: TreeNode, path: string, content:string) => {
  const node = getNode(tree, path)
  if (node) {
    node.content = content
  }
  return node
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
  if (currentNode.value) {
    if (currentNode.value?.content === undefined) {
      currentNode.value.content = ''
      ipcRenderer.send('text-change', '')
    } else {
      currentNode.value.content = text
      ipcRenderer.send('text-change', text)
    }
  }
}

ipcRenderer.on('new-node', (event, path: string, nodeName: string) => {
  if (node.value !== undefined) {
    insertNode(node.value, path, nodeName)
  }
})

// delete whole if and testing
ipcRenderer.on('delete', (event, path:string) => {
  currentNode.value = undefined
})

ipcRenderer.on('delete', (event, path:string) => {
  if (node.value) {
    removeNode(node.value, path)
  }
})

ipcRenderer.on('read-file', (event, data:string | null, fileName:string, path:string) => {
  if (data != null && node.value) {
    currentNode.value = instertConent(node.value, path, data)
    if (currentNode.value?.content && currentNode.value.path) {
      currentNode.value.content = data
      currentNode.value.path = path
    }
  }
})

ipcRenderer.on('change-file', (event, path:string, fileName:string, text:string) => {
  if (node.value) {
    currentNode.value = getNode(node.value, path)
    if (currentNode.value?.content) {
      currentNode.value.content = text
    }
  }
})

</script>

<template>
  <div id="#app"/>
  <div class="cont">
    <div class="sidebar">
      <Sidebar @toggle="change" @path-selected="newPath" />
    </div>
    <div v-show="sidepanelOpened" class="browser" >
      <FileBrowser v-if="node != undefined" :node="node"/>
    </div>
    <div class="editor">
      <Editor @update="updateEditor" :file="currentNode?.content"/>
    </div>
    <div class="menu">
      <Menu :current-file ="currentNode?.fileName()"/>
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
  font-size: medium;
  width: 100vw;
  height: 100vh;
}

.cont {
  display: grid;
  grid-template-columns: 50px 200px 1fr;
  grid-template-rows: 0.2fr 3fr 0.1fr;
  grid-template-areas: v-bind('currentLayout');
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
