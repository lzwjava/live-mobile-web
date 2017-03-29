<template>

  <div class="list-view">

    <!-- <list-nav :mode="1" :live-id="0"></list-nav> -->

    <div class="live-container">

      <!-- <div class="subscribe" @click="goSubscribe">
        <span class="subscribe-btn" >订阅直播</span>
      </div> -->

      <!-- <div class="subscribe" @click="goCreate">
        <span class="subscribe-btn" >发起直播</span>
      </div> -->

      <live-list :lives="lives"></live-list>
    </div>

    <tab-bar :active-index="0"></tab-bar>

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'
import LiveList from '../components/LiveList.vue'
import ListNav from '../components/ListNav.vue'
import Tabbar from '../components/Tabbar.vue'

export default {
  name: 'LiveView',
  components: {
    'live-list': LiveList,
    'list-nav': ListNav,
    'tab-bar': Tabbar
  },
  data() {
    return {
      lives: []
    }
  },
  created() {
    util.loading(this)
    Promise.all([
      http.get(this, 'lives/on'),
      wechat.configWeixin(this)
    ]).then(values => {
      util.loaded(this)

      this.lives = values[0]

      wechat.showOptionMenu()
      wechat.shareApp(this)

    }).catch(util.promiseErrorFn(this))
  },
  route: {
    data ({to}) {
      util.initTitle()
    }
  },
  methods: {
    goSubscribe() {
      this.$router.go('/contact')
    },
    goCreate() {
      this.$router.go('/scan')
    }
  }
}

</script>

<style lang="stylus">

.list-view
  .live-container
    position relative
    width 100%
    min-height 100%
    margin-bottom 54px

</style>
