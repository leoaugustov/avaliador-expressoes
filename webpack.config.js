const modoDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');

module.exports = {
    mode: modoDev ? 'development' : 'production',
    entry: './src/index.js',
    output: {
        filename: 'script.js',
        path: __dirname + '/build'
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
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
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    devServer: {
        contentBase: __dirname + '/build',
        watchContentBase: true,
        compress: true,
        port: 9000
    }
}