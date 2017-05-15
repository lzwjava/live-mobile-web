<template>
  <div class="live-view">
    <div class="player-area" v-el:player-area :style="{height: videoHeight + 'px'}">
      <div class="video-wait video-common" v-show="live.status == 10">
        <p class="big-title">离直播开始还有{{timeDuration}}</p>
        <p class="small-title">开播时您将收到一条微信通知</p>
        <img class="qrcode" :src="live.liveQrcodeUrl" alt="">
      </div>
      <div class="video-on" v-show="live.status == 20 || live.status == 25 || live.status == 30">
      <video id="player1" width="100%" :style="{height: videoHeight + 'px'}" preload="preload"
            controls webkit-playsinline
            playsinline v-el:video></video>

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
      <div class="intro-tab tab-item" @click="showIntroTab">
        简介
      </div>
      <div class="chat-tab tab-item" @click="showChatTab" v-bind:class="{active: currentTab == 0}">
        聊天
      </div>
      <div class="notice-tab tab-item" @click="showNoticeTab" v-bind:class="{active: currentTab == 1}">
        公告
      </div>
      <div class="subscribe-tab tab-item" @click="toggleSubscribe">
        {{subscribeTitle}}
      </div>
      <div class="live-tab tab-item" @click="changeLiveUrl">
        {{changeTitle}}
      </div>
    </div>

    <div class="chat-area tab-sub-area" :style="{top: (videoHeight + optionHeight + 35) + 'px'}"
         v-show="currentTab == 0">
         <div class="members-count" v-show="membersCount">
           在线 {{membersCount}}
         </div>
         <button type="button" class="live-config-btn" @click="funcLiveConfig" v-if="live.owner.userId == curUser.userId">配置</button>
         <div class="liveConfigArea" v-if="live.owner.userId == curUser.userId">
           <div class="live-config-area" v-if="liveConfig == true">
             <h3>配置</h3>
             <br />
             <button type="button" name="button" @click="beginLive">開始直播</button>
             <button type="button" name="button" @click="endLive">結束直播</button>
             <button type="button" name="button" @click="funcLiveConfigUrl">串流資訊</button>
             <button type="button" name="button" class="live-config-insider-btn-close" @click="funcLiveConfigCloseAll">關閉配置面板</button>
           </div>
           <div class="live-config-area" v-if="liveConfigUrl == true">
             <h3>串流資訊</h3>
             <p>
               串流位置
               <br />
               <p class="live-config-url">{{pushUrl}}</p>
               <br />
               串流密鑰
               <br />
               <p class="live-config-url">{{rtmpKey}}</p>
               <br />
               <button type="button" name="button" class="live-config-insider-btn-close" @click="funcLiveConfigCloseAll">關閉配置面板</button>
             </p>
           </div>
         </div>
      <ul class="msg-list" v-el:msg-list>

        <li class="msg" v-for="msg in msgs">

          <div class="system-msg" v-if="msg.type == 2 && live.status != 30">
            <div class="content">{{msg.text}}</div>
          </div>

          <div class="bubble-msg" v-if="msg.type !=2 ">

            <span class="name" @click="goUserRoom(msg.from)">{{msg.attributes.username}}</span>

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
            <input type="text" v-model="inputMsg" @keyup.enter="sendMsg">
            <button type="button" class="btn btn-gray" @click="sendMsg">发送</button>
          </div>
        </div>

      </div>

    </div>

    <div class="notice-area" v-show="currentTab == 1">
      <markdown :content="noticeContent"></markdown>
    </div>

    <overlay :overlay.sync="overlayStatus">
      <component :is="currentView" :live="live" :live-id="liveId" type="live" :qrcode-url="qrcodeUrl"></component>
    </overlay>

  </div>
</template>

<script type="text/javascript">
import util from '../common/util'
import http from '../common/api'
import wechat from '../common/wechat'
import Loading from '../components/loading.vue'
import {Toast, SelectCell, Cells} from 'vue-weui'
import RewardForm from '../components/RewardForm.vue'
import Overlay from '../components/overlay.vue'
import Markdown from '../components/markdown.vue'
import SubscribeForm from '../components/SubscribeForm.vue'
import QrcodePayForm from '../components/QrcodePayForm.vue'
import {sprintf} from 'sprintf-js'
import Hls from "hls.js"

