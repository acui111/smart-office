const path = require('path')




function resolve (dir) {
  return path.join(__dirname,  dir)
}




module.exports = {
  // 运行时包含编译器的版本
  runtimeCompiler: true,

  // 关闭ESLint编译
  lintOnSave: false,

  configureWebpack : {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        'components': resolve('src/components'),
      }
    },
  },
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://10.144.176.172:8080',
        ws: true,
        changeOrigin: true
      },
    }
  }
}
