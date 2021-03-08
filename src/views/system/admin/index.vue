<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.username" placeholder="用户名" clearable style="width: 150px;" class="filter-item" />
      <el-input v-model="filter.phone" placeholder="手机号" clearable style="width: 160px;" class="filter-item" />
      <el-select v-model="filter.role_id" v-permission="['管理员管理-角色列表']" clearable placeholder="角色" style="width: 150px;" class="filter-item">
        <el-option v-for="option in roleOptions" :key="option.id" :label="option.name" :value="option.id" />
      </el-select>
      <el-select v-model="filter.status" clearable placeholder="登录权限" style="width: 120px;" class="filter-item">
        <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key" />
      </el-select>
      <el-button type="primary" size="large" icon="el-icon-search" class="filter-item" @click="search">搜索</el-button>
      <el-button type="primary" size="large" plain class="filter-item" @click="clear">清除</el-button>
      <el-button v-permission="['管理员管理-创建']" type="primary" icon="el-icon-edit" style="float: right" @click="openFormDialog('create')">新建</el-button>
    </div>
    <el-table v-loading="tableLoading" v-permission="['管理员管理-列表']" :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="id" align="center" />
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="scope.row.avatar" class="small-pic" style="width: 60px;height: 60px">
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="phone" label="手机号" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="role" label="角色" align="center" />
      <el-table-column label="登录权限" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 1" v-permission="['管理员管理-更改状态']" size="small" type="primary" @click="updateStatus(scope.row)">已启用</el-button>
          <el-button v-else v-permission="['管理员管理-更改状态']" size="small" @click="updateStatus(scope.row)">已停用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="login_time" label="上次登录时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.login_time | formatTime }}
        </template>
      </el-table-column>
      <el-table-column prop="login_num" label="登录次数" align="center" />
      <el-table-column prop="create_time" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_time | formatTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['管理员管理-修改']" size="small" type="primary" @click="openFormDialog('update', scope.row)">编辑</el-button>
          <el-button v-permission="['管理员管理-删除']" size="small" type="danger" @click="destory(scope.row)">删除</el-button>
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

    <!-- 新建弹出框 -->
    <el-dialog :visible.sync="form.dialog" :title="dialogNameOpt[form.type]" :lock-scroll="false" width="40%" style="margin-top: -50px;">
      <el-form ref="form" :rules="form.rules" :model="form.data" label-position="right" label-width="120px" style="height: 500px;overflow: auto">
        <el-form-item prop="avatar" label="头像：">
          <upload v-model="form.data" :model-key="'avatar'" :name="'adminAvatar'" :model-type="'string'" :width="'100px'" :height="'100px'" />
        </el-form-item>
        <el-form-item prop="username" label="用户名：">
          <el-input v-model="form.data.username" style="width: 50%;" name="username" type="text" placeholder="请输入用户名" :disabled="form.type === 'update'" />
        </el-form-item>
        <el-form-item prop="name" label="姓名：">
          <el-input v-model="form.data.name" style="width: 50%;" name="name" type="text" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号：">
          <el-input v-model="form.data.phone" style="width: 50%;" name="phone" type="text" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input v-model="form.data.email" style="width: 50%;" name="email" type="text" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item v-permission="['管理员管理-角色列表']" prop="role_id" label="选择角色：">
          <el-select v-model="form.data.role_id" placeholder="角色" style="width: 50%">
            <el-option v-for="option in roleOptions" :key="option.id" :label="option.name" :value="option.id" />
          </el-select>
        </el-form-item>
        <div v-if="form.type === 'create'">
          <el-form-item prop="password" label="密码：">
            <el-input v-model="form.data.password" style="width: 50%;" name="password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="againPassword" label="再次输入密码：">
            <el-input v-model="form.data.againPassword" style="width: 50%;" name="againPassword" type="password" placeholder="请再次输入密码" />
          </el-form-item>
          <el-form-item prop="status" label="登录权限：">
            <el-switch v-model="form.data.status" :active-value="1" :inactive-value="2" />
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item v-permission="['管理员管理-修改密码']" label="密码：">
            <el-button type="primary" size="small" @click="openPwdFormDialog(form.data)">重置密码</el-button>
          </el-form-item>
          <el-form-item v-permission="['管理员管理-更改状态']" prop="status" label="登录权限：">
            <el-switch v-model="form.data.status" :active-value="1" :inactive-value="2" />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="form.dialog = false">取 消</el-button>
        <el-button v-permission="['管理员管理-创建']" :loading="form.loading" type="primary" @click="createOrUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 重置密码弹出框 -->
    <el-dialog :visible.sync="pwdForm.dialog" width="35%" title="重置密码" append-to-body>
      <el-form ref="pwdForm" :rules="pwdForm.rules" :model="pwdForm.data" label-position="right" label-width="140px">
        <el-form-item prop="password" label="新密码：">
          <el-input v-model="pwdForm.data.password" style="width: 50%;" name="password" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item prop="againPassword" label="再次输入新密码：">
          <el-input v-model="pwdForm.data.againPassword" style="width: 50%;" name="againPassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdForm.dialog = false">取 消</el-button>
        <el-button v-permission="['管理员管理-修改密码']" :loading="pwdForm.loading" type="primary" @click="updatePwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Admin from '@/api/system/admin'