var debug = require('debug')('LiveView')
var lcChat = require('leancloud-realtime')
var Realtime = lcChat.Realtime
var TextMessage = lcChat.TextMessage
var messageType = lcChat.messageType
var TypedMessage = lcChat.TypedMessage

var inherit = require('inherit')
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
    'subscribe-form': SubscribeForm,
    'qrcode-pay-form': QrcodePayForm
  },
  data() {
    return {
      liveId: 0,
      live: {
        owner: {}
      },
      client: {},
      conv: {},
      curUser: {},
      membersCount: '',
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
      currentView: '',
      hlsSelected: 0,
      qrcodeUrl: '',
      rewardOrderNo: '',
      rewardAmount: 0,
      hasCallReady: false,
      hasGotLive: false,
      liveConfig: false,
      liveConfigUrl: false,
      pushUrl: '',
      rtmpKey: '',
      useHlsjs: false,
      m3u8Url: '',
      player: null,
      membersCountId: 0,
      randomNum: 0,
      randomNuMId: 0
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

      this.rtmpKey = this.live.rtmpKey
      this.pushUrl = this.live.pushUrl

        if (!this.live.liveId) {

          return ''
        }
        if (this.live.status == 20) {
          return this.live.hlsUrls[this.hlsSelected]
        } else if (this.live.status == 30) {
            var video = this.videos[this.videoSelected]
            if (video.type == 'mp4') {
              return video.url
            } else if (video.type == 'm3u8') {
              return video.m3u8Url
            }
        }
        return this.live.hlsUrls[this.hlsSelected]
    },
    liveHost() {
      if (!this.videoSrc) {
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
      var coursewareUrl = this.live.coursewareUrl
      var coursewareMsg = coursewareUrl ? '课件地址：' + coursewareUrl + '\n'  : '主播未上传课件\n\n';
      return coursewareMsg + this.live.notice + this.defaultNotice
    },
    defaultNotice() {
      return '\n可打开 quzhiboapp.com 在电脑上观看\n\n可长按二维码加微信进用户群和主播聊聊：\n\n' +
      ' ![wechat_lzw_short.png](http://i.quzhiboapp.com/qzbgroup1.jpg)'
    },
    changeTitle() {
      return '切换线路'
    },
    subscribeTitle() {
      if (this.curUser.liveSubscribe) {
        return '已关注'
      } else {
        return '+关注'
      }
    }
  },
  created() {
    debug('created')
  },
  destroyed() {
    debug('destroyed')
  },
  updated() {
    debug('updated')
  },
  attached() {
    debug("attached")
    if (this.useHlsjs) {
      debug("attached m3u8", this.m3u8Url)
      this.hlsPlay(this.m3u8Url)
    }
  },
  detached() {
    debug('detached')
    this.endLiveView()
    this.endInterval()
    this.endCountInterval()
    if (this.useHlsjs) {
      if (this.player != null) {
        this.player.pause()
        this.playStatus = 0
      }
    }
  },
  ready() {
    var playerArea = this.$els.playerArea
    this.videoHeight =  Math.ceil(playerArea.offsetWidth * 0.625)
    debug('videoHeight: %j', this.videoHeight)
    this.hasCallReady = true
    debug('hasCallReady')
    setTimeout(() => {
      // videoHeight 应用上之后才调用
      this.tryPlayLiveOrVideo()
    }, 0)
  },
  watch: {
    videoSelected: function(val, oldVal) {
      this.canPlayClick()
    }
  },
  route: {
    data ({to}) {
      util.initTitle()
      var liveId = to.params.liveId
      if (liveId == this.liveId) {
        setTimeout(() => {
          this.scrollToBottom()
        }, 500)
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
      if (!util.checkInSession(this)) {
        return
      }
      this.curUser = util.curUser()
      Promise.all([
        http.fetchLive(this, this.liveId),
        http.fetchVideos(this, this.liveId),
        wechat.configWeixin(this)
      ]).then(values => {
        util.loaded(this)
        this.live = values[0]
        this.videos = values[1]
        // this.live.status = 20
        // if( this.live.liveId == 455){
        //   this.live.status = 20
        // }
        this.setPlayerSrc()
        if (!this.live.canJoin) {
          util.show(this, 'error', '请先登录或报名直播')
          return
        }
        wechat.showOptionMenu()
        wechat.shareLive(this, this.live, this.curUser)
        this.openClient()
        this.hlsSelected = util.randInt(this.live.hlsUrls.length)
        this.hasGotLive = true
        this.tryPlayLiveOrVideo()
        this.startLiveView(this.live)
        this.endInterval()
        this.endIntervalId = setInterval(() => {
          this.endLiveView()
        }, 1000 * 30)
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
      this.sendTextMsg(this.inputMsg).then((msg) => {
        if (this.inputMsg.indexOf('卡') != -1) {
          // this.sendTextMsg('我的直播线路是:' + this.liveHost)
        }
        this.inputMsg = ''
      })
    },
    sendTextMsg(text) {
      var textMsg = new TextMessage(text)
      textMsg.setAttributes({username:this.curUser.username})
      return this.commonSendMsg(textMsg)
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
        this.scrollToBottom()
        this.initScroll()
        if (this.live.status != 30) {
          var word = '1.恭喜入座！主播%s和您不见不散！\n2.可在上面或公告里扫描微信，邀请您进主播用户群'
          this.addSystemMsg(sprintf(word, this.live.owner.username))
        }
        let conversation = this.conv
        this.endCountInterval()
        this.getRondomNum()
        this.membersCountId = setInterval(() => {
          conversation.count().then((membersCount) => {
            let randomCount = membersCount * 3 + this.randomNum
            if(randomCount >= this.live.attendanceCount) {
              this.membersCount = this.live.attendanceCount
            } else {
              this.membersCount = randomCount
            }
          }).catch()
        }, 5000)
      }).catch(this.handleError)
    },
    getRondomNum () {
      clearInterval(this.randomNumId)
      this.randomNumId = setInterval(() => {
        this.randomNum = parseInt(3 * Math.random())
      }, 1000 * 60)
    },
    logServer() {
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
    },
    setPlayerSrc() {
        // debug("setPlayerSrc")
        let player = this.$els.video
        player.src = this.videoSrc
    },
    hlsPlay(url){
      //hlsjs init and play
      let player = this.$els.video
      if (!Hls.isSupported()) {
        util.show(this,'error','不支持hls，请切换浏览器')
        return
      }
      this.player = player
      var hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(player)
      debug("player.src",player.src)
      hls.on(Hls.Events.MANIFEST_PARSED,() => {
        player.play()
      })
      hls.on(Hls.Events.ERROR, () => {
        util.show(this, 'error', '播放器错误，请刷新重试')
      })
      this.playStatus = 1
      setTimeout(() => {
        this.playStatus = 2
      }, 1000)
    },
    tryPlayLiveOrVideo() {
      if (this.hasGotLive && this.hasCallReady) {
        this.playLiveOrVideo()
      } else {
        debug('ignore tryPlayLiveOrVideo')
      }
    },
    playLiveOrVideo () {
      //debug("playLiveOrVideo")
      if (this.live.status < 20) {
        return
      }
      this.logServer()
      if (util.isWeixinBrowser() || util.isSafari()) {
        let video = document.querySelector('video')
        video.addEventListener('error', (ev) => {
          debug('event')
          debug(ev)
          if (ev.type == 'error') {
            util.show(this, 'error', '加载出错，请刷新重试')
          }
        })
        this.useHlsjs = false
      } else {//chrome
        if (this.live.status == 20) {//play the this.live
          this.useHlsjs = true
          this.m3u8Url = this.live.webHlsUrl
          this.hlsPlay(this.live.webHlsUrl)
        } else if (this.live.status == 30) {//playback this.videos
          let video = this.videos[this.videoSelected]
          if (video.type == 'mp4') {
            this.useHlsjs = false
          } else if (video.type == 'm3u8'){
            this.m3u8Url = video.m3u8Url
            this.useHlsjs = true
            this.hlsPlay(video.m3u8Url)
          }
        }
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
    endCountInterval() {
      if (this.membersCountId != 0) {
        clearInterval(this.membersCountId)
        this.membersCount = ''
      }
    },
    showChatTab() {
      this.currentTab = 0
    },
    showNoticeTab() {
      this.currentTab = 1
    },
    changeLiveUrl() {
      if (this.live.status == 20) {
        if (util.isWeixinBrowser() || util.isSafari()) {
          this.hlsSelected = (this.hlsSelected + 1) % this.live.hlsUrls.length
          var video = document.querySelector('video')
          video.pause()
          setTimeout(() => {
            this.canPlayClick()
            this.logServer()
          }, 0)
        } else {
          window.location.reload()
        }
      } else {
        window.location.reload()
      }
    },
    showSubscribeForm() {
      this.currentView = 'subscribe-form'
      this.overlayStatus = true
    },
    subscribeLive(subscribe) {
      return http.post(this, 'self', {
        liveSubscribe: subscribe
      })
    },
    toggleSubscribe() {
      var newSubscribe
      if (this.curUser.liveSubscribe) {
        newSubscribe = 0
      } else {
        newSubscribe = 1
      }
      util.loading(this)
      this.subscribeLive(newSubscribe)
       .then((data) => {
         util.loaded(this)
         this.curUser = data
         if (newSubscribe) {
           util.show(this, 'success', '关注成功，有新直播发布时将告知您')
         } else {
           util.show(this, 'success', '取消关注成功')
         }
       })
    },
    fetchQrcodeUrlAndShow(amount) {
      util.loading(this)
      http.post(this, 'rewards', {
        amount: amount,
        liveId: this.live.liveId,
        channel: 'wechat_qrcode'
      }).then((data) => {
        util.loaded(this)
        this.qrcodeUrl = data.code_url
        this.rewardOrderNo = data.orderNo
        this.rewardAmount = amount
        this.currentView = 'qrcode-pay-form'
        this.overlayStatus = true
      }, util.promiseErrorFn(this))
    },
    rewardSucceed(amount) {
      util.show(this, 'success', '打赏成功')
      this.sendRewardMsg(amount)
    },
    showIntroTab() {
      this.$router.go('/intro/' + this.live.liveId)
    },
    goUserRoom(userId) {
      debug('goUserRoom: %j', userId)
      this.$router.go('/room/' + userId)
    },
    beginLive() {
      http.get(this, 'lives/' + this.liveId +'/begin')
       .then((data) => {
         util.show(this, 'success', '成功开启直播')
         // this.fetchLive()
       }, util.promiseErrorFn(this))
    },
    endLive() {
      http.get(this, 'lives/' + this.liveId +'/end')
      .then((data) => {
        util.show(this, 'success', '已设定为转码')
        // this.fetchLive()
      }, util.promiseErrorFn(this))
    },
    funcLiveConfig() {
      this.liveConfig = true
      this.liveConfigUrl = false
    },
    funcLiveConfigUrl() {
      this.liveConfigUrl = true
      this.liveConfig = false
    },
    funcLiveConfigCloseAll() {
      this.liveConfigUrl = false
      this.liveConfig = false
    },
  },
  events: {
    'reward': function (amount) {
      if (util.isWeixinBrowser()) {
        util.loading(this)
        http.post(this, 'rewards', {
          amount: amount,
          channel: 'wechat_h5',
          liveId: this.live.liveId
        }).then((data) => {
          util.loaded(this)
          return wechat.wxPay(data)
        }).then(() => {
          this.rewardSucceed(amount)
        }).catch((error) => {
          if (error && error.indexOf('失败') != -1) {
            this.fetchQrcodeUrlAndShow(amount)
          } else {
            util.show(this, 'error', error)
          }
        })
      } else {
        this.fetchQrcodeUrlAndShow(amount)
      }
    },
    'payFinish': function () {
      util.loading(this)
      setTimeout(() => {
        http.get(this, 'charges/one', {
          orderNo: this.rewardOrderNo
        }).then((charge) => {
          util.loaded(this)
          if (charge.paid) {
            this.rewardSucceed(this.rewardAmount)
          } else {
            util.show(this, 'error', '后台显示未到账，请重试')
          }
        }, util.promiseErrorFn(this))
      }, 1000)
    }
  }
}
</script>

<style lang="stylus">
@import "../stylus/base.styl"
@import "../stylus/variables.styl"
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
    .live-config-btn
      top 100px
      position relative
      color gray
      margin 5px
      padding 5px
      float right
      border-radius 5px
      z-index 100
    .live-config-area
      position relative
      background #fff
      border-radius 20px
      text-align center
      padding 20px 10px
      margin-left 5%
      margin-right 5%
      z-index 100
      word-break break-all
      button
        width 80%
        font-size 16px
        border-radius 10px
        height 50px
        margin-bottom 20px
        color white
        background-color #00bdef
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
