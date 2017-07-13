<template>
  <div class="markdown-comp">
    <div class="markdown-body" v-html="html"></div>
    <span v-show="!showAll" class="more-content-btn" @click="showAllBtn">查看全部</span>
  </div>
</template>

<script type="text/javascript">
require('../../node_modules/github-markdown-css/github-markdown.css')
require('../../node_modules/highlight.js/styles/solarized-light.css')

import marked from 'marked'
import highlight from 'highlight.js'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return highlight.highlightAuto(code).value
  }
})

export default {
  props: {
    'content': {
      type: String,
      required: true,
      default: ''
    },
    'showAll': {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    html () {
      if (!this.content) {
        return ''
      }
      if (!this.showAll && this.content.length > 100) {
        let partContent = ''
        for (let i = 0; i < 100; i++) {
          var ch = this.content.charAt(i)
          if (ch !== '[' && ch !== '(' && ch !== '!') {
            partContent += ch
          } else {
            break
          }
        }
        partContent += '....'
        return marked(partContent)
      } else {
        return marked(this.content)
      }
    }
  },
  methods: {
    showAllBtn () {
      this.showAll = true
    }
  }
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
