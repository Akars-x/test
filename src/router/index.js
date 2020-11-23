import Vue from 'vue'
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Welcome from '../views/Welcome.vue';
import Users from '../views/Users.vue'


Vue.use(VueRouter)

// 路由规则
const routes = [{
        path: '/',
        //路由重定向
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/home',
        component: Home,
        // 路由重定向，可以让页面既显示home又显示welcome
        redirect: '/welcome',

        //其他页面都是在home页面下，用路由嵌套
        children: [{
                path: '/welcome',
                component: Welcome,
            },
            {
                path: '/users',
                component: Users
            }
        ]
    },
]
const router = new VueRouter({
    routes
})


// 路由守卫必须在路由实例上面写
//用户访问任何页面之前，我们一定要先做判断，再让用户跳转；这是用户路由权限的控制
// router.beforeEach()这个方法是vue-router官网提供的
//to表示去哪个路由，from表示从哪个路由出发,next是个函数，放行的意思
router.beforeEach((to, from, next) => {
    //对于全部页面要做一个校验，只有登录过后才能进入我们的主页，否则不让进
    //tokenStr如果有值，就代表登录过了，没有值代表没有登陆
    const tokenStr = window.localStorage.getItem('heima_token')

    // 跳'/login'（登录）页面无需校验，直接跳
    if (to.path === '/login') return next()

    //如果没有token值(没有登录过)，就让页面跳到登陆页面
    if (!tokenStr) return next('/login')

    // 箭头函数参数中如果不写next，函数里都不写next()就没问题，如果写了，下面就一定要写一个next(),相当于放行的意思，否则页面出不来
    //有token就允许通过
    next()
})

export default router