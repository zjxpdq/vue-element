<template>
  <div class="index">
    <h1>Element-ui vue</h1>
    <div class="lv_cropperJS">
      <CropperJS/>
    </div>
  </div>
</template>

<script>
  import CropperJS from '../../components/CropperJS/CropperJS'

  export default {
    name: 'index',
    data() {
      return {}
    },
    created() {},
    methods: {
    },
    components: {
      CropperJS
    },
    computed: {},
    mounted() {
      /*this.$api.app.login().then(res => {
        console.log(res)
      })*/
    },
    beforeDestroy() {},
    destroyed() {}
  }
</script>

<style lang="scss" scoped>
  .index {
    .lv_cropperJS {
      width: 600px;
      height: 430px;
      /*background: rgba(0, 0, 0, .2);*/
    }

    .tz_box {
      height: 100px;
      width: 200px;
      line-height: 100px;
      text-align: center;
      border: 1px dashed #333;
    }
  }
</style>
