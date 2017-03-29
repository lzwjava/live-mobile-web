<template>
  <div class="profile-view">

    <div class="profile-container">

      <div class="profile-header">
        <div class="user-info">
          <user-avatar :user="curUser"></user-avatar>
          <div class="username">{{curUser.username}}</div>
        </div>
      </div>

    </div>

    <tab-bar :active-index="1"></tab-bar>

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'
import Tabbar from '../components/Tabbar.vue'

var debug = require('debug')('ProfileView')

export default {
  name: 'ProfileView',
  components: {
    'user-avatar': UserAvatar,
    'tab-bar': Tabbar
  },
  data() {
    return {
      curUser: {}
    }
  },
  methods: {
  },
  created() {
    http.fetchCurUser(this)
      .then((data) => {
        this.curUser = data
      }, util.promiseErrorFn(this))
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
        text-align center
        .avatar
          width 70px
          height 70px
        .username
          color #fff
          font-weight 500


</style>
