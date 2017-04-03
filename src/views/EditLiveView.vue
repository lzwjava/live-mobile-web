<template>
  <div class="edit-view">

    <div class="write-container" >

        <cells id="upload-container">

          <cell class="cover-cell"  id="pickfiles">
            <span  slot="header">设置头图(600*348)</span>
            <img slot="body" v-if="coverUrl" class="cover" :src="coverUrl"/>
            <span slot="footer">></span>
          </cell>

        </cells>

        <cells type="form">

          <switch-cell name="switch" label="是否需要付费" :on.sync="needPay"></switch-cell>

          <input-cell type="number" label="直播门票¥" placeholder="请输入门票" :value.sync="amount"></input-cell>

          <switch-cell name="switch" label="分享是否显示封面(默认头像)" :on.sync="shareIcon"></switch-cell>

          <cell>
            <span slot="header">请设定直播分类</span>
          </cell>

          <select-cell :options="topicOptions" :selected.sync="topicSelected"></select-cell>

        </cells>

        <cells type="form">

           <input-cell type="text" label="直播标题" placeholder="请输入标题" :value.sync="title"></input-cell>

        </cells>

        <cell>

        </cell>

        <div class="row">
          <span class="hint">请设定直播时间</span>
        </div>

        <cells>

          <cell>
            <span slot="header">主播介绍</span>
            <span slot="footer">></span>
          </cell>

          <cell>
            <span slot="header">直播详情</span>
            <span slot="footer">></span>
          </cell>

          <cell>
            <span slot="header">房间公告(可选)</span>
            <span slot="footer">></span>
          </cell>

        </cells>


        <cells id="upload-container-course">

          <cell id="pick-courseware">
            <span slot="header">上传课件(可选)</span>
            <span slot="footer">></span>
          </cell>

          <cell v-if="coursewareUrl">
            <a slot="body" :href="coursewareUrl" target="_blank">{{coursewareUrl}}</a>
          </cell>

        </cells>

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
import {Toast, SelectCell, Cells, SwitchCell, InputCell, CellBody, Cell,CellHeader, CellFooter} from 'vue-weui'
import moment from 'moment-timezone'
moment.locale('zh-cn')

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
    SelectCell,
    SwitchCell,
    InputCell,
    Cells,
    Cell,
    CellBody,
    CellFooter,
    CellHeader
  },
  data() {
    return {
      live: {},
      content: '',
      title: '',
      user: {},
      amount: 0,
      myDate: {},
      coverUrl: '',
      coursewareUrl: '',
      previewUrl: '',
      liveId: 0,
      speakerIntro: '',
      needPay: false,
      shareIcon: false,
      notice: '',
      topics: [],
      topicSelected: 0,
      bucketUrl: '',
      dateValue: '',
      datetimeValue: '',
      uptoken: {}
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
        api.get(this, 'topics'),
        api.get(this, 'files/uptoken')
      ]).then((values) => {
        util.loaded(this)
        var live = values[0]
        this.topics = values[1]
        this.uptoken = values[2]
        this.setLive(live)
        this.initQiniu(this.uptoken)
      }, util.promiseErrorFn(this))
    }
  },
  created() {
  },
  ready() {
  },
  methods: {
    setLive(live) {
      this.live = live
      this.title = live.subject
      this.amount = live.amount / 100
      this.content = live.detail
      this.myDate = new Date(live.planTs)
      this.coverUrl = live.coverUrl
      this.coursewareUrl = live.coursewareUrl
      this.previewUrl = live.previewUrl
      this.speakerIntro = live.speakerIntro
      if (live.needPay) {
        this.needPay = true
      } else {
        this.needPay = false
      }
      if (live.shareIcon) {
        this.shareIcon = true
      } else {
        this.shareIcon = false
      }
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
        data.planTs = moment(this.myDate).format('YYYY-MM-DD HH:mm')
      }
      debug('type myDate:%j', typeof this.myDate)
      debug('myDate:%j', data.planTs)
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
    initQiniu(uptokenData) {
      var uptoken = uptokenData.uptoken
      var bucketUrl = uptokenData.bucketUrl
      this.bucketUrl = bucketUrl
      var key = uptokenData.key
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
        max_file_size: '800kb',           //最大文件体积限制
        max_retries: 3,                   //上传失败最大重试次数
        dragdrop: false,                  //开启可拖曳上传
        drop_element: 'upload-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        filters: {
          mime_types : [
            {title : "Image files", extensions: "jpg,png,jpeg"}
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
                    var res = JSON.parse(info);
                    var sourceLink = bucketUrl + '/' + res.key;
                    this.updateCover(sourceLink)
            },
            'Error': (up, err, errTip) => {
                    util.show(this, 'error', errTip)
            },
            'UploadComplete': function() {
              util.loaded(this)
            },
            'Key': function(up, file) {
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
        max_file_size: '10mb',           //最大文件体积限制
        max_retries: 3,                   //上传失败最大重试次数
        dragdrop: false,                  //开启可拖曳上传
        drop_element: 'upload-container-course',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        filters: {
          mime_types : [
            {title : "Courseware Files", extensions: "ppt,pptx,pdf,key,zip"}    //限制文件格式
          ]
        },
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
            var res = JSON.parse(info);
            this.updateCoursewareKey(res.key)
          },
          'Error': (up, err, errTip) => {
            util.show(this, 'error', errTip)
          },
          'UploadComplete': function() {
            util.loaded(this)
          },
          'Key': function(up, file) {
            var ext = '.' + file.name.split('.').pop()
            return util.randomString(6) + ext
          }
        }
      }) // coursewareUploader
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
  .write-container
    background-color #fff
    padding 5px
    border 1px solid rgba(0,0,0,0.15)
    box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    -webkit-box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    .cover-cell
      .cover
        width 50px
        float right
        margin-bottom 10px
        margin-right 10px
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
    .intro-area
      textarea
        margin-top 5px
        font-size 16px
        border 1px solid rgba(40,47,49,0.3)
        opacity 0.8
        padding 10px
        &:focus
          border 1px solid #1CB2EF
    .edit-area
      textarea
        margin-top 5px
      p.tip
        color rgba(40,47,49,.6)
        font-size 13px
        margin 8px 0px
    .notice-area
        textarea
            margin-top 5px
        p.tip
          color rgba(40,47,49,.6)
          font-size 13px
          margin 8px 0px
    #upload-container
      img
        margin-top 10px
    .status
      border 1px solid #1CB2EF
      border-radius 3px
      padding 3px
      float right

</style>
