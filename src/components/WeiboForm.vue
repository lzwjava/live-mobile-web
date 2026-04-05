<template>
  <div class="weibo-form" @click.stop>
    <p class="op-word">
      请复制以下链接 <br>到微信中发送给文件助手<br>接着点击链接打开
    </p>

    <p class="link">
      {{ shareLink }}
    </p>

    <p class="small-tips">
      抱歉，产品还在早期阶段，体验略差
    </p>
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



.weibo-form
  @extend .absolute-center
  max-width 350px
  height 200px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px
  .op-word
    font-size 18px
  .link
    font-size 16px
    margin-top 20px
  .small-tips
    margin-top 20px
    font-size 14px
    color #828282


</style>
