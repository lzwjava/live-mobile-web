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

var fetchPromise = (comp, url) => {
  return new Promise(
    function(resolve, reject) {
      comp.$http.get(url)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

var postPromise = (comp, url, params) => {
  return new Promise(
    function(resolve, reject) {
      comp.$http.post(url, params)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

var fetchLive = (comp, liveId) => {
  return fetchPromise(comp, 'lives/' + liveId)
}

var fetchUsers = (comp, liveId) => {
  return fetchPromise(comp, 'lives/' + liveId +'/users')
}

var fetchCurUser = (comp) => {
  return fetchPromise(comp, 'self')
}

var fetchOneUser = (comp, userId) => {
  return fetchPromise(comp, 'users/' + userId)
}

var createState = (comp, liveId) => {
  return postPromise(comp, 'states', {liveId: liveId})
     .then((data) => {
       return Promise.resolve(data.hash)
     })
}

exports.fetchLive = fetchLive
exports.fetchUsers = fetchUsers
exports.fetchCurUser = fetchCurUser
exports.fetchOneUser = fetchOneUser
exports.createState = createState
