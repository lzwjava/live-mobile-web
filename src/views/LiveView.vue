<template>
  <div class="live-view">
    <loading>
      <div id="the-player">
        <video id="player1" width="100%" height="350" controls="controls">
          <source type="application/x-mpegURL" :src="live.hlsUrl" />
        </video>
      </div>
    </loading>
  </div>
</template>

<script type="text/javascript">

require('../../node_modules/mediaelement/build/mediaelement-and-player.js')
require('../../node_modules/mediaelement/build/mediaelementplayer.min.css')

import util from '../common/util'
import http from '../common/http'
import Loading from '../components/loading.vue'

var debug = require('debug')('LiveView')

export default {
  name: 'LiveView',
  components: {
    'loading': Loading
  },
  data() {
    return {
      liveId: 0,
      live: {}
    }
  },
  computed: {
  },
  created() {
  },
  ready() {
  },
  route: {
    data ({ to }) {
      this.liveId = to.params.liveId
      if (!this.liveId) {
        util.show(this, 'error', '缺少参数')
        return
      }
      this.fetchLive()
    }
  },
  methods: {
    fetchLive: function () {
      this.$broadcast('loading')
      http.fetchLive(this, this.liveId)
       .then((live) => {
         this.live = live
         this.$broadcast('loaded')
         live.canJoin = true
         live.hlsUrl = 'http://cheer.quzhiboapp.com/live/GAXRrVWD_ff.m3u8'
         if (!live.canJoin) {
           util.show(this, 'error', '请先登录或报名直播')
           return
         }
         this.playHls()
       })
       .catch(util.promiseErrorFn(this))
    },
    playHls: function() {
      this.$broadcast('loading')
      var comp = this
      $('video').mediaelementplayer({
      	success: function(media, node, player) {
          comp.$broadcast('loaded')
      		$('#' + node.id + '-mode').html('mode: ' + media.pluginType);
      	},
        error: function(player) {
          util.show(comp, 'error', '加载直播出错了')
        }
      });
    }
  }
}

</script>

<style lang="stylus">

</style>
