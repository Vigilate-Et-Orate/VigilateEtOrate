module.exports = function(api) {
  api.cache(true);
  const presets = ['babel-preset-expo'];
  const plugins = [[
    require.resolve('babel-plugin-module-resolver'),
    {
      root: ['.'],
      alias: {
        'config': './config',
        'elements': './elements',
        'screens': './screens',
        'utils': './utils',
        'components': './components',
        'data': './data'
      }
    }
  ]];

  return {
    presets,
    plugins
  };
};
