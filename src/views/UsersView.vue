<template>

  <div class="users-view">
    <ul>
      <li class="title">
        已有 {{attendUsers.length}} 人参与直播
      </li>

      <li v-for="u in attendUsers">
        <user-avatar :user="u"></user-avatar>
        <span class="name">{{u.username}}</span>
      </li>
    </ul>
  </div>

</template>

<script type="text/javascript">

import http from '../common/http'
import util from '../common/util'
import UserAvatar from '../components/user-avatar.vue'

var debug = require('debug')('UsersView')

export default {
  name: 'UsersView',
  components: {
    'user-avatar': UserAvatar
  },
  data() {
    return {
      liveId: 0,
      live: {},
      attendUsers: []
    }
  },
  created() {
  },
  route: {
    data ({to}) {
      debug('params: %j', to.params)
      this.liveId = to.params.liveId
      this.fetchData()
    }
  },
  methods: {
    fetchData: function () {
      this.$dispatch('setLoading', true)
      http.fetchUsers(this, this.liveId)
      .then((data) => {
        this.$dispatch('setLoading', false)
        this.attendUsers = data
      })
      .catch(util.promiseErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

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

</style>
