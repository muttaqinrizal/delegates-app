var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const stamp = new Date().getTime()

module.exports = {
  entry: {
    commons: [
      'axios',
      'dayjs',
      'vue-filepond',
      'lodash',
      'marked',
      'filepond-plugin-image-preview',
      'localforage',
    ],
    swRegistration: './src/sw-register.js',
    main: './src/main.js',
    'babel-polyfill': 'babel-polyfill'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: '[name].' + stamp + '.js',
    chunkFilename: '[name].' + stamp + '.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].' + stamp + '.[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'static' },
      { from: './src/.htaccess', to: './'},
      { from: './src/manifest.json', to: './'}
    ]),
    new ServiceWorkerWebpackPlugin({
      entry: path.resolve(__dirname, 'src/service-worker.js')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.' + stamp + '.js',
    })

  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    inline: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      'ENVIRONMENT': '"production"',
      'BUILDSTAMP': stamp
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin([
      { from: 'serve.json' },
    ]),
  ])
}
else {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      'ENVIRONMENT': '"development"',
      'BUILDSTAMP': stamp
    }),
    new CopyWebpackPlugin([
      { from: 'test' },
    ]),
  ])
}
