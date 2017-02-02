<template>
  <div class="live-view">
    <div class="player-area" v-el:player-area :style="{height: videoHeight + 'px'}">
      <div class="video-wait video-common" v-show="live.status == 10">
        <p class="big-title">离直播开始还有{{timeDuration}} <br></p>
        <p class="small-title">开播时您将收到一条微信通知~</p>
        <p class="small-title">可打开 quzhiboapp.com 在电脑上观看</p>
        <p class="small-title">另可长按加微信进入用户群和主播聊聊</p>
        <img class="qrcode" src="../img/qrcode_me_3.jpg" alt="">
      </div>
      <div class="video-on" v-show="live.status == 20 || live.status == 25 || live.status == 30">
        <video id="player1" width="100%" :style="{height: videoHeight + 'px'}" preload="preload"
           controls webkit-playsinline playsinline :src="videoSrc" x5-video-player-type="h5"
             x5-video-orientation="landscape" x5-video-player-fullscreen="true"></video>
        <div class="video-poster-cover" v-show="playStatus != 2">
          <img :src="live.coverUrl" width="100%" height="100%"/>
          <div class="video-center">
            <img class="loading-img" v-show="playStatus == 1" src="../img/video-circle.png">
            <div class="canplay" v-show="playStatus == 0" @click="canPlayClick"></div>
          </div>
        </div>
      </div>
      <div class="video-error video-common" v-show="live.status == 35">
        <p class="big-title">直播发生了些小故障<br>请到公告栏查看</p>
      </div>
    </div>

    <div class="playlist-area" :style="{top:videoHeight + 'px'}" v-if="videos.length > 1">
      <cells type="split">
        <select-cell :options="videoOptions" :selected.sync="videoSelected"></select-cell>
      </cells>
    </div>

    <div class="tab-area">
      <div class="chat-tab tab-item" @click="showChatTab" v-bind:class="{active: currentTab == 0}">
        聊天
      </div>
      <div class="notice-tab tab-item" @click="showNoticeTab" v-bind:class="{active: currentTab == 1}">
        公告
      </div>
      <div class="live-tab tab-item" @click="changeLiveUrl" v-show="live.status == 20 || live.status == 30">
        {{changeTitle}}
      </div>
    </div>

    <div class="chat-area tab-sub-area" :style="{top: (videoHeight + optionHeight + 35) + 'px'}"
         v-show="currentTab == 0">

      <ul class="msg-list" v-el:msg-list>

        <li class="msg" v-for="msg in msgs">

          <div class="system-msg" v-if="msg.type == 2 && live.status != 30">
            <div class="content">{{msg.text}}</div>
          </div>

          <div class="bubble-msg" v-if="msg.type !=2 ">

            <span class="name">{{msg.attributes.username}}</span>

            <div class="content">
              <div class="bubble">
                <div class="text-content bubble-cont" v-if="msg.type == -1">
                  <div class="plain">
                    <pre class="text">{{msg.text}}</pre>
                  </div>
                </div>
                <div class="text-content bubble-cont" v-if="msg.type == 3">
                  <div class="plain">
                    <pre class="text reward-text">{{msg.text}}</pre>
                  </div>
                </div>
                <div class="audio-content bubble-cont" v-if="msg.type == 1">
                  <div class="voice" @click="playVoice(msg.attributes.serverId)">
                    <i class="voice-gray"> </i>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </li>

      </ul>

      <div class="send-area tab-sub-area">

        <a class="packet-btn" @click="showRewardForm"></a>

        <div class="input-ways">

          <div class="text-input">
            <input type="text" v-model="inputMsg">
            <button type="button" class="btn btn-gray" @click="sendMsg">发送</button>
          </div>
        </div>

      </div>

    </div>

    <div class="notice-area" v-show="currentTab == 1">
      <markdown :content="noticeContent"></markdown>
    </div>

    <overlay :overlay.sync="overlayStatus">
      <component :is="currentView" :live="live" :live-id="liveId" type="live"></component>
    </overlay>

  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'
