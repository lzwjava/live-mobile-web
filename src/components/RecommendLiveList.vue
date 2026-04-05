<template>
  <div class="live-list">
    <ul class="live-list-ul">
      <li class="live-item-li" v-for="live in lives" :key="live.liveId">
        <LiveItem :live="live" />
      </li>
      <LoadMoreBar :have-more="haveMore" :loading="loading" @load-more="loadMore" />
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LiveItem from './LiveItem.vue'
import LoadMoreBar from './LoadMoreBar.vue'
import { get } from '@/common/api'

const props = defineProps({
  skipLiveId: {
    type: [Number, String],
    default: 0
  }
})

const lives = ref([])
const haveMore = ref(true)
const loading = ref(false)

const loadData = (limit, skip) => {
  loading.value = true
  get('lives/recommend', { limit, skip, skipLiveId: props.skipLiveId })
    .then(data => {
      loading.value = false
      lives.value = lives.value.concat(data)
      if (data.length < limit) {
        haveMore.value = false
      }
    })
    .catch(() => {
      loading.value = false
    })
}

const loadMore = () => {
  if (!loading.value && haveMore.value) {
    loadData(20, lives.value.length)
  }
}

onMounted(() => {
  loadData(3, 0)
})
</script>

<style lang="stylus">


.live-list-ul
  &:first-child
    border-top 1px solid #eee


</style>
