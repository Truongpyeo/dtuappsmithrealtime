const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.esm.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'module'
        },
        environment: {
            module: true
        }
    },
    experiments: {
        outputModule: true
    },
    mode: 'production',
    target: 'web',
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
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions']
                                },
                                modules: false
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