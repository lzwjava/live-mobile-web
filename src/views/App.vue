<template>
  <div id="wrapper">
    <my-nav></my-nav>

    <!-- main view -->
    <router-view
      class="view"
      keep-alive
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

var debug = require('debug')('nav')

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
  data() {
    return {
      loading: false,
      toastShow: false,
      toastText: '',
      overlayStatus: false,
      currentView: 'login-options-form',
      liveId: 0
    }
  },
  computed: {
    options() {
      return ['电脑登录', '电脑注册', '手机登录']
    }
  },
  created() {
  },
  methods: {
    loginOrRegister(liveId) {
        if (util.isWeixinBrowser()) {
          this.$router.go('/register/?liveId=' + liveId)
        } else {
          debug('showView')
          this.liveId = liveId
          this.currentView = 'login-options-form'
          this.overlayStatus = true
        }
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
            } else if (type == 2) {
                setTimeout(() => {
                    this.currentView = 'weibo-form'
                    this.overlayStatus = true
                }, 600)
            } else if (type == 1) {
                setTimeout(() => {
                    this.currentView = 'register-form'
                    this.overlayStatus = true
                }, 600)
            }
        }
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
  +above(800px)
    margin 0 auto
    max-width 600px

.view
  position absolute
  width 100%
  transition opacity .2s ease
  box-sizing border-box
  &.v-enter, &.v-leave
    opacity 0

</style>
