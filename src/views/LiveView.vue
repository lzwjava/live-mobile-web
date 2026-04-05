<template>
  <div class="live-view">
    <div class="player-area" :style="{ height: videoHeight + 'px' }">
      <div class="video-wait video-common" v-if="live.status === 10">
        <p class="big-title">离直播开始还有{{ timeDuration }}</p>
        <p class="small-title">开播时您将收到一条微信通知</p>
        <img class="qrcode" :src="live.liveQrcodeUrl" alt="" />
      </div>
      <div class="video-on" v-if="live.status === 20 || live.status === 25 || live.status === 30">
        <video id="player1" width="100%" :style="{ height: videoHeight + 'px' }" 
          preload="preload" controls webkit-playsinline playsinline ref="videoEl"></video>
        <div class="video-poster-cover" v-if="playStatus !== 2">
          <img :src="live.coverUrl" width="100%" height="100%"/>
          <div class="video-center">
            <div class="canplay" v-if="playStatus === 0" @click="canPlayClick"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-area">
      <div class="tab-item" :class="{ active: currentTab === 0 }" @click="currentTab = 0">聊天</div>
      <div class="tab-item" :class="{ active: currentTab === 1 }" @click="currentTab = 1">公告</div>
      <div class="tab-item" @click="toggleSubscribe">{{ subscribeTitle }}</div>
      <div class="tab-item" @click="changeLiveUrl">切换线路</div>
    </div>

    <div class="chat-area tab-sub-area" v-if="currentTab === 0" :style="{ top: (videoHeight + 35) + 'px' }">
      <div class="members-count" v-if="live.status === 20 && membersCount > 0">在线 {{ membersCount }}</div>
      <button class="live-config-btn" v-if="isOwner" @click="showControlForm">直播控制</button>
      <ul class="msg-list" ref="msgList">
        <li class="msg" v-for="(msg, index) in msgs" :key="index">
          <div class="system-msg" v-if="msg.type === 2"><div class="content">{{ msg.text }}</div></div>
          <div class="bubble-msg" v-else>
            <span class="name" @click="goUserRoom(msg.from)">{{ msg.attributes?.username }}: </span>
            <span class="content">{{ msg.text || msg.attributes?.text }}</span>
          </div>
        </li>
      </ul>
      <div class="send-area">
        <a class="packet-btn" @click="showRewardForm"></a>
        <div class="input-ways">
          <div class="text-input">
            <input type="text" v-model="inputMsg" @keyup.enter="sendMsg" />
            <button type="button" class="btn btn-gray" @click="sendMsg">发送</button>
          </div>
        </div>
      </div>
    </div>

    <div class="notice-area" v-if="currentTab === 1"><Markdown :content="noticeContent" /></div>

    <Overlay v-if="overlayStatus" :overlay="overlayStatus" @close="overlayStatus = false">
      <component :is="currentView" :live="live" :live-id="liveId" @close="overlayStatus = false" />
    </Overlay>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Markdown from '@/components/markdown.vue'
import Overlay from '@/components/Overlay.vue'
import RewardForm from '@/components/RewardForm.vue'
import ControlForm from '@/components/ControlForm.vue'
import { fetchLive, fetchVideos, post } from '@/common/api'
import { configWeixin, showOptionMenu, shareLive } from '@/common/wechat'
import { curUser, timeDuration as getTimeDuration, isWeixinBrowser, isSafari } from '@/common/util'

const route = useRoute()
const router = useRouter()
const liveId = ref(0)
const live = ref({ owner: {} })
const videos = ref([])
const curUserData = ref({})
const membersCount = ref('')
const msgs = ref([])
const inputMsg = ref('')
const playStatus = ref(0)
const videoHeight = ref(230)
const currentTab = ref(0)
const overlayStatus = ref(false)
const currentView = ref('')
const videoEl = ref(null)
const hasGotLive = ref(false)
const hasCallReady = ref(false)
const isOwner = computed(() => curUserData.value.userId === live.value.owner?.userId)
const subscribeTitle = computed(() => curUserData.value.liveSubscribe ? '已关注' : '+关注')
const timeDuration = computed(() => live.value.planTs ? getTimeDuration(live.value.planTs) : '')
const noticeContent = computed(() => {
  const courseware = live.value.coursewareUrl ? `课件地址：${live.value.coursewareUrl}\n` : '主播未上传课件\n\n'
  return courseware + (live.value.notice || '') + '\n\n可打开 quzhiboapp.com 在电脑上观看'
})
let endIntervalId = 0

onMounted(() => {
  liveId.value = route.params.liveId
  curUserData.value = curUser({})
  nextTick(() => { hasCallReady.value = true; tryPlayLiveOrVideo() })
  Promise.all([fetchLive(liveId.value), fetchVideos(liveId.value), configWeixin(null)]).then(values => {
    live.value = values[0]; videos.value = values[1]; showOptionMenu(); shareLive(null, live.value, curUserData.value)
    hasGotLive.value = true; tryPlayLiveOrVideo()
  }).catch(() => {})
})

onUnmounted(() => { if (endIntervalId) clearInterval(endIntervalId) })

