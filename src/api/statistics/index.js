import request from '@/utils/request'

export default {
  // 获取统计数据
  getAllData() {
    return request({
      url: `/statistic/total`,
      method: 'get'
    })
  },
  // 获取文章浏览列表
  getArticleViewList(params) {
    return request({
      url: `/statistic/top/view`,
      method: 'get',
      params
    })
  },
  // 获取浏览用户列表
  getUserViewList(params) {
    return request({
      url: `/statistic/top/user`,
      method: 'get',
      params
    })
  },
  // 获取新用户图表数据
  getNewUserLineData(params) {
    return request({
      url: `/statistic/user/new`,
      method: 'get',
      params
    })
  },
  // 获取用户总数图表数据
  getUserTotalLineData(params) {
    return request({
      url: `/statistic/user/total`,
      method: 'get',
      params
    })
  },
  // 获取访问用户数图表数据
  getUserViewLineData(params) {
    return request({
      url: `/statistic/uv`,
      method: 'get',
      params
    })
  }
}
