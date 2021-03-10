<template>
  <el-upload
    :headers="headers"
    :action="type === 'img' ? image : video"
    :show-file-list="false"
    :on-error="uploadError"
    :on-progress="uploadProgress"
    :on-success="uploadSuccess"
    :before-upload="beforeAvatarUpload"
    class="upload-box"
    drag
  >
    <div v-if="uploading" class="uploading">
      <span class="el-upload__text">上传中……{{ percent }}%</span>
    </div>
    <div v-else class="tips">
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </div>
  </el-upload>
</template>

<style lang="scss" scoped>
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

<script>
import { getToken } from '@/utils/auth'

export default {
  props: {
    type: {
      type: String,
      default() {
        return 'img'
      }
    }
  },
  data: () => ({
    headers: {
      Authorization: getToken()
    },
    image: `${process.env.VUE_APP_BASE_API}/common/upload/image`,
    video: `${process.env.VUE_APP_BASE_API}/common/upload/video`,
    uploading: false,
    percent: 0
  }),
  methods: {
    uploadError(err) {
      console.warn(err)
      this.$message({
        type: 'error',
        message: err.message
      })
    },
    uploadSuccess(data, file, fileList) {
      console.log(data.data)
      try {
        this.$emit('upload-success', data.data)
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
    beforeAvatarUpload(file) {
      this.uploading = true
    }
  }
}
</script>
