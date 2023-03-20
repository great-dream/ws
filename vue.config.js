const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    port: 8080,
    host: 'localhost',
    open: true,
    https: false,
    proxy: {
      '/api': {
        pathRewrite: {//必须在rarget之前，否则不生效
          '^/api': ''
        },
        //target: 'http://123.57.240.139:80/onlinews',
        target: 'http://localhost:8081/onlinews',
        changeOrigin: true,
        ws: false
      }
    }
  }
}
