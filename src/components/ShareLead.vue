<template >

  <div class="share-lead">

    <div id="shareit">
      <img class="arrow" src="../img/share-it.png">
      <p id="follow">点击右上角按钮，分享给朋友~~</p>
    </div>

  </div>

</template>

<script type="text/javascript">

export default {
  name:'ShareLead',
  data() {
    return {
    }
  },
  components: {
  },
  methods: {
  }
}

</script>

<style lang="stylus">

@import '../stylus/base.styl'

.share-lead
  @extend .full-space
  position absolute
  #shareit
    -webkit-user-select none
    position absolute
    width 100%
    height 100%
    text-align center
    top 0
    left 0
    z-index 105
    img
      max-width 100%

  .arrow
    position absolute
    right 10%
    top 5%

  #follow
    width 100%
    height 50px
    line-height 50px
    text-align center
    text-decoration none
    font-size 18px
    color white
    float left
    margin-top 350px

  ul
    width 100%
    list-style none
    text-align center
    li
      height 30px
      width 70%
      line-height 30px
      margin-left 15%
      background #d9534f
      margin-top 10px
      border-radius 5px
      a
        text-decoration none
        color white
        display block




</style>
