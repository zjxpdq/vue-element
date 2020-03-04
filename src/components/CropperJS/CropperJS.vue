<template>
  <div class="CropperJS">
    <div
      @dragleave.prevent="dragOver = false"
      @dragover.prevent="dragOver = true"
      @drop.prevent="onDrop"
      @paste="handlePaste"
      class="c_img_box c_img_bg"
    >
      <img
        class="cropper-image"
        ref="imgRef"
      >
    </div>
    <div class="c_img_right">
      <div :style="previewStyle" class="c_img_preview c_img_bg" ref="preview" v-if="preview"></div>
      <div class="c_img_operation">
        <div class="c_up_image">
          <up-image @change="onChange">图片上传</up-image>
        </div>
        <div class="c_img_edit" v-show="insideSrc">
          <button @click="rotate()" type="button">旋转</button>
          <button @click="shrink" type="button">缩小</button>
          <button @click="magnify" type="button">放大</button>
          <button @click="scale('X')" type="button">左右翻转</button>
          <button @click="scale('Y')" type="button">上下翻转</button>
          <button @click="move(0, -moveStep)" type="button">上</button>
          <button @click="move(-moveStep, 0)" type="button">左</button>
          <button @click="move(0, moveStep)" type="button">下</button>
          <button @click="move(moveStep, 0)" type="button">右</button>
          <button @click="crop" style="width: 100%;" type="button">完成裁剪</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.min.css'

  // 上传按钮组件
  const UpImage = {
    props: {
      type: {
        type: String,
        default: 'file'
      }, // 原生type值
      name: String, // 原生name值
      className: String, // 类名
      maxLength: {
        type: [Number, String],
        default() {
          return 3
        }
      } // 限制上传大小
    },
    data() {
      return {
        ErrorText: null,
        isError: false
      }
    },
    computed: {
      putIds() {
        return `lv_btn_${this._uid}`
      }
    },
    methods: {
      onChange(e) {
        this.isError = false
        const input = e.target
        const files = e.target.files
        if (files && files[0]) {
          const file = files[0]
          let length = isNaN(parseInt(this.maxLength)) ? 3 : parseInt(this.maxLength)
          if (!file.type.includes('image')) {
            input.value = ''
            this.isError = true
            this.ErrorText = '文件格式不正确，请选择PNG/JPG'
            return false
          } else if (file.size > 1024 * 1024 * length) {
            input.value = ''
            this.isError = true
            this.ErrorText = `上传的图片不能大于${length}MB`
            return false
          } else {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = (event) => {
              this.$emit('change', {
                value: event.srcElement.result,
                name: file.name
              })
            }
          }
        }
      },
      clearError() {
        this.isError = false
        this.ErrorText = null
      }
    },
    render(h) {
      return h(
        'div',
        {
          class: ['c_btn_box', { 'is_error': this.isError }],
          attrs: {
            id: `c_button_box_${this._uid}`
          }
        },
        [
          h('label', {
            class: ['c_btn', this.className],
            attrs: {
              for: this.putIds
            }
          }, [this.$slots.default]),
          h('input', {
            attrs: {
              class: 'c_btn_input',
              id: this.putIds,
              type: this.type,
              name: this.name,
              accept: 'image/*'
            },
            on: {
              'change': this.onChange
            }
          }),
          h('p', {
            class: ['c_error_image', { 'is_error': this.isError }]
          }, this.ErrorText)
        ]
      )
    }
  } // 上传按钮组件

  export default {
    name: 'CropperJS',
    data() {
      return {
        cropper: null,
        insideSrc: '',
        dragOver: false
      }
    },
    props: {
      url: {
        type: String,
        default: ''
      }, // 要裁剪的图片路径
      preview: {
        type: Boolean,
        default: true
      }, // 是否要预览
      previewStyle: {
        type: Object,
        default() {
          return {}
        }
      }, // 预览框样式
      moveStep: {
        type: Number,
        default: 4
      }, // 进步数
      options: { type: Object }
    },
    created() {},
    methods: {
      init() {
        this.cropper = new Cropper(this.$refs.imgRef, Object.assign({
          preview: this.$refs.preview,
          checkCrossOrigin: true,
          viewMode: 1,
          dragMode: 'move',
          aspectRatio: 9 / 9 // 相片比例
        }, this.options))
      },
      onChange(e) {
        this.replace(e.value)
      }, // 获取图片
      replace(src) {
        this.cropper.replace(src)
        this.insideSrc = src
      }, // 图片替换
      rotate(deg) {
        this.cropper.rotate(deg || 90)
      }, // 旋转
      shrink() {
        this.cropper.zoom(-0.1)
      }, // 缩小
      magnify() {
        this.cropper.zoom(0.1)
      }, // 放大
      scale(d) {
        this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`])
      }, // 翻转
      move(...argu) {
        this.cropper.move(...argu)
      }, // 移动
      crop() {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          console.log(blob)
          this.$emit('on-crop', blob)
        })
      }, // 裁剪后的图片数据
      onDrop(e) {
        this.uploadFiles(e.dataTransfer.files)
      }, // 事件
      handlePaste(e) {
        this.uploadFiles(e.target.files)
      }, // 事件
      uploadFiles(file) {
        file = file[0]
        if ((/image/).test(file.type)) {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            let base = reader.result
            let name = file.name
            let arr = base.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            let a = new File([u8arr], name, { type: mime })
            let src = window.URL.createObjectURL(a)
            console.log(src)
            this.replace(src)
          }
          //其他格式文件被选中
        } else {
          console.log('文件格式不正确，请拖取png或jpg格式')
        }
      } // 获取拖拽过来的图片！并赋值给裁剪插件
    },
    components: {
      UpImage
    },
    computed: {},
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    beforeDestroy() {},
    destroyed() {}
  }
</script>


<style lang="scss" scoped>
  .CropperJS {
    display: flex;
    height: 100%;

    .c_img_bg {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
    }

    .c_img_box {
      height: 100%;
      flex: 2;
      overflow: hidden;
      margin-right: 20px;
    }

    .c_img_right {
      flex: 1;

      .c_img_preview {
        overflow: hidden;
        height: 200px;
        width: 200px;
      }

      .c_img_operation {
        .c_up_image {
          padding-top: 20px;

          /deep/ .c_btn_box {
            display: block;
          }
        }

        .c_img_edit {
          margin-top: 5px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          button {
            display: inline-block;
            background: linear-gradient(90deg, rgba(57, 160, 255, 1) 0%, rgba(0, 120, 219, 1) 100%);
            border-radius: 4px;
            color: #fff;
            padding: 8px 10px;
            cursor: pointer;
            border: none; //自定义边框
            outline: none; //消除默认点击蓝色边框效果
            margin: 5px 0;
            text-align: center;
            transition: opacity .3s;
            opacity: 1;

            &:active {
              opacity: .8;
            }
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .c_btn_box {
    display: inline-block;
    position: relative;

    label.c_btn {
      display: block;
      width: inherit;
      background: linear-gradient(90deg, rgba(57, 160, 255, 1) 0%, rgba(0, 120, 219, 1) 100%);
      border-radius: 4px;
      color: #fff;
      padding: 8px 20px;
      cursor: pointer;
      text-align: center;
      transition: opacity .3s;
      opacity: 1;

      &:active {
        opacity: .8;
      }
    }

    input.c_btn_input {
      display: none;
    }

    p.c_error_image {
      color: red;
      font-size: 12px;
      position: absolute;
      left: 0;
      top: calc(100% + 2px);
      transition: opacity .3s;
      opacity: 0;

      &.is_error {
        opacity: 1;
      }
    }
  }
</style>
