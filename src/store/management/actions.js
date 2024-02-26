import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";
import { requestHelper } from 'src/helpers/loader';

export async function requestManagements(context, {year, month}) {
  return requestHelper(
    context,
    async () => {
      try {
        ['management_update', 'management_delete'].forEach(socketio.removeAllListeners)
      } catch (error) { }
      await api.get(`management/driving/${year}/${month}`).then(({ data }) => {
        context.commit("setDriving", data);
      });
      await api.get(`management/reserve/${year}/${month}`).then(({ data }) => {
        context.commit("setReserve", data);
      });
      await api.get(`management/${year}/${month}`).then(({ data }) => {
        context.commit("set", data);
      })
      socketio.on('management_update', management => context.commit("update", management))
      socketio.on("management_delete", id => context.commit("remove", id))
    }
  )
}
export async function requestChangeManagements(context, {year, month}) {
  await api.get(`management/driving/${year}/${month}`).then(({ data }) => {
    context.commit("setDriving", data);
  });
  await api.get(`management/reserve/${year}/${month}`).then(({ data }) => {
    context.commit("setReserve", data);
  });
    return await api.get(`management/${year}/${month}`)
    .then(({ data }) => {
      context.commit("set", data);
    })
}

export async function requestMyManagement(context) {
  return requestHelper(
    context,
    async () => {
      try {
        ['management_update', 'management_delete'].forEach(socketio.removeAllListeners)
      } catch (error) { }
      await api.get(`management/my`).then(({ data }) => {
        context.commit("add", data);
      }).catch(console.warn);
      socketio.on('management_update', management => context.commit("update", management))
      socketio.on("management_delete", id => context.commit("remove", id))
    },
    'My'
  )
}

export async function addManagement({ commit }, form) {
  return api
    .post(`management`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Управление успешно создано!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания управления!");
    });
}

export async function updateManagement({ commit }, { id, ...form }) {
  return api
    .patch(`management/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Управление успешно изменено!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения управления!");
    });
}

export async function removeManagement({ commit }, { id }) {
  return api
    .delete(`management/${id}`)
    .then((_) => {
      showNotifyResult(true, "Управление успешно удалено!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления управления!");
    });
}


