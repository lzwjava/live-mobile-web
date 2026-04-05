<template>
  <div class="edit-user-view">
    <ListNav :mode="0" title="编辑资料" />
    <div class="content">
      <div class="avatar-section" @click="changeAvatar">
        <UserAvatar :user="userData" />
        <p>点击更换头像</p>
      </div>
      <div class="form-group">
        <label>用户名</label>
        <input v-model="userData.username" placeholder="请输入用户名" />
      </div>
      <div class="form-group">
        <label>简介</label>
        <textarea v-model="userData.bio" placeholder="请输入简介"></textarea>
      </div>
      <button class="btn btn-blue" @click="saveUser">保存</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListNav from '@/components/ListNav.vue'
import UserAvatar from '@/components/user-avatar.vue'
import { curUser, saveCurUser } from '@/common/util'
import { get, post } from '@/common/api'

const userData = ref({ username: '', bio: '', avatarUrl: '' })

onMounted(() => {
  userData.value = curUser({})
})

const changeAvatar = () => {
  // Implement avatar change
}

const saveUser = () => {
  post('self', userData.value).then(data => {
    saveCurUser(data)
    alert('保存成功')
  }).catch(() => {})
}
</script>

<style lang="stylus">


.edit-section
  padding 10px 0
  border-bottom solid 1px #f5f5f5
  display flex
  background-color #fff
  align-items center
  .edit-title
    padding-left 10px
    color #3d4245
    font-size 15px
  .edit-right
    flex 1
    text-align right
    padding-right 20px
  .edit-avatar
    width 30px
    height 30px
    vertical-align middle
  .edit-username
    color #909499




</style>
