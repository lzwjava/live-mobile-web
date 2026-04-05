<template>
  <Teleport to="body">
    <div id="message" aria-live="assertive">
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        :class="['message', `message-${msg.type}`]"
        v-text="msg.text"
      ></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const messages = ref([])
let clock = null

const unique = (item, list) => {
  return !list.some(data => {
    return JSON.stringify(data) === JSON.stringify(item)
  })
}

const flush = () => {
  messages.value = []
}

const clear = (index) => {
  clearTimeout(clock)
  messages.value.splice(index, 1)
  clock = setTimeout(flush, 4000)
}

const show = (type, text, timeout) => {
  const msg = { type, text }
  if (!unique(msg, messages.value)) return

  if (!timeout) {
    if (type === 'error') {
      timeout = 5000
    } else {
      timeout = 3000
    }
  }
  messages.value.push(msg)
  const index = messages.value.length - 1
  setTimeout(() => {
    clear(index)
  }, timeout)
}

// Listen for show-tip-msg event from parent
const instance = getCurrentInstance()
if (instance?.parent?.proxy) {
  // Event handling will be done through provide/inject pattern
}

// Expose show method
defineExpose({ show })
</script>

<style lang="stylus">


#message
  position fixed
  top 0
  left 0
  width 100%
  text-align center
  z-index 99999

.message
  font-size 1rem
  line-height 1.8
  padding 10px 20px
  box-sizing border-box
  border-bottom 1px solid #efefef
  background-color rgba(255, 255, 255, 0.9)
  color #565656
  word-wrap break-word

.message-success
  background-color rgba(66, 185, 131, 0.9)
  border-color rgb(66, 185, 131)
  color white

.message-error
  background-color rgba(255, 68, 68, 0.9)
  border-color rgb(255, 68, 68)
  color white

.message-warn
  background-color rgba(255, 220, 0, 0.9)
  border-color rgb(255, 220, 0)


</style>
