import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";
import { requestHelper } from "src/helpers/loader";

export async function requestDrivers(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      const nonDriverRoles = [
        "WATCHER",
        "ADMIN",
        "OPERATOR",
        "WATCHER_WITH_REPORTS",
      ];
      try {
        [
          "user_update:DRIVER",
          "user_create:DRIVER",
          "user_delete:DRIVER",
        ].forEach(socketio.removeAllListeners);
        nonDriverRoles.forEach((role) => {
          [
            `user_update:${role}`,
            `user_create:${role}`,
            `user_delete:${role}`,
          ].forEach(socketio.removeAllListeners);
        });
      } catch (error) {}

      await api.get(`user/drivers`).then(({ data }) => {
        context.commit("setDriver", data);
      });

      const { commit, rootState } = context;
      socketio.on("user_update:DRIVER", (driver) =>
        commit("updateDriver", driver)
      );
      socketio.on("user_create:DRIVER", (driver) =>
        commit("addDriver", driver)
      );
      socketio.on("user_delete:DRIVER", (id) => commit("removeDriver", id));
      nonDriverRoles.forEach((role) => {
        socketio.on(`user_update:${role}`, (user) => {
          commit("updateUser", user);
          if (rootState.current.currentUser?.id == user.id) {
            commit("current/setCurrentUser", user, { root: true });
          }
        });
        socketio.on(`user_create:${role}`, (user) => commit("addUser", user));
        socketio.on(`user_delete:${role}`, (id) => {
          commit("removeUser", id);
          if (rootState.current.currentUser?.id == id) {
            commit("auth/logout", null, { root: true });
          }
        });
      });
    },
    "Drivers",
    ignore
  );
}

export async function requestOperators(context, isAnyway = false) {
  return requestHelper(
    context,
    async () => {
      const nonDriverRoles = [
        "WATCHER",
        "ADMIN",
        "OPERATOR",
        "WATCHER_WITH_REPORTS",
      ];
      try {
        [
          "user_update:DRIVER",
          "user_create:DRIVER",
          "user_delete:DRIVER",
        ].forEach(socketio.removeAllListeners);
        nonDriverRoles.forEach((role) => {
          [
            `user_update:${role}`,
            `user_create:${role}`,
            `user_delete:${role}`,
          ].forEach(socketio.removeAllListeners);
        });
      } catch (error) {}

      await api.get(`user/operators`).then(({ data }) => {
        context.commit("setOperators", data);
      });

      const { commit, rootState } = context;
      socketio.on("user_update:DRIVER", (driver) =>
        commit("updateDriver", driver)
      );
      socketio.on("user_create:DRIVER", (driver) =>
        commit("addDriver", driver)
      );
      socketio.on("user_delete:DRIVER", (id) => commit("removeDriver", id));
      nonDriverRoles.forEach((role) => {
        socketio.on(`user_update:${role}`, (user) => {
          commit("updateUser", user);
          if (rootState.current.currentUser?.id == user.id) {
            commit("current/setCurrentUser", user, { root: true });
          }
        });
        socketio.on(`user_create:${role}`, (user) => commit("addUser", user));
        socketio.on(`user_delete:${role}`, (id) => {
          commit("removeUser", id);
          if (rootState.current.currentUser?.id == id) {
            commit("auth/logout", null, { root: true });
          }
        });
      });
    },
    "Operators",
    isAnyway
  );
}

export async function requestNonDrivers(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      const nonDriverRoles = [
        "WATCHER",
        "ADMIN",
        "OPERATOR",
        "WATCHER_WITH_REPORTS",
      ];
      try {
        [
          "user_update:DRIVER",
          "user_create:DRIVER",
          "user_delete:DRIVER",
        ].forEach(socketio.removeAllListeners);
        nonDriverRoles.forEach((role) => {
          [
            `user_update:${role}`,
            `user_create:${role}`,
            `user_delete:${role}`,
          ].forEach(socketio.removeAllListeners);
        });
      } catch (error) {}

      await api.get(`user/non-drivers`).then(({ data }) => {
        context.commit("setUser", data);
      });

      const { commit, rootState } = context;
      socketio.on("user_update:DRIVER", (driver) =>
        commit("updateDriver", driver)
      );
      socketio.on("user_create:DRIVER", (driver) =>
        commit("addDriver", driver)
      );
      socketio.on("user_delete:DRIVER", (id) => commit("removeDriver", id));
      nonDriverRoles.forEach((role) => {
        socketio.on(`user_update:${role}`, (user) => {
          commit("updateUser", user);
          if (rootState.current.currentUser?.id == user.id) {
            commit("current/setCurrentUser", user, { root: true });
          }
        });
        socketio.on(`user_create:${role}`, (user) => commit("addUser", user));
        socketio.on(`user_delete:${role}`, (id) => {
          commit("removeUser", id);
          if (rootState.current.currentUser?.id == id) {
            commit("auth/logout", null, { root: true });
          }
        });
      });
    },
    "Users",
    ignore
  );
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

export async function addUser({ commit }, form) {
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
