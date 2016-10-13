<template>
  <div class="live-view">
    <div class="player-area" :style="{height: videoHeight + 'px'}">
      <div class="video-wait" v-show="live.status == 10">
        <p class="big-title">离直播开始还有 {{timeGap}}</p>
        <p class="small-title">感谢参与，开播时您将收到一条短信通知~</p>
      </div>
      <div class="video-on" v-show="live.status == 20 || live.status == 30">
        <video id="player1" width="100%" height="100%" preload="preload"
           controls webkit-playsinline :src="videoSrc"></video>
        <div class="video-poster-cover" v-show="playStatus != 2">
          <img :src="live.coverUrl" width="100%" height="100%"/>
          <div class="video-center">
            <img class="loading-img" v-show="playStatus == 1" src="../img/video-circle.png">
            <div class="canplay" v-show="playStatus == 0" @click="canPlayClick"></div>
          </div>
        </div>
      </div>
      <!-- <div class="video-end" v-show="live.status == 30">
        <p class="big-title">直播已结束</p>
        <p class="small-title">谢谢您的参与，下次再会~</p>
      </div> -->
    </div>

    <div class="chat-area" :style="{top: videoHeight + 'px'}">

      <ul class="msg-list" :style="{top: listTop, bottom: listBottom}" v-el:msg-list @click="inputBlur">

        <li class="msg" v-for="msg in msgs">

          <span class="name">{{msg.attributes.username}}</span>

          <div class="content">
            <div class="bubble">
              <div class="text-content bubble-cont" v-if="msg.type == -1">
                <div class="plain">
                  <pre class="text">{{msg.text}}</pre>
                </div>
              </div>
              <div class="audio-content bubble-cont" v-if="msg.type == 1">
                <div class="voice" @click="playVoice(msg.attributes.serverId)">
                  <i class="voice-gray"> </i>
                </div>
              </div>
            </div>
          </div>

        </li>

      </ul>

      <div class="send-area" :style="{top: sendTop, bottom: sendBottom}">

        <a class="computer-btn"  @click="goComputer">
        </a>

        <a class="toggle-btn" v-bind:class="{'voice-btn': inputMode == 0, 'text-btn': inputMode == 1}"
           href="javascript:;" @click="toggleMode"></a>

        <div class="input-ways">

          <button v-show="inputMode == 1" v-el:press-btn class="btn btn-gray voice-input" type="button" onselectstart="return false;"
            @touchstart="holdToTalk" @touchend="mouseUp">{{btnTitle}}</button>

          <div class="text-input" v-show="inputMode == 0">
            <input type="text" v-model="inputMsg" @focus="inputFocus"> <button type="button" class="btn btn-gray" @click="sendMsg">发送</button>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'
import Loading from '../components/loading.vue'
import makeVideoPlayableInline from 'iphone-inline-video'
import {Toast} from 'vue-weui'

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

var prodAppId = 's83aTX5nigX1KYu9fjaBTxIa-gzGzoHsz'
var testAppId = 'YY3S7uNlnXUgX48BHTJlJx4i-gzGzoHsz'

var realtime = new Realtime({
  appId: prodAppId,
  region: 'cn',
  noBinary: true
})

realtime.register(WxAudioMessage)

