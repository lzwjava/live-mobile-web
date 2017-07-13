<template>
  <div class="my-list-view">
    <div>
      <p class="lives-title">
        我参与的直播
      </p>
      <live-list :lives="attendedLives"></live-list>
      <p class="lives-title">
        我发起的直播
      </p>
      <live-list :lives="myLives"></live-list>
    </div>
  </div>
</template>

<script type="text/javascript">

import util from '@/common/util'
import http from '@/common/api'
import LiveList from '@/components/LiveList.vue'
import ListNav from '@/components/ListNav.vue'

export default {
  name: 'MyListView',
  components: {
    'live-list': LiveList,
    'list-nav': ListNav
  },
  data () {
    return {
      attendedLives: [],
      myLives: []
    }
  },
  route: {
    data ({ to }) {
      if (!util.checkInSession(this)) return
      util.loading(this)
      Promise.all([
        http.get(this, 'lives/attended'),
        http.get(this, 'lives/me')
      ]).then(values => {
        util.loaded(this)
        this.login = 1
        this.attendedLives = values[0]
        this.myLives = values[1]
      }, util.promiseErrorFn(this))
    }
  }
}

</script>

<style media="screen" lang="stylus">

.my-list-view
  .lives-title
    color #999
    padding 0 15px
    line-height 35px
    background-color #eee
  .not-login
    text-align center
    p
      margin-top 30px
      color #828282
      font-size 20px
    button
      margin-top 20px

</style>
