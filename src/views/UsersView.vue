<template>
  <div class="users-view">
    <ListNav :mode="0" title="参与者" />
    <div class="users-content">
      <div class="user-list">
        <div class="user-item" v-for="user in users" :key="user.userId" @click="goRoom(user.userId)">
          <UserAvatar :user="user" />
          <span class="username">{{ user.username }}</span>
        </div>
      </div>
      <LoadMoreBar v-if="hasMore" :have-more="hasMore" :loading="loading" @load-more="loadMore" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import UserAvatar from '@/components/user-avatar.vue'
import LoadMoreBar from '@/components/LoadMoreBar.vue'
import { get } from '@/common/api'

const route = useRoute()
const router = useRouter()
const users = ref([])
const hasMore = ref(true)
const loading = ref(false)

onMounted(() => {
  loadUsers(0)
})

const loadUsers = (skip) => {
  const liveId = route.params.liveId
  loading.value = true
  get(`lives/${liveId}/users`, { skip, limit: 30 })
    .then(data => {
      loading.value = false
      if (skip === 0) {
        users.value = data
      } else {
        users.value = users.value.concat(data)
      }
      if (data.length < 30) {
        hasMore.value = false
      }
    })
    .catch(() => {
      loading.value = false
    })
}

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    loadUsers(users.value.length)
  }
}

const goRoom = (userId) => {
  router.push(`/room/${userId}`)
}
</script>

<style lang="stylus">



.users-view
  font-size 16px
  .title
    text-align center
  li
    background-color #fff
    padding 5px 30px
    margin-bottom 5px
    .avatar
      width 50px
      height 50px
    .name
      vertical-align top
      line-height 50px
      margin-left 10px
  .max-tips
    text-align center
    color gray
    margin 10px 0


</style>
