var debug = require('debug')('util');

import moment from 'moment'
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
    show(comp, 'error', error)
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

function timeGap(ts) {
  return moment(ts, "YYYY-MM-DD hh:mm::ss").fromNow()
}

function isDebug() {
  return process.env.NODE_ENV != 'production'
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
