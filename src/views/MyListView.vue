<template>

  <div class="my-list-view">

    <list-nav :mode="2"></list-nav>

    <div v-show="login == 1">
      <p class="lives-title">
        我参与的直播
      </p>
      <live-list :lives="attendedLives"></live-list>

      <p class="lives-title">
        我发起的直播
      </p>

      <live-list :lives="myLives"></live-list>
    </div>

    <div class="not-login" v-show="login == 2">

      <p>您尚未登录或注册</p>

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
  name: 'MyListView',
  components:{
    'live-list': LiveList,
    'list-nav': ListNav
  },
  data() {
    return {
      attendedLives:[],
      myLives:[],
      login: 0
    }
  },
  route: {
    data({to}) {
      util.loading(this)
      Promise.all([
        http.get(this, 'lives/attended'),
        http.get(this, 'lives/me')
      ]).then(values => {
        util.loaded(this)
        this.login = 1
        this.attendedLives = values[0]
        this.myLives = values[1]
      }).catch((error) => {
        util.loaded(this)
        if (error == '当前没有用户登录') {
          this.login = 2
        } else {
          util.show(this, 'error', error)
        }
      })
    }
  },
  methods: {
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
