<template>
  <div class="input-text-form" @click="stop">
    <div class="title">
      {{title}}
    </div>
    <input v-model="text" autofocus="true"></input>
    <div class="action-btns">
      <button class="btn btn-cancel" type="button" @click="cancel">取消</button>
      <button class="btn btn-confirm" type="button" @click="confirm">确定</button>
    </div>
  </div>
</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '@/common/util'
import api from '@/common/api'

const debug = debugFn('InputTextForm')

export default {
  name: 'InputTextForm',
  props: [
    'title',
    'text'
  ],
  methods: {
    stop (e) {
      e.stopPropagation()
    },
    cancel () {
      this.$parent.overlay = false
    },
    confirm () {
      this.$parent.overlay = false
      this.$dispatch('inputTextFormConfirm', this.text)
    }
  }
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.input-text-form
  @extend .absolute-center
  max-width 300px
  height 150px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px
  .title
    color #404040
    font-size 18px
    line-height 20px
  input
    color #333
    background #f6f6f6
    line-height 20px
    height 50px
    border-radius 3px
    width 100%
    padding 0 10px
    font-size 16px
    margin-top 20px
  .action-btns
    width 100%
    display flex
    margin-top 20px
    .btn
      height 45px
      font-size 16px
      margin 0 10px
    .btn-cancel
      flex 1
      color #657084
      background #fff
      border solid 1px #657084
    .btn-confirm
      flex 1
      color #fff
      background-color #00BDEF



</style>
