<template>
  <div class="live-view">
    <div id="the-player">
      <video preload="none" class="player-video" autoplay controls crossorigin></video>
    </div>
  </div>
</template>

<script type="text/javascript">

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
    var playerId = 'the-player'
    var video = document.querySelector('#' + playerId + ' video')
    if(Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource('http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
        video.play();
      });
    }
    plyr.setup('#' + playerId);
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
      })
    }
  }
}

</script>

<style lang="stylus">
.live-view
  .player-video
    width 100%

</style>
