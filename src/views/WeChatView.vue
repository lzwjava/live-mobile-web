<template>
  <div>
  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'

var debug = require('debug')('WeChatView')

export default {
  name: 'WeChatView',
  components: {
  },
  data() {
    return {
      isDebug: false
    }
  },
  methods: {
  },
  computed: {
  },
  created() {
  },
  route: {
    data({to}) {
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
              if (liveId) {
                this.$router.replace('/intro/' + liveId)
              } else {
                this.$router.replace('/lives')
              }
            }, errorFn)
        } else if (params.type == 'oauth') {
          this.$dispatch('loading', true)
          http.get(this, 'wechat/oauth', {code: code})
            .then((data) => {
              this.$dispatch('loading', false)
              this.$router.replace('/register/?openId=' + data.openId)
            }, errorFn)
        } else if (params.type == 'oauthTest') {
          var url = window.location.href
          var newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
          newUrl = newUrl.replace('oauthTest', 'oauth')
          window.location = newUrl
        } else if (params.type == 'silentOauthTest') {
          var url = window.location.href
          var newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
          newUrl = newUrl.replace('silentOauthTest', 'silentOauth')
          window.location = newUrl
        } else {
          util.show(this, 'error', '无法识别的跳转类型')
        }
      }
    }
  }
}

</script>

<style lang="stylus">

</style>
