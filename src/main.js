import Vue from 'vue'
import App from './App.vue'
// 路由
import router from './router'
// Vuex
import store from './store'

// 是否启用PWA
import './sw/registerServiceWorker'
// 注册自定义插件
import './plugins'
// 调用共通js
import './common'
// 共通filters
import * as filters from './filters'
// 全局css
import '@/styles/index.scss'
import 'animate.css'

Object.entries(filters).forEach(([key, value]) => {
  Vue.filter(key, value)
})

// 阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
// 开发时是否使用数据库中的菜单，修改后需要重新登陆
if (process.env.NODE_ENV !== 'production') {
  sessionStorage.MenusFromDB = false
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
