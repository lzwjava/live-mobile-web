var crypto = require('crypto');
var debug = require('debug')('wechat');
var util = require('./util');

var weixinAppId = 'wx7b5f277707699557'
var weixinSecret = '3d85c980817fd92eac4530b3c0ce667a'
var redirectUrl = encodeURIComponent('http://m.quzhiboapp.com')
var weixinOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
'appid=' + weixinAppId + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
var accessTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?' +
'appid=' + weixinAppId + '&secret=' + weixinSecret + '&grant_type=authorization_code&code='

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

function getUserAccessToken(comp, code) {
  var url = accessTokenUrl + code
  comp.$http.get(url)
    .then((resp) => {
      debug(resp.data)
    }, function (error) {
      debug('accessToken error: %j', error)
    })
}

function oauth2() {
  window.location = weixinOauthUrl
}

exports.getAccessToken = getAccessToken
exports.weixinAppId = weixinAppId
exports.oauth2 = oauth2
exports.getUserAccessToken = getUserAccessToken
