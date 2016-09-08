<template>

  <div class="home-view">

  </div>

</template>


<script type="text/javascript">

import util from '../common/util'
import wechat from '../common/wechat'
var debug = require('debug')('HomeView')

export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      isDebug: false
    }
  },
  created() {
    var params = util.getParams()
    debug('params: %j', params)
    if (!params.code && !params.liveId) {
      util.show(this, 'error', '缺少参数')
      return
    }
    if (params.liveId) {
      window.localStorage.setItem('liveId', params.liveId)
      if (this.isDebug) {
        this.jumpToIntro()
      } else {
        this.oauthOrRegister()
      }
    } else {
      this.oauthOrRegister()
    }
  },
  methods: {
    jumpToIntro: function () {
      window.localStorage.setItem('qzb.curUser', JSON.stringify(this.curUser))
      var liveId = window.localStorage.getItem('liveId')
      window.location = '/#intro/' + liveId
    },
    oauthOrRegister: function () {
      var params = util.getParams()
      if (params.code) {
        var isLoalhost = window.location.hostname == 'localhost'
        if (!this.isDebug) {
          wechat.wechatRegister(this, params.code, (user) => {
            this.curUser = user
            this.jumpToIntro()
          });
        } else {
          if (isLoalhost) {
            wechat.wechatRegister(this, params.code, (user) => {
              this.curUser = user
              this.jumpToIntro()
            });
          } else {
            window.location = 'http://localhost:9060?code=' + params.code
          }
        }
      } else {
        wechat.oauth2()
      }
    }
  }
}

</script>

<style lang="stylus">

</style>
