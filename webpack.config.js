const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.umd.js',
        library: {
            name: 'DTUAppsmithRealtime',
            type: 'umd',
            export: 'default'
        },
        globalObject: 'this'
    },
    mode: 'production',
    optimization: {
        minimize: true
    }
} 