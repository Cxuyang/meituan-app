export default {
  dbs: 'mongodb://127.0.0.1:27017/student',
  redis: { // 以只读的方式配置
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return 'caoxuyang0317@qq.com'
    },
    get pass() {
      return 'nlyokppuszhzbdgc'
    },
    get code() { // 生成短信随机码
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    get expire() { // 设置过期时间
      return () => {
        return new Date().getTime() + 60 * 60 * 1000
      }
    }
  }
}