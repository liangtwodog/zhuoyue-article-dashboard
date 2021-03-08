<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="filter.name" class="filter-item input" placeholder="名称" clearable />
      <el-button class="filter-item btn" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item btn" type="primary" plain @click="clear">清除</el-button>
      <el-button v-permission="['角色管理-创建']" type="primary" icon="el-icon-edit" style="float: right" @click="openFormDialog('create')">新建角色</el-button>
    </div>

    <el-table v-loading="tableLoading" v-permission="['角色管理-列表']" :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="info" label="描述" align="center" />
      <el-table-column label="操作" fixed="right" align="center" width="380px">
        <template slot-scope="scope">
          <el-button v-permission="['角色管理-修改']" size="small" type="primary" @click="openFormDialog('update', scope.row)">编辑</el-button>
          <el-button v-permission="['角色管理-详情']" size="small" type="primary" @click="openPermissionDialog(scope.row)">权限</el-button>
          <el-button v-permission="['角色管理-删除']" size="small" type="danger" @click="destory(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[10,20,50,100]"
      :page-size="pagesize"
      :total="totalCount"
      class="pagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog :visible.sync="form.dialog" :title="dialogNameOpt[form.type]" class="edit-dialog" width="40%" append-to-body>
      <el-form ref="form" :model="form.data" :rules="form.rules" label-width="100px">
        <el-form-item prop="name" label="名称：">
          <el-input v-model="form.data.name" name="name" type="text" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="form.data.info" :autosize="{ minRows: 3, maxRows: 8}" type="textarea" maxlength="120" class="input" />
          <span class="text-num">{{ textNum }}/120</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.dialog = false">取 消</el-button>
        <el-button v-permission="['角色管理-创建', '角色管理-修改']" :loading="form.loading" type="primary" @click="createOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="permissionForm.dialog" title="权限管理" class="edit-dialog" width="40%" append-to-body>
      <ul v-permission="['角色管理-查询所有可分配的权限']" class="allPermissions">
        <li v-for="(permission, moduleName) in permissionForm.data.allPermissions" :key="moduleName" class="item">
          <el-checkbox-group v-model="permissionForm.data.permission_module_name">
            <div class="module-box">
              <el-checkbox
                class="module"
                :label="moduleName"
                :indeterminate="permissionForm.data.halfPermissions.includes(moduleName)"
                @change="moduleCheck($event, permission, moduleName)"
              />
            </div>
          </el-checkbox-group>
          <div style="padding-top: 20px">
            <span v-for="(item, key) in permission" :key="key" style="margin-bottom: 5px;margin-left: 20px">
              <el-checkbox
                :label="item.name"
                :value="permissionForm.data.permission_module_ids.indexOf(item.id) > -1"
                @change="singleCheck(item.id, permission, moduleName)"
              />
            </span>
          </div>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionForm.dialog = false">取 消</el-button>
        <el-button v-permission="['角色管理-分配权限']" :loading="permissionForm.loading" type="primary" @click="updatePermission">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Role from '@/api/system/role'

const getDefaultFilter = () => {
  return {
    name: ''
  }
}

const getDefaultFormData = () => {
  return {
    name: '',
    info: ''
  }
}

