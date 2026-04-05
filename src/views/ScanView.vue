<template>
  <div class="scan-view">
    <ListNav :mode="0" title="发起直播" />
    <div class="content">
      <div class="scan-section" @click="startScan">
        <img src="/img/computer-btn.png" alt="扫码" />
        <p>扫描二维码发起直播</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import { scanQRcode } from '@/common/wechat'

const router = useRouter()

const startScan = () => {
  scanQRcode(null).then(data => {
    router.push('/reganchor')
  }).catch(() => {})
}
</script>

<style lang="stylus">


.scan-view
  text-align center
  img
    margin-top 30px
  h4
    margin-top 10px
  button
    margin-top 30px
  p.gray
    color #8C9CA3
    margin-top 60px
    font-size 14px


</style>
