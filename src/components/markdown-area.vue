<template>
  <div :id="markdownContainerId" class="markdown-area" :class="{active: content.length}">
    <textarea :id="textareaId" placeholder="{{ placeholder }}" aria-label="{{ placeholder }}" v-show="!showPreview" v-model='content' v-el:text @keydown="keyboardSubmit"></textarea>

    <markdown class="markdown-preview" v-show="showPreview" :content="content" :show = "showPreview"></markdown>

    <div class="markdown-actions" v-show="!showPreview">
      <div id="image-upload-container">
        <a @click.prevent="uploadImg" :id="imageBtnId">上传图片</a>
      </div>

      <a href="#" @click="preview">预览模式</a>
    </div>
    <div class="markdown-actions" v-show="showPreview">
      <a href="#" @click="focus">编辑模式</a>
    </div>
    <input type="file" style="opacity: 0; left: -99999px; position: absolute" v-el:file accept="image/*" @change="upload">
   </div>
</template>

<script>
  var debug = require('debug')('markdown-area');
  import Markdown from './markdown.vue'
  import util from '../common/util'
  require('moxie');
  require('plupload'); // use for Qiniu js sdk
  import Qiniu from 'qiniu-js-sdk'
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
      }
    },
    data () {
      return {
        showPreview: false,
        uploading: false,
        imageBtnId: 'image-btn',
        textareaId: 'textarea',
        markdownContainerId: 'markdown-container'
      }
    },
    created() {
      this.imageBtnId = 'image-btn-' + util.randomString(3)
      this.textareaId = 'textarea-' + util.randomString(3)
      this.markdownContainerId = 'markdown-container-' + util.randomString(3)
    },
    ready() {
      this.initQiniu()
    },
    methods: {
      keyboardSubmit: function(e) {
        if (e.keyCode !== 13) return;
        var mac = /mac/i.test(navigator.userAgent);
        if ((mac && !e.metaKey) || (!mac && !e.ctrlKey)) return;
        this.$emit('submit');
      },
      focus: function(e) {
        e && e.preventDefault();
        this.showPreview = false;

        var el = this.$els.text;
        setTimeout(function() {
          el.focus();
        }, 10);
      },
      preview: function(e) {
        e.preventDefault();
        if (this.showPreview) {
          return;
        }
        this.showPreview = true;
      },
      image: function(e) {
      },
      insertLink(link) {
        var textarea = document.getElementById(this.textareaId)
        this.insertAtCursor(textarea, link)
      },
      insertAtCursor(myField, myValue) {
          //IE support
          if (document.selection) {
              myField.focus();
              sel = document.selection.createRange();
              sel.text = myValue;
          }
          //MOZILLA and others
          else if (myField.selectionStart || myField.selectionStart == '0') {
              var startPos = myField.selectionStart;
              var endPos = myField.selectionEnd;
              myField.value = myField.value.substring(0, startPos)
                  + myValue
                  + myField.value.substring(endPos, myField.value.length);
          } else {
              myField.value += myValue;
          }
      },
      upload: function() {
        var files = this.$els.file.files;
        if (!files.length) return;

        var stamp = Date.now().toString(36);
        var mark = '[uploading image ' + stamp + ' ...]';
        this.uploading = true;
        this.content += '\n' + mark + '\n';
        // api.upload(files[0], null, function(resp) {
        //   this.content = this.content.replace(mark, '![image](' + resp.value + ')');
        //   this.focus();
        //   this.uploading = false;
        // }.bind(this));
      },
      uploadImg() {

      },
      initQiniu() {
        var component = this;
        this.$http.get('files/uptoken').then((res) => {
          if (util.filterError(this, res)) {
            var result = res.data.result;
            var uptoken = result.uptoken;
            var bucketUrl = result.bucketUrl;
            var key =result.key;
            var uploader = Qiniu.uploader({
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
                max_file_size: '100mb',           //最大文件体积限制
                max_retries: 3,                   //上传失败最大重试次数
                dragdrop: false,                  //开启可拖曳上传
                drop_element: this.markdownContainerId,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                //分块上传时，每片的体积
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                init: {
                    'FilesAdded': function(up, files) {
                    },
                    'BeforeUpload': function(up, file) {
                    },
                    'UploadProgress': function(up, file) {
                    },
                    'FileUploaded': function(up, file, info) {
                           var res = JSON.parse(info);
                           var sourceLink = bucketUrl + '/' + res.key;
                           component.insertLink(sprintf('![%s](%s)\n', file.name, sourceLink))
                    },
                    'Error': function(up, err, errTip) {
                           util.show(component, 'error', errTip)
                    },
                    'UploadComplete': function() {
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效
                        return util.randomString(6)
                    }
                }
            });
          }
        }, util.httpErrorFn(this))
      }
    }
  }
</script>

<style lang="stylus">

.markdown-area
  position relative
  padding-top 1em
  textarea
    font-size 16px
    border 1px solid rgba(40,47,49,0.3)
    opacity 0.8
    padding 10px
    &:focus
      border 1px solid #1CB2EF
  .markdown-preview
    margin-top 15px
    margin-bottom 15px
  .markdown-actions
    position absolute
    top -1px
    right 0
    opacity 0.6
    line-height 10px
    #image-upload-container
      display inline
      #image-btn
        margin-right 20px
    a
      color #666
      font-size 16px
      text-transform uppercase

</style>
