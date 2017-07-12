<template>

  <div class="weibo-form" @click="stop">

    <p class="op-word">
      请复制以下链接 <br>到微信中发送给文件助手<br>接着点击链接打开
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

import util from '../common/util'

export default {
  name: 'WeiboForm',
  props: ['liveId'],
  components: {
  },
  methods: {
    stop (e) {
      e.stopPropagation()
    }
  },
  computed: {
    shareLink () {
      return util.shareLink(this.liveId)
    }
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
    font-size 18px
  .link
    font-size 16px
    margin-top 20px
  .small-tips
    margin-top 20px
    font-size 14px
    color #828282

</style>
