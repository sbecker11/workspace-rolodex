const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[contenthash].js',
    publicPath: '/workspace-rolodex/',  // Update this to match your repository name
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',  // Ensure this path is correct
      inject: 'body',
      scriptLoading: 'defer'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'media', to: 'media' }  // Ensure this path is correct
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
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: true,  // Automatically open the browser
  },
};