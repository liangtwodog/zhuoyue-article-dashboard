<template>
  <div v-loading="pageLoading" class="app-container bannerList" element-loading-text="给我一点时间">
    <div class="filter-container">
      <div class="articleConfig">
        <div class="infoBtn">
          <div class="title">文章全遮</div>
          <el-switch
            v-model.number="articleConfig.shade_type"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            @change="setArticleConfs"
          />
        </div>
        <div class="infoBtn">
          <div class="title">公众号信息授权</div>
          <el-switch
            v-model.number="articleConfig.info_auth"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            @change="setArticleConfs"
          />
        </div>
      </div>
      <el-button class="filter-item" type="primary" @click="$router.push('/article/details/new')">添加文章</el-button>
    </div>
    <div class="bodyContent">
      <el-table ref="eltable" :data="tableData" border style="width: 100%">
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover.thumb" style="width: 60px;">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" />
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column label="上下架" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              @change="setStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100, 1000]" :page-size="pagination.pageSize" :total="pagination.total" class="pagination-container" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/article/list'
export default {
  data() {
    return {
      pageLoading: false,
      infoStatus: 0,
      tableData: [],
      articleConfig: {
        shade_type: 2,
        info_auth: 2
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.fetchData()
    this.getArticleConfs()
  },
  methods: {
    async getArticleConfs() {
      this.pageLoading = true
      try {
        const response = await requestApi.getArticleConfs()
        this.articleConfig = response.data
        this.pageLoading = false
      } catch (err) {
        this.pageLoading = false
      }
    },
    async setArticleConfs() {
      this.pageLoading = true
      const requestData = {
        ...this.articleConfig
      }
      try {
        await requestApi.setArticleConfs(requestData)
        this.$message.success('修改成功')
        this.pageLoading = false
      } catch (err) {
        this.pageLoading = false
      }
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    },
    resetData() {
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.fetchData()
    },
    async fetchData() {
      this.pageLoading = true
      const requestData = {
        page: this.pagination.currentPage,
        pagesize: this.pagination.pageSize
      }
      try {
        const response = await requestApi.getList(requestData)
        const data = response.data
        this.tableData = data.rows
        this.pagination.total = data.count
        this.$nextTick(() => {
          this.$refs.eltable.doLayout()
        })
        this.pageLoading = false
      } catch (err) {
        this.pageLoading = false
      }
    },
    async setStatus(rowsData) {
      const title = rowsData.status === 1 ? '上架' : '下架'
      this.$confirm(`此操作将永久${title}该文章, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pageLoading = true
        requestApi.status({ id: rowsData.id }).then(response => {
          console.log(response.data)
          this.$message({
            message: `${title}成功`,
            type: 'success'
          })
          this.fetchData()
        }).catch(() => {
          this.pageLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${title}`
        })
        rowsData.status = rowsData.status === 1 ? 2 : 1
      })
    },
    edit(id) {
      this.$router.push(`/article/details/${id}`)
      // window.open(`${window.location.origin}${window.location.pathname}#/article/details/${id}`)
    }
  }
}
</script>
<style scoped lang="scss">
  .filter-container{
    display: flex;
    align-content: center;
    justify-content: space-between;
    .articleConfig {
      display: flex;
      align-content: center;
      .infoBtn {
        display: flex;
        align-content: center;
        margin-right: 40px;
        .title {
          font-size: 16px;
          font-weight: 500;
          margin-right: 10px;
        }
      }
    }
  }
</style>

