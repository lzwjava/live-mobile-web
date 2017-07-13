<template>
  <div class="avatar">
    <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.username" :title="user.username" />
    <span v-if="!user.avatarUrl" style="{background-color: spanBgColor, color: spanColor}">{{user.username}}</span>
  </div>
</template>
<script>
  const debug = require('debug')('avatar')
  const escape = require('@/common/util').escape
  const wordColor = require('word-color')
  module.exports = {
    props: ['user'],
    data () {
      return {
        spanBgColor: '',
        spanColor: 'white'
      }
    },
    compiled: function () {
      const user = this.user
      // 因为父对象的 user 一开始可能没有数据
      if (!user.username) return
      debug('user: %j', user)
      if (!user.avatarUrl) {
        const bg = wordColor.rgb(user.username)
        if ((bg[0] * 299 + bg[1] * 587 + bg[2] * 114) > 200000) {
          this.spanColor = 'black'
        }
        this.spanBgColor = 'rgb(' + bg.join(',') + ')'
        user.username = escape(user.username.charAt(0).toUpperCase())
        debug('avatarUrl: ' + user.avatarUrl)
      }
    }
  }
</script>

<style lang="stylus">

.avatar
  display inline-block
  text-decoration none
  &:hover
    opacity 0.8
  img
    position relative

.avatar span, .avatar img
  display inline-block
  width 100%
  height 100%
  color white
  text-align center
  font-size 24px
  border-radius 50%

.avatar.circle span, .avatar.circle img
  border-radius 50%

</style>
