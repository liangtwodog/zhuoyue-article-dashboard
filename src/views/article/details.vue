<template>
  <div v-loading="pageLoading" class="app-container" element-loading-text="给我一点时间">
    <el-form ref="form" class="content" :model="form" label-width="80px" :rules="rules">
      <div class="left">
        <el-form-item label="封面" prop="img">
          <upload-img v-model="form" :model-key="'img'" :name="'goodsImage'" :width="'100px'" :height="'auto'" />
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input v-model.trim="form.title" style="width: 250px" rows="4" type="textarea" class="input" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="form.sort" style="width: 250px" type="number" class="input" placeholder="请输入文章排序" />
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item label="内容" prop="content">
          <tinymceEditor v-model="form.content" :height="300" />
        </el-form-item>
      </div>
    </el-form>
    <div class="btnGroup">
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/article/list'
export default {
  components: {
    tinymceEditor: () => import('@/components/tinymce-editor'),
    uploadImg: () => import('@/components/Upload')
  },
  data() {
    return {
      pageLoading: false,
      form: {
        img: '',
        title: '',
        sort: 0,
        content: ''
      },
      rules: {
        img: [
          {
            required: true, message: '请选择封面图', trigger: 'change'
          }
        ],
        title: [
          {
            required: true, message: '请输入文章标题', trigger: 'change'
          }
        ],
        sort: [
          {
            required: true, message: '请输入文章排序', trigger: 'change'
          }
        ],
        content: [
          {
            required: true, message: '请输入文章内容', trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.params.id !== 'new') {
      this.getDetails()
    }
  },
  methods: {
    async getDetails() {
      const response = await requestApi.show({ id: this.$route.params.id })
      this.form = response
    },
    async onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          console.log(this.form)
          this.pageLoading = true
          if (this.$route.params.id !== 'new') {
            try {
              await requestApi.update()
              this.getDetails()
              this.$message.success('更新成功')
              this.pageLoading = false
            } catch (err) {
              console.log(err)
              this.pageLoading = false
            }
          } else {
            try {
              await requestApi.create()
              this.$message.success('创建成功')
              this.pageLoading = false
              this.$router.push('/article/index')
            } catch (err) {
              console.log(err)
              this.pageLoading = false
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
  .content {
    display: flex;
  }
  .btnGroup {
    display: flex;
    align-content: center;
    justify-content: center;
  }
}
</style>

