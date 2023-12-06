import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";
import { requestHelper } from "src/helpers/loader";

export async function requestMyHierarchy(context, ignore = false, rootState) {
  return requestHelper(
    context,
    async () => {
      try {
        ["hierarchy_update", "hierarchy_reset"].forEach(
          socketio.removeAllListeners
        );
      } catch (error) {}
      try {
        await api.get(`management/hierarchy`).then(({ data }) => {
          context.commit("set", data);
        });
        socketio.on("hierarchy_update", (hierarchy) =>
          context.commit("update", hierarchy)
        );
        socketio.on("hierarchy_update", (hierarchy) =>
          context.commit('customer/updateCustomerLimit', hierarchy, { root: true })
        );
        socketio.on("hierarchy_reset", (_) =>
          api.get(`management/hierarchy`).then(({ data }) => {
            context.commit("set", data);
          })
        );
      } catch (error) {}
    },
    "Hierarchy",
    ignore
  );
}

export async function addToMyHierarchy({}, form) {
  return api.post(`management/hierarchy`, form);
}

export async function updateHierarchy({}, form) {
  return api.patch(`management/hierarchy`, form);
}

export async function requestLimit({}, form) {
  return api.post(`management/limit-request`, form);
}

export async function changeRequestLimitStatus({}, { id, ...form }) {
  return api.patch(`management/limit-request/${id}`, form);
}

export async function getManagementLimitRequests(context, { id }) {
  return requestHelper(
    context,
    async () => {
      try {
        ["limit_request_update"].forEach(socketio.removeAllListeners);
      } catch (error) {}
      await api.get(`management/limit-request/${id}`).then(({ data }) =>
        context.commit("setManagement", {
          limitRequests: data,
          managementId: id,
        })
      );
      socketio.on("limit_request_update", (lr) =>
        context.commit("lrupdate", lr)
      );
    },
    "Management",
    true
  );
}
