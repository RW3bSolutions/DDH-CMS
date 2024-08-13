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
      },
      {
        path: '/assignment',
        component: () => import('pages/assignment/Index.vue'),
        name: 'AssignIndex'
      },
      {
        path: '/assignment/:id',
        component: () => import('pages/assignment/Show.vue'),
        name: 'AssignShow'
      },
      {
        path: '/assignment/create/:id',
        component: () => import('pages/assignment/Create.vue'),
        name: 'AssignCreate'
      }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
