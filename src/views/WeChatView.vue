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
    debug('WeChatView created')

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
      var errorFn = (error) => {
        if (error && error.indexOf('invalid code') != -1) {
          debug('history back')
          window.history.back()
        } else {
          util.show(this, 'error', error)
        }
      }
      if (params.type == 'silentOauth') {
        this.$dispatch('loading', true)
        http.get(this, 'wechat/silentOauth', {code: code})
          .then((data) => {
            this.$dispatch('loading', false)
            var liveId = window.localStorage.getItem('liveId')
            window.location.href = '/#intro/' + liveId
            //this.$router.replace('/intro/' + liveId)
          }, errorFn)
      } else {
        this.$dispatch('loading', true)
        http.get(this, 'wechat/oauth', {code: code})
          .then((data) => {
            this.$dispatch('loading', false)
            var liveId = window.localStorage.getItem('liveId')
            this.$router.replace('/register?liveId=' + liveId +'&openId=' + data.openId)
          }, errorFn)
      }
    }
  }
}

</script>

<style lang="stylus">

</style>
