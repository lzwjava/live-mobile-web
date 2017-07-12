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
  route: {
    data({to}) {
      let { sessionToken, liveId, action, fromUserId } = this.$route.query
      if (sessionToken) {
        this.loginBySessionToken(sessionToken, liveId)
        return
      }
      if (action === 'logout') {
        this.logout()
        return
      }

      if (fromUserId) {
        let fromUser = {fromUserId, liveId}
        window.localStorage.setItem('fromUser', JSON.stringify(fromUser))
      } else {
        let fromUser = window.localStorage.getItem('fromUser')
        if (fromUser) {
          let localLiveId = JSON.parse(fromUser).liveId
          if (localLiveId != liveId){
            window.localStorage.removeItem('fromUser')
          }
        }
      }

      if (liveId && liveId !== 0) {
        this.$router.go('/intro/' + liveId)
      } else {
        this.$router.go('/lives')
      }

    }
  },
  methods: {
    loginBySessionToken (sessionToken, liveId) {
      api.get(this, 'self', {
        sessionToken: sessionToken
      }).then(data => {
        document.cookie = `SessionToken=${data.sessionToken}`
        util.saveCurUser(data)
        if (liveId) {
          this.$router.go(`/live/${liveId}`)
        } else {
          this.$router.go('/lives')
        }
      }, util.promiseErrorFn(this))
    },
    logout () {
      this.$http.get('logout')
        .then(data => {
          if (util.filterError(this, data)) {
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
