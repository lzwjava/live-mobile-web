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
          <li class="avatar-cell" v-for="u in firstBatchUsers">
            <user-avatar :user="u"></user-avatar>
          </li>
        </ul>

        <div class="attend-summary" @click="goUsers">
          {{live.attendanceCount}}人已参与 >
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

    <div class="create-section">
      <a class="create-link" @click.prevent="createLive">创建您的直播?</a>
    </div>



    <toast type="loading" v-show="loadingToastShow">数据加载中</toast>

  </div>

</template>

<script>

import util from '../common/util'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'
import Markdown from '../components/markdown.vue'
import http from 'api'
import Overlay from '../components/overlay.vue'
import {Button, Toast} from 'vue-weui'

var debug = require('debug')('IntroView');

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
    firstBatchUsers: function () {
      var num = 7
      if (this.attendedUsers.length > 7)  {
        return this.attendedUsers.splice(0,7)
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
      return util.timeGap(this.live.planTs)
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
    wechat.configWeixin(this)
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
      util.loading(this)
      http.fetchLive(this, this.liveId)
      .then((data) => {
        util.loaded(this)
        this.live = data
        wechat.showMenu()
        wechat.shareLive(this.live)
      })
      .catch(util.promiseErrorFn(this))
    },
    fetchUsers () {
      util.loading(this)
      http.fetchUsers(this, this.liveId)
      .then((data) => {
        util.loaded(this)
        this.attendedUsers = data
      })
      .catch(util.promiseErrorFn(this))
    },
    attendLive () {
      if (this.live.canJoin) {
        this.$router.go('/live/' + this.liveId)
      } else if (this.curUser.userId){
        this.pay()
      } else {
        this.$router.go('/register?redirectUrl=/intro/' + this.liveId)
      }
    },
    createLive() {
      this.$router.go('/scan')
    },
    pay() {
      wechat.attendLiveAndPay(this, this.liveId)
        .then(() => {
          util.show(this, 'success', '支付成功')
          this.fetchData()
        }, util.promiseErrorFn(this))
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
        margin-left 5px
        vertical-align top
        display inline-block
        .subject
          margin-top 5px
          font-size 18px
          font-weight bold
          overflow hidden
          line-height 30px
          max-height 60px
          text-overflow ellipsis
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 2
        .ownername
          margin-top 5px
          font-size 16px
    .time-section
      border-top 1px dashed #e7e7e7
      .time-label
        margin-top 10px
        color #828282
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
          font-size 16px
          width 90%
    .detail-section
      .detail-label
        font-size 16px
        margin 10px 0
        color #828282
      .markdown-body
        padding 25px
        font-size 16px
        color rgb(112, 112, 112)
        line-height 28px !important
    .card-group
      margin-bottom 10px
      background-color #fff
      padding 10px
    .create-section
      margin-top 60px
      text-align center
      font-size 15px
      margin-bottom 30px
      a
        color #8A8A8A

</style>
