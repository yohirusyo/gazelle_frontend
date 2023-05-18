import { api } from "boot/axios";
import { socketio } from "boot/socketio";
import { requestHelper } from "src/helpers/loader";

export async function requestContacts(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      try {
        ["contact_update", "contact_create", "contact_delete"].forEach(
          socketio.removeAllListeners
        );
      } catch (error) {}
      api.get(`contact`).then(({ data }) => {
        context.commit("set", data);
      });
      socketio.on("contact_update", (contact) =>
        context.commit("update", contact)
      );
      socketio.on("contact_create", (contact) =>
        context.commit("add", contact)
      );
      socketio.on("contact_delete", (id) => context.commit("remove", id));
    },
    "",
    ignore
  );
}
