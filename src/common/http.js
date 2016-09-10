var util = require('./util')
var debug = require('debug')('http')

var callback = {
  success: (resolve,reject) => {
    return (resp) => {
      if (resp.data.status == 'success') {
        resolve(resp.data.result)
      } else {
        reject(resp.data.error)
      }
    }
  },
  failure: (reject) => {
    return (res) => {
      var error = res.statusText
      if (!error) {
        error = '网络超时错误'
      }
      reject(error)
    }
  }
}

var get = (comp, url, params) => {
  return new Promise(
    function(resolve, reject) {
      comp.$http.get(url, params)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

var post = (comp, url, params) => {
  return new Promise(
    function(resolve, reject) {
      comp.$http.post(url, params)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

var fetchLive = (comp, liveId) => {
  return get(comp, 'lives/' + liveId)
}

var fetchUsers = (comp, liveId) => {
  return get(comp, 'lives/' + liveId +'/users')
}

var fetchCurUser = (comp) => {
  return get(comp, 'self')
}

var fetchOneUser = (comp, userId) => {
  return get(comp, 'users/' + userId)
}

exports.fetchLive = fetchLive
exports.fetchUsers = fetchUsers
exports.fetchCurUser = fetchCurUser
exports.fetchOneUser = fetchOneUser
exports.post = post
exports.get = get
