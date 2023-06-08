const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '/',
  outputDir: 'dist',
  configureWebpack: {
    externals: {}
  }
})
module.exports = {
  devServer: {
    port: 80,
    host: 'localhost',
    open: true,
    https: false,
    proxy: {
      '/api': {
        pathRewrite: {//必须在rarget之前，否则不生效
          '^/api': ''
        },
        // target: 'http://123.57.240.139:8080/onlinews',
        target: 'http://152.136.27.47:8080/onlinews',
        //target: 'http://localhost:8080/onlinews',
        changeOrigin: true,
        ws: false
      }
    }
  }
}
