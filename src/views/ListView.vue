<template>

  <div class="list-view">

    <list-nav :mode="1"></list-nav>

    <div>

      <div class="subscribe" @click="goSubscribe">
        <span class="subscribe-btn" >订阅直播</span>
      </div>

      <div class="subscribe" @click="goCreate">
        <span class="subscribe-btn" >创建直播</span>
      </div>

      <live-list :lives="lives"></live-list>
    </div>

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'
import LiveList from '../components/LiveList.vue'
import ListNav from '../components/ListNav.vue'

export default {
  name: 'LiveView',
  components: {
    'live-list': LiveList,
    'list-nav': ListNav
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
      this.$broadcast('updateCurUser')
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
  .subscribe
    border-width 1px 0
    border solid #eee
    background-color #fff
    padding 10px 10px
    position relative
    text-align center
    margin-top 3px
    .subscribe-btn
      color #00ABD8

</style>
