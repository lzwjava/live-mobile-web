<template>
  <div class="subscribe-form" @click.stop>
    <div class="close-btn" @click="close">x</div>

    <h3 class="title">{{ explainWord }}</h3>

    <img v-if="showPic" class="notify" alt="" src="/img/wechat_notify.jpg">

    <h3>请先长按关注公众号</h3>

    <img v-if="ticket" :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket" alt="">
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { get } from '@/common/api'

const props = defineProps({
  type: {
    type: String,
    default: 'live'
  },
  liveId: {
    type: [Number, String],
    default: 0
  }
})

const emit = defineEmits(['close'])

const ticket = ref('')

const showPic = computed(() => props.type === 'live')

const explainWord = computed(() => {
  if (props.type === 'live') {
    return '为了方便微信通知您'
  } else if (props.type === 'share') {
    return '为了给您推送邀请的收益通知'
  }
  return ''
})

const close = () => {
  emit('close')
}

onMounted(() => {
  get('wechat/qrcode', {
    type: props.type,
    liveId: props.liveId
  }).then(data => {
    ticket.value = encodeURIComponent(data.ticket)
  }).catch(() => {
    // handle error
  })
})
</script>

<style lang="stylus">



.subscribe-form
  @extend .base-form
  max-width 300px
  height 400px
  img
    margin-top 5px
    width 180px
  .title
    margin-top 15px
  .notify
    padding 10px
  .close-btn
    float right
    color #000
    margin-right 5px
    line-height 10px


</style>
