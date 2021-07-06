module.exports = {
  presets: [
    ['@babel/typescript'],
    ['@babel/env', {useBuiltIns: 'usage', corejs: '3.15'}],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    ['@babel/transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: true,
      useESModules: true
    }]
  ]
}
