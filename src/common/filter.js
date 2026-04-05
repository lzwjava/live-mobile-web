import moment from 'moment-timezone'
moment.locale('zh-cn')

// Vue 3: These are exported as helper functions instead of Vue filters
// Usage: {{ formatTime(time) }} instead of {{ time | formatTime }}

export function formatTime(time, format) {
  if (!time) {
    return ''
  }
  if (!format) {
    format = 'll'
  }
  return moment(time).format(format)
}

export function formatTimeCommon(time) {
  let text = formatTime(time, 'llll')
  text = text.replace('2016年', '')
  text = text.replace('星期', '周')
  return text
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

// Legacy filter export for compatibility - these won't work in Vue 3
// but are kept for reference
export const filters = {
  formatTime,
  formatTimeCommon,
  fromNow,
  moneyAsYuan,
  statusText
}
