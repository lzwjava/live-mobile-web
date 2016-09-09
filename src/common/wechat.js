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
  return weixinOauthUrl(state, 'snsapi_userinfo', 'http://api.quzhiboapp.com/wechat/oauth')
}

var weixinSilentOauthUrl = (state) => {
  return weixinOauthUrl(state, 'snsapi_base', 'http://api.quzhiboapp.com/wechat/silentOauth')
}

function getAccessToken(comp) {
  comp.$http.get('wechat/sign')
    .then((resp) => {
      if (util.filterError(comp, resp)) {
        var data = resp.data.result;
        wx.config({
            debug: true,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        wx.ready(function () {
          debug('ready')
        })
        wx.error(function(res){
          debug('error: %j', res)
        });
      }
  }, util.httpErrorFn(comp))
}

function logout(comp, fn) {
  comp.$http.get('logout')
  .then((resp) => {
    if (util.filterError(comp, resp)) {
      fn && fn()
    }
  }, util.httpErrorFn(comp))
}

function wechatRegister(comp, code, fn) {
  logout(comp, function () {
    comp.$http.post('wechat/register', {
      code: code
    }).then((resp) => {
      if (util.filterError(comp, resp)) {
        var user = resp.data.result;
        debug('wechar user: %j', user)
        if (user.userId != null) {
          setUser(user);
        }
        fn && fn(user)
      }
    }, util.httpErrorFn(comp))
  })
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
  http.createState(comp, liveId)
    .then((hash) => {
      var url;
      if (silent) {
        url = weixinSilentOauthUrl(hash)
      } else {
        url = weixinOauthUserUrl(hash)
      }
      debug('url:%j', url)
      window.location = url
    }, util.promiseErrorFn(comp))
}

function silentOauth2(comp, liveId) {
  baseOauth2(comp, liveId, true)
}

exports.getAccessToken = getAccessToken
exports.weixinAppId = weixinAppId
exports.oauth2 = oauth2
exports.wechatRegister = wechatRegister
exports.silentOauth2 = silentOauth2
