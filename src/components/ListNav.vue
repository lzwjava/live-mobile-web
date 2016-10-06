<template>

  <div class="list-nav">

    <div class="segment-control">

      <a href="#" @click.prevent="goList" class="segment-item" :class="{'segment-active': mode==0}">全部直播</a><a href="#" @click.prevent="goMylist" class="segment-item right-item" :class="{'segment-active': mode==1}">我的直播</a>

    </div>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'

var debug = debugFn('ListNav')

export default {
  name: 'ListNav',
  components: [],
  props: ['mode'],
  data() {
    return {
    }
  },
  created() {
    debug('mode: %j', this.mode)
  },
  route: {
    data ({to}) {
    }
  },
  methods: {
    goList() {
      this.$router.go('/lives')
    },
    goMylist() {
      this.$router.go('/mylist')
    }
  },
  events: {
  }
}

</script>

<style media="screen" lang="stylus">

.list-nav
  height 55px
  display flex
  justify-content center
  align-items center
  background #fff
  .segment-control
    border 1px solid #00BDEF
    border-radius 4px
    display flex
    .segment-active
      background #00BDEF
      color #fff !important
    .segment-item
      padding 5px 13px
      color #00BDEF
      font-size 16px
    .right-item
      border-left 1px solid #00BDEF



</style>
