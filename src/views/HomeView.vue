<template>

  <div class="home-view">

    <div class="header-section">
      <user-avatar :user="live.owner"></user-avatar>

      <div class="header-right">
        <div class="subject">{{live.subject}}</div>
        <div class="ownername">{{live.owner.username}}</div>
      </div>
    </div>

    <div class="time-section">
      <div class="time-label">时间</div>
      <div class="plan-time">{{live.planTs}}</div>
    </div>

    <div class="attend-section">
      <div class="attend-info">
        <ul class="attended-users">
          <li v-for="u in firstFiveUsers">
            <user-avatar :user="u"></user-avatar>
          </li>
        </ul>

        <div class="attend-summary">
          已有{{attendedUsers.length}}人参与 >
        </div>
      </div>

      <div class="attend-action">
        <button class="attend-btn">支持并参与活动(¥ {{live.amount}})</button>
      </div>

      <div class="live-detail">
        <div class="detail-label">
          直播详情
        </div>

        <markdown :content="live.detail" :show=true></markdown>

      </div>

    </div>

  </div>

</template>

<script>

import util from '../common/util'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'
import Markdown from '../components/markdown.vue'

var debug = require('debug')('HomeView');

export default {
  name: 'HomeView',
  components: {
    'user-avatar': UserAvatar,
    'markdown': Markdown
  },

  data () {
    return {
      code: '',
      curUser: {},
      live: {
        owner: {}
      },
      attendedUsers: []
    }
  },
  computed: {
    firstFiveUsers: function () {
      if (this.attendedUsers.length > 5)  {
        return this.attendedUsers.splice(0,5)
      } else {
        return this.attendedUsers
      }
    }
  },
  route: {
    data ({ to }) {
      const page = +to.params.page
      document.title = '趣直播'
    }
  },

  created () {
    //window.location = util.weixinOauthUrl;
    // wechat.getAccessToken(this)
    var params = util.getParams()
    debug('params: %j', params)
    if (!params.code && !params.liveId) {
      util.show(this, 'error', '缺少参数')
      return
    }
    if (params.liveId) {
      window.localStorage.setItem('liveId', params.liveId)
      this.oauthOrRegister()
    } else {
      this.oauthOrRegister()
    }
  },

  destroyed () {
  },
  methods: {
    fetchLive: function () {
      var liveId = window.localStorage.getItem('liveId')
      this.$http.get('lives/' + liveId)
      .then((resp) => {
        if (util.filterError(this, resp)) {
          this.live = resp.data.result
        }
      }, util.httpErrorFn(this))
    },
    oauthOrRegister: function () {
      var params = util.getParams()
      if (params.code) {
        var isDebug = true
        var comp = this
        var isLoalhost = window.location.hostname == 'localhost'
        if (!isDebug) {
          wechat.wechatRegister(this, params.code, function(user) {
            comp.curUser = user
            comp.fetchLive()
          });
        } else {
          if (isLoalhost) {
            wechat.wechatRegister(this, params.code, function(user) {
              comp.curUser = user
              comp.fetchLive()
            });
          } else {
            window.location = 'http://localhost:9060?code=' + params.code
          }
        }
      } else {
        wechat.oauth2()
      }
    }
  },

  filters: {

  }
}
</script>

<style lang="stylus">

@import "../stylus/base.styl"

.home-view
    min-height 500px

</style>
