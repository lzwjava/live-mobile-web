<template>
  <div class="app-upload-view">
      <div class="weui_cells_title title-top">编辑您的微信小程序</div>
      <div class="weui_cells weui_cells_form">

          <div class="weui-cells__title">请输入小程序名称</div>
          <div class="weui-cells">
              <div class="weui-cell">
                  <div class="weui-cell__bd">
                      <input class="weui-input" v-model="name" type="text">
                  </div>
              </div>
          </div>

          <div class="weui-cells__title">请输入小程序的一句话描述</div>
          <div class="weui-cells">
              <div class="weui-cell">
                  <div class="weui-cell__bd">
                      <input class="weui-input" v-model="shortDesc" type="text">
                  </div>
              </div>
          </div>

      </div>

      <div class="weui_btn_area">
          <button class="btn btn-blue" @click="save">保存</button>

          <button class="btn btn-blue" @click="submit">提交审核</button>
      </div>

  </div>

</template>

<script type="text/javascript">

import util from '../common/util'
import api from '../common/api'

export default {
  name: 'AppUploadView',
  data() {
    return {
      appId: 0,
      name : '',
      shortDesc: ''
    }
  },
  route: {
    data({to}) {
      var params = this.$route.params
      this.appId = params.appId
      this.fetchApp()
    }
  },
  methods: {
    fetchApp() {
      api.get(this, 'apps/' + this.appId)
       .then((data) => {
         this.setApp(data)
       }, util.promiseErrorFn(this))
    },
    setApp(app) {
      this.name = app.name
      this.shortDesc = app.shortDesc
    },
    submit() {
    },
    save() {
      var data = {}
      if (this.name) {
        data.name = this.name
      }
      if (this.shortDesc) {
        data.shortDesc = this.shortDesc
      }
      api.post(this, 'apps/' + this.appId, data)
       .then((res) => {
         util.show(this, 'success', '保存成功')
       }, util.promiseErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

.app-upload-view
  .title-top
    text-align center
    font-size 20px
    color #00bdef

</style>
