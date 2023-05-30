import { boot } from "quasar/wrappers";
import io from "socket.io-client";
import "dayjs/locale/ru";
const initConnection = () => {
  if (!localStorage.getItem("connection")) {
    localStorage.setItem("connection", "atu");
  }
};

initConnection();

const socketio = io(
  `ws://${process.env.API[localStorage.getItem("connection")]}`,
  {
    path: "/ws",
  }
);

const changeSocketConnection = () => {
  socketio.io.uri = `ws://${
    process.env.API[localStorage.getItem("connection")]
  }`;
  socketio.disconnect().connect();
};

export default boot(async ({ app }) => {
  app.config.globalProperties.$socket = socketio;
});

export { socketio, changeSocketConnection };
