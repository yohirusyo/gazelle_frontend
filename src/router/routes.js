
const routes = [
  {
    name: "Authorization",
    path: "/authorization/:token?",
    component: () => import("src/layouts/AuthLayout.vue"),
  },
  {
    name: "Authorization",
    path: "/authorization",
    component: () => import("src/layouts/AuthLayout.vue"),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Index.vue'),
        meta: {
          roles: ['WATCHER', 'ADMIN', 'OPERATOR', 'CUSTOMER'],
        },
      },

      {
        path: 'history', component: () => import('pages/History.vue'),
        meta: {
          roles: ['CUSTOMER'],
        },
      },
      {
        path: 'report', component: () => import('pages/Report.vue'),
        meta: {
          roles: ['ADMIN', 'OPERATOR'],
        },
      },
      {
        path: 'transport', component: () => import('pages/Transport.vue'),
        meta: {
          roles: ['ADMIN', 'OPERATOR'],
        },
      },
      {
        path: 'driver', component: () => import('pages/Driver.vue'),
        meta: {
          roles: ['ADMIN', 'OPERATOR'],
        },
      },
      {
        path: 'user', component: () => import('pages/User.vue'),
        meta: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'admin', component: () => import('pages/Admin.vue'),
        meta: {
          roles: ['ADMIN'],
        },
      },
      {
        path: ':id', component: () => import('pages/Index.vue'),
        meta: {
          roles: ['CUSTOMER'],
        },
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
