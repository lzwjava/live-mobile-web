<template>
  <div class="login-form" @click="stop($event)">

    <div id="login_container">

    </div>

    <!-- <button class="btn btn-blue" @click="goSite">请前往我们的电脑网站打开</button> -->

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'

export default {
  name: 'LoginForm',
  components: {
  },
  created() {
  },
  ready() {
    this.initWechatLogin()
  },
  data() {
    return {
    }
  },
  methods: {
    stop (e){
      e.stopPropagation()
    },
    initWechatLogin() {
      var redirectUrl
      if (util.isDebug()) {
        redirectUrl = 'http://quzhiboapp.com/#wechat/webOauthTest'
      } else {
        redirectUrl = 'http://quzhiboapp.com/#wechat/webOauth'
      }
      var obj = new WxLogin({
        id:'login_container',
        appid: 'wxe80a6d2b5d54985c',
        scope: 'snsapi_login',
        redirect_uri: encodeURIComponent(redirectUrl),
        state: util.randomString(6),
        style: 'black'
      })
    },
    goSite() {
      window.location = 'http://quzhiboapp.com'
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.login-form
  @extend .absolute-center
  max-width 350px
  height 400px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px
  display flex
  align-items center
  justify-content center

</style>
