<template>
  <div class="mylist-view">
    <ListNav :mode="2" title="我的直播" />
    <div class="content">
      <LiveList v-if="lives.length > 0" :lives="lives" />
      <div v-else class="empty-tip">暂无参与的直播</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListNav from '@/components/ListNav.vue'
import LiveList from '@/components/LiveList.vue'
import { get } from '@/common/api'

const lives = ref([])

onMounted(() => {
  get('lives/my')
    .then(data => {
      lives.value = data || []
    })
    .catch(() => {
      lives.value = []
    })
})
</script>

<style lang="stylus">


.my-list-view
  .lives-title
    color #999
    padding 0 15px
    line-height 35px
    background-color #eee
  .not-login
    text-align center
    p
      margin-top 30px
      color #828282
      font-size 20px
    button
      margin-top 20px


</style>
