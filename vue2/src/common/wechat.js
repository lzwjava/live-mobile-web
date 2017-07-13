import util from './util'
import http from '../common/api'
import {sprintf} from 'sprintf-js'
import wx from 'weixin-js-sdk'

const weixinAppId = 'wx7b5f277707699557'

const baseOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
'appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s'

const weixinOauthUrl = (state, scope, redirectUrl) => {
  return sprintf(baseOauthUrl, weixinAppId, encodeURIComponent(redirectUrl), scope, state)
}

const weixinOauthUserUrl = (state) => {
  var redirectUrl
  if (util.isDebug()) {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/oauthTest'
  } else {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/oauth'
  }
  return weixinOauthUrl(state, 'snsapi_userinfo', redirectUrl)
}

const weixinSilentOauthUrl = (state) => {
  var redirectUrl
  if (util.isDebug()) {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/silentOauthTest'
  } else {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/silentOauth'
  }
  return weixinOauthUrl(state, 'snsapi_base', redirectUrl)
}

function oauth2 (comp) {
  baseOauth2(comp, false)
}

function baseOauth2 (comp, silent) {
  let url
  let hash = util.randomString(6)
  if (silent) {
    url = weixinSilentOauthUrl(hash)
  } else {
    url = weixinOauthUserUrl(hash)
  }
  window.location = url
}

function silentOauth2 (comp) {
  baseOauth2(comp, true)
}

function configWeixin (comp) {
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
        'showMenuItems', 'hideMenuItems', 'chooseWXPay', 'scanQRCode', 'startRecord', 'stopRecord',
        'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice',
        'chooseImage', 'uploadImage']
    })
    wx.error((res) => {
      util.show(comp, 'error', '微信出错' + JSON.stringify(res))
    })
    return Promise.resolve()
  })
}

function share (title, img, desc, href, comp, liveId, timelineTitle) {
  wx.ready(function () {
    if (!timelineTitle) {
      timelineTitle = title
    }
    wx.onMenuShareTimeline({
      title: timelineTitle,
      link: href,
      imgUrl: img,
      success: function () {
        comp.$emit('shareTimeline', liveId)
      }
    })
    wx.onMenuShareAppMessage({
      title,
      desc,
      link: href,
      imgUrl: img
    })
    wx.onMenuShareQQ({
      title,
      desc,
      link: href,
      imgUrl: img
    })
  })
}

var menuList = ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq']

function showOptionMenu () {
  wx.ready(function () {
    wx.showOptionMenu()
  })
}

function showMenu () {
  wx.ready(function () {
    wx.showMenuItems({
      menuList
    })
  })
}

function hideMenu () {
  wx.ready(function () {
    wx.hideMenuItems({
      menuList
    })
  })
}

function linkUrl (liveId, curUser) {
  var extraParams = ''
  if (curUser && curUser.userId) {
    extraParams = '&fromUserId=' + curUser.userId
  }
  return 'http://m.quzhiboapp.com/?liveId=' + liveId + '&t=' + new Date().getTime() + extraParams
}

function shareLive (comp, live, curUser) {
  var iconUrl = live.owner.avatarUrl
  if (live.shareIcon === 1) {
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

function shareApp (comp) {
  var title = '趣直播-知识直播平台'
  share(title, 'http://i.quzhiboapp.com/logo.png', title, linkUrl(0), 0)
}

function shareJoin (comp) {
  var title = '欢迎您加入趣直播'
  share(title, 'http://i.quzhiboapp.com/logo.png', title, 'http://m.quzhiboapp.com/#staff', 0)
}

function sharePage (comp, title, path) {
  share(title, 'http://i.quzhiboapp.com/logo.png', title, 'http://m.quzhiboapp.com/#' + path, 0)
}

function wxPay (data) {
  return new Promise(function (resolve, reject) {
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

function wechatScan () {
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

function scanQRcode (comp) {
  return wechatScan()
  .then((code) => {
    return http.post(comp, 'qrcodes', {
      code: code,
      type: 0
    })
  })
}

function scanQRcodeWithLive (comp, liveId) {
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

function chooseAndUploadImage (comp) {
  return new Promise(
    function (resolve, reject) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          var localIds = res.localIds
          if (localIds.length > 0) {
            wx.uploadImage({
              localId: localIds[0],
              isShowProgressTips: 1,
              success: (res) => {
                var serverId = res.serverId
                util.loading(comp)
                http.get(comp, 'files/wechatToQiniu', {
                  mediaId: serverId
                }).then((data) => {
                  util.loaded(comp)
                  resolve(data)
                }, (error) => {
                  util.loaded(comp)
                  reject(error)
                })
              },
              fail: () => {
                reject('上传头像失败')
              }
            })
          } else {
            reject('localIds length is 0')
          }
        },
        fail: () => {
          reject('选取头像失败')
        }
      })
    }
  )
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
exports.chooseAndUploadImage = chooseAndUploadImage
