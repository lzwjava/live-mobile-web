<template>
  <div class="edit-view">

    <div class="write-container">
        <div class="row" id="upload-container">
          <span class="hint">请上传封面(最佳尺寸 750x500)</span>
          <button class="upload-btn" id="pickfiles">本地上传</button>
          <div v-if="coverUrl">
            <img class="cover" :src="coverUrl"/>
          </div>
        </div>

        <div class="row need-pay-row">
          <span class="hint">是否需要付费</span>
          <input type="checkbox" v-model="needPay" name="needPay" value="0">
        </div>

        <div class="row need-pay-row">
          <span class="hint">分享是否显示封面(默认头像)</span>
          <input type="checkbox" v-model="shareIcon" name="shareIcon" value="0">
        </div>

        <div class="row">
          <span class="hint">请设定直播门票</span>
          <input type="number" v-model="amount" class="input-amount"> <span class="suffix">¥<span>
        </div>

        <div class="row">
          <span class="hint">请设定直播分类</span>
          <select-cell :options="topicOptions" :selected.sync="topicSelected"></select-cell>
        </div>

        <div class="row">
          <span class="hint">请输入直播标题</span>
          <input type="text" v-model="title" class="input-title">
        </div>

        <div class="row">
          <span class="hint">请设定直播时间</span>
          <div>
            <v-date-picker :date-result.sync="myDate"></v-date-picker>
          </div>
        </div>

        <div class="row">
          <span class="hint">请输入简介来让观众了解您(50字以上即可)</span>
          <div class="intro-area">
            <textarea class="form-field form-content" v-model="speakerIntro"></textarea>
          </div>
        </div>

        <div class="row">
          <span class="hint">请输入直播介绍</span>
          <div class="edit-area">
              <markdown-area class="form-field form-content" :content.sync="content" placeholder="" required></markdown-area>
              <p class="tip">支持 Markdown</p>
          </div>
        </div>

        <div class="row">
          <span class="hint">请输入房间公告(可无)</span>
          <div class="notice-area">
              <markdown-area class="form-field form-content" :content.sync="notice" placeholder=""></markdown-area>
              <p class="tip">支持 Markdown</p>
          </div>
        </div>

        <div class="row" id="upload-container-course">
          <span class="hint">请上传课件(可选，支持后缀格式ppt,pptx,pdf,sketch,key,zip)</span>
          <button class="upload-btn" id="pick-courseware">本地上传</button>
          <div v-if="coursewareUrl">
            <a :href="coursewareUrl">课件地址：{{ coursewareUrl }}</a>
          </div>
        </div>

        <div class="row row-action">
          <button class="btn btn-blue" @click="saveLive">保存</button>
          <button class="btn btn-blue" @click="publishLive">提交审核</button>
        </div>
    </div>

  </div>
</template>

<script type="text/javascript">

import MarkdownArea from "../components/markdown-area.vue"
import UserAvatar from "../components/user-avatar.vue"
import VDatePicker from '../components/date_picker.vue'
import Loading from '../components/loading.vue'
import util from '../common/util'
import api from '../common/api'
import {Toast, SelectCell, Cells} from 'vue-weui'

require('moxie')
require('plupload')
import Qiniu from 'qiniu-js-sdk'

var debug = require('debug')('EditLiveView')

