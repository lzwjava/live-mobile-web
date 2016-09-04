<template>

  <div class="home-view">
    <div class="big-word">研发中，敬请期待…</div>
  </div>

</template>

<script>

import util from '../common/util'

var debug = require('debug')('HomeView');

export default {
  name: 'HomeView',
  components: {
  },

  data () {
    return {
      code: ''
    }
  },
  computed: {
  },
  route: {
    data ({ to }) {
      const page = +to.params.page
      document.title = '趣直播'
    }
  },

  created () {
    this.code = this.genCode()
    this.poll()
  },

  destroyed () {
  },
  methods: {
  },

  filters: {

  }
}
</script>

<style lang="stylus">

@import "../stylus/base.styl"

.home-view
  min-height 500px
  .big-word
    font-size 20px
    text-align center
    margin-top 30px
  img
    width 250px

</style>
