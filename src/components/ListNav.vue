<template>
<div class="list-nav">

    <div class="intro-title" v-show="title">
        <a href="#" class="all-btn" @click.prevent="goAll">全部直播</a>

        <span href="#" class="title">{{title}}</span>
    </div>

    <div class="segment-control" v-show="!title">

        <a href="#" @click.prevent="goList" class="segment-item" :class="{'segment-active': mode==1}">全部直播</a><a href="#" @click.prevent="goMylist" class="segment-item right-item" :class="{'segment-active': mode==2}">我的直播</a>

    </div>

    <div class="right-drop">

      <user-avatar v-if="curUser.username" :user="curUser" @click="goProfile"></user-avatar>

      <img v-if="!curUser.username" class="default-avatar" src="../img/defaultAvatar.png" @click="goProfile"/>
    </div>

</div>
</template>

<script type="text/javascript">
import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'
import UserAvatar from '../components/user-avatar.vue'
import Dropdown from '../components/dropdown.vue'

const debug = debugFn('ListNav')

export default {
    name: 'ListNav',
    components: {
        'user-avatar': UserAvatar,
        'dropdown': Dropdown
    },
    props: ['mode', 'title', 'liveId'],
    data () {
      return {
        isAnchor: false, //是否为主播 默认应该为非主播
        curUser: {},
        showUserDropdown: false
      }
    },
    created () {
      this.curUser = util.curUser({})
    },
    route: {
      data({ to }) {
        debug('route nav')
      }
    },
    methods: {
        login () {
          this.$dispatch('loginOrRegister', this.liveId)
        },
        goList () {
          this.$router.go('/lives')
        },
        goMylist () {
          this.$router.go('/mylist')
        },
        goRegAnchor () {
          this.$router.go('/reganchor')
        },
        viewUserDropdown (e) {
          e && e.preventDefault()
          this.showUserDropdown = true
        },
        goProfile () {
          this.$router.go('/profile')
        },
        logout (e) {
          this.$http.get('logout').then(resp => {
            this.user = {}
            window.localStorage.removeItem('user')
            window.location.reload()
          }, util.httpErrorFn(this))
        },
        about () {
          util.show(this, 'success', '趣直播-知识直播平台，版本发布于：' + process.env.BUILD_TIME)
        },
        goAll () {
            this.$router.go('/lives')
        },
        goAccount () {
          this.$router.go('/account')
        }
    },
    events: {
      'updateCurUser': function() {
        this.curUser = util.curUser({})
        debug('updateCurUser in ListNav')
      }
    }
}
</script>

<style media="screen" lang="stylus">

.list-nav
  height 55px
  display flex
  justify-content center
  align-items center
  background #fff
  position relative
  .right-drop
    width 100px
    height 100%
    position absolute
    right 0
    .avatar,.default-avatar
      position absolute
      width 35px
      height 35px
      right 15px
      top 50%
      transform translateY(-50%)
  .intro-title
    .all-btn
      color #828282
      position absolute
      left 10px
      font-size 14px
      top 50%
      transform translateY(-50%)
    span
      color #828282
      font-size 18px
      font-weight bold
  .segment-control
    border 1px solid #00BDEF
    border-radius 4px
    display flex
    .segment-active
      background #00BDEF
      color #fff !important
    .segment-item
      padding 5px 13px
      color #00BDEF
      font-size 16px
    .right-item
      border-left 1px solid #00BDEF



</style>
