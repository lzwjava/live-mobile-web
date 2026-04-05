<template>
  <div class="edit-detail-view">
    <ListNav :mode="0" :title="type === 'notice' ? '编辑公告' : '编辑详情'" />
    <div class="content">
      <MarkdownArea v-if="type === 'notice'" v-model="content" placeholder="请输入公告内容" />
      <MarkdownArea v-else v-model="content" placeholder="请输入详情" />
      <button class="btn btn-blue" @click="saveDetail">保存</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import MarkdownArea from '@/components/markdown-area.vue'
import { fetchLive, saveLiveData } from '@/common/api'

const route = useRoute()
const content = ref('')
const type = ref('')

onMounted(() => {
  const { liveId, type: t } = route.params
  type.value = t
  fetchLive(liveId).then(data => {
    content.value = t === 'notice' ? data.notice : data.detail
  }).catch(() => {})
})

const saveDetail = () => {
  const { liveId, type: t } = route.params
  const key = t === 'notice' ? 'notice' : 'detail'
  saveLiveData(liveId, { [key]: content.value }).then(() => {
    alert('保存成功')
  }).catch(() => {})
}
</script>

<style lang="stylus">



.edit-detail-view
  padding 10px
  .edit-title
    margin-top 10px
    font-size 18px
    text-align center
  .markdown-area
    margin-top 10px
  .action-btns
    display flex
    button
      flex 1
      margin 0 10px


</style>
