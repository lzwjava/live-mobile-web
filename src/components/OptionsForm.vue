<template>

  <div class="options-form" @click="stop($event)">

    <button class="btn btn-blue" v-for="i in options.length" @click="chooseType(i)">{{options[i]}}</button>

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'OptionsForm',
  props: ['options'],
  methods: {
    stop (e) {
      e.stopPropagation()
    },
    chooseType (type) {
      this.$parent.overlay = false
      this.$dispatch('hideOptionsForm', type)
    }
  }
}

</script>


<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.options-form
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
