<template>

  <div class="edit-detail-view">

    <div class="edit-title">
      {{title}}
    </div>

    <markdown-area :content.sync="content" :support-markdown="supportMarkdown"></markdown-area>

    <div class="action-btns">

      <button class="btn btn-gray" @click="cancel">取消</button>

      <button class="btn btn-blue" @click="confirm">确定</button>
    </div>

  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'
import MarkdownArea from '../components/markdown-area.vue'

const debug = debugFn('EditDetailView')

export default {
  name: 'EditDetailView',
  components: {
    'markdown-area': MarkdownArea
  },
  data () {
    return {
      liveId: 0,
      type: 0,
      live: {},
      content: ''
    }
  },
  computed: {
    supportMarkdown () {
      if (this.type === 0) {
        return false
      } else {
        return true
      }
    },
    title () {
      if (this.type === 0) {
        return '主播介绍'
      } else if (this.type === 1) {
        return '直播详情'
      } else if (this.type === 2) {
        return '房间公告'
      }
      return ''
    }
  },
  route: {
    data ({ to }) {
      const liveId = to.params.liveId
      this.liveId = liveId
      this.type = Number(to.params.type)
      debug('type:%j', this.type)
      util.loading(this)
      api.fetchLive(this, this.liveId)
       .then(data => {
         util.loaded(this)
         this.live = data
          if (this.type === 0) {
            this.content = this.live.speakerIntro
          } else if (this.type === 1) {
            this.content = this.live.detail
          } else if (this.type === 2)  {
            this.content = this.live.notice
          }
       }, util.promiseErrorFn(this))
    }
  },
  methods: {
    cancel () {
      window.history.back()
    },
    confirm () {
      let updateField
      if (this.type === 0) {
        updateField = 'speakerIntro'
      } else if (this.type === 1) {
        updateField = 'detail'
      } else if (this.type === 2) {
        updateField = 'notice'
      }
      let data = {}
      data[updateField] = this.content
      api.saveLiveData(this, this.live.liveId, data).then(() => {
        this.$dispatch('saveLive', this.type, this.content)
        window.history.back()
      })
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import "../stylus/base.styl"

.edit-detail-view
  padding 10px
  .edit-title
    margin-top 10px
    font-size 18px
    text-align center
  .markdown-area
    margin-top 10px
  .action-btns
    display flex
    button
      flex 1
      margin 0 10px

</style>
