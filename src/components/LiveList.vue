<template>
  <div class="live-list">
    <ul class="live-list-ul">
      <li class="live-item-li" v-for="live in lives" :key="live.liveId">
        <LiveItem :live="live" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import LiveItem from './LiveItem.vue'

defineProps({
  lives: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="stylus">


</style>
