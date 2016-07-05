/*eslint-disable no-var*/

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AureliaWebpackPlugin = require('aurelia-webpack-plugin');
var pkg = require('./package.json');
var webpack = require('webpack');

var outputFileTemplateSuffix = '-' + pkg.version;

module.exports = {
  entry: {
    main: [
      './src/main'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]' + outputFileTemplateSuffix + '.js',
    chunkFilename: 'chunk-[id]' + outputFileTemplateSuffix + '.js'
  },
  plugins: [
    new AureliaWebpackPlugin({
      includeSubModules: [
                { moduleId: 'aurelia-router-loader'},
                { moduleId: 'aurelia-validation'},
                { moduleId: 'aurelia-dialog'},
                { moduleId: 'aurelia-auth'}
            ]
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
    new HtmlWebpackPlugin({
      title: 'Aurelia webpack skeleton - ' + pkg.version,
      template: 'index.prod.html',
      filename: 'index.html'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|de/)
  ],
  resolve: {
    root: [
      path.resolve('./')
    ],
    alias : {
        "signalr" : "../framework/js/jquery.signalr-2.2.0.js",
        "oidc" : "../framework/js/oidc.js",
        "jquery-slimscroll" : "../framework/js/jquery.slimscroll.js"
    },
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
       { test: /\.ts$/, loader: 'awesome-typescript-loader' },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.css?$/, loader: 'style!css' },
        { test: /\.html$/, loader: 'raw' },
        { test: /\.glsl$/, loader: 'raw' },
        { test: /\.(png|gif|jpg)$/, loader: 'url-loader?limit=8192' },
        { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff2' },
        { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
        { test: /\.(ttf|eot|svg|otf|md)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
        { test: /\.less$/,  loader: "style!css!less"   },
        { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" }
    ]
  }
};
