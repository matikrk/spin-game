const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

// TODO not working, need add this in package.json in build script
const isProductionBuild = process.argv.indexOf('--production') !== -1;

const webpack = require('webpack');

const plugins = [
  new ExtractTextPlugin("style.css"),
];

const output = {
  filename: 'main.js',
  publicPath: 'res/',
  path : path.resolve(__dirname, 'build/res'),
};

if (isProductionBuild) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  );
}

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   exclude: /(node_modules|bower_components|build)/,
      //   loader: 'eslint-loader',
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'less-loader'],
          fallback: 'style-loader'
        })
      }
    ],
  },
  devServer: {
    inline: true,
  },
  devtool: isProductionBuild ? false : 'cheap-module-source-map',
  output,
  plugins,
};
