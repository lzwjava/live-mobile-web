<template>
  <div class="profile-view">

    <div class="profile-container">

      <div class="profile-header" @click="goUpdateUserInfo">
        <div class="user-info">
          <div class="avatar-area">
            <user-avatar :user="curUser"></user-avatar>
            <i class="fa fa-pencil-square-o pencil-edit" aria-hidden="true"></i>
          </div>
          <div class="username">{{curUser.username}}</div>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goMylist">
          参与的直播
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goRoom">
          我的直播间
        </div>
      </div>

      <!-- <div class="menu-section">
        <div class="menu-item" @click="goAccount">
          账户
        </div>
      </div> -->

      <div class="menu-section">
        <div class="menu-item" @click="logout">
          退出登录
        </div>
      </div>

    </div>

    <tab-bar :active-index="1"></tab-bar>

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import api from '../common/api'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'
import Tabbar from '../components/Tabbar.vue'

require('font-awesome/css/font-awesome.css')

const debug = require('debug')('ProfileView')

export default {
  name: 'ProfileView',
  components: {
    'user-avatar': UserAvatar,
    'tab-bar': Tabbar
  },
  data () {
    return {
      curUser: {}
    }
  },
  route: {
    data({ to }) {
      if (!util.checkInSession(this)) return
      
      this.curUser = util.curUser()
      debug('curUser:%j', this.curUser)
    }
  },
  methods: {
    logout (e) {
      api.get(this, 'logout').then(resp => {
        this.curUser = {}
        util.removeCurUser()
        this.$dispatch('updateCurUser')
        this.$router.go('/lives')
        window.sessionStorage.removeItem("isLogin")

      }, util.promiseErrorFn(this))
    },
    goAccount () {
      this.$router.go('/account')
    },
    goMylist () {
      this.$router.go('/mylist')
    },
    goUpdateUserInfo () {
      this.$router.go('/editUser')
    },
    goRoom () {
      this.$router.go(`/room/${this.curUser.userId}?from=profile`)
    }
  }
}

</script>

<style lang="stylus">

.profile-view
  .profile-container
    position absolute
    width 100%
    bottom 54px
    top 0
    overflow-y scroll
    .profile-header
      display flex
      width 100%
      height 165px
      background-color #00BDEF
      justify-content center
      align-items center
      .user-info
        display flex
        justify-content center
        align-items center
        flex-direction column        
        .avatar-area
          width 70px
          height 70px
          position relative
          .pencil-edit
            color #ffb400
            position absolute
            right -15px
            bottom 0
            border-radius 7.5px
            width 15px
            heigth 15px
            font-size 15px
            padding 3px
          .avatar
            width 100%
            height 100%
        .username
          text-align center
          color #fff
          font-size 15px
          line-height 1.1
          max-width 100px
          font-weight 500
    .menu-section
      margin-top 10px
      .menu-item
        height 50px
        background-color #fff
        line-height 50px
        padding-left 20px
        color #909499
        font-size 16px



</style>
