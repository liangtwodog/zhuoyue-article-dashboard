<template>
  <div class="app-container dashboard">
    <div class="titleDiv">
      数据看板
    </div>
    <div class="headerDiv">
      <div class="item">
        <div class="title">用户总数</div>
        <div class="nb">{{ allData[1].value }}</div>
      </div>
      <div class="item">
        <div class="title">授权手机号用户总数</div>
        <div class="nb">{{ allData[0].value }}</div>
      </div>
      <div class="item">
        <div class="title">文章浏览人数</div>
        <div class="nb">{{ allData[2].value }}</div>
      </div>
      <div class="item">
        <div class="title">文章浏览次数</div>
        <div class="nb">{{ allData[3].value }}</div>
      </div>
      <div class="item">
        <div class="title">文章平均浏览时常</div>
        <div class="nb">{{ allData[3].value }}</div>
      </div>
    </div>
    <div class="lineData">
      <el-date-picker
        v-model="time"
        class="timeInput"
        align="center"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        @change="changePicker"
      />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="访问用户数" name="first">
          <visitUser ref="visitUser" />
        </el-tab-pane>
        <el-tab-pane label="新增用户数" name="second">
          <addUsers ref="addUsers" />
        </el-tab-pane>
        <el-tab-pane label="用户总数" name="third">
          <users ref="users" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="tableDiv">
      <div class="leftDiv">
        <div class="table">
          <div class="headerDiv">
            <div class="title">文章浏览TOP10</div>
            <div class="btnGroup">
              <el-button
                size="mini"
                class="btn"
                :type="browseActive === 1 ? 'primary' : 'info'"
                @click="browseActiveFu(1)"
              >浏览人数</el-button>
              <el-button
                size="mini"
                class="btn"
                :type="browseActive === 2 ? 'primary' : 'info'"
                @click="browseActiveFu(2)"
              >浏览次数</el-button>
            </div>
          </div>
          <el-table :data="browsetableData" border>
            <el-table-column label="文章" align="center">
              <template slot-scope="scope">
                <div class="userItem">
                  <div>
                    <img :src="scope.row.headimgurl">
                    <div class="name">
                      {{ scope.row.nickname }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="浏览人数" align="center">
              <template slot-scope="scope">
                {{ scope.row.buyer_total }}
              </template>
            </el-table-column>
            <el-table-column label="浏览次数" align="center">
              <template slot-scope="scope">
                {{ scope.row.order_number }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="rightDiv">
        <div class="table">
          <div class="headerDiv">
            <div class="title">浏览用户TOP10</div>
            <div class="btnGroup">
              <el-button
                size="mini"
                class="btn"
                :type="usersActive === 1 ? 'primary' : 'info'"
                @click="usersActiveFu(1)"
              >浏览文章次数</el-button>
              <el-button
                size="mini"
                class="btn"
                :type="usersActive === 2 ? 'primary' : 'info'"
                @click="usersActiveFu(2)"
              >浏览总时长</el-button>
            </div>
          </div>
          <el-table :data="userstableData" border>
            <el-table-column label="用户" align="center">
              <template slot-scope="scope">
                <div class="userItem">
                  <div>
                    <img :src="scope.row.headimgurl">
                    <div class="name">
                      {{ scope.row.nickname }}
                    </div>
                  </div>
                  <div class="info">
                    <div class="openid">
                      {{ scope.row.nickname }}
                    </div>
                    <div class="phone">
                      {{ scope.row.phone }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="浏览文章次数" align="center">
              <template slot-scope="scope">
                {{ scope.row.buyer_total }}
              </template>
            </el-table-column>
            <el-table-column label="浏览总时长" align="center">
              <template slot-scope="scope">
                {{ scope.row.order_number }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import statisticsApi from '@/api/statistics/index'
export default {
  name: 'Dashboard',
  components: {
    users: () => import('./components/users'),
    addUsers: () => import('./components/addUsers'),
    visitUser: () => import('./components/visitUser')
  },
  data() {
    return {
      activeName: 'first',
      time: '',
      browseActive: 1,
      browsetableData: [],
      usersActive: 1,
      userstableData: [],
      allData: [
        {
          id: 'userConsumeTotal',
          value: 0
        },
        {
          id: 'userTotal',
          value: 0
        },
        {
          id: 'orderNumber',
          value: 0
        },
        {
          id: 'orderSums',
          value: 0
        }
      ]
    }
  },
  async mounted() {
    this.time = [
      moment()
        .subtract(7, 'days')
        .unix() * 1000,
      moment().unix() * 1000
    ]
    for (let i = 0; i < this.allData.length; i++) {
      const data = await statisticsApi.getAllData({ name: this.allData[i].id })
      this.allData[i].value = data.data.total
    }
    await this.distributorActiveFu(this.distributorActive)
    await this.browseActiveFu(this.browseActive)
    await this.usersActiveFu(this.usersActive)
    this.$nextTick(() => {
      this.$refs.member.getNumber(this.time)
    })
  },
  methods: {
    async getGoodsList(title) {
      this.listLoading = true
      await statisticsApi
        .getGoodsList({ name: 'goodsTop', top_number: 5, order_field: title })
        .then(response => {
          this.goodstableData = response.data
        })
      this.listLoading = false
    },
    async getUsersList(title) {
      this.listLoading = true
      await statisticsApi
        .getMemberList({
          name: 'userConsumeTop',
          top_number: 10,
          order_field: title
        })
        .then(response => {
          this.userstableData = response.data
        })
      this.listLoading = false
    },
    handleClick(e) {
      this.activeName = e.name
      switch (this.activeName) {
        case 'first': {
          this.$refs.visitUser.getNumber(this.time)
          break
        }
        case 'second': {
          this.$refs.addUsers.getNumber(this.time)
          break
        }
        case 'third': {
          this.$refs.users.getNumber(this.time)
          break
        }
      }
    },
    changePicker() {
      switch (this.activeName) {
        case 'first': {
          this.$refs.visitUser.getNumber(this.time)
          break
        }
        case 'second': {
          this.$refs.addUsers.getNumber(this.time)
          break
        }
        case 'third': {
          this.$refs.users.getNumber(this.time)
          break
        }
      }
    },
    async usersActiveFu(index) {
      this.usersActive = index
      const title = index === 1 ? 'buyer_total' : 'order_number'
      await this.getUsersList(title)
    },
    async browseActiveFu(index) {
      this.browseActive = index
      const title = index === 1 ? 'goods_salenum' : 'order_amount'
      await this.getGoodsList(title)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  padding: 20px;
  max-width: 1800px;
  .titleDiv {
    color: red;
    font-weight: 500;
    font-size: 26px;
    border-bottom: 1px solid #e9e9eb;
    padding-bottom: 8px;
  }
  .headerDiv {
    display: flex;
    align-items: center;
    height: 200px;
    .item {
      flex: 1;
      text-align: center;
      .title {
        color: #999999;
        font-size: 16px;
      }
      .nb {
        color: black;
        font-size: 30px;
        font-weight: 500;
        margin-top: 10px;
      }
    }
  }
  .lineData {
    position: relative;
    .timeInput {
      position: absolute;
      right: 4px;
      top: 10px;
      z-index: 200;
    }
  }
  .tableDiv {
    display: flex;
    .leftDiv {
      flex: 1;
      padding-right: 10px;
      .table {
        margin-top: 20px;
        background-color: white;
        .headerDiv {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e9e9e9;
          height: 60px;
          margin-bottom: 20px;
          .title {
            color: red;
            font-size: 20px;
          }
          .btnGroup {
            .btn {
              margin-right: 8px;
            }
          }
        }
      }
    }
    .rightDiv {
      flex: 1;
      .table {
        margin-top: 20px;
        background-color: white;
        .headerDiv {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e9e9e9;
          height: 60px;
          margin-bottom: 20px;
          .title {
            color: red;
            font-size: 20px;
          }
          .btnGroup {
            .btn {
              margin-right: 8px;
            }
          }
        }
      }
    }
    .goodsItem {
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        margin-right: 6px;
      }
      .info {
        text-align: left;
        .name {
          color: black;
        }
        .spec {
          color: #999999;
          margin-top: 8px;
        }
      }
    }
    .userItem {
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        margin-right: 6px;
      }
      .info {
        text-align: left;
        .name {
          color: black;
        }
        .phone {
          color: #999999;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.lineData {
  .el-tabs__item {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}
</style>
