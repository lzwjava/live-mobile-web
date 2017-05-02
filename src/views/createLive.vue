<template>
  <div class="edit-view">

    <div class="write-container" >

        <cells id="upload-container">

          <cell class="cover-cell"  id="pickfiles">
            <span class="item-title" slot="header">设置头图(600*348)</span>
            <img slot="body" v-if="coverUrl" class="cover" :src="coverUrl"/>
            <span slot="footer">></span>
          </cell>

        </cells>

        <cells type="form">

          <switch-cell name="switch" label="是否需要付费" :on.sync="needPay"></switch-cell>

          <input-cell type="number" label="直播门票 ¥" placeholder="请输入门票" :value.sync="amountValue"></input-cell>

          <input-cell type="datetime-local" label="时间" :value.sync="planTsValue"></input-cell>

        </cells>

        <cells>
          <switch-cell name="switch" label="分享是否显示封面(默认头像)" :on.sync="shareIcon"></switch-cell>

          <cell>
            <span class="item-title" slot="header">设定直播分类</span>
          </cell>

          <select-cell :options="topicOptions" :selected.sync="topicSelected"></select-cell>
        </cells>

        <cells>

          <input-cell type="text" label="直播标题" placeholder="请输入标题" :value.sync="title"></input-cell>

          <cell @click="goSpeakerIntro">
            <span class="item-title" slot="header">主播介绍</span>
            <span slot="footer">{{titleWord(speakerIntro)}}></span>
          </cell>

          <cell @click="goDetail">
            <span class="item-title" slot="header">直播详情</span>
            <span slot="footer">{{titleWord(detail)}}></span>
          </cell>

          <cell @click="goNotice">
            <span class="item-title" slot="header">房间公告(可选)</span>
            <span slot="footer">{{titleWord(notice)}}></span>
          </cell>

        </cells>


        <cells id="upload-container-course">

          <cell id="pick-courseware">
            <span class="item-title" slot="header">上传课件(可选)</span>
            <span slot="footer">></span>
          </cell>

          <cell v-if="coursewareUrl">
            <a slot="body" :href="coursewareUrl" target="_blank">{{coursewareUrl}}</a>
          </cell>

        </cells>

        <cells class="row-action">
          <button class="btn btn-gray" @click="saveLive">保存</button>
          <button class="btn btn-blue" @click="publishLive">提交审核</button>
        </cells>

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

var debug = require('debug')('createLiveView')

export default {
  name: 'createLiveView',
  components: {
  },
  data() {
    return {

    }
  },
  computed: {

  },
  route: {
    
  },
  created() {
  },
  ready() {
  },
  methods: {
  }, // methods
  events: {

  }
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
    .weui_cell_switch
      .weui_cell_primary
        color #555555
    .weui_cell_hd
      .weui_label
        color #555555
    .item-title
      color #555555
    .cover-cell
      .cover
        width 50px
        float right
        margin-right 10px
    .row-action
      display flex
      margin-bottom 20px
      button
        flex 1
        margin 0 10px

</style>
