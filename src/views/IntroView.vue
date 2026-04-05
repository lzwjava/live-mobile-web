<template>
  <div class="intro-view">
    <ListNav :mode="0" :title="introTitle" :live-id="liveId" />

    <div class="cover-section" @click="attendLive">
      <img class="cover-img" :src="live.coverUrl" alt="cover" />
    </div>

    <div class="header-section card-group">
      <UserAvatar :user="live.owner" />
      <div class="header-right">
        <div class="subject">{{ live.subject }}</div>
        <div class="ownername" @click="goUserRoom(live.owner.userId)">{{ live.owner.username }}</div>
      </div>
      <div class="time-section">
        <div class="right-corner">
          <div class="status" :class="{ 'live-on': live.status === 20 }">{{ statusText }}</div>
        </div>
        <div class="time-label">直播时间</div>
        <div class="plan-time">{{ formatTimeCommonValue }} ({{ timeGapText }})</div>
      </div>
    </div>

    <div class="attend-summary-section card-group" @click="goUsers">
      <div class="attend-info">
        <ul class="attended-users">
          <li class="avatar-cell" v-for="u in attendedUsers" :key="u.userId">
            <UserAvatar :user="u" />
          </li>
        </ul>
        <div class="attend-summary">{{ live.attendanceCount }}人已参与 ></div>
      </div>
    </div>

    <div class="detail-section card-group" v-if="live.detail">
      <div class="title-label">直播详情</div>
      <Markdown :content="live.detail" :show-all="true" />
    </div>

    <div class="attend-section">
      <div class="create-btn left-btn" v-if="isOwner" @click="editLive">
        <p>编辑介绍页</p>
      </div>
      <div class="attend-btn" @click="attendLive" v-html="btnTitle"></div>
    </div>

    <Overlay v-if="overlayStatus" :overlay="overlayStatus" @close="overlayStatus = false">
      <component :is="currentView" :options="options" :live-id="liveId" :live="live" :qrcode-url="qrcodeUrl" @hide="handleOverlayHide" />
    </Overlay>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import UserAvatar from '@/components/user-avatar.vue'
import Markdown from '@/components/markdown.vue'
import Overlay from '@/components/Overlay.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import ShareLead from '@/components/ShareLead.vue'
import QrcodePayForm from '@/components/QrcodePayForm.vue'
import SubscribeForm from '@/components/SubscribeForm.vue'
import { get, post, fetchLive, fetchPartUsers, fetchCurUserNoError } from '@/common/api'
import { configWeixin, showOptionMenu, shareLive } from '@/common/wechat'
import { statusText as getStatusText, timeGap as getTimeGap, formatTimeCommon as getFormatTimeCommon, curUser, moneyAsYuan } from '@/common/util'

const route = useRoute()
const router = useRouter()

const live = ref({ owner: {} })
const attendedUsers = ref([])
const liveId = ref(0)
const curUserData = ref({})
const overlayStatus = ref(false)
const currentView = ref('options-form')
const options = ref([])
const qrcodeUrl = ref('')

const introTitle = computed(() => live.value.owner?.username ? `${live.value.owner.username}的直播` : '直播')
const statusText = computed(() => getStatusText(live.value.status))
const timeGapText = computed(() => getTimeGap(live.value.planTs))
const formatTimeCommonValue = computed(() => live.value.planTs ? getFormatTimeCommon(live.value.planTs) : '')
const isOwner = computed(() => curUserData.value.userId === live.value.owner?.userId)

const btnTitle = computed(() => {
  let statusWord = live.value.status <= 20 ? '参与直播' : '收看回播'
  if (live.value.canJoin) {
    return `已报名，进入${statusWord}`
  } else if (curUserData.value.userId) {
    if (live.value.needPay) {
      const amount = moneyAsYuan(live.value.amount)
      return `赞助并${statusWord}￥${amount}`
    }
    return `报名${statusWord}`
  }
  return `请登录后${statusWord}`
})

onMounted(() => {
  liveId.value = route.params.liveId
  loadAllData()
})

const loadAllData = () => {
  Promise.all([
    fetchLive(liveId.value),
    fetchPartUsers(liveId.value),
    fetchCurUserNoError(),
    configWeixin(null)
  ]).then(values => {
    live.value = values[0]
    attendedUsers.value = values[1]
    curUserData.value = values[2]
    showOptionMenu()
    shareLive(null, live.value, curUserData.value)
  }).catch(error => {
    console.error(error)
  })
}

