var debug = require('debug')('api')

var callback = {
  success: function (resolve,reject) {
    return function (resp) {
      debug('resp:%j', resp.data)
      if (resp.data.status == 'success') {
        resolve(resp.data.result)
      } else {
        reject(resp.data.error)
      }
    }
  },
  failure: function(reject) {
    return function(res) {
      var error = res.statusText
      if (!error) {
        error = '网络超时错误'
      }
      reject(error)
    }
  }
}

var get = function(comp, url, params) {
  return new Promise(
    function(resolve, reject) {
      comp.$http.get(url, params)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

var post = function (comp, url, params) {
  return new Promise(
    function(resolve, reject) {
      comp.$http.post(url, params)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

var fetchLive = function(comp, liveId) {
  return get(comp, 'lives/' + liveId)
}

var fetchUsers = function(comp, liveId) {
  return get(comp, 'lives/' + liveId +'/users')
}

var fetchCurUser = function (comp) {
  return get(comp, 'self')
}

var fetchOneUser = function (comp, userId) {
  return get(comp, 'users/' + userId)
}

exports.fetchLive = fetchLive
exports.fetchUsers = fetchUsers
exports.fetchCurUser = fetchCurUser
exports.fetchOneUser = fetchOneUser
exports.post = post
exports.get = get
