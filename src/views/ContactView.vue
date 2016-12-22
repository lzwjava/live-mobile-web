<template>
  <div class="contact-view">

    <!-- <h2>遇到跨号支付的问题？请关注以下公众号，从公众号里报名</h2> -->

    <p>您好，我们会将每次的直播预告发送到公众号里，欢迎关注：<p>

    <img src="../img/qrcode_subscribe.jpg"/>

    <p>如果您有任何产品意见或使用上遇到 Bug，或想更多了解我们这个产品，或<b>想加入我们集结了各界程序大牛、投资人、优质用户的用户群</b>的话，可加趣直播创始人&21岁的小伙子的微信：</p>

    <img src="http://i.quzhiboapp.com/wechat_xin.png" alt="" />

    <p>最后可收看<a @click.prevent="goRelease">发布会</a>回播了解趣直播。</p>

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'ContactView',
  data() {
    return {
    }
  },
  methods: {
    goRelease()  {
      this.$router.go('/intro/7')
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/base.styl"

.contact-view
  background #fff
  padding 20px
  color rgb(112, 112, 112)
  img
    width 80%
  a
    color #2A9DBB

</style>
