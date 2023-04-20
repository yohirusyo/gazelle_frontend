<template>
  <div class="column q-gutter-y-sm q-ma-none" id="points-list">
    <OrderPoint
      :modelValue="point"
      v-for="(point, index) of points"
      :key="point.id"
      @update:modelValue="changePointProps"
      :index="index"
      :isFirst="index === 0"
      :isSolo="points.length === 0"
      @remove="remove"
      @restore="restore"
    />
    <div class="row justify-center">
      <q-btn
        text-color="white"
        label="Добавить место назначения"
        unelevated
        class="border-none bg-blue-4 col"
        @click="addPoint"
        dense
      />
    </div>
  </div>
</template>

<script>
import OrderPoint from "./OrderPoint.vue";
import Sortable from "sortablejs";

export default {
  props: ["modelValue", "isEditMode"],
  components: {
    OrderPoint,
  },
  computed: {
    points: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  data() {
    return {
      _points: [],
      id: 0,
    };
  },
  methods: {
    remove(id) {
      const point = this.points.find((p) => p.id === id);
      if (point.isNew || !this.isEditMode) {
        const idx = this.points.findIndex((p) => p.id === id);
        this.points.splice(idx, 1);
      } else {
        point.forDelete = true;
      }
    },
    restore(id) {
      const point = this.points.find((p) => p.id === id);
      point.forDelete = false;
    },
    changePointProps(point) {
      const idx = this.points.findIndex((p) => p.id === point.id);
      if (idx === 0 && !this.isEditMode) {
        this.points[idx] = point;
        for (let i = 1; i < this.points.length; i++) {
          this.points[i] = {
            ...this.points[i],
            passenger: {
              withPassengers: point.passenger.withPassengers,
              passengerCount: point.passenger.passengerCount,
              contact: {
                fullname: point.passenger.contact.fullname,
                phoneNumber: point.passenger.contact.phoneNumber,
              },
            },
            cargo: {
              withCargo: point.cargo.withCargo,
              name: point.cargo.name,
              width: point.cargo.width,
              length: point.cargo.length,
              height: point.cargo.height,
              weight: point.cargo.weight,
            },
          };
        }
      } else {
        this.points[idx] = point;
      }
    },
    addPoint() {
      const firstPoint = this.points[0];

      const p = {
        id: this.id,
        isNew: true,
        destinationName: null,
        passenger: {
          withPassengers: false,
          passengerCount: null,
          contact: {
            fullname: null,
            phoneNumber: null,
          },
        },
        cargo: {
          withCargo: false,
          name: null,
          width: null,
          length: null,
          height: null,
          weight: null,
        },
      };
      if (!!firstPoint && !this.isEditMode) {
        this.points.push({
          ...p,
          passenger: {
            withPassengers: firstPoint.passenger.withPassengers,
            passengerCount: firstPoint.passenger.passengerCount,
            contact: {
              fullname: firstPoint.passenger.contact.fullname,
              phoneNumber: firstPoint.passenger.contact.phoneNumber,
            },
          },
          cargo: {
            withCargo: firstPoint.cargo.withCargo,
            name: firstPoint.cargo.name,
            width: firstPoint.cargo.width,
            length: firstPoint.cargo.length,
            height: firstPoint.cargo.height,
            weight: firstPoint.cargo.weight,
          },
        });
      } else {
        this.points.push(p);
      }
      this.id++;
    },
    initPoints() {
      if (this.points.length === 0) {
        this.addPoint();
      }
      this.id = this.points.length + 1;
    },
  },
  mounted() {
    this.initPoints();
    const element = document.querySelector("#points-list");
    const self = this;
    const sortable = Sortable.create(element, {
      onEnd(event) {
        self.$nextTick(() => {
          const firstPoint = self.points[event.oldIndex];
          self.points[event.oldIndex] = self.points[event.newIndex];
          self.points[event.newIndex] = firstPoint;
        });
      },
    });
  },
  watch: {
    points(val) {
      this.initPoints();
    },
  },
};
</script>
