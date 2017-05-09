var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './_build/js/main.js',
  output: { path: './assets/js/', filename: 'app.js' },
  externals: { // we'll load this stuff from a CDN and fallback to a local script file. not bundling so as to leverage the browser cache
    "react": "React",
    "react-dom":"ReactDOM",
    "redux":"Redux",
    "react-redux":"ReactRedux",
    "react-router":"ReactRouter"
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};
