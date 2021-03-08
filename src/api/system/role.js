import request from '@/utils/request'

export default class Role {
  static index(param) {
    const { ...params } = param
    return request({
      url: '/roles',
      method: 'get',
      params
    })
  }

  static create(param) {
    const { ...data } = param
    return request({
      url: '/roles',
      method: 'post',
      data
    })
  }

  static update(param) {
    const { id, ...data } = param
    return request({
      url: `/roles/${id}`,
      method: 'put',
      data
    })
  }

  static destory(param) {
    const { id } = param
    return request({
      url: `/roles/${id}`,
      method: 'delete'
    })
  }

  static show(param) {
    const { id } = param
    return request({
      url: `/roles/${id}`,
      method: 'get'
    })
  }

  static getAllPermission() {
    return request({
      url: '/role/permission',
      method: 'get'
    })
  }

  static updatePermission(param) {
    const { id, ...data } = param
    return request({
      url: `/roles/${id}/permission`,
      method: 'post',
      data
    })
  }
}
