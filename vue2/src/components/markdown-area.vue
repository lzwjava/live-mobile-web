<template>
  <div :id="markdownContainerId" class="markdown-area" :class="{active: content.length}">
    <div class="markdown-actions" v-if="supportMarkdown" id="image-upload-container">
      <button class="btn btn-gray" :id="imageBtnId">上传图片</button>
      <button class="btn btn-gray btn-preview" @click="preview" v-show="!showPreview">预览模式</button>
      <button class="btn btn-gray btn-edit" @click="focus" v-show="showPreview">编辑模式</button>
    </div>
    <div class="markdown-content">
      <textarea class="markdown-area-common" :id="textareaId" :placeholder="placeholder" v-show="!showPreview" v-model='content' ref="text" @keydown="keyboardSubmit"></textarea>
      <markdown class="markdown-preview markdown-area-common" v-show="showPreview" :content="content" :show="showPreview"></markdown>
      <p class="tips" v-if="supportMarkdown">* 支持 Markdown</p>
    </div>
  </div>
</template>

<script>
require('moxie')
require('plupload')
import Qiniu from 'qiniu-js-sdk'
import {sprintf} from 'sprintf-js'

import util from '@/common/util'
import api from '@/common/api'

import Markdown from '@/components/markdown.vue'
export default {
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
  mounted () {
    this.initQiniu()
  },
  methods: {
    keyboardSubmit (e) {
      if (e.keyCode !== 13) return
      let mac = /mac/i.test(navigator.userAgent)
      if ((mac && !e.metaKey) || (!mac && !e.ctrlKey)) return
      this.$emit('submit')
    },
    focus (e) {
      e && e.preventDefault()
      this.showPreview = false

      let el = this.$refs.text
      setTimeout(function () {
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
      if (document.selection) {
        myField.focus()
        let sel = document.selection.createRange()
        sel.text = myValue
      } else if (myField.selectionStart || myField.selectionStart === '0') {
        let startPos = myField.selectionStart
        let endPos = myField.selectionEnd
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
      } else {
        myField.value += myValue
      }
    },
    initQiniu () {
      api.get(this, 'files/uptoken').then(res => {
        let result = res
        let uptoken = result.uptoken
        let bucketUrl = result.bucketUrl
        /* eslint-disable */
        let key = result.key
        let uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4',
          browse_button: this.imageBtnId,
          uptoken_url: 'useless',
          uptoken: uptoken,
          domain: bucketUrl,
          flash_swf_url: 'js/plupload/Moxie.swf',
          unique_names: false,
          save_key: false,
          get_new_uptoken: false,
          container: 'image-upload-container',
          max_file_size: '1mb',
          max_retries: 3,
          dragdrop: false,
          drop_element: this.markdownContainerId,
          chunk_size: '4mb',
          auto_start: true,
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
        /* eslint-enable */
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
