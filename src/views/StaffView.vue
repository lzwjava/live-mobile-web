<template>
  <div class="staff-view">
    <ListNav :mode="0" title="关于我们" />
    <div class="content">
      <div class="intro-section">
        <h2>趣直播</h2>
        <p>知识直播平台</p>
      </div>
      <div class="feature-section">
        <h3>产品特点</h3>
        <ul>
          <li>简单易用的直播工具</li>
          <li>支持微信内直接观看</li>
          <li>高清流畅的直播体验</li>
        </ul>
      </div>
      <div class="download-section">
        <button class="btn btn-blue" @click="downloadApp">下载APP</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import ListNav from '@/components/ListNav.vue'

const downloadApp = () => {
  window.location = 'https://quzhiboapp.com/download'
}
</script>

<style lang="stylus">



.staff-view
  background-image url('../img/welcome.jpg')
  background-size     cover
  background-repeat   no-repeat
  background-position   center center
  position absolute
  left 0
  bottom 0
  right 0
  top 0
  color #fff
  .content-area
    margin-top 20px
    padding 20px
    .free-word
      margin-top 10px
    .bind-area
      margin-top 30px
      .bind-input
        input
          height 30px
          font-size 16px
          background-color transparent
          color #fff
          border-bottom 1px solid rgb(153,153,153)
        button
          padding 5px 10px
          height 30px
          margin-left 10px
      .bind-succeed
        a
          color #bbb
  .slogan
    position absolute
    right 0
    bottom 0
    margin-right 20px
    margin-bottom 20px


</style>
