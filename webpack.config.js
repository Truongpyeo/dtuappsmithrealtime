const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/appsmith-socketio.js',
    output: {
        filename: 'appsmith-socketio.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'AppsmithSocket',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
}; 