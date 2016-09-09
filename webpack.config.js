var webpack = require('webpack')
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var srcPath = path.join(__dirname, 'src');

module.exports = {
  entry: {
    index:['./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'static/'),
    publicPath: '/static/',
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
    })
  ],
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true
}

var devConfig = ['index.html'];

function htmlConfig(type) {
  var filePath = '';
  // if (type == 'production') {
  //   filePath = '../';
  // }
  return devConfig.map(function(el, index) {
    return new HtmlWebpackPlugin({
      filename: filePath + el,
      template: 'src/' + el
    })
  });
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]).concat(htmlConfig('prod'))
} else {
  module.exports.plugins = (module.exports.plugins || []).concat(htmlConfig('dev'))
  module.exports.devtool = '#source-map'
}
