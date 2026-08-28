const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  lib: path.resolve(__dirname, 'lib'),
  constants: path.resolve(__dirname, 'constants'),
  components: path.resolve(__dirname, 'components'),
};

module.exports = config;
