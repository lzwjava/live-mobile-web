<template>
  <div class="control-form" @click.stop>
    <div class="close-btn" @click="close()">X</div>

    <div class="live-config-area" v-if="liveConfig">
      <h2>直播控制</h2>
      <br>
      <button @click="showLiveConfigUrl">直播配置</button>
      <br>
      <button class="begin-btn" @click="beginLive">开始直播</button>
      <br>
      <button class="finish-btn" @click="finishLive">结束直播</button>
      <br>
    </div>

    <div class="live-config-area live-url-area" v-if="liveConfigUrl">
      直播地址:
      <br>
      <p class="live-config-url">{{ pushPrefix }}</p>
      <br>
      海外直播地址:
      <br>
      <p class="live-config-url">{{ foreignPushPrefix }}</p>
      <br>
      直播密钥:
      <br>
      <p class="live-config-url">{{ pushKey }}</p>
      <br>
      <button class="live-config-insider-btn-close" @click="showLiveConfigUrl">返回</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { get } from '@/common/api'
import { show } from '@/common/util'

const props = defineProps({
  live: {
    type: Object,
    default: () => ({})
  },
  liveId: {
    type: [Number, String],
    default: 0
  }
})

const emit = defineEmits(['close'])

const liveConfig = ref(true)
const liveConfigUrl = ref(false)

const pushPrefix = computed(() => urlPrefix(props.live.pushUrl))
const foreignPushPrefix = computed(() => urlPrefix(props.live.foreignPushUrl))
const pushKey = computed(() => {
  if (!props.live.pushUrl) return ''
  const regex = /(rtmp:\/\/.*)\/(.*)/g
  const match = regex.exec(props.live.pushUrl)
  return match ? match[2] : ''
})

const close = () => {
  emit('close')
}

const beginLive = () => {
  if (confirm('开始之后，观众可看到直播画面。是否确定继续开始直播？')) {
    get(`lives/${props.liveId}/begin`).then(() => {
      show(null, 'success', '成功开启直播')
    }).catch((error) => {
      show(null, 'error', error)
    })
  }
}

const finishLive = () => {
  if (confirm('请OBS结束推流之后，再点击结束直播，结束后观众将看到回放，是否确认？')) {
    get(`lives/${props.liveId}/finish`).then(() => {
      show(null, 'success', '成功结束直播')
    }).catch((error) => {
      show(null, 'error', error)
    })
  }
}

const showLiveConfigUrl = () => {
  liveConfig.value = !liveConfig.value
  liveConfigUrl.value = !liveConfigUrl.value
}

const urlPrefix = (rtmpUrl) => {
  if (!rtmpUrl) return ''
  const regex = /(rtmp:\/\/.*)\/(.*)/g
  const match = regex.exec(rtmpUrl)
  return match ? match[1] : ''
}
</script>

<style lang="stylus">



.control-form
	@extend .absolute-center
	max-width 300px
	height 400px
	text-align center
	background #fff
	overflow hidden
	border-radius 15px
	.close-btn
		float right
		font-size 20px
		margin-right 12px
		margin-top 12px
		line-height 10px
	.live-config-area
		padding-top 30px
		button
			width 80%
			font-size 16px
			border-radius 10px
			height 40px
			margin-top 30px
			color white
			background-color #00bdef
		.finish-btn
			background-color #ff4747
	.live-url-area
		padding-top 50px
		word-break break-all


</style>
