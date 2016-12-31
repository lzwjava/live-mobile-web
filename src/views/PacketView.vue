<template >

  <div class="packet-view">

    <h2 class="title">
      {{packet.user.username}}的红包
    </h2>

    <h3 class="small-title">
      {{packet.wishing}}
    </h3>

    <div class="">

      <button v-if="!showSucceed" type="button" class="grab-btn" @click="grabPacket">抢红包</button>

      <h3 class="small-title" v-if="showSucceed" >您已抢到红包<br>请到微信里查看</h3>

    </div>

    <button v-if="showSucceed" class="send-btn" @click="sendPacket">发红包</button>

  </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import debugFn from 'debug'
import util from '../common/util'
import wechat from '../common/wechat'

const debug = debugFn('PacketView')

export default {
  name: 'PacketView',
  data() {
    return {
      packetId: '',
      packet: {},
      showSucceed: 0,
      curUser: {}
    }
  },
  route: {
    data({to}) {
      var params = this.$route.params;
      this.packetId = params.packetId
      Promise.all([
        api.get(this, 'packets/' + this.packetId),
        api.fetchCurUser(this),
        wechat.configWeixin(this)
      ]).then(values => {
        util.loaded(this)

        this.packet = values[0]
        this.curUser = values[1]


        wechat.showOptionMenu()
        wechat.sharePacket(this, this.packet)

      }, util.promiseErrorFn(this))
    }
  },
  methods: {
    fetchData() {
      api.get(this, 'packets/' + this.packetId)
       .then((packet) => {
         this.packet = packet
       }, util.promiseErrorFn(this))
    },
    grabPacket() {
      if (this.curUser.userId) {
        api.get(this, 'packets/' + this.packetId + '/grab')
         .then((res) => {
           util.show(this, 'success', '恭喜您')
           this.showSucceed = 1
         }, util.promiseErrorFn(this))
      } else {
        this.$router.go('/register/?liveId=' + liveId)
      }
    },
    sendPacket() {
      this.$route.go('/packet')
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import "../stylus/base.styl"

.packet-view
  background #d65239
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  text-align center
  .title
    color #fff
    text-align center
    margin-top 100px
  .small-title
    color #fff
    text-align center
    margin-top 50px
  .grab-btn
    width 200px
    height 50px
    font-size 30px
    background-color #fff
    color #d65239
    margin-top 100px
  .send-btn
    width 100px
    height 30px
    background-color #fff
    color #d65239
    margin-top 150px



</style>
