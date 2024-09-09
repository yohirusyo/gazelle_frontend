const routes = [
  {
    name: "Authorization",
    path: "/authorization/:userdata?",
    component: () => import("src/layouts/AuthLayout.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
        meta: {
          roles: [
            "WATCHER",
            "ADMIN",
            "OPERATOR",
            "CUSTOMER",
            "WATCHER_WITH_REPORTS",
          ],
          requiresAuth: true,
        },
      },
      {
        path: "limits",
        component: () => import("src/pages/Operator/Limits.vue"),
        meta: {
          roles: ["CUSTOMER"],
          requiresAuth: true,
        },
      },
      {
        path: "history",
        component: () => import("src/pages/Customer/History.vue"),
        meta: {
          roles: ["CUSTOMER"],
          requiresAuth: true,
        },
      },
      {
        path: "report",
        component: () => import("src/pages/Admin/Report.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "WATCHER_WITH_REPORTS", "WATCHER"],
          requiresAuth: true,
        },
      },
      {
        path: "report-shifts",
        component: () => import("src/pages/Admin/ShiftReport.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "WATCHER_WITH_REPORTS"],
          requiresAuth: true,
        },
      },
      {
        path: "report-operator-shifts",
        component: () => import("src/pages/Admin/OperatorShiftReport.vue"),
        meta: {
          roles: ["ADMIN", "WATCHER_WITH_REPORTS"],
          requiresAuth: true,
        },
      },
      {
        path: "report-mvz",
        component: () => import("src/pages/Admin/ReportMVZ.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "WATCHER_WITH_REPORTS"],
          requiresAuth: true,
        },
      },
      {
        path: "report-subdivision",
        component: () => import("src/pages/Admin/SubdivisionReport.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "WATCHER_WITH_REPORTS"],
          requiresAuth: true,
        },
      },
      {
        path: "report-indicator",
        component: () => import("src/pages/Admin/IndicatorReport.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "WATCHER_WITH_REPORTS"],
          requiresAuth: true,
        },
      },
      {
        path: "report-time",
        component: () => import("src/pages/Admin/TimeReport.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "WATCHER_WITH_REPORTS"],
          requiresAuth: true,
        },
      },
      {
        path: "reports",
        component: () => import("src/pages/Admin/Index.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "WATCHER_WITH_REPORTS"],
          requiresAuth: true,
        },
      },
      {
        path: "transport",
        component: () => import("src/pages/Operator/Transport.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR"],
          requiresAuth: true,
        },
      },
      {
        path: "map",
        component: () => import("src/pages/Operator/Map.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR", "CUSTOMER"],
          requiresAuth: true,
        },
      },
      {
        path: "driver",
        component: () => import("src/pages/Operator/Driver.vue"),
        meta: {
          roles: ["ADMIN", "OPERATOR"],
          requiresAuth: true,
        },
      },
      {
        path: "user",
        component: () => import("src/pages/Operator/User.vue"),
        meta: {
          roles: ["ADMIN"],
          requiresAuth: true,
        },
      },
      {
        path: "admin",
        component: () => import("src/pages/Admin/Admin.vue"),
        meta: {
          roles: ["ADMIN", "WATCHER_WITH_REPORTS", "WATCHER"],
          requiresAuth: true,
        },
      },
      {
        path: "limit-page",
        component: () => import("src/pages/LimitPage/Index.vue"),
        meta: {
          roles: ["ADMIN", "WATCHER_WITH_REPORTS", "WATCHER"],
          requiresAuth: true,
        },
      },
      {
        path: "recommendation",
        component: () => import("src/pages/Admin/Recommendation.vue"),
        meta: {
          roles: ["ADMIN"],
          requiresAuth: true,
        },
      },
      {
        path: "places",
        component: () => import("src/pages/Admin/Places.vue"),
        meta: {
          roles: ["ADMIN"],
          requiresAuth: true,
        },
      },
      {
        path: ":id/:copy?",
        component: () => import("pages/Index.vue"),
        meta: {
          roles: ["CUSTOMER"],
          requiresAuth: true,
        },
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
