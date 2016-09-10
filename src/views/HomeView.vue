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
      isDebug: true
    }
  },
  created() {
    var params = this.$route.query;
    debug('params: %j', params)    
    if (params.sessionToken) {
      this.loginBySessionToken(params.sessionToken)
      return
    }
    if (params.action == 'logout') {
      this.logout()
      return
    }
    if (!params.code && !params.liveId) {
      util.show(this, 'error', '缺少参数')
      return
    }
    if (params.liveId) {
      wechat.silentOauth2(this, params.liveId)
    } else {
      //this.wechatRegister(params.code)
    }
  },
  methods: {
    jumpToIntro: function () {
      window.localStorage.setItem('qzb.curUser', JSON.stringify(this.curUser))
      var liveId = window.localStorage.getItem('liveId')
      window.location = '/#intro/' + liveId
    },
    wechatRegister(code) {
      var hostname = window.location.hostname
      var isLoalhost = hostname  == 'localhost'
      if (this.isDebug && !isLoalhost) {
        // debug 模式且是服务器
        window.location = 'http://localhost:9060?code=' + code
      } else {
        wechat.wechatRegister(this, code, (user) => {
          this.curUser = user
          this.jumpToIntro()
        });
      }
    },
    loginBySessionToken: function (sessionToken) {
      this.$http.get('self', {
        sessionToken: sessionToken
      }).then((resp) => {
        if (util.filterError(this, resp)) {
          var token = resp.data.result.sessionToken;
          document.cookie = "SessionToken=" + token;
          window.location.href = '.';
        }
      }, util.httpErrorFn(this));
    },
    logout() {
      this.$http.get('logout')
      .then((resp) => {
        if (util.filterError(this, resp)) {
          this.$dispatch('toast', '已注销', 1000, () => {
            window.location = '/'
          })
        }
      }, util.httpErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

</style>
