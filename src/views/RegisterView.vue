<template>
  <div class="register-view">
    <div class="register-inside">
      <div v-show="step == 0" class="step-one">
        <div class="tips input-mobile-tips">嘿，微信登录成功<br> 请接着绑定手机号 <br>以便短信通知您直播开始</div>

        <input class="mobile-input" type="number" v-model="mobile" autofocus>

        <button class="btn btn-blue" @click="requestSms">继续</button>

        <p class="small-tips">国外手机号码或遇到问题请<a href="#" @click.prevent="goContact">联系我们</a></p>

      </div>

      <div v-show="step == 1" class="step-two">
        <div class="tips sms-code-tips">
          验证码已发送给 <br>您的手机{{mobile}} <br>请稍等片刻输入验证码
        </div>

        <input class="sms-code-input" type="string" v-model="code" autofocus>

        <button class="btn btn-blue" @click="registerBySns">完成</button>

        <p class="small-tips">这可能要花一些时间，遇到问题请<a href="#" @click.prevent="goContact">联系我们</a></p>

      </div>

    </div>

  </div>
</template>

<script type="text/javascript">

import {Button} from 'vue-weui'
import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'

var debug = require('debug')('register-form')

export default {
  name: 'RegisterView',
  props: [],
  components: {
    'weui-button': Button
  },
  data() {
    return {
      step: 0,
      liveId: 0,
      mobile: '',
      code: '',
      loading: false,
      openId: '',
      redirectUrl: ''
    }
  },
  computed: {
  },
  created() {
  },
  route: {
    data({to}) {
      var query = this.$route.query;

      if (query.openId) {
        this.openId = query.openId
        this.registerBySns()
      } else {
        if (query.liveId) {
          window.localStorage.setItem('type', 'live')
          window.localStorage.setItem('registerLiveId', query.liveId)
        } else {
          window.localStorage.setItem('type', query.type)
          window.localStorage.setItem('packetId', query.packetId)
        }
        // this.goSucceed()
        wechat.oauth2(this)
      }
    }
  },
  methods: {
    requestSms: function () {
      if (!this.mobile) {
        util.show(this, 'error', '请输入手机号码');
        return
      }
      util.loading(this)
      this.$http.post('requestSmsCode',{
        mobilePhoneNumber: this.mobile
      }).then((resp) => {
        util.loaded(this)
        if (util.filterError(this, resp)) {
          this.step = 1
        }
      }, util.httpErrorFn(this))
    },
    registerBySns: function () {
      util.loading(this)
      http.post(this, 'users/registerBySns', {
        openId: this.openId,
        platform: 'wechat'
      }).then((data) => {
        util.loaded(this)
        this.$dispatch('toast', '注册成功', 1000, () => {
          //window.location.href = ''
          this.goSucceed()
        })
      }, util.promiseErrorFn(this))
    },
    goContact() {
      this.$router.go('/contact')
    },
    goSucceed() {
      var type = window.localStorage.getItem('type')
      if (type == 'live') {
        var liveId = window.localStorage.getItem('registerLiveId')
        if (liveId && liveId !=0) {
          this.$router.go('/intro/' + liveId)
        } else {
          this.$router.go('/lives')
        }
      } else if (type == 'packet') {
        var packetId = window.localStorage.getItem('packetId')
        this.$router.go('/packets/' + packetId)
      }
    }
  }
}

</script>


<style lang="stylus">

@import "../stylus/base.styl"

.register-view
  position absolute
  width 100%
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  .register-inside
    position relative
    width 100%
    text-align center
    input
      display block
      width 60%
      height 40px
      margin-top 60px
      margin-left 20%
      border 0
      outline 0
      border-bottom 1px solid rgba(40,47,49,.3)
      box-shadow 0 1px 4px rgba(0,0,0,0.03)
      border-radius 3px
      padding 0 5px
      box-sizing border-box
      font-size 18px
      text-align center
    .tips
      font-size 24px
      margin-top 60px
      text-align center
    .small-tips
      margin-top 40px
      font-size 16px
      color #8C9CA3
      a
        color #00ABD8
    button
      width 150px
      height 44px
      margin-top 40px
      font-size 16px
    .step-three
      .wepay
        width 80px
        margin-left 110px

</style>
