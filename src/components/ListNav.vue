<template>

  <div class="list-nav">

    <div class="segment-control">

      <a href="#" @click.prevent="goList" class="segment-item" :class="{'segment-active': mode==0}">全部直播</a><a href="#" @click.prevent="goMylist" class="segment-item right-item" :class="{'segment-active': mode==1}">我的直播</a>

    </div>

    <div class="right-drop">
      <div class="login-area" v-show="!curUser.username">
        <a href="#" class="login-btn" @click.prevent="login">登录</a>
        <a href="#" class="register-btn" @click.prevent="register">注册</a>
      </div>

      <dropdown v-show="curUser.username">
        <div class="dropdown-anchor" slot="showText">
          <user-avatar :user="curUser" @click="viewUserDropdown"></user-avatar>
        </div>
        <div slot="options">
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" @click="logout" href="/">注销</a>
        </div>

      </dropdown>
    </div>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'
import UserAvatar from '../components/user-avatar.vue'
import Dropdown from '../components/dropdown.vue'

var debug = debugFn('ListNav')

export default {
  name: 'ListNav',
  components: {
    'user-avatar': UserAvatar,
    'dropdown': Dropdown
  },
  props: ['mode'],
  data() {
    return {
      curUser: {},
      showUserDropdown: false
    }
  },
  created() {
    debug('mode: %j', this.mode)
    api.fetchCurUserNoError(this)
     .then((data) => {
       this.curUser = data
     })
  },
  route: {
    data ({to}) {
    }
  },
  methods: {
    login() {
      this.$router.go('/?liveId=0')
    },
    register() {
      this.$router.go('/register/?liveId=0')
    },
    goList() {
      this.$router.go('/lives')
    },
    goMylist() {
      this.$router.go('/mylist')
    },
    viewUserDropdown (e) {
      e && e.preventDefault()
      this.showUserDropdown = true
    },
    logout (e) {
      e && e.preventDefault();
      this.$http.get('logout').then((resp) => {
        this.user = {};
        window.localStorage.removeItem('user');
        //this.$router.go('/lives')
        window.location.reload()
      }, util.httpErrorFn(this));
    }
  },
  events: {
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
    .login-area
      position absolute
      right 15px
      top 50%
      transform translateY(-50%)
      a
        color #828282
      .login-btn
        margin-right 8px
    .avatar
      position absolute
      width 35px
      height 35px
      right 15px
      top 50%
      transform translateY(-50%)
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
