import { api } from "boot/axios";
import { requestHelper } from "src/helpers/loader";

export async function requestStatuses(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      await api.get(`status`).then(({ data }) => {
        context.commit("set", data);
      });
    },
    "",
    ignore
  );
}
