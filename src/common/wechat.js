import wx from 'weixin-js-sdk'
import { sprintf } from 'sprintf-js'
import api from './api'
import { isDebug, randomString, show, loadUser, setUser } from './util'

const weixinAppId = 'wx7b5f277707699557'

const baseOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
  'appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s#wechat_redirect'

const weixinOauthUrl = (state, scope, redirectUrl) => {
  return sprintf(baseOauthUrl, weixinAppId, encodeURIComponent(redirectUrl), scope, state)
}

const weixinOauthUserUrl = (state) => {
  let redirectUrl
  if (isDebug()) {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/oauthTest'
  } else {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/oauth'
  }
  return weixinOauthUrl(state, 'snsapi_userinfo', redirectUrl)
}

const weixinSilentOauthUrl = (state) => {
  let redirectUrl
  if (isDebug()) {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/silentOauthTest'
  } else {
    redirectUrl = 'http://m.quzhiboapp.com/#wechat/silentOauth'
  }
  return weixinOauthUrl(state, 'snsapi_base', redirectUrl)
}

export function logout(comp, fn) {
  api.get('logout').then(() => {
    fn && fn()
  }).catch(() => {
    // ignore
  })
}

export function oauth2(comp) {
  baseOauth2(comp, false)
}

function baseOauth2(comp, silent) {
  let hash = randomString(6)
  let url
  if (silent) {
    url = weixinSilentOauthUrl(hash)
  } else {
    url = weixinOauthUserUrl(hash)
  }
  window.location = url
}

export function silentOauth2(comp) {
  baseOauth2(comp, true)
}

export function configWeixin(comp) {
  let url = window.location.href.split('#')[0]
  return api.get('wechat/sign', {
    url: encodeURIComponent(url)
  }).then((data) => {
    return new Promise((resolve, reject) => {
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ',
          'showMenuItems', 'hideMenuItems', 'chooseWXPay', 'scanQRCode',
          'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice',
          'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice',
          'chooseImage', 'uploadImage', 'previewImage'
        ]
      })
      wx.error((res) => {
        show(comp, 'error', '微信出错' + JSON.stringify(res))
      })
      wx.ready(() => {
        resolve()
      })
    })
  })
}

function share(title, img, desc, href, comp, liveId, timelineTitle) {
  wx.ready(() => {
    if (!timelineTitle) {
      timelineTitle = title
    }
    wx.onMenuShareTimeline({
      title: timelineTitle,
      link: href,
      imgUrl: img,
      success: function () {
        comp.$emit('shareTimeline', liveId)
      },
      cancel: function () {}
    })
    wx.onMenuShareAppMessage({
      title: title,
      desc: desc,
      link: href,
      imgUrl: img,
      success: function () {},
      cancel: function () {}
    })
    wx.onMenuShareQQ({
      title: title,
      desc: desc,
      link: href,
      imgUrl: img,
      success: function () {},
      cancel: function () {}
    })
  })
}

var menuList = [
  'menuItem:share:appMessage',
  'menuItem:share:timeline',
  'menuItem:share:qq'
]

export function showOptionMenu() {
  wx.ready(() => {
    wx.showOptionMenu()
  })
}

export function showMenu() {
  wx.ready(() => {
    wx.showMenuItems({
      menuList: menuList
    })
  })
}

export function hideMenu() {
  wx.ready(() => {
    wx.hideMenuItems({
      menuList: menuList
    })
  })
}

function linkUrl(liveId, curUser) {
  var extraParams = ''
  if (curUser && curUser.userId) {
    extraParams = '&fromUserId=' + curUser.userId
  }
  var url = 'http://m.quzhiboapp.com/?liveId=' + liveId + '&t=' + new Date().getTime() + extraParams
  return url
}

export function shareLive(comp, live, curUser) {
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
  share(title, iconUrl, desc, linkUrl(live.liveId, curUser), comp, live.liveId, timelineTitle)
}

export function shareApp(comp) {
  var title = '趣直播-知识直播平台'
  share(title, 'https://i.quzhiboapp.com/logo.png', title, linkUrl(0), 0)
}

export function shareJoin(comp) {
  var title = '欢迎您加入趣直播'
  share(title, 'https://i.quzhiboapp.com/logo.png', title, 'http://m.quzhiboapp.com/#staff', 0)
}

export function sharePage(comp, title, path) {
  share(title, 'https://i.quzhiboapp.com/logo.png', title, 'http://m.quzhiboapp.com/#' + path, 0)
}

export function wxPay(data) {
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

function wechatScan() {
  return new Promise(function (resolve, reject) {
    if (isDebug()) {
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

export function scanQRcode(comp) {
  return wechatScan().then((code) => {
    return api.post('qrcodes', {
      code: code,
      type: 0
    })
  })
}

export function scanQRcodeWithLive(comp, liveId) {
  return wechatScan().then((code) => {
    var data = { liveId: liveId }
    return api.post('qrcodes', {
      code: code,
      type: 1,
      data: JSON.stringify(data)
    })
  })
}

export function chooseAndUploadImage(comp) {
  return new Promise(function (resolve, reject) {
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
              api.get('files/wechatToQiniu', {
                mediaId: serverId
              }).then((data) => {
                resolve(data)
              }).catch((error) => {
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
  })
}

export function previewImage(current, urls) {
  wx.ready(() => {
    wx.previewImage({
      current,
      urls
    })
  })
}

export { weixinAppId, loadUser, setUser }
