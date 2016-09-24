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

        <svg fill="currentColor" class="arrow" width="48" height="48" viewBox="0 0 48 48"><title>arrow</title><path d="M19.608308 11.291022c-.39064-.387697-1.037868-.388717-1.42788-.019096l-1.879672 1.7814c-.397956.37715-.40446 1.001224-.020242 1.388148l9.488537 9.55542-9.488535 9.55542c-.386777.389504-.36977 1.01853.020242 1.38815l1.879672 1.7814c.397955.37715 1.041186.364683 1.42788-.019096l12.09502-12.003886c.39064-.387697.386693-1.020195 0-1.403974L19.60831 11.291022z" fill-rule="evenodd"></path></svg>
      </li>
    </ul>
  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import http from 'api'
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
      border-width 1px 0
      border solid #eee
      background-color #fff
      height 80px
      padding 15px
      .avatar
          width 50px
          height 50px
          display inline-block
      .live-info
        display inline-block
        margin-left 10px
        width 70%
        height 80px
        p.subject
          word-wrap break-word
        .on-label
          color #fff
          background-color #64b3f1
          border-color #64b3f1
          border-radius 3px
          font-size 12px
          line-height 18px
          padding 2px 5px
      .arrow
        float right
        color #cecee0
        width 24px
        height 24px
        margin-top 25px

</style>
