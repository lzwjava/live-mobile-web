<template>
  <div class="room-view">
    <ListNav :mode="0" title="主播主页" />
    <div class="room-content" v-if="user.userId">
      <div class="user-header">
        <UserAvatar :user="user" />
        <div class="user-info">
          <p class="username">{{ user.username }}</p>
          <p class="bio">{{ user.bio || '暂无简介' }}</p>
        </div>
      </div>
      <div class="lives-section">
        <h3>直播列表</h3>
        <LiveList v-if="lives.length > 0" :lives="lives" />
        <div v-else class="empty-tip">暂无直播</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import UserAvatar from '@/components/user-avatar.vue'
import LiveList from '@/components/LiveList.vue'
import { get } from '@/common/api'

const route = useRoute()
const user = ref({})
const lives = ref([])

onMounted(() => {
  const userId = route.params.userId
  Promise.all([
    get(`users/${userId}`),
    get(`lives/user/${userId}`)
  ]).then(values => {
    user.value = values[0]
    lives.value = values[1] || []
  }).catch(() => {
    // handle error
  })
})
</script>

<style lang="stylus">


.room-view
  .room-cover
    background url('../img/room-cover.jpg')
    background-size cover
    width 100%
    height 220px
    position relative
    .room-info
      position absolute
      left 0
      right 0
      bottom 0
    .room-avatar
      width 60px
      height 60px
      margin-left 20px
      margin-bottom 20px
    .room-name
      margin-left 10px
      display inline-block
      vertical-align top
      padding-top 20px
      color #fff
  .createLive
    width 100%
    position relative
    .createLiveBtn
      width 94%
      display block
      overflow hidden
      background-color #00bdef
      color white
      border-radius 5px
      margin 3%
      height 35px
  .tab-area
    display flex
    height 40px
    .tab-item
      flex-grow 1
      background-color #fff
      text-align center
      line-height 40px
      transition all .5s ease
      color rgb(112, 112, 112)
      &.active
        color #00BDEF
        border-bottom 1px solid #00BDEF


</style>
