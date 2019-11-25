const webpack = require('webpack')
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

module.exports = {
    entry: {
        vendor: [
            'babel-polyfill',
            'history',
            'md5',
            'nprogress',
            'query-string',
            'react',
            'react-dom',
            'react-router-dom',
            'whatwg-fetch'
        ]
    },
    mode  : 'production',
    output: {
        path     : path.resolve(__dirname, '../dll'),
        filename : '[name].dll.[hash:5].js',
        library  : '[name]_library'
    },
    performance: {
        hints: false
    },
    plugins: [
        new ProgressBarPlugin(),
        new webpack.DllPlugin({
            name    : '[name]_library',
            path    : path.resolve(__dirname, '../dll', 'manifest.json'),
            context : __dirname
        })
    ]
};
