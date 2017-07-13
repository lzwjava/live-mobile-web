import Vue from 'vue'
import App from './App'
import router from './router'
import Ajax from 'vue-resource'

require('weui')

Vue.config.productionTip = false

import filters from './common/filter'

const debug = require('debug')('main')

for (let k in filters) {
  Vue.filter(k, filters[k])
}

Vue.use(Ajax)
Vue.http.options.root = '/api'
Vue.http.options.emulateJSON = true
Vue.http.options.timeout = 1000 * 20

debug('env ' + process.env.NODE_ENV)
router.beforeEach(function () {
  window.scrollTo(0, 0)
})

if (process.env.NODE_ENV === 'production') {
  localStorage.debug = ''
} else {
  localStorage.debug = `HomeView,markdown-area,nav,util,wechat,filter,LiveView,loading,IntroView,UsersView,main,http,WeChatView,api,LiveList,ListNav,overlay,QrcodePayForm,RegisterForm,RewardForm,markdown,LiveItem,RecommendLiveList,LoadMoreBar,StaffView,SubscribeForm,RegAnchorView,AccountView,InviteView,InputTextForm,EditUserView,RoomView,EditLiveView,EditDetailView`
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
