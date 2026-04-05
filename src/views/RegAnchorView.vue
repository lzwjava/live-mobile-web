<template>
  <div class="reganchor-view">
    <ListNav :mode="0" title="申请主播" />
    <div class="content">
      <div class="form-group">
        <label>真实姓名</label>
        <input v-model="form.realname" placeholder="请输入真实姓名" />
      </div>
      <div class="form-group">
        <label>手机号</label>
        <input v-model="form.phone" placeholder="请输入手机号" />
      </div>
      <div class="form-group">
        <label>直播简介</label>
        <textarea v-model="form.intro" placeholder="请输入直播简介"></textarea>
      </div>
      <button class="btn btn-blue" @click="submitApplication">提交申请</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListNav from '@/components/ListNav.vue'
import { post } from '@/common/api'

const form = ref({ realname: '', phone: '', intro: '' })

const submitApplication = () => {
  post('anchors/apply', form.value).then(() => {
    alert('申请已提交')
  }).catch(() => {})
}
</script>

<style lang="stylus">

.reg-anchor-view
  padding 10px 20px
  min-height 100%
  background-color #fff
  .subtitle
    font-size 12px
    text-align center
    color rgb(112, 112, 112)
  .weui_cells_form
    .bind-phone-tip
      margin 20px 0
      font-size 16px
      i
        vertical-align text-top
        font-size 20px
  .title-top
    text-align center
    font-size 20px
    color #00bdef
  .social-textarea
    word-wrap break-word
    overflow-y visible
  .weui_cells
    .weui-cells__title
      color #000
  .weui_btn_area
    button
      width 100%
  .weui-footer
    margin-top 40px
    margin-bottom 40px

</style>
