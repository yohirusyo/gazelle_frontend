import { boot } from 'quasar/wrappers'
import io from 'socket.io-client';

const socketio = io(`ws://${process.env.API}`, {
  path: '/ws'
})

export default boot(async ({ app }) => {
  app.config.globalProperties.$socket = socketio
});

export { socketio }