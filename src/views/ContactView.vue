<template>
  <div class="contact-view">
    <ListNav :mode="0" title="联系我们" />
    <div class="content">
      <div class="contact-section">
        <p>客服邮箱: support@quzhiboapp.com</p>
      </div>
      <div class="wechat-section">
        <p>微信公众号</p>
        <img src="/img/qrcode_subscribe.jpg" alt="公众号" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ListNav from '@/components/ListNav.vue'
</script>

<style lang="stylus">



.contact-view
  background #fff
  padding 20px
  color rgb(112, 112, 112)
  img
    width 80%
  a
    color #2A9DBB


</style>