export default {
  name: 'LiveView',
  components: {
    'loading': Loading,
    'toast': Toast
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
      videoHeight: 250,
      inputMode: 0,   // 0: text 1: voice
      inputing: 0
    }
  },
  computed: {
    timeGap () {
      return util.timeGap(this.live.planTs)
    },
    btnTitle() {
      if (this.isRecording) {
        return '松开发送语音'
      } else {
        return '按住说话'
      }
    },
    videoSrc() {
      if (this.live.status == 20) {
        return this.live.hlsUrl
      } else if (this.live.status == 30) {
        return this.live.videoUrl
      }
      return this.live.hlsUrl
    },
    sendBottom() {
      if (this.inputing) {
        return 'initial'
      } else {
        return '0px'
      }
    },
    sendTop() {
      if (this.inputing) {
        return '2px'
      } else {
        return 'initial'
      }
    },
    listBottom(){
      if (this.inputing) {
        return '5px'
      } else {
        return '45px'
      }
    },
    listTop() {
      if (this.inputing) {
        return '45px'
      } else {
        return '5px'
      }
    }
  },
  created() {
    //this.testSendMsgs()
  },
  ready() {
  },
  route: {
    data ({to}) {
      var liveId = to.params.liveId
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
      this.videoHeight = 250
      Promise.all([
        http.fetchLive(this, this.liveId),
        http.fetchCurUser(this),
        wechat.configWeixin(this)
      ]).then(values => {
        util.loaded(this)

        this.live = values[0]
        this.curUser = values[1]

        if (!this.live.canJoin) {
          util.show(this, 'error', '请先登录或报名直播')
          return
        }

        wechat.showOptionMenu()
        wechat.shareLive(this, this.live)
        this.openClient()
        this.playHls()

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
    testSendMsgs() {
      setTimeout(() => {
        for(var i = 0; i< 20;i++) {
          var text = i + ''
          setTimeout(() => {
            this.inputMsg = util.randomString(3);
            this.sendMsg()
          }, i * 100)
        }
      }, 2000)
    },
    addMsg(msg) {
      var msgList = this.$els.msgList
      var isTouchBottom = msgList.scrollHeight < msgList.scrollTop + msgList.offsetHeight + 100
      this.msgs.push(msg)
      setTimeout(() => {
        if (isTouchBottom) {
          var msgList = this.$els.msgList
          msgList.scrollTop = msgList.scrollHeight
        }
      },0)
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
      this.conv.send(textMsg)
      .then((message) => {
        this.addChatMsg(message)
        this.inputMsg = ''
        this.inputing = 0
      }).catch(this.handleError)
    },
    holdToTalk (e) {
      e.preventDefault()
      wx.startRecord({
        success: () => {
          this.isRecording = true
        }
      });
      wx.onVoiceRecordEnd({
          complete: (res) => {
              this.isRecording = false
              var localId = res.localId;
              util.show(this, 'success', '录音超过一分钟而停止')
              this.uploadVoice(localId)
          }
      });
    },
    sendAudioMsg(serverId) {
      var audioMsg = new WxAudioMessage()
      audioMsg.setAttributes({username: this.curUser.username, serverId: serverId})
      this.conv.send(audioMsg)
      .then((msg) => {
        this.addAudioMsg(msg)
      }).catch(this.handleError)
    },
    uploadVoice(localId) {
      wx.uploadVoice({
        localId: localId,
        success: (res) => {
          this.sendAudioMsg(res.serverId)
        },
        fail: this.handleError
      });
    },
    mouseUp(e) {
      e.preventDefault()
      wx.stopRecord({
        success: (res) => {
           this.isRecording = false
           var localId = res.localId;
           this.uploadVoice(localId)
        },
        fail: (error) => {
          this.isRecording = false
          util.show(this, 'error', error.errMsg)
        }
      })
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
    toggleMode() {
      this.inputMode = !this.inputMode
    },
    registerEvent() {
      this.client.on('message', (message, conversation) => {
        if (message.type == TextMessage.TYPE) {
          this.addChatMsg(message)
        } else if (message.type == WxAudioType) {
          this.addAudioMsg(message)
        } else {
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
      realtime.createIMClient(this.curUser.userId + '')
      .then((client) => {
        this.client = client
        this.addSystemMsg('服务器连接成功')
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
        return this.conv.queryMessages({
          limit:30
        })
      }).then((msgs)=> {
        for(var i = 0; i < msgs.length; i++) {
          this.addMsg(msgs[i])
        }
        return this.conv.join()
      }).then((conv) => {
        this.inputMsg = '进入了房间'
        this.sendMsg()
      }).catch(this.handleError)
    },
    playHls () {
      var video = document.querySelector('video')
      debug('video')
      debug(video)
      // makeVideoPlayableInline(video)
      video.addEventListener('error', (ev) => {
        debug('event')
        debug(ev)
        if (video.networkState == HTMLMediaElement.NETWORK_NO_SOURCE) {
          //util.show(this, 'error', '加载直播失败')
        }
      })
      var events = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'loadeddata',
         'loadstart', 'pause', 'play', 'playing','ratechange', 'seeked', 'seeking', 'stalled',
          'suspend', 'waiting','timeupdate', 'volumechange']
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
              this.videoHeight = videoElm.clientHeight
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
      video.play()
      setTimeout(() => {
        this.playStatus = 2
      }, 1000)
    },
    goComputer() {
      this.$router.go('/scan?liveId=' + this.live.liveId)
    },
    inputFocus() {
      // this.inputing = 1
    },
    inputBlur(e) {
      debug(e)
      this.inputing = 0
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/base.styl"

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
    p.small-title
      text-align center
      color #bebebe
      font-size 14px
    .video-wait
    .video-end
      padding-top 100px
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
  .chat-area
    padding 5px
    box-sizing border-box
    width 100%
    position absolute
    bottom 0
    left 0
    right 0
    .msg-list
      position absolute
      overflow hidden
      overflow-y scroll
      left 5px
      right 5px
      .msg
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
    .send-area
      position absolute
      left 5px
      right 5px
      height 40px
      box-sizing border-box
      padding-top 3px
      padding-bottom 3px
      .toggle-btn
        width 34px
        height 34px
        display inline-block
        &.voice-btn
          background url("../img/voice.png")
          background-size contain
        &.text-btn
          background url("../img/keyboard.png")
          background-size contain
      .computer-btn
          width 30px
          height 30px
          display inline-block
          background url("../img/computer-btn.png")
          background-size contain
      .input-ways
        position absolute
        left 80px
        top 0
        right 0
        bottom 0
        font-size 16px
        .btn-gray
          border 1px solid rgb(203, 204, 208)
          background-color rgb(242,242,245)
          &:active
            background-color rgb(186, 187, 190)
        .voice-input
          width 100%
          height 32px
          margin-top 3px
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

@keyframes circle
  0%
    transform rotateZ(0deg)
  100%
    transform rotateZ(360deg)

</style>
