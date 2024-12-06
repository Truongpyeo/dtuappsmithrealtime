const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.umd.js',
        library: 'DTUAppsmithRealtime',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true
    },
    mode: 'production',
    optimization: {
        minimize: true
    }
} 