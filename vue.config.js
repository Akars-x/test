// 这个是vue读取的配置文件， 里面的配置最终都是给webpack写的配置；但是我们现在采用的是3.0+ 的脚手架， 讲究是零配置，所以看不见webpack的配置文件webpack.config.js
// 这里写的代码，因为是给webpack使用，所以需要采用commonJS的规范 （本质上就是使用 require 和 module.exports这两个命令而已）
// 但是以后我们在项目里面 也就是src文件夹； 还是使用的ES6规范 (本质上就是 import 和 export 这两个单词的使用)
// 下面的配置 可以不写； 这个文件的作用，后面再公司里面 可以配置 代理跨域 proxy
module.exports = {
    devServer: {
        open: true,
        //port:5000
    }
}