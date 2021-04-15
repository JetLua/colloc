const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

module.exports = ({prod} = {}) => {
  const conf = {
    entry: {
      main: {
        import: [
          '@iro/wechat-adapter',
          'pixi.js',
          './src/core',
          './src/module',
          './src/fishpond/app.ts'
        ],
        filename: 'game.js'
      },
      colloc: {import: ['./src/colloc/app.ts'], filename: '[name]/game.js', dependOn: 'main'},
      sudoku: {import: ['./src/sudoku/app.ts'], filename: '[name]/game.js', dependOn: 'main'},
    },

    experiments: {
      topLevelAwait: true
    },

    output: {
      globalObject: 'GameGlobal', // for subpackages
      path: path.resolve(`dist/root`)
    },

    resolve: {
      extensions: ['.js', '.ts'],
      alias: {
        '@': path.resolve('.'),
        '~': path.resolve('./src'),
      }
    },

    devtool: prod ? false : 'source-map',

    stats: 'errors-only',

    watch: !prod,

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.(vert|frag|html)$/,
          use: ['raw-loader'],
          exclude: /node_modules/
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        PROD: JSON.stringify(prod),
        CLOUD_ID: JSON.stringify('zero-7gi05c0t5d37e3cf'),
        CDN: JSON.stringify('cloud://zero-7gi05c0t5d37e3cf.7a65-zero-7gi05c0t5d37e3cf-1258618978')
      }),

      new webpack.ProvidePlugin({
        dragonBones: 'dragonbones.js'
      })
    ],

    mode: 'development',
  }

  if (prod) {
    conf.mode = 'production'
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
  } else {
    conf.plugins.push(
      new ProgressBarPlugin()
    )
  }

  return conf
}
