var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./client/index.js",
  output: {
    path: path.resolve(__dirname, 'public/build'),
    filename: 'index.js'
  },
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
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    })
  ]
};
