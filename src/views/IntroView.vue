<template>

  <div class="intro-view">

    <list-nav :mode="0" :title="introTitle" :live-id="liveId"></list-nav>

    <div class="cover-section">

      <img class="cover-img" :src="live.coverUrl" alt="cover"/>

    </div>

    <div class="header-section card-group">
      <user-avatar :user="live.owner"></user-avatar>

      <div class="header-right">
        <div class="subject">{{live.subject}}</div>
        <div class="ownername">{{live.owner.username}}</div>
      </div>

      <div class="time-section">

        <div class="right-corner">
          <div class="status" v-bind:class="{'live-on': live.status == 20}">
              {{statusText}}
          </div>

          <!-- <div class="feedback" @click="goContact">
            订阅直播
          </div> -->
        </div>

        <div class="time-label">直播时间</div>
        <div class="plan-time">{{live.planTs | formatTimeCommon}} ({{timeGap}})</div>

      </div>

    </div>

    <div class="attend-summary-section card-group">
      <div class="attend-info">
        <ul class="attended-users">
          <li class="avatar-cell" v-for="u in attendedUsers">
            <user-avatar :user="u"></user-avatar>
          </li>
        </ul>

        <div class="attend-summary" @click="goUsers">
          {{live.attendanceCount}}人已参与 >
        </div>
      </div>
    </div>

    <div class="invite-summary-section card-group">
      <div class="attend-info">
        <ul class="attended-users">
          <li class="avatar-cell" v-for="u in invites">
            <user-avatar :user="u"></user-avatar>
          </li>
        </ul>

        <div class="attend-summary invite" @click="goInvite">
          邀请榜>
        </div>

      </div>
    </div>

    <div class="speaker-section card-group" v-show="live.speakerIntro">

      <div class="title-label">
        主播简介
      </div>

      <markdown :content="live.speakerIntro"></markdown>

    </div>

    <div class="detail-section card-group">

      <div class="title-label">
        直播详情
      </div>

      <markdown :content="live.detail" :show-all="true"></markdown>

    </div>

    <div class="lives-section card-group">

      <div class="title-label">
        更多直播
      </div>

      <recommend-live-list :skip-live-id="liveId"></recommend-live-list>

    </div>

    <div class="attend-section">

      <div class="create-btn" @click="createLive">
        <img src="../img/apply-icon.png" alt="">
        <p>发起直播</p>
      </div>

       <div class="attend-btn" @click="attendLive" v-html="btnTitle"></div>
    </div>

    <overlay :overlay.sync="overlayStatus">
        <component :is="currentView" :options="options" :live-id="liveId" type="live"
         :qrcode-url="qrcodeUrl"></component>
    </overlay>

    <toast type="loading" v-show="loadingToastShow">数据加载中</toast>

  </div>

</template>

<script>

import util from '../common/util'
import UserAvatar from '../components/user-avatar.vue'
import Markdown from '../components/markdown.vue'
import http from '../common/api'
import Overlay from '../components/overlay.vue'
import OptionsForm from '../components/OptionsForm.vue'
import ShareLead from '../components/ShareLead.vue'
import QrcodePayForm from '../components/QrcodePayForm.vue'
import ListNav from '../components/ListNav.vue'
import RecommendLiveList from '../components/RecommendLiveList.vue'
import {Button, Toast} from 'vue-weui'
import SubscribeForm from '../components/SubscribeForm.vue'
import wechat from '../common/wechat'

var debug = require('debug')('IntroView');

