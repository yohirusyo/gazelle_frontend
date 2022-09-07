import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";

export async function requestCurrentUser({ commit }) {
    return api
        .get(`user/current`)
        .then(({ data }) => {
            commit('setCurrentUser', data)
        })
}