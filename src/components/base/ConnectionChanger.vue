<template>
  <div class="column items-center">
    <div>Выберите подключение</div>
    <q-btn-toggle
      class="border-none"
      v-model="connection"
      toggle-color="grey-4  "
      toggle-text-color="black"
      unelevated
      :options="[
        { label: 'АТУ', value: 'atu' },
        { label: 'ММК-Метиз', value: 'mmkmetiz' },
      ]"
    />
  </div>
</template>

<script>
import {
  switchConnection,
  switchAxiosConnection,
  getConnection,
} from "src/boot/axios";
import { changeSocketConnection } from "src/boot/socketio";
export default {
  computed: {
    connection: {
      get() {
        return this._connection;
      },
      set(val) {
        const c = switchConnection(val);
        switchAxiosConnection();
        changeSocketConnection();
        this.$emit("connectionChanged");
        this._connection = c;
      },
    },
  },
  data() {
    return {
      _connection: getConnection(),
    };
  },
};
</script>
