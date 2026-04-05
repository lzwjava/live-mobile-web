<template>
  <div id="wrapper">
    <router-view class="view" />
    
    <div v-if="loading" class="weui_loading_toast">
      <div class="weui_toast">
        <div class="weui_loading">
          <div class="weui_loading_leaf weui_loading_leaf_0"></div>
          <div class="weui_loading_leaf weui_loading_leaf_1"></div>
          <div class="weui_loading_leaf weui_loading_leaf_2"></div>
          <div class="weui_loading_leaf weui_loading_leaf_3"></div>
          <div class="weui_loading_leaf weui_loading_leaf_4"></div>
          <div class="weui_loading_leaf weui_loading_leaf_5"></div>
          <div class="weui_loading_leaf weui_loading_leaf_6"></div>
          <div class="weui_loading_leaf weui_loading_leaf_7"></div>
          <div class="weui_loading_leaf weui_loading_leaf_8"></div>
          <div class="weui_loading_leaf weui_loading_leaf_9"></div>
          <div class="weui_loading_leaf weui_loading_leaf_10"></div>
          <div class="weui_loading_leaf weui_loading_leaf_11"></div>
        </div>
        <p class="weui_toast_content">加载中</p>
      </div>
    </div>

    <div v-if="toastShow" class="weui_toast weui_toast_text">
      <p class="weui_toast_content">{{ toastText }}</p>
    </div>

    <Overlay v-if="overlayStatus" :overlay="overlayStatus" @close="hideForm">
      <component :is="currentView" :options="options" :live-id="liveId" :live="live" :qrcode-url="qrcodeUrl" @hide="hideForm" />
    </Overlay>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Overlay from './components/Overlay.vue'
import LoginOptionsForm from './components/LoginOptionsForm.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import WeiboForm from './components/WeiboForm.vue'
import Tip from './components/tip.vue'

const loading = ref(false)
const toastShow = ref(false)
const toastText = ref('')
const overlayStatus = ref(false)
const currentView = ref('login-options-form')
const liveId = ref(0)
const live = ref({})
const options = ref([])
const qrcodeUrl = ref('')

// Provide global show function
const showMsg = (type, message) => {
  toastText.value = message
  toastShow.value = true
  setTimeout(() => {
    toastShow.value = false
  }, 2000)
}

// Provide global loading function
const setLoading = (isLoading) => {
  loading.value = isLoading
}

// Provide toast function
const toast = (text, timeout = 2000, callback) => {
  toastText.value = text
  toastShow.value = true
  setTimeout(() => {
    toastShow.value = false
    callback && callback()
  }, timeout)
}

// Provide loginOrRegister
const loginOrRegister = (lid = 0) => {
  window.localStorage.setItem('liveId', lid)
  window.localStorage.setItem('type', 'live')
  liveId.value = lid
  options.value = ['登录', '注册']
  currentView.value = 'login-options-form'
  overlayStatus.value = true
}

// Hide form after login success
const hideForm = () => {
  overlayStatus.value = false
}

// Update current user broadcast
const updateCurUser = () => {
  // This will be caught by child components
}

provide('showMsg', showMsg)
provide('loading', setLoading)
provide('toast', toast)
provide('loginOrRegister', loginOrRegister)
provide('updateCurUser', updateCurUser)

// Event handling
const handleShowMsg = (type, message) => {
  showMsg(type, message)
}

const handleLoading = (isLoading) => {
  loading.value = isLoading
}

const handleToast = (text, timeout, callback) => {
  toast(text, timeout, callback)
}

const handleLoginOrRegister = (lid) => {
  loginOrRegister(lid)
}

const handleHideLoginOptionsForm = (type) => {
  if (currentView.value === 'login-options-form') {
    if (type === 0) {
      setTimeout(() => {
        currentView.value = 'login-form'
        overlayStatus.value = true
      }, 600)
    } else if (type === 1) {
      setTimeout(() => {
        currentView.value = 'register-form'
        overlayStatus.value = true
      }, 600)
    }
  }
}

const handleUpdateCurUser = () => {
  // Broadcast to children
}

const handleSaveLive = (type, content) => {
  // Broadcast to children
}

const handleHideForm = () => {
  hideForm()
}

// Expose event handlers for children to use via $dispatch equivalent
defineExpose({
  $dispatch: (event, ...args) => {
    switch (event) {
      case 'show-msg': handleShowMsg(...args); break
      case 'loading': handleLoading(...args); break
      case 'toast': handleToast(...args); break
      case 'loginOrRegister': handleLoginOrRegister(...args); break
      case 'hideLoginOptionsForm': handleHideLoginOptionsForm(...args); break
      case 'updateCurUser': handleUpdateCurUser(); break
      case 'saveLive': handleSaveLive(...args); break
      case 'hideForm': handleHideForm(); break
    }
  }
})
</script>

<style lang="stylus">
@import './stylus/variables.styl'
@import './stylus/base.styl'

#wrapper
  position relative
  width 100%
  min-height 100%
  background-color #e7e7e7

.view
  position absolute
  width 100%
  min-height 100%
  transition opacity .2s ease
  box-sizing border-box

.weui_loading_toast
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  z-index 9999

.weui_toast
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  z-index 9999

.weui_toast_text
  min-width 120px

.weui_toast_content
  margin 0
  text-align center

.weui_loading
  position relative
  width 36px
  height 36px

.weui_loading_leaf
  position absolute
  top 50%
  left 50%
  width 8px
  height 18px
  margin-left -4px
  margin-top -9px
  background #fff
  border-radius 4px
  animation loading-fade 1s linear infinite

@keyframes loading-fade
  0%
    opacity 1
  100%
    opacity 0
</style>
