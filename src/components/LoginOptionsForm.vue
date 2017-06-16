<template>

  <div class="login-options-form" @click="stop($event)">

    <button class="btn btn-blue" v-for="i in options.length" @click="chooseType(i)">{{options[i]}}</button>

  </div>

</template>

<script type="text/javascript">

export default {
  name: 'OptionsForm',
  props: ['options'],
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
      this.$parent.overlay = false
      this.$dispatch('hideLoginOptionsForm', type)
    }
  }
}

</script>


<style media="screen" lang="stylus">

@import '../stylus/base.styl'

.login-options-form
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
