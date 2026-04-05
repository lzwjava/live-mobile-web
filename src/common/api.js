import axios from 'axios'
import { curUser } from './util'

const debug = console.debug

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// Add request interceptor for session token
instance.interceptors.request.use(
  (config) => {
    const user = curUser()
    if (user && user.sessionToken) {
      config.headers['X-Session'] = user.sessionToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    debug('api response:', response.data)
    if (response.data.status === 'success') {
      return response.data.result
    } else {
      return Promise.reject(response.data.error)
    }
  },
  (error) => {
    if (error.response) {
      let errorMsg = error.response.statusText || '网络超时错误'
      // Try to parse error HTML
      if (error.response.data) {
        try {
          const el = document.createElement('html')
          el.innerHTML = error.response.data
          const container = el.querySelector('#container')
          if (container) {
            errorMsg += '\n' + container.innerHTML
          }
        } catch (e) {
          // ignore
        }
      }
      return Promise.reject(errorMsg)
    }
    return Promise.reject('网络超时错误')
  }
)

export const get = (url, params = {}) => instance.get(url, { params })
export const post = (url, data = {}) => instance.post(url, data)

export function fetchLive(liveId) {
  return get(`lives/${liveId}`)
}

export function fetchVideos(liveId) {
  return get(`lives/${liveId}/videos`)
}

export function fetchUsers(liveId, params) {
  return get(`lives/${liveId}/users`, params)
}

export function fetchPartUsers(liveId) {
  return get(`lives/${liveId}/users`, {
    limit: 7
  })
}

export function fetchCurUser() {
  return get('self')
}

export function fetchCurUserNoError() {
  return new Promise((resolve, reject) => {
    get('self')
      .then(data => {
        resolve(data)
      })
      .catch(error => {
        if (error === '当前没有用户登录') {
          resolve({})
        } else {
          reject(error)
        }
      })
  })
}

export function fetchOneUser(userId) {
  return get(`users/${userId}`)
}

export function makeInvitationCard(liveId) {
  return get(`lives/${liveId}/card`)
}

export function saveLiveData(liveId, data, showMessage = true) {
  return new Promise((resolve, reject) => {
    post(`lives/${liveId}`, data)
      .then(() => {
        resolve()
      })
      .catch(reject)
  })
}

export default {
  fetchLive,
  fetchVideos,
  fetchUsers,
  fetchPartUsers,
  fetchCurUser,
  fetchCurUserNoError,
  fetchOneUser,
  makeInvitationCard,
  post,
  get,
  saveLiveData
}
