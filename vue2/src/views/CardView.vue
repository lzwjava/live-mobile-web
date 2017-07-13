<template>
  <div class="invite-view">
    <div class="card">
      <img :src="cardUrl">
    </div>
    <div class="tips-area">
      <p>提示</p>
      <p>1.长按图片分享给好友一起听课</p>
      <p>2.直播收入:7成归主播，2成归邀请者您，1成归平台</p>
      <p>3.没有限制，邀请越多奖励越多</p>
      <p>4.为了让您收到收益通知，请先关注「平方根科技」服务号</p>
      <p>5.如需帮助请联系客服(微信号：lzwjava2048)</p>
    </div>
    <overlay :overlay.sync="overlayStatus">
      <component :is="currentView" type="share" :live-id="liveId"></component>
    </overlay>
  </div>
</template>

<script type="text/javascript">
import api from '@/common/api'
import util from '@/common/util'

import UserAvatar from '@/components/user-avatar.vue'
import LoadMoreBar from '@/components/LoadMoreBar.vue'
import ShareLead from '@/components/ShareLead.vue'
import Overlay from '@/components/overlay.vue'
import SubscribeForm from '@/components/SubscribeForm.vue'

export default {
  name: 'InviteView',
  components: {
    'subscribe-form': SubscribeForm,
    'user-avatar': UserAvatar,
    'load-more-bar': LoadMoreBar,
    'share-lead': ShareLead,
    'overlay': Overlay
  },
  data () {
    return {
      liveId: 0,
      cardUrl: '',
      curUser: {},
      live: {},
      defaultUser: {},
      currentView: 'share-lead',
      overlayStatus: false
    }
  },
  route: {
    data ({ to }) {
      document.title = '邀请卡'

      const liveId = to.params.liveId
      if (liveId === this.liveId) return
      this.liveId = liveId
      this.defaultUser = util.defaultUser()
      this.curUser = util.curUser({})
      util.loading(this)

      Promise.all([
        api.makeInvitationCard(this, this.liveId)
      ]).then(values => {
        util.loaded(this)
        this.cardUrl = values[0]
      }, util.promiseErrorFn(this))
    }
  },
  methods: {
    fetchInvites () {
      return api.get(this, 'attendances/invites', {
        liveId: this.liveId,
        skip: this.invites.length,
        limit: 100
      })
    },
    showShareLead () {
      if (!this.curUser.userId) {
        this.$dispatch('loginOrRegister', this.liveId)
      } else {
        if (this.curUser.wechatSubscribe === 0) {
          this.currentView = 'subscribe-form'
          this.overlayStatus = true
        } else {
          this.currentView = 'share-lead'
          this.overlayStatus = true
        }
      }
    }
  }
}
</script>

<style lang="stylus">

@import "../stylus/variables.styl"
.invite-view
  background-color #D2D2D2
  .card
    background-color #2c2c2c
    text-align center
    img
      width 250px
      margin 20px 30px

  .title
    text-align center

  .tips-area
    margin-top 20px
    text-align left
    p
      font-size 30px
      font-size 14px


</style>
