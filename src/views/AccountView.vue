<template>
  <div class="account-view">
    <ListNav :mode="0" title="账户" />
    <div class="content">
      <div class="balance-section">
        <p class="balance-label">账户余额</p>
        <p class="balance-amount">¥{{ (balance / 100).toFixed(2) }}</p>
      </div>
      <div class="menu-section">
        <div class="menu-item" @click="goWithdraw">提现</div>
        <div class="menu-item" @click="goRecord">收支记录</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListNav from '@/components/ListNav.vue'
import { get } from '@/common/api'

const balance = ref(0)

onMounted(() => {
  get('self/balance').then(data => {
    balance.value = data || 0
  }).catch(() => {})
})

const goWithdraw = () => {}
const goRecord = () => {}
</script>

<style lang="stylus">


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
