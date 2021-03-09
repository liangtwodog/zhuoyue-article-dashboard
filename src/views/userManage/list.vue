<template>
  <div v-loading="listLoading" class="app-container bannerList" element-loading-text="给我一点时间">
    <div class="filter-container">
      <el-input v-model="search.nickname" class="filter-item filter-input" clearable placeholder="openid" />
      <el-input v-model="search.phone" class="filter-item filter-input" clearable placeholder="手机号" />
      <el-input v-model="search.phone" class="filter-item filter-input" clearable placeholder="来源用户" />
      <el-date-picker
        v-model="search.time"
        class="filter-item"
        type="datetimerange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="来源开始时间"
        end-placeholder="来源结束时间"
      />
      <el-input v-model="search.nickname" class="filter-item filter-input" clearable placeholder="ip所在地区" />
      <el-date-picker
        v-model="search.time"
        class="filter-item"
        type="datetimerange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="创建开始时间"
        end-placeholder="创建结束时间"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      <el-button class="filter-item" type="info" @click="resetData">重置</el-button>
      <el-button class="filter-item" type="primary" @click="getExcel">导出Excel</el-button>
    </div>
    <div class="bodyContent">
      <el-table ref="eltable" :data="tableData" border style="width: 100%">
        <el-table-column prop="openid" label="openid" align="center" />
        <el-table-column prop="nickname" label="昵称" align="center" />
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" style="width: 60px;max-height: 300px">
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="phone" label="来源用户" align="center" />
        <el-table-column label="来源时间" align="center">
          <template slot-scope="scope">
            {{ setTime(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="文章浏览次数" align="center" />
        <el-table-column prop="phone" label="文章浏览时长" align="center" />
        <el-table-column label="ip所在地区" align="center">
          <template slot-scope="scope">
            {{ scope.row.province }}-{{ scope.row.city }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ setTime(scope.row.created_at) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100, 1000]" :page-size="pagination.pageSize" :total="pagination.total" class="pagination-container" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/userManage/list'
import moment from 'moment'
export default {
  data() {
    return {
      search: {
        phone: '',
        relation_salesman_name: '',
        time: '',
        nickname: ''
      },
      listLoading: false,
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    setTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:SS')
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    },
    searchData() {
      this.pagination = {
        currentPage: 1,
        pageSize: this.pagination.pageSize,
        total: 0
      }
      this.fetchData()
    },
    resetData() {
      this.search = {
        phone: '',
        relation_salesman_name: '',
        time: '',
        nickname: ''
      }
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const requestData = {
        page: this.pagination.currentPage,
        pagesize: this.pagination.pageSize,
        phone: this.search.phone,
        relation_salesman_name: this.search.relation_salesman_name,
        nickname: this.search.nickname
      }
      if (this.search.time.length === 2) {
        requestData.start_time = moment(this.search.time[0]).unix()
        requestData.end_time = moment(this.search.time[1]).unix()
      }
      requestApi.getList(requestData).then(response => {
        const data = response.data
        this.tableData = data.rows
        this.pagination.total = data.count
        this.$nextTick(() => {
          this.$refs.eltable.doLayout()
        })
      })
      this.listLoading = false
    },
    async getExcel() {
      this.listLoading = true
      const requestData = {
        page: this.pagination.currentPage,
        pagesize: this.pagination.pageSize,
        phone: this.search.phone,
        relation_salesman_name: this.search.relation_salesman_name,
        nickname: this.search.nickname
      }
      if (this.search.time.length === 2) {
        requestData.start_time = moment(this.search.time[0]).unix()
        requestData.end_time = moment(this.search.time[1]).unix()
      }
      await requestApi.getExcel(requestData).then(res => {
        const blob = new Blob([res.data], { type: 'application/vdn.ms-excel' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.download = '用户数据.xlsx'
        a.href = url
        a.click()
        this.$message.success('导出成功')
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
  // .estateList{}
</style>

