<template>
<p-container @hide="containerHide" v-model="pickerShow">
  <btn-group @click="containerHide" :confirmText="confirmText" :cancelText="cancelText" :confirmColor="confirmColor" :cancelColor="cancelColor" :bottomColor="bottomColor"></btn-group>
  <div class="row" v-if="pickerShow">
    <div class="col" v-for="(localItem, idx) in localList" :key="idx">
      <w-item :listData="localItem" v-model="localValue[idx]"></w-item>
    </div>
  </div>
</p-container>
</template>

<script>
import pContainer from './Container.vue'
import btnGroup from './Toolbar.vue'
import wItem from './WheelItem.vue'
export default {
  name: 'wheel-picker',
  props: {
    value: {
      type: null,
      default: false
    },
    listValue: {
      type: null,
      default: false
    },
    listData: {
      type: Array,
      required: true
    },
    // 当rowObject 为true, rowKey不能为空
    rowKeys: {
      type: Array,
      default: null
    },
    // 有多少列,最多3列表
    colLen: {
      type: Number,
      default: 1
    },
    // 按钮配置
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
  data () {
    return {
      localList: [],
      localValue: [],
      pickerShow: false
    }
  },
  beforeMount () {
    if (this.colLen > 1 && this.colLen !== this.listData.length) {
      console.error('length of colLen is not the same of length of listData!!!')
    } else if (this.rowKeys && this.rowKeys.length === 0) {
      console.error('rowObject is true, rowKey must a string value!!!')
    } else {
      if (this.listValue) {
        if (typeof this.listValue === 'string') {
          this.localValue = [this.listValue]
        }
        if (typeof this.listValue === 'object') {
          this.localValue = this.listValue
        }
      } else {
        if (this.colLen === 1) this.localValue = [this.rowKeys ? this.listData[0][this.rowKeys[0]] : this.listData[0]]
        else {
          this.localValue = []
          for(let i = 0; i < this.colLen; i++) {
            const val = this.rowKeys ? this.listData[i][0][this.rowKeys[i]] : this.listData[i][0]
            this.localValue.push(val)
          }
        }
      }
      if (this.value) this.pickerShow = this.value
      if (this.pickerShow) this.initData(this.listData)
    }
  },
  watch: {
    value (newVal) {
      this.pickerShow = newVal
      if (newVal) this.initData(this.listData)
    }
  },
  components: {
    pContainer,
    wItem,
    btnGroup
  },
  methods: {
    initData (newVal) {
      try {
        this.localList = []
        if (this.colLen === 1) {
          if (this.rowKeys) {
            const arr = newVal.map(itm => itm[this.rowKeys[0]])
            this.localList = [arr]
            // this.listData.map(itm => {
            //   this.localList.push(itm[this.rowKeys[0]])
            // })
          } else {
            this.localList = [newVal]
          }
        } else {
          for (let i = 0; i < this.colLen; i++) {
            let item = newVal[i]
            if (this.rowKeys) {
              item = []
              newVal[i].map(itm => {
                item.push(itm[this.rowKeys[i]])
              })
            }
            this.localList.push(item)
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    getRowValue (item, idx) {
      return this.rowObject ? item[this.rowKeys[idx]] : item
    },
    containerHide (type) {
      this.pickerShow = false
      this.$emit('input', this.pickerShow)
      if (type && type === 'confirm') this.$emit('change', this.localValue)
    }
  }
}
</script>
