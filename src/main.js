import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control引入token校验相关(和权限也有关系)

// import {default as trademark} from './trademark'
// import trademark from '@/api/product/trademark'
// Vue.prototype.$API = trademark
// this.$API.addOrUpdate()
// 这样的方式，只能把trademark相关的API拿到
// 后期还有attr相关的API

import * as API from '@/api/product'
import CategorySelector from '@/components/CategorySelector'
import HintButton from '@/components/HintButton'

import '@/plugins/vcharts'
import {hasBtnPrmission} from '@/utils/permission'

Vue.component('CategorySelector', CategorySelector)
Vue.component('HintButton', HintButton)

Vue.prototype.$API = API
Vue.prototype.$hasBP = hasBtnPrmission // 把检测按钮的函数挂在原型上
// {
//   trademark,
//   attr
// }
// this.$API.trademark.addOrUpdata+


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
