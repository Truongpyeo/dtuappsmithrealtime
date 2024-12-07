const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.umd.js',
        library: {
            name: 'DTUAppsmithRealtime',
            type: 'umd',
            export: 'default',
            umdNamedDefine: true
        },
        globalObject: 'this'
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