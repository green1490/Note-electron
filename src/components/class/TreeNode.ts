import {sep} from 'path'

export class TreeNode {
    public path: string;
    public children: Array<TreeNode>;
  
    constructor(path: string) {
      this.path = path;
      this.children = [];
    }
  
    fileName():String {
      return this.path.split(sep).at(-1) as String
    }
}