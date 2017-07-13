let debug = require('debug')('api')

import util from './util'

let callback = {
  success: function (resolve, reject) {
    return function (resp) {
      debug('resp:%j', resp.data)
      if (resp.data.status === 'success') {
        resolve(resp.data.result)
      } else {
        reject(resp.data.error)
      }
    }
  },
  failure: function (reject) {
    return function (res) {
      let error = '' + res.statusText
      let el = document.createElement('html')
      el.innerHTML = res.data
      let container = el.querySelector('#container')
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

let get = function (comp, url, params) {
  debug('http GET %j', url)
  return new Promise(
    function (resolve, reject) {
      let addHeader = addHttpHeader()
      comp.$http.get(url, params, addHeader)
      .then(callback.success(resolve, reject),
            callback.failure(reject))
    }
  )
}

let post = function (comp, url, params) {
  debug('http POST %j', url)
  return new Promise(
    function (resolve, reject) {
      let addHeader = addHttpHeader()
      comp.$http.post(url, params, addHeader)
      .then(callback.success(resolve, reject), callback.failure(reject))
    }
  )
}

let addHttpHeader = function () {
  let curUser = util.curUser()
  if (curUser) {
    return { headers: { 'X-Session': curUser.sessionToken } }
  } else {
    return null
  }
}

let fetchLive = function (comp, liveId) {
  return get(comp, `lives/${liveId}`)
}

let fetchVideos = function (comp, liveId) {
  return get(comp, `lives/${liveId}/videos`)
}

let fetchUsers = function (comp, liveId, params) {
  return get(comp, `lives/${liveId}/users`, params)
}

let fetchPartUsers = function (comp, liveId) {
  return get(comp, `lives/${liveId}/users`, {
    limit: 7
  })
}

let fetchCurUser = function (comp) {
  return get(comp, 'self')
}

let fetchCurUserNoError = function (comp) {
  return new Promise(
    function (resolve, reject) {
      get(comp, 'self')
       .then(data => {
         resolve(data)
       }).catch(error => {
         if (error === '当前没有用户登录') {
           debug('not_in_session')
           resolve({})
         } else {
           reject(error)
         }
       })
    }
  )
}

let fetchOneUser = function (comp, userId) {
  return get(comp, `users/${userId}`)
}

let makeInvitationCard = function (comp, liveId) {
  return get(comp, `lives/${liveId}/card`)
}

let saveLiveData = function (comp, liveId, data) {
  return new Promise(
    (resolve, reject) => {
      util.loading(comp)
      post(comp, `lives/${liveId}`, data).then(res => {
        util.loaded(comp)
        resolve()
        util.show(comp, 'success', '保存成功')
      }, util.promiseErrorFn(comp))
    }
  )
}

exports.fetchLive = fetchLive
exports.fetchVideos = fetchVideos
exports.fetchUsers = fetchUsers
exports.fetchPartUsers = fetchPartUsers
exports.fetchCurUser = fetchCurUser
exports.fetchCurUserNoError = fetchCurUserNoError
exports.fetchOneUser = fetchOneUser
exports.makeInvitationCard = makeInvitationCard
exports.post = post
exports.get = get
exports.saveLiveData = saveLiveData
