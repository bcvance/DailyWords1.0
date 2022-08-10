const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry:
    './src/index.js',
    // background_packed: './background.js'
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
    ]
  },
  // resolve:{
  //   fallback: { "crypto": require.resolve("crypto-browserify") },
  //   fallback: { "stream": require.resolve("stream-browserify") },
  //   fallback: { "https": require.resolve("https-browserify") },
  //   fallback: { "os": require.resolve("os-browserify/browser") }
  // },
  // plugins: [
  //   new webpack.ProvidePlugin({process: 'process'})
  // ]
};


