import {Menu,MenuItemConstructorOptions} from 'electron'
import {name,path} from "./main/index"

const template: MenuItemConstructorOptions[] = [
    {
        label: 'New file',
        click: ()=> {
            
        }
    },
    
];

export let menu = Menu.buildFromTemplate(template);
