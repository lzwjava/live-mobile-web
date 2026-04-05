<template>
  <div class="list-nav">
    <div class="intro-title" v-if="title">
      <a href="#" class="all-btn" @click.prevent="goAll">全部直播</a>
      <span href="#" class="title">{{ title }}</span>
    </div>

    <div class="segment-control" v-else>
      <a href="#" @click.prevent="goList" class="segment-item" :class="{ 'segment-active': mode === 1 }">全部直播</a>
      <a href="#" @click.prevent="goMylist" class="segment-item right-item" :class="{ 'segment-active': mode === 2 }">我的直播</a>
    </div>

    <div class="right-drop">
      <UserAvatar v-if="curUser?.username" :user="curUser" @click="goProfile" />
      <img v-else class="default-avatar" src="/img/defaultAvatar.png" @click="goProfile" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { curUser as getCurUser } from '@/common/util'
import UserAvatar from './user-avatar.vue'

defineProps({
  mode: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ''
  },
  liveId: {
    type: [Number, String],
    default: 0
  }
})

const router = useRouter()
const curUser = ref({})

onMounted(() => {
  curUser.value = getCurUser({})
})

const goList = () => {
  router.push('/lives')
}

const goMylist = () => {
  router.push('/mylist')
}

const goProfile = () => {
  router.push('/profile')
}

const goAll = () => {
  router.push('/lives')
}
</script>

<style lang="stylus">


.list-nav
  height 55px
  display flex
  justify-content center
  align-items center
  background #fff
  position relative
  .right-drop
    width 100px
    height 100%
    position absolute
    right 0
    .avatar,.default-avatar
      position absolute
      width 35px
      height 35px
      right 15px
      top 50%
      transform translateY(-50%)
  .intro-title
    .all-btn
      color #828282
      position absolute
      left 10px
      font-size 14px
      top 50%
      transform translateY(-50%)
    span
      color #828282
      font-size 18px
      font-weight bold
  .segment-control
    border 1px solid #00BDEF
    border-radius 4px
    display flex
    .segment-active
      background #00BDEF
      color #fff !important
    .segment-item
      padding 5px 13px
      color #00BDEF
      font-size 16px
    .right-item
      border-left 1px solid #00BDEF




</style>
