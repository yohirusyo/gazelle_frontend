
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
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'report', component: () => import('pages/Report.vue') }
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
