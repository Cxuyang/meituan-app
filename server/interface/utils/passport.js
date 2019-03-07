// 用于验证权限
import passport from 'koa-passport' // passport策略
import LocalStrategy from 'passport-local' // 本地策略
import UserModel from '../../dbs/models/user' // 引入user model

passport.use(new LocalStrategy(async (username, password, done) => {
  // done 为回调函数
  let result = await UserModel.findOne({username})
  if (result != null) {
    if (result.password === password) {
      return done(null, result)
    } else {
      return done(null, false, '密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

// 用户每次进来通过session来判断
// 序列化: 序列化 (Serialization)是将对象的状态信息转换为可以存储或传输的形式的过程
// 序列化  每次查找到用户信息后会把信息存到session中, 浏览器在cookie中
passport.serializeUser((user, done) => {
   done(null, user)
})
// 反序列化：将序列化的数据恢复为对象的过程
passport.deserializeUser((user, done) => {
  return done(null, user)
})
export default passport