<template>

  <div class="intro-view">

    <div class="header-section card-group">
      <user-avatar :user="live.owner"></user-avatar>

      <div class="header-right">
        <div class="subject">{{live.subject}}</div>
        <div class="ownername">{{live.owner.username}}</div>
      </div>

      <div class="time-section">
        <div class="time-label">时间</div>
        <div class="plan-time">{{live.planTs}}</div>
      </div>

    </div>

    <div class="attend-section card-group">
      <div class="attend-info">
        <ul class="attended-users">
          <li class="avatar-cell" v-for="u in firstFiveUsers">
            <user-avatar :user="u"></user-avatar>
          </li>
        </ul>

        <div class="attend-summary">
          已有{{attendedUsers.length}}人参与 >
        </div>
      </div>

      <div class="attend-action section">
        <button class="btn btn-blue attend-btn" @click="attendLive">{{btnTitle}}</button>
      </div>

    </div>

    <div class="live-detail card-group">
      <div class="detail-label">
        直播详情
      </div>

      <markdown :content="live.detail" :show=true></markdown>

    </div>

    <overlay :overlay.sync="overlayStatus">
      <register-form :cur-user="curUser"></register-form>
    </overlay>

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
import RegisterForm from '../components/register-form.vue'
import {Button, Toast} from 'vue-weui'

var debug = require('debug')('IntroView');

export default {
  name: 'IntroView',
  components: {
    'user-avatar': UserAvatar,
    'markdown': Markdown,
    'overlay': Overlay,
    'register-form': RegisterForm,
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
      } else {
        return '支持并参与活动(¥' + (this.live.amount /100) + ')'
      }
    }
  },
  route: {
    data ({ to }) {
      this.liveId = to.params.liveId
      this.loadCurUser()
      this.fetchData()
    }
  },
  created () {
  },
  destroyed () {
  },
  methods: {
    loadCurUser: function () {
      var item = window.localStorage.getItem('qzb.curUser')
      this.curUser = JSON.parse(item)
      debug('load user')
      debug(this.curUser)
    },
    fetchData: function () {
      this.fetchLive()
      this.fetchUsers()
    },
    fetchLive: function () {
      var comp = this
      http.fetchLive(this, this.liveId, function (live) {
        comp.live = live
      })
    },
    fetchUsers: function() {
      this.$http.get('lives/' + this.liveId +'/users')
      .then((resp) => {
        if (util.filterError(this, resp)) {
          this.attendedUsers = resp.data.result
        }
      }, util.httpErrorFn(this))
    },
    attendLive: function () {
      if (this.live.canJoin) {
        var url = window.location.href
        var arr = url.split("/");
        var result = arr[0] + "//" + arr[2]
        window.location.href = result + '/#live/' + this.liveId
      } else {
        this.overlayStatus = true
      }
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
    .header-section
      .avatar
        width 80px
        height 80px
        display inline-block
      .header-right
        width 70%
        display inline-block
        .subject
          font-size 18px
          font-weight bold
        .ownername
          font-size 16px
    .time-section
      border-top 1px dashed #e7e7e7
      .plan-time
        font-size 16px
    .attend-section
      ul
        display inline-block
        li
          display inline-block
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
    .card-group
      margin-bottom 10px
      background-color #fff
      padding 10px

</style>
