<template>

  <ul class="tab-bar">

    <li class="tab-item live" @click="goLive" v-bind:class="{active: activeIndex == 0}">
      <img class="tab-icon" src="../img/tab_live_n.png" v-show="activeIndex == 1"></img>

      <img class="tab-icon" src="../img/tab_live_p.png" v-show="activeIndex == 0"></img>

      <div class="tab-title">
        直播
      </div>

    </li>

    <li class="tab-item me" @click="goProfile" v-bind:class="{active: activeIndex == 1}">

      <img class="tab-icon" src="../img/tab_me_n.png" v-show="activeIndex == 0"></img>

      <img class="tab-icon" src="../img/tab_me_p.png" v-show="activeIndex == 1"></img>

      <div class="tab-title">
        个人中心
      </div>
    </li>

  </ul>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'

var debug = debugFn('Tabbar')

export default {
  name: 'Tabbar',
  props: ['activeIndex'],
  components: [],
  data() {
    return {
    }
  },
  route: {
    data ({to}) {
    }
  },
  methods: {
    goLive() {
      this.$router.go('/lives')
    },
    goProfile() {
      this.$router.go('/profile')
    }
  },
  events: {
  }
}


</script>

<style media="screen" lang="stylus">

.tab-bar
  position fixed
  width 100%
  bottom 0
  display flex
  height 54px
  z-index 200
  background-color hsla(0,0%, 100%,.961)
  max-width 700px
  .tab-item
    flex 1
    display flex
    justify-content center
    align-items center
    flex-direction column
    .tab-icon
       width 20px
    &.active
      .tab-title
         color #00BDEF
    .tab-title
       color #848484
       font-size 14px

</style>
