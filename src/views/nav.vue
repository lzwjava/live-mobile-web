<template>
  <nav class="navbar">
    <div class="container">

      <a href="/">
        <div class="left">
          <img class="navbar-brand" src="../img/header_logo.png">
          <div class="title">
            <span class="light">趣直播</span>
          </div>
        </div>
      </a>

      <div class="right">
        <ul class="list">
          <a href="."><li class="hover-btn">首页</li></a>

          <li v-if="userStatus">
          </li>
        </ul>
      </div>

    </div>
  </nav>
    
</template>

<script type="text/javascript">

import Tip from '../components/tip.vue'
import DropDown from '../components/dropdown.vue'
import UserAvatar from '../components/user-avatar.vue'
import util from '../common/util'

var debug = require('debug')('nav')

export default {
  name: 'Nav',
  components: {
    'tip': Tip,
    'dropdown': DropDown,
    'user-avatar': UserAvatar
  },
  data () {
    return {
      userStatus: false,
      user: {}
    }
  },
  computed: {
  },
  methods: {
  },
  created() {
    this.loadUser()
  },
  ready() {
  },
  events: {
  }
}

</script>

<style lang="stylus">

</style>
