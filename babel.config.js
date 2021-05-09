module.exports = function(api) {
  api.cache(true);
  const presets = [
    'babel-preset-expo',
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }],
    // ["@babel/plugin-proposal-private-methods",
    // { "loose": true }]
  ];
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
        'data': './data',
        'red': './redux'
      }
    }
  ]];

  return {
    presets,
    plugins
  };
};
