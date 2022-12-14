import { store } from "quasar/wrappers";
import { createStore } from "vuex";

import auth from "./auth";
import place from "./place";
import user from "./user";
import transport from "./transport";
import status from "./status";
import current from "./current";
import order from "./order";
import customer from "./customer";
import contact from "./contact";
import orderStats from "./order-stats";
import orderHistory from './order-history';
import userStats from './user-stats';

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
      place,
      user,
      transport,
      status,
      current,
      order,
      customer,
      contact,
      orderStats,
      orderHistory,
      userStats
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
