import { basename, sep } from "path";

export class TreeNode {
  path: string
  children: Array<TreeNode>
  content: string | undefined

  constructor(path: string) {
    this.path = path
    this.children = []
    this.content = undefined
  }

  //file name without the extension
  stem(): String {
    return this.path.split(sep).at(-1)?.split(".").at(0) as String
  }

  fileName(): String {
    return basename(this.path)
  }
}
