var crypto = require('crypto');
var debug = require('debug')('wechat');
var util = require('./util');

var weixinAppId = 'wx7b5f277707699557'
var redirectUrl = encodeURIComponent('http://m.quzhiboapp.com')
var weixinOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
'appid=' + weixinAppId + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'

function makeSignature(jsapi_ticket,noncestr,timestamp,url) {
    var tmpStr = "jsapi_ticket="+jsapi_ticket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+url;
    var shasum = crypto.createHash('sha1');
    shasum.update(tmpStr);
    var shaResult = shasum.digest('hex');
    console.log('signature:'+shaResult);
    return shaResult;
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

function oauth2() {
  window.location = weixinOauthUrl
}

exports.getAccessToken = getAccessToken
exports.weixinAppId = weixinAppId
exports.oauth2 = oauth2
exports.wechatRegister = wechatRegister
