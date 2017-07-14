<template>

  <div class="room-view">

    <div class="room-cover">

      <div class="room-info">

        <img class="room-avatar" :src="user.avatarUrl"/>

        <div class="room-name">{{user.username}} 的直播间</div>

      </div>

    </div>

    <div class="createLive" v-if="curUser.userId === parseInt(userId)">
      <button type="button" name="button" class="createLiveBtn" @click="createLive">
        <h2>发起直播</h2>
      </button>
    </div>

    <div class="tab-area">

      <div class="tab-item" @click="showAttend" v-bind:class="{active: curTab === 0}">
        参与的直播({{attendLives.length}})
      </div>

      <div class="tab-item" @click="showCreate" v-bind:class="{active: curTab === 1}">
        创建的直播({{createLives.length}})
      </div>

    </div>

    <div class="live-list">

      <div class="attend-lives" v-show="curTab === 0">
        <live-list :lives="attendLives"></live-list>
      </div>

      <div class="create-lives" v-show="curTab === 1">
        <live-list :lives="createLives"></live-list>
      </div>

    </div>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'
import LiveList from '../components/LiveList.vue'

const debug = debugFn('RoomView')

export default {
  name: 'RoomView',
  components: {
    'live-list': LiveList
  },
  data() {
    return {
      userId: 0,
      user: {},
      attendLives: [],
      createLives: [],
      curTab: 0,
      from: '',
      curUser: {}
    }
  },
  route: {
    data ({ to }) {
      if (!util.checkInSession(this)) return

      this.curUser = util.curUser()

      let userId = to.params.userId
      if (userId === this.userId) return
      this.userId = userId

      this.from = to.query.from
      if (this.from === 'profile') {
        this.curTab = 1
      }
      util.loading(this)
      Promise.all([
        api.get(this, `users/${this.userId}`),
        api.get(this, 'lives/userLives', {
          userId: this.userId
        }),
        api.get(this, 'lives/attended', {
          userId: this.userId
        })
      ]).then(values => {
        util.loaded(this)
        this.user = values[0]
        this.createLives = values[1]
        this.attendLives = values[2]
      }).catch(util.promiseErrorFn(this))
    }
  },
  methods: {
    showCreate () {
      this.curTab = 1
    },
    showAttend () {
      this.curTab = 0
    },
    createLive () {
      util.loading(this)
      api.post(this, 'lives/').then(data => {
        util.loaded(this)
        this.$router.go(`/editLive/${data.liveId}`)
      }).catch(util.promiseErrorFn(this))
    }
  }
}

</script>

<style media="screen" lang="stylus">

.room-view
  .room-cover
    background url('../img/room-cover.jpg')
    background-size cover
    width 100%
    height 220px
    position relative
    .room-info
      position absolute
      left 0
      right 0
      bottom 0
    .room-avatar
      width 60px
      height 60px
      margin-left 20px
      margin-bottom 20px
    .room-name
      margin-left 10px
      display inline-block
      vertical-align top
      padding-top 20px
      color #fff
  .createLive
    width 100%
    position relative
    .createLiveBtn
      width 94%
      display block
      overflow hidden
      background-color #00bdef
      color white
      border-radius 5px
      margin 3%
      height 35px
  .tab-area
    display flex
    height 40px
    .tab-item
      flex-grow 1
      background-color #fff
      text-align center
      line-height 40px
      transition all .5s ease
      color rgb(112, 112, 112)
      &.active
        color #00BDEF
        border-bottom 1px solid #00BDEF

</style>
