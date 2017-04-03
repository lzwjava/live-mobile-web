<template>

  <div class="room-view">

    <div class="room-cover">

      <div class="room-info">

        <img class="room-avatar" :src="user.avatarUrl"/>

        <span class="room-name">{{user.username}}的直播间</span>

      </div>

    </div>

    <div class="tab-area">

      <div class="tab-item" @click="showAttend" v-bind:class="{active: curTab == 0}">
        参与的直播
      </div>

      <div class="tab-item" @click="showCreate" v-bind:class="{active: curTab == 1}">
        创建的直播
      </div>

    </div>

    <div class="live-list">

      <div class="attend-lives" v-show="curTab == 0">
        <live-list :lives="attendLives"></live-list>
      </div>

      <div class="create-lives" v-show="curTab == 1">
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

var debug = debugFn('RoomView')

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
      curTab: 0
    }
  },
  route: {
    data ({to}) {
      this.userId = to.params.userId
      util.loading(this)
      Promise.all([
        api.get(this, 'users/' + this.userId),
        api.get(this, 'lives/userLives', {
          userId: this.userId
        }),
        api.get(this, 'lives/attended', {
          userId: this.userId
        })
      ]).then((values) => {
        util.loaded(this)
        this.user = values[0]
        this.createLives = values[1]
        this.attendLives = values[2]
      }).catch(util.promiseErrorFn(this))
    }
  },
  methods: {
    showCreate() {
      this.curTab = 1
    },
    showAttend() {
      this.curTab = 0
    }
  },
  events: {
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
      vertical-align top
      color #fff
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
