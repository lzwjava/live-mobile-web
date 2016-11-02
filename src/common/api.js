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
      var error = '' + res.statusText;
      var el = document.createElement('html');
      el.innerHTML = res.data
      var container = el.querySelector('#container')
      if (container) {
        error += '\n' + container.innerHTML
      }
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

var fetchPartUsers = function (comp, liveId) {
  return get(comp, 'lives/' + liveId +'/users', {
    limit: 7
  })
}

var fetchCurUser = function (comp) {
  return get(comp, 'self')
}

var fetchCurUserNoError = function (comp) {
  return new Promise(
    function (resolve, reject) {
      get(comp, 'self')
       .then((data) => {
         resolve(data)
       }).catch((error) => {
         if (error == '当前没有用户登录') {
           debug('not_in_session')
           resolve({})
         } else {
           reject(error)
         }
       })
    }
  )
}

var fetchOneUser = function (comp, userId) {
  return get(comp, 'users/' + userId)
}

exports.fetchLive = fetchLive
exports.fetchUsers = fetchUsers
exports.fetchPartUsers = fetchPartUsers
exports.fetchCurUser = fetchCurUser
exports.fetchCurUserNoError = fetchCurUserNoError
exports.fetchOneUser = fetchOneUser
exports.post = post
exports.get = get
