<template>
  <ul class="tab-bar">
    <li class="tab-item live" :class="{ active: activeIndex === 0 }" @click="goLive">
      <img v-if="activeIndex === 1" class="tab-icon" src="/img/tab_live_n.png" />
      <img v-else class="tab-icon" src="/img/tab_live_p.png" />
      <div class="tab-title">直播</div>
    </li>

    <li class="tab-item me" :class="{ active: activeIndex === 1 }" @click="goProfile">
      <img v-if="activeIndex === 0" class="tab-icon" src="/img/tab_me_n.png" />
      <img v-else class="tab-icon" src="/img/tab_me_p.png" />
      <div class="tab-title">个人中心</div>
    </li>
  </ul>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  activeIndex: {
    type: Number,
    default: 0
  }
})

const router = useRouter()

const goLive = () => {
  router.push('/lives')
}

const goProfile = () => {
  router.push('/profile')
}
</script>

<style lang="stylus">


.tab-bar
  position fixed
  width 100%
  bottom 0
  display flex
  height 54px
  z-index 200
  background-color hsla(0,0%, 100%,.961)
  max-width 700px
  .tab-item
    flex 1
    display flex
    justify-content center
    align-items center
    flex-direction column
    .tab-icon
       width 20px
    &.active
      .tab-title
         color #00BDEF
    .tab-title
       color #848484
       font-size 14px


</style>
