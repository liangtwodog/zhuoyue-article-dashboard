import request from '@/utils/request'

export default class Admin {
  static index(param) {
    const { ...params } = param
    return request({
      url: `/admins`,
      method: 'get',
      params
    })
  }

  static create(param) {
    const { ...data } = param
    return request({
      url: '/admins',
      method: 'post',
      data
    })
  }

  static update(param) {
    const { id, ...data } = param
    return request({
      url: `/admins/${id}`,
      method: 'put',
      data
    })
  }

  static destory(param) {
    const { id } = param
    return request({
      url: `/admins/${id}`,
      method: 'delete'
    })
  }

  static show(param) {
    const { id } = param
    return request({
      url: `/admins/${id}`,
      method: 'get'
    })
  }

  static status(param) {
    const { id } = param
    return request({
      url: `/admins/${id}/status`,
      method: 'get'
    })
  }

  static getRoleList() {
    return request({
      url: '/admin/roles',
      method: 'get'
    })
  }

  static resetPwd(param) {
    const { id, ...data } = param
    return request({
      url: `/admins/${id}/pwd`,
      method: 'post',
      data
    })
  }
}
