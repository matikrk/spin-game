const path = require('path');

// TODO not working, need add this in package.json in build script
const isProductionBuild = process.argv.indexOf('--production') !== -1;

const webpack = require('webpack');

const plugins = [];
const output = {
  filename: 'main.js',
  publicPath: 'build/',
  path: path.resolve(__dirname, 'build'),
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
    loaders: [
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
        loader: 'raw!postcss!less',
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
