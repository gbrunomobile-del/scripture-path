// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Add project root to watch folders
config.watchFolders = [projectRoot];

// Ensure Metro can resolve from project root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Explicitly map root-level folders
config.resolver.extraNodeModules = new Proxy({}, {
  get: (_, name) => path.join(projectRoot, `${name}`),
});

module.exports = config;
