<template>
  <div v-loading="listLoading" class="app-container" element-loading-text="给我一点时间">
    <div class="filter-container">
      <el-input v-model="search.weapp_openid" class="filter-item filter-input" clearable placeholder="openid" />
      <el-input v-model="search.phone" class="filter-item filter-input" clearable placeholder="手机号" />
      <el-input v-model="search.title" class="filter-item filter-input" clearable placeholder="浏览文章" />
      <el-input v-model="search.view_time" class="filter-item filter-input" clearable placeholder="浏览时长" />
      <el-date-picker
        v-model="search.time"
        class="filter-item"
        type="datetimerange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="进入开始时间"
        end-placeholder="进入结束时间"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      <el-button class="filter-item" type="info" @click="resetData">重置</el-button>
      <el-button class="filter-item" type="primary" @click="getExcel">导出Excel</el-button>
    </div>
    <div class="bodyContent">
      <el-table ref="eltable" :data="tableData" border style="width: 100%">
        <el-table-column prop="user.weapp_openid" label="openid" align="center" />
        <el-table-column prop="user.phone" label="手机号" align="center" />
        <el-table-column prop="article.title" label="浏览文章" align="center" />
        <el-table-column label="浏览时长" align="center">
          <template slot-scope="scope">
            {{ scope.row.view_time }}s
          </template>
        </el-table-column>
        <el-table-column label="进入时间" align="center">
          <template slot-scope="scope">
            {{ setTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="退出时间" align="center">
          <template slot-scope="scope">
            {{ setTime(scope.row.exit_time) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100, 1000]" :page-size="pagination.pageSize" :total="pagination.total" class="pagination-container" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/browse/list'
import moment from 'moment'
export default {
  data() {
    return {
      search: {
        phone: '',
        weapp_openid: '',
        view_time: '',
        time: '',
        title: ''
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
        weapp_openid: '',
        view_time: '',
        time: '',
        title: ''
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
      const { time, ...searchTime } = this.search
      const requestData = {
        page: this.pagination.currentPage,
        pagesize: this.pagination.pageSize,
        ...searchTime
      }
      if (time.length === 2) {
        requestData.start = moment(time[0]).unix()
        requestData.end = moment(time[1]).unix()
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
      const { time, ...searchTime } = this.search
      const requestData = {
        page: this.pagination.currentPage,
        pagesize: this.pagination.pageSize,
        ...searchTime
      }
      if (time.length === 2) {
        requestData.start = moment(time[0]).unix()
        requestData.end = moment(time[1]).unix()
      }
      await requestApi.getExcel(requestData).then(res => {
        const blob = new Blob([res.data], { type: 'application/vdn.ms-excel' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.download = '浏览记录数据.xlsx'
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

