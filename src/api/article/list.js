import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: '/admin/user/list',
      method: 'get',
      params
    })
  },
  create(param) {
    const { ...data } = param
    return request({
      url: '/roles',
      method: 'post',
      data
    })
  },
  update(param) {
    const { id, ...data } = param
    return request({
      url: `/roles/${id}`,
      method: 'put',
      data
    })
  },
  show(param) {
    const { id } = param
    return request({
      url: `/roles/${id}`,
      method: 'get'
    })
  },
  status(param) {
    const { id } = param
    return request({
      url: `/admins/${id}/status`,
      method: 'get'
    })
  }
}

