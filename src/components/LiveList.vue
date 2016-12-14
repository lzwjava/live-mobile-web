<template>

  <div class="live-list">

    <ul class="live-list-ul">
      <li class="live-item-li" v-for="live in lives">
        <live-item :live="live"></live-item>
      </li>
    </ul>

  </div>

</template>

<script type="text/javascript">

var debug = require('debug')('LiveList')

import util from '../common/util'
import LiveItem from '../components/LiveItem.vue'

export default {
  name: 'LiveList',
  props: ['lives'],
  data() {
    return {
    }
  },
  created() {
  },
  ready() {
  },
  components: {
    'live-item': LiveItem
  },
  methods: {
  }
}

</script>

<style media="screen" lang="stylus">

// .live-list-ul
//   .live-item-li

</style>
