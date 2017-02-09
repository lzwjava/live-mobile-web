<template>

  <div class="account-view">

    <div class="balance">
      ¥{{account.balance | moneyAsYuan}}
    </div>

    <div class="balance-title">
      账户余额
    </div>

    <div class="bind-phone-tip" v-if="!curUser.userId">
      <i class="weui-icon-info"></i>您还没有登录，请先<a href="#" class="a-blue" @click.prevent="goLogin">登录</a>
    </div>

    <div class="withdraw-area">

      <div class="withdraw-word">
        提现金额
      </div>

      <div class="input-wrapper">
        <span class="money-icon">¥</span><input class="withdraw-input" autofocus type="number" v-model="amount">
      </div>

      <div class="tip" @click="clickTip">全部提现</div>

      <button class="btn btn-blue btn-withdraw" @click="applyWithdraw">申请提现</button>

    </div>

    <div class="tips-area">
      <p>1.直播门票，5成归主播，3成归邀请者，2成归平台</p>
      <p>2.打赏，7成归主播，3成归平台</p>
      <p>3.如果主播还有未完成直播时，不允许申请提现</p>
      <p>4.为了能转账给您，必须先关注「平方根科技」服务号</p>
      <p>5.将在3个工作日内处理申请</p>
      <p>6.如需帮助请联系客服(微信号：lzwjava2048)</p>
    </div>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'

var debug = debugFn('ListNav')

export default {
  name: 'AccountView',
  components: [],
  data() {
    return {
      account: {},
      curUser: {},
      amount: null,
    }
  },
  route: {
    data ({to}) {
      util.loading(this)
      Promise.all([
        api.fetchCurUserNoError(this),
        api.get(this, 'accounts/me')
      ]).then((values) => {
        util.loaded(this)
        this.curUser = values[0]
        this.account = values[1]
      }, util.promiseErrorFn(this))
    }
  },
  methods: {
    goBindPhone() {
      this.$router.go('/bindPhone?from=/account')
    },
    clickTip() {
      this.amount = this.account.balance / 100.0
    },
    goLogin() {
      this.$dispatch('loginOrRegister', 0)
    },
    applyWithdraw() {
      util.loading(this)
      api.post(this, 'withdraws', {
        amount: Math.floor(this.amount * 100)
      }).then((data) => {
        util.loaded(this)
        util.show(this, 'success', '已发出申请，请等待处理')
      }, util.promiseErrorFn(this))
    }
  },
  events: {
  }
}

</script>

<style media="screen" lang="stylus">

.account-view
  text-align center
  min-height 100%
  .balance
    margin-top 20px
    color #00BDEF
    font-size 36px
  .balance-title
    color #828282
  .bind-phone-tip
    margin-top 30px
    font-size 16px
    i
      vertical-align text-top
      font-size 20px
  .withdraw-area
    margin 30px 30px
    text-align left
    background #F8F8F8
    border-radius 5px
    padding 10px
    .btn-withdraw
      margin-top 20px
      font-size 20px
      width 100%
    .withdraw-word
      font-size 14px
    .tip
      font-size 14px
      color #3A75BA
      margin-top 10px
    .input-wrapper
      border-bottom solid 1px #CFCFCF
      padding-bottom 5px
      .money-icon
        font-size 28px
      .withdraw-input
        margin-top 10px
        font-size 34px
        width 200px
        font-weight bold
        background #0000
        margin-left 10px
  .tips-area
    margin 20px 30px
    text-align left
    p
      color #828282
      font-size 14px


</style>
