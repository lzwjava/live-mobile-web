<template>
  <div id="message" aria-live="assertive">
    <transition name="fade">
      <div :class="`message message-` + msg.type" v-for="msg in messages" v-text="msg.text"></div>
    </transition>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      clock: new Date().getFullYear(),
      messages: []
    }
  },
  methods: {
    unique (item, list) {
      return !list.some(data => {
        return JSON.stringify(data) === JSON.stringify(item)
      })
    },
    flush () {
      this.messages = []
    },
    clear (index) {
      clearTimeout(this.clock)
      this.messages.splice(index, 1)
      this.clock = setTimeout(this.flush.bind(this), 4000)
    },
    show (type, text, timeout) {
      // 全局 error、warn、success 提示
      let msg = {type, text}
      if (!this.unique(msg, this.messages)) return

      if (!timeout) {
        if (type === 'error') {
          timeout = 5000
        } else {
          timeout = 3000
        }
      }
      this.messages.push(msg)
      const index = this.messages.length - 1
      setTimeout(function () {
        this.clear(index)
      }.bind(this), timeout)
    }
  },
  events: {
    'show-tip-msg': function (type, msg) {
      this.show(type, msg)
    }
  }
}

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
