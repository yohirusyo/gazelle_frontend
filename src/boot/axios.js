import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({ baseURL: `http://${process.env.API}` });

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers["Authorization"] = token;
}


export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;
});

export { api, axios };
