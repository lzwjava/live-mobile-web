<template>
  <div class="staff-view">

    <div class="content-area">

      <div class="welcome-word">
        <h1>欢迎您加入趣直播</h1>
        <h3 class="stats">我们在服务 {{stats.users}} 名用户</h3>
        <h4 class="free-word">团队每一位小伙伴可免费参与直播</h4>
      </div>

      <div class="bind-area">
        <div class="bind-input" v-show="mode == 0">
          <input type="text" name="" value="" v-model="key" placeholder="请输入密钥来绑定账号">
          <button class="btn btn-blue" name="button" @click="bind">绑定</button>
        </div>

        <div class="bind-succeed" v-show="mode == 1">

          您已成功绑定账号<br>来参与一些<a href="/?liveId=0">精彩直播</a>吧

        </div>

      </div>



    </div>



    <h3 class="slogan">山河湖海都是<br>我们造梦的地方</h3>


  </div>

</template>

<script type="text/javascript">

import debugFn from 'debug'
import api from '../common/api'
import util from '../common/util'
import wechat from '../common/wechat'

const debug = debugFn('StaffView')

export default {
  name: 'StaffView',
  data() {
    return {
      key: '',
      mode: 0,
      stats: {}
    }
  },
  created() {
    util.loading(this)
    Promise.all([
      api.get(this, 'stats'),
      wechat.configWeixin(this)
    ]).then((values) => {
      util.loaded(this)

      this.stats = values[0]

      wechat.showOptionMenu()
      wechat.shareJoin(this)

    }).catch(util.promiseErrorFn(this))
  },
  methods: {
    bind () {
      api.post(this, 'staffs', {
        key: this.key
      }).then(() => {
        this.mode = 1
      }, util.promiseErrorFn(this))
    }
  }
}

</script>

<style lang="stylus">

@import "../stylus/base.styl"

.staff-view
  background-image url('../img/welcome.jpg')
  background-size     cover
  background-repeat   no-repeat
  background-position   center center
  position absolute
  left 0
  bottom 0
  right 0
  top 0
  color #fff
  .content-area
    margin-top 20px
    padding 20px
    .free-word
      margin-top 10px
    .bind-area
      margin-top 30px
      .bind-input
        input
          height 30px
          font-size 16px
          background-color transparent
          color #fff
          border-bottom 1px solid rgb(153,153,153)
        button
          padding 5px 10px
          height 30px
          margin-left 10px
      .bind-succeed
        a
          color #bbb
  .slogan
    position absolute
    right 0
    bottom 0
    margin-right 20px
    margin-bottom 20px

</style>
