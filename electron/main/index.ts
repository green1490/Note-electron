import { app, BrowserWindow, shell, ipcMain, dialog, globalShortcut } from "electron";
import { readFile, writeFile, mkdir } from "fs";
import { release } from "os";
import { basename, join, sep } from "path";
import { menu } from "../context-menu";
import { dirReader } from '../dirReader'
import { readdir } from "fs/promises";

let currentFileContent:string
let currentFilePath:string
let currentPath:string[]

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, "../.."),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};

export let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL as string;
const indexHtml = join(ROOT_PATH.dist, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Note app",
    icon: join(ROOT_PATH.public, "favicon.ico"),
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

app.on('browser-window-focus', () => {
  globalShortcut.register('Control+S', () => {
    if(currentFilePath && currentFileContent) {
      writeFile(currentFilePath, currentFileContent, err => {
        if (err) {
          console.log(err)
        }
      })
    }
   }
  )
})

app.on('browser-window-blur', () => {
  globalShortcut.unregister('Control+S')
})

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    childWindow.loadURL(`${url}/#${arg}`);
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
});

ipcMain.handle("show-dialog", async () => {
  let selectedPath = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
  currentPath = selectedPath.filePaths
  return selectedPath;
});

ipcMain.on('read-file', (_, path:string, fileName:string) => {
    currentFilePath = path
    readFile(path, 'utf8',(err, data) => {
      if(err != null) {
        win.webContents.send('read-file',null);
      }
      else {
        win.webContents.send('read-file', data, fileName, path)
      }
  })
})

ipcMain.on('change-file', (event, path:string, fileName:string ,text:string) => {
  currentFilePath = path
  currentFileContent = text

  win.webContents.send('change-file', path, fileName, text)
})

export let path: String;

ipcMain.on('context-menu', (_, pathParameter, rootPath:string) => {
  if(pathParameter === rootPath) {
    menu.items.at(-1).enabled = false
  } else {
    menu.items.at(-1).enabled = true
  }
  menu.popup();
  path = pathParameter;
});

ipcMain.on('text-change', (_,text:string) => {
  currentFileContent = text
})

ipcMain.on('sync', (event, directories:any[],files:any[]) => {
  const syncPath = "/Users/zambo/Desktop"
  directories.forEach((dir) => {
    const dirPath = join(syncPath,sep,dir.path)

    mkdir(dirPath, {recursive:true} ,(err) => {
      if (err) {
        console.log(err)
      }
    })
    files.forEach((file) => {
      const fileReferences:string[] = dir.file
      if(fileReferences.includes(file.id)) {
        const filePath = join(dirPath,sep,file.name+'.md')
        writeFile(filePath,file.content, err => {
          if (err) {
            console.log(err)
          }
        })
      }
    })
  })
})

ipcMain.on('sync',async () => {
  const testPath:string = ""
  const baseName = basename(testPath)
  const result = await dirReader(testPath)
  const folderWithContents:{dir:string, files:string[]}[] = []
  
  for (let path of result) {
    const files = await readdir(path)
    const index = path.indexOf(baseName)
    const sanitizedPath = path.substring(index)
    folderWithContents.push({
        dir:sanitizedPath,
        files:files
      })
    }
    console.log(folderWithContents)
})