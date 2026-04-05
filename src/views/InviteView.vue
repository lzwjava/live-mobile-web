<template>
  <div class="invite-view">
    <ListNav :mode="0" title="邀请榜" />
    <div class="content">
      <div class="invite-list">
        <div class="invite-item" v-for="invite in invites" :key="invite.userId">
          <UserAvatar :user="invite" />
          <div class="invite-info">
            <p class="username">{{ invite.username }}</p>
            <p class="count">{{ invite.count }}人</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import UserAvatar from '@/components/user-avatar.vue'
import { get } from '@/common/api'

const route = useRoute()
const invites = ref([])

onMounted(() => {
  const liveId = route.params.liveId
  get('attendances/invites', { liveId, limit: 100 }).then(data => {
    invites.value = data || []
  }).catch(() => {})
})
</script>

<style lang="stylus">



.invite-view
  font-size 16px
  .invite-head
    background url('../img/invite-cover.jpg')
    background-size cover
    width 100%
    height 220px
    position relative
  .title
    text-align center
  .me
    margin-top 10px
    background-color #fff
    padding 5px 10px
    margin-bottom 5px
    .avatar
      width 50px
      height 50px
    .right-panel
      display inline-block
      margin-left 10px
      vertical-align top
      margin-top 15px
      .name
        font-size 16px
    .btn-withdraw
      width auto
      display inline-block
      margin 10px 0 0 1px
      vertical-align top
      font-size 14px
    .btn-invite
      width auto
      display inline-block
      margin 10px 0 0 1px
      vertical-align top
      font-size 14px
    .btn-card
      width auto
      display inline-block
      margin 10px 0 0 1px
      vertical-align top
      font-size 14px
  .invite-list
    margin-top 10px
    li
      background-color #fff
      padding 10px 20px
      margin-bottom 5px
      .avatar
        width 50px
        height 50px
      .right-panel
        display inline-block
        margin-left 10px
        vertical-align top
        .name
          font-size 16px
          line-height 30px
        .invite-count
          color #828282
          font-size 14px
          .count-num
          .income-num
            color #f00
  .max-tips
    text-align center
    color gray
    margin 10px 0
  .tips-area
    margin 20px 30px
    text-align left
    p
      color #828282
      font-size 14px
      a
        color #00ABD8


</style>
