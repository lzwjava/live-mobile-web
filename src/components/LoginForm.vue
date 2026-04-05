<template>
  <div class="login-form" @click.stop>
    <div id="login_container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { isDebug, randomString } from '@/common/util'

onMounted(() => {
  initWechatLogin()
})

const initWechatLogin = () => {
  let redirectUrl
  if (isDebug()) {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/webOauthTest'
  } else {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/webOauth'
  }
  
  if (typeof WxLogin !== 'undefined') {
    new WxLogin({
      id: 'login_container',
      appid: 'wxe80a6d2b5d54985c',
      scope: 'snsapi_login',
      redirect_uri: encodeURIComponent(redirectUrl),
      state: randomString(6),
      style: 'black'
    })
  }
}
</script>

<style lang="stylus">



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
