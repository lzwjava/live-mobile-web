<template>

  <div class="home-view">
    <div class="big-word">研发中，敬请期待…</div>
    <button class="weui_btn_primary">按钮</button>

    <div class="">{{tokenResult}}</div>
  </div>

</template>

<script>

import util from '../common/util'
import wechat from '../common/wechat'

var debug = require('debug')('HomeView');

export default {
  name: 'HomeView',
  components: {
  },

  data () {
    return {
      code: '',
      tokenResult: ''
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
    //window.location = util.weixinOauthUrl;
    // wechat.getAccessToken(this)
    var params = util.getParams()
    if (params.code) {
      wechat.getUserAccessToken(this, params.code, function (data) {
        this.tokenResult = data
      })
    } else {
      wechat.oauth2()
    }
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
