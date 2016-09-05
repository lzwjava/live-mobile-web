var crypto = require('crypto');
var debug = require('debug')('wechat');
var util = require('./util');

var weixinAppId = 'wx7b5f277707699557'
var redirectUrl = 'http://m.quzhiboapp.com'
var weixinOauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
'appid=' + weixinAppId + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'

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
        debug('signature: %j', data.signature)
        debug('appId: %j', data.appId)
        debug('nonce: %j', data.nonceStr)
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

function oauth2() {
  window.location = weixinOauthUrl
}

exports.getAccessToken = getAccessToken;
exports.weixinAppId = weixinAppId;
