import { basename, sep } from "path";

export class TreeNode {
  path: string
  children: Array<TreeNode>
  content: string | undefined

  constructor(path: string, childs:TreeNode[] = []) {
    this.path = path
    this.children = childs
    this.content = undefined
  }

  //file name without the extension
  stem(): string {
    return this.path.split(sep).at(-1)?.split(".").at(0) as string
  }

  fileName(): string {
    return basename(this.path)
  }

  node(path:string,node:TreeNode):TreeNode | undefined {
    if (node.path == path) {
      return node
    } else {
      node.children.forEach((node) => {
        this.node(path,node)
      })
    }
  }
}
