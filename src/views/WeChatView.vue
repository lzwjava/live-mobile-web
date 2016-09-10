<template>
  <div>
  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/http'

var debug = require('debug')('WeChatView')

export default {
  name: 'WeChatView',
  components: {
  },
  data() {
    return {
      isDebug: true
    }
  },
  methods: {
  },
  computed: {

  },
  created() {
    var params = this.$route.params
    if (!params.type) {
      util.show(this, 'error', '路径错误')
      return
    }
    var type = params.type
    var hostname = window.location.hostname
    var isLoalhost = hostname  == 'localhost'

    if (this.isDebug && !isLoalhost) {
      var url = window.location.href
      var newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
      window.location = newUrl
    } else {
      var query = this.$route.query
      if (!query.code || !query.state) {
        util.show(this, 'error', '缺少参数')
        return
      }
      var code = query.code
      var state = query.state
      if (params.type == 'silentOauth') {
        http.get(this, 'wechat/silentOauth', {code: code})
          .then((data) => {
            var liveId = window.localStorage.getItem('liveId')
            this.$router.go('/intro/' + liveId)
          }, util.promiseErrorFn(this))
      } else {
        http.get(this, 'wechat/oauth', {code: code})
          .then((data) => {
            var liveId = window.localStorage.getItem('liveId')
            this.$router.go('/register?liveId=' + liveId +'&openId=' + data.openId)
          }, util.promiseErrorFn(this))
      }
    }
  }
}

</script>

<style lang="stylus">

</style>