export default {
  name: 'IntroView',
  components: {
    'user-avatar': UserAvatar,
    'markdown': Markdown,
    'overlay': Overlay,
    'weui-button': Button,
    'toast': Toast,
    'options-form': OptionsForm,
    'share-lead': ShareLead,
    'list-nav': ListNav,
    'qrcode-pay-form': QrcodePayForm,
    'recommend-live-list': RecommendLiveList,
    'subscribe-form': SubscribeForm
  },
  data () {
    return {
      code: '',
      curUser: {},
      live: {
        owner: {
          username: ''
        }
      },
      attendedUsers: [],
      invites: [],
      liveId: 0,
      overlayStatus: false,
      currentView: 'options-form',
      videoHeight: 250,
      playStatus: 0,
      positiveShare: false, // 主动分享
      showMoreDetail: true,
      qrcodeUrl: ''
    }
  },
  computed: {
    options () {
      if (this.live.needPay) {
        return ['直接报名', '分享朋友圈报名(' + this.thankWord() + ')']
      } else {
        return ['直接报名', '分享朋友圈报名(感谢您)']
      }
    },
    btnTitle: function () {
      var statusWord;
      if (this.live.status <= 20) {
        statusWord = '参与直播';
      } else {
        statusWord = '收看回播';
      }
      if (this.live.canJoin) {
        return '已报名，进入' + statusWord
      } else if (this.curUser.userId) {
        if (this.live.needPay) {
          var amountWord;
          if (this.live.realAmount != this.live.amount) {
            amountWord = '¥' + this.moneyToYuan(this.live.realAmount)  +
            '  <span class="origin">' +'¥' + this.moneyToYuan(this.live.amount)+ '</span>'
          } else {
            amountWord = '¥' + this.moneyToYuan(this.live.amount)
          }
          return '赞助并' + statusWord + amountWord
        } else {
          return '报名' + statusWord
        }
      } else {
        return '请登录后' + statusWord
      }
    },
    timeGap: function() {
      return util.timeGap(this.live.planTs)
    },
    statusText()  {
      return util.statusText(this.live.status)
    },
    introTitle() {
      return this.live.owner.username + '的直播'
    }
  },
  route: {
    data ({ to }) {
      util.initTitle()
      var liveId = to.params.liveId;
      if (liveId == this.liveId) {
        if (this.live.liveId) {
          wechat.shareLive(this, this.live, this.curUser)
        }
        return
      }
      this.liveId = liveId
      this.loadAllData()
    }
  },
  created () {
  },
  ready() {
  },
  destroyed () {
    debug('destroyed')
  },
  methods: {
    thankWord() {
      if (this.live.amount <= 100) {
        return '免费';
      } else {
        return '感恩1元';
      }
    },
    moneyToYuan(amount) {
      return amount /100.0
    },
    loadAllData() {
      util.loading(this)
      Promise.all([
        http.fetchCurUserNoError(this),
        http.fetchLive(this, this.liveId),
        http.fetchPartUsers(this, this.liveId),
        http.get(this, 'attendances/invites', {
          liveId: this.liveId,
          limit: 6
        }),
        wechat.configWeixin(this)
      ]).then(values => {
        util.loaded(this)

        this.curUser = values[0]
        this.live = values[1]

        this.attendedUsers = values[2]

        if (values[3].length > 0) {
          this.invites = values[3]
        } else {
          this.invites = [util.defaultUser()]
        }

        wechat.showOptionMenu()
        wechat.shareLive(this, this.live, this.curUser)

        setTimeout(() => {
          //this.playVideo()
        }, 0)
        // if (to.query.action == 'pay') {
        //   setTimeout(()=> {
        //     this.pay()
        //   }, 500)
        // }
        setTimeout(() => {
          this.configPreviewImages()
        },100)

      }).catch(util.promiseErrorFn(this))
    },
    configPreviewImages() {
      var detailSection = document.querySelector('.detail-section')
      if(!detailSection) {
        return
      }
      var images = detailSection.getElementsByTagName('img')
      var urls = []
      for (var i = 0; i< images.length;i++) {
        var image = images[i]
        urls.push(image.currentSrc)
      }
      // urls.push('http://i.quzhiboapp.com/wechat_xin.png')

      for (var i = 0; i< images.length;i++) {
        var image = images[i]
        image.addEventListener('click', (event) => {
          var img =  event.srcElement
          debug('preview' + img.currentSrc)
          wx.previewImage({
              current: img.currentSrc,
              urls: urls
          })
        })
      }
    },
    playVideo() {
      if (!this.live.previewUrl) {
        return
      }
      var video = document.querySelector("video")
      var events = ['canplay', 'playing', 'loadeddata']
      for (var i = 0; i < events.length; i++) {
        var name = events[i]
        video.addEventListener(name, (ev) => {
          debug('event ' + ev.type + ' fired')
          debug(ev)
          if (ev.type == 'playing' || ev.type == 'canplay' || ev.type=='loadeddata') {
            var videoElm = ev.srcElement
            debug('client height' + videoElm.clientHeight)
            debug('video height' + videoElm.videoHeight)
            // TODO: android videoHeight 为 0 的问题
            if (videoElm.videoHeight != 0) {
              this.videoHeight = videoElm.clientHeight
            }
          }
        })
      }
    },
    canPlayClick() {
      this.playStatus = 1
      var video = document.querySelector("video")
      video.play()
    },
    intoLive() {
      this.$router.go('/live/' + this.liveId)
    },
    payOrCreateAttend() {
      if (this.live.needPay) {
        this.pay()
      } else {
        this.createAttend()
      }
    },
    showSubscribeForm() {
      this.currentView = 'subscribe-form'
      this.overlayStatus = true
    },
    attendLive () {
      if (!this.curUser.userId) {
        this.$dispatch('loginOrRegister', this.liveId)
      } else {
        if (this.curUser.wechatSubscribe == 0) {
          this.showSubscribeForm()
        } else {
          if (this.live.canJoin) {
            this.intoLive()
          } else {
            if (util.isWeixinBrowser()) {
              if (this.live.shareId) {
                this.payOrCreateAttend()
              } else {
                this.positiveShare = true
                this.currentView = 'options-form'
                this.overlayStatus = true
              }
            } else {
              this.payOrCreateAttend()
            }
          }
        }
      }
    },
    createAttend() {
      util.loading(this)
      http.post(this, 'attendances/create', {
        liveId: this.liveId
      }).then((data) => {
        util.loaded(this)
        util.show(this, 'success', '报名成功')
        this.reloadLive()
        this.intoLive()
      }).catch(util.promiseErrorFn(this))
    },
    reloadLive() {
      util.loading(this)
      return http.fetchLive(this, this.liveId)
        .then((data) => {
          util.loaded(this)
          this.live = data
          return Promise.resolve()
        }).catch(util.promiseErrorFn(this))
    },
    createLive() {
      if (!this.curUser.userId) {
        this.$dispatch('loginOrRegister', this.liveId)
      } else {
        this.$router.go('/reganchor')
      }
    },
    cleanFromUserId() {
      window.localStorage.removeItem('fromUserId')
    },
    pay() {
      if (util.isWeixinBrowser()) {
        util.loading(this)
        var fromUserId = window.localStorage.getItem('fromUserId')
        var params = {
          liveId: this.liveId,
          channel: 'wechat_h5'
        }
        if (fromUserId) {
          params.fromUserId = fromUserId
        }
        return http.post(this, 'attendances/create', params).then((data) => {
          util.loaded(this)
          return wechat.wxPay(data)
        }).then(() => {
          this.payFinishAndIntoLive()
          }, (error) => {
            if (error && error.indexOf('失败') != -1) {
              this.fetchQrcodeUrlAndShow()
            } else {
              util.show(this, 'error', error)
            }
        })
      } else {
        this.fetchQrcodeUrlAndShow()
      }
    },
    payFinishAndIntoLive() {
      util.loading(this)
      setTimeout(() => {
        http.fetchLive(this, this.liveId)
          .then((data) => {
            util.loaded(this)
            this.live = data
            if (this.live.canJoin) {
              util.show(this, 'success', '支付成功')
              this.cleanFromUserId()
              this.intoLive()
            } else {
              util.show(this, 'error', '后台显示未到账，请重试')
            }
          }).catch(util.promiseErrorFn(this))
      }, 1000)
    },
    fetchQrcodeUrlAndShow() {
      util.loading(this)
      var fromUserId = window.localStorage.getItem('fromUserId')
      var params = {
        liveId: this.liveId,
        channel: 'wechat_qrcode'
      }
      if (fromUserId) {
        params.fromUserId = fromUserId
      }
      http.post(this, 'attendances/create', params)
       .then((data) => {
        util.loaded(this)
        this.qrcodeUrl = data.code_url
        this.currentView = 'qrcode-pay-form'
        this.overlayStatus = true
      }, util.promiseErrorFn(this))
    },
    goUsers() {
      this.$router.go('/live/' + this.liveId + '/users')
    },
    seeLives() {
      this.$router.go('/lives')
    },
    goContact() {
      this.$router.go('/contact')
    },
    goQulive() {
      this.$router.go('/intro/7')
    },
    toggleMoreDetail() {
      this.showMoreDetail = !this.showMoreDetail
    },
    goInvite() {
      this.$router.go('/live/' + this.liveId + '/invites')
    }
  },
  events:  {
    'shareTimeline': function(liveId) {
      debug('event shareTimeline fired liveId' + liveId)
      util.loading(this)
      http.post(this, 'shares', {
        liveId: liveId,
        shareTs: Math.round(new Date().getTime()/1000),
        channel: 'wechat_timeline'
      }).then((result) => {
        util.loaded(this)
        util.show(this, 'success', '分享成功，感谢您')
        this.overlayStatus = false
        if (this.positiveShare) {
          this.reloadLive()
           .then(() => {
               this.attendLive()
           })
        } else {
          this.reloadLive()
        }
      }).catch(util.promiseErrorFn(this))
    },
    'hideOptionsForm': function(type) {
      if (this.currentView == 'options-form'){
        if (type == 0) {
          this.payOrCreateAttend()
        } else if (type == 1) {
          setTimeout(() => {
            this.currentView = 'share-lead'
            this.overlayStatus = true
          }, 0)
        }
      }
    },
    'payFinish': function () {
      this.payFinishAndIntoLive()
    }
  }
}
</script>

<style lang="stylus">

@import "../stylus/base.styl"
@import "../stylus/variables.styl"
@import '../../node_modules/rupture/rupture/index.styl'

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
      +above(650px)
        margin 0 auto
        max-width 650px
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
        flex 1
        background-color rgba(112, 112, 112, 0.9)
        text-align center
        display flex
        flex-direction column
        justify-content center
        align-items center
        img
          vertical-align middle
          width 25px
        p
          font-size 12px
          color #fff


</style>
