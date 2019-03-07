import Router from 'koa-router'
import Redis from 'koa-redis'
import Email from '../dbs/config'
import nodeMailer from 'nodemailer' // 邮箱验证
import User from '../dbs/models/user' // 引入mongoose模型
import Passport from './utils/passport'
import axios from './utils/axios'

let router = new Router({
  prefix: '/users' // 前缀
})

// 声明redis客户端
let Store = new Redis().client
// 注册接口 post更安全
router.post('/signup', async (ctx) => {
  // ctx 发送过来的请求体
  const {username, password, email, code} = ctx.request.body
  // 验证 验证码
  if (code) {
    // 定义存储在redis中code的哈希规则
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    // 过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期, 请重新尝试'
        }
        return false
      } else {
        ctx.body = {
          code: -1,
          msg: '请填写正确的验证码'
        }
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  // 验证用户名和密码
  // 判断是否有此用户名, 没有则注册
  let user = await User.find({username})
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  let newUser = await User.create({username, password, email})
  // 然后自动登陆
  if (newUser) {
    let res = await axios.post('/users/signin', {username, password})
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})
// 登陆接口
router.post('/signin', async (ctx, next) => {
  // Passport 本地策略验证用户
  return Passport.authenticate('local', (err, user, info, status) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        // session存储，这里是存储到redis
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})
// 验证码 验证
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  let saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: 1,
      msg: '验证请求过于频繁, 1分钟内1次'
    }
    return
  }
  // 发送邮件
  // 发送的对象
  let transporter = nodeMailer.createTransport({
    // host: Email.smtp.host,
    // port: 587,
    // secure: false, // true则为监听405端口, false则为监听其他端口, 此处为587
    service: 'qq',
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 接受的信息
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  // 邮件中显示内容
  let mailOptions = {
    from: `"认证邮件"<${Email.smtp.user}>`,
    to: ko.email,
    subject: '美团注册码',
    html: `您在《美团实战》课程中注册, 您的邀请码是${ko.code}`
  }
  // 发送邮件
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      // 在redis中存储邮件验证码信息
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送, 可能会有延时, 有效期1分钟'
  }
})
// 退出
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  // isAuthenticated 用于检测现在是不是登录状态 passport自带了
  if (!ctx.isAuthenticated()) {
    // 成功注销
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})
// 获取用户名
router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    // 如果是登录状态, 则从session中取得信息
    const {username, email} = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})
export default router