import Upload from '@/components/Upload'
import Pattern from '@/utils/pattern'

const getDefaultFilter = () => {
  return {
    role_id: '',
    status: '',
    username: '',
    phone: ''
  }
}

const getDefaultFormData = () => {
  return {
    avatar: '',
    role_id: '',
    status: 1
  }
}

export default {
  components: { Upload },
  data() {
    const validatePass2 = (rule, value, callback) => {
      const pass = this.pwdForm.dialog === true ? this.pwdForm.data.password : this.form.data.password
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const validateRole = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择角色'))
      } else {
        callback()
      }
    }

    const pwdRules = {
      password: [{ required: true, trigger: 'blur', min: 6, message: '密码至少6位' }],
      againPassword: [{ required: true, trigger: 'blur', validator: validatePass2 }]
    }

    const rules = {
      username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
      name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
      phone: [{ required: true, trigger: 'blur', pattern: Pattern.phone, message: '请输入正确的手机号码' }],
      role_id: [{ required: true, trigger: 'change', validator: validateRole, type: 'array' }],
      ...pwdRules
    }

    return {
      page: 1,
      pagesize: 10,
      totalCount: 0,
      tableData: [],
      filter: getDefaultFilter(),
      tableLoading: false,
      roleOptions: [], // 角色选项
      statusOptions: {
        1: '启用',
        2: '停用'
      },
      dialogNameOpt: {
        create: '新建',
        update: '修改'
      },
      form: {
        type: '',
        data: getDefaultFormData(),
        rules: rules,
        dialog: false,
        loading: false
      },
      pwdForm: {
        data: {},
        rules: pwdRules,
        dialog: false,
        loading: false
      }
    }
  },
  mounted() {
    this.getList()
    this.fetchRoleData()
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
      const res = await Admin.index(requestData)
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
    // 获取角色名称列表
    async fetchRoleData() {
      const res = await Admin.getRoleList()
      if (res.code === 200) this.roleOptions = res.data
    },
    resetFields(refName) {
      this.$nextTick(() => {
        this.$refs[refName].clearValidate()
      })
    },
    // 打开编辑窗口
    openFormDialog(type, row) {
      this.form.type = type
      if (type === 'create') {
        this.form.data = getDefaultFormData()
      } else if (type === 'update') {
        row.status = parseInt(row.status)
        row.role_id = parseInt(row.role_id)
        this.form.data = Object.assign({}, row)
      }
      this.resetFields('form')
      this.form.dialog = true
    },
    // 创建&修改
    createOrUpdate() {
      this.$refs.form.validate(async(validate) => {
        if (validate) {
          this.form.loading = true
          const data = this.form.data
          const res = await Admin[this.form.type](data)
          if (res.code === 200) {
            this.getList()
            this.$message.success('操作成功')
            this.form.dialog = false
            this.resetFields('form')
          }
          this.form.loading = false
        } else {
          return false
        }
      })
    },
    // 删除
    destory(row) {
      this.$confirm(`确认删除吗`, '消息提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: async(action) => {
          if (action === 'confirm') {
            const res = await Admin.destory(row)
            if (res.code === 200) {
              this.getList()
              this.$message.success('操作成功')
            }
          }
        }
      })
    },
    // 登录权限改变
    async updateStatus(row) {
      const res = await Admin.status(row)
      if (res.code === 200) {
        this.getList()
        this.$message.success('操作成功')
      }
    },
    // 打开修改密码窗口
    openPwdFormDialog(row) {
      if (this.$refs.pwdForm) { // 初次打开dialog,没有ref
        this.$refs.pwdForm.resetFields()
      }
      this.pwdForm.dialog = true
      this.pwdForm.data.id = row.id
    },
    // 管理员重置密码
    updatePwd() {
      this.$refs.pwdForm.validate(async(validate) => {
        if (validate) {
          this.pwdForm.loading = true
          const data = this.pwdForm.data
          const res = await Admin.resetPwd(data)
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.pwdForm.dialog = false
          }
          this.pwdForm.loading = false
          this.$refs.pwdForm.resetFields()
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
</style>

