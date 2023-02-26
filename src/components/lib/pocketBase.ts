import { ipcRenderer } from 'electron'
import PocketBase from 'pocketbase'

export class PockatController {
    private pb:PocketBase

    constructor(pb:PocketBase) {
        this.pb = pb
    }

    async sync() {
        const syncDir:{dir:string, files:{name:string,content:string}[]}[] | undefined = await ipcRenderer.invoke(
            'sync', 
            await this.pb.collection('directory').getFullList(),
            await this.pb.collection('file').getFullList()
        )
        if (syncDir) {
            for (let dir of syncDir) {
                const resultList = await this.pb.collection('directory').getFullList(undefined , {
                    filter: `path = "${dir.dir}"`,
                });
                if (resultList.length) {
                    
                } else {
                    const fileIDs:string[] = []
                    const dirRecord = await this.pb.collection('directory').create({'path':dir.dir, 'file': []})
                    for (let item of dir.files) {
                        const fileRecord = await this.pb.collection('file').create({'name':item.name, 'content': item.content})
                        fileIDs.push(fileRecord.id)
                    }
                    await this.pb.collection('directory').update(dirRecord.id, {'file': fileIDs});
                }
            }
        }
    }
}