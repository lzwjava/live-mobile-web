import crypto from 'crypto'
import util from './util'
import http from '../common/api'
import {sprintf} from 'sprintf-js'
var debug = require('debug')('wechat');

var weixinAppId = 'wx7b5f277707699557'

var baseOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
'appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s'

var weixinOauthUrl = (state, scope, redirectUrl) => {
  return sprintf(baseOauthUrl, weixinAppId, encodeURIComponent(redirectUrl),scope,state)
}

var weixinOauthUserUrl = (state) => {
  var redirectUrl;
  if (util.isDebug()) {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/oauthTest'
  } else {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/oauth'
  }
  return weixinOauthUrl(state, 'snsapi_userinfo', redirectUrl)
}

var weixinSilentOauthUrl = (state) => {
  var redirectUrl;
  if (util.isDebug()) {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/silentOauthTest'
  } else {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/silentOauth'
  }
  return weixinOauthUrl(state, 'snsapi_base', redirectUrl)
}

function logout(comp, fn) {
  comp.$http.get('logout')
  .then((resp) => {
    if (util.filterError(comp, resp)) {
      fn && fn()
    }
  }, util.httpErrorFn(comp))
}

function loadUser() {
  if(window.localStorage.getItem('qzb.user')){
    return JSON.parse(window.localStorage.getItem('qzb.user'));
  }
  return null;
}

function setUser(user) {
  if (user && user.username) {
    window.localStorage.setItem('qzb.user',JSON.stringify(user));
    return true
  }
  return false
}

function oauth2(comp) {
  baseOauth2(comp, false)
}

function baseOauth2(comp, silent) {
  var url;
  var hash = util.randomString(6)
  if (silent) {
    url = weixinSilentOauthUrl(hash)
  } else {
    url = weixinOauthUserUrl(hash)
  }
  window.location = url
}

function silentOauth2(comp) {
  baseOauth2(comp, true)
}

function configWeixin(comp) {
  var url = window.location.href.split('#')[0]
  return http.get(comp, 'wechat/sign', {
    url: encodeURIComponent(url)
  }).then((data) => {
    wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ',
                    'showMenuItems', 'hideMenuItems', 'chooseWXPay', 'scanQRCode', 'startRecord','stopRecord',
                    'onRecordEnd','playVoice','pauseVoice','stopVoice','uploadVoice','downloadVoice']
    })
    wx.error((res) => {
      util.show(comp, 'error', '微信出错' + JSON.stringify(res))
    })
    return Promise.resolve()
  })
}

function share(title, img, desc, href, comp, liveId, timelineTitle) {
  wx.ready(function() {
      if (!timelineTitle) {
        timelineTitle = title
      }
      wx.onMenuShareTimeline({
          title: timelineTitle,
          link: href,
          imgUrl: img,
          success: function() {
            comp.$emit('shareTimeline', liveId)
          },
          cancel: function() {

          }
      })
      wx.onMenuShareAppMessage({
          title: title,
          desc: desc,
          link: href,
          imgUrl: img,
          success: function() {
          },
          cancel: function() {

          }
      })
      wx.onMenuShareQQ({
          title: title,
          desc: desc,
          link: href,
          imgUrl: img,
          success: function() {

          },
          cancel: function() {
          }
      })
  })
}

var menuList = ['menuItem:share:appMessage', 'menuItem:share:timeline',
                'menuItem:share:qq']

function showOptionMenu() {
  wx.ready(function () {
    wx.showOptionMenu();
  })
}

function showMenu() {
  wx.ready(function() {
      wx.showMenuItems({
          menuList: menuList
      });
  })
}

function hideMenu() {
  wx.ready(function() {
      wx.hideMenuItems({
          menuList: menuList
      });
  })
}

function linkUrl(liveId, curUser) {
  var extraParams = ''
  if (curUser && curUser.userId) {
    extraParams = '&fromUserId=' + curUser.userId
  }
  var url = 'http://m.quzhiboapp.com/?liveId=' + liveId + '&t=' + new Date().getTime()
     + extraParams
  return url
}

function shareLive(comp, live, curUser) {
  var iconUrl = live.owner.avatarUrl
  if (live.shareIcon == 1) {
    iconUrl = live.coverUrl
  }
  var title = live.owner.username + '在趣直播：' + live.subject
  var desc = '来自趣直播-知识直播平台。'
  var timelineTitle
  if (curUser && curUser.userId) {
    timelineTitle = title + ' | 邀请自' + curUser.username
    desc += curUser.username + '邀请您参加。'
  }
  share(title, iconUrl, desc, linkUrl(live.liveId, curUser),
      comp, live.liveId, timelineTitle)
}

function shareApp(comp) {
  var title = '趣直播-知识直播平台'
  share(title, 'http://i.quzhiboapp.com/logo.png', title, linkUrl(0), 0)
}

function shareJoin(comp) {
  var title = '欢迎您加入趣直播'
  share(title, 'http://i.quzhiboapp.com/logo.png', title, 'http://m.quzhiboapp.com/#staff', 0)
}

function sharePage(comp, title, path) {
  share(title, 'http://i.quzhiboapp.com/logo.png', title, 'http://m.quzhiboapp.com/#' + path, 0)
}

function wxPay(data) {
  return new Promise(function (resolve, reject){
    wx.ready(() => {
      wx.chooseWXPay({
        timestamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        paySign: data.paySign,
        signType: data.signType,
        success: (res) => {
          resolve()
        },
        cancel: (res) => {
          reject('已取消微信支付:' + res.errMsg)
        },
        fail: (res) => {
          reject('支付失败:' + res.errMsg)
        }
      })
    })
  })
}

function wechatScan() {
  return new Promise(function (resolve, reject) {
    if (util.isDebug()) {
      resolve('quzhibo-IdfuPYUOqRraAM0KcwdWPeQzws6tpN7L')
    } else {
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1,
          scanType: ['qrCode'],
          success: (res) => {
            var result = res.resultStr
            resolve(result)
          },
          fail: (res) => {
            reject('扫描失败' + res.errMsg)
          }
        })
      })
    }
  })
}

function scanQRcode(comp) {
  return wechatScan()
  .then((code) => {
    return http.post(comp, 'qrcodes', {
      code: code,
      type: 0
    })
  })
}

function scanQRcodeWithLive(comp, liveId) {
  return wechatScan()
  .then((code) => {
    var data = {liveId: liveId}
    return http.post(comp, 'qrcodes', {
      code: code,
      type: 1,
      data: JSON.stringify(data)
    })
  })
}

exports.weixinAppId = weixinAppId
exports.oauth2 = oauth2
exports.silentOauth2 = silentOauth2
exports.configWeixin = configWeixin
exports.hideMenu = hideMenu
exports.showMenu = showMenu
exports.shareLive = shareLive
exports.shareApp = shareApp
exports.shareJoin = shareJoin
exports.scanQRcode = scanQRcode
exports.scanQRcodeWithLive = scanQRcodeWithLive
exports.showOptionMenu = showOptionMenu
exports.wxPay = wxPay
exports.sharePage = sharePage
