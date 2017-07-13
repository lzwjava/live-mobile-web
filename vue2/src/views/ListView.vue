<template>
  <div class="list-view">
    <div class="tab-area">
      <div class="tab-item" @click="showNewLiveList" v-bind:class="{active: curTab === 0}">
        最新直播
      </div>
      <div class="tab-item" @click="showHotLiveList" v-bind:class="{active: curTab === 1}">
        热门直播
      </div>
    </div>
    <div class="live-container">
      <live-list :lives="lives"></live-list>
    </div>
    <tab-bar :active-index="0"></tab-bar>
  </div>
</template>

<script type="text/javascript">
import util from '@/common/util'
import http from '@/common/api'
import wechat from '@/common/wechat'

import LiveList from '@/components/LiveList.vue'
import Tabbar from '@/components/Tabbar.vue'

export default {
  name: 'LiveView',
  components: {
    'live-list': LiveList,
    'tab-bar': Tabbar
  },
  data () {
    return {
      lives: [],
      hotLives: [],
      newLives: [],
      curTab: 0,
    }
  },
  created () {
    util.loading(this)
    Promise.all([
      http.get(this, 'lives/listOrderByPlanTs'),
      http.get(this, 'lives/listOrderByAttendance'),
      wechat.configWeixin(this)
    ]).then(values => {
      util.loaded(this)
      this.livesNew = values[0]
      this.livesHot = values[1]
      this.lives = this.livesNew
      wechat.showOptionMenu()
      wechat.shareApp(this)
    }).catch(util.promiseErrorFn(this))
  },
  methods: {
    showNewLiveList () {
      this.curTab = 0
      this.lives = this.livesNew
    },

    showHotLiveList () {
      this.curTab = 1
      this.lives = this.livesHot
    },

    goSubscribe () {
      this.$router.push('/contact')
    },
    goCreate () {
      this.$router.push('/scan')
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

  .tab-area
    display flex
    height 40px
    .tab-item
      flex-grow 1
      background-color #fff
      text-align center
      line-height 40px
      transition all .5s ease
      color rgb(112, 112, 112)
      &.active
        color #00BDEF
        border-bottom 1px solid #00BDEF

</style>