export default {
  name: 'EditLiveView',
  components: {
    'markdown-area': MarkdownArea,
    'user-avatar': UserAvatar,
    'v-date-picker': VDatePicker,
    'loading': Loading,
    SelectCell
  },
  data() {
    return {
      live: {},
      content: '',
      title: '',
      user: {},
      amount: 0,
      myDate: '',
      coverUrl: '',
      coursewareUrl: '',
      previewUrl: '',
      liveId: 0,
      speakerIntro: '',
      needPay: 0,
      shareIcon: 0,
      notice: '',
      topics: [],
      topicSelected: 0,
      bucketUrl: ''
    }
  },
  computed: {
    topicOptions() {
      var options = []
      options.push({text: '无', value: 0})
      for(var i = 0; i < this.topics.length; i++) {
        var topic = this.topics[i]
        options.push({text: topic.name, value: topic.topicId})
      }
      return options
    }
  },
  route: {
    data({to}) {
      var query = this.$route.params
      this.liveId = query.liveId

      util.loading(this)
      Promise.all([
        api.fetchLive(this, this.liveId),
        api.get(this, 'topics')
      ]).then((values) => {
        util.loaded(this)
        var live = values[0]
        this.topics = values[1]
        this.setLive(live)
      }, util.promiseErrorFn(this))
    }
  },
  created() {
  },
  ready() {
    this.initQiniu()
  },
  methods: {
    setLive(live) {
      this.live = live
      this.title = live.subject
      this.amount = live.amount / 100
      this.content = live.detail
      this.myDate = live.planTs
      this.coverUrl = live.coverUrl
      this.coursewareUrl = live.coursewareUrl
      this.previewUrl = live.previewUrl
      this.speakerIntro = live.speakerIntro
      this.needPay = live.needPay
      this.shareIcon = live.shareIcon
      this.notice = live.notice
      if (live.topic) {
        this.topicSelected = live.topic.topicId
      }
    },
    saveLive() {
      var data = {};
      if (this.title) {
        data.subject = this.title
      }
      if (this.amount) {
        data.amount = this.amount * 100
      }
      if (this.myDate) {
        data.planTs = this.myDate
      }
      if (this.speakerIntro) {
        data.speakerIntro = this.speakerIntro
      }
      if (this.content) {
        data.detail = this.content
      }
      if (this.needPay) {
        data.needPay = 1
      } else {
        data.needPay = 0
      }
      if (this.shareIcon) {
        data.shareIcon = 1
      } else {
        data.shareIcon = 0
      }

      if (this.topicSelected == 0) {
        this.updateTopic(this.liveId, 'del')
      } else {
        this.updateTopic(this.liveId, 'add', this.topicSelected)
      }
      data.notice = this.notice
      if (this.coursewareUrl) {
        data.coursewareUrl = this.coursewareUrl
      }
      this.saveLiveData(data)
    },
    saveLiveData(data) {
      util.loading(this)
      api.post(this, 'lives/' + this.live.liveId, data).then((res) => {
        util.loaded(this)
        util.show(this, 'success', '保存成功')
      }, util.promiseErrorFn(this))
    },
    publishLive() {
      util.loading(this)
      api.get(this, 'lives/' + this.live.liveId + '/submitReview').then((res) => {
        util.loaded(this)
        util.show(this, 'success', '提交审核成功')
      }, util.promiseErrorFn(this))
    },
    updateCover(url) {
      this.coverUrl = url
      var data = {
        coverUrl: this.coverUrl
      }
      this.saveLiveData(data)
    },
    updateCoursewareKey(key) {
      this.coursewareUrl = this.bucketUrl + '/' + key
      this.saveLiveData({coursewareKey: key})
    },
    initQiniu() {
      var component = this;
      api.get(this, 'files/uptoken').then((res) => {
        var result = res
        var uptoken = result.uptoken
        var bucketUrl = result.bucketUrl
        this.bucketUrl = bucketUrl
        var key =result.key
        var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4',    //上传模式,依次退化
          browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
          uptoken_url: 'useless',
          uptoken: uptoken,
          domain: bucketUrl,
          flash_swf_url: 'js/plupload/Moxie.swf',
          unique_names: false,
          save_key: false,
          get_new_uptoken: false,           //设置上传文件的时候是否每次都重新获取新的token
          container: 'upload-container',    //上传区域DOM ID，默认是browser_button的父元素，
          max_file_size: '100mb',           //最大文件体积限制
          max_retries: 3,                   //上传失败最大重试次数
          dragdrop: false,                  //开启可拖曳上传
          drop_element: 'upload-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
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
                      // info:
                      // {
                      //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                      //    "key": "gogopher.jpg"
                      //    }
                      var res = JSON.parse(info);
                      var sourceLink = bucketUrl + '/' + res.key;
                      debug('sourceLink: %j', sourceLink);
                      component.updateCover(sourceLink)
              },
              'Error': function(up, err, errTip) {
                      debug('qiniu error %j errTip %j', err, errTip);
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
        })
        var coursewareUploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4',    //上传模式,依次退化
          browse_button: 'pick-courseware',       //上传选择的点选按钮，**必需**
          uptoken_url: 'useless',
          uptoken: uptoken,
          domain: bucketUrl,
          flash_swf_url: 'js/plupload/Moxie.swf',
          unique_names: false,
          save_key: false,
          get_new_uptoken: false,           //设置上传文件的时候是否每次都重新获取新的token
          container: 'upload-container-course',    //上传区域DOM ID，默认是browser_button的父元素，
          max_file_size: '100mb',           //最大文件体积限制
          max_retries: 3,                   //上传失败最大重试次数
          dragdrop: false,                  //开启可拖曳上传
          drop_element: 'upload-container-course',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb',                //分块上传时，每片的体积
          filters: {
            mime_types : [
              {title : "Courseware Files", extensions: "ppt,pptx,pdf,sketch,key,zip"}    //限制文件格式
            ]
          },
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
              component.updateCoursewareKey(res.key)
            },
            'Error': function(up, err, errTip) {
            debug('qiniu error %j errTip %j', err, errTip);
              util.show(component, 'error', errTip)
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
              var ext = '.' + file.name.split('.').pop()
                return util.randomString(6) + ext
            }
          }
        }) // coursewareUploader
      }) // api
    },
    updateTopic(liveId, op, topicId) {
      util.loading(this)
      api.post(this, 'lives/' + liveId + '/topic', {
        op: op,
        topicId: topicId
      }).then((res) => {
        util.loaded(this)
      }, util.promiseErrorFn(this))
     }
  } // methods
}

