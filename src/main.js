const { app, BrowserWindow, Menu, nativeImage } = require("electron");
const path = require("path");
const AppStorage = require("electron-store");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
let mainWindow = null;

const appSingleInstance = app.requestSingleInstanceLock();
if (!appSingleInstance) {
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

// store last window position
const schema = {
  lastBounds: { type: "object" },
};

const appStorage = new AppStorage({ schema });
let getLastBounds = appStorage.get("lastBounds");

if (!getLastBounds) {
  getLastBounds = { width: 400, height: 700 };
}

// Menu configuration
const template = [
  {
    label: "Actions",
    submenu: [
      {
        label: `Disable always on top`,
        click: () => {
          const isAlawysOnTop = mainWindow.isAlwaysOnTop();
          if (isAlawysOnTop) {
            BrowserWindow.getAllWindows().forEach((window) =>
              window.setAlwaysOnTop(false)
            );
          } else {
            BrowserWindow.getAllWindows().forEach((window) =>
              window.setAlwaysOnTop(true)
            );
          }
          template[0].submenu[0].label = `${
            isAlawysOnTop ? "Enable" : "Disable"
          } always on top`;
          const menu = Menu.buildFromTemplate(template);
          Menu.setApplicationMenu(menu);
        },
      },
      {
        label: `Minimize all popup`,
        click: () => {
          BrowserWindow.getAllWindows().forEach((window) => {
            if (window.getParentWindow()) {
              window.minimize();
            }
          });
        },
      },
      {
        label: `Maximize all popup`,
        click: () => {
          BrowserWindow.getAllWindows().forEach((window) => {
            window.show();
          });
        },
      },
      {
        label: `Close all popup`,
        click: () => {
          BrowserWindow.getAllWindows().forEach((window) => {
            if (window.getParentWindow()) {
              window.close();
            }
          });
        },
      },
    ],
  },
];

// browser title icon
const icon = nativeImage.createFromDataURL(
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAA8BAMAAAAUK7B2AAAAHlBMVEUAAAD2Rxr3Rhr1RhrbNSvkOSXjOSXbNCz2Rhr///9zI/bYAAAAB3RSTlMAd3+AiL/Awocs+wAAAAFiS0dECfHZpewAAAClSURBVEjH7cyxDQIxEERRo2uCkDII6WJKuAZOmhzJEmUTHBxne3e8jvGPv15KRctL9SzndJf3bdKTnvSk/51OVzXnR3Vf1I0txfFMDuAg43gmB3CQcTyTAzj2O4Z/6CCO7x3BDzqE43f38RMdwHG+e3hBd3GUt8YruoOjvhXe0BJHe/u4QQsc1u3hJu3isG8bd2gHh3dbuEubOPy7xQXd4suq7u0N2bCWptBCfDwAAAAASUVORK5CYII="
);

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: getLastBounds["width"],
    height: getLastBounds["height"],
    x: getLastBounds["x"],
    y: getLastBounds["y"],
    alwaysOnTop: true,
    show: false,
    icon,
  });

  // and load the index.html of the app. MAIN_WINDOW_WEBPACK_ENTRY
  mainWindow.loadURL("https://kite.zerodha.com/");
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  // mainWindow.webContents.openDevTools();

  mainWindow.on("close", () => {
    appStorage.set("lastBounds", mainWindow.getBounds());
  });

  mainWindow.on("restore", () => {
    BrowserWindow.getAllWindows().forEach((window) => {
      if (window.getParentWindow()) {
        window.minimize();
      }
    });
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("browser-window-created", (e, w) => {
  w.setAlwaysOnTop(true);
  if (!w.getParentWindow()) {
    w.setParentWindow(mainWindow);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
