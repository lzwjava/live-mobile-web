<template>

  <div class="scan-view">

    <img src="../img/computer.png" alt="computer" />

    <h4>请在电脑上打开 quzhiboapp.com <br>
      然后用微信扫一扫登录<br>
      跟以往的方式有所不同 <br>
      <!-- <span v-show="type == 0">点击按钮登录</span>
      <span v-show="type == 1">点击按钮在电脑上收看直播</span> -->
    </h4>

    <!-- <button class="btn btn-blue" @click="loginWeChat">对准电脑屏幕扫描</button> -->

    <p class="gray">暂不支持 IE 10 以下的浏览器</p>

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'

var debug = require('debug')('ScanView')

export default {
  name: 'ScanView',
  components: {
  },
  data() {
    return {
      type:0,
      liveId: 0
    }
  },
  methods: {
  },
  created() {
  },
  route: {
    data({to}) {
      var query = this.$route.query
      if (query.liveId) {
        this.type = 1
        this.liveId = query.liveId
      }
    }
  },
  methods: {
    loginWeChat () {
        wechat.configWeixin(this)
        if (this.type == 0) {
          wechat.scanQRcode(this)
          .then((data) => {
            util.show(this, 'success', '登录成功')
          }, util.promiseErrorFn(this))
        } else if (this.type == 1) {
          wechat.scanQRcodeWithLive(this, this.liveId)
          .then((data) => {
            util.show(this, 'success', '扫描成功')
          }, util.promiseErrorFn(this))
        }
    }
  }
}

</script>

<style lang="stylus">

.scan-view
  text-align center
  img
    margin-top 30px
  h4
    margin-top 10px
  button
    margin-top 30px
  p.gray
    color #8C9CA3
    margin-top 60px
    font-size 14px

</style>
