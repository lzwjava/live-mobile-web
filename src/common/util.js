import moment from 'moment-timezone'
import crypto from 'crypto'

moment.locale('zh-cn')

const urlParser = document.createElement('a')

export function domain(url) {
  urlParser.href = url
  return urlParser.hostname
}

export function fromNow(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function moneyAsYuan(money) {
  if (!money) {
    return 0
  } else {
    return money / 100.0
  }
}

export function formatTime(time, format = 'll') {
  if (!time) {
    return ''
  }
  return moment(time).format(format)
}

export function formatTimeCommon(time) {
  let text = formatTime(time, 'llll')
  text = text.replace('2016年', '')
  text = text.replace('星期', '周')
  return text
}

export function fromNowTime(time) {
  return moment(time).fromNow()
}

export function escape(html) {
  html = html || ''
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function show(component, type, text, duration) {
  component.$dispatch('show-msg', type, text)
}

export function showError(component, text) {
  show(component, 'error', text)
}

export function promiseErrorFn(comp, callback) {
  return (error) => {
    show(comp, 'error', error, 3000)
    comp.$dispatch('loading', false)
    callback && callback()
  }
}

export function transformToAssocArray(prmstr) {
  let params = {}
  let prmarr = prmstr.split('&')
  for (let i = 0; i < prmarr.length; i++) {
    let tmparr = prmarr[i].split('=')
    params[tmparr[0]] = tmparr[1]
  }
  return params
}

export function getParams() {
  let prmstr = window.location.search.substr(1)
  return prmstr !== null && prmstr !== '' ? transformToAssocArray(prmstr) : {}
}

export function isWeixinBrowser() {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
}

export function isAndroidBrowser() {
  return /android/.test(navigator.userAgent.toLowerCase())
}

export function isMobileBrowser() {
  return typeof window.orientation !== 'undefined'
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export function randomString(length) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export function loading(comp) {
  comp.$dispatch('loading', true)
}

export function loaded(comp) {
  comp.$dispatch('loading', false)
}

export function getLang() {
  if (navigator.languages !== undefined) {
    return navigator.languages[0]
  } else {
    return navigator.language
  }
}

export function timeGap(ts) {
  let text = moment.tz(ts, 'YYYY-MM-DD hh:mm::ss', 'Asia/Shanghai').fromNow()
  if (text) {
    text = text.replace(/[\u5185]/g, '后')
    text = text.replace(' ', '')
  }
  return text
}

export function timeDuration(ts) {
  let text = moment.tz(ts, 'YYYY-MM-DD hh:mm::ss', 'Asia/Shanghai').fromNow(true)
  if (text) {
    text = text.replace(' ', '')
  }
  return text
}

export function isDebug() {
  return import.meta.env.DEV
}

export function getKeys(obj) {
  let keys = []
  for (let key in obj) {
    keys.push(key)
  }
  return keys
}

export function statusText(status) {
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

export function initTitle() {
  document.title = '趣直播 - 知识直播平台'
}

export function defaultUser() {
  return {
    userId: 0,
    username: '系统',
    avatarUrl: 'https://i.quzhiboapp.com/defaultAvatar1.png'
  }
}

export function shareLink(liveId) {
  let extraParam = ''
  let fromUserId = window.localStorage.getItem('fromUserId')
  if (fromUserId) {
    extraParam += '&fromUserId=' + fromUserId
  }
  return 'http://m.quzhiboapp.com/?liveId=' + liveId + extraParam
}

export function randInt(n) {
  return Math.floor(Math.random() * n)
}

export function curUser(defaultValue) {
  let userStr = window.localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  } else {
    return defaultValue
  }
}

export function saveCurUser(user) {
  if (user && user.username) {
    window.localStorage.setItem('user', JSON.stringify(user))
    return true
  } else {
    return false
  }
}

export function removeCurUser(comp) {
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('fromUser')
}

export function checkInSession(comp) {
  let user = curUser()
  if (user && user.username) {
    return true
  } else {
    comp.$dispatch('loginOrRegister', 0)
    return false
  }
}

export function filterError(component, res) {
  if (res.data.status !== 'success') {
    component.$dispatch('show-msg', 'error', res.data.error)
    return false
  } else {
    return true
  }
}

export function httpErrorFn(component) {
  return function (res) {
    let text = res.statusText
    if (text === '') {
      text = '网络超时错误'
    }
    component.$dispatch('show-msg', 'error', text)
  }
}

// Aliases used by wechat.js (note: old code used 'qzb.user' key, these use 'user')
export const loadUser = curUser
export const setUser = saveCurUser
