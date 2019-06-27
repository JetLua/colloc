const
  path = require('path'),
  webpack = require('webpack'),
  isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: [
    './context/app.js'
  ],

  output: {
    path: path.resolve('dist/context'),
    filename: 'index.js'
  },

  stats: 'errors-only',

  devtool: isProd ? false : 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },

  mode: isProd ? 'production' : 'development'
}