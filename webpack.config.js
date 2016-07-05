/*eslint-disable no-var*/

var path = require('path');
var AureliaWebpackPlugin = require('aurelia-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['', '.js', '.ts'],
        alias : {
            "signalr" : "../framework/js/jquery.signalr-2.2.0.js",
            "oidc" : "../framework/js/oidc.js",
            "jquery-slimscroll" : "../framework/js/jquery.slimscroll.js"
        }
    },
    devServer: {
        host: 'localhost',
        port: 3000
    },
    entry: {
        main: [
            './src/main'
        ]
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: "/"
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
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|de/)
    ],
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
