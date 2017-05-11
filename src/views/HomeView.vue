<template>

  <div class="home-view">

  </div>

</template>


<script type="text/javascript">

import util from '../common/util'
import wechat from '../common/wechat'
import api from '../common/api'
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
      } else {
        window.localStorage.removeItem('fromUserId')
      }

      if (params.liveId && params.liveId != 0) {
        this.$router.go('/intro/' + params.liveId)
      } else {
        this.$router.go('/lives')
      }

    }
  },
  methods: {
    loginBySessionToken (sessionToken, liveId) {
      api.get(this, 'self', {
        sessionToken: sessionToken
      }).then((data) => {
        var token = data.sessionToken
        document.cookie = "SessionToken=" + token
        util.saveCurUser(data)
        if (liveId) {
          this.$router.go('/live/' + liveId)
        } else {
          this.$router.go('/lives')
        }
      }, util.promiseErrorFn(this))
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
