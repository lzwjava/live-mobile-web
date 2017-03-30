<template>

  <div class="edit-user-view">

    <div class="edit-section">
      <span class="edit-title">
        头像
      </span>

      <span class="edit-right" @click="editAvatar">
        <user-avatar class="edit-avatar" :user="curUser"></user-avatar>
      </span>

    </div>

    <div class="edit-section">
      <span class="edit-title">
        名称
      </span>

      <span class="edit-right" @click="editUsername">
        <span class="edit-username">
          {{curUser.username}}
        </span>
      </span>

    </div>

    <overlay :overlay.sync="overlayStatus">
        <input-text-form title="名称" :text="curUser.username"></input-text-form>
    </overlay>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'
import wechat from '../common/wechat'
import UserAvatar from '../components/user-avatar.vue'
import Overlay from '../components/overlay.vue'
import InputTextForm from '../components/InputTextForm.vue'

var debug = debugFn('EditUserView')

export default {
  name: 'EditUserView',
  components: {
    'user-avatar': UserAvatar,
    'overlay': Overlay,
    'input-text-form': InputTextForm
  },
  data() {
    return {
      curUser: {},
      overlayStatus: false
    }
  },
  route: {
    data ({to}) {
      this.curUser = util.curUser()

      Promise.all([
        wechat.configWeixin(this)
      ]).then((values) => {

      }, util.promiseErrorFn(this))
    }
  },
  created() {
  },
  ready() {
  },
  methods: {
    updateUser(info) {
      util.loading(this)
      api.post(this,'self', info)
       .then((data) => {
         util.loaded(this)
         util.saveCurUser(data)
         this.$dispatch('updateCurUser')
         util.show(this, 'success', '更新成功')
       }, util.promiseErrorFn(this))
    },
    editAvatar() {
      if (!util.isWeixinBrowser()) {
        util.show(this, 'warn', '仅支持在微信浏览器中更改头像')
      } else {
        wechat.chooseAndUploadImage()
         .then((data) => {
           this.updateUser({
             avatarUrl: data.url
           })
         }, util.promiseErrorFn(this))
      }
    },
    editUsername() {
      this.overlayStatus = true
    }
  },
  events: {
    'updateCurUser': function () {
      debug('event updateCurUser')
      this.curUser = util.curUser()
    },
    'inputTextFormConfirm': function (newUsername) {
      if (newUsername != this.curUser.username) {
        this.updateUser({
          username: newUsername
        })
      }
    }
  }
}

</script>

<style media="screen" lang="stylus">

.edit-section
  padding 10px 0
  border-bottom solid 1px #f5f5f5
  display flex
  background-color #fff
  align-items center
  .edit-title
    padding-left 10px
    color #3d4245
    font-size 15px
  .edit-right
    flex 1
    text-align right
    padding-right 20px
  .edit-avatar
    width 30px
    height 30px
    vertical-align middle
  .edit-username
    color #909499



</style>
