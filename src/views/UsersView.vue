<template>

  <div class="users-view">
    <ul>
      <li class="title">
        已有 {{live.attendanceCount}} 人参与直播
      </li>

      <li v-for="u in attendUsers" @click="goUserRoom(u.userId)">
        <user-avatar :user="u" />
        <span class="name">{{u.username}}</span>
      </li>

      <load-more-bar :have-more="haveMore" :loading="loading" />

    </ul>
  </div>

</template>

<script type="text/javascript">

import http from '../common/api'
import util from '../common/util'
import UserAvatar from '../components/user-avatar.vue'
import LoadMoreBar from '../components/LoadMoreBar.vue'

const debug = require('debug')('UsersView')

export default {
  name: 'UsersView',
  components: {
    'user-avatar': UserAvatar,
    'load-more-bar': LoadMoreBar
  },
  data () {
    return {
      liveId: 0,
      live: {},
      attendUsers: [],
      haveMore: true,
      loading: false
    }
  },
  route: {
    data ({ to }) {
      debug('params: %j', to.params)
      const liveId = to.params.liveId
      if (liveId == this.liveId) return
      this.liveId = liveId
      this.fetchLive()

      this.haveMore = true
      this.loading = false
      this.attendUsers = []
      this.loadUsers()
    }
  },
  methods: {
    fetchLive () {
      this.$dispatch('loading', true)
      http.fetchLive(this, this.liveId)
       .then(data => {
         this.$dispatch('loading', false)
         this.live = data
       }).catch(util.promiseErrorFn(this))
    },
    loadUsers () {
      this.loading = true
      http.fetchUsers(this, this.liveId, {
        skip: this.attendUsers.length,
        limit: 100
      }).then(data => {
        this.loading = false
        this.attendUsers = this.attendUsers.concat(data)
        if (data.length < 100) {
          this.haveMore = false
        }
      })
    },
    goUserRoom (userId) {
      this.$router.go(`/room/${userId}`)
    }
  },
  events: {
    'loadMore': function () {
      this.loadUsers()
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/variables.styl"

.users-view
  font-size 16px
  .title
    text-align center
  li
    background-color #fff
    padding 5px 30px
    margin-bottom 5px
    .avatar
      width 50px
      height 50px
    .name
      vertical-align top
      line-height 50px
      margin-left 10px
  .max-tips
    text-align center
    color gray
    margin 10px 0

</style>
