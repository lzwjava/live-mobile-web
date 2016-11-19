<template>

  <div class="reward-form" @click="stop($event)">
    <user-avatar :user="live.owner"></user-avatar>

    <ul>
      <li v-for="amount in amounts" @click="reward(amount)">
        {{amount|moneyAsYuan}}元
      </li>
    </ul>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'
import wechat from '../common/wechat'

var debug = debugFn('RewardForm')

export default {
  name: 'RewardForm',
  components: [],
  props: ['live'],
  data() {
    return {
      amounts: [2 * 100, 5 * 100, 10 * 100, 20 * 100, 50 * 100, 100 * 100]
    }
  },
  route: {
    data ({to}) {
    }
  },
  methods: {
    reward(amount) {
      util.loading(this)
      api.post('rewards', {
        amount: amount,
        channel: 'wechat_h5',
        liveId
      }).then((data) => {
        util.loaded(this)
        return wechat.wxPay(data)
      }).then(() => {
        util.show('success', '打赏成功')
        this.$parent.overlay = false;
      }).catch(util.promiseErrorFn(this))
    },
    stop (e) {
      e.stopPropagation()
    }
  },
  events: {

  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.register-form
  @extend .absolute-center
  max-width 350px
  height 400px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px


</style>
