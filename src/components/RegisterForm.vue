<template >

  <div class="register-form">

    <p>请用微信扫描以下二维码，在微信上注册</p>

    <img :src="'api/qrcodes/one?text=' + shareLink" alt="" />

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'RegisterForm',
  props: ['liveId'],
  methods: {
  },
  components: {
  },
  created() {
  },
  ready() {
  },
  computed: {
    shareLink() {
      return 'http://m.quzhiboapp.com/?liveId=' + this.liveId
    }
  },
  methods: {
  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.register-form
  @extend .absolute-center
  max-width 350px
  height 400px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px
  p
    margin-top 20px
    font-size 18px
    font-weight bold
  img
    margin-top 30px
    width 300px
    height 300px

</style>
