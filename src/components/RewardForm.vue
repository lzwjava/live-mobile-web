<template>
  <div class="reward-form" @click.stop>
    <div class="close-btn" @click="close">x</div>

    <div class="oval"></div>

    <UserAvatar :user="live.owner" />

    <p class="ownername">
      赞赏{{ live.owner?.username }}
    </p>

    <ul class="amount-list">
      <li class="amount-cell" v-for="amount in amounts" :key="amount" @click="reward(amount)">
        <span class="amount-num">{{ amount / 100 }}</span>
        <span class="amount-unit">元</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import UserAvatar from './user-avatar.vue'

const props = defineProps({
  live: {
    type: Object,
    default: () => ({ owner: {} })
  }
})

const emit = defineEmits(['reward', 'close'])

const amounts = [200, 500, 800, 1000, 2000, 5000]

const reward = (amount) => {
  emit('reward', amount)
  emit('close')
}

const close = () => {
  emit('close')
}
</script>

<style lang="stylus">



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
