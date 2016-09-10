import crypto from 'crypto'
import util from './util'
import http from './http'
import {sprintf} from 'sprintf-js'
var debug = require('debug')('wechat');

var weixinAppId = 'wx7b5f277707699557'

var baseOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
'appid=' + weixinAppId + '&response_type=code&state=%s&scope=%s'

var weixinOauthUrl = (state, scope, redirectUrl) => {
  return sprintf(baseOauthUrl, state, scope) +  '&redirect_uri=' + encodeURIComponent(redirectUrl)
}

var weixinOauthUserUrl = (state) => {
  return weixinOauthUrl(state, 'snsapi_userinfo', 'http://m.quzhiboapp.com/#wechat/oauth')
}

var weixinSilentOauthUrl = (state) => {
  return weixinOauthUrl(state, 'snsapi_base', 'http://m.quzhiboapp.com/#wechat/silentOauth')
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

function oauth2(comp, liveId) {
  baseOauth2(comp, liveId, false)
}

function baseOauth2(comp, liveId, silent) {
  var url;
  var hash = '123'
  if (silent) {
    url = weixinSilentOauthUrl(hash)
  } else {
    url = weixinOauthUserUrl(hash)
  }
  window.location = url
}

function silentOauth2(comp, liveId) {
  baseOauth2(comp, liveId, true)
}

function configWeixin(comp) {
  var url = window.location.href.split('#')[0]
  comp.$http.get('wechat/sign', {
    url: url
  }).then((resp) => {
    if (resp.data) {
      var data = resp.data.result;
      wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems']
      })
      wx.error(function(res){
        util.show(comp, 'error', '配置失败' + JSON.stringify(res))
      })
    }
  })
}

function share(title, img, text, href) {
  wx.ready(function() {
      wx.onMenuShareTimeline({
          title: title,
          link: href,
          imgUrl: img,
          success: function() {
              console.log(arguments);
          },
          cancel: function() {
          }
      });
      wx.onMenuShareAppMessage({
          title: title,
          desc: text + '...',
          link: href,
          imgUrl: img,
          success: function() {
              console.log(arguments);
          },
          cancel: function() {
          }
      });
      wx.onMenuShareQQ({
          title: title,
          desc: text + '...',
          link: href,
          imgUrl: img,
          success: function() {
              console.log(arguments);
          },
          cancel: function() {
          }
      });
      wx.onMenuShareWeibo({
          title: title,
          desc: text + '...',
          link: href,
          imgUrl: img,
          success: function() {
              console.log(arguments);
          },
          cancel: function() {
          }
      });
  });
}

var menuList = ['menuItem:share:appMessage', 'menuItem:share:timeline',
                'menuItem:share:qq', 'menuItem:share:weiboApp']

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

function shareLive(live) {
  var title = live.owner.username + '的直播：' + live.subject
  share(title, live.coverUrl, title, 'http://m.quzhiboapp.com?liveId=' + live.liveId)
}

exports.weixinAppId = weixinAppId
exports.oauth2 = oauth2
exports.silentOauth2 = silentOauth2
exports.configWeixin = configWeixin
exports.hideMenu = hideMenu
exports.showMenu = showMenu
exports.shareLive = shareLive
