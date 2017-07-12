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

const debug = require('debug')('LiveList')

import util from '../common/util'
import LiveItem from '../components/LiveItem.vue'

export default {
  name: 'LiveList',
  props: ['lives'],
  components: {
    'live-item': LiveItem
  }
}

</script>

<style media="screen" lang="stylus">
</style>
