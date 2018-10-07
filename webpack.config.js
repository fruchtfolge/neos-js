const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')

const version = require('./package.json').version

const banner = 'neos.js\n' +
             'https://neos-server.org/\n' +
             'Version: ' + version + '\n\n' +
             'Copyright 2018 Christoph Pahmeyer\n' +
             'Released under the MIT license\n' +
             'https://github.com/fruchtfolge/neos-js/blob/master/LICENSE.md'

const config = {
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
      }
    }]
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ]
}

const dist = Object.assign({}, config, {
  entry: {
    'neos': './index.js',
    'neos.min': './index.js'
  },
  output: {
    path: './dist',
    filename: '[name].js',
    libraryTarget: 'var'
  }
})

const assets = Object.assign({}, config, {
  entry: {
    'neos': './index.js',
    'neos.min': './index.js'
  },
  output: {
    path: './docs/assets',
    filename: '[name].js',
    libraryTarget: 'var'
  }
})

module.exports = [
  dist, assets
]
