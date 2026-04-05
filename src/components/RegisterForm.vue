<template>
  <div class="register-form" @click.stop>
    <p>请用微信扫描以下二维码，在微信上注册</p>
    <img :src="'/api/qrcodes/one?text=' + shareLink" alt="" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { shareLink as getShareLink } from '@/common/util'

const props = defineProps({
  liveId: {
    type: [Number, String],
    default: 0
  }
})

const shareLink = computed(() => getShareLink(props.liveId))
</script>

<style lang="stylus">



.register-form
  @extend .absolute-center
  max-width 350px
  height 400px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px
  p
    margin-top 20px
    font-size 18px
    font-weight bold
  img
    margin-top 30px
    width 300px
    height 300px


</style>
