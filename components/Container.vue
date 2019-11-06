<template>
<div class="wheel-picker-container" v-if="containerShow">
  <div class="mask"></div>
  <div class="box" @click="clickMask">
    <transition name="picker-modal">
      <div class="bottom-wrap" v-if="modalShow">
        <slot></slot>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalShow: false,
      containerShow: false,
      toModal: null,
      toContainerHide: null
    }
  },
  beforeMount () {
    const me = this
    this.clearTo()
    this.containerShow = this.value
    if (this.containerShow) {
      this.toModal = setTimeout(function () {
        me.modalShow = true
      }, 50)
    }
  },
  watch: {
    value (newVal) {
      this.clearTo()
      const me = this
      if (newVal) {
        this.containerShow = newVal
        this.toModal = setTimeout(function () {
          me.modalShow = true
        }, 50)
      } else {
        me.modalShow = false
        me.toContainerHide = setTimeout(function () {
          me.containerShow = false
        }, 500)
      }
    }
  },
  beforeDestroy () {
    this.clearTo()
  },
  methods: {
    clickMask () {
      console.log('click mask')
      this.$emit('hide')
    },
    clearTo () {
      if (this.toModal) clearTimeout(this.toModal)
      if (this.toContainerHide) clearTimeout(this.toContainerHide)
    }
  }
}
</script>


<style scoped>
@import url('../css/common.css');
</style>
