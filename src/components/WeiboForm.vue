<template>

  <div class="weibo-form">

    <p class="op-word">
      请将以下链接复制到微信里 <br>然后在微信打开
    </p>

    <p class="link">
      {{shareLink}}
    </p>

    <p class="small-tips">
      抱歉，产品还在早期阶段，体验略差
    </p>

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'WeiboForm',
  props: ['liveId'],
  components: {
  },
  methods: {
  },
  computed: {
    shareLink() {
      return 'http://m.quzhiboapp.com/?liveId=' + this.liveId
    }
  },
  data() {
    return {
    }
  },
  created() {
  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.weibo-form
  @extend .absolute-center
  max-width 350px
  height 200px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px
  .op-word
    font-size 20px
  .link
    line-height 90px
    font-size 18px
  .small-tips
    font-size 14px
    color #828282

</style>
