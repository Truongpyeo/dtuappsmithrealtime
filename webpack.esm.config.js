const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.esm.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'module'
        }
    },
    mode: 'production',
    target: ['web', 'es2015'],
    experiments: {
        outputModule: true
    },
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
    optimization: {
        minimize: true
    }
}; 