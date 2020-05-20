import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import TreeTable from 'vue-table-with-tree-grid'
// 引入全局样式
import './assets/css/global.css'

import './plugins/element.js'

import axios from 'axios'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios
//添加请求拦截器
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.component('tree-table', TreeTable)

//富文本编辑器的全局引入

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)


Vue.filter('dateFormat', function(originVal) {
const dt = new Date(originVal)
const y = dt.getFullYear()
//月份是从0开始的所以要加上1
const m = (dt.getMonth() + 1 + '').padStart(2, '0')
const d = (dt.getDate() + '').padStart(2, '0')

const hou = (dt.getHours() + '').padStart(2, '0')
const min = (dt.getMinutes() + '').padStart(2, '0')
const sec = (dt.getSeconds() + '').padStart(2, '0')

return `${y}-${m}-${d} ${hou}:${min}:${sec}`
})

Vue.config.productionTip = false
import './assets/fonts/iconfont.css'
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
