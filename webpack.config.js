const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.umd.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'DTUAppsmithRealtime',
            type: 'umd',
            umdNamedDefine: true
        },
        globalObject: 'this'
    },
    mode: 'production',
    target: ['web', 'es5'],
    externals: {
        'socket.io-client': {
            root: 'io',
            commonjs: 'socket.io-client',
            commonjs2: 'socket.io-client',
            amd: 'socket.io-client'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions', 'ie >= 11']
                                },
                                modules: false
                            }]
                        ]
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: true
    }
}; 