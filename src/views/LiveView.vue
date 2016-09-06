<template>
  <div class="">
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

</style>
