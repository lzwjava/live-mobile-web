import Vue from 'vue'
import Router from 'vue-router'
import Ajax from 'vue-resource'

require('weui')

import App from './views/App.vue'
import HomeView from './views/HomeView.vue'
import LiveView from './views/LiveView.vue'
import IntroView from './views/IntroView.vue'
import UsersView from './views/UsersView.vue'

import filters from './common/filter'
import util from './common/util'

const debug = require('debug')('main')

// install router
Vue.use(Router)

// register filters globally
for(let  k in filters){
    Vue.filter(k, filters[k])
}

// http
Vue.config.debug = true;
Vue.use(Ajax);
Vue.http.options.root = '/api';
Vue.http.options.emulateJSON = true;
Vue.http.options.timeout = 1000 * 10;

debug('env ' + process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  localStorage.debug = ''
} else {
  localStorage.debug = 'HomeView,markdown-area,nav,util,wechat,filter,LiveView,register-form,loading,IntroView,' +
    'UsersView,main,http';
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
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
