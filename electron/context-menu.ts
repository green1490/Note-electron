import { Menu, MenuItemConstructorOptions } from "electron";
import { path, win } from "./main/index";
import { createWriteStream, rm, statSync, mkdir } from "fs";
import { sep, join } from "path";

const template: MenuItemConstructorOptions[] = [
  {
    label: "New file",
    click: () => {
      let newFile = "new_file.txt";
      let writeStream = createWriteStream(join(path.toString(), sep, newFile));
      writeStream.close();
      win.webContents.send("new-file", path, newFile);
    },
  },
  {
    label: "New folder",
    click: () => {
      let folderName = "new_folder";
      let folderPath = join(path.toString(), sep, folderName);
      mkdir(folderPath, (err) => {
        if (err) {
          console.log(err);
        }
      });
      win.webContents.send("new-folder", path, folderName);
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
