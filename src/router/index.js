//该文件专门用于创建整个应用的路由器
import Router from 'vue-router'
//引入组件
import Login from '../views/Login/index'
import Home from '../views/Home/index'
import Welcome from '../views/Welcome'
import Users from '../views/Users'
import Power from '../views/Power'
import Roles from '../views/Roles'

//创建并暴露一个路由器
const router =  new Router({
    routes:[
        //访问/路径重定向到login路径
        {
            path:'/', redirect:'/login'
        },
        {
        path:'/login',
        component:Login
        },
        {
            path:'/home',
            component: Home,
            //只要访问/home地址就让其重定向到/welcome组件
            redirect:'/welcome',
            children:[
                {
                    path:'/welcome',
                    component: Welcome
                },
                {
                    path:'/users',
                    component: Users
                },
                {
                    path:'/rights',
                    component: Power
                },
                {
                    path:'/roles',
                    component: Roles
                }
            ],
            
        }
]
})

//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
    //to将要访问的路径
    // from代表从哪个路径跳转而来
    // next是一个函数，表示放行
    // 1.next()  放行  2.next('/login')强制跳转到login
    if(to.path ==='/login') return next();//如果访问登录页直接放行
    //如果不是去login页面则需要获取token，利用window上的api获取token
     const tokenStr = window.sessionStorage.getItem('token')
     if(!tokenStr) return next('/login')//如果没有token 则调用next函数强制调回login
     next();

})
export default router