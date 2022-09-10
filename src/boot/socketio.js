import { boot } from 'quasar/wrappers'
import io from 'socket.io-client';
import JsonExcel from "vue-json-excel3";

const socketio = io(`ws://${process.env.API}`, {
  path: '/ws'
})

export default boot(async ({ app }) => {
  app.config.globalProperties.$socket = socketio
  app.component("downloadExcel", JsonExcel)
});

export { socketio }