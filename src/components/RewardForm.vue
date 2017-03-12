<template>

  <div class="reward-form" @click="stop($event)">

    <div class="close-btn" @click="close">x</div>

    <div class="oval">

    </div>

    <user-avatar :user="live.owner"></user-avatar>
    <p class="ownername">
      赞赏{{live.owner.username}}
    </p>

    <ul class="amount-list">
      <li class="amount-cell" v-for="amount in amounts" @click="reward(amount)">
        <span class="amount-num">{{amount|moneyAsYuan}}</span>
        <span class="amount-unit">元</span>
      </li>
    </ul>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'

var debug = debugFn('RewardForm')

export default {
  name: 'RewardForm',
  components: {
    UserAvatar
  },
  props: ['live'],
  data() {
    return {
      amounts: [2 * 100, 5 * 100, 8 * 100, 10 * 100, 20 * 100, 50 * 100]
    }
  },
  route: {
    data ({to}) {
    }
  },
  methods: {
    reward(amount) {
      this.$dispatch('reward', amount)
      this.$parent.overlay = false
    },
    stop (e) {
      e.stopPropagation()
    },
    close() {
      this.$parent.overlay = false
    }
  },
  events: {

  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.reward-form
  @extend .absolute-center
  max-width 300px
  height 400px
  text-align center
  background #fff
  overflow hidden
  border-radius 15px
  .close-btn
    float right
    color #fff
    margin-right 10px
    margin-top 10px
    line-height 10px
  .oval
    height 100px
    width 100%
    background #d65239
    border-radius 50%
    margin-top -40px
  .ownername
    color #d65239
    font-size 18px
    margin-top 20px
  .avatar
    margin-top -30px
    width 60px
    height 60px
  .amount-list
    display flex
    flex-wrap wrap
    margin-top 30px
    padding 0 10px
    .amount-cell
      flex-grow 1
      width 20%
      margin 30px 5px 0 5px
      height 40px
      border-color #d65239
      border-style solid
      border-width 3px
      border-radius 8px
      color #d65239
      padding 5px
      .amount-num
        font-size 24px

</style>