import Loading from '../components/loading.vue'
import makeVideoPlayableInline from 'iphone-inline-video'
import {Toast, SelectCell, Cells} from 'vue-weui'
import RewardForm from '../components/RewardForm.vue'
import Overlay from '../components/overlay.vue'
import Markdown from '../components/markdown.vue'
import SubscribeForm from '../components/SubscribeForm.vue'

var debug = require('debug')('LiveView')
var lcChat = require('leancloud-realtime')
var Realtime = lcChat.Realtime;
var TextMessage = lcChat.TextMessage
var messageType = lcChat.messageType
var TypedMessage = lcChat.TypedMessage

var inherit = require('inherit');
export const WxAudioMessage = inherit(TypedMessage)

var WxAudioType = 1
messageType(WxAudioType)(WxAudioMessage)

export const SystemMessage = inherit(TypedMessage)
var SystemMessageType = 2
messageType(SystemMessageType)(SystemMessage)

export const RewardMessage = inherit(TypedMessage)
var RewardMessageType = 3
messageType(RewardMessageType)(RewardMessage)

var prodAppId = 's83aTX5nigX1KYu9fjaBTxIa-gzGzoHsz'
var testAppId = 'YY3S7uNlnXUgX48BHTJlJx4i-gzGzoHsz'

var realtime = new Realtime({
  appId: prodAppId,
  region: 'cn',
  noBinary: true
})

realtime.register(WxAudioMessage)
realtime.register(SystemMessage)
realtime.register(RewardMessage)

