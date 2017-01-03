<!-- 注册主播 -->
<template>
<div class="reg-anchor-view">
    <div class="weui_cells_title title_top">申请成为主播</div>
    <div class="weui_cells_title title_top_2">请阅读下方协议</div>
    <div class="weui_cells weui_cells_form">

        <div class="weui-cells__title">真实姓名</div>
        <div class="weui-cells">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <input class="weui-input" v-model="anchor.name" type="text">
                </div>
            </div>
        </div>

        <div class="weui-cells__title">微信号</div>
        <div class="weui-cells">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <input class="weui-input" v-model="anchor.wechatAccount" type="text">
                </div>
            </div>
        </div>

        <div class="weui-cells__title">个人社交媒体账号</div>
        <div class="weui-cells weui-cells_form" >
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea class="weui-textarea" v-model="anchor.socialAccount" placeholder="如微信公众号（粉丝量级）、简书、微博、知乎、GitHub等" rows="1" style="word-wrap: break-word;overflow-y:visible"></textarea>
                </div>
            </div>
        </div>

        <div class="weui-cells__title">个人简介</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea class="weui-textarea" v-model="anchor.introduction" rows="6" placeholder="教育背景、职业背景、个人成就等详细信息，会帮助大家更全面的了解主播！同时也会加快审核速度(๑•̀ㅂ•́)و✧"></textarea>
                </div>
            </div>
        </div>


    </div>

    <div class="weui_btn_area">
        <button class="btn btn-blue" @click="submit">确定</button>
    </div>

    <div class="weui-footer weui-footer_fixed-bottom">
        <p class="weui-footer__text">申请即代表同意
            <a href="#" @click.prevent="agreement">主播人合作协议</a>
        </p>
    </div>

    <div v-show="toast.show">
        <div class="weui-mask"></div>
        <div class="weui-dialog">
            <div class="weui-dialog__bd">{{toast.message}}</div>
            <div class="weui-dialog__ft">
                <a href="javascript:;" @click="confirm" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>
            </div>
        </div>
    </div>
</div>
</template>

<script type="text/javascript">
import util from '../common/util'
import api from '../common/api'

export default {
    name: 'RegAnchorView',
    data() {
        return {
            // 预注册主播信息初始化
            anchor: {
                name: '',
                wechatAccount: '',
                socialAccount: '',
                introduction: ''
            },
            toast: {
                show: 0,
                message: '注册成功'
            }
        }
    },
    methods: {
        // 应当验证表单信息
        // 微信号本应该从当前用户获取,目前手动输入
        //  提交
        submit() {
            // 表单校验：不允许为空
            // 其它校验交给后端
            for(let k in this.anchor){
              if(''=== this.anchor[k]){
                this.toast.message = "请填写完整！"
                this.toast.show = 1
                return
              }
            }
            api.post(this, 'applications/create', {
                    name: this.anchor.name,
                    wechatAccount: this.anchor.wechatAccount,
                    socialAccount: this.anchor.socialAccount,
                    introduction: this.anchor.introduction
                })
                .then(res=>{
                  this.toast.message = `
                    申请成功！我们正在审核，之后将在公众号通知您。
                  `,
                  this.toast.show = 1
                  for(let k in this.anchor){
                    this.anchor[k] = ''
                  }
                },error=>{
                  this.toast.message = error
                  this.toast.show = 1
                })
        },
        // 提示框
        confirm(){
          this.toast.show = 0
        },
        agreement () {
          this.$router.go('/agreement')
        }
    }
}
</script>

<style media="screen" lang="stylus">
.reg-anchor-view
  padding 0 1rem
  height 100% !important
  background-color #fff
  .title_top
    text-align center
    font-size 1.5rem !important
    color #00bdef !important
  .title_top_2
    text-align center
    font-size 9px !important
    marigin-top 0 !important
.weui_btn_area
  button
    width 100%
</style>
