<template>
  <div class="edit-live-view">
    <ListNav :mode="0" title="编辑直播" />
    <div class="content">
      <div class="form-group">
        <label>直播主题</label>
        <input v-model="liveData.subject" placeholder="请输入直播主题" />
      </div>
      <div class="form-group">
        <label>直播时间</label>
        <DatePicker v-model="liveData.planTs" />
      </div>
      <div class="form-group">
        <label>直播详情</label>
        <MarkdownArea v-model="liveData.detail" placeholder="请输入直播详情" />
      </div>
      <button class="btn btn-blue" @click="saveLive">保存</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListNav from '@/components/ListNav.vue'
import DatePicker from '@/components/date_picker.vue'
import MarkdownArea from '@/components/markdown-area.vue'
import { fetchLive, saveLiveData } from '@/common/api'

const route = useRoute()
const liveData = ref({ subject: '', planTs: '', detail: '' })

onMounted(() => {
  const liveId = route.params.liveId
  fetchLive(liveId).then(data => {
    liveData.value = { subject: data.subject, planTs: data.planTs, detail: data.detail }
  }).catch(() => {})
})

const saveLive = () => {
  const liveId = route.params.liveId
  saveLiveData(liveId, liveData.value).then(() => {
    alert('保存成功')
  }).catch(() => {})
}
</script>

<style lang="stylus">


.edit-view
  .write-container
    background-color #fff
    padding 5px
    border 1px solid rgba(0,0,0,0.15)
    box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    -webkit-box-shadow 0px 1px 0px rgba(255,255,255,0.15) inset, 0px 1px 2px rgba(0,0,0,0.15)
    .weui_cell_switch
      .weui_cell_primary
        color #555555
    .weui_cell_hd
      .weui_label
        color #555555
    .item-title
      color #555555
    .cover-cell
      .cover
        width 50px
        float right
        margin-right 10px
    .row-action
      display flex
      margin-bottom 20px
      button
        flex 1
        margin 0 10px


</style>
