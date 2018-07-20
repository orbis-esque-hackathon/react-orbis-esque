const webpack = require('webpack');

module.exports = {
  entry: {
    'app': './src/App.jsx'
  },
  output: {
    path: __dirname + '/dist',
    filename: "[name].js"
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-class-properties'],
        env: {
          development: {
            presets: ['react-hmre']
          },
          production: {
            presets: ['react']
          }
        }
      }
    },{
      test: /\.scss$/,
      loaders: ["style-loader", "css-loader", "sass-loader"]
    }]
  },
  watchOptions: {
    poll: 1000
  },
  devServer: {
    historyApiFallback: {
      index: '/'
    }
  }
};
