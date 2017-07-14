<template>
  <div>
  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'

const debug = require('debug')('WeChatView')

export default {
  name: 'WeChatView',
  methods: {
    goLiveOrList() {
      let type = window.localStorage.getItem('type')
      if (type === 'live') {
        var liveId = window.localStorage.getItem('liveId')
        if (liveId && liveId > 0) {
          this.$router.replace(`/intro/${liveId}`)
        } else {
          this.$router.replace('/lives')
        }
      } else {
        this.$router.replace('/lives')
      }
    }
  },
  route: {
    data({ to }) {
      const params = this.$route.params
      if (!params.type) {
        util.show(this, 'error', '路径错误')
        return
      }
      let type = params.type
      let hostname = window.location.hostname
      let isLoalhost = hostname  == 'localhost'
      debug('WeChatView created')
      let query = this.$route.query
      if (!query.code || !query.state) {
        util.show(this, 'error', '缺少参数')
        return
      }
      let code = query.code
      let state = query.state
      let errorFn = (error) => {
        if (error && error.indexOf('invalid code') !== -1) {
          debug('history back')
          window.history.back()
        } else {
          util.show(this, 'error', error)
        }
      }
      if (params.type === 'silentOauth') {
        util.loading(this)
        http.get(this, 'wechat/silentOauth', {code: code})
          .then(data => {
            util.loaded(this)
            util.saveCurUser(data)
            this.$dispatch('hideForm')
            this.$dispatch('updateCurUser')
            this.goLiveOrList()
          }, errorFn)
      } else if (params.type === 'oauth') {
        util.loading(this)
        http.get(this, 'wechat/oauth', {code: code})
          .then(data => {
            util.loaded(this)
            util.saveCurUser(data)
            this.$dispatch('updateCurUser')
            this.goLiveOrList()
          }, errorFn)
      } else if (params.type === 'oauthTest') {
        let url = window.location.href
        let newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
        newUrl = newUrl.replace('oauthTest', 'oauth')
        window.location = newUrl
      } else if (params.type === 'silentOauthTest') {
        let url = window.location.href
        let newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
        newUrl = newUrl.replace('silentOauthTest', 'silentOauth')
        window.location = newUrl
      } else if (params.type === 'webOauth') {
        util.loading(this)
        http.get(this, 'wechat/webOauth', {code: code})
         .then(data => {
           util.loaded(this)
           util.saveCurUser(data)
           this.$dispatch('updateCurUser')
           this.goLiveOrList()
         }, util.promiseErrorFn(this))
       } else if (params.type === 'webOauthTest') {
         let url = window.location.href
         let newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
         newUrl = newUrl.replace('webOauthTest', 'webOauth')
         window.location = newUrl
       }  else {
         this.goLiveOrList()
       }
    }
  }
}

</script>

<style lang="stylus">

</style>
