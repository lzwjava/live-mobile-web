import Vue from 'vue'
import Router from 'vue-router'
import Ajax from 'vue-resource'

require('weui')

import App from './views/App.vue'
import HomeView from './views/HomeView.vue'
import LiveView from './views/LiveView.vue'
import IntroView from './views/IntroView.vue'
import UsersView from './views/UsersView.vue'
import WeChatView from './views/WeChatView.vue'
import ScanView from './views/ScanView.vue'
import ListView from './views/ListView.vue'
import ProfileView from './views/ProfileView.vue'
import ContactView from './views/ContactView.vue'
import MyListView from './views/MyListView.vue'
import RegAnchorView from './views/RegAnchorView.vue'
import AgreementView from './views/AgreementView.vue'
import BindPhoneView from './views/BindPhoneView.vue'
import AccountView from './views/AccountView.vue'
import InviteView from './views/InviteView.vue'
import EditUserView from './views/EditUserView.vue'
import RoomView from './views/RoomView.vue'
import EditLiveView from './views/EditLiveView.vue'
import EditDetailView from './views/EditDetailView.vue'
import CardView from './views/CardView.vue'
import LoginPhone from './views/LoginPhone.vue'
import RegisterPhone from './views/RegisterPhone.vue'

import filters from './common/filter'
import util from './common/util'
import wechat from './common/wechat'

const debug = require('debug')('main')

// install router
Vue.use(Router)

// Vue.use(iView)

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
  // 可以用
  localStorage.debug = '*'
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
  '/live/:liveId/card': {
    component: CardView
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
  },
  'reganchor': {
    // 申请成为主播
    component: RegAnchorView
  },
  'agreement': {
    component: AgreementView
  },
  'bindPhone': {
    component: BindPhoneView
  },
  'account' : {
    component: AccountView
  },
  'live/:liveId/invites': {
    component: InviteView
  },
  'editUser': {
    component: EditUserView
  },
  'room/:userId': {
    component: RoomView
  },
  'editLive/:liveId': {
    component: EditLiveView
  },
  'editDetail/:liveId/:type' : {
    component: EditDetailView
  },
    'LoginPhone':{
    component:LoginPhone
    },
    'RegisterPhone': {
      component: RegisterPhone
    }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
