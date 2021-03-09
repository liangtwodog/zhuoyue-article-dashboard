// 插入视频
const insertVideoContent = (editor, video_url) => {
  editor.insertContent(`<video class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-frameborder="no" data-mce-p-scrolling="no" data-mce-p-src="${video_url}" data-mce-html="%20" src="${video_url}" controls></video>`)
}
// 插入图片
const insertImageContent = (editor, image_url) => {
  editor.insertContent(`<img src="${image_url}" />`)
}

// 默认的视频 URL 输入窗口
const defaultVideoUrlHandle = (editor, submit) => {
  editor.windowManager.open({
    title: '请输入视频 URL',
    body: [
      { type: 'textbox', name: 'video_url', label: '视频URL' }
    ],
    onsubmit: function(e) {
      submit(e.data.video_url)
    }
  })
}
// 默认的图片 URL 输入窗口
const defaultImageUrlHandle = (editor, submit) => {
  editor.windowManager.open({
    title: '请输入图片 URL',
    body: [{ type: 'textbox', name: 'image_url', label: '图片URL' }],
    onsubmit(e) {
      submit(e.data.image_url)
    }
  })
}

module.exports = function(opt, tinymce = window.tinymce) {
  tinymce.PluginManager.add('better-image-video-plugin', (editor, url) => {
    const {
      videoUrlHandle = defaultVideoUrlHandle,
      imageUrlHandle = defaultImageUrlHandle
    } = opt
    // 插入图片
    editor.ui.registry.addButton('better-image', {
      text: '',
      icon: 'image',
      tooltip: '插入图片',
      context: 'insert',
      onAction: () => imageUrlHandle(editor, image_url => {
        insertImageContent(editor, image_url)
      })
    })

    // 添加按钮
    editor.ui.registry.addButton('better-video', {
      text: '',
      icon: 'embed',
      tooltip: '插入视频',
      context: 'insert',
      onAction: () => videoUrlHandle(editor, video_url => {
        insertVideoContent(editor, video_url)
      })
    })

    return {
      getMetadata: () => ({
        name: 'tinyMCE better image/video plugin'
      })
    }
  })
}
