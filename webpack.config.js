const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.umd.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'umd',
            name: 'DTUAppsmithRealtime'
        },
        globalObject: 'this'
    },
    mode: 'production',
    target: 'web',
    externals: {
        'socket.io-client': {
            root: 'io',
            amd: 'socket.io-client',
            commonjs: 'socket.io-client',
            commonjs2: 'socket.io-client'
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
                                    browsers: ['last 2 versions']
                                }
                            }]
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            "buffer": false,
            "url": false,
            "stream": false,
            "crypto": false
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    },
                    compress: {
                        drop_console: true
                    }
                },
                extractComments: false
            })
        ],
        usedExports: true,
        sideEffects: true
    }
}; 