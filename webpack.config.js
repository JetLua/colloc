const os = require('os')
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const prod = process.argv.includes('-p')

const conf = {
  entry: [
    '@iro/wechat-adapter',
    './src/app.js'
  ],

  output: {
    path: path.resolve('dist/root'),
    filename: 'game.js'
  },

  resolve: {
    alias: {
      '@': path.resolve('.')
    }
  },

  devServer: {
    hot: true,
    host: '0.0.0.0',
    stats: 'errors-only',
    contentBase: '.',
  },

  devtool: prod ? false : 'source-map',

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(vert|frag)$/,
        use: ['raw-loader']
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      CLOUD_ID: JSON.stringify('colloc-18efba'),
      VER: JSON.stringify(require('./package.json').version),
      BASE: JSON.stringify('cloud://colloc-18efba.636f-colloc-18efba-1258618978')
    }),

    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
      dragonBones: 'dragonbones.js'
    })
  ],

  mode: prod ? 'production' : 'development'
}

if (prod) {
  conf.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false
          }
        },
      })
    ]
  }
}

module.exports = conf
