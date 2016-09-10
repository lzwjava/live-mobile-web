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

    <tip><tip>
  </div>
</template>

<script type="text/javascript">

import Nav from './nav.vue'
import {Toast} from 'vue-weui'
import Tip from '../components/tip.vue'

var debug = require('debug')('nav')

export default {
  name: 'App',
  components: {
    'my-nav': Nav,
    'toast': Toast,
    'tip': Tip
  },
  data() {
    return {
      loading: false,
      toastShow: false,
      toastText: ''
    }
  },
  events: {
    'show-msg': function (type, message) {
      this.$broadcast('show-tip-msg', type, message)
    },
    'setLoading': function(loading) {
      this.loading = loading
    },
    'toast': function (text, timeout, callback) {
      this.toastText = text
      this.toastShow = true
      if (!timeout) {
        timeout = 1000
      }
      debug('callback: %j', callback)
      setTimeout(() => {
        this.toastShow = false
        callback && callback()
      }, timeout)
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/variables.styl"
@import "../stylus/base.styl"

#wrapper
  position relative
  width 100%
  min-height 100%

.view
  position absolute
  width 100%
  transition opacity .2s ease
  box-sizing border-box
  &.v-enter, &.v-leave
    opacity 0

</style>
