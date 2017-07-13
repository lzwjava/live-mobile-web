<template>
  <div class="load-more-bar">
    <pulse-loader class="pulse-loader" :loading="loading" :color="color"></pulse-loader>
    <div class="load-inner" v-show="!loading && haveMore" @click="loadMore">
      点击加载更多
    </div>
    <div class="load-inner" v-show="!loading && !haveMore">
      没有更多了
    </div>
  </div>
</template>

<script type="text/javascript">
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const debug = require('debug')('LoadMoreBar')

export default {
  name: 'LoadMoreBar',
  props: ['haveMore', 'loading'],
  components: {
    'pulse-loader': PulseLoader
  },
  data() {
    return {
      color: '#00bdef'
    }
  },
  methods: {
    loadMore() {
      this.$dispatch('loadMore')
    }
  }
}

</script>

<style media="screen" lang="stylus">

.load-more-bar
  height 40px
  text-align center
  color #999
  .pulse-loader
    margin-top 15px
  .load-inner
    line-height 40px

</style>
