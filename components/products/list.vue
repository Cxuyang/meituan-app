<template>
  <div class="m-products-list">
    <dl>
      <dd
        v-for="item in nav"
        :key="item.name"
        :class="[item.name,item.active?'s-nav-active':'']"
        @click="navSelect(item)"
      >{{ item.txt }}</dd>
    </dl>
    <ul>
      <Item
        v-for="(item,idx) in list"
        :key="idx"
        :meta="item"/>
    </ul>
  </div>
</template>

<script>
import Item from './product.vue'
export default {
  components: {
    Item
  },
  props: {
    list: {
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      nav: [
        {
          name: 's-default',
          txt: '智能排序',
          active: true
        }, {
          name: 's-price',
          txt: '价格最低',
          active: false
        }, {
          name: 's-visit',
          txt: '人气最高',
          active: false
        }, {
          name: 's-comment',
          txt: '评价最高',
          active: false
        }
      ]
    }
  },
  async asyncData({app}) {
    let { data } = await app.$axios.get('searchList')
    return { items: data.list }
  },
  methods: {
    navSelect: function (target) {
      this.nav.map(item => item.active = false)
      target.active = true
      let _sortFild = ''
      if (target.txt == '智能排序') {
        _sortFild = 'comment'
      } else if (target.txt == '价格最低') {
        _sortFild = 'price'
      } else if (target.txt == '人气最高') {
        _sortFild = 'comment'
      } else if (target.txt == '评价最高') {
        _sortFild = 'rate'
      }
      this.list.sort((a, b) => b[_sortFild] - a[_sortFild])
    }
  }
}
</script>
