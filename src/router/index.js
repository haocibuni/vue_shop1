import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home"

Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home},
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, form, next) => {
    if (to.path === '/login') return next()
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    // 如果 token 是空值，则返回login页面
    if (!tokenStr) return next('/login')
    next()

})
export default router
