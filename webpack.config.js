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
      path: path.resolve('dist/root')
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
        CLOUD_ID: JSON.stringify('dev-3gxm8dpg90392ec0'),
        CDN: JSON.stringify('cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721')
      }),

      new webpack.ProvidePlugin({
        PIXI: 'pixi.js',
      })
    ],

    mode: prod ? 'production' : 'development',
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
  } else {
    conf.plugins.push(
      new ProgressBarPlugin()
    )
  }

  return conf
}
