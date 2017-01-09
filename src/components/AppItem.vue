<template>
  <div class="app-item">

    <div class="icon-app">

      <img class="icon-app-img" :src="{{app.iconUrl}}">

    </div>

    <div class="app-content">
      <h3>{{app.name}}</h3>

      <span class="appinfo">{{app.shortDesc}}</span>

      <a class="btn-green">打开</a>

    </div>

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'AppItem',
  props: ['app'],
  data() {
    return {
    }
  },
  methods: {
  }
}

</script>

<style media="screen" lang="stylus">

.app-item
  clear both
  height 60px

</style>
