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
      reject(res.statusText)
    }
  }
}

var fetchLive = (comp, liveId) => {
  var promise = new Promise(
    function(resolve, reject) {
      comp.$http.get('lives/' + liveId)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
  return promise
}

var fetchUsers = (comp, liveId) => {
  return new Promise(
    function(resolve, reject) {
      comp.$http.get('lives/' + liveId +'/users')
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

var fetchCurUser = (comp) => {
  return new Promise(function(resolve, reject) {
        comp.$http.get('self')
        .then(callback.success(resolve, reject),
              callback.failure(reject))
  });
}

var fetchOneUser = (comp, userId) => {
  return new Promise(
    function(resolve, reject) {
      comp.$http.get('users/' + userId)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

exports.fetchLive = fetchLive
exports.fetchUsers = fetchUsers
exports.fetchCurUser = fetchCurUser
exports.fetchOneUser = fetchOneUser
