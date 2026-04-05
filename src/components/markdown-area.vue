<template>
  <div :id="markdownContainerId" class="markdown-area" :class="{ active: content.length }">
    <div class="markdown-actions" v-if="supportMarkdown">
      <button class="btn btn-gray" :id="imageBtnId">上传图片</button>
      <button class="btn btn-gray btn-preview" @click="preview" v-if="!showPreview">预览模式</button>
      <button class="btn btn-gray btn-edit" @click="focus" v-if="showPreview">编辑模式</button>
    </div>

    <div class="markdown-content">
      <textarea 
        class="markdown-area-common" 
        :id="textareaId" 
        :placeholder="placeholder" 
        v-show="!showPreview" 
        v-model="contentValue"
        @keydown="keyboardSubmit"
      ></textarea>

      <div class="markdown-preview markdown-area-common" v-show="showPreview">
        <MarkdownContent :content="content" :show="true" />
      </div>

      <p class="tips" v-if="supportMarkdown">* 支持 Markdown</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MarkdownContent from './markdown.vue'
import { randomString } from '@/common/util'
import { get } from '@/common/api'

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  supportMarkdown: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:content', 'submit'])

const contentValue = computed({
  get: () => props.content,
  set: (val) => emit('update:content', val)
})

const showPreview = ref(false)
const imageBtnId = ref('image-btn-' + randomString(3))
const textareaId = ref('textarea-' + randomString(3))
const markdownContainerId = ref('markdown-container-' + randomString(3))

const keyboardSubmit = (e) => {
  if (e.keyCode !== 13) return
  const mac = /mac/i.test(navigator.userAgent)
  if ((mac && !e.metaKey) || (!mac && !e.ctrlKey)) return
  emit('submit')
}

const focus = () => {
  showPreview.value = false
  setTimeout(() => {
    document.getElementById(textareaId.value)?.focus()
  }, 10)
}

const preview = () => {
  showPreview.value = true
}

const insertLink = (link) => {
  const textarea = document.getElementById(textareaId.value)
  if (textarea) {
    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const text = contentValue.value
    contentValue.value = text.substring(0, startPos) + link + text.substring(endPos)
  }
}
</script>

<style lang="stylus">


.markdown-area
  position relative
  .markdown-content
    margin-top 10px
    display block
    height 400px
  .markdown-area-common
    width 100%
    height 92%
  .tips
    color #828282
    font-size 12px
  textarea
    font-size 16px
    border 1px solid rgba(40,47,49,0.3)
    opacity 0.8
    padding 10px
    &:focus
      border 1px solid #1CB2EF
  .markdown-preview
    .markdown-body
      background-color #fff
  .markdown-actions
    display flex
    .btn-edit
      color #00BDEF
    button
      flex 1
      margin 0 10px


</style>
