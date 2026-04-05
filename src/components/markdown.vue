<template>
  <div class="markdown-comp">
    <div class="markdown-body" v-html="html"></div>
    <span v-if="!showAll" class="more-content-btn" @click="showAllBtn">查看全部</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  showAll: {
    type: Boolean,
    default: true
  }
})

const showAllLocal = ref(props.showAll)

const html = computed(() => {
  if (!props.content) return ''
  
  if (!showAllLocal.value && props.content.length > 100) {
    let partContent = ''
    for (let i = 0; i < 100; i++) {
      const ch = props.content.charAt(i)
      if (ch !== '[' && ch !== '(' && ch !== '!') {
        partContent += ch
      } else {
        break
      }
    }
    partContent += '....'
    return marked(partContent)
  }
  return marked(props.content)
})

const showAllBtn = () => {
  showAllLocal.value = true
}
</script>

<style lang="stylus">


.markdown-comp
  .markdown-body
    padding 10px 20px
    font-size 16px
    color rgb(112, 112, 112)
    line-height 28px !important
  .more-content-btn
    color #00abd8
    padding 10px 20px


</style>
