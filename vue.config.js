module.exports = {
  devServer: {
    open: true,
    proxy: {
      '/api': {
        // '/proxyApi'是代理标识，用于告诉node，url前面是/proxyApi的就是使用代理的
        target: 'http://localhost:8080', //目标地址，一般是指后台服务器地址
        changeOrigin: true, //是否跨域
        pathRewrite: {
          // pathRewrite 的作用是把实际Request Url中的'/proxyApi'用""代替
          '^/api': '/api'
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      // 解决路径
      alias: {
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        network: '@/network',
        views: '@/views'
      }
    }
  }
}
