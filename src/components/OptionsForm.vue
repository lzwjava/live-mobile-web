<template>
  <div class="options-form" @click.stop>
    <button 
      v-for="(option, index) in options" 
      :key="index" 
      class="btn btn-blue"
      @click="chooseType(index)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['hide'])

const chooseType = (type) => {
  emit('hide', type)
}
</script>

<style lang="stylus">



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
