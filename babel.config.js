module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@components": "./components",
            "@screens": "./apps",
            "@utils": "./utils",
            "@hooks": "./hooks",
            "@assets": "./assets",
            "@constants": "./constants",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
