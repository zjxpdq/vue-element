const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 9522,
    open: true,
    disableHostCheck: true
    /*proxy: {
      '/oa': {
        target: 'http://lapi.taotonggroup.com',
        changeOrigin: true,
        pathRewrite: {
          '^/oa': '/oa'
        }
      }
    }*/
  },
  configureWebpack: {
    name: 'vue-element',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
