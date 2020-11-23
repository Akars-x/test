//入口文件，所有vue项目第一个查看的文件

import Vue from 'vue'

// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//根组件
import App from './App.vue'

import router from './router'
import './assets/css/global.less'
import './assets/fonts/iconfont.css'

import myaxios from './utils/myaxios'

Vue.use(ElementUI);
Vue.config.productionTip = false


//把Axios挂载到Vue的原型对象的$http上面，这样每个Vue的实例化对象都可以使用Axios
//$http是个属性名，可以取其他名字，一般写这个
Vue.prototype.$http = myaxios;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')