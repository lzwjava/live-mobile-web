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
    }
  },
  created() {
    var params = this.$route.query;
    if (params.sessionToken) {
      this.loginBySessionToken(params.sessionToken)
      return
    }
    if (params.action == 'logout') {
      this.logout()
      return
    }
    if (!params.liveId) {
      util.show(this, 'error', '缺少参数')
      return
    }
    window.localStorage.setItem('liveId', params.liveId)
    wechat.silentOauth2(this, params.liveId)
  },
  methods: {
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
