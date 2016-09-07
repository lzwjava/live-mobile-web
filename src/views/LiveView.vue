<template>
  <div class="live-view">
    <div id="the-player">
      <video id="player1" width="100%" height="350" controls="controls">
        <source type="application/x-mpegURL" :src="live.hlsUrl" />
      </video>
    </div>
  </div>
</template>

<script type="text/javascript">

require('../../node_modules/mediaelement/build/mediaelement-and-player.js')
require('../../node_modules/mediaelement/build/mediaelementplayer.min.css')
var util = require('../common/util')
var http = require('../common/http')
var debug = require('debug')('LiveView')

export default {
  name: 'LiveView',
  components: {
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
      var comp = this
      http.fetchLive(comp, this.liveId, function (live) {
        comp.live = live
        comp.playHls()
      })
    },
    playHls: function() {
      $('video').mediaelementplayer({
      	success: function(media, node, player) {
          debug('success')
      		$('#' + node.id + '-mode').html('mode: ' + media.pluginType);
      	},
        error: function(player) {
          debug('error')
          debug(player)
        }
      });
    }
  }
}

</script>

<style lang="stylus">

.live-view
  .player-video
    #player1
      width 640px
      height 360px

</style>
