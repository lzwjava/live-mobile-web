<template>

  <div class="app-mylist-view">
    <button class="btn btn-blue" @click="create">
      分享小程序
    </button>

    <ul>
      <li v-for="app in apps" @click="goEdit(app.appId)">
        <app-item :app="app"></app-item>
      </li>
    </ul>

  </div>

</template>

<script type="text/javascript">

import api from '../common/api'
import AppItem from '../components/AppItem.vue'
import util from '../common/util'

export default {
  name: 'AppMyListView',
  components: {
    'app-item': AppItem
  },
  data() {
    return {
      apps: []
    }
  },
  created() {
    api.get(this, 'apps/myList')
     .then((data) => {
       this.apps = data
     }, util.promiseErrorFn(this))
  },
  methods: {
    create() {
      api.post(this, 'apps')
       .then((data) => {
         var appId = data.appId
         this.$router.go('/appUpload/' + appId)
       }, util.promiseErrorFn(this))
    },
    goEdit(appId) {
      this.$router.go('/appUpload/' + appId)
    }
  }
}

</script>
