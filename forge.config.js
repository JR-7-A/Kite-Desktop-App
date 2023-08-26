module.exports = {
  packagerConfig: {
    icon: "./src/image/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: "src/image/icon.ico",
        loadingGif: "src/image/installing.gif",
        iconUrl:
          "https://kite.zerodha.com/static/images/browser-icons/favicon-128.png",
        authors: "kite desktop app (UNOFFICIAL)",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.js",
              name: "main_window",
              preload: {
                js: "./src/preload.js",
              },
            },
          ],
        },
        loggerPort: "9001",
      },
    },
  ],
};
