import { readdir, stat } from 'fs/promises'
import { sep, join } from 'path'

export const dirReader = async (path:string) => {
    const childFiles = await readdir(path)
    const dirs:string[] = [path]

    for(let i = 0;i < childFiles.length;i++) {
        childFiles[i] = join(path,sep,childFiles[i])
    }

    const stack:string[] = childFiles
    while (stack.length) {
        const currentStackItem = stack.pop()
        const stats = await stat(currentStackItem)

        if (stats.isDirectory()) {
            dirs.push(currentStackItem)
            const childFiles = await readdir(currentStackItem)
            childFiles.forEach((file) => {
                stack.push(join(currentStackItem,sep,file))
            })
        }
    }
    return dirs
}