export default {
  name: 'LiveView',
  components: {
    'loading': Loading,
    'toast': Toast,
    SelectCell,
    Cells,
    RewardForm,
    Overlay,
    'markdown': Markdown,
    'subscribe-form': SubscribeForm
  },
  data() {
    return {
      liveId: 0,
      live: {},
      client: {},
      conv: {},
      curUser: {},
      msgs: [],
      inputMsg: '',
      playStatus: 0,   // 0: none, 1: loading 2: play,
      isRecording: false,
      videoHeight: 230,
      inputing: 0,
      videos: [],
      messageIterator: null,
      videoSelected: 0,
      overlayStatus: false,
      liveViewId: 0,
      endIntervalId: 0,
      currentTab: 0,   // 0: Chat, 1: Notice
      isSending: false,
      currentView: ''
    }
  },
  computed: {
    timeDuration () {
      return util.timeDuration(this.live.planTs)
    },
    videoOptions() {
      var options = [];
      for(var i = 0; i < this.videos.length; i++) {
        var video = this.videos[i]
        options.push({text: video.title, value: i})
      }
      return options
    },
    optionHeight() {
      if (this.videos.length > 1) {
        return 50
      } else {
        return 0
      }
    },
    videoSrc() {
      if (this.live.status == 20) {
        return this.live.hlsUrl
      } else if (this.live.status == 30) {
        var video = this.videos[this.videoSelected]
        if (video.type == 'mp4') {
          return video.url
        } else if (video.type == 'm3u8') {
          return video.m3u8Url
        }
      }
      return this.live.hlsUrl
    },
    liveHost() {
      if (!this.live.hlsUrl) {
        return ''
      }
      var regex = /http:\/\/(.*).quzhiboapp.com.*/g
      var match = regex.exec(this.videoSrc)
      if (match) {
        return match[1]
      } else {
        return ''
      }
    },
    noticeContent() {
      return this.live.notice + this.defaultNotice
    },
    defaultNotice() {
      return '\n可长按二维码加微信进用户群和主播聊聊：\n\n' +
      ' ![wechat_lzw_short.png](http://i.quzhiboapp.com/qrcode_me_small.jpg)'
    },
    changeTitle() {
      if (this.live.status == 20) {
        return '切换直播线路'
      } else if (this.live.status == 30){
        return '切换视频线路'
      }
    }
  },
  created() {
    debug('created')
  },
  destroyed() {
  },
  updated() {
    debug('updated')
  },
  attached() {
    debug('attached')
  },
  detached() {
    debug('detached')
    this.endLiveView()
    this.endInterval()
  },
  ready() {
    var playerArea = this.$els.playerArea
    this.videoHeight =  Math.ceil(playerArea.offsetWidth * 0.625)
  },
  watch: {
    videoSelected: function(val, oldVal) {
      this.canPlayClick()
    }
  },
  route: {
    data ({to}) {
      var liveId = to.params.liveId

      if (liveId == this.liveId) {
        return
      }

      this.liveId = liveId
      if (!this.liveId) {
        util.show(this, 'error', '缺少参数')
        return
      }
      util.loading(this)

      this.conv = {}
      this.client = {}
      this.msgs = []
      this.playStatus = 0

      Promise.all([
        http.fetchLive(this, this.liveId),
        http.fetchVideos(this, this.liveId),
        http.fetchCurUser(this),
        wechat.configWeixin(this)
      ]).then(values => {
        util.loaded(this)

        this.live = values[0]
        this.videos = values[1]
        this.curUser = values[2]

        if (!this.live.canJoin) {
          util.show(this, 'error', '请先登录或报名直播')
          return
        }

        wechat.showOptionMenu()
        wechat.shareLive(this, this.live)
        this.openClient()
        this.playHls()

        this.startLiveView(this.live)
        this.endInterval()

        this.endIntervalId = setInterval(() => {
          this.endLiveView()
        }, 1000 * 30)

        this.showSubscribeForm()

      }, util.promiseErrorFn(this))
    }
  },
  methods: {
    handleError (error) {
      if (typeof error != 'string') {
        error = JSON.stringify(error)
      }
      util.show(this, 'error', error)
    },
    addMsg(msg) {
      var msgList = this.$els.msgList
      var isTouchBottom = msgList.scrollHeight < msgList.scrollTop + msgList.offsetHeight + 100
      this.msgs.push(msg)
      setTimeout(() => {
        if (isTouchBottom) {
          this.scrollToBottom()
        }
      },0)
    },
    scrollToBottom() {
      var msgList = this.$els.msgList
      msgList.scrollTop = msgList.scrollHeight
    },
    addChatMsg(msg) {
      this.addMsg(msg)
    },
    addAudioMsg(msg) {
      this.addMsg(msg)
    },
    addSystemMsg(msg) {
      var textMsg = new TextMessage(msg)
      textMsg.setAttributes({username:'系统'})
      this.addMsg(textMsg)
    },
    sendMsg() {
      if(!this.inputMsg) {
        this.handleError('请输入点什么~')
        return
      }
      var textMsg = new TextMessage(this.inputMsg)
      textMsg.setAttributes({username:this.curUser.username})
      this.commonSendMsg(textMsg)
       .then((msg) => {
         this.inputMsg = ''
       })
    },
    commonSendMsg(msg) {
      if (this.isSending) {
        util.show(this, 'error', '请等待上一条消息发送完成');
        return
      }
      this.isSending = true
      return this.conv.send(msg)
       .then((message) => {
          this.isSending = false
          this.addChatMsg(message)
          return Promise.resolve(message)
        }, (error) => {
          this.isSending = false
          this.handleError(error)
        })
    },
    sendSystemMsg(text) {
      var systemMsg = new SystemMessage()
      systemMsg.setText(text)
      systemMsg.setAttributes({username:this.curUser.username})
      this.commonSendMsg(systemMsg)
    },
    sendRewardMsg(amount) {
      var rewardMsg = new RewardMessage()
      rewardMsg.setText('我打赏了主播' + (amount / 100) + '元')
      rewardMsg.setAttributes({
        username:this.curUser.username,
        amount: amount
      })
      this.commonSendMsg(rewardMsg)
    },
    playVoice(serverId) {
      wx.downloadVoice({
        serverId: serverId,
        success: function (res) {
          wx.playVoice({
            localId: res.localId
          })
        },
        fail: this.handleError
      });
    },
    initScroll() {
      setTimeout(() => {
        var msgList = this.$els.msgList
        msgList.addEventListener('scroll', (e) => {
          var list = e.srcElement
          if (list.scrollTop == 0) {
            debug('top')
            util.loading(this)
            this.messageIterator.next().then((result) => {
              util.loaded(this)
              if (result.done) {
                util.show(this, 'warn', '没有更多消息了')
              }
              var originHeight = msgList.scrollHeight
              this.msgs = result.value.concat(this.msgs)
              setTimeout(() => {
                var afterHeight = msgList.scrollHeight
                msgList.scrollTop = afterHeight-originHeight
              }, 0)
            }, (error) => {
              util.loaded(this)
              util.show(this, 'error', error)
            })
          }
        })
      }, 0)
    },
    registerEvent() {
      this.client.on('message', (message, conversation) => {
        if (message.type == TextMessage.TYPE) {
          this.addChatMsg(message)
        } else if (message.type == WxAudioType) {
          this.addAudioMsg(message)
        } else if (message.type == SystemMessageType){
          this.addChatMsg(message)
        } else if (message.type == RewardMessageType) {
          this.addChatMsg(message)
        } else {
          this.addSystemMsg('此消息暂不支持显示')
        }
      })
      this.client.on('reuse', () => {
        this.addSystemMsg('服务器正在重连...')
      })
      this.client.on('error', (error) => {
        this.addSystemMsg('遇到错误 ' + error)
      })
    },
    openClient() {
      this.addSystemMsg('正在连接聊天服务器...')
      realtime.createIMClient(this.curUser.userId + '')
      .then((client) => {
        this.client = client
        this.addSystemMsg('聊天服务器连接成功')
        this.registerEvent()
        this.fetchConv()
      }).catch(this.handleError)
    },
    fetchConv() {
      debug('convid:' + this.live.conversationId)
      this.client.getConversation(this.live.conversationId)
      .then((conv) => {
        if (conv == null) {
          this.handleError('获取对话失败');
          return
        }
        this.conv = conv
        this.addSystemMsg('正在加载聊天记录...')
        var messageIterator = this.conv.createMessagesIterator({ limit: 100 })
        this.messageIterator = messageIterator
        return messageIterator.next()
      }).then((result)=> {
        if (result.done) {
        }
        this.msgs = this.msgs.concat(result.value)
        return this.conv.join()
      }).then((conv) => {
        if (!util.isDebug()) {
          var needSendIntoRoom = true;
          if (this.msgs.length > 0) {
            var lastMsg = this.msgs[this.msgs.length - 1]
            if (lastMsg.type == SystemMessageType &&
              lastMsg.from == this.client.id) {
                needSendIntoRoom = false
            }
          }
          if (this.live.status == 30) {
            needSendIntoRoom = false
          }
          if (needSendIntoRoom) {
            this.sendSystemMsg(this.curUser.username + '进入了房间')
          }
        }
        this.scrollToBottom()

        this.initScroll()
      }).catch(this.handleError)
    },
    playHls () {
      if (this.live.status < 20) {
        return
      }

      var video = document.querySelector('video')

      if (this.live.status >= 20) {
        var word = '';
        if (this.live.status == 30) {
          word = '连接了视频服务器'
        } else {
          word = '连接了直播服务器'
        }
        if (this.liveHost) {
          this.addSystemMsg(word + this.liveHost)
        }
      }

      // makeVideoPlayableInline(video)
      video.addEventListener('error', (ev) => {
        debug('event')
        debug(ev)
        if (ev.type == 'error') {
          util.show(this, 'error', '加载出错')
        }
        // if (video.networkState == HTMLMediaElement.NETWORK_NO_SOURCE) {
        //   util.show(this, 'error', '加载直播失败')
        // }
      })

      window.onresize = function() {
        video.style.width = window.innerWidth + "px";
        video.style.height = window.innerHeight + "px";
      }

      var events = ['canplay', 'play', 'playing']
      //var events = ['playing', 'waiting']
      for (var i = 0; i < events.length; i++) {
        var name = events[i]
        video.addEventListener(name, (ev) => {
          debug('event ' + ev.type + ' fired')
          debug(ev)
          if (ev.type == 'playing' || ev.type == 'canplay') {
            var videoElm = ev.srcElement

            debug('client height' + videoElm.clientHeight)
            debug('video height' + videoElm.videoHeight)
            // TODO: android videoHeight 为 0 的问题
            if (videoElm.videoHeight != 0) {
              // this.videoHeight = videoElm.clientHeight
            }
          }
          // if (ev.type == 'waiting') {
          //   this.playStatus = 1
          // }
          // if (ev.type == 'playing' || ev.type == 'play') {
          //   this.playStatus = 2
          // }
        })
      }

    },
    canPlayClick() {
      this.playStatus = 1
      var video = document.querySelector('video')
      video.load()
      video.play()
      setTimeout(() => {
        this.playStatus = 2
      }, 1000)
    },
    goComputer() {
      this.$router.go('/scan?liveId=' + this.live.liveId)
    },
    showRewardForm() {
      this.currentView = 'reward-form'
      this.overlayStatus = true
    },
    startLiveView(live) {
      http.post(this, 'liveViews', {
        liveId: live.liveId,
        platform: 'wechat',
        liveStatus: live.status
      }).then((data) => {
        this.liveViewId = data.liveViewId
      }, util.promiseErrorFn(this))
    },
    endLiveView() {
      if (this.liveViewId != 0) {
        http.get(this, 'liveViews/' + this.liveViewId + '/end')
        .then((resp) => {
        }, (error) => {
        })
      }
    },
    endInterval() {
      if (this.endIntervalId != 0) {
        clearInterval(this.endIntervalId)
        this.endIntervalId =0
      }
    },
    showChatTab() {
      this.currentTab = 0
    },
    showNoticeTab() {
      this.currentTab = 1
    },
    changeLiveUrl() {
      window.location.reload()
    },
    showSubscribeForm() {
      setTimeout(() => {
        if (this.curUser.wechatSubscribe == 0) {
          this.currentView = 'subscribe-form'
          this.overlayStatus = true
        }
      }, 100)
    }
  },
  events: {
    'rewardSucceed': function (amount) {
      this.sendRewardMsg(amount)
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/base.styl"
@import "../stylus/variables.styl"

.live-view
  @extend .full-space
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
        width 80px
        margin-top 5px
    .video-on
      .video-poster-cover
        @extend .full-space
        text-align center
        background rgba(0, 0, 0, 0.5)
        .video-center
          position absolute
          width 70px
          height 70px
          left 50%
          top 50%
          margin-left -35px
          margin-top -35px
          .loading-img
            width 100%
            height 100%
            animation circle 1s cubic-bezier(0, 0, 0.76, 0.77) infinite
          .canplay
            width 100%
            height 100%
            background url("../img/video-play.png") center no-repeat
            background-size 100% 100%
  .playlist-area
    height 50px
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
    .msg-list
      position absolute
      overflow hidden
      overflow-y scroll
      left 5px
      right 5px
      top 5px
      bottom 45px
      .msg
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
          margin-bottom 5px
          .name
            color #868686
            float left
          .content
            overflow hidden
            .bubble
              max-width 85%
              min-height 14px
              margin 0 10px
              border-radius 3px
              vertical-align top
              background-color #fff
              display inline-block
              position relative
              &:before
              &:after
                border 5px solid transparent
                content " "
                position absolute
                top 8px
                right 100%
              &:after
                border-right-color #fff
                border-right-width 5px
              .bubble-cont
                word-wrap break-word
                word-break break-all
                min-height 25px
              .audio-content
                .voice
                  width 40px
                  padding 0px 0px
                  .voice-gray
                    background url("../img/sprite.png") 0 -2427px
                    width 23px
                    height 23px
                    display inline-block
                    vertical-align middle
                    background-size 150px 2489px
              .text-content
                .plain
                  padding 3px 5px
                  font-size 14px
                  pre
                    word-wrap break-word
                    word-break normal
                    white-space pre-wrap
                  .reward-text
                    color #d65239
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
