var webpack = require('webpack')
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var srcPath = path.join(__dirname, 'src');

var config = {
  entry: {
    main:['./src/main.js']
  },
  output: {
    path: path.resolve(__dirname, 'static/'),
    publicPath: '',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      jquery: path.join(__dirname, './node_modules/jquery'),
      mediaelement: path.join(__dirname, './node_modules/mediaelement')
    }
  },
  module: {
    // avoid webpack trying to shim process
    noParse: /es6-promise\.js$/,
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
      },
      { test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8190'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new  HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html'
    })
  ],
  vue: {
    loaders: {
      js: 'babel'
    }
  },
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true
}

if (process.env.NODE_ENV === 'production') {
  config.output.publicPath = 'http://mres.quzhiboapp.com/'
  config.output.filename = '[name].[chunkhash].js'
  config.output.chunkFilename = '[id].[chunkhash].js'
  config.vue.loaders = {
    js: 'babel',
    css: ExtractTextPlugin.extract('style-loader', 'css-loader'),
    less: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
    sass: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
    stylus: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
  }
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
} else {
  config.devtool = '#source-map'
}

module.exports = config
