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
  },
  route: {
    data({to}) {
      var params = this.$route.query;
      if (params.sessionToken) {
        this.loginBySessionToken(params.sessionToken, params.liveId)
        return
      }
      if (params.action == 'logout') {
        this.logout()
        return
      }

      if (params.fromUserId) {
        window.localStorage.setItem('fromUserId', params.fromUserId)
      }

      if (params.liveId && params.liveId != 0) {
        this.$router.go('/intro/' + params.liveId)
      } else {
        this.$router.go('/lives')
      }

    }
  },
  methods: {
    loginBySessionToken: function (sessionToken, liveId) {
      this.$http.get('self', {
        sessionToken: sessionToken
      }).then((resp) => {
        if (util.filterError(this, resp)) {
          var token = resp.data.result.sessionToken;
          document.cookie = "SessionToken=" + token;
          if (liveId) {
            this.$router.go('/live/' + liveId)
          } else {
            this.$router.go('/lives')
          }
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
