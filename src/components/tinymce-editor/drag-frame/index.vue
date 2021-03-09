<template>
  <div v-show="display" class="drag-frame">
    <div class="drag-body">
      <close-button @click.native="hide" />
      <upload-box :type="uploadType" @upload-success="uploadSuccess" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .drag-frame {
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;

    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .182);

    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    flex-direction: column;
  }
  .drag-body {
    position: relative;
    padding: 1.5em;

    background: white;
    border-radius: 3px;
    box-shadow: 0px 2px 6px #999;
  }
</style>

<script>
import CloseButton from './close-button'
import UploadBox from './upload-box'
export default {
  components: {
    CloseButton,
    UploadBox
  },
  data: () => ({
    display: false,
    uploadType: 'img',
    url: ''
  }),
  methods: {
    show() { this.display = true },
    hide() { this.display = false },

    prompt(type) {
      this.uploadType = type
      this.show()
      return new Promise((resolve, reject) => {
        this.$once('upload-success', file_url => {
          this.hide()
          resolve(file_url)
        })
      })
    },

    uploadSuccess(data) {
      this.$emit('upload-success', data.src)
    }
  }
}
</script>
