import Vue from 'vue'
import vueRouter from 'vue-router'
Vue.use(vueRouter)
import Login from './components/Login.vue'
import Home from './components/Home.vue'
const router = new vueRouter({ 
  mode: 'history',
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home}
  ]
})

router.beforeEach((to, from, next) => {
  //如果访问的是'/login'地址就直接放行
if(to.path === '/login') return next()
//如果访问的不是，就需要携带token，那就token是否存在
const token = window.sessionStorage.getItem('token')
if(!token) return next('/login')
next()
})
export default router