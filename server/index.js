import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'

import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser' // 用于post请求参数的传递 也就是ctx
import session from 'koa-generic-session' // 用于处理session与cookie的对应
import Redis from 'koa-redis'
import json from 'koa-json' // 处理数据可视化

import dbConfig from './dbs/config'
import passport from './interface/utils/passport'
import users from './interface/user'
import geo from './interface/geo'
import search from './interface/search'
// import categroy from './interface/categroy'
// import cart from './interface/cart'
// import order from './interface/order'

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// 定义session哈希
app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({
  key: 'mt', // key前缀
  prefix: 'mt:uid', // 前缀
  store: new Redis()
}))
// 扩展处理
app.use(bodyParser({extendTypes: ['json', 'form', 'text']}))
app.use(json())
// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})
// 配置passport
app.use(passport.initialize())
app.use(passport.session())
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // 引入路由
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