const tryPlayLiveOrVideo = () => { if (hasGotLive.value && hasCallReady.value) playLiveOrVideo() }
const playLiveOrVideo = () => {
  if (live.value.status < 20) return
  if (isWeixinBrowser() || isSafari()) { playStatus.value = 0 }
  else if (live.value.status === 20 && videoEl.value && live.value.webHlsUrl) { videoEl.value.src = live.value.webHlsUrl }
}
const canPlayClick = () => { playStatus.value = 1; videoEl.value?.load(); videoEl.value?.play(); setTimeout(() => { playStatus.value = 2 }, 1000) }
const changeLiveUrl = () => { window.location.reload() }
const toggleSubscribe = () => { const n = curUserData.value.liveSubscribe ? 0 : 1; post('self', { liveSubscribe: n }).then(d => { curUserData.value = d }).catch(() => {}) }
const sendMsg = () => { if (!inputMsg.value) return; inputMsg.value = '' }
const showRewardForm = () => { currentView.value = 'reward-form'; overlayStatus.value = true }
const showControlForm = () => { currentView.value = 'control-form'; overlayStatus.value = true }
const goUserRoom = (userId) => { if (userId) router.push(`/room/${userId}`) }
</script>

<style lang="stylus">

.live-view
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  .player-area
    width 100%
    position relative
    background-color #383838
    p.big-title
      text-align center
      color #fff
      font-size 18px
    p.middle-title
      text-align center
      color #fff
      font-size 14px
    p.small-title
      text-align center
      color #bebebe
      font-size 14px
    .video-common
      text-align center
      display flex
      justify-content center
      align-items center
      height 100%
      flex-direction column
    .video-wait
      .qrcode
        width 120px
        margin-top 5px
        overflow hidden
    .video-on
      .video-js
          width 100% !important
      .video-poster-cover
        @extend .full-space
        text-align center
        background rgba(0, 0, 0, 0.5)
        .video-center
          position absolute
          width 50px
          height 50px
          left 50%
          top 50%
          margin-left -25px
          margin-top -25px
          .loading-img
            width 100%
            height 100%
            animation circle 1s cubic-bezier(0, 0, 0.76, 0.77) infinite
          .canplay
            width 100%
            height 100%
            background url("../img/video-play.png") center no-repeat
            background-size 100% 100%
  .live-config-btn
    bottom 50px
    right 10px
    position absolute
    color #fff
    background-color #00bdef
    margin 5px
    padding 5px
    float right
    border-radius 5px
    z-index 100
  .playlist-area
    height 44px
    .weui_cells
      margin-top 0px !important
      background-color #f1f1f1
  .tab-area
    display flex
    height 35px
    .tab-item
      flex-grow 1
      background-color #F5F5F5
      text-align center
      line-height 35px
      transition all .5s ease
      color $font-gray
      cursor pointer
      &.active
        color $blue
        border-bottom 1px solid $blue
  .tab-sub-area
    padding 5px
    box-sizing border-box
    width 100%
    position absolute
    bottom 0
    left 0
    right 0
    transition all .5s ease
  .chat-area
    .members-count
      position relative
      color gray
      margin 5px
      padding 5px
      float right
      border-radius 5px
      z-index 100
    .msg-list
      position absolute
      overflow hidden
      overflow-y scroll
      -webkit-overflow-scrolling touch
      left 5px
      right 5px
      top 5px
      bottom 45px
      .msg
        padding 0 5px
        .system-msg
          margin-bottom 0px
          text-align center
          .content
            border-radius 3px
            background-color #dcdcdc
            font-size 12px
            padding 1px 8px
            color #fff
            display inline-block
        .bubble-msg
          display inline-block
          margin-bottom 6px
          background #fff
          padding 2px 5px
          border-radius 5px
          font-size 14px
          .name
            color #009CC6
          .content
            display inline
            .reward-text
              color #FF4747
            .text-content
              word-wrap break-word
            pre
              word-wrap break-word
              word-break normal
              white-space pre-wrap
              display inline
    .send-area
      position absolute
      height 40px
      bottom 0px
      box-sizing border-box
      padding-top 3px
      padding-bottom 3px
      .toggle-btn
        width 34px
        height 34px
        display inline-block
        &.text-btn
          background url("../img/keyboard.png")
          background-size contain
      .packet-btn
          width 30px
          height 30px
          display inline-block
          background url("../img/packet-btn.png")
          background-size contain
      .input-ways
        position absolute
        left 40px
        top 0
        right 0
        bottom 0
        font-size 16px
        .btn-gray
          border 1px solid rgb(203, 204, 208)
          background-color rgb(242,242,245)
          &:active
            background-color rgb(186, 187, 190)
        .text-input
          width 100%
          height 34px
          line-height 34px
          input
            width 75%
            height 30px
            padding-left 10px
            padding-right 10px
            font-size 16px
            vertical-align middle
            border-radius 5px
          button
            width 20%
            vertical-align middle
            padding 7px 5px
  .notice-area
    padding 10px
@keyframes circle
  0%
    transform rotateZ(0deg)
  100%
    transform rotateZ(360deg)

</style>
