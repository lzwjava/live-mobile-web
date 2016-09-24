<template>
  <div class="profile-view">
    <user-avatar :user="curUser"></user-avatar>
  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from 'api'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'

var debug = require('debug')('ProfileView')

export default {
  name: 'ProfileView',
  components: {
    'user-avatar': UserAvatar
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

</style>
