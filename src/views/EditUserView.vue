<template>

  <div class="edit-user-view" id="upload-container">

    <div class="edit-section">
      <span class="edit-title">
        头像
      </span>

      <span class="edit-right" id="pickfiles">
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
import Overlay from '../components/Overlay.vue'
import InputTextForm from '../components/InputTextForm.vue'

require('moxie')
require('plupload') // use for Qiniu js sdk
import Qiniu from '../common/qiniu'

const debug = debugFn('EditUserView')

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
      overlayStatus: false,
      hasDataReady: false,
      hasDomReady: false
    }
  },
  route: {
    data ({ to }) {
      this.curUser = util.curUser()

      Promise.all([
        wechat.configWeixin(this)
      ]).then(values => {
        this.hasDataReady = true
        this.tryInitQiniu()
      }, util.promiseErrorFn(this))
    }
  },
  ready() {
    this.hasDomReady = true
    this.tryInitQiniu()
  },
  methods: {
    updateUser (info) {
      util.loading(this)
      api.post(this, 'self', info)
       .then(data => {
         util.loaded(this)
         util.saveCurUser(data)
         this.$dispatch('updateCurUser')
         util.show(this, 'success', '更新成功')
       }, util.promiseErrorFn(this))
    },
    editUsername () {
      this.overlayStatus = true
    },
    tryInitQiniu () {
      if (this.hasDomReady && this.hasDataReady) {
        this.initQiniu()
      }
    },
    initQiniu () {
      api.get(this, 'files/uptoken').then(res => {
        let result = res
        let uptoken = result.uptoken
        let bucketUrl = result.bucketUrl
        this.bucketUrl = bucketUrl
        let key =result.key
        let uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4',    //上传模式,依次退化
          browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
          uptoken_url: 'useless',
          uptoken: uptoken,
          domain: bucketUrl,
          flash_swf_url: 'js/plupload/Moxie.swf',
          unique_names: false,
          save_key: false,
          get_new_uptoken: false,           //设置上传文件的时候是否每次都重新获取新的token
          max_file_size: '500kb',           //最大文件体积限制
          max_retries: 3,                   //上传失败最大重试次数
          dragdrop: false,                  //开启可拖曳上传
          drop_element: 'upload-container',  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb',                //分块上传时，每片的体积
          auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
          filters: {
            mime_types : [
              {title : "Image files", extensions: "jpg,png,jpeg"}    //限制文件格式
            ]
          },
          init: {
              'FilesAdded': (up, files) => {
              },
              'BeforeUpload': (up, file) => {
                util.loading(this)
              },
              'UploadProgress': (up, file) => {
              },
              'FileUploaded': (up, file, info) => {
                var res = JSON.parse(info)
                var sourceLink = bucketUrl + '/' + res.key
                this.updateUser({
                  avatarUrl: sourceLink
                })
              },
              'Error': (up, err, errTip) => {
                util.show(this, 'error', errTip)
              },
              'UploadComplete': () => {
                util.loaded(this)
              },
              'Key': (up, file) => {
                  return util.randomString(6)
              }
          }
        })
      }) // api
    } // initQiniu
  },
  events: {
    'updateCurUser': function () {
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
