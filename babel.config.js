module.exports = function(api) {
  api.cache(true);
  const presets = [
    'babel-preset-expo',
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
      loose: true,
      shippedProposals: true
    }]
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
  ],
  ["@babel/plugin-proposal-private-methods", { "loose": true }],
  ["@babel/plugin-proposal-class-properties", { "loose": true }],
  // ["@babel/plugin-proposal-private-property-in-class-object", { "loose": true }]
  ];

  return {
    presets,
    plugins
  };
};
