<template>
  <div class="subscribe-form">

    <div class="close-btn" @click="close">x</div>

    <h3>为了方便微信通知您</h3>

    <img class="notify" src="../img/wechat_notify.jpg" alt="">

    <h3>请关注服务号</h3>

    <img src="../img/qrcode_tech.jpg" alt="">

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'SubscribeForm',
  data() {
    return {
    }
  },
  created() {
  },
  ready() {
  },
  methods: {
    close() {
      this.$parent.overlay = false;
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.subscribe-form
  @extend .base-form
  img
    margin-top 5px
    width 180px
  .notify
    padding 10px
  .close-btn
    float right
    color #000
    margin-right 5px
    margin-top 5px
    line-height 10px

</style>
