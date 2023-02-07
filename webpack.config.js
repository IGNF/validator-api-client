const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: ['@babel/polyfill','./src/index.js'],
    output: {
        filename: 'validator-client.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.md$/i,
            use: ['raw-loader'],
        }]
    },
    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }
};