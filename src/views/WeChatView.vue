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
    }
  },
  methods: {
  },
  computed: {
  },
  created() {
  },
  methods: {
    goLiveOrList() {
      var type = window.localStorage.getItem('type')
      if (type == 'live') {
        var liveId = window.localStorage.getItem('liveId')
        if (liveId && liveId > 0) {
          util.loading(this)
          http.fetchLive(this, liveId)
           .then((live) => {
             util.loaded(this)
             if (live.canJoin) {
               this.$router.replace('/live/' + liveId)
             } else {
               this.$router.replace('/intro/' + liveId)
             }
           }, util.promiseErrorFn(this))
        } else {
          this.$router.replace('/lives')
        }
      } else if (type == 'packet') {
        var packetId = window.localStorage.getItem('packetId')
        this.$router.replace('/packets/' + packetId)
      } else {
        this.$router.replace('/lives')
      }
    }
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
        util.loading(this)
        http.get(this, 'wechat/silentOauth', {code: code})
          .then((data) => {
            util.loaded(this)
            this.goLiveOrList()
          }, errorFn)
      } else if (params.type == 'oauth') {
        util.loading(this)
        http.get(this, 'wechat/oauth', {code: code})
          .then((data) => {
            util.loaded(this)
            this.$router.replace('/register/?openId=' + data.openId)
          }, (error) => {
            if (error && error.indexOf('早已注册') != -1) {
               this.goLiveOrList()
            } else {
               errorFn(error)
            }
          })
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
      } else if (params.type == 'webOauth') {
        util.loading(this)
        http.get(this, 'wechat/webOauth', {code: code})
         .then((data) => {
           util.loaded(this)
           this.goLiveOrList()
         }, util.promiseErrorFn(this))
       } else if (params.type == 'webOauthTest') {
         var url = window.location.href
         var newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
         newUrl = newUrl.replace('webOauthTest', 'webOauth')
         window.location = newUrl
       }  else {
         this.goLiveOrList()
        //  util.show(this, 'error', '无法识别的跳转类型')
       }
    }
  }
}

</script>

<style lang="stylus">

</style>
