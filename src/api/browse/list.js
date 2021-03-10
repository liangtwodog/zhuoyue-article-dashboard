import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: '/article/view/logs',
      method: 'get',
      params
    })
  },
  getExcel(params) {
    return request({
      url: `/article/view/log/export`,
      method: 'get',
      params,
      responseType: 'blob',
      timeout: 1000 * 60 * 5
    })
  }
}

