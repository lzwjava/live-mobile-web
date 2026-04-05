<template>
  <div class="wechat-view">
    <ListNav :mode="0" title="微信授权" />
    <div class="content">
      <p v-if="loading">正在处理授权...</p>
      <p v-else-if="error">{{ error }}</p>
      <p v-else>授权成功</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import { post } from '@/common/api'
import { saveCurUser } from '@/common/util'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')

onMounted(() => {
  const { type } = route.params
  const code = route.query.code
  
  if (code) {
    post('wechat/oauth', { code, type }).then(data => {
      saveCurUser(data)
      loading.value = false
      setTimeout(() => { router.push('/lives') }, 1000)
    }).catch(e => {
      error.value = e
      loading.value = false
    })
  } else {
    error.value = '授权失败'
    loading.value = false
  }
})
</script>

<style lang="stylus">



</style>
