<template>
  <div class="live-view">
    <div class="player-area">
      <div class="video-wait" v-show="live.status == 10">
        <p class="big-title">离直播开始还有 {{timeGap}}</p>
        <p class="small-title">感谢参与，开播时您请收到一条短信通知~</p>
      </div>
      <div class="video-on" v-show="live.status == 20">
        <video id="player1" width="100%" height="100%" preload="preload"
           controls webkit-playsinline :src="live.hlsUrl"></video>
        <div class="video-poster-cover" v-show="playStatus != 2">
          <img :src="live.coverUrl" width="100%" height="100%"/>
          <div class="video-center">
            <img class="loading-img" v-show="playStatus == 1" src="../img/video-circle.png">
            <div class="canplay" v-show="playStatus == 0" @click="canPlayClick"></div>
          </div>
        </div>
      </div>
      <div class="video-end" v-show="live.status == 30">
        <p class="big-title">直播已结束</p>
        <p class="small-title">谢谢您的参与，下次再会~</p>
      </div>
    </div>
    <div class="chat-area">
      <ul class="msg-list" v-el:msg-list>
        <li class="msg" v-for="msg in msgs">
          <span class="name">{{msg.name}}: </span><span class="text">{{msg.text}}</span>
        </li>
      </ul>

      <div class="send-area">
        <input type="text" v-model="inputMsg">  <button class="btn btn-blue" type="button" @click="sendMsg">发送</button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/http'
import wechat from '../common/wechat'
import Loading from '../components/loading.vue'
import makeVideoPlayableInline from 'iphone-inline-video'
import {Toast} from 'vue-weui'

var debug = require('debug')('LiveView')
var Realtime = require('leancloud-realtime').Realtime;
var TextMessage = require('leancloud-realtime').TextMessage;

var prodAppId = 's83aTX5nigX1KYu9fjaBTxIa-gzGzoHsz'
var testAppId = 'YY3S7uNlnXUgX48BHTJlJx4i-gzGzoHsz'

var realtime = new Realtime({
  appId: testAppId,
  region: 'cn',
  noBinary: true
})

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
      playStatus: 0   // 0: none, 1: loading 2: play
    }
  },
  computed: {
    timeGap () {
      return util.timeGap(this.live.planTs)
    }
  },
  created() {
    wechat.configWeixin(this)
    // setTimeout(() => {
    //   for(var i = 0; i< 20;i++) {
    //     var text = i + ''
    //     setTimeout(() => {
    //       this.inputMsg = text;
    //       this.sendMsg()
    //     }, i * 100)
    //   }
    // }, 2000)
  },
  ready() {
  },
  route: {
    data ({to}) {
      var liveId = to.params.liveId
      debug('liveId: ' + liveId)
      this.liveId = liveId
      this.liveId = liveId
      if (!this.liveId) {
        util.show(this, 'error', '缺少参数')
        return
      }
      util.loading(this)
      Promise.all([
        http.fetchLive(this, liveId),
        http.fetchCurUser(this)
      ]).then(values => {
        util.loaded(this)

        this.live = values[0]
        this.curUser = values[1]

        this.live.canJoin = true
        this.live.status = 10
        this.live.hlsUrl = 'http://cheer.quzhiboapp.com/live/GAXRrVWD_ff.m3u8'
        if (!this.live.canJoin) {
          util.show(this, 'error', '请先登录或报名直播')
          return
        }

        wechat.showMenu()
        wechat.shareLive(this.live)
        this.playHls()
        this.openClient()

      }, util.promiseErrorFn(this))
    }
  },
  methods: {
    handleError (error) {
      util.show(this, 'error', error)
    },
    addMsg(name, text) {
      this.msgs.push({name: name, text: text})
      setTimeout(() => {
        // 如果在底部的话才滚动到底
        var msgList = this.$els.msgList
        msgList.scrollTop = msgList.scrollHeight
      },0)
    },
    addChatMsg(msg) {
      var name = msg.attributes.username
      this.addMsg(name, msg.text)
    },
    addSystemMsg(msg) {
      this.addMsg('系统', msg)
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
      }).catch(this.handleError)
    },
    registerEvent() {
      this.client.on('message', (message, conversation) => {
        debug('on message')
        this.addChatMsg(message)
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
        this.conv.join().then((conv) => {
          this.addSystemMsg('加入聊天室成功')
        }).catch(this.handleError)
      }).catch(this.handleError)
    },
    playHls () {
      var video = document.querySelector('video')
      makeVideoPlayableInline(video);
      debug('video')
      debug(video)
      video.addEventListener('error', (ev) => {
        debug('event')
        debug(ev)
        if (video.networkState == HTMLMediaElement.NETWORK_NO_SOURCE) {
          util.show(this, 'error', '加载直播失败')
        }
      })
      var events = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'loadeddata',
        'loadeddata', 'loadstart', 'pause', 'play', 'playing','ratechange', 'seeked', 'seeking', 'stalled',
          'suspend', 'waiting','timeupdate', 'volumechange']
      for (var i = 0; i < events.length; i++) {
        var name = events[i]
        video.addEventListener(name, (ev) => {
          debug('event ' + ev.type + ' fired')
          debug(ev)
          if (ev.type == 'waiting') {
            //util.loading(this)
            this.playStatus = 1
          }
          if (ev.type == 'playing') {
            //util.loaded(this)
            this.playStatus = 2
          }
        })
      }
    },
    canPlayClick() {
      this.playStatus = 1
      var video = document.querySelector('video')
      video.play()
    }
  }
}

</script>

<style lang="stylus">

.full-space
    position absolute
    width 100%
    top 0
    left 0
    bottom 0
    right 0

.live-view
  height 100%
  .player-area
    width 100%
    height 280px
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
    .msg-list
      width 100%
      overflow hidden
      overflow-y scroll
      .msg
        font-size 14px
        .name
          color #00CFF5
    .send-area
      input
        width 80%
        height 30px
      button
        width 15%

@keyframes circle
  0%
    transform rotateZ(0deg)
  100%
    transform rotateZ(360deg)

</style>
