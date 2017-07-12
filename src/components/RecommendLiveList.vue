<template>

  <div class="live-list">

    <ul class="live-list-ul">
      <li class="live-item-li" v-for="live in lives">
        <live-item :live="live"></live-item>
      </li>

      <load-more-bar :have-more="haveMore" :loading="loading"></load-more-bar>

    </ul>

  </div>

</template>

<script type="text/javascript">

const debug = require('debug')('RecommendLiveList')

import util from '../common/util'
import LiveItem from '../components/LiveItem.vue'
import http from '../common/api'
import LoadMoreBar from '../components/LoadMoreBar.vue'

export default {
  name: 'RecommendLiveList',
  props: ['skipLiveId'],
  data () {
    return {
      lives: [],
      haveMore: true,
      loading: false
    }
  },
  ready() {
    this.loadData(3, 0)
  },
  components: {
    'live-item': LiveItem,
    'load-more-bar': LoadMoreBar
  },
  methods: {
    loadData (limit, skip) {
      this.loading = true
      http.get(this, 'lives/recommend', {
        limit, skip, skipLiveId: this.skipLiveId
      }).then(data => {
        this.loading = false
        this.lives = this.lives.concat(data)
        if (data.length < limit) {
          this.haveMore = false
        }
      }).catch(util.promiseErrorFn(this))
    }
  },
  events: {
    'loadMore': function () {
      this.loadData(20, this.lives.length)
    }
  }
}

</script>

<style media="screen" lang="stylus">

.live-list-ul
  &:first-child
    border-top 1px solid #eee

</style>
