var path = require('path');
var webpack = require('webpack');
var ENV = process.env.ENV

module.exports = {
  entry: "./client/index.js",
  output: {
    path: path.resolve(__dirname, 'public/build'),
    filename: 'index.js'
  },
  watch: true,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react"]
        }
      }
    ]
  }
};
