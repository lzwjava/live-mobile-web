<template>

  <div class="wechat-view">

    <loading></loading>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import http from '../common/api'
import Loading from '../components/loading.vue'

var debug = debugFn('WeChatView')

export default {
  name: 'WeChatView',
  components: {
    'loading': Loading
  },
  data() {
    return {
    }
  },
  methods: {
  },
  route: {
    data({to}) {
      var params = this.$route.params
      var query = this.$route.query
      if (!query.code || !query.state) {
        util.show(this, 'error', '缺少参数')
        return
      }
      var code = query.code
      var state = query.state
      if (params.type == 'silentOauth') {
        util.loading(this)
        http.get(this, 'wechat/webOauth', {code: code})
         .then((data) => {
           util.loaded(this)
           this.$dispatch('updateUser', data)
           this.$router.go('/attendedList')
         }, util.promiseErrorFn(this))
       } else if (params.type == 'silentOauthTest') {
         var url = window.location.href
         var newUrl = url.replace('m.quzhiboapp.com', 'localhost:9060')
         newUrl = newUrl.replace('silentOauthTest', 'silentOauth')
         window.location = newUrl
       } else if (params.type == 'webOauth') {
         var url = window.location.href
         //var newUrl = url.replace('quzhiboapp.com', 'm.quzhiboapp.com')
         window.location = newUrl
       } else if (params.type == 'webOauthTest') {
         var url = window.location.href
         //var newUrl = url.replace('quzhiboapp.com', 'm.quzhiboapp.com')
         window.location = newUrl
       }
    }
  }
}

</script>

<style media="screen" lang="stylus">

.wechat-view
  min-height 500px

</style>
