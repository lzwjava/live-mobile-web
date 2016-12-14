<template>

  <div class="live-list">

    <ul class="live-list-ul">
      <li class="live-item-li" v-for="live in lives">
        <live-item :live="live"></live-item>
      </li>
      <div class="load-bar">
        <pulse-loader class="pulse-loader" :loading="loading" :color="color"></pulse-loader>
        <div v-show="!loading">
          <span v-show="haveMore" @click="loadMore">点击加载更多</span>
          <span v-show="!haveMore">没有更多了</span>
        </div>
      </div>
    </ul>

  </div>

</template>

<script type="text/javascript">

var debug = require('debug')('RecommendLiveList')

import util from '../common/util'
import LiveItem from '../components/LiveItem.vue'
import http from '../common/api'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'RecommendLiveList',
  props: ['skipLiveId'],
  data() {
    return {
      lives: [],
      haveMore: true,
      loading: false,
      color: '#00bdef'
    }
  },
  created() {
  },
  ready() {
  },
  components: {
    'live-item': LiveItem,
    'pulse-loader':PulseLoader
  },
  methods: {
    loadData(limit, skip) {
      this.loading = true
      http.get(this, 'lives/recommend', {
        limit: limit,
        skip: skip,
        skipLiveId: this.skipLiveId
      }).then((data) => {
        this.loading = false
        this.lives = this.lives.concat(data)
        if (data.length < limit) {
          this.haveMore = false
        }
      }).catch(util.promiseErrorFn(this))
    },
    loadMore() {
      this.loadData(10, this.lives.length)
    }
  },
  watch: {
    'skipLiveId': function (val, oldVal) {
      this.lives = []
      this.haveMore = true
      this.loadData(3, 0)
    }
  }
}

</script>

<style media="screen" lang="stylus">

.live-list-ul
  &:first-child
    border-top 1px solid #eee
  .load-bar
    height 40px
    text-align center
    color #999
    .pulse-loader
      margin-top 15px
    span
      line-height 40px

</style>
