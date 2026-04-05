<template>
  <div class="card-view">
    <ListNav :mode="0" title="邀请卡" />
    <div class="content" v-if="cardUrl">
      <img :src="cardUrl" alt="邀请卡" />
      <p class="tips">长按保存图片分享给朋友</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import { makeInvitationCard } from '@/common/api'

const route = useRoute()
const cardUrl = ref('')

onMounted(() => {
  const liveId = route.params.liveId
  makeInvitationCard(liveId).then(data => {
    cardUrl.value = data.cardUrl || ''
  }).catch(() => {})
})
</script>

<style lang="stylus">


.invite-view
  background-color #D2D2D2
  .card
    background-color #2c2c2c
    text-align center
    img
      width 250px
      margin 20px 30px

  .title
    text-align center

  .tips-area
    margin-top 20px
    text-align left
    p
      font-size 30px
      font-size 14px



</style>
