import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const _axios = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
_axios.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['Authorization'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
_axios.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    let res = response.data
    const req = res
    const isBlob = response.config && response.config.responseType === 'blob'
    if (isBlob) {
      if (res.type === 'application/json') {
        res = await Promise.all((resolve) => {
          const reader = new FileReader()
          reader.onload = e => resolve(JSON.parse(e.target.result))
          reader.readAsText(req, 'utf-8')
        })
      } else {
        res = {
          code: 200,
          data: req
        }
      }
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Vue.prototype.$message({
        message: res.error || '系统繁忙，请稍后重试',
        type: 'error'
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 40101 || res.code === 40102) {
        // to re-login
        setTimeout(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }, 1500)
      }
    }
    return res
  },
  error => {
    if (!error.response) {
      Vue.prototype.$notify({
        title: 'Network Error',
        dangerouslyUseHTMLString: true,
        message: '<strong class="my-notify">请检查 API 是否异常</strong>'
      })
      console.log('error', error)
    }

    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Vue.prototype.$message({
        type: 'warning',
        message: '请求超时'
      })
    }
    return Promise.reject(error)
  }
)

export default _axios
