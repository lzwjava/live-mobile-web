<template>
  <div class="profile-view">
    <div class="profile-container">
      <div class="profile-header" @click="goUpdateUserInfo">
        <div class="user-info">
          <div class="avatar-area">
            <UserAvatar :user="curUser" />
            <i class="fa fa-pencil-square-o pencil-edit" aria-hidden="true"></i>
          </div>
          <div class="username">{{ curUser.username }}</div>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goMylist">参与的直播</div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goRoom">我的直播间</div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goAccount">账户</div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="logout">退出登录</div>
      </div>
    </div>

    <Tabbar :active-index="1" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/user-avatar.vue'
import Tabbar from '@/components/Tabbar.vue'
import { curUser as getCurUser, removeCurUser } from '@/common/util'
import { get } from '@/common/api'

const router = useRouter()
const curUser = ref({})

onMounted(() => {
  curUser.value = getCurUser({})
})

const logout = () => {
  get('logout')
    .then(() => {
      curUser.value = {}
      removeCurUser()
      router.push('/lives')
    })
    .catch(() => {
      router.push('/lives')
    })
}

const goAccount = () => {
  router.push('/account')
}

const goMylist = () => {
  router.push('/mylist')
}

const goUpdateUserInfo = () => {
  router.push('/editUser')
}

const goRoom = () => {
  router.push(`/room/${curUser.value.userId}?from=profile`)
}
</script>

<style lang="stylus">


.profile-view
  .profile-container
    position absolute
    width 100%
    bottom 54px
    top 0
    overflow-y scroll
    .profile-header
      display flex
      width 100%
      height 165px
      background-color #00BDEF
      justify-content center
      align-items center
      .user-info
        text-align center
        .avatar-area
          width 70px
          height 70px
          position relative
          .pencil-edit
            color #ffb400
            position absolute
            right -15px
            bottom 0
            border-radius 7.5px
            width 15px
            heigth 15px
            font-size 15px
            padding 3px
          .avatar
            width 100%
            height 100%
        .username
          color #fff
          font-weight 500
    .menu-section
      margin-top 10px
      .menu-item
        height 50px
        background-color #fff
        line-height 50px
        padding-left 20px
        color #909499
        font-size 16px




</style>
