<template>
  <div class="load-more-bar">
    <div v-if="loading" class="pulse-loader">
      <div class="spinner"></div>
    </div>
    <div v-else-if="haveMore" class="load-inner" @click="loadMore">
      点击加载更多
    </div>
    <div v-else class="load-inner">
      没有更多了
    </div>
  </div>
</template>

<script setup>
defineProps({
  haveMore: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['loadMore'])

const loadMore = () => {
  emit('loadMore')
}
</script>

<style lang="stylus">


.load-more-bar
  height 40px
  text-align center
  color #999
  .pulse-loader
    margin-top 15px
  .load-inner
    line-height 40px


</style>
