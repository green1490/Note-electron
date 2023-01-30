import { sep } from "path";

export class TreeNode {
  public path: string;
  public children: Array<TreeNode>;

  constructor(path: string) {
    this.path = path;
    this.children = [];
  }

  //file name without the extension
  stem(): String {
    return this.path.split(sep).at(-1)?.split(".").at(0) as String;
  }

  fileName(): String {
    return this.path.split(sep).at(-1) as String;
  }
}
