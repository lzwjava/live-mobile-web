<template>

  <div class="pay-form" @click="stop($event)">

    <button class="btn btn-blue" @click="chooseType(1)">直接报名</button>

    <button class="btn btn-blue" @click="chooseType(2)">分享朋友圈后报名(感恩1元)</button>

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'PayForm',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    stop (e){
      e.stopPropagation()
    },
    chooseType(type) {
      this.$parent.overlay = false;
      this.$dispatch('hidePayForm', type)
    }
  }
}

</script>


<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.pay-form
  @extend .absolute-center
  width 280px
  height 120px
  background #fff
  border-radius 20px
  text-align center
  padding 20px 10px
  button
    width 80%
    font-size 16px
    border-radius 10px
    height 50px
    margin-bottom 20px

</style>
