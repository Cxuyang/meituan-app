import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _97d4a928 = () => interopDefault(import('..\\pages\\cart.vue' /* webpackChunkName: "pages_cart" */))
const _12965d07 = () => interopDefault(import('..\\pages\\changeCity.vue' /* webpackChunkName: "pages_changeCity" */))
const _dd3ea9c6 = () => interopDefault(import('..\\pages\\detail.vue' /* webpackChunkName: "pages_detail" */))
const _352bba6a = () => interopDefault(import('..\\pages\\exit.vue' /* webpackChunkName: "pages_exit" */))
const _5e136e4d = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _a592e89c = () => interopDefault(import('..\\pages\\order.vue' /* webpackChunkName: "pages_order" */))
const _18d045b0 = () => interopDefault(import('..\\pages\\products.vue' /* webpackChunkName: "pages_products" */))
const _7581eb6f = () => interopDefault(import('..\\pages\\register.vue' /* webpackChunkName: "pages_register" */))
const _d7286994 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/cart",
      component: _97d4a928,
      name: "cart"
    }, {
      path: "/changeCity",
      component: _12965d07,
      name: "changeCity"
    }, {
      path: "/detail",
      component: _dd3ea9c6,
      name: "detail"
    }, {
      path: "/exit",
      component: _352bba6a,
      name: "exit"
    }, {
      path: "/login",
      component: _5e136e4d,
      name: "login"
    }, {
      path: "/order",
      component: _a592e89c,
      name: "order"
    }, {
      path: "/products",
      component: _18d045b0,
      name: "products"
    }, {
      path: "/register",
      component: _7581eb6f,
      name: "register"
    }, {
      path: "/",
      component: _d7286994,
      name: "index"
    }],

    fallback: false
  })
}
