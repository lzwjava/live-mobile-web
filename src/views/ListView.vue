<template>

  <div class="list-view">
    <ul class="live-list">
      <li class="live-item" v-for="live in lives">
        <user-avatar :user="live.owner"></user-avatar>
        <div class="live-info">
          <p class="subject">{{live.subject}}</p>
          <p class="owner-name">{{live.owner.username}}</p>
          <div class="live-item-tag">
            <span class="time-label" v-show="live.status == 10">
              {{timeGap(live)}} {{timeWord(live)}}
            </span>

            <span class="on-label" v-show="live.status == 20">
              正在直播
            </span>

            <span class="attend-label" v-show="live.status == 30">
              {{live.attendanceCount}} 人参与
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from '../common/http'
import UserAvatar from '../components/user-avatar.vue'

export default {
  name: 'LiveView',
  components: {
    'user-avatar': UserAvatar
  },
  data() {
    return {
      lives: []
    }
  },
  created() {
    http.get(this, 'lives/on')
     .then((data) => {
       this.lives = data
     }, util.promiseErrorFn(this))
  },
  methods: {
    timeGap (live) {
      return ''
    },
    timeWord(live) {
      return ''
    }
  }
}

</script>

<style lang="stylus">

.list-view
  .live-list
    .live-item
      height 80px
      .avatar
        width 50px
        height 50px
        display inline-block
      .live-info
        display inline-block

</style>
