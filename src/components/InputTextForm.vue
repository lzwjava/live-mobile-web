<template>
  <div class="input-text-form" @click.stop>
    <div class="title">
      {{ title }}
    </div>

    <input v-model="textValue" autofocus="true" />

    <div class="action-btns">
      <button class="btn btn-cancel" type="button" @click="cancel">取消</button>
      <button class="btn btn-confirm" type="button" @click="confirm">确定</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'close'])

const textValue = ref(props.text)

const cancel = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm', textValue.value)
  emit('close')
}
</script>

<style lang="stylus">



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
