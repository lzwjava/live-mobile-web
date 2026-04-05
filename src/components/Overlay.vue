<template>
  <Teleport to="body">
    <div class="overlay" @click.self="close" v-if="overlay">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  overlay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style lang="stylus">

.overlay
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 9998
  background-color rgba(0,0,0,.5)

.overlay-leave-active {
  transition: all .5s ease;
  overflow: hidden;
}

.overlay-enter-from,.overlay-leave-to
  opacity 0;

</style>
