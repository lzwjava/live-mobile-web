<template>
  <div class="home-view">
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { curUser, saveCurUser } from '@/common/util'
import { get } from '@/common/api'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const { sessionToken, liveId, action, fromUserId } = route.query
  
  if (sessionToken) {
    loginBySessionToken(sessionToken, liveId)
    return
  }
  
  if (action === 'logout') {
    logout()
    return
  }

  if (fromUserId) {
    const fromUser = { fromUserId, liveId }
    window.localStorage.setItem('fromUser', JSON.stringify(fromUser))
  } else {
    const fromUser = window.localStorage.getItem('fromUser')
    if (fromUser) {
      const localLiveId = JSON.parse(fromUser).liveId
      if (localLiveId !== liveId) {
        window.localStorage.removeItem('fromUser')
      }
    }
  }

  if (liveId && parseInt(liveId) !== 0) {
    router.push('/intro/' + liveId)
  } else {
    router.push('/lives')
  }
})

const loginBySessionToken = (sessionToken, liveId) => {
  get('self', { sessionToken })
    .then(data => {
      document.cookie = `SessionToken=${data.sessionToken}`
      saveCurUser(data)
      if (liveId) {
        router.push(`/live/${liveId}`)
      } else {
        router.push('/lives')
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const logout = () => {
  get('logout')
    .then(() => {
      window.localStorage.removeItem('user')
      window.location = '/'
    })
    .catch(() => {
      window.location = '/'
    })
}
</script>

<style lang="stylus">



</style>
