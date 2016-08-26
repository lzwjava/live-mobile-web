var debug = require('debug')('util');

exports.filterError = (component, res) => {
  debug('resp:%j', res.data)
  if (res.data.status != "success") {    
    component.$dispatch('show-msg', 'error', res.data.error)
    return false;
  } else {
    return true;
  }
};

exports.escape = (html) => {
  html = html || '';
  return html
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
};

exports.httpErrorFn = (component) => {
  return function (res) {
    var text = res.statusText
    if (text == '') {
      text = '网络超时错误'
    }
    component.$dispatch('show-msg', 'error', text)
  }
};

exports.show = (component, type, text, duration) => {
  component.$dispatch('show-msg', type, text)
};
