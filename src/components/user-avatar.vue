<template>
  <div class="avatar" :class="{ circle: circle }">
    <img v-if="user?.avatarUrl" :src="user.avatarUrl" :alt="user.username" :title="user.username" />
    <span v-else :style="{ backgroundColor: spanBgColor, color: spanColor }">
      {{ firstChar }}
    </span>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  circle: {
    type: Boolean,
    default: true
  }
})

const spanBgColor = ref('')
const spanColor = ref('white')

const firstChar = computed(() => {
  return props.user?.username?.charAt(0)?.toUpperCase() || '?'
})

const updateBgColor = () => {
  if (!props.user?.username) return
  if (!props.user?.avatarUrl) {
    // Generate color from username
    const username = props.user.username
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    const r = (hash & 0xff0000) >> 16
    const g = (hash & 0x00ff00) >> 8
    const b = hash & 0x0000ff
    spanBgColor.value = `rgb(${r}, ${g}, ${b})`
    
    if ((r * 299 + g * 587 + b * 114) > 200000) {
      spanColor.value = 'black'
    }
  }
}

watch(() => props.user, updateBgColor, { immediate: true, deep: true })
</script>

<style lang="stylus">


.avatar
  display inline-block
  text-decoration none
  &:hover
    opacity 0.8
  img
    position relative

.avatar span, .avatar img
  display inline-block
  width 100%
  height 100%
  color white
  text-align center
  font-size 24px
  border-radius 50%

.avatar.circle span, .avatar.circle img
  border-radius 50%


</style>
