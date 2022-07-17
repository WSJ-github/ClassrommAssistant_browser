const path = require('path');
function resolve(dir){
    return path.join(__dirname,dir)
}
module.exports={
    chainWebpack:(config)=>{
        config.resolve.alias
          .set('@',resolve('./src'))
          .set('api',resolve('./src/api/api.js'))
          const oneOfsMap = config.module.rule('scss').oneOfs.store;
          oneOfsMap.forEach(item => {
            item
              .use('sass-resources-loader')
              .loader('sass-resources-loader')
              .options({
                // 全局变量资源路径
                resources: './src/styles/publicVariate.scss'
                // 也可以选择全局变量路径数组, 如果你有多个文件需要成为全局,就可以采用这种方法
                // resources: ['./path/to/vars.scss', './path/to/mixins.scss']
                // 或者你可以将多个scss文件@import到一个main.scss用第一种方法，都是可以的
              })
              .end()
          })
    }
}