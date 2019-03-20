<template>
  <el-container class="total-container">
    <el-header height="100%" width="100%">
      <my-header/>
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer height="100%" width="100%">
      <my-footer/>
    </el-footer>
  </el-container>
</template>
<script>
import MyHeader from '../components/public/header/index.vue'
import MyFooter from '../components/public/footer/index.vue'
export default {
  components: {
    MyHeader,
    MyFooter
  }
}
</script>
<style lang="scss" scoped>
.total-container {
  background-color: #F8F8F8;
}
.el-main {
  width: 1190px
}
</style>
