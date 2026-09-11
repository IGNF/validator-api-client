const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: (pathData) => pathData.chunk.name === 'main' ? 'validator-client.js' : '[name].validator-client.js',
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
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // Give the synchronous vendor bundle a stable name since it's referenced
                // by a hardcoded <script> tag in public/index.html. Async chunks (e.g. the
                // lazy-loaded swagger-ui-dist bundle) are left to webpack's default grouping.
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'initial',
                },
            },
        },
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }
};