<template>
<div class="wheel-item-container">
  <div class="wheel-item-line"></div>
  <div class="wheel-item-list">
    <div ref="list">
      <div class="list-block" v-for="(el, idx) in renderData" :key="idx">{{ el.value }}</div>
    </div>
  </div>
  <div class="wheel-item" ref="wheel">
    <div
      class="list-block"
      :style="setWheelItemDeg(el.index)"
      v-for="(el, index) in renderData"
      :key="index"
      :class="{'hidden': setHidden(el.index)}"
    >{{ el.value }}</div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: "line"
    },
    value: {},
    dataType: {
      type: String,
      default: 'String'
    }
  },
  data() {
    return {
      finger: { startY: 0, lastY: 0, startTime: 0, lastTime: 0, translateY: 0 },
      spin: { start: -9, end: 9, branch: 9 }
    };
  },
  computed: {
    renderData() {
      let temp = [];
      for (let k = this.spin.start; k <= this.spin.end; k++) {
        let data = {
          value: this.getSpinData(k),
          index: k
        };
        temp.push(data);
      }
      return temp;
    }
  },
  watch: {
    listData: {
      handler(newVal) {
        if (this.dataType === 'number') {
          this.autoUpdate();
        } else {
          this.autoUpdate(newVal);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$el.addEventListener("touchstart", this.itemTouchStart);
    this.$el.addEventListener("touchmove", this.itemTouchMove);
    this.$el.addEventListener("touchend", this.itemTouchEnd);
    this.autoUpdate(this.value);
  },
  beforeDestroy() {
    this.$el.removeEventListener("touchstart", this.itemTouchStart);
    this.$el.removeEventListener("touchmove", this.itemTouchMove);
    this.$el.removeEventListener("touchend", this.itemTouchEnd);
  },
  methods: {
    autoUpdate(val) {
      if (val || val === '' || val === undefined) {
        if (this.listData.length > 0) {
          let index = this.listData.indexOf(val);
          if (index === -1) {
            console.warn("当前初始值不存在，请检查后listData范围！！");
            this.setListTransform();
            this.getPickValue(0);
          } else {
            let move = index * 34;
            /* 因为往上滑动所以是负 */
            this.setStyle(-move);
            this.setListTransform(-move, -move);
            this.getPickValue(move);
          }
        }
      } else {
        if (this.listData.length < Number(this.value) && this.dataType === 'number') {
          let move =  this.listData.length * 34
          this.setStyle(-move);
          this.setListTransform(-move, -move);
          this.$emit('input', this.listData[this.listData.length - 1])
        }
        
      }
    },
    setHidden(index) {
      if (this.type === "line") {
        return index < 0 || index > this.listData.length - 1;
      } else {
        return false;
      }
    },
    setWheelItemDeg(index) {
      return {
        transform: `rotate3d(1, 0, 0, ${(-index * 20) %
          360}deg) translate3d(0px, 0px, 100px)`
      };
    },
    setWheelDeg(updateDeg, type, time = 1000) {
      if (type === "end") {
        this.$refs.wheel.style.webkitTransition = `transform ${time}ms cubic-bezier(0.19, 1, 0.22, 1)`;
        this.$refs.wheel.style.webkitTransform = `rotate3d(1, 0, 0, ${updateDeg}deg)`;
      } else {
        this.$refs.wheel.style.webkitTransition = "";
        this.$refs.wheel.style.webkitTransform = `rotate3d(1, 0, 0, ${updateDeg}deg)`;
      }
    },
    setListTransform(translateY = 0, marginTop = 0, type, time = 1000) {
      if (type === "end") {
        this.$refs.list.style.webkitTransition = `transform ${time}ms cubic-bezier(0.19, 1, 0.22, 1)`;
        this.$refs.list.style.webkitTransform = `translateY(${translateY -
          this.spin.branch * 34}px)`;
        this.$refs.list.style.marginTop = `${-marginTop}px`;
        this.$refs.list.setAttribute("scroll", translateY);
      } else {
        this.$refs.list.style.webkitTransition = "";
        this.$refs.list.style.webkitTransform = `translateY(${translateY -
          this.spin.branch * 34}px)`;
        this.$refs.list.style.marginTop = `${-marginTop}px`;
        this.$refs.list.setAttribute("scroll", translateY);
      }
    },
    itemTouchStart(evt) {
      let finger = evt.changedTouches[0];
      this.finger.startY = finger.pageY;
      this.finger.startTime = evt.timestamp || Date.now();
      this.finger.transformY = this.$refs.list.getAttribute("scroll");
      evt.preventDefault();
    },
    itemTouchMove(evt) {
      let finger = evt.changedTouches[0];
      this.finger.lastY = finger.pageY;
      this.finger.lastTime = evt.timestamp || Date.now();
      /* 设置css */
      let move = this.finger.lastY - this.finger.startY;
      this.setStyle(move);
      evt.preventDefault();
    },
    itemTouchEnd(evt) {
      let finger = evt.changedTouches[0];
      this.finger.lastY = finger.pageY;
      this.finger.lastTime = evt.timestamp || Date.now();
      let move = this.finger.lastY - this.finger.startY;
      /* 计算速度 */
      /* 速度计算说明
       * 当时间小于300毫秒 最后的移动距离等于 move + 减速运动距离
       * */
      let time = this.finger.lastTime - this.finger.startTime;
      let v = move / time;
      /* 减速加速度a */
      let a = 1.8;
      /* 设置css */
      if (time <= 300) {
        move = v * a * time;
        time = 1000 + time * a;
        this.setStyle(move, "end", time);
      } else {
        this.setStyle(move, "end");
      }
    },
    setStyle(move, type, time) {
      const singleHeight = 34;
      const deg = 20;
      const singleDeg = deg / singleHeight;
      let currentListMove = this.finger.transformY || 0;
      let updateMove = move + Number(currentListMove);
      /* 根据滚轮类型 line or cycle 判断 updateMove最大距离 */
      if (this.type === "line") {
        if (updateMove > 0) {
          updateMove = 0;
        }
        if (updateMove < -(this.listData.length - 1) * singleHeight) {
          updateMove = -(this.listData.length - 1) * singleHeight;
        }
      }
      let updateDeg = -updateMove * singleDeg;
      let spinAim = Math.round(updateDeg / 20);
      let margin = Math.round(updateMove / singleHeight) * singleHeight; // 如果不这么写 会导致没有滚动效果
      /* 计算touchEnd移动的整数距离 */
      let endMove = margin;
      let endDeg = Math.round(updateDeg / deg) * deg;
      if (type === "end") {
        this.setListTransform(endMove, margin, type, time);
        this.setWheelDeg(endDeg, type, time);
        /* 设置$emit 延迟 */
        setTimeout(() => this.getPickValue(endMove), 500);
      } else {
        this.setListTransform(updateMove, margin);
        this.setWheelDeg(updateDeg);
      }
      this.updateSpin(spinAim);
    },
    /* 更新spin */
    updateSpin(spinAim) {
      this.spin.start = this.spin.branch * -1 + spinAim;
      this.spin.end = this.spin.start + this.spin.branch * 2;
    },
    /* 获取spin 数据 */
    getSpinData(index) {
      index = index % this.listData.length;
      return this.listData[index >= 0 ? index : index + this.listData.length];
    },
    /* 获取选中值 */
    getPickValue(move) {
      let index = Math.abs(move / 34);
      let pickValue = this.getSpinData(index);
      this.$emit("input", pickValue);
    }
  }
};
</script>

<style scoped>
@import url('../css/picker-ios.css');
</style>
