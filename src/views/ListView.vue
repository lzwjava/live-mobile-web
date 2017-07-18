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

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'
import LiveList from '../components/LiveList.vue'
import Tabbar from '../components/Tabbar.vue'

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
      totalHeight: 0,
      page: 1,
      tagNext: false,
      totalPage: 0
    }
  },
  created () {
    window.addEventListener('scroll', (function (e) {
      var windowHeight = document.body.clientHeight
      var scrollTop = document.body.scrollTop
      if (scrollTop + windowHeight >= this.makeHeight && this.tagNextFn === false) {
        let page = this.page ++
        this.tagNext = true
        if (page > this.totalPage - 1) return
        this.getNewList(page)
      }
    }).bind(this))

    util.loading(this)
    this.showNewLiveList()
    Promise.all([
      http.get(this, `lives/count`),
      wechat.configWeixin(this)
    ]).then(values => {
      this.totalPage = parseInt(values[0][0].count / 30) + 1
      util.loaded(this)
      wechat.showOptionMenu()
      wechat.shareApp(this)
    }).catch(util.promiseErrorFn(this))
  },
  methods: {
    showNewLiveList () {
      this.page = 1
      this.tagNext = false
      util.loading(this)
      http.get(this, `lives/listOrderByPlanTs?limit=30`)
      .then(data => {
        this.lives = data
        util.loaded(this)
        this.curTab = 0
      })
    },

    showHotLiveList () {
      this.page = 1
      this.tagNext = false
      util.loading(this)
      http.get(this, `lives/listOrderByAttendance?limit=30`)
      .then(data => {
        this.lives = data
        util.loaded(this)
        this.curTab = 1
      })
    },

    goSubscribe () {
      this.$router.go('/contact')
    },
    goCreate () {
      this.$router.go('/scan')
    },
    getNewList (page) {
      http.get(this, `lives/${this.curTab === 0 ? 'listOrderByPlanTs' : 'listOrderByAttendance'}?skip=${page * 30}&limit=30`)
      .then(data => {
        this.lives.push(...data)
        this.tagNext = false
      })
    }
  },
  computed: {
    makeHeight () {
      return 40 + 101 * (this.lives.length - 4)
    },
    tagNextFn () {
      return this.tagNext
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
