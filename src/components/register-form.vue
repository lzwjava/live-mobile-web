<template>

  <div class="absolute-center register-form" @click="stop($event)">

    <div v-show="step == 0" class="step-one">
      <div class="input-mobile-tips">请输入您的手机号码，<br>我们将在直播前短信通知您。</div>

      <input class="mobile-input" type="number" v-model="mobile">

      <button class="btn btn-blue" @click="requestSms">下一步</button>
    </div>

    <div v-show="step == 1" class="step-two">
      <div class="sms-code-tips">
        请输入收到的验证码
      </div>

      <input class="sms-code-input" type="number" v-model="code">

      <button class="btn btn-blue" @click="registerBySns">下一步</button>

    </div>

    <div v-show="step == 2" class="step-three">
      已完成手机号码的绑定。请支付门票。
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
      step: 1,
      liveId: 0,
      mobile: '',
      code: ''
    }
  },
  computed: {
  },
  created() {
    if (this.curUser.openId) {
      this.step = 0
    } else if (this.curUser.userId){
      this.step = 2
    }
  },
  methods: {
    stop (e){
				e.stopPropagation();
		},
    requestSms: function () {
      this.$http.post('requestSmsCode',{
        mobilePhoneNumber: this.mobile
      }).then((resp) => {
        if (util.filterError(this, resp)) {
          this.step = 1
        }
      }, util.httpErrorFn(this))
    },
    registerBySns: function () {
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
  height 300px
  background-color #fff
  .sms-code-input
  .mobile-input
    width 90%
    height 30px
    border 1px solid rgba(40,47,49,.3)
    box-shadow 0 1px 4px rgba(0,0,0,0.03)


</style>
