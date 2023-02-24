import { ipcRenderer } from 'electron'
import PocketBase from 'pocketbase'

export class PockatController {
    private pb:PocketBase
    private childs:{id:string,name:string}[]
    private stack:string[]

    constructor(pb:PocketBase) {
        this.pb = pb
        this.childs = []
        this.stack = []
    }

    async sync() {
        // ipcRenderer.send(
        //     'sync', 
        //     await this.pb.collection('directory').getFullList(),
        //     await this.pb.collection('file').getFullList()
        //     )
        ipcRenderer.send('sync')
    }
}