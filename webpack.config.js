const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js",
    library: "$",
    libraryTarget: "umd",
  },
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),  // Use 'static' instead of 'contentBase'
    },
    compress: true,
    port: 9000,
    open: true  // This will open the browser automatically
  },
  plugins: [
      new HtmlWebpackPlugin({
          template: './index.html'  // This will use your index.html as the template
      })
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
}
