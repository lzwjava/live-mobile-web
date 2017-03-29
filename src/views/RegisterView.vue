<template>
  <div class="register-view">
    <h1>欢迎使用趣直播</h1>
  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'

var debug = require('debug')('RegisterView')

export default {
  name: 'RegisterView',
  props: [],
  components: {
  },
  data() {
    return {
      liveId: 0,
      openId: '',
      redirectUrl: ''
    }
  },
  computed: {
  },
  created() {
  },
  route: {
    data({to}) {
      var query = this.$route.query;

      if (query.openId) {
        this.openId = query.openId
        this.registerBySns()
      } else {
        if (query.liveId) {
          window.localStorage.setItem('type', 'live')
          window.localStorage.setItem('registerLiveId', query.liveId)
        } else {
          window.localStorage.setItem('type', query.type)
          window.localStorage.setItem('packetId', query.packetId)
        }
        wechat.oauth2(this)
      }
    }
  },
  methods: {
    registerBySns: function () {
      util.loading(this)
      http.post(this, 'users/registerBySns', {
        openId: this.openId,
        platform: 'wechat'
      }).then((data) => {
        util.loaded(this)
        util.saveCurUser(data)
        this.$dispatch('toast', '注册成功', 1000, () => {
          this.goSucceed()
        })
      }, util.promiseErrorFn(this))
    },
    goSucceed() {
      var type = window.localStorage.getItem('type')
      if (type == 'live') {
        var liveId = window.localStorage.getItem('registerLiveId')
        if (liveId && liveId !=0) {
          this.$router.go('/intro/' + liveId)
        } else {
          this.$router.go('/lives')
        }
      } else if (type == 'packet') {
        var packetId = window.localStorage.getItem('packetId')
        this.$router.go('/packets/' + packetId)
      } else {
        this.$router.go('/lives')
      }
    }
  }
}

</script>


<style lang="stylus">

@import "../stylus/base.styl"

.register-view
  min-height 100%
  background #fff
  h1
    margin-top 100px
    text-align center
    color #00BDEF

</style>
