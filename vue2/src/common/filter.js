import moment from 'moment'
moment.locale('zh-cn')

const urlParser = document.createElement('a')

function domain (url) {
  urlParser.href = url
  return urlParser.hostname
}

function fromNow (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

function moneyAsYuan (money) {
  if (!money) {
    return 0
  } else {
    return money / 100.0
  }
}

let formatTime = (time, format) => {
  if (!time) {
    return ''
  }
  if (!format) {
    format = 'll'
  }
  return moment(time).format(format)
}

let formatTimeCommon = (time) => {
  var text = formatTime(time, 'llll')
  text = text.replace('2016年', '')
  text = text.replace('星期', '周')
  return text
}

exports.formatTime = formatTime
exports.formatTimeCommon = formatTimeCommon
exports.domain = domain
exports.moneyAsYuan = moneyAsYuan
exports.fromNow = fromNow
exports.pluralize = pluralize
