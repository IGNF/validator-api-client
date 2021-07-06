const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: ['@babel/polyfill','./demo/index.js'],
    output: {
        filename: 'demo.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        }]
    },
    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }
};