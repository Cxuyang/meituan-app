<template>
  <div class="exit" />
</template>
<script>
export default {
  layout: 'blank',
  // 生命周期中间件处 验证
  middleware: async (ctx) => {
    let {status, data} = await ctx.$axios.get('/users/exit')
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>
