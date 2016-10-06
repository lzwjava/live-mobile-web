<template>

  <div class="list-view">

    <list-nav :mode="0"></list-nav>

    <live-list :lives="lives"></live-list>

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
      lives: [],
      curUser: {}
    }
  },
  created() {
  },
  route: {
    data ({to}) {
      util.loading(this)
      Promise.all([
        http.get(this, 'lives/on'),
        http.fetchCurUserNoError(this)
      ]).then(values => {
        util.loaded(this)

        this.lives = values[0]
        this.curUser = values[1]

        wechat.configWeixin(this)
        .then(() => {
          wechat.showOptionMenu()
          wechat.shareApp(this)
        })
      }).catch(util.promiseErrorFn(this))
    }
  },
  methods: {
  }
}

</script>

<style lang="stylus">

</style>
