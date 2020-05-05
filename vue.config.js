var path = require('path')
var HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')

function resolve(name) {
  return path.join(__dirname, name)
}

// TODO: not work
module.exports = {
  publicPath: './',

  chainWebpack: config => {
    config
    // Interact with entry points
      .entry('minimax')
      .add(resolve('src/minimax/messager.js'))
      .end()
      .entry('greedy')
      .add(resolve('src/greedy/messager.js'))
      .end()
    // Modify output settings
      .output
      .path(resolve('dist'))
      .filename('[name].bundle.js')
      .globalObject('this') //https://github.com/webpack/webpack/issues/6642

    config.devtool(false)

    // exclude Minimax.js
    config
      .plugin('html')
      .tap(args => {
        args[0].excludeAssets = [/minimax.*.js/]
        return args
      })

    config.plugin('assets')
      .use(HtmlWebpackExcludeAssetsPlugin)

    config.optimization
      .splitChunks(false) // will cause webworker not work if enable this
  }
}