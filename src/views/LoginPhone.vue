<template>
    <div class="login-phone-view">
        <div class="register-inside">
            <div>
                <input class="mobile-input" type="text" v-model="mobile" placeholder="手机号码" autofocus>

                <div class="sms-code-area">
                    <input class="sms-code-input" type="text" v-model="code" autofocus placeholder="验证码">
                    <button class="btn btn-gray btn-send" @click="requestSms">发送验证码</button>
                </div>
                <input class="mobile-input" type="text" v-model="password" placeholder="请输入密码" autofocus>

                <button class="btn btn-blue finish-btn" @click="loginAction">立即登录</button>

                <p class="small-tips">国外手机号码或无法收到验证码等请<a href="#" @click.prevent="goContact">联系我们</a></p>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">

    import {Button} from 'vue-weui'
    import util from '../common/util'
    import api from '../common/api'

    const debug = require('debug')('register-form')

    export default {
        name: 'BindPhoneView',
        props: [],
        components: {
            'weui-button': Button
        },
        data() {
            return {
                liveId: 0,
                mobile: '',
                code: '',
                password: '',
                from : ''
            }
        },
        route: {
            data({ to }) {
                this.from = to.query.from
            }
        },
        methods: {
            requestSms () {
                if (!this.mobile) {
                    util.show(this, 'error', '请输入手机号码');
                    return
                }
                util.loading(this)
                api.post(this, 'loginSmsCode',{
                    mobilePhoneNumber: this.mobile
                }).then(resp => {
                    util.loaded(this)
                util.show(this, 'success', '验证码已发送成功，请稍等片刻')
            }, util.httpErrorFn(this))
            },

            go(){
                window.sessionStorage.setItem("isLogin", "in")
                this.$router.go('/profile');
            },
            loginAction () {
                if (!this.mobile) {
                    util.show(this, 'error', '请输入手机号码');
                    return
                }
                if (!this.code) {
                    util.show(this, 'error', '请输入验证码');
                    return
                }
                util.loading(this)
                api.post(this, 'users/phoneNumberLogin', {
                    mobilePhoneNumber: this.mobile,
                    smsCode: this.code
                }).then(() => {
                    util.loaded(this)
                util.show(this, 'success', '登录成功')
                window.sessionStorage.setItem("isLogin", "in")
                this.$router.go('/profile');
                // if (this.from) {
                //     this.$router.go(this.from)
                // }
            }, util.promiseErrorFn(this))
            },
            goContact () {
                this.$router.go('/contact')
            },
        }
    }

</script>


<style lang="stylus">

    @import "../stylus/base.styl"

    .login-phone-view
        position absolute
        width 100%
        top 0
        bottom 0
        left 0
        right 0
        background-color #fff
        .register-inside
            position relative
            width 100%
            text-align center
            input
                border 0
                outline 0
                border-bottom 1px solid rgba(40,47,49,.3)
                box-shadow 0 1px 4px rgba(0,0,0,0.03)
                border-radius 3px
                padding 0 5px
                box-sizing border-box
                font-size 18px
                text-align center
            .mobile-input
            .sms-code-area
                display block
                width 60%
                height 40px
                margin-top 60px
                margin-left 20%
                line-height 40px
            .sms-code-input
                width 65%
                margin 0
                line-height 40px
            .btn-send
                width 30%
                font-size 12px
                padding 0
                height 30px
                vertical-align middle
            .tips
                font-size 24px
                margin-top 60px
                text-align center
            .small-tips
                margin-top 40px
                font-size 16px
                color #8C9CA3
                a
                    color #00ABD8
            .finish-btn
                width 150px
                height 44px
                margin-top 40px
                font-size 16px


</style>
