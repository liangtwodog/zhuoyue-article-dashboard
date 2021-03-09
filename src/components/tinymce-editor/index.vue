<template>
  <div class="tinymce-editor">
    <editor
      v-model="content"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    />
    <drag-frame ref="dragFrame" />
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import recursiveModel from '@/mixins/recursive-model'
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import 'tinymce/icons/default' //
import beterVideoPlugin from './tinymce-better-image-video-plugin'
import DragFrame from './drag-frame'
export default {
  components: {
    Editor,
    DragFrame
  },
  mixins: [recursiveModel('content')],
  props: {
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: window.location.origin + window.location.pathname
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table wordcount better-image-video-plugin'
    },
    toolbar: {
      type: [String, Array],
      default: `undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | better-image better-video table | removeformat`
    }
  },
  data(ctx) {
    beterVideoPlugin({
      video_button_icon: `${this.baseUrl}/tinymce/video.svg`,
      videoUrlHandle(editor, submit) {
        ctx.$emit('request-video-url', submit)
      },
      imageUrlHandle(editor, submit) {
        ctx.$emit('request-image-url', submit)
      }
    })
    return {
      init: {
        language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
        content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
        // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        }
      }
    }
  },
  mounted() {
    const submitHandle = submit => {
      this.$refs.dragFrame.prompt('img').then(submit)
    }
    const submitHandle1 = submit => {
      this.$refs.dragFrame.prompt('video').then(submit)
    }
    this.$on('request-image-url', submitHandle)
    this.$on('request-video-url', submitHandle1)
    tinymce.init({})
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.content = ''
    }
  }
}
</script>
