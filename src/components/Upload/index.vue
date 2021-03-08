<template>
  <el-upload
    :headers="headers"
    :action="action || (uploadType === 'img' ? image : video)"
    :show-file-list="false"
    :on-error="uploadError"
    :on-progress="uploadProgress"
    :on-success="uploadSuccess"
    :before-upload="beforeUpload"
    :name="name"
    :class="uploadType === 'box' ? 'upload-box' : 'avatar-uploader'"
  >
    <div v-if="showType === 'box'">
      <div v-if="uploading" class="uploading">
        <span class="el-upload__text">上传中……{{ percent }}%</span>
      </div>
      <div v-else class="tips">
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
    </div>
    <div v-if="showType === 'img'">
      <div v-if="!uploading">
        <img v-if="form[modelKey]" :style="{ width: width, height: height }" :src="src || (modelType === 'obj' ? form[modelKey].src : form[modelKey])" class="showImg">
        <div v-else class="avatar-uploader-icon">
          <i class="el-icon-plus" />
        </div>
      </div>
      <div v-else class="avatar-uploader-icon">
        <i class="el-icon-loading" />
      </div>
      <p v-if="tips !== ''" class="tips">{{ tips }}</p>
    </div>
  </el-upload>
</template>

<script>
import RecursiveModel from '@/mixins/recursive-model'
import { getToken } from '@/utils/auth'

export default {
  name: 'Upload',
  mixins: [RecursiveModel('form')],
  props: {
    modelType: {
      type: String,
      default: 'obj'
    },
    modelKey: {
      type: String,
      default: '',
      required: true
    },
    name: {
      type: String,
      default: 'upload'
    },
    uploadType: {
      type: String,
      default: 'img'
    },
    showType: {
      type: String,
      default: 'img'
    },
    action: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: 'auto'
    },
    height: {
      type: String,
      default: 'auto'
    }
  },
  data: () => ({
    headers: { Authorization: getToken() },
    src: '',
    image: `${process.env.VUE_APP_BASE_API}/common/upload/image`,
    video: `${process.env.VUE_APP_BASE_API}/common/upload/video`,
    uploading: false,
    percent: 0
  }),
  methods: {
    uploadError(err) {
      const isStr = typeof err === 'string'
      console.warn(err)
      this.$message({
        type: 'error',
        message: isStr ? err : err.message
      })
    },
    uploadSuccess(res, file, fileList) {
      try {
        const { code, error } = res
        if (code === 200) {
          this.src = res.data.src
          this.form[this.modelKey] = this.modelType === 'obj' ? res.data : res.data.src
          this.$emit('upload-success', res.data)
        } else {
          throw error
        }
        this.src = ''
      } catch (err) {
        this.uploadError(err)
      }
    },
    uploadProgress(info) {
      if (info.percent === 100) {
        this.uploading = false
        this.percent = 0
      } else {
        this.percent = Math.floor(info.percent)
      }
    },
    beforeUpload(file) {
      this.uploading = true
    }
  }
}
</script>

<style scoped lang="scss">
  .avatar-uploader{
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
    .showImg{
      display: block;
    }
    .tips{
      font-size: 14px;
      color: #999999;
      margin: 0;
    }
  }
  .upload-box {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    flex-direction: column;
  }
  .uploading {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
  }
</style>
<style lang="scss">
  .el-upload{
    text-align: left;
  }
</style>
