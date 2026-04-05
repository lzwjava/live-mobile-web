<template>
  <div class="list-view">
    <div class="tab-area">
      <div class="tab-item" :class="{ active: curTab === 0 }" @click="showNewLiveList">
        最新直播
      </div>
      <div class="tab-item" :class="{ active: curTab === 1 }" @click="showHotLiveList">
        热门直播
      </div>
    </div>

    <div class="live-container">
      <LiveList :lives="lives" />
    </div>

    <Tabbar :active-index="0" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LiveList from '@/components/LiveList.vue'
import Tabbar from '@/components/Tabbar.vue'
import { get } from '@/common/api'
import { configWeixin, showOptionMenu, shareApp } from '@/common/wechat'

const lives = ref([])
const curTab = ref(0)

onMounted(() => {
  showNewLiveList()
  
  Promise.all([
    get('lives/count'),
    configWeixin(null)
  ]).then(values => {
    showOptionMenu()
    shareApp(null)
  }).catch(() => {
    // handle error
  })
})

const showNewLiveList = () => {
  curTab.value = 0
  get('lives/listOrderByPlanTs?limit=150')
    .then(data => {
      lives.value = data
    })
    .catch(() => {
      // handle error
    })
}

const showHotLiveList = () => {
  curTab.value = 1
  get('lives/listOrderByAttendance?limit=150')
    .then(data => {
      lives.value = data
    })
    .catch(() => {
      // handle error
    })
}
</script>

<style lang="stylus">


.list-view
  .live-container
    position relative
    width 100%
    min-height 100%
    margin-bottom 54px

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
