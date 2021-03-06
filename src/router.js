import Vue from 'vue'
import vueRouter from 'vue-router'
Vue.use(vueRouter)
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/user.vue'
import Rights from './components/power/rights.vue'
import Roles from './components/power/roles.vue'
import Categories from './components/goods/Categories.vue'
import Params from './components/goods/Params.vue'
import List from './components/goods/List.vue'
import addGoods from './components/goods/addGoods.vue'
import Order from './components/order/order.vue'
import Report from './components/report/report.vue'
const router = new vueRouter({ 
  mode: 'history',
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home,
    children:[
      {path: '/home', redirect: '/welcome'},
      {path: '/welcome',component: Welcome},
      {path: '/users',component: User},
      {path: '/users',component: User},
      {path: '/roles',component: Roles},
      {path: '/rights',component: Rights},
      {path: '/categories',component: Categories},
      {path: '/params',component: Params},
      {path: '/goods',component: List},
      {path: '/addGoods',component: addGoods},
      {path: '/orders',component: Order},
      {path: '/reports',component: Report},
    ]
  }
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