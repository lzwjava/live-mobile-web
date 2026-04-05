<template>
  <div class="bind-phone-view">
    <ListNav :mode="0" title="绑定手机" />
    <div class="content">
      <div class="form-group">
        <input type="text" v-model="phone" placeholder="请输入手机号" />
      </div>
      <div class="form-group">
        <input type="text" v-model="code" placeholder="验证码" />
        <button @click="sendCode" :disabled="countdown > 0">{{ countdownText }}</button>
      </div>
      <button class="btn btn-blue submit-btn" @click="bindPhone">绑定</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ListNav from '@/components/ListNav.vue'
import { post } from '@/common/api'

const phone = ref('')
const code = ref('')
const countdown = ref(0)

const countdownText = computed(() => countdown.value > 0 ? `${countdown.value}s后重发` : '发送验证码')

const sendCode = () => {
  if (countdown.value > 0) return
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
  // Send code via API
}

const bindPhone = () => {
  if (!phone.value || !code.value) return
  post('self/bindPhone', { phone: phone.value, code: code.value }).then(() => {
    alert('绑定成功')
  }).catch(() => {})
}
</script>

<style lang="stylus">



.bind-phone-view
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
      border 0
      outline 0
      border-bottom 1px solid rgba(40,47,49,.3)
      box-shadow 0 1px 4px rgba(0,0,0,0.03)
      border-radius 3px
      padding 0 5px
      box-sizing border-box
      font-size 18px
      text-align center
    .mobile-input
    .sms-code-area
      display block
      width 60%
      height 40px
      margin-top 60px
      margin-left 20%
      line-height 40px
    .sms-code-input
      width 65%
      margin 0
      line-height 40px
    .btn-send
      width 30%
      font-size 12px
      padding 0
      height 30px
      vertical-align middle
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
    .finish-btn
      width 150px
      height 44px
      margin-top 40px
      font-size 16px



</style>
