const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Optionally disable Watchman if you don't want to install it
config.resolver.useWatchman = false;

module.exports = withNativeWind(config, { input: "./global.css" });
