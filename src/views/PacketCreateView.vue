<template >
  <div class="packet-create-view">
    <p>总数量</p>
    <input type="number" name="" v-model="totalCount">
    <p>总金额(元)</p>
    <input type="number" name="" v-model="totalAmount">
    <p>祝福语</p>
    <input type="text" name="" v-model="wishing">
    <p>
      <button v-if="!showButton" class="send-btn" type="button" name="button" @click="createPacket">发红包</button>
    </p>

    <p v-if="showButton">
      <button class="send-btn" @click="goPacket">点击进入您的红包分享给别人</button>
    </p>

    <ul class="packets-list">

      <li v-for="packet in packets" @click="goOnePacket(packet)">
        <span class="packet-num">红包{{packet.id}}</span>

        <span class="remain">还有 {{packet.balance/100.0}} 元 {{packet.remainCount}} 个</span>
      </li>

    </ul>

  </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import util from '../common/util'
import wechat from '../common/wechat'
import debugFn from 'debug'

const debug = debugFn('PacketCreateView')

export default {
  name: 'PacketCreateView',
  data() {
    return {
      totalCount : 10,
      totalAmount: 100,
      wishing: '新年快乐！',
      showButton: 0,
      packet: {},
      packets: {}
    }
  },
  route: {
    data ({ to }) {
      util.loading(this)
      Promise.all([
        api.get(this, 'packets/meAll'),
        wechat.configWeixin(this)
      ]).then((values) => {
        util.loaded(this)
        this.packets = values[0]
      }, util.promiseErrorFn(this))
    }
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    createPacket() {
      util.loading(this)
      api.post(this, 'packets', {
        totalCount: this.totalCount,
        totalAmount: this.totalAmount * 100,
        channel: 'wechat_h5',
        wishing: this.wishing
      }).then((data) => {
        return wechat.wxPay(data)
      }).then(() => {
        return new Promise(resolve => setTimeout(resolve, 1000))
      }).then(() => {
        return api.get(this, 'packets/me')
      }).then((packet) => {
        util.loaded(this)
        this.packet = packet
        if (!this.packet.packetId) {
          util.show(this, 'success', '红包已生成，请稍后刷新页面')
          setTimeout(() => {
            location.reload()
          }, 1000)
        } else {
          wechat.sharePacket(this, this.packet)
          util.show(this, 'success', '发红包成功，请点击按钮分享给别人')
          this.showButton = 1
        }
      }, util.promiseErrorFn(this))
    },
    goPacket() {
      this.goOnePacket(this.packet)
    },
    goOnePacket(packet) {
      this.$router.go('packets/' + packet.packetId)
    }
  }
}

</script>

<style media="screen" lang="stylus">

.packet-create-view
  background #d65239
  width 100%
  min-height 100%
  text-align center
  color #fff
  font-size 20px
  input
    width 250px
    font-size 20px
    height 40px
    border-radius 5px
  .send-btn
    width 250px
    height 30px
    font-size 16px
    lien-height 30px
    background-color #fff
    color #d65239
    margin-top 30px
    border-radius 5px
  .packets-list
    text-align left
    margin-top 50px
    li
      padding 5px 30px
      margin-bottom 5px
      color #fff
      .remain
        float right
    .max-tips
      text-align center
      color gray
      margin 10px 0

</style>
