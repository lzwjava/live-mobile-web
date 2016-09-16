<template>
  <div class="scan-view">

  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/http'
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
    wechat.configWeixin(this)
    wechat.scanQRcode(this)
    .then((data) => {
      util.show(this, 'success', '登录成功')
    }, util.promiseErrorFn(this))
  }
}

</script>

<style lang="stylus">

</style>
