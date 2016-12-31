<template>
  <div class="subscribe-form" @click="stop($event)">

    <div class="close-btn" @click="close">x</div>

    <h3 v-bind:class="{'packet-margin': this.type == 'packet'}">{{explainWord}}</h3>

    <img v-if="this.type != 'packet'" class="notify" alt="" src="../img/wechat_notify.jpg">

    <h3>请关注公众号</h3>

    <img  :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + this.ticket" alt="">

  </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import util from '../common/util'
import debugFn from 'debug'

const debug = debugFn('SubscribeForm')

export default {
  name: 'SubscribeForm',
  props: ['type', 'liveId', 'packetId'],
  data() {
    return {
      ticket: ''
    }
  },
  computed: {
    explainWord () {
      if (this.type == 'packet') {
        return '为了让公众号给您发送红包'
      } else {
        return '为了方便微信通知您'
      }
    }
  },
  created() {
  },
  ready() {
    util.loading(this)
    api.get(this, 'wechat/qrcode', {
      'type': this.type,
      'liveId': this.liveId,
      'packetId': this.packetId
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
  img
    margin-top 5px
    width 180px
  .notify
    padding 10px
  .packet-margin
    margin-top 50px
  .close-btn
    float right
    color #000
    margin-right 5px
    margin-top 5px
    line-height 10px

</style>
