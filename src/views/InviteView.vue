<template>

  <div class="invite-view">

    <div class="me">
      <user-avatar :user="curUser.userId ? curUser : defaultUser"></user-avatar>
      <div class="right-panel">
        <div class="name">我</div>
        <div class="invite-word">{{curUser.userId ? '有价值的直播，值得分享': '请先登录'}}</div>
      </div>

      <button class="btn-invite btn btn-blue" @click="showShareLead">邀请朋友</button>

    </div>

    <ul class="invite-list">

      <li v-for="(n, i) in invites">
        <user-avatar :user="i"></user-avatar>
        <div class="right-panel">
          <div class="name">{{n+1}}.{{i.username}}</div>
          <div class="invite-count">带了<span class="count-num">{{i.inviteCount}}</span>个朋友来参加，收益<span class="income-num">¥{{i.inviteIncome/100.0}}</span>元</div>
        </div>

      </li>

      <load-more-bar :have-more="haveMore" :loading="loading"></load-more-bar>

    </ul>

    <div class="tips-area">
      <p>提示</p>
      <p>1.直播门票，5成归主播，3成归邀请者，2成归平台</p>
      <p>2.可点击进入<a @click="goAccount">账户</a>进行提现</p>
      <p>3.没有限制，邀请越多奖励越多</p>
      <p>4.为了让您收到收益通知，请先关注「平方根科技」服务号</p>
      <p>5.如需帮助请联系客服(微信号：lzwjava2048)</p>
    </div>

    <overlay :overlay.sync="overlayStatus">
        <component :is="currentView" type="share" :live-id="liveId"></component>
    </overlay>
  </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import util from '../common/util'
import UserAvatar from '../components/user-avatar.vue'
import LoadMoreBar from '../components/LoadMoreBar.vue'
import ShareLead from '../components/ShareLead.vue'
import Overlay from '../components/overlay.vue'
import wechat from '../common/wechat'
import SubscribeForm from '../components/SubscribeForm.vue'

var debug = require('debug')('InviteView')

export default {
  name: 'InviteView',
  components: {
    'subscribe-form': SubscribeForm,
    'user-avatar': UserAvatar,
    'load-more-bar': LoadMoreBar,
    'share-lead': ShareLead,
    'overlay': Overlay
  },
  data() {
    return {
      liveId: 0,
      invites: [],
      haveMore: true,
      loading: false,
      curUser: {},
      live: {},
      defaultUser: {},
      currentView: 'share-lead',
      overlayStatus: false
    }
  },
  created() {
  },
  route: {
    data ({to}) {
      document.title = '邀请榜'

      var liveId = to.params.liveId
      if (liveId == this.liveId) {
        return
      }
      this.liveId = liveId

      this.defaultUser = util.defaultUser()

      this.haveMore = true
      this.loading = false
      this.invites = []

      util.loading(this)
      Promise.all([
        api.fetchCurUserNoError(this),
        api.fetchLive(this, this.liveId),
        wechat.configWeixin(this)
      ]).then((values) => {
        util.loaded(this)

        this.curUser = values[0]

        this.live = values[1]

        wechat.shareLive(this, this.live, this.curUser)

      }, util.promiseErrorFn(this))

      this.loadInvites()
    }
  },
  methods: {
    fetchInvites() {
      return api.get(this, 'attendances/invites', {
        liveId: this.liveId,
        skip: this.invites.length,
        limit: 100
      })
    },
    loadInvites() {
      this.loading = true
      this.fetchInvites().then((data) => {
        this.loading = false
        this.invites = this.invites.concat(data)
        if (data.length < 100) {
          this.haveMore = false
        }
      })
    },
    showShareLead() {
      if (!this.curUser.userId) {
        this.$broadcast('loginOrRegister', this.liveId)
      } else {
        if (this.curUser.wechatSubscribe == 0) {
          this.currentView = 'subscribe-form'
          this.overlayStatus = true
        } else {
          this.currentView = 'share-lead'
          this.overlayStatus = true
        }
      }
    },
    goAccount() {
      this.$router.go('/account')
    }
  },
  events: {
    'loadMore': function () {
      this.loadInvites()
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/variables.styl"

.invite-view
  font-size 16px
  .title
    text-align center
  .me
    background-color #fff
    padding 5px 20px
    margin-bottom 5px
    .avatar
      width 50px
      height 50px
    .right-panel
      display inline-block
      margin-left 10px
      vertical-align top
      .name
        font-size 16px
      .invite-word
        color #828282
        font-size 14px
    .btn-invite
      float right
      margin-top 10px
  .invite-list
    margin-top 10px
    li
      background-color #fff
      padding 10px 20px
      margin-bottom 5px
      .avatar
        width 50px
        height 50px
      .right-panel
        display inline-block
        margin-left 10px
        vertical-align top
        .name
          font-size 16px
          line-height 30px
        .invite-count
          color #828282
          font-size 14px
          .count-num
          .income-num
            color #f00
  .max-tips
    text-align center
    color gray
    margin 10px 0
  .tips-area
    margin 20px 30px
    text-align left
    p
      color #828282
      font-size 14px
      a
        color #00ABD8

</style>
