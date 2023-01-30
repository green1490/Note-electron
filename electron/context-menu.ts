import { dialog, Menu, MenuItemConstructorOptions } from "electron";
import { path, win } from "./main/index";
import { constants, access,createWriteStream, rm, statSync, mkdir } from "fs";
import { extname, basename ,sep, join, dirname } from "path";

const template: MenuItemConstructorOptions[] = [
  {
    label: "New file",
    click: async () => {
      let dialogValue = await dialog.showSaveDialog(win,{
        title: "New file", 
        defaultPath: path as string,
      });
      if(dialogValue.canceled == false) {
        let newFileName = basename(dialogValue.filePath,".md");
        let selectedPath = dirname(dialogValue.filePath);
        let extName = extname(newFileName);
        let file = `${join(selectedPath,sep,newFileName)}.md`;
        
        access(file,constants.F_OK, (err) => {
          if(err && extName == "") {
            newFileName = `${newFileName}.md`;
            let writeStream = createWriteStream(file);
            writeStream.close();
            
            win.webContents.send("new-node", selectedPath, newFileName);
          }
        });
      }
    },
  },
  {
    label: "New folder",
    click: async () => {
      let dialogValue = await dialog.showSaveDialog(win,{
        title: "New folder", 
        defaultPath: path as string,
      });

      if (dialogValue.canceled == false) {
        let newDirName = basename(dialogValue.filePath);
        let selectedPath = dirname(dialogValue.filePath);
        let extName = extname(newDirName);
        let dir = join(selectedPath,sep,newDirName);

        access(dir,constants.F_OK, (err) => {
          if(err && extName == "") {
            mkdir(dir, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            
            win.webContents.send("new-node", selectedPath, newDirName);
          }
        });
      }
    },
  },
  {
    label: "Delete",
    click: () => {
      let directory = statSync(path.toString()).isDirectory();
      if (directory) {
        rm(path.toString(), { recursive: true, force: true }, (err) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        rm(path.toString(), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      win.webContents.send("delete", path);
    },
  },
];

export let menu = Menu.buildFromTemplate(template);
