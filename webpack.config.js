const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: 'validator-client.js',
        chunkFilename: '[name].validator-client.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
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
        },
        {
            test: /\.md$/i,
            type: 'asset/source',
        }]
    },
    optimization: {
        // Single entry point (validator-client.js, including the webpack runtime and the synchronous
        // dependencies) so that integrations only need one <script> tag. Lazy-loaded chunks
        // (swagger-ui) get stable names from their webpackChunkName comment and are not split further.
        splitChunks: false,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }
};