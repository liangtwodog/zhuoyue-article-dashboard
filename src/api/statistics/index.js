import request from '@/utils/request'

export default {
  // 获取统计数据
  getAllData(data) {
    return request({
      url: `/admin/dataStatistics/get`,
      method: 'post',
      data
    })
  },
  // 获取分销商列表
  getDistributorList(data) {
    return request({
      url: `/admin/dataStatistics/get`,
      method: 'post',
      data
    })
  },
  // 获取商品列表
  getGoodsList(data) {
    return request({
      url: `/admin/dataStatistics/get`,
      method: 'post',
      data
    })
  },
  // 获取会员列表
  getMemberList(data) {
    return request({
      url: `/admin/dataStatistics/get`,
      method: 'post',
      data
    })
  },
  // 获取图表数据
  getLineData(data) {
    return request({
      url: `/admin/dataStatistics/get`,
      method: 'post',
      data
    })
  }
}
