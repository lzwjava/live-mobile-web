<template>

  <div class="scan-view">

    <img src="../img/computer.png" alt="computer" />

    <h4>请在电脑上打开 quzhiboapp.com <br>然后点击下面按钮登录</h4>

    <button class="btn btn-blue" @click="loginWeChat">对准电脑屏幕扫描</button>


    <p class="gray">暂不支持 IE 10 以下的浏览器</p>

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from 'api'
import wechat from '../common/wechat'

var debug = require('debug')('ScanView')

export default {
  name: 'ScanView',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {

  },
  created() {
    document.title = '趣直播-创建直播'
  },
  methods: {
    loginWeChat () {
        wechat.configWeixin(this)
        wechat.scanQRcode(this)
        .then((data) => {
          util.show(this, 'success', '登录成功')
        }, util.promiseErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

.scan-view
  text-align center
  img
    margin-top 60px
  h4
    margin-top 10px
  button
    margin-top 30px
  p.gray
    color #8C9CA3
    margin-top 60px
    font-size 12px

</style>
