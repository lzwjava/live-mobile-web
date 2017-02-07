var debug = require('debug')('util');

import moment from 'moment-timezone'
moment.locale('zh-cn')

var filterError = (component, res) => {
  debug('resp:%j', res.data)
  if (res.data.status != "success") {
    component.$dispatch('show-msg', 'error', res.data.error)
    return false;
  } else {
    return true;
  }
};

var escape = (html) => {
  html = html || '';
  return html
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
};

var httpErrorFn = (component) => {
  return function (res) {
    var text = res.statusText
    if (text == '') {
      text = '网络超时错误'
    }
    component.$dispatch('show-msg', 'error', text)
  }
}

var show = (component, type, text, duration) => {
  component.$dispatch('show-msg', type, text)
}

var promiseErrorFn = (comp, callback) => {
  return (error) => {
    show(comp, 'error', error, 3000)
    comp.$dispatch('loading', false)
    callback && callback()
  }
}

var transformToAssocArray = (prmstr) => {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var getParams = () => {
      var prmstr = window.location.search.substr(1);
      debug('paramStr:' + window.location.search)
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function isWeixinBrowser() {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
}

function isAndroidBrowser() {
  return /android/.test(navigator.userAgent.toLowerCase())
}

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function loading(comp) {
  comp.$dispatch('loading', true)
}

function loaded(comp) {
  comp.$dispatch('loading', false)
}

function getLang() {
 if (navigator.languages != undefined)
  return navigator.languages[0]
 else
  return navigator.language
}

function timeGap(ts) {
  var text = moment.tz(ts, "YYYY-MM-DD hh:mm::ss", 'Asia/Shanghai').fromNow()
  if (text) {
    text = text.replace(/[\u5185]/g, '后')
    text = text.replace(' ', '')
  }
  return text
}

function timeDuration(ts) {
  var text = moment.tz(ts, "YYYY-MM-DD hh:mm::ss", 'Asia/Shanghai').fromNow(true)
  if (text) {
    text = text.replace(' ', '')
  }
  return text
}

function isDebug() {
  return process.env.NODE_ENV != 'production'
}

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

function statusText (status) {
  switch (status) {
    case 1:
      return '编辑中';
    case 5:
      return '审核中';
    case 10:
      return '报名中';
    case 20:
      return '直播中';
    case 25:
      return '转码中';
    case 30:
      return '已结束';
    case 35:
      return '已结束';
  }
  return '未知';
}

function initTitle() {
  document.title = '趣直播 - 知识直播平台'
}

function defaultUser() {
  return {
    userId: 0,
    username: '系统',
    avatarUrl: 'http://i.quzhiboapp.com/defaultAvatar1.png'
  }
}

exports.getParams = getParams
exports.show = show
exports.promiseErrorFn = promiseErrorFn
exports.httpErrorFn = httpErrorFn
exports.escape = escape
exports.filterError = filterError
exports.isWeixinBrowser = isWeixinBrowser
exports.randomString = randomString
exports.loading = loading
exports.loaded =loaded
exports.timeGap = timeGap
exports.isAndroidBrowser = isAndroidBrowser
exports.isDebug = isDebug
exports.getKeys = getKeys
exports.statusText = statusText
exports.timeDuration = timeDuration
exports.initTitle = initTitle
exports.defaultUser = defaultUser
