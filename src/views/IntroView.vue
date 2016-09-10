<template>

  <div class="intro-view">

    <div class="cover-section card-group">
      <img class="cover-img" :src="live.coverUrl" alt="cover" />
    </div>

    <div class="header-section card-group">
      <user-avatar :user="live.owner"></user-avatar>

      <div class="header-right">
        <div class="subject">{{live.subject}}</div>
        <div class="ownername">{{live.owner.username}}</div>
      </div>

      <div class="time-section">
        <div class="time-label">直播时间</div>
        <div class="plan-time">{{live.planTs}} ({{timeGap}})</div>
      </div>

    </div>

    <div class="attend-section card-group">
      <div class="attend-info">
        <ul class="attended-users">
          <li class="avatar-cell" v-for="u in firstFiveUsers">
            <user-avatar :user="u"></user-avatar>
          </li>
        </ul>

        <div class="attend-summary" @click="goUsers">
          已有{{attendedUsers.length}}人参与 >
        </div>
      </div>

      <div class="attend-action section">
        <button class="btn btn-blue attend-btn" @click="attendLive">{{btnTitle}}</button>
      </div>

    </div>

    <div class="detail-section card-group">
      <div class="detail-label">
        直播详情
      </div>

      <markdown :content="live.detail" :show=true></markdown>

    </div>

    <toast type="loading" v-show="loadingToastShow">数据加载中</toast>

  </div>

</template>

<script>

import util from '../common/util'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'
import Markdown from '../components/markdown.vue'
import http from '../common/http'
import Overlay from '../components/overlay.vue'
import {Button, Toast} from 'vue-weui'
import moment from 'moment'

var debug = require('debug')('IntroView');

moment.locale('zh-cn')

export default {
  name: 'IntroView',
  components: {
    'user-avatar': UserAvatar,
    'markdown': Markdown,
    'overlay': Overlay,
    'weui-button': Button,
    'toast': Toast
  },

  data () {
    return {
      code: '',
      curUser: {},
      live: {
        owner: {}
      },
      attendedUsers: [],
      liveId: 0,
      overlayStatus: false
    }
  },
  computed: {
    firstFiveUsers: function () {
      if (this.attendedUsers.length > 5)  {
        return this.attendedUsers.splice(0,5)
      } else {
        return this.attendedUsers
      }
    },
    btnTitle: function () {
      if (this.live.canJoin) {
        return '已报名，进入直播间'
      } else if (this.curUser.userId) {
        return '赞助并参与直播(¥' + (this.live.amount /100) + ')'
      } else {
        return '请登录后参与直播'
      }
    },
    timeGap: function() {
      return moment(this.live.planTs, "YYYY-MM-DD hh:mm::ss").fromNow()
    }
  },
  route: {
    data ({ to }) {
      this.liveId = to.params.liveId
      this.loadCurUser()
      this.fetchData()
      if (to.query.action == 'pay') {
        setTimeout(()=> {
          this.pay()
        }, 500)
      }
    }
  },
  created () {
  },
  destroyed () {
  },
  methods: {
    loadCurUser () {
      http.fetchCurUser(this)
      .then((user) => {
        this.curUser = user
      }).catch((error) => {
      })
    },
    fetchData () {
      this.fetchLive()
      this.fetchUsers()
    },
    fetchLive () {
      http.fetchLive(this, this.liveId)
      .then((data) => {
        this.live = data
      })
      .catch(util.promiseErrorFn(this))
    },
    fetchUsers () {
      http.fetchUsers(this, this.liveId)
      .then((data) => {
        this.attendedUsers = data
      })
      .catch(util.promiseErrorFn(this))
    },
    attendLive () {
      if (this.live.canJoin) {
        var url = window.location.href
        var arr = url.split("/");
        var result = arr[0] + "//" + arr[2]
        window.location.href = result + '/#live/' + this.liveId
      } else if (this.curUser.userId){
        // this.overlayStatus = true
        // this.$router.go('/register', {liveId: this.liveId})
        this.pay()
      } else {
        wechat.oauth2(this, this.liveId)
      }
    },
    pay() {
      debug('支付中')
    },
    goUsers() {
      this.$router.go('/live/' + this.liveId + '/users')
    }
  },

  filters: {
    moneyAsYuan: function (money) {
      if (!money) {
        return 0
      } else {
        return money / 100
      }
    }
  }
}
</script>

<style lang="stylus">

@import "../stylus/base.styl"

.intro-view
    .section
      background-color #fff
    .cover-section
      padding 0px !important
      .cover-img
        width 100%
        max-height 250px
    .header-section
      .avatar
        width 80px
        height 80px
        display inline-block
      .header-right
        width 70%
        display inline-block
        .subject
          font-size 16px
          font-weight bold
        .ownername
          font-size 16px
    .time-section
      border-top 1px dashed #e7e7e7
      .time-label
        margin-top 10px
      .plan-time
        font-size 16px
    .attend-section
      .attend-info
        margin 5px 0
      ul
        display inline-block
        li
          display inline-block
          margin 0 2px
          .avatar
            width 25px
            height 25px
      .attend-summary
        float right
        line-height 25px
      .attend-action
        text-align center
        .attend-btn
          width 90%
    .detail-section
      .detail-label
        font-size 16px
        margin 10px 0
    .card-group
      margin-bottom 10px
      background-color #fff
      padding 10px

</style>
