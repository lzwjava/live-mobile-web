<template>
  <div :id="markdownContainerId" class="markdown-area" :class="{active: content.length}">

    <div class="markdown-actions" v-if="supportMarkdown" id="image-upload-container">

      <button class="btn btn-gray" :id="imageBtnId">上传图片</button>

      <button class="btn btn-gray btn-preview" @click="preview" v-show="!showPreview">预览模式</button>

      <button class="btn btn-gray btn-edit" @click="focus" v-show="showPreview">编辑模式</button>

    </div>


    <div class="markdown-content">

      <textarea class="markdown-area-common" :id="textareaId" placeholder="{{ placeholder }}" v-show="!showPreview" v-model='content' v-el:text @keydown="keyboardSubmit"></textarea>

      <markdown class="markdown-preview markdown-area-common" v-show="showPreview" :content="content" :show="showPreview"></markdown>

      <p class="tips" v-if="supportMarkdown">* 支持 Markdown</p>

    </div>

  </div>

</template>

<script>

  const debug = require('debug')('markdown-area');
  import Markdown from '../components/markdown.vue'
  import util from '../common/util'
  import api from '../common/api'
  require('moxie')
  require('plupload')
  import Qiniu from '../common/qiniu'
  import {sprintf} from 'sprintf-js'

  module.exports = {
    components: {
      'markdown': Markdown
    },
    props: {
      placeholder: String,
      content: {
        type: String,
        default: ''
      },
      supportMarkdown: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        showPreview: false,
        imageBtnId: 'image-btn',
        textareaId: 'textarea',
        markdownContainerId: 'markdown-container'
      }
    },
    created () {
      this.imageBtnId = 'image-btn-' + util.randomString(3)
      this.textareaId = 'textarea-' + util.randomString(3)
      this.markdownContainerId = 'markdown-container-' + util.randomString(3)
    },
    ready () {
      this.initQiniu()
    },
    methods: {
      keyboardSubmit (e) {
        if (e.keyCode !== 13) return
        var mac = /mac/i.test(navigator.userAgent)
        if ((mac && !e.metaKey) || (!mac && !e.ctrlKey)) return
        this.$emit('submit')
      },
      focus (e) {
        e && e.preventDefault()
        this.showPreview = false

        let el = this.$els.text
        setTimeout(function() {
          el.focus()
        }, 10)
      },
      preview (e) {
        e.preventDefault()
        if (this.showPreview) {
          return
        }
        this.showPreview = true
      },
      insertLink (link) {
        let textarea = document.getElementById(this.textareaId)
        this.insertAtCursor(textarea, link)
      },
      insertAtCursor (myField, myValue) {
          //IE support
          if (document.selection) {
              myField.focus()
              sel = document.selection.createRange()
              sel.text = myValue
          }
          //MOZILLA and others
          else if (myField.selectionStart || myField.selectionStart == '0') {
              let startPos = myField.selectionStart
              let endPos = myField.selectionEnd
              myField.value = myField.value.substring(0, startPos)
                  + myValue
                  + myField.value.substring(endPos, myField.value.length)
          } else {
              myField.value += myValue
          }
      },
      initQiniu () {
        api.get(this, 'files/uptoken').then(res => {
          let result = res
          let uptoken = result.uptoken
          let bucketUrl = result.bucketUrl
          let key = result.key
          let uploader = Qiniu.uploader({
              runtimes: 'html5,flash,html4',    //上传模式,依次退化
              browse_button: this.imageBtnId,       //上传选择的点选按钮，**必需**
              uptoken_url: 'useless',
              uptoken: uptoken,
              domain: bucketUrl,
              flash_swf_url: 'js/plupload/Moxie.swf',
              unique_names: false,
              save_key: false,
              get_new_uptoken: false,           //设置上传文件的时候是否每次都重新获取新的token
              container: 'image-upload-container',    //上传区域DOM ID，默认是browser_button的父元素，
              max_file_size: '1mb',           //最大文件体积限制
              max_retries: 3,                   //上传失败最大重试次数
              dragdrop: false,                  //开启可拖曳上传
              drop_element: this.markdownContainerId,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
              chunk_size: '4mb',                //分块上传时，每片的体积
              auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
              init: {
                  'FilesAdded': (up, files) => {
                  },
                  'BeforeUpload': (up, file) => {
                    util.loading(this)
                  },
                  'UploadProgress': (up, file) => {
                  },
                  'FileUploaded': (up, file, info) => {
                    let res = JSON.parse(info)
                    let sourceLink = bucketUrl + '/' + res.key
                    this.insertLink(sprintf('![%s](%s)\n', file.name, sourceLink))
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
        }, util.promiseErrorFn(this))
      }
    }
  }
</script>

<style lang="stylus">

.markdown-area
  position relative
  .markdown-content
    margin-top 10px
    display block
    height 400px
  .markdown-area-common
    width 100%
    height 92%
  .tips
    color #828282
    font-size 12px
  textarea
    font-size 16px
    border 1px solid rgba(40,47,49,0.3)
    opacity 0.8
    padding 10px
    &:focus
      border 1px solid #1CB2EF
  .markdown-preview
    .markdown-body
      background-color #fff
  .markdown-actions
    display flex
    .btn-edit
      color #00BDEF
    button
      flex 1
      margin 0 10px

</style>
