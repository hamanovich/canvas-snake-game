const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    port: 4040,
  },
  devtool: 'inline-source-map',
});
