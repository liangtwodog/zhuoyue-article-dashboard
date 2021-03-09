import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: '/admin/user/list',
      method: 'get',
      params
    })
  },
  getExcel(params) {
    return request({
      url: `/admin/user/list/export`,
      method: 'get',
      params,
      responseType: 'blob',
      timeout: 1000 * 60 * 5
    })
  }
}

