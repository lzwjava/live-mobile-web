<template>

  <div class="absolute-center register-form" @click="stop($event)">

    <div v-show="step == 0" class="step-one">
      <div class="tips input-mobile-tips">请输入您的手机号码，<br>我们将在直播前短信通知您。</div>

      <input class="mobile-input" type="number" v-model="mobile">

      <button class="btn btn-blue" @click="requestSms">下一步</button>
    </div>

    <div v-show="step == 1" class="step-two">
      <div class="tips sms-code-tips">
        请输入收到的验证码
      </div>

      <input class="sms-code-input" type="number" v-model="code">

      <button class="btn btn-blue" @click="registerBySns">下一步</button>

    </div>

    <div v-show="step == 2" class="step-three">
      <div class="tips">
        {{lastStepTip}}
      </div>

      <img class="wepay" src="../img/wechat.png" alt="" />
    </div>

  </div>

</template>


<script type="text/javascript">

var util = require('../common/util')
var http = require('../common/http')
var debug = require('debug')('register-form')

export default {
  name: 'RegisterForm',
  props: ['curUser'],
  components: {
  },
  data() {
    return {
      step: 0,
      liveId: 0,
      mobile: '',
      code: '',
      isSignup: false
    }
  },
  computed: {
    lastStepTip: function () {
      if (this.isSignup) {
        return '请支付门票。'
      } else {
        return '已完成手机号码的绑定，请支付门票。'
      }
    }
  },
  created() {
    if (this.curUser.openId) {
      this.isSignup = false
    } else if (this.curUser.userId){
      this.isSignup = true
    }
    if (this.isSignup) {
      this.step = 2
    } else {
      this.step = 0
    }
  },
  methods: {
    stop (e){
				e.stopPropagation();
		},
    requestSms: function () {
      if (!this.mobile) {
        util.show(this, 'error', '请输入手机号码');
        return
      }
      this.$http.post('requestSmsCode',{
        mobilePhoneNumber: this.mobile
      }).then((resp) => {
        if (util.filterError(this, resp)) {
          this.step = 1
        }
      }, util.httpErrorFn(this))
    },
    registerBySns: function () {
      if (!this.code) {
        util.show(this, 'error', '请输入验证码');
        return
      }
      this.$http.post('users/registerBySns', {
        openId: this.curUser.openId,
        platform: 'wechat',
        mobilePhoneNumber: this.mobile,
        smsCode: this.code
      }).then((resp) => {
        if (util.filterError(this, resp)) {
          this.step = 2
        }
      })
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/base.styl"

.register-form
  width 300px
  height 250px
  background-color #fff
  border-radius 5px
  input
    width 90%
    height 35px
    margin-left 5%
    border 1px solid rgba(40,47,49,.3)
    box-shadow 0 1px 4px rgba(0,0,0,0.03)
    border-radius 3px
    padding 0 5px
    box-sizing border-box
    font-size 16px
  .tips
    font-size 16px
    padding 30px 0
    height 50px
    display flex
    justify-content center
    align-items center
  button
    width 90%
    margin-left 5%
    margin-top 30px
  .step-three
    .wepay
      width 80px
      margin-left 110px

</style>
