<template>
  <div class="m-geo">
    <i class="el-icon-location"/>
    {{ $store.state.geo.position.city }}
    <nuxt-link class="changeCity" to="/changeCit">切换城市</nuxt-link>
    {{ [citys.join(' ')] }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      citys: ['重庆', '贵阳', '西安']
    }
  }
}
</script>
