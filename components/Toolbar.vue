<template>
<div class="row picker-toolbar align-center" :style="{ borderBottomColor: bottomColor }">
  <div class="col">
    <div class="btn cancel" @click="btnHandle($event, 'cancel')" :style="{ color: cancelColor }">{{cancelText}}</div>
  </div>
  <div class="col btn confirm" @click="btnHandle($event, 'confirm')" :style="{ color: confirmColor, borderColor: confirmColor }">{{confirmText}}</div>
</div>
</template>

<script>
export default {
  props: {
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmColor: {
      type: String,
      default: '#3db0fc'
    },
    cancelColor: {
      type: String,
      default: '#888'
    },
    bottomColor: {
      type: String,
      default: '#ddd'
    }
  },
  beforeMount () {
    this.initConfirmBtnStyle()
  },
  methods: {
    btnHandle (ev, type) {
      ev.stopPropagation()
      this.$emit('click', type)
    },
    initConfirmBtnStyle () {
      const activeDOM = document.getElementById('pickerBtnActive')
      if (activeDOM) activeDOM.remove()
      const style = document.createElement('style')
      style.id = 'pickerBtnActive'
      const css = '.picker-toolbar .btn.confirm:active { background: '+this.confirmColor+' !important; }'
      
      document.body.appendChild(style)
      style.type = 'text/css'
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }
  }
}
</script>

