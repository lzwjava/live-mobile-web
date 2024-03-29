<template>
  <div id="wrapper">
    <router-view
      class="view"
      transition
      transition-mode="out-in">
    </router-view>

    <toast type="loading" v-show="loading">加载中</toast>

    <toast v-show="toastShow">{{toastText}}</toast>

    <overlay :overlay.sync="overlayStatus">
      <component :is="currentView" :options="options" :live-id="liveId"></component>
    </overlay>

    <tip><tip>

  </div>
</template>

<script type="text/javascript">

import Nav from './nav.vue'
import {Toast} from 'vue-weui'
import Tip from '../components/tip.vue'
import wechat from '../common/wechat'
import LoginOptionsForm from '../components/LoginOptionsForm.vue'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import WeiboForm from '../components/WeiboForm.vue'
import Overlay from '../components/Overlay.vue'
import util from '../common/util'
import api from '../common/api'

const debug = require('debug')('nav')

export default {
  name: 'App',
  components: {
    'my-nav': Nav,
    'toast': Toast,
    'tip': Tip,
    'login-options-form': LoginOptionsForm,
    'overlay': Overlay,
    'login-form': LoginForm,
    'register-form': RegisterForm,
    'weibo-form': WeiboForm
  },
  data () {
    return {
      loading: false,
      toastShow: false,
      toastText: '',
      overlayStatus: false,
      currentView: 'login-options-form',
      liveId: 0,
      options: []
    }
  },
  methods: {
    loginOrRegister (liveId) {
        window.localStorage.setItem('liveId', liveId)
        window.localStorage.setItem('type', 'live')
        if (util.isWeixinBrowser()) {
          wechat.oauth2()
        } else {
          this.liveId = liveId
          if (util.isMobileBrowser()) {
            this.currentView = 'weibo-form'
            this.overlayStatus = true
          } else {
            this.options = ['登录', '注册']
            this.currentView = 'login-options-form'
            this.overlayStatus = true
          }
        }
    },
    hideFormAfterLoginSuccess () {
      this.overlayStatus = false
    }
  },
  events: {
    'show-msg': function (type, message) {
      this.$broadcast('show-tip-msg', type, message)
    },
    'loading': function(loading) {
      this.loading = loading
    },
    'toast': function (text, timeout, callback) {
      this.toastText = text
      this.toastShow = true
      if (!timeout) {
        timeout = 2000
      }
      debug('callback: %j', callback)
      setTimeout(() => {
        this.toastShow = false
        callback && callback()
      }, timeout)
    },
    'loginOrRegister': function (liveId) {
        this.loginOrRegister(liveId)
    },
    'hideLoginOptionsForm': function(type) {
        if (this.currentView == 'login-options-form') {
          if (type == 0) {
            setTimeout(() => {
                this.currentView = 'login-form'
                this.overlayStatus = true
            }, 600)
          } else if (type == 1) {
            setTimeout(() => {
                this.currentView = 'register-form'
                this.overlayStatus = true
            }, 600)
          }
        }
    },
    'updateCurUser': function () {
      debug('event updateCurUser')
      this.$broadcast('updateCurUser')
    },
    'saveLive': function(type, content) {
      debug('saveLiveDetail in app: %j', content)
      this.$broadcast('saveLive', type, content)
    },
    'hideForm': function () {
      this.hideFormAfterLoginSuccess()
    }
  }
}

</script>

<style lang="stylus">

@import '../stylus/variables.styl'
@import '../stylus/base.styl'
@import '../../node_modules/rupture/rupture/index.styl'

#wrapper
  position relative
  width 100%
  min-height 100%
  background-color #e7e7e7
  +above(700px)
    margin 0 auto
    max-width 700px

.view
  position absolute
  width 100%
  min-height 100%
  transition opacity .2s ease
  box-sizing border-box
  &.v-enter, &.v-leave
    opacity 0

</style>
