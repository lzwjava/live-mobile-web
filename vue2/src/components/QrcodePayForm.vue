<template>
  <div class="qrcode-pay-form" @click="stop($event)">
    <p class="pay-title">
      <svg width="24" height="24" fill="currentColor" class="QRCodePaymentModal-icon-1oS6"
           viewBox="0 0 24 24"><title>wechat_pay</title><path d="M8.68 14.624c-.107.056-.23.088-.358.088-.298 0-.557-.168-.694-.416l-.05-.118-2.174-4.875c-.024-.053-.038-.113-.038-.172 0-.223.178-.406.398-.406.09 0 .17.03.238.08l2.563 1.868c.188.126.41.2.652.2.144 0 .28-.028.408-.076l12.057-5.488C19.522 2.703 15.962 1 11.934 1 5.344 1 0 5.554 0 11.172c0 3.065 1.608 5.824 4.123 7.688.202.148.335.39.335.663 0 .09-.02.173-.042.26l-.538 2.05c-.025.097-.064.198-.064.3 0 .223.178.405.398.405.086 0 .156-.033.23-.076l2.612-1.542c.197-.116.404-.188.634-.188.122 0 .24.02.35.054 1.22.358 2.534.558 3.896.558 6.59 0 11.934-4.554 11.934-10.172 0-1.702-.493-3.304-1.36-4.714L8.77 14.573l-.087.05z" fill="#00C800" fill-rule="evenodd"></path></svg>
      请用微信长按或扫码支付
    </p>
    <img :src="'api/qrcodes/one?text=' + qrcodeUrl" alt="" />
    <button class="btn btn-gray-2" @click="payFinish">支付完成</button>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'QrcodePayForm',
  props: ['qrcodeUrl'],
  components: [],
  methods: {
    stop (e) {
      e.stopPropagation()
    },
    payFinish () {
      this.$parent.overlay = false
      this.$dispatch('payFinish')
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.qrcode-pay-form
  @extend .base-form
  .pay-title
    font-size 18px
    font-weight 500
    margin-top 10px
    svg
      margin-right 8px
      vertical-align -6px
   img
     margin-top 10px
     width 300px
     height 300px
   button
    width 200px
    margin-top 10px
    border-radius 5px

</style>
