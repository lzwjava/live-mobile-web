<template>
  <nav class="navbar">
    <div class="container">

    </div>
  </nav>

  <tip v-el:msg-tip><tip>

</template>

<script type="text/javascript">

import Tip from '../components/tip.vue'
import UserAvatar from '../components/user-avatar.vue'
import util from '../common/util'

var debug = require('debug')('nav')

export default {
  name: 'Nav',
  components: {
    'tip': Tip,
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
  },
  ready() {
  },
  events: {
  }
}

</script>

<style lang="stylus">

</style>
