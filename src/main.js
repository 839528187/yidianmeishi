import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

Vue.prototype.uploadUrl = 'http://api.cqjxw.net/upload'
Vue.prototype.entourageUrl = 'http://api.cqjxw.net/entourage/img'

// Vue.prototype.uploadUrl = 'http://localhost:9528/upload'
// Vue.prototype.entourageUrl = 'http://localhost:9528/entourage/img'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
