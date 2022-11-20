import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";

export async function requestDrivers({ commit }) {
  return api.get(`user/drivers`).then(({ data }) => {
    commit("setDriver", data);
  });
}

export async function requestNonDrivers({ commit }) {
  return api.get(`user/non-drivers`).then(({ data }) => {
    commit("setUser", data);
  });
}

export async function addDriver(
  { commit },
  { name, surname, middlename, login, phoneNumber }
) {
  return api
    .post(`user`, {
      name,
      surname,
      middlename,
      login,
      password: "123456789",
      role: "DRIVER",
      phoneNumber,
    })
    .then(({ data }) => {
      showNotifyResult(true, "Водитель успешно зарегистрирован!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка регистрации водителя!");
    });
}

export async function updateDriver({ commit }, { id, ...form }) {
  return api
    .patch(`user/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Данные водителя успешно изменен!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения данных водителя!");
    });
}

export async function removeDriver({ commit }, { id }) {
  return api
    .delete(`user/${id}`)
    .then((_) => {
      showNotifyResult(true, "Данные водителя успешно удалены!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления данных водителя!");
    });
}

export async function addUser(
  { commit },
  form
) {
  return api
    .post(`user`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Пользователь успешно зарегистрирован!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка регистрации пользователя!");
    });
}

export async function updateUser({ commit }, { id, ...form }) {
  return api
    .patch(`user/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Данные пользователя успешно изменены!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения данных пользователя!");
    });
}

export async function removeUser({ commit }, { id }) {
  return api
    .delete(`user/${id}`)
    .then((_) => {
      showNotifyResult(true, "Данные пользователя успешно удалены!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления данных пользователя!");
    });
}

export async function requestOperators({ commit }) {
  return api.get(`user/operators`).then(({ data }) => {
    commit("setOperators", data);
  });
}

export async function subscribeUserSockets({ commit, rootState }) {
  socketio.on('user_update:DRIVER', driver => commit("updateDriver", driver))
  socketio.on('user_create:DRIVER', driver => commit("addDriver", driver))
  socketio.on("user_delete:DRIVER", id => commit("removeDriver", id))
  const nonDriverRoles = ['WATCHER', 'ADMIN', 'OPERATOR'];
  nonDriverRoles.forEach(role => {
    socketio.on(`user_update:${role}`, user => {
      commit("updateUser", user);
      if (rootState.current.currentUser?.id == user.id) {
        commit('current/setCurrentUser', user, { root: true })
      }
    })
    socketio.on(`user_create:${role}`, user => commit("addUser", user))
    socketio.on(`user_delete:${role}`, id => {
      commit("removeUser", id)
      if (rootState.current.currentUser?.id == id) {
        commit('auth/logout', null, { root: true })
      }
    })
  })
}