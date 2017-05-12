<template>
  <div class="live-item" @click="goIntro">
    <user-avatar :user="live.owner"></user-avatar>

    <div class="live-info">
      <p class="subject">{{live.subject}}</p>
      <div class="">
        <span class="owner-name">{{live.owner.username}}</span>
        <span v-if="live.topic" class="topic">{{live.topic.name}}</span>
      </div>

      <div class="live-item-tag">

        <span class="time-label" v-show="live.status == 10">
          {{timeGap(live)}}开始
        </span>

        <span class="on-label" v-show="live.status == 20 || live.status == 25">
          正在直播
        </span>

        <span class="attend-label">
          {{live.attendanceCount}} 人参与
        </span>

        <span class="amount-label" v-bind:class="{free: live.needPay == 0}">{{live.needPay ? '¥' + (live.amount / 100.0) : '¥0' }}</span>

      </div>
    </div>

    <svg fill="currentColor" class="arrow" width="48" height="48" viewBox="0 0 48 48"><title>arrow</title><path d="M19.608308 11.291022c-.39064-.387697-1.037868-.388717-1.42788-.019096l-1.879672 1.7814c-.397956.37715-.40446 1.001224-.020242 1.388148l9.488537 9.55542-9.488535 9.55542c-.386777.389504-.36977 1.01853.020242 1.38815l1.879672 1.7814c.397955.37715 1.041186.364683 1.42788-.019096l12.09502-12.003886c.39064-.387697.386693-1.020195 0-1.403974L19.60831 11.291022z" fill-rule="evenodd"></path></svg>
  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import UserAvatar from '../components/user-avatar.vue'

var debug = require('debug')('LiveItem')

export default {
  name: 'LiveItem',
  props: ['live'],
  components: {
    'user-avatar': UserAvatar
  },
  created() {
  },
  methods: {
    timeGap (live) {
      return util.timeGap(live.planTs)
    },
    goIntro() {
      this.$router.go('/intro/' + this.live.liveId)
    }
  }
}

</script>

<style lang="stylus">

.live-item
  background-color #fff
  height 80px
  padding 10px 10px
  position relative
  border-bottom 1px solid #eee
  .avatar
      width 50px
      height 50px
      display inline-block
      margin-top 15px
  .live-info
    display inline-block
    position absolute
    top 10px
    bottom 10px
    left 70px
    right 24px
    height 80px
    .owner-name
      color #6E6E6E
    .topic
      color #6E6E6E
      float right
      border 1px solid #6E6E6E
      border-radius 3px
      padding 0px 3px
      font-size 12px
      margin-right 10px
    p.subject
      height 30px
      overflow hidden
      text-overflow ellipsis
      word-wrap break-word
      font-weight bold
    .on-label
      color #fff
      background-color #00BDEF
      border-color #64b3f1
      border-radius 3px
      font-size 14px
      line-height 18px
      padding 3px 5px
      font-size 14px
      margin-right 10px
    .time-label
      color #00bdef
      border 1px solid #00bdef
      border-radius 3px
      padding 2px 3px
      font-size 14px
      margin-right 10px
    .attend-label
      font-size 14px
    .amount-label
      font-size 14px
      color #828282
      margin-left 10px
      float right
      margin-right 30px
      &.free
        text-decoration line-through
  .arrow
    float right
    color #cecee0
    width 24px
    height 24px
    margin-top 25px

</style>