export default {
  data() {
    return {
      page: 1,
      pagesize: 10,
      totalCount: 0,
      tableData: [],
      filter: getDefaultFilter(),
      tableLoading: false,
      dialogNameOpt: {
        create: '新建',
        update: '修改'
      },
      form: {
        type: '',
        data: getDefaultFormData(),
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入商户名称' }]
        },
        dialog: false,
        loading: false
      },
      permissionForm: {
        data: {
          role_id: '', // 角色id
          allPermissions: {}, // 所有分组权限
          halfPermissions: [], // 该分类下的权限没有全选中
          permission_module_ids: [], // 权限组 集合 id
          permission_module_name: [] // 权限组 module name
        },
        dialog: false,
        loading: false
      }
    }
  },
  computed: {
    textNum: function() {
      return this.form.data.info ? this.form.data.info.length : 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      this.tableLoading = true
      const requestData = {
        page: this.page,
        pagesize: this.pagesize,
        ...this.filter
      }
      const res = await Role.index(requestData)
      const { code, data } = res
      this.tableLoading = false
      if (code === 200) {
        this.tableData = data.rows
        this.totalCount = data.count
      }
    },
    // 修改每页显示个数
    handleSizeChange(val) {
      this.pagesize = val
      this.getList()
    },
    // 修改页码
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    // 搜索
    search() { // 搜索
      this.page = 1
      this.getList()
    },
    // 清空
    clear() {
      this.page = 1
      this.filter = getDefaultFilter()
      this.getList()
    },
    // 打开编辑窗口
    openFormDialog(type, row) {
      this.form.type = type
      if (this.$refs.form) { // 初次打开dialog,没有ref
        this.$refs.form.resetFields()
      }
      if (type === 'create') {
        this.form.data = getDefaultFormData()
      } else if (type === 'update') {
        row.status = parseInt(row.status)
        this.form.data = Object.assign({}, row)
      }
      this.form.dialog = true
    },
    // 创建&修改
    createOrUpdate() {
      this.$refs.form.validate(async(validate) => {
        if (validate) {
          this.form.loading = true
          const data = this.form.data
          const res = await Role[this.form.type](data)
          if (res.code === 200) {
            this.getList()
            this.$message.success('操作成功')
            this.form.dialog = false
            this.$refs.form.resetFields()
          }
          this.form.loading = false
        } else {
          return false
        }
      })
    },
    // 删除
    destory(row) {
      const that = this
      this.$confirm('此操作将永久删除, 是否继续?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async() => {
        const res = await Role.destory(row)
        if (res.code === 200) {
          that.getList()
          that.$message.success('操作成功')
        }
      })
    },
    // 打开权限窗口
    async openPermissionDialog(row) {
      this.permissionForm.data.halfPermissions = []
      this.permissionForm.data.permission_module_ids = []
      this.permissionForm.data.permission_module_name = []
      this.permissionForm.dialog = true
      this.permissionForm.data.role_id = row.id
      if (Object.keys(this.permissionForm.data.allPermissions).length === 0) {
        const res = await Role.getAllPermission()
        if (res.code === 200) {
          const newAllPermissions = {}
          res.data.forEach(v => {
            // 每个module拥有权限个数
            if (!newAllPermissions[v.title]) {
              newAllPermissions[v.title] = v.permission
            }
          })
          this.permissionForm.data.allPermissions = newAllPermissions
        }
      }
      const res = await Role.show(row)
      if (res.code === 200) {
        let temp = []
        const cache = {}
        res.data.permissions.forEach(v => {
          this.permissionForm.data.permission_module_ids.push(v.id)
          temp.push(v.module)
          // 每个module拥有权限个数
          if (!cache[v.module]) {
            cache[v.module] = 1
          } else {
            cache[v.module]++
          }
        })
        temp = Array.from(new Set(temp))
        // 半选
        temp.forEach(item => {
          if (this.permissionForm.data.allPermissions[item].length !== cache[item]) {
            this.permissionForm.data.halfPermissions.push(item)
          }
        })
        this.permissionForm.data.permission_module_name = Array.from(new Set(temp))
      }
    },
    // 更新权限
    async updatePermission() {
      this.permissionForm.loading = true
      const data = {
        id: this.permissionForm.data.role_id,
        permission_ids: this.permissionForm.data.permission_module_ids
      }
      const res = await Role.updatePermission(data)
      if (res.code === 200) {
        this.getList()
        this.$message.success('操作成功')
        this.permissionForm.dialog = false
      }
      this.permissionForm.loading = false
    },
    // 批量选中
    moduleCheck(checked, ids, moduleName) {
      const _ids = ids.map(item => item.id)
      if (checked) {
        this.permissionForm.data.permission_module_ids = Array.from(new Set(this.permissionForm.data.permission_module_ids.concat(_ids)))
        this.permissionForm.data.permission_module_name.push(moduleName)
      } else {
        this.permissionForm.data.permission_module_ids = this.permissionForm.data.permission_module_ids.filter(v => !_ids.includes(v))
        this.permissionForm.data.permission_module_name = this.permissionForm.data.permission_module_name.filter(v => v !== moduleName)
      }
      this.permissionForm.data.halfPermissions = this.permissionForm.data.halfPermissions.filter(v => v !== moduleName)
    },
    // 单选
    singleCheck(id, permission, moduleName) {
      const _ids = permission.map(item => item.id)
      let count = 0
      const index = this.permissionForm.data.permission_module_ids.indexOf(id)
      if (index === -1) {
        this.permissionForm.data.permission_module_ids.push(id)
      } else {
        this.permissionForm.data.permission_module_ids.splice(index, 1)
      }
      _ids.forEach(item => {
        if (this.permissionForm.data.permission_module_ids.indexOf(item) > -1) {
          count++
        }
        // 全选状态
        if (_ids.length === count) {
          this.permissionForm.data.permission_module_name.push(moduleName)
          this.permissionForm.data.halfPermissions = this.permissionForm.data.halfPermissions.filter(v => v !== moduleName)
        } else if (count === 0) {
          // 未选中状态
          this.permissionForm.data.permission_module_name = this.permissionForm.data.permission_module_name.filter(v => v !== moduleName)
          this.permissionForm.data.halfPermissions = this.permissionForm.data.halfPermissions.filter(v => v !== moduleName)
        } else {
          // 半选状态
          this.permissionForm.data.permission_module_name = this.permissionForm.data.permission_module_name.filter(v => v !== moduleName)
          this.permissionForm.data.halfPermissions.push(moduleName)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  .filter-container {
    margin-bottom: 20px;
    vertical-align: middle;
    .input{
      max-width: 200px;
    }
    .btn{
      min-width: 100px;
    }
    .filter-item+.filter-item{
      margin-left: 20px;
    }
  }
  .pagination-container {
    margin-top: 20px;
  }
  .edit-dialog{
    .input{
      width: 330px;
    }
    .text-num{
      position: absolute;
      left: 285px;
      bottom: 10px;
      color: #999;
      line-height: initial;
    }
  }
  .pagination{
    text-align: right;
    margin-top: 30px;
  }
}
.allPermissions {
  color: red;
  list-style-type: none;
  padding-left: 20px;
  margin: 0;
  li {
    margin-bottom: 20px;
    .title {
      color: #333333;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
    }
  }
}
</style>

