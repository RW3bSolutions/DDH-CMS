const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/auth/Login.vue') }
    ],
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/cms',
    component: () => import('layouts/CMSLayout.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import('pages/IndexPage.vue'),
        name: 'Dashboard'
      },
      {
        path: '/doctors',
        component: () => import('pages/Doctors.vue'),
        name: 'Doctors'
      },
      {
        path: '/nurses',
        component: () => import('pages/Nurses.vue'),
        name: 'Nurses'
      }
    ],
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
