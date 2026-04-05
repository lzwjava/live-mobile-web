<template>
  <div class="agreement-view">
    <ListNav :mode="0" title="用户协议" />
    <div class="content">
      <Markdown :content="agreementContent" />
    </div>
  </div>
</template>

<script setup>
import ListNav from '@/components/ListNav.vue'
import Markdown from '@/components/markdown.vue'

const agreementContent = `
# 用户协议

## 服务条款

1. 直播内容由主播自行负责
2. 用户需遵守相关法律法规
3. 平台有权对违规内容进行处理
`
</script>

<style lang="stylus">

  .agreement-view
    background-color #fff
    h1
      text-align center

</style>
