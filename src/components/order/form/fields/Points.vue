<template>
  <div class="column q-gutter-y-sm q-ma-none points" id="points-list">
    <Point
      :modelValue="point"
      v-for="(point, index) of points"
      :key="index"
      @update:modelValue="changePointProps"
      :index="index"
      :isFirst="index === 0"
      :isSolo="points.length === 0"
      :isLast="index === points.length-1"
      :initPointsLength="initPointsLength"
      @remove="remove"
      @restore="restore"
      @elUp="elUp"
      @elDown="elDown"
    />
    <div class="row justify-center">
      <!-- <q-toggle
        v-model="toggle"
        @update:model-value="changeSortable"
      ></q-toggle> -->
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
import Point from "./Point.vue";
import Sortable from "sortablejs";

export default {
  props: ["modelValue", "isEditMode"],
  components: {
    Point,
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
      toggle: true,
      sortable: null,
      initPointsLength: 0
    };
  },
  methods: {
    elUp(index) {
      if (index != 0) {
        let prev = this.points[index - 1];
        this.points[index - 1] = this.points[index];
        this.points[index] = prev;
      }
    },
    elDown(index) {
      if (index != this.points.length-1) {
        let next = this.points[index + 1];
        this.points[index + 1] = this.points[index];
        this.points[index] = next;
      }
    },
    // initSortable() {
    //   const element = document.querySelector("#points-list");
    //   const self = this;
    //   this.sortable = Sortable.create(element, {
    //     onEnd(event) {
    //       self.$nextTick(() => {
    //         const firstPoint = self.points[event.oldIndex];
    //         self.points[event.oldIndex] = self.points[event.newIndex];
    //         self.points[event.newIndex] = firstPoint;
    //       });
    //     },
    //   });
    // },

    // destroySortable() {
    //   if (this.sortable !== null) {
    //     this.sortable.destroy();
    //     this.sortable = null;
    //   }
    // },

    // changeSortable(val) {
    //   if (val === false) {
    //     this.destroySortable();
    //   } else {
    //     this.initSortable();
    //   }
    // },

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
              cargoReciever: {
                phoneNumber: point.cargo.cargoReciever.phoneNumber,
                fullname: point.cargo.cargoReciever.fullname,
                subdivision: point.cargo.cargoReciever.subdivision,
                mvz: point.cargo.cargoReciever.mvz,
              },
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
          cargoReciever: {
            phoneNumber: null,
            fullname: null,
            subdivision: null,
            mvz: null,
          },
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
            cargoReciever: {
              phoneNumber: firstPoint.cargo.cargoReciever.phoneNumber,
              fullname: firstPoint.cargo.cargoReciever.fullname,
              subdivision: firstPoint.cargo.cargoReciever.subdivision,
              mvz: firstPoint.cargo.cargoReciever.mvz,
            },
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
      this.initPointsLength = this.points.length;
    },
  },
  async mounted() {
    await this.initPoints();
    // this.changeSortable(true);
    // const element = document.querySelector("#points-list");
    // const self = this;
    // const sortable = Sortable.create(element, {
    //   onEnd(event) {
    //     self.$nextTick(() => {
    //       const firstPoint = self.points[event.oldIndex];
    //       self.points[event.oldIndex] = self.points[event.newIndex];
    //       self.points[event.newIndex] = firstPoint;
    //     });
    //   },
    // });
  },
  watch: {
    points(val) {
      this.initPoints();
    },
  },
};
</script>
