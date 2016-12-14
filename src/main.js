import Vue from 'vue'
import Router from 'vue-router'
import Ajax from 'vue-resource'

require('weui')

import App from './views/App.vue'
import HomeView from './views/HomeView.vue'
import LiveView from './views/LiveView.vue'
import IntroView from './views/IntroView.vue'
import UsersView from './views/UsersView.vue'
import RegisterView from './views/RegisterView.vue'
import WeChatView from './views/WeChatView.vue'
import ScanView from './views/ScanView.vue'
import ListView from './views/ListView.vue'
import ProfileView from './views/ProfileView.vue'
import ContactView from './views/ContactView.vue'
import MyListView from './views/MyListView.vue'

import filters from './common/filter'
import util from './common/util'
import wechat from './common/wechat'

const debug = require('debug')('main')

// install router
Vue.use(Router)

// register filters globally
for(let  k in filters) {
    Vue.filter(k, filters[k])
}

// http
Vue.config.debug = true;
Vue.use(Ajax);
Vue.http.options.root = '/api';
Vue.http.options.emulateJSON = true;
Vue.http.options.timeout = 1000 * 20;

debug('env ' + process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  localStorage.debug = ''
} else {
  localStorage.debug = 'HomeView,markdown-area,nav,util,wechat,filter,LiveView,register-form,loading,IntroView,' +
    'UsersView,main,http,RegisterView,WeChatView,api,LiveList,ListNav,overlay,QrcodePayForm,RegisterForm,RewardForm,markdown,' +
    'LiveItem,RecommendLiveList';
}

// routing
var router = new Router()

router.map({
  '/': {
    component: HomeView
  },
  '/intro/:liveId': {
    component: IntroView
  },
  '/live/:liveId': {
    component: LiveView
  },
  '/live/:liveId/users': {
    component: UsersView
  },
  '/register': {
    component: RegisterView
  },
  'wechat/:type': {
    component: WeChatView
  },
  'scan': {
    component: ScanView
  },
  'lives': {
    component: ListView
  },
  'profile': {
    component: ProfileView
  },
  'contact': {
    component: ContactView
  },
  'mylist': {
    component: MyListView
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
