<template>
  <div class="col bg-accent" ref="history">
    <q-virtual-scroll
      :style="`height: ${height}px`"
      :items="getSortedHistory()"
    >
      <template v-slot="{ item }">
        <div
          class="q-px-lg bg-white q-mb-sm sticky-item"
          v-if="item.head"
          style="font-size: 1.1rem"
        >
          {{ moment(item.order.createdAt).lang("ru").format("D MMM, dddd") }}
        </div>
        <div
          class="bg-white q-pa-sm column q-mb-sm"
          radius="md"
          @click="editElement(item)"
        >
          <div class="text-bold q-mx-md">
            {{
              (currentUser.id == item.order.customerId
                ? "Ваш з"
                : `(${getCustomerById(item.order.customerId)?.fullname})
                    З`) +
              `аказ
                    №${item.order.id}, ` +
              (item.order.orderTime
                ? `в ${moment(item.order.orderTime).format("HH:mm")}`
                : `время заказа не назначено`)
            }}
          </div>
          <div class="q-mx-md">
            {{
              `${getPlaceById(item.order.departurePointId)?.name} => ${
                getPlaceById(item.order.destinationId)?.name
              }`
            }}
          </div>
          <q-separator spaced inset />
          <div
            v-if="
              !item.order.isApproved &&
              !item.order.isDeclined &&
              !item.order.isDone &&
              item.order.isRequest
            "
            class="text-blue q-mx-md"
          >
            Ожидает подтверждения диспетчера
          </div>
          <div
            v-else-if="
              ((item.order.isApproved && item.order.isRequest) ||
                !item.order.isRequest) &&
              !item.order.isDone
            "
            class="text-green q-mx-md"
          >
            <div class="row items-center q-gutter-x-md justify-between">
              <span> Заказ выполняется </span>
              <OrderStatus :orderId="item.order.id" />
            </div>

            <div
              class="row text-black items-center q-gutter-x-md justify-between"
            >
              <AutoNumber
                :number="item.transportNumber"
                class="col col-shrink"
              />
              <div class="col column items-end">
                <span>
                  {{ item.driverFullname }}
                </span>
                <span>
                  {{ item.driverPhoneNumber }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-else-if="item.order.isDeclined && item.order.isRequest"
            class="text-red q-mx-md"
          >
            Заказ отклонен диспетчером
          </div>
          <div
            v-else-if="item.order.isDone && !item.order.isDeleted"
            class="text-grey q-mx-md"
          >
            Заказ выполнен
            <div
              class="row text-black items-center q-gutter-x-md justify-between"
            >
              <AutoNumber
                :number="item.transportNumber"
                class="col col-shrink"
              />
              <div class="col column items-end">
                <span>
                  {{ item.driverFullname }}
                </span>
                <span>
                  {{ item.driverPhoneNumber }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import OrderStatus from "src/components/order/OrderStatus.vue";
import * as moment from "moment";
import AutoNumber from "src/components/base/AutoNumber.vue";
import {
  timeFormat,
  formatContact,
  formatCustomerMobileFullname,
  formatCustomerMobileSubdivision,
  formatCustomerMobilePhoneNumber,
  formatPlace,
  formatTransportNumber,
  formatDriverMobileFullname,
  formatDriverMobilePhoneNumber,
} from "src/helpers/formatters";

import BaseCard from "src/components/base/Card.vue";
export default {
  name: "OrderHistory",
  props: ["col", "height"],
  components: {
    OrderStatus,
    BaseCard,
    AutoNumber,
  },
  computed: {
    ...mapGetters("orderHistory", ["getSortedHistory"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapState("current", ["currentUser"]),
    ...mapGetters("customer", ["getCustomerById"]),
  },
  data() {
    return {
      height: 0,
    };
  },
  async mounted() {
    await this.requestHistory();
    await this.subscribeHistorySockets();
    this.height = this.$refs.history.clientHeight;
  },
  methods: {
    ...mapActions("orderHistory", [
      "requestHistory",
      "subscribeHistorySockets",
    ]),
    ...mapMutations("current", ["setRequest"]),

    timeFormat,
    formatContact,
    formatCustomerMobileFullname,
    formatCustomerMobileSubdivision,
    formatCustomerMobilePhoneNumber,
    formatPlace,
    formatTransportNumber,
    formatDriverMobileFullname,
    formatDriverMobilePhoneNumber,
    moment,
    editElement(item) {
      if (
        this.currentUser.id == item.order.customerId &&
        ((!item.order.isApproved &&
          !item.order.isDeclined &&
          !item.order.isDone &&
          item.order.isRequest) ||
          (((item.order.isApproved && item.order.isRequest) ||
            !item.order.isRequest) &&
            !item.order.isDone))
      ) {
        if (this.$q.screen.xs) {
          this.$router.push({ path: `/${item.order.id}` });
        } else {
          this.setRequest(item);
        }
      }
    },
  },
};
</script>

<style></style>
