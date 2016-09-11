<template>
  <div class="live-view">
    <div class="player-area">
      <video id="player1" width="100%" height="100%" :poster="live.coverUrl"
         controls webkit-playsinline autoplay :src="live.hlsUrl"></video>
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
    'loading': Loading
  },
  data() {
    return {
      liveId: 0,
      live: {},
      client: {},
      conv: {},
      curUser: {},
      msgs: [],
      inputMsg: ''
    }
  },
  computed: {
  },
  created() {
    wechat.configWeixin(this)
    // setTimeout(() => {
    //   for(var i = 0; i< 12;i++) {
    //     this.inputMsg = i + '';
    //     this.sendMsg()
    //   }
    // }, 1000)
  },
  ready() {
  },
  route: {
    data ({ to }) {
      this.liveId = to.params.liveId
      if (!this.liveId) {
        util.show(this, 'error', '缺少参数')
        return
      }
      this.fetchLive()
      this.fetchCurUser()
    }
  },
  methods: {
    handleError (error) {
      util.show(this, 'error', error)
    },
    addMsg(name, text) {
      this.msgs.push({name: name, text: text})
      setTimeout(() => {
        var msgList = this.$els.msgList
        msgList.scrollTop = msgList.scrollHeight
      },10)
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
        this.conv.join().then((conv) => {
          this.addSystemMsg('加入直播聊天室成功')
        }).catch(this.handleError)
      }).catch(this.handleError)
    },
    fetchCurUser () {
      http.fetchCurUser(this)
      .then((user) => {
        debug('user: %j', user)
        this.curUser = user
        this.openClient()
      }).catch(util.promiseErrorFn(this))
    },
    fetchLive () {
      this.$broadcast('loading')
      http.fetchLive(this, this.liveId)
       .then((live) => {
         this.live = live
         this.$broadcast('loaded')
         live.canJoin = true
         live.hlsUrl = 'http://cheer.quzhiboapp.com/live/GAXRrVWD_ff.m3u8'
         if (!live.canJoin) {
           util.show(this, 'error', '请先登录或报名直播')
           return
         }
         wechat.showMenu()
         wechat.shareLive(this.live)
         this.playHls()
       })
       .catch(util.promiseErrorFn(this))
    },
    playHls () {
      var video = document.querySelector('video')
      makeVideoPlayableInline(video);
      debug('video')
      debug(video)
      //video.play()
    }
  }
}

</script>

<style lang="stylus">

.live-view
  height 100%
  display flex
  flex-direction column
  .player-area
    width 100%
  .chat-area
    flex-grow 1
    display flex
    flex-direction column
    padding 5px
    .msg-list
      width 100%
      flex-grow 1
      overflow hidden
      overflow-y scroll
      .msg
        font-size 14px
        .name
          color #00CFF5
    .send-area
      flex-basis 50px
      input
        width 80%
        height 30px
      button
        width 15%

</style>
