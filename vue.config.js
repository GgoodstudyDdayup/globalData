module.exports = {
  publicPath: "./",
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  devServer: {
    // 设置代理
    proxy: {
      '/api': {
        target: 'http://bigdata.yidianedu.com', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
