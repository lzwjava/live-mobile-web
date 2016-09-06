<template>
  <div id="wrapper">
    <my-nav></my-nav>

    <!-- main view -->
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
  </div>
</template>

<script type="text/javascript">

import Nav from './nav.vue'

export default {
  name: 'App',
  components: {
    'my-nav': Nav
  },
  data() {
    return {
    }
  },
  events: {
    'show-msg': function (type, message) {
      this.$broadcast('show-tip-msg', type, message)
    },
    'updateUser': function (user) {
      this.$broadcast('updateNavUser', user)
    },
  }
}

</script>

<style lang="stylus">

@import "../stylus/variables.styl"
@import "../stylus/base.styl"

#wrapper
  position relative
  width 100%
  min-height 80px

.view
  position absolute
  width 100%
  transition opacity .2s ease
  box-sizing border-box
  background-color #e7e7e7
  &.v-enter, &.v-leave
    opacity 0

</style>
