<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    />
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      province: [],
      pvalue: '',
      city: [],
      cvalue: '',
      input: '',
      cities: []
    }
  },
  watch: {
    pvalue: async function(newPvalue) {
      let _this = this
      let {status, data: {city}} = await _this.$axios.get(`/geo/province/${newPvalue}`)
      if (status === 200) {
        _this.city = city.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
        _this.cvalue = ''
      }
    }
  },
  mounted: async function() {
    let _this = this
    let {status, data: {province}} = await _this.$axios.get('/geo/province')
    if (status === 200) {
      _this.province = province.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
  },
  methods: {
    // cb 回调函数 传回符合输入条件的data
    querySearchAsync: _.debounce(async function(query, cb) {
      let _this = this
      if (_this.cities.length) {
        cb(_this.cities.filter(item => item.value.indexOf(query) > -1))
      } else {
        let {status, data: {city}} = await _this.$axios.get('/geo/city')
        if (status === 200) {
          _this.cities = city.map(item => {
            return {value: item.name}
          })
          cb(_this.cities.filter(item => item.value.indexOf(query) > -1))
        } else {
          cb([])
        }
      }
    }, 200),
    handleSelect(item) {
      console.log(item.value)
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/css/changeCity/iselect.scss";
</style>

