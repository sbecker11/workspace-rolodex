const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[contenthash].js',
    publicPath: '/workspace-rolodex/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',  // Changed from './src/index.html' to './index.html'
      inject: 'body',
      scriptLoading: 'defer'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'favicon.ico', to: 'favicon.ico' }
      ],
    }),
  ],
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
  }
};