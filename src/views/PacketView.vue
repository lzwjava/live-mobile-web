<template >
  <div class="packet-main-view">

    <user-avatar class="big-avatar" :user="packet.user"></user-avatar>

    <h3 class="small-title">
      {{packet.user.username}}的红包
    </h3>

    <h2 class="title">
      {{packet.wishing}}
    </h2>

    <h4 class="small-title">还有 {{balance}} 元 {{packet.remainCount}} 个</h4>

    <div class="">

      <button v-if="!showSucceed" type="button" class="grab-btn" @click="grabPacket">抢红包</button>

      <h3 class="small-title" v-if="showSucceed" >您已抢到红包<br>请到微信里查看</h3>

    </div>

    <button class="send-btn" @click="sendPacket">发红包</button>

    <ul class="user-packets-list">

      <li v-for="userPacket in userPackets">
        <user-avatar :user="userPacket.user"></user-avatar>
        <span class="name">{{userPacket.user.username}}</span>

        <span class="amount">{{userPacket.amount / 100.0}}元</span>
      </li>

    </ul>

    <overlay :overlay.sync="overlayStatus">
        <component :is="currentView" type="packet" :packet-id="packetId"></component>
    </overlay>

  </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import debugFn from 'debug'
import util from '../common/util'
import wechat from '../common/wechat'
import SubscribeForm from '../components/SubscribeForm.vue'
import Overlay from '../components/overlay.vue'
import UserAvatar from '../components/user-avatar.vue'

const debug = debugFn('PacketView')

export default {
  name: 'PacketView',
  components: {
    'subscribe-form': SubscribeForm,
    'overlay': Overlay,
    'user-avatar': UserAvatar
  },
  data() {
    return {
      packetId: '',
      packet: {
        user: {}
      },
      showSucceed: 0,
      curUser: {},
      overlayStatus: false,
      currentView: 'subscribe-form',
      userPackets: []
    }
  },
  computed: {
    balance() {
      return this.packet.balance /100.0
    }
  },
  route: {
    data({to}) {
      var params = this.$route.params;
      this.packetId = params.packetId
      util.loading(this)
      Promise.all([
        api.get(this, 'packets/' + this.packetId),
        api.fetchCurUser(this),
        api.get(this, 'packets/' + this.packetId + '/userPackets'),
        wechat.configWeixin(this)
      ]).then(values => {
        util.loaded(this)

        this.packet = values[0]
        this.curUser = values[1]
        this.userPackets = values[2]

        wechat.showOptionMenu()
        wechat.sharePacket(this, this.packet)

      }, util.promiseErrorFn(this))
    }
  },
  methods: {
    grabPacket() {
      if (this.curUser.userId) {
        if (this.curUser.wechatSubscribe == 0) {
          this.currentView = 'subscribe-form'
          this.overlayStatus = true
        } else {
          util.loading(this)
          api.get(this, 'packets/' + this.packetId + '/grab')
           .then((res) => {
             util.loaded(this)
             if (res.status) {
               util.show(this, 'success', '恭喜您')
               this.showSucceed = 1
             } else {
               util.show(this, 'warn', '抱歉，红包已被抢完')
             }
           }, util.promiseErrorFn(this))
        }
      } else {
        this.$router.go('/register/?type=packet&packetId=' + this.packetId )
      }
    },
    sendPacket() {
      if (this.curUser.userId) {
        this.$router.go('/packet')
      } else {
        this.$router.go('/register/?type=packet&packetId=' + this.packetId )
      }
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import "../stylus/base.styl"

.packet-main-view
  background #d65239
  width 100%
  text-align center
  min-height 100%
  .big-avatar
    &.avatar
      width 100px
      height 100px
      margin-top 30px
  .title
    color #fff
    text-align center
    margin-top 20px
  .small-title
    color #fff
    text-align center
    margin-top 20px
  .grab-btn
    width 200px
    height 50px
    font-size 30px
    background-color #fff
    color #d65239
    margin-top 30px
    border-radius 10px
  .send-btn
    width 200px
    height 50px
    font-size 30px
    background-color #fff
    color #d65239
    margin-top 20px
    border-radius 10px
  .user-packets-list
    text-align left
    margin-top 50px
    li
      padding 5px 30px
      margin-bottom 5px
      color #fff
      .avatar
        margin-left 30px
        width 50px
        height 50px
      .name
        vertical-align top
        line-height 50px
        margin-left 10px
      .amount
        vertical-align top
        line-height 50px
        float right
    .max-tips
      text-align center
      color gray
      margin 10px 0

</style>
