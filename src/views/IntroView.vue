<template>

  <div class="intro-view">

    <list-nav :mode="0" :title="introTitle"></list-nav>

    <div class="cover-section">

      <img class="cover-img" :src="live.coverUrl" alt="cover" v-show="!live.previewUrl"/>

      <div class="preview" v-show="live.previewUrl">

        <video webkit-playsinline width="100%" height="100%"
         class="preview-video" controls preload="metadata" :src="live.previewUrl"
         :style="{ backgroundImage: 'url(' + live.coverUrl + ')' }">
        </video>

        <div class="canplay" v-show="playStatus == 0" @click="canPlayClick"></div>

      </div>

    </div>

    <div class="header-section card-group">
      <user-avatar :user="live.owner"></user-avatar>

      <div class="header-right">
        <div class="subject">{{live.subject}}</div>
        <div class="ownername">{{live.owner.username}}</div>

      </div>

      <div class="time-section">

        <div class="right-corner">
          <div class="status">
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

    <div class="attend-section card-group">
      <div class="attend-info">
        <ul class="attended-users">
          <li class="avatar-cell" v-for="u in firstBatchUsers">
            <user-avatar :user="u"></user-avatar>
          </li>
        </ul>

        <div class="attend-summary" @click="goUsers">
          {{live.attendanceCount}}人已参与 >
        </div>
      </div>

      <div class="attend-action section">
        <button class="btn btn-blue attend-btn" @click="attendLive" v-html="btnTitle"></button>
      </div>

    </div>

    <div class="detail-section card-group">

      <div class="detail-label">
        直播详情
      </div>

      <markdown :content="live.detail" :show=true></markdown>

    </div>

    <div class="contact-section card-group">

      <div class="title-label">
        订阅最新直播
      </div>

      <div class="contact-detail">
        <p>
          可关注趣直播公众号，来获取最新直播推送：
        </p>
        <br>
        <div class="img-area">
          <img src="../img/qrcode_subscribe.jpg" alt="" />
        </div>
      </div>

    </div>

    <div class="create-section">

      <a class="create-link" @click.prevent="goQulive">趣直播是什么?</a>

      <br>

      <br>

      <a class="create-link" @click.prevent="createLive">创建您的直播?</a>
    </div>

    <!-- <div class="list-section card-group">
      <a @click.prevent="seeLives">查看全部的直播</a>
    </div> -->

    <overlay :overlay.sync="overlayStatus">
        <component :is="currentView"></component>
    </overlay>

    <toast type="loading" v-show="loadingToastShow">数据加载中</toast>

  </div>

</template>

<script>

import util from '../common/util'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'
import Markdown from '../components/markdown.vue'
import http from '../common/api'
import Overlay from '../components/overlay.vue'
import PayForm from '../components/PayForm.vue'
import ShareLead from '../components/ShareLead.vue'
import ListNav from '../components/ListNav.vue'
import {Button, Toast} from 'vue-weui'

var debug = require('debug')('IntroView');

export default {
  name: 'IntroView',
  components: {
    'user-avatar': UserAvatar,
    'markdown': Markdown,
    'overlay': Overlay,
    'weui-button': Button,
    'toast': Toast,
    'pay-form': PayForm,
    'share-lead': ShareLead,
    'list-nav': ListNav
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
      liveId: 0,
      overlayStatus: false,
      currentView: 'pay-form',
      videoHeight: 250,
      playStatus: 0
    }
  },
  computed: {
    firstBatchUsers: function () {
      var num = 7
      if (this.attendedUsers.length > 7)  {
        return this.attendedUsers.splice(0,7)
      } else {
        return this.attendedUsers
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
        return '已报名，进入直播间' + statusWord
      } else if (this.curUser.userId) {
        var amountWord;
        if (this.live.shareId != null) {
          amountWord = '¥' + this.moneyToYuan(this.live.realAmount)  +
          '  <span class="origin">' +'¥' + this.moneyToYuan(this.live.amount)+ '</span>'
        } else {
          amountWord = '¥' + this.moneyToYuan(this.live.amount)  +
          '<span class="share-tips">' + '（分享朋友圈感恩1元）' + '<span>'
        }
        return '赞助并' + statusWord + amountWord
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
      return this.live.owner.username + ' 的直播'
    }
  },
  route: {
    data ({ to }) {
      this.liveId = to.params.liveId
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
    moneyToYuan(amount) {
      return amount /100.0
    },
    loadAllData() {
      util.loading(this)
      Promise.all([
        http.fetchCurUserNoError(this),
        http.fetchLive(this, this.liveId),
        http.fetchUsers(this, this.liveId)
      ]).then(values => {
        util.loaded(this)

        this.curUser = values[0]
        this.live = values[1]
        this.attendedUsers = values[2]

        wechat.configWeixin(this)
          .then(() => {
            wechat.showOptionMenu()
            wechat.shareLive(this, this.live)
        }).catch(util.promiseErrorFn(this))
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
        },0)
      }).catch(util.promiseErrorFn(this))
    },
    configPreviewImages() {
      var detailSection = document.querySelector('.detail-section')
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
    attendLive () {
      if (this.live.canJoin) {
        this.$router.go('/live/' + this.liveId)
      } else if (this.curUser.userId){
        if (this.live.shareId) {
          this.pay()
        } else {
          this.currentView = 'pay-form'
          this.overlayStatus = true
        }
      } else {
        this.$router.go('/register/?liveId=' + this.liveId)
      }
    },
    reloadLive() {
      util.loading(this)
      http.fetchLive(this, this.liveId)
        .then((data) => {
          util.loaded(this)
          this.live = data
        }).catch(util.promiseErrorFn(this))
    },
    createLive() {
      this.$router.go('/scan')
    },
    pay() {
      wechat.attendLiveAndPay(this, this.liveId)
        .then(() => {
          util.show(this, 'success', '支付成功')
          this.reloadLive()
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
        util.show(this, 'success', '分享成功，可优惠参与直播，感谢您')
        this.overlayStatus = false
        this.reloadLive()
      }).catch(util.promiseErrorFn(this))
    },
    'hidePayForm': function(type) {
      if (type == 1) {
        this.pay()
      } else if (type == 2) {
        debug('hidePayForm type == 2')

        setTimeout(() => {
          this.currentView = 'share-lead'
          this.overlayStatus = true
        }, 0)
      }
    }
  }
}
</script>

<style lang="stylus">

@import "../stylus/base.styl"
@import "../stylus/variables.styl"

.intro-view
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
        .feedback
          margin-top 8px
          font-size 14px
          line-height 25px
    .attend-section
      .attend-info
        margin 5px 0
      ul
        display inline-block
        li
          display inline-block
          margin 0 2px
          .avatar
            width 25px
            height 25px
      .attend-summary
        float right
        line-height 25px
      .attend-action
        text-align center
        .attend-btn
          font-size 16px
          width 90%
          .origin
            font-size 13px
            text-decoration line-through
          .share-tips
            font-size 13px
            color #FFFFFF
    .video-section
      .video-label
        margin 10px 0
        color #828282
    .detail-section
      .detail-label
        font-size 16px
        margin 10px 0
        color #828282
      .markdown-body
        padding 10px 20px
        font-size 16px
        color rgb(112, 112, 112)
        line-height 28px !important
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
      .contact-detail
        padding 10px 20px
        color rgb(112, 112, 112)
      .img-area
        text-align center
        img
          width 100%
    .list-section
      text-align center
      margin-bottom 0px !important
      a
        color #00ABD8

</style>
