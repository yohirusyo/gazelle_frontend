
const routes = [
  {
    name: "Authorization",
    path: "/authorization",
    component: () => import("src/layouts/AuthLayout.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Index.vue'),
        meta: {
          roles: ['WATCHER', 'ADMIN', 'OPERATOR', 'CUSTOMER'],
          requiresAuth: true,
        },
      },

      {
        path: 'history', component: () => import('pages/History.vue'),
        meta: {
          roles: ['CUSTOMER'],
          requiresAuth: true,
        },
      },
      {
        path: 'report', component: () => import('pages/Report.vue'),
        meta: {
          roles: ['ADMIN', 'OPERATOR'],
          requiresAuth: true,
        },
      },
      {
        path: 'transport', component: () => import('pages/Transport.vue'),
        meta: {
          roles: ['ADMIN', 'OPERATOR'],
          requiresAuth: true,
        },
      },
      {
        path: 'map', component: () => import('pages/Map.vue'),
        meta: {
          roles: ['ADMIN', 'OPERATOR'],
          requiresAuth: true,
        },
      },
      {
        path: 'driver', component: () => import('pages/Driver.vue'),
        meta: {
          roles: ['ADMIN', 'OPERATOR'],
          requiresAuth: true,
        },
      },
      {
        path: 'user', component: () => import('pages/User.vue'),
        meta: {
          roles: ['ADMIN'],
          requiresAuth: true,
        },
      },
      {
        path: 'admin', component: () => import('pages/Admin.vue'),
        meta: {
          roles: ['ADMIN'],
          requiresAuth: true,
        },
      },
      {
        path: ':id', component: () => import('pages/Index.vue'),
        meta: {
          roles: ['CUSTOMER'],
          requiresAuth: true,
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
