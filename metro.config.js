const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude the 'src' directory from Metro as it's for the web/vite portion only
config.resolver.blockList = [
  /.*\/src\/.*/,
];

module.exports = config;
