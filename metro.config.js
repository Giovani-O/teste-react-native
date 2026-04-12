const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// @react-aria/utils imports "react-dom" (for flushSync) which doesn't exist
// in React Native.  Point the resolver at a lightweight shim instead.
config.resolver = config.resolver || {}
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-dom': path.resolve(__dirname, 'shims/react-dom.js'),
}

module.exports = withNativeWind(config, { input: './global.css' })
