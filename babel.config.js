const path = require('path')

// babel-preset-expo lives inside expo's own node_modules; resolve it from there
const expoDir = path.dirname(require.resolve('expo/package.json'))
const babelPresetExpo = require.resolve('babel-preset-expo', {
  paths: [expoDir],
})

module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      [babelPresetExpo, { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  }
}
