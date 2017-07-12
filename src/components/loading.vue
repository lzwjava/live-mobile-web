<template>
  <div>
    <logo class="loading center" v-show="loading"></logo>
    <div v-show="!loading">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/javascript">

import Logo from '../components/logo.vue'
const debug = require('debug')('loading')

export default {
  name: 'loading',
  data () {
    return {
      loading: true
    }
  },
  components: {
    'logo': Logo
  },
  events: {
    'loaded': function () {
      this.loading = false;
    },
    'loading': function () {
      this.loading = true;
    }
  }
};

</script>

<style lang="stylus">
</style>