</script>

<style lang="stylus">

.edit-view
  justify-content center
  .write-container
    background-color #fff
    padding 10px
    border 1px solid rgba(0,0,0,0.15)
    box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    -webkit-box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    .row
      margin 10px 0
      &.need-pay-row
        .hint
          display inline-block
        input
          margin-left 10px
      .hint
        color rgba(40,47,49,0.6)
        display block
        line-height 32px
      .suffix
        color rgba(40,47,49,0.6)
      .upload-btn
        background-color #9B9B9B
        border-radius 3px
        color #fff
      input
        line-height 30px
        border 1px solid rgba(40,47,49,0.3)
        border 1px inset
        text-indent 10px
        &:focus
          border 1px solid #1CB2EF
      .input-url
        width 300px
      .input-amount
        width 80px
      .input-title
        width 300px
    .row-action
        text-align center
        button
          width 150px
    .intro-area
      width 95%
      textarea
        width 100%
        height 60px
        margin-top 5px
        font-size 16px
        border 1px solid rgba(40,47,49,0.3)
        opacity 0.8
        padding 10px
        &:focus
          border 1px solid #1CB2EF
    .edit-area
      width 95%
      textarea
        width 100%
        height 200px
        margin-top 5px
      p.tip
        color rgba(40,47,49,.6)
        font-size 13px
        margin 8px 0px
    .notice-area
        width 95%
        textarea
            width 100%
            height 60px
            margin-top 5px
        p.tip
          color rgba(40,47,49,.6)
          font-size 13px
          margin 8px 0px
    #upload-container
      img
        width 200px
        margin-top 10px
    .status
      border 1px solid #1CB2EF
      border-radius 3px
      padding 3px
      float right

</style>
