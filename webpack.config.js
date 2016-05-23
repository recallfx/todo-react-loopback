var webpack = require('webpack');
var fs = require('fs');
var env = process.env.WEBPACK_ENV;
var path = require('path');

var fileSuffix = env === 'build' ? '.min.js' : '.js';
var appName = 'app';

console.log(env);

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var clientConfig = {
  entry: './client/src/modules/'+appName+'.client.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/client/lib',
    filename: appName + '.client' + fileSuffix,
    publicPath: __dirname + '/client/www'
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties']
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: path.resolve('./client/src'),
    extensions: ['', '.js', '.jsx']
  },
  plugins: []
};

var serverConfig = {
  entry: './client/src/modules/'+appName+'.server.js',
  target: 'node',
  devtool: 'source-map',
  output: {
    path: __dirname + '/client/lib',
    filename: appName + '.server' + fileSuffix,
    libraryTarget: 'commonjs2',
    publicPath: __dirname + '/client/www'
  },
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties']
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.json?$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    root: path.resolve('./client/src'),
    extensions: ['', '.js', '.jsx']
  },
  plugins: []
};

if (env === 'build') {
  clientConfig.plugins = [
    new webpack.DefinePlugin({ "process.env": { NODE_ENV: JSON.stringify("production") }}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true, mangle:true})
  ];

  serverConfig.plugins = [
    new webpack.DefinePlugin({ "process.env": { NODE_ENV: JSON.stringify("production") }}),
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true, mangle:true})
  ];
}
else {
  serverConfig.plugins = [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false })
  ];
}

var config = [clientConfig,serverConfig];

module.exports = config;