const attendLive = () => {
  if (!curUserData.value.username) {
    router.push('/')
    return
  }
  if (live.value.canJoin) {
    router.push(`/live/${liveId.value}`)
  } else {
    options.value = ['直接报名', '分享朋友圈报名(感谢您)']
    currentView.value = 'options-form'
    overlayStatus.value = true
  }
}

const goUsers = () => {
  router.push(`/live/${liveId.value}/users`)
}

const goUserRoom = (userId) => {
  router.push(`/room/${userId}`)
}

const editLive = () => {
  router.push(`/editLive/${liveId.value}`)
}

const handleOverlayHide = (type) => {
  overlayStatus.value = false
  if (currentView.value === 'options-form' && type === 1) {
    currentView.value = 'share-lead'
    overlayStatus.value = true
  }
}
</script>

<style lang="stylus">



.intro-view
    width 100%
    .section
      background-color #fff
    .title-label
      font-size 16px
      margin 10px 0
      color #828282
    .cover-section
      padding 0px
      margin-top 10px
      .cover-img
        width 100%
      .preview
        position relative
        video
          background-color transparent
          background-position center
          background-repeat no-repeat
          background-size cover
        video::-webkit-media-controls-start-playback-button
          display none
        .canplay
          position absolute
          width 70px
          height 70px
          left 50%
          top 50%
          margin-left -35px
          margin-top -35px
          background url("../img/video-play.png") center no-repeat
          background-size 100% 100%
    .header-section
      .avatar
        width 80px
        height 80px
        display inline-block
      .header-right
        width 70%
        margin-left 5px
        vertical-align top
        display inline-block
        .subject
          margin-top 5px
          font-size 18px
          font-weight bold
          overflow hidden
          line-height 30px
          max-height 60px
          text-overflow ellipsis
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 2
        .ownername
          margin-top 5px
          font-size 16px
          display inline-block
    .time-section
      border-top 1px dashed #e7e7e7
      .time-label
        margin-top 10px
        color #828282
      .plan-time
        margin-top 5px
        font-size 16px
      .right-corner
        float right
        margin-top 10px
        color #828282
        .status
          border 1px solid #828282
          border-radius 3px
          padding 0 3px
          font-size 14px
          &.live-on
            color #fff
            background-color #00BDEF
            border-color #64b3f1
        .feedback
          margin-top 8px
          font-size 14px
          line-height 25px
    .attend-summary-section
    .invite-summary-section
      .attend-info
        margin 5px 0
      ul
        display inline-block
        margin 0
        li
          display inline-block
          margin 0 2px
          .avatar
            width 25px
            height 25px
      .attend-summary
        float right
        color #828282
        line-height 32px
        font-size 14px
        &.invite
          color #00BDEF
    .video-section
      .video-label
        margin 10px 0
        color #828282
    .detail-section
      .more-dropdown
        background url("../img/dropdown.png") no-repeat
        float right
        width 25px
        height 12px
        background-size 100% 100%
        margin-right 10px
        margin-top 5px
        &.active
          transform rotate(180deg)
      .detail-label
        font-size 16px
        margin 10px 0
        color #828282
    .card-group
      margin-top 10px
      background-color #fff
      padding 10px
    .create-section
      margin 40px auto
      text-align center
      font-size 15px
      a
        color #8A8A8A
    .contact-section
      margin-bottom 50px
      .contact-detail
        padding 10px 20px
        color rgb(112, 112, 112)
      .img-area
        text-align center
        img
          width 70%
    .lives-section
      margin-bottom 50px
    .attend-section
      position fixed
      bottom 0
      width 100%
      height 55px
      display flex
      @media screen and (min-width: 700px)
        margin 0 auto
        max-width 700px
      .attend-btn
        font-size 14px
        width 80%
        border-radius 0px !important
        flex 3
        background #00BDEF
        color #fff
        display flex
        align-items center
        justify-content center
        text-align center
        .origin
          font-size 13px
          text-decoration line-through
        .share-tips
          font-size 13px
          color #FFFFFF
      .create-btn
        background-color rgba(112, 112, 112, 0.9)
        img
          vertical-align middle
          width 25px
      .edit-btn
        background-color rgba(51,201,111,0.9)
      .left-btn
        flex 1
        text-align center
        display flex
        flex-direction column
        justify-content center
        align-items center
        p
          font-size 12px
          color #fff



</style>
