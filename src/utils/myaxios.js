import Axios from 'axios';

// axios的代码书写，是放在Vue的原型对象上面，这样每个组件的this都可以访问
Axios.defaults.baseURL = 'http://m.leijiuling.com/api/private/v1/';
// 在这个组件里面， 给Vue的原型对象绑定的任何属性或者方法，都可以在任何组件 的 this中得到
// Axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('heima_token');
// 有些请求，是不需要权限校验的，比如登录，注册，获取验证码等等 --- 路由白名单
const whiteList = ['/login', '/registry', '/check', '/aboutsss'];

// 请求拦截器： 在所有请求发出去之前，会拦截你，进行一些处理了以后，在发给服务器
Axios.interceptors.request.use(
    function(config) {
        // console.log('所有请求发出去之前执行：', config);
        // if(config.url !== '/login'){
        //   config.headers.Authorization = window.localStorage.getItem('heima_token');
        // }
        if (!whiteList.includes(config.url)) {
            config.headers.Authorization = window.localStorage.getItem('heima_token');
        }
        // 必须有return  不然请求发不出去
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);
// 响应拦截器： 所有请求返回给你页面发请求的位置之前，先经过响应拦截器处理一下数据结构，在发给当前的位置
Axios.interceptors.response.use(
    function(response) {
        // console.log('在返回给前端之前，先走这里，在打印对应页面的数据');
        return response;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// 导出
export default Axios;