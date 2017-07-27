let debug = require('debug')('util')

import moment from 'moment-timezone'
moment.locale('zh-cn')

let filterError = (component, res) => {
  debug('resp:%j', res.data)
  if (res.data.status != "success") {
    component.$dispatch('show-msg', 'error', res.data.error)
    return false
  } else {
    return true
  }
};

let escape = (html) => {
  html = html || ''
  return html
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
}

let httpErrorFn = (component) => {
  return function (res) {
    let text = res.statusText
    if (text == '') {
      text = '网络超时错误'
    }
    component.$dispatch('show-msg', 'error', text)
  }
}

let show = (component, type, text, duration) => {
  component.$dispatch('show-msg', type, text)
}

let showError = (component, text) => {
  show(component, 'error', text)
}

let promiseErrorFn = (comp, callback) => {
  return (error) => {
    show(comp, 'error', error, 3000)
    comp.$dispatch('loading', false)
    callback && callback()
  }
}

let transformToAssocArray = (prmstr) => {
    let params = {}
    let prmarr = prmstr.split("&")
    for ( let i = 0; i < prmarr.length; i++) {
        let tmparr = prmarr[i].split("=")
        params[tmparr[0]] = tmparr[1]
    }
    return params
}

let getParams = () => {
      let prmstr = window.location.search.substr(1)
      debug('paramStr:' + window.location.search)
      return prmstr !== null && prmstr !== "" ? transformToAssocArray(prmstr) : {}
}

function isWeixinBrowser() {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
}

function isAndroidBrowser() {
  return /android/.test(navigator.userAgent.toLowerCase())
}

function isMobileBrowser() {
  return typeof window.orientation !== 'undefined'
}

function isSafari () {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

function randomString (length) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
}

function loading (comp) {
  comp.$dispatch('loading', true)
}

function loaded (comp) {
  comp.$dispatch('loading', false)
}

function getLang () {
 if (navigator.languages != undefined)
  return navigator.languages[0]
 else
  return navigator.language
}

function timeGap (ts) {
  let text = moment.tz(ts, "YYYY-MM-DD hh:mm::ss", 'Asia/Shanghai').fromNow()
  if (text) {
    text = text.replace(/[\u5185]/g, '后')
    text = text.replace(' ', '')
  }
  return text
}

function timeDuration (ts) {
  let text = moment.tz(ts, "YYYY-MM-DD hh:mm::ss", 'Asia/Shanghai').fromNow(true)
  if (text) {
    text = text.replace(' ', '')
  }
  return text
}

function isDebug () {
  return process.env.NODE_ENV !== 'production'
}

let getKeys = function(obj){
   let keys = []
   for(let key in obj){
      keys.push(key)
   }
   return keys
}

function statusText (status) {
  switch (status) {
    case 1:
      return '编辑中'
    case 5:
      return '审核中'
    case 10:
      return '报名中'
    case 20:
      return '直播中'
    case 25:
      return '转码中'
    case 30:
      return '已结束'
    case 35:
      return '已结束'
  }
  return '未知'
}

function initTitle() {
  document.title = '趣直播 - 知识直播平台'
}

function defaultUser() {
  return {
    userId: 0,
    username: '系统',
    avatarUrl: 'https://i.quzhiboapp.com/defaultAvatar1.png'
  }
}

function shareLink(liveId) {
  let extraParam = ''
  let fromUserId = window.localStorage.getItem('fromUserId')
  if (fromUserId) {
    extraParam += '&fromUserId=' + fromUserId
  }
  return 'http://m.quzhiboapp.com/?liveId=' + liveId + extraParam
}

function randInt(n) {
  return Math.floor(Math.random() * n)
}

function curUser(defaultValue) {
  let userStr = window.localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  } else {
    return defaultValue
  }
}

function saveCurUser(user) {
  if (user && user.username) {
    debug('save curUser')
    window.localStorage.setItem('user', JSON.stringify(user))
    return true
  } else {
    return false
  }
}

function removeCurUser(comp) {
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('fromUser')
}

function checkInSession(comp) {
  let user = curUser()
  if (user && user.username) {
    return true
  } else {
    comp.$dispatch('loginOrRegister', 0)
    return false
  }
}

exports.getParams = getParams
exports.show = show
exports.showError = showError
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
exports.shareLink = shareLink
exports.randInt = randInt
exports.isMobileBrowser = isMobileBrowser
exports.isSafari = isSafari
exports.curUser = curUser
exports.saveCurUser = saveCurUser
exports.checkInSession = checkInSession
exports.removeCurUser = removeCurUser
