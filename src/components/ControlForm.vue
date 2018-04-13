<template>

	<div class="control-form" @click="stop($event)">

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
			<p class="live-config-url">{{pushPrefix}}</p>
			<br>
			海外直播地址:
			<br>
			<p class="live-config-url">{{foreignPushPrefix}}</p>
			<br>
			直播密钥:
			<br>
			<p class="live-config-url">{{pushKey}}</p>
			<br>
			<button class="live-config-insider-btn-close" @click="showLiveConfigUrl">返回</button>
		</div>

	</div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import util from '../common/util'
import api from '../common/api'

const debug = debugFn('ControlForm')

export default {
	name: 'ControlForm',
	props: ['live', 'liveId'],
	data () {
		return {
			liveConfig: true,
			liveConfigUrl: false
		}
	},
	computed: {
		pushPrefix () {
			return this.urlPrefix(this.live.pushUrl)
		},
		foreignPushPrefix () {
			return this.urlPrefix(this.live.foreignPushUrl)
		},
		pushKey () {
			if (!this.live.pushUrl) return ''
			const regex = /(rtmp:\/\/.*)\/(.*)/g
			const match = regex.exec(this.live.pushUrl)
			return match[2]
		}
	},
	methods: {
		stop (e) {
			e.stopPropagation()
		},
		close () {
			this.$parent.overlay = false
		},
		beginLive () {
			if (confirm('开始之后，观众可看到直播画面。是否确定继续开始直播？')) {
				util.loading(this)
				api.get(this, `lives/${this.liveId}/begin`)
				 .then(data => {
					 util.loaded(this)					 
					 util.show(this, 'success', '成功开启直播')
				 }, util.promiseErrorFn(this))
			}
		},
		finishLive () {
			if (confirm('请OBS结束推流之后，再点击结束直播，结束后观众将看到回放，是否确认？')) {
				util.loading(this)
				api.get(this, `lives/${this.liveId}/finish`)
				 .then(data => {
					 util.loaded(this)
					 util.show(this, 'success', '成功结束直播')
				 }, util.promiseErrorFn(this))
			}
		},
		showLiveConfigUrl () {
			this.liveConfig = !this.liveConfig
			this.liveConfigUrl = !this.liveConfigUrl
		},
		urlPrefix (rtmpUrl) {
			if (!rtmpUrl) return ''
			const regex = /(rtmp:\/\/.*)\/(.*)/g
			const match = regex.exec(rtmpUrl)
			return match[1]
		}
	}
}

</script>

<style media="screen" lang="stylus">

@import '../stylus/base.styl'

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
