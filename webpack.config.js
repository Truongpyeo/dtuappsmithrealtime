const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.umd.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'umd',
            name: 'DTUAppsmithRealtime'
        },
        globalObject: 'this',
        chunkFormat: 'commonjs'
    },
    mode: 'production',
    target: 'node',
    externals: {
        'socket.io-client': 'socket.io-client'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            "buffer": false,
            "url": false
        }
    }
}; 