import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: '/articles',
      method: 'get',
      params
    })
  },
  create(param) {
    const { ...data } = param
    return request({
      url: '/articles',
      method: 'post',
      data
    })
  },
  update(param) {
    const { id, ...data } = param
    return request({
      url: `/articles/${id}`,
      method: 'put',
      data
    })
  },
  show(param) {
    const { id } = param
    return request({
      url: `/articles/${id}`,
      method: 'get'
    })
  },
  status(param) {
    const { id } = param
    return request({
      url: `/articles/${id}/status`,
      method: 'get'
    })
  },
  getArticleConfs() {
    return request({
      url: `/article/confs`,
      method: 'get'
    })
  },
  setArticleConfs(data) {
    return request({
      url: '/article/confs',
      method: 'post',
      data
    })
  }
}

