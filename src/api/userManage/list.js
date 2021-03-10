import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: '/users',
      method: 'get',
      params
    })
  },
  getExcel(params) {
    return request({
      url: `/user/export`,
      method: 'get',
      params,
      responseType: 'blob',
      timeout: 1000 * 60 * 5
    })
  }
}

