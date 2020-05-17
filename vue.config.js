module.exports = {
  pwa: {
    name: "Taichung AQI",
    themeColor: "#f6e05e",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "/sw.js",
      // ...other Workbox options...
    },
  },
};
