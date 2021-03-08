import request from '@/utils/request'

export default class Auth {
  static login(data) {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  }

  static getInfo() {
    return request({
      url: '/auth/info',
      method: 'get'
    })
  }

  static logout() {
    return request({
      url: '/auth/logout',
      method: 'get'
    })
  }
}
