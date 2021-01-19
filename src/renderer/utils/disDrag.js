
// 全局监听drag和drop事件，当用户拖入一个文件但是又不是拖入可拖拽区域的时候，将其屏蔽掉
// 避免electron应用像浏览器那样，拖入pdf或图片会自动打开
// 将此js通过mixin引入APP.vue中
// import disDrag from './utils/disDrag.js'
// mixins: [disDrag],

export default {
    mounted () {
      this.disableDragEvent()
    },
    methods: {
      disableDragEvent () {
        window.addEventListener('dragenter', this.disableDrag, false)
        window.addEventListener('dragover', this.disableDrag)
        window.addEventListener('drop', this.disableDrag)
      },
      disableDrag (e) {
        const dropzone = document.getElementById('upload-area') // 这个是可拖拽的上传区
        if (dropzone === null || !dropzone.contains(e.target)) {
          e.preventDefault()
          e.dataTransfer.effectAllowed = 'none'
          e.dataTransfer.dropEffect = 'none'
        }
      }
    },
    beforeDestroy () {
      window.removeEventListener('dragenter', this.disableDrag, false)
      window.removeEventListener('dragover', this.disableDrag)
      window.removeEventListener('drop', this.disableDrag)
    }
  }