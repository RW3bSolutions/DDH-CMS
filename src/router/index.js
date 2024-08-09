import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
      // Redirect to the login page if not authenticated
      next({ path: '/' })
    } else if (!to.matched.some(record => record.meta.requiresAuth) && isAuthenticated) {
      // Redirect to the dashboard if authenticated
      next({ path: '/dashboard' })
    } else {
      // Proceed with the navigation
      next()
    }
  })

  return Router
})
