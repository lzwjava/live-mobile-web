<template>
  <div class="subscribe-form" @click="stop($event)">

    <div class="close-btn" @click="close">x</div>

    <h3 class="title">{{explainWord}}</h3>

    <img v-if="showPic" class="notify" alt="" src="../img/wechat_notify.jpg">

    <h3>请先长按关注公众号</h3>

    <img :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + this.ticket" alt="">

  </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import util from '../common/util'
import debugFn from 'debug'

const debug = debugFn('SubscribeForm')

export default {
  name: 'SubscribeForm',
  props: ['type', 'liveId'],
  data() {
    return {
      ticket: ''
    }
  },
  computed: {
    showPic() {
      if (this.type == 'live'){
        return true
      } else if(this.type == 'share') {
        return false
      }
    },
    explainWord () {
      if (this.type == 'live'){
        return '为了方便微信通知您'
      } else if(this.type == 'share') {
        return '为了给您推送邀请的收益通知'
      }
    }
  },
  created() {
  },
  ready() {
    util.loading(this)
    api.get(this, 'wechat/qrcode', {
      'type': this.type,
      'liveId': this.liveId
    }).then((data) => {
      util.loaded(this)
      this.ticket = encodeURIComponent(data.ticket)
    }, util.promiseErrorFn(this))
  },
  methods: {
    stop (e) {
      e.stopPropagation()
    },
    close() {
      this.$parent.overlay = false
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.subscribe-form
  @extend .base-form
  max-width 300px
  height 400px
  img
    margin-top 5px
    width 180px
  .title
    margin-top 15px
  .notify
    padding 10px
  .close-btn
    float right
    color #000
    margin-right 5px
    line-height 10px

</style